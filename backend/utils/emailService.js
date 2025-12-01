import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendEmail = async (to, invoice, pdfBuffer) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `Glass Invoice ${invoice.invoiceNumber} - Glass Pro`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .invoice-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🪟 Glass Pro</h1>
            <p>Professional Glass Invoice</p>
          </div>
          <div class="content">
            <h2>Dear ${invoice.customerName},</h2>
            <p>Thank you for your business! Your glass invoice is ready.</p>
            
            <div class="invoice-details">
              <h3>Invoice Details:</h3>
              <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
              <p><strong>Date:</strong> ${new Date(invoice.createdAt).toLocaleDateString('en-IN')}</p>
              <p><strong>Total Amount:</strong> ₹${invoice.grandTotal.toFixed(2)}</p>
              <p><strong>Items:</strong> ${invoice.glassSpecs.length} glass specification(s)</p>
            </div>
            
            <p>Please find the detailed invoice attached as PDF.</p>
            <p>If you have any questions, feel free to contact us.</p>
          </div>
          <div class="footer">
            <p>Thank you for choosing Glass Pro!</p>
            <p>&copy; ${new Date().getFullYear()} Glass Pro. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    attachments: [
      {
        filename: `GlassInvoice-${invoice.invoiceNumber}.pdf`,
        content: pdfBuffer
      }
    ]
  };

  return await transporter.sendMail(mailOptions);
};
