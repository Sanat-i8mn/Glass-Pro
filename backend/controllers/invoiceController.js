import Invoice from '../models/Invoice.js';
import Customer from '../models/Customer.js';
import { generateInvoiceNumber } from '../utils/helpers.js';
import { generateGlassPDF } from '../utils/glassPdfGenerator.js';
import { sendWhatsApp } from '../utils/whatsappService.js';
import { sendEmail } from '../utils/emailService.js';

export const createInvoice = async (req, res) => {
  try {
    const invoiceNumber = await generateInvoiceNumber();
    const invoice = await Invoice.create({
      ...req.body,
      invoiceNumber
    });

    // Update customer stats
    if (req.body.customerPhone) {
      await Customer.findOneAndUpdate(
        { phone: req.body.customerPhone },
        {
          $inc: { totalInvoices: 1, totalAmount: invoice.grandTotal },
          $set: { lastInvoiceDate: new Date() }
        },
        { upsert: true, new: true }
      );
    }

    const io = req.app.get('io');
    io.emit('invoice-created', invoice);

    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getInvoices = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search, startDate, endDate, minAmount, maxAmount, city } = req.query;
    
    const query = {};
    
    if (status) query.status = status;
    if (city) query.customerCity = city;
    
    if (search) {
      query.$or = [
        { invoiceNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerPhone: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    if (minAmount || maxAmount) {
      query.grandTotal = {};
      if (minAmount) query.grandTotal.$gte = Number(minAmount);
      if (maxAmount) query.grandTotal.$lte = Number(maxAmount);
    }

    const invoices = await Invoice.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Invoice.countDocuments(query);

    res.json({
      invoices,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json({ message: 'Invoice deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const downloadInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const pdfBuffer = await generateGlassPDF(invoice);
    
    // Track download
    await Invoice.findByIdAndUpdate(invoice._id, {
      $addToSet: { sharedVia: 'download' }
    });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const shareInvoice = async (req, res) => {
  try {
    const { method, recipient } = req.body;
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const pdfBuffer = await generateGlassPDF(invoice);

    if (method === 'whatsapp') {
      const result = await sendWhatsApp(recipient || invoice.customerPhone, invoice, pdfBuffer);
      await Invoice.findByIdAndUpdate(invoice._id, {
        $addToSet: { sharedVia: 'whatsapp' }
      });
      res.json(result);
    } else if (method === 'email') {
      await sendEmail(recipient || invoice.customerEmail, invoice, pdfBuffer);
      await Invoice.findByIdAndUpdate(invoice._id, {
        $addToSet: { sharedVia: 'email' }
      });
      res.json({ message: 'Email sent successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
