import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  gstNumber: { type: String },
  
  // Stats
  totalInvoices: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  lastInvoiceDate: { type: Date },
  
  // Metadata
  notes: { type: String },
  tags: [String]
}, { timestamps: true });

customerSchema.index({ name: 'text', phone: 'text', email: 'text', city: 'text' });

export default mongoose.model('Customer', customerSchema);
