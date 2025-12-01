
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InvoiceForm, { InvoiceFormData } from '@/components/InvoiceForm';
import InvoicePreview from '@/components/InvoicePreview';
import { calculateMultipleGlass, InvoiceCalculation } from '@/utils/calculationUtils';
import { useToast } from '@/hooks/use-toast';
import CompanyLogo from '@/components/CompanyLogo';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import { History } from 'lucide-react';

const Index = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceFormData | null>(null);
  const [calculation, setCalculation] = useState<InvoiceCalculation | null>(null);
  const [savedInvoiceId, setSavedInvoiceId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFormSubmit = async (formData: InvoiceFormData) => {
    try {
      const result = calculateMultipleGlass(formData.glassSpecsList);
      setCalculation(result);
      setInvoiceData(formData);
      
      const invoicePayload = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail || undefined,
        customerAddress: formData.customerAddress || undefined,
        companyName: formData.companyName,
        glassSpecs: formData.glassSpecsList.map((spec, idx) => {
          const calc = calculateMultipleGlass([spec]);
          return {
            glassType: spec.glassType,
            width: spec.width,
            height: spec.height,
            quantity: spec.quantity,
            pricePerSqFt: spec.ratePerSqm,
            area: calc.totalArea,
            total: calc.basicAmount
          };
        }),
        subtotal: result.subtotal,
        totalTax: result.taxAmount,
        grandTotal: result.totalAmount
      };

      const savedInvoice = await fetch('http://localhost:5000/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoicePayload)
      }).then(res => res.json());

      setSavedInvoiceId(savedInvoice._id);

      toast({
        title: "Invoice Generated & Saved!",
        description: `Invoice ${savedInvoice.invoiceNumber} saved successfully.`,
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate invoice.",
      });
    }
  };

  const handleBack = () => {
    setInvoiceData(null);
    setCalculation(null);
    setSavedInvoiceId(null);
  };

  return (
    <div className="min-h-screen bg-secondary">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <CompanyLogo companyName="Glass Pro" />
            <h1 className="text-2xl font-bold text-primary hidden sm:block">
              Glass Invoice Generator
            </h1>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button variant="outline" onClick={() => navigate('/history')}>
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
              <div className="text-right hidden md:block">
                <p className="text-sm text-gray-500 dark:text-gray-400">Need help?</p>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">support@glasspro.com</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {invoiceData && calculation ? (
          <InvoicePreview 
            invoiceData={invoiceData} 
            calculation={calculation} 
            onBack={handleBack}
            savedInvoiceId={savedInvoiceId || undefined}
          />
        ) : (
          <div>
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Glass Proforma Invoice Generator</h1>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Generate professional proforma invoices for your glass products. Simply fill out the form with your customer and glass specifications.
              </p>
            </div>
            <InvoiceForm onSubmit={handleFormSubmit} />
          </div>
        )}
      </main>

      <footer className="bg-white dark:bg-black py-6 border-t dark:border-zinc-800 mt-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>&copy; {new Date().getFullYear()} Glass Pro Invoice Generator. All rights reserved.</p>
            <p className="mt-1">A professional tool for glass businesses</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
