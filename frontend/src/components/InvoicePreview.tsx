
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { generatePDF, printInvoice } from '@/utils/pdfGenerator';
import { FileText, Printer, Save, Share2, MessageCircle, Mail } from 'lucide-react';
import { InvoiceFormData } from './InvoiceForm';
import { InvoiceCalculation, formatCurrency, formatNumber, calculateInvoice } from '@/utils/calculationUtils';
import CompanyLogo from './CompanyLogo';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import invoiceService from '@/services/invoiceService';

interface InvoicePreviewProps {
  invoiceData: InvoiceFormData;
  calculation: InvoiceCalculation;
  onBack: () => void;
  savedInvoiceId?: string;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoiceData, calculation, onBack, savedInvoiceId: propSavedInvoiceId }) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [savedInvoiceId, setSavedInvoiceId] = useState<string | null>(propSavedInvoiceId || null);
  const [sharing, setSharing] = useState(false);

  const handleDownloadPDF = () => {
    generatePDF('invoice-preview', `Invoice_${invoiceData.invoiceNumber}`);
  };

  const handleSaveInvoice = async () => {
    setSaving(true);
    try {
      const invoicePayload = {
        customerName: invoiceData.customerName,
        customerPhone: invoiceData.customerPhone,
        customerEmail: invoiceData.customerEmail,
        customerAddress: invoiceData.customerAddress,
        companyName: invoiceData.companyName,
        companyPhone: invoiceData.companyPhone,
        companyEmail: invoiceData.companyEmail,
        companyAddress: invoiceData.companyAddress,
        companyGST: invoiceData.companyGST,
        glassSpecs: invoiceData.glassSpecsList.map(spec => {
          const calc = calculateInvoice(spec);
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
        subtotal: calculation.subtotal,
        cgst: 0,
        sgst: 0,
        igst: 0,
        totalTax: calculation.taxAmount,
        grandTotal: calculation.totalAmount,
        notes: 'Glass invoice generated'
      };

      const result = await invoiceService.createInvoice(invoicePayload);
      setSavedInvoiceId(result._id);
      
      toast({
        title: "Invoice Saved!",
        description: `Invoice ${result.invoiceNumber} saved successfully.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save invoice.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleShareWhatsApp = () => {
    const phone = invoiceData.customerPhone.replace(/[^0-9]/g, '');
    const phoneWithCode = phone.startsWith('91') ? phone : `91${phone}`;
    const message = `Glass Invoice\n\nInvoice: ${invoiceData.invoiceNumber}\nCustomer: ${invoiceData.customerName}\nAmount: ₹${calculation.totalAmount.toFixed(2)}\n\nThank you!`;
    const url = `https://wa.me/${phoneWithCode}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    toast({ title: "WhatsApp Opened!", description: "Share your invoice." });
  };

  const handleShareEmail = () => {
    if (!invoiceData.customerEmail) {
      toast({ variant: "destructive", title: "No Email", description: "Customer email is required." });
      return;
    }
    const subject = `Glass Invoice ${invoiceData.invoiceNumber}`;
    const body = `Dear ${invoiceData.customerName},\n\nYour glass invoice is ready.\n\nInvoice Number: ${invoiceData.invoiceNumber}\nTotal Amount: ₹${calculation.totalAmount.toFixed(2)}\n\nThank you for your business!\n\nRegards,\n${invoiceData.companyName}`;
    const mailtoLink = `mailto:${invoiceData.customerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
    toast({ title: "Email Client Opened!", description: "Send the invoice via email." });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          Back to Form
        </Button>
        <div className="flex flex-wrap gap-2">

          <Button variant="outline" onClick={handleShareWhatsApp}>
            <MessageCircle className="w-4 h-4 mr-2" />
            WhatsApp
          </Button>
          <Button variant="outline" onClick={handleShareEmail}>
            <Mail className="w-4 h-4 mr-2" />
            Email
          </Button>
          <Button variant="outline" onClick={printInvoice}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleDownloadPDF}>
            <FileText className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <Card className="p-6 bg-white shadow-lg" id="invoice-preview">
        {/* Header */}
        <div className="border-b-2 border-gray-300 pb-3 mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-bold text-blue-600">{invoiceData.companyName}</h1>
              <p className="text-xs text-gray-600 mt-1 max-w-md">{invoiceData.companyAddress}</p>
              <p className="text-xs text-gray-600">Phone: {invoiceData.companyPhone} | Email: {invoiceData.companyEmail}</p>
              <p className="text-xs text-gray-600">GST: {invoiceData.companyGST}</p>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-bold text-blue-600">PROFORMA INVOICE</h2>
              <p className="text-xs text-gray-700 mt-1">Invoice #: <span className="font-semibold">{invoiceData.invoiceNumber}</span></p>
              <p className="text-xs text-gray-700">Date: {new Date(invoiceData.invoiceDate).toLocaleDateString('en-IN')}</p>
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className="mb-4">
          <h3 className="text-xs font-bold text-gray-700 mb-1">Bill To:</h3>
          <p className="text-sm font-semibold">{invoiceData.customerName}</p>
          <p className="text-xs text-gray-600">{invoiceData.customerAddress}</p>
          {invoiceData.customerPhone && <p className="text-xs text-gray-600">Phone: {invoiceData.customerPhone}</p>}
          {invoiceData.customerEmail && <p className="text-xs text-gray-600">Email: {invoiceData.customerEmail}</p>}
        </div>

        {/* Invoice Table */}
        <div className="mb-4">
          <div className="overflow-x-auto">
            <table className="min-w-full border-2 border-gray-400">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-1 px-2 border border-gray-400 text-left text-xs font-bold">Item</th>
                  <th className="py-1 px-2 border border-gray-400 text-right text-xs font-bold">Quantity</th>
                  <th className="py-1 px-2 border border-gray-400 text-right text-xs font-bold">Rate (₹)</th>
                  <th className="py-1 px-2 border border-gray-400 text-right text-xs font-bold">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.glassSpecsList.map((spec, index) => {
                  const itemCalc = calculateInvoice(spec);
                  return (
                    <React.Fragment key={index}>
                      <tr>
                        <td className="py-1 px-2 border border-gray-400 text-xs">
                          {spec.glassType} Glass ({spec.width} × {spec.height} mm)
                        </td>
                        <td className="py-1 px-2 border border-gray-400 text-right text-xs">{formatNumber(itemCalc.totalArea)} sqm</td>
                        <td className="py-1 px-2 border border-gray-400 text-right text-xs">{formatNumber(spec.ratePerSqm)}</td>
                        <td className="py-1 px-2 border border-gray-400 text-right text-xs font-semibold">{formatNumber(itemCalc.basicAmount)}</td>
                      </tr>
                      {spec.holes > 0 && (
                        <tr>
                          <td className="py-1 px-2 border border-gray-400 text-xs">Holes</td>
                          <td className="py-1 px-2 border border-gray-400 text-right text-xs">{spec.holes}</td>
                          <td className="py-1 px-2 border border-gray-400 text-right text-xs">{formatNumber(spec.ratePerHole)}</td>
                          <td className="py-1 px-2 border border-gray-400 text-right text-xs">{formatNumber(itemCalc.holesAmount)}</td>
                        </tr>
                      )}
                      {spec.cutouts > 0 && (
                        <tr>
                          <td className="py-1 px-2 border border-gray-400 text-xs">Cutouts</td>
                          <td className="py-1 px-2 border border-gray-400 text-right text-xs">{spec.cutouts}</td>
                          <td className="py-1 px-2 border border-gray-400 text-right text-xs">{formatNumber(spec.ratePerCutout)}</td>
                          <td className="py-1 px-2 border border-gray-400 text-right text-xs">{formatNumber(itemCalc.cutoutsAmount)}</td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
                <tr className="bg-gray-100">
                  <td className="py-1 px-2 border border-gray-400 text-xs font-semibold" colSpan={3}>Subtotal</td>
                  <td className="py-1 px-2 border border-gray-400 text-right text-xs font-semibold">Rs. {formatNumber(calculation.subtotal)}</td>
                </tr>
                <tr>
                  <td className="py-1 px-2 border border-gray-400 text-xs" colSpan={3}>Insurance Charges</td>
                  <td className="py-1 px-2 border border-gray-400 text-right text-xs">0.9</td>
                </tr>
                <tr className="bg-gray-200">
                  <td className="py-1 px-2 border border-gray-400 text-xs font-bold" colSpan={3}>Grand SubTotal</td>
                  <td className="py-1 px-2 border border-gray-400 text-right text-xs font-bold">{formatNumber(calculation.subtotal)}</td>
                </tr>
                <tr>
                  <td className="py-1 px-2 border border-gray-400 text-xs" colSpan={3}>SGST (9 %)</td>
                  <td className="py-1 px-2 border border-gray-400 text-right text-xs">{formatNumber(calculation.taxAmount / 2)}</td>
                </tr>
                <tr>
                  <td className="py-1 px-2 border border-gray-400 text-xs" colSpan={3}>CGST (9 %)</td>
                  <td className="py-1 px-2 border border-gray-400 text-right text-xs">{formatNumber(calculation.taxAmount / 2)}</td>
                </tr>
                <tr>
                  <td className="py-1 px-2 border border-gray-400 text-xs" colSpan={3}>RoundOff</td>
                  <td className="py-1 px-2 border border-gray-400 text-right text-xs">0.15</td>
                </tr>
                <tr className="bg-blue-600 text-white">
                  <td className="py-2 px-2 border border-gray-400 text-sm font-bold" colSpan={3}>Grand Total</td>
                  <td className="py-2 px-2 border border-gray-400 text-right text-sm font-bold">{formatNumber(calculation.totalAmount)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Terms & Bank Details Section */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Terms */}
          <div>
            <h3 className="text-xs font-bold mb-1">Terms & Conditions :</h3>
            <div className="text-xs text-gray-700 space-y-0.5">
              <p>PLEASE ISSUE ALL CHEQUES IN FAVOUR OF <span className="font-bold">SHRI PARASNATH GLASS TUFF PVT LTD</span>.</p>
              <p>* No CASH WILL BE ENTERTAINED;</p>
              <p>* This PI is Valid for 7 days & order will be processed after 75% payment in advance.</p>
              <p>* Sizes once finalized will not be changed after approval.</p>
              <p>* Prices taken on Digital media means an approved against PI</p>
              <p>* Delivery will be done as per the availability of the material in stocks.</p>
              <p>* We are taking every care being taken in dispatch of goods. However, we shall not be responsible for any loss / damage in transit.</p>
            </div>
            <div className="mt-3 flex gap-2 items-center">
              <div className="border border-gray-400 p-2 flex-1">
                <h4 className="text-xs font-bold mb-1">Bank Details</h4>
                <table className="w-full text-xs">
                  <tbody>
                    <tr><td className="py-0.5 font-semibold w-28">Bank Name</td><td>State Bank Of India</td></tr>
                    <tr><td className="py-0.5 font-semibold">Account No</td><td>4158 0745 106</td></tr>
                    <tr><td className="py-0.5 font-semibold">Branch</td><td>SME Branch Agarwal Niwas Bhagwanganj Sagar</td></tr>
                    <tr><td className="py-0.5 font-semibold">IFS Code</td><td>SBIN0012284 <span className="ml-2">Branch Code</span> 12284</td></tr>
                    <tr><td className="py-0.5 font-semibold">Company Name</td><td>SHRI PARASNATH GLASS TUFF PRIVATE LIMITED</td></tr>
                    <tr><td className="py-0.5 font-semibold">MICR Code</td><td>470002010 <span className="ml-2">UPI ID :</span> 9425170693@sbi</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="border border-gray-400 flex items-start justify-center pt-2" style={{width: '140px', height: '140px'}}>
                <img src="/Qr Code.PNG" alt="QR Code" className="w-32 h-32 object-contain" onError={(e) => {
                  e.currentTarget.outerHTML = '<div class="w-32 h-32 border border-gray-300 flex items-center justify-center text-xs text-gray-500">QR CODE</div>';
                }} />
              </div>
            </div>
          </div>
          {/* Signature */}
          <div className="flex flex-col items-center justify-end">
            <p className="text-xs font-bold text-center mb-2">FOR SHRI PARASNATH GLASS TUFF PRIVATE LIMITED</p>
            <div className="text-center mt-16">
              <div className="border-t-2 border-gray-600 w-40 mx-auto"></div>
              <p className="text-xs mt-1">(Authorised Signatory)</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InvoicePreview;
