import Invoice from '../models/Invoice.js';

export const generateInvoiceNumber = async () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  
  const count = await Invoice.countDocuments();
  const sequence = (count + 1).toString().padStart(4, '0');
  
  return `GP-${year}${month}-${sequence}`;
};

export const calculateTax = (amount, taxRate = 18) => {
  return (amount * taxRate) / 100;
};

export const calculateTotal = (items) => {
  return items.reduce((sum, item) => {
    const itemTotal = item.quantity * item.price;
    const itemTax = calculateTax(itemTotal, item.tax || 0);
    return sum + itemTotal + itemTax;
  }, 0);
};
