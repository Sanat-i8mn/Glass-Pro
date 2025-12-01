import PDFDocument from 'pdfkit';

export const generatePDF = async (invoice, user) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Header
      doc.fontSize(24).text(user.businessName || 'Invoice', { align: 'center' });
      doc.moveDown();
      
      // Invoice Details
      doc.fontSize(12);
      doc.text(`Invoice Number: ${invoice.invoiceNumber}`, { align: 'right' });
      doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, { align: 'right' });
      doc.moveDown();

      // Customer Details
      doc.fontSize(14).text('Bill To:');
      doc.fontSize(10);
      doc.text(invoice.customerId.name);
      doc.text(invoice.customerId.phone);
      if (invoice.customerId.address) doc.text(invoice.customerId.address);
      doc.moveDown();

      // Items Table
      const tableTop = doc.y;
      doc.fontSize(10).text('Description', 50, tableTop);
      doc.text('Qty', 250, tableTop);
      doc.text('Price', 320, tableTop);
      doc.text('Tax', 390, tableTop);
      doc.text('Total', 460, tableTop, { align: 'right' });
      
      doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

      let yPosition = tableTop + 25;
      invoice.items.forEach(item => {
        doc.text(item.description, 50, yPosition, { width: 180 });
        doc.text(item.quantity, 250, yPosition);
        doc.text(`₹${item.price}`, 320, yPosition);
        doc.text(`${item.tax}%`, 390, yPosition);
        doc.text(`₹${item.total}`, 460, yPosition, { align: 'right' });
        yPosition += 25;
      });

      // Totals
      doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke();
      yPosition += 10;
      
      doc.fontSize(12);
      doc.text(`Subtotal: ₹${invoice.subtotal}`, 400, yPosition, { align: 'right' });
      yPosition += 20;
      doc.text(`Tax: ₹${invoice.taxAmount}`, 400, yPosition, { align: 'right' });
      yPosition += 20;
      doc.fontSize(14).text(`Total: ₹${invoice.total}`, 400, yPosition, { align: 'right' });

      // Footer
      if (invoice.notes) {
        doc.fontSize(10).text(`Notes: ${invoice.notes}`, 50, yPosition + 40);
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
