import PDFDocument from 'pdfkit';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const generateGlassPDF = async (invoice) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 35, size: 'A4' });
      const chunks = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Header
      doc.fontSize(18).fillColor('#2563eb').font('Helvetica-Bold').text(invoice.companyName || 'Glass Pro', { align: 'center' });
      doc.moveDown(0.2);
      
      if (invoice.companyAddress) {
        doc.fontSize(7).fillColor('#333').font('Helvetica').text(invoice.companyAddress, { align: 'center', width: 520 });
      }
      doc.fontSize(7);
      if (invoice.companyPhone && invoice.companyEmail) {
        doc.text(`Phone: ${invoice.companyPhone} | Email: ${invoice.companyEmail}`, { align: 'center' });
      }
      if (invoice.companyGST) {
        doc.fontSize(7).font('Helvetica-Bold').text(`GSTIN: ${invoice.companyGST}`, { align: 'center' });
      }
      
      doc.moveDown(0.3);
      doc.moveTo(35, doc.y).lineTo(560, doc.y).lineWidth(2).stroke('#2563eb');
      doc.moveDown(0.2);

      doc.fontSize(12).fillColor('#000').font('Helvetica-Bold').text('PROFORMA INVOICE', { align: 'center' });
      doc.moveDown(0.4);

      const detailsY = doc.y;
      doc.fontSize(8).font('Helvetica');
      doc.text(`Invoice No: ${invoice.invoiceNumber}`, 35, detailsY);
      const invoiceDate = new Date(invoice.createdAt);
      doc.text(`Date: ${invoiceDate.toLocaleDateString('en-IN')}`, 460, detailsY, { align: 'right' });
      doc.text(`Time: ${invoiceDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`, 460, detailsY + 10, { align: 'right' });
      doc.moveDown(0.7);

      const billY = doc.y;
      doc.rect(35, billY, 255, 50).fillAndStroke('#eff6ff', '#2563eb');
      doc.fontSize(8).fillColor('#2563eb').font('Helvetica-Bold').text('BILL TO:', 40, billY + 4);
      doc.fontSize(7).fillColor('#000').font('Helvetica-Bold');
      doc.text(invoice.customerName, 40, billY + 14, { width: 245 });
      doc.font('Helvetica').fontSize(6);
      if (invoice.customerAddress) doc.text(invoice.customerAddress, 40, billY + 23, { width: 245 });
      if (invoice.customerPhone) doc.text(`Ph: ${invoice.customerPhone}`, 40, billY + 40);
      
      doc.rect(305, billY, 255, 50).fillAndStroke('#f0fdf4', '#16a34a');
      doc.fontSize(8).fillColor('#16a34a').font('Helvetica-Bold').text('DELIVERY TO:', 310, billY + 4);
      doc.fontSize(7).fillColor('#000').font('Helvetica-Bold');
      doc.text(invoice.customerName, 310, billY + 14, { width: 245 });
      doc.font('Helvetica').fontSize(6);
      if (invoice.customerAddress) doc.text(invoice.customerAddress, 310, billY + 23, { width: 245 });
      
      doc.y = billY + 55;
      doc.moveDown(0.4);

      const tableTop = doc.y;
      doc.fontSize(7).fillColor('#fff').font('Helvetica-Bold');
      doc.rect(35, tableTop, 525, 16).fill('#2563eb');
      
      doc.fillColor('#fff');
      doc.text('DESCRIPTION', 40, tableTop + 4);
      doc.text('QTY', 350, tableTop + 4, { width: 35, align: 'center' });
      doc.text('RATE (₹)', 405, tableTop + 4, { width: 70, align: 'right' });
      doc.text('AMOUNT (₹)', 490, tableTop + 4, { width: 65, align: 'right' });

      let yPosition = tableTop + 18;
      doc.fillColor('#000').font('Helvetica');

      invoice.glassSpecs.forEach((spec, index) => {
        doc.rect(35, yPosition, 525, 12).fill('#e5e7eb');
        doc.fontSize(6).font('Helvetica-Bold').fillColor('#000');
        doc.text(`Item #${index + 1}: ${spec.glassType} Glass`, 40, yPosition + 3);
        yPosition += 12;
        
        doc.rect(35, yPosition, 525, 16).fill('#ffffff');
        doc.fontSize(6).font('Helvetica');
        doc.text(`${spec.glassType} - ${spec.width}×${spec.height}mm (${spec.area.toFixed(2)} sqm)`, 40, yPosition + 4, { width: 300 });
        doc.fontSize(6).font('Helvetica-Bold');
        doc.text(spec.quantity.toString(), 350, yPosition + 4, { width: 35, align: 'center' });
        doc.font('Helvetica');
        doc.text(`${spec.pricePerSqFt.toFixed(2)}`, 405, yPosition + 4, { width: 70, align: 'right' });
        doc.font('Helvetica-Bold');
        doc.text(`${spec.total.toFixed(2)}`, 490, yPosition + 4, { width: 65, align: 'right' });
        
        yPosition += 16;
      });

      yPosition += 2;
      const totalsX = 400;
      doc.fontSize(7).font('Helvetica').fillColor('#000');
      
      doc.rect(35, yPosition, 525, 12).fill('#f3f4f6');
      doc.font('Helvetica-Bold').text('Subtotal:', totalsX, yPosition + 3);
      doc.text(`${invoice.subtotal.toFixed(2)}`, 490, yPosition + 3, { width: 65, align: 'right' });
      yPosition += 12;

      if (invoice.totalTax > 0) {
        doc.rect(35, yPosition, 525, 10).fill('#ffffff');
        doc.font('Helvetica').text('Tax:', totalsX, yPosition + 2);
        doc.text(`${invoice.totalTax.toFixed(2)}`, 490, yPosition + 2, { width: 65, align: 'right' });
        yPosition += 10;
      }

      doc.rect(35, yPosition, 525, 16).fill('#2563eb');
      doc.fontSize(8).fillColor('#fff').font('Helvetica-Bold');
      doc.text('GRAND TOTAL:', totalsX, yPosition + 4);
      doc.fontSize(9).text(`₹${invoice.grandTotal.toFixed(2)}`, 490, yPosition + 3, { width: 65, align: 'right' });
      yPosition += 20;

      // Bank Details Table (bb.png style)
      const bankStartY = yPosition;
      const bankTableWidth = 350;
      const qrStartX = 400;
      
      // Bank Details Header
      doc.rect(35, bankStartY, bankTableWidth, 15).stroke('#000');
      doc.fontSize(7).fillColor('#000').font('Helvetica-Bold');
      doc.text('Bank Details', 40, bankStartY + 4);
      
      // Table rows
      let bankY = bankStartY + 15;
      const rowHeight = 12;
      
      // Row 1: Bank Name
      doc.rect(35, bankY, 90, rowHeight).stroke('#000');
      doc.rect(125, bankY, bankTableWidth - 90, rowHeight).stroke('#000');
      doc.fontSize(6).font('Helvetica');
      doc.text('Bank Name', 40, bankY + 3);
      doc.text('State Bank Of India', 130, bankY + 3);
      bankY += rowHeight;
      
      // Row 2: Account No
      doc.rect(35, bankY, 90, rowHeight).stroke('#000');
      doc.rect(125, bankY, bankTableWidth - 90, rowHeight).stroke('#000');
      doc.text('Account No', 40, bankY + 3);
      doc.text('4158 0745 106', 130, bankY + 3);
      bankY += rowHeight;
      
      // Row 3: Branch
      doc.rect(35, bankY, 90, rowHeight).stroke('#000');
      doc.rect(125, bankY, bankTableWidth - 90, rowHeight).stroke('#000');
      doc.text('Branch', 40, bankY + 3);
      doc.text('SME Branch Agarwal Niwas Bhagwanganj Sagar', 130, bankY + 3);
      bankY += rowHeight;
      
      // Row 4: IFS Code & Branch Code
      doc.rect(35, bankY, 90, rowHeight).stroke('#000');
      doc.rect(125, bankY, 130, rowHeight).stroke('#000');
      doc.rect(255, bankY, 65, rowHeight).stroke('#000');
      doc.rect(320, bankY, 65, rowHeight).stroke('#000');
      doc.text('IFS Code', 40, bankY + 3);
      doc.text('SBIN0012284', 130, bankY + 3);
      doc.text('Branch Code', 260, bankY + 3);
      doc.text('12284', 325, bankY + 3);
      bankY += rowHeight;
      
      // Row 5: Company Name
      doc.rect(35, bankY, 90, rowHeight).stroke('#000');
      doc.rect(125, bankY, bankTableWidth - 90, rowHeight).stroke('#000');
      doc.text('Company Name', 40, bankY + 3);
      doc.text('SHRI PARASNATH GLASS TUFF PRIVATE LIMITED', 130, bankY + 3);
      bankY += rowHeight;
      
      // Row 6: MICR Code & UPI ID
      doc.rect(35, bankY, 90, rowHeight).stroke('#000');
      doc.rect(125, bankY, 130, rowHeight).stroke('#000');
      doc.rect(255, bankY, 65, rowHeight).stroke('#000');
      doc.rect(320, bankY, 65, rowHeight).stroke('#000');
      doc.text('MICR Code', 40, bankY + 3);
      doc.text('470002010', 130, bankY + 3);
      doc.text('UPI ID :', 260, bankY + 3);
      doc.text('9425170693@sbi', 325, bankY + 3);
      
      // QR Code Section (Right side)
      doc.fontSize(6).fillColor('#000').font('Helvetica');
      doc.text('FOR SHRI PARASNATH GLASS TUFF PRIVATE LIMITED', qrStartX, bankStartY + 2, { width: 155, align: 'center' });
      
      const qrPath = path.join(__dirname, '../../frontend/public/qr-code.png');
      if (fs.existsSync(qrPath)) {
        doc.image(qrPath, qrStartX + 30, bankStartY + 15, { width: 95, height: 95 });
      } else {
        doc.rect(qrStartX + 30, bankStartY + 15, 95, 95).stroke('#000');
        doc.fontSize(7).fillColor('#999').text('QR CODE', qrStartX + 50, bankStartY + 60, { width: 55, align: 'center' });
      }
      
      // Signature
      doc.moveTo(qrStartX + 10, bankStartY + 120).lineTo(qrStartX + 150, bankStartY + 120).stroke();
      doc.fontSize(6).fillColor('#000').font('Helvetica').text('(Authorised Signatory)', qrStartX + 10, bankStartY + 123, { align: 'center', width: 140 });

      // Terms & Conditions
      yPosition = bankY + 18;
      doc.fontSize(6).fillColor('#000').font('Helvetica-Bold');
      doc.text('Terms & Conditions:', 35, yPosition);
      doc.font('Helvetica').fontSize(5.5).fillColor('#333');
      doc.text('• This is a proforma invoice and not a tax invoice.', 35, yPosition + 9);
      doc.text('• Payment terms: 50% advance, balance before dispatch.', 35, yPosition + 16);
      doc.text('• Delivery: 7-10 working days after receipt of advance payment.', 35, yPosition + 23);
      doc.text('• Prices are subject to change without prior notice.', 35, yPosition + 30);
      doc.text('• Goods once sold will not be taken back or exchanged.', 35, yPosition + 37);

      doc.fontSize(5.5).fillColor('#999');
      doc.text('Thank you for your business!', 35, yPosition + 50, { align: 'center', width: 525 });
      
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
