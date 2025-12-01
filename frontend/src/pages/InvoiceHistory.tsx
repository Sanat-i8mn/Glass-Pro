import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download, MessageCircle, Mail, Eye } from 'lucide-react';
import invoiceService from '@/services/invoiceService';
import { useToast } from '@/hooks/use-toast';

const InvoiceHistory = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const data = await invoiceService.getInvoices({ limit: 50 });
      setInvoices(data.invoices || []);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to load invoices' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) {
      fetchInvoices();
      return;
    }
    setLoading(true);
    try {
      const data = await invoiceService.searchInvoices(search);
      setInvoices(data.invoices || []);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Search failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id: string) => {
    try {
      const blob = await invoiceService.downloadPDF(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${id}.pdf`;
      a.click();
      toast({ title: 'Downloaded!', description: 'Invoice PDF downloaded successfully' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Download failed' });
    }
  };

  const handleWhatsApp = async (id: string, phone: string) => {
    try {
      const result = await invoiceService.shareWhatsApp(id, phone);
      window.open(result.url, '_blank');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'WhatsApp share failed' });
    }
  };

  return (
    <div className="min-h-screen bg-secondary p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">Invoice History</h1>
          <div className="flex gap-2">
            <Input
              placeholder="Search by invoice number, customer name, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading invoices...</div>
        ) : invoices.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-500 mb-4">No invoices found</p>
            <Button onClick={() => window.location.href = '/'}>Create Your First Invoice</Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <Card key={invoice._id} className="p-4">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-primary">{invoice.invoiceNumber}</h3>
                    <p className="text-sm text-gray-600">Customer: {invoice.customerName}</p>
                    <p className="text-sm text-gray-600">Phone: {invoice.customerPhone}</p>
                    <p className="text-sm text-gray-600">Date: {new Date(invoice.createdAt).toLocaleDateString()}</p>
                    <p className="text-lg font-semibold mt-2">₹{invoice.grandTotal.toFixed(2)}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 items-start">
                    <Button size="sm" variant="outline" onClick={() => handleDownload(invoice._id)}>
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleWhatsApp(invoice._id, invoice.customerPhone)}>
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      invoice.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {invoice.status}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceHistory;
