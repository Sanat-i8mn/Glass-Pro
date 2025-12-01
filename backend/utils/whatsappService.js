export const sendWhatsApp = async (phone, invoice, pdfBuffer) => {
  // Clean phone number
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const phoneWithCode = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
  
  const message = `
🪟 *Glass Pro Invoice*

Dear ${invoice.customerName},

Your glass invoice is ready!

📄 Invoice No: ${invoice.invoiceNumber}
💰 Total Amount: ₹${invoice.grandTotal.toFixed(2)}
📅 Date: ${new Date(invoice.createdAt).toLocaleDateString('en-IN')}

${invoice.glassSpecs.length} glass item(s) included.

Thank you for your business! 🙏

- Glass Pro Team
  `.trim();

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneWithCode}?text=${encodedMessage}`;
  const webUrl = `https://web.whatsapp.com/send?phone=${phoneWithCode}&text=${encodedMessage}`;

  return {
    success: true,
    url: whatsappUrl,
    webUrl,
    message: 'WhatsApp link generated successfully'
  };
};
