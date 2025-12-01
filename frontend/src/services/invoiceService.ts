import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

export interface GlassSpec {
  glassType: string;
  width: number;
  height: number;
  quantity: number;
  pricePerSqFt: number;
  area: number;
  total: number;
}

export interface InvoiceData {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress?: string;
  customerCity?: string;
  customerState?: string;
  customerPincode?: string;
  companyName?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyAddress?: string;
  companyGST?: string;
  glassSpecs: GlassSpec[];
  subtotal: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  totalTax: number;
  grandTotal: number;
  notes?: string;
  terms?: string;
}

export const invoiceService = {
  // Create invoice
  async createInvoice(data: InvoiceData) {
    const response = await api.post('/invoices', data);
    return response.data;
  },

  // Get all invoices
  async getInvoices(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    city?: string;
  }) {
    const response = await api.get('/invoices', { params });
    return response.data;
  },

  // Get single invoice
  async getInvoice(id: string) {
    const response = await api.get(`/invoices/${id}`);
    return response.data;
  },

  // Download PDF
  async downloadPDF(id: string) {
    const response = await api.get(`/invoices/${id}/download`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Share via WhatsApp
  async shareWhatsApp(id: string, phone?: string) {
    const response = await api.post(`/invoices/${id}/share`, {
      method: 'whatsapp',
      recipient: phone
    });
    return response.data;
  },

  // Share via Email
  async shareEmail(id: string, email?: string) {
    const response = await api.post(`/invoices/${id}/share`, {
      method: 'email',
      recipient: email
    });
    return response.data;
  },

  // Search invoices
  async searchInvoices(query: string) {
    const response = await api.get('/invoices', {
      params: { search: query }
    });
    return response.data;
  }
};

export default invoiceService;
