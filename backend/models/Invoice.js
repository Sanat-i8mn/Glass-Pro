import mongoose from 'mongoose';

const glassSpecSchema = new mongoose.Schema({
  glassType: { type: String, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  quantity: { type: Number, required: true },
  pricePerSqFt: { type: Number, required: true },
  area: { type: Number, required: true },
  total: { type: Number, required: true }
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerEmail: String,
  customerAddress: String,
  companyName: { type: String, default: 'Glass Pro' },
  glassSpecs: [glassSpecSchema],
  subtotal: { type: Number, required: true },
  totalTax: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  status: { type: String, default: 'draft' }
}, { timestamps: true, minimize: true });

// Indexes for search
invoiceSchema.index({ invoiceNumber: 'text', customerName: 'text', customerPhone: 'text' });
invoiceSchema.index({ createdAt: -1 });
invoiceSchema.index({ customerCity: 1 });
invoiceSchema.index({ status: 1 });

export default mongoose.model('Invoice', invoiceSchema);
