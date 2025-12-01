export interface User {
  _id: string;
  name: string;
  email: string;
  businessName?: string;
  businessType?: string;
  phone?: string;
  role: 'admin' | 'user';
  token?: string;
}

export interface Customer {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gstNumber?: string;
  businessType?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
  tax: number;
  total: number;
  size?: string;
  color?: string;
  brand?: string;
  expiryDate?: Date;
  petType?: string;
}

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  customerId: Customer;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod?: string;
  template: 'professional' | 'simple' | 'modern';
  businessType?: string;
  notes?: string;
  dueDate?: Date;
  paidDate?: Date;
  createdAt: Date;
}

export interface DashboardStats {
  totalInvoices: number;
  totalCustomers: number;
  monthlyRevenue: number;
  pendingPayments: number;
  recentInvoices: Invoice[];
  monthlyData: Array<{ _id: number; revenue: number; count: number }>;
}
