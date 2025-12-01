
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { GlassSpecifications } from '@/utils/calculationUtils';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';

interface InvoiceFormProps {
  onSubmit: (formData: InvoiceFormData) => void;
}

export interface InvoiceFormData {
  // Customer information
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerEmail: string;
  
  // Invoice information
  invoiceNumber: string;
  invoiceDate: string;
  
  // Company information
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyGST: string;
  
  // Glass specifications - now array
  glassSpecsList: GlassSpecifications[];
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ onSubmit }) => {
  const today = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState<InvoiceFormData>({
    customerName: '',
    customerAddress: '',
    customerPhone: '',
    customerEmail: '',
    
    invoiceNumber: `INV-${Date.now().toString().substring(6)}`,
    invoiceDate: today,
    
    companyName: 'SHREE RAM GLASS (INDORE)',
    companyAddress: 'FIRST FLOOR, PLOT NO.38, MARUTI NAGAR, MHOW G MHOW,INDORE,MADHYA PRADESH, 453441.INDORE, - 453441 STATE : Madhya Pradesh CODE : 23',companyPhone: '9876543210',
    companyEmail: 'info@glassworld.com',
    companyGST: '29ABCDE1234F1Z5',
    
    glassSpecsList: [{
      width: 1000,
      height: 2000,
      quantity: 1,
      glassType: 'Toughened',
      holes: 0,
      cutouts: 0,
      bigCutouts: 0,
      ratePerSqm: 1200,
      ratePerHole: 50,
      ratePerCutout: 150,
      ratePerBigCutout: 300,
      tax: 18,
      freight: 0,
      loadingCharges: 0,
      isJumboSize: false,
      jumboSizePremium: 15
    }]
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleGlassSpecChange = (index: number, field: string, value: string | number) => {
    const updatedSpecs = [...formData.glassSpecsList];
    const numericFields = ['width', 'height', 'quantity', 'holes', 'cutouts', 'bigCutouts', 
                          'ratePerSqm', 'ratePerHole', 'ratePerCutout', 'ratePerBigCutout',
                          'tax', 'freight', 'loadingCharges', 'jumboSizePremium'];
    
    updatedSpecs[index] = {
      ...updatedSpecs[index],
      [field]: numericFields.includes(field) ? parseFloat(value as string) || 0 : value
    };
    
    setFormData({ ...formData, glassSpecsList: updatedSpecs });
  };

  const handleCheckboxChange = (index: number, checked: boolean) => {
    const updatedSpecs = [...formData.glassSpecsList];
    updatedSpecs[index] = { ...updatedSpecs[index], isJumboSize: checked };
    setFormData({ ...formData, glassSpecsList: updatedSpecs });
  };

  const addGlassSpec = () => {
    setFormData({
      ...formData,
      glassSpecsList: [...formData.glassSpecsList, {
        width: 1000,
        height: 2000,
        quantity: 1,
        glassType: 'Toughened',
        holes: 0,
        cutouts: 0,
        bigCutouts: 0,
        ratePerSqm: 1200,
        ratePerHole: 50,
        ratePerCutout: 150,
        ratePerBigCutout: 300,
        tax: 18,
        freight: 0,
        loadingCharges: 0,
        isJumboSize: false,
        jumboSizePremium: 15
      }]
    });
  };

  const removeGlassSpec = (index: number) => {
    if (formData.glassSpecsList.length > 1) {
      const updatedSpecs = formData.glassSpecsList.filter((_, i) => i !== index);
      setFormData({ ...formData, glassSpecsList: updatedSpecs });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-invoice-form">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Information */}
        <Card className="form-section">
          <h2 className="text-xl font-semibold mb-4 text-primary">Customer Information</h2>
          
          <div className="input-group">
            <Label htmlFor="customerName">Customer Name</Label>
            <Input 
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="Enter customer name"
              required
            />
          </div>
          
          <div className="input-group">
            <Label htmlFor="customerAddress">Address</Label>
            <Textarea 
              id="customerAddress"
              name="customerAddress"
              value={formData.customerAddress}
              onChange={handleChange}
              placeholder="Enter customer address"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="input-group">
              <Label htmlFor="customerPhone">Phone</Label>
              <Input 
                id="customerPhone"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>
            
            <div className="input-group">
              <Label htmlFor="customerEmail">Email</Label>
              <Input 
                id="customerEmail"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleChange}
                placeholder="Enter email address"
                type="email"
              />
            </div>
          </div>
        </Card>
        
        {/* Company & Invoice Information */}
        <Card className="form-section">
          <h2 className="text-xl font-semibold mb-4 text-primary">Company Information</h2>
          
          <div className="input-group">
            <Label htmlFor="companyName">Company Name</Label>
            <Input 
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Enter company name"
              required
            />
          </div>
          
          <div className="input-group">
            <Label htmlFor="companyAddress">Company Address</Label>
            <Textarea 
              id="companyAddress"
              name="companyAddress"
              value={formData.companyAddress}
              onChange={handleChange}
              placeholder="Enter company address"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="input-group">
              <Label htmlFor="companyGST">GST Number</Label>
              <Input 
                id="companyGST"
                name="companyGST"
                value={formData.companyGST}
                onChange={handleChange}
                placeholder="Enter GST number"
              />
            </div>
            
            <div className="input-group">
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input 
                id="invoiceNumber"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleChange}
                placeholder="Enter invoice number"
                required
              />
            </div>
          </div>
          
          <div className="input-group">
            <Label htmlFor="invoiceDate">Invoice Date</Label>
            <Input 
              id="invoiceDate"
              name="invoiceDate"
              type="date"
              value={formData.invoiceDate}
              onChange={handleChange}
              required
            />
          </div>
        </Card>
      </div>
      
      {/* Glass Specifications - Multiple Items */}
      {formData.glassSpecsList.map((spec, index) => (
        <Card key={index} className="form-section mt-6 relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-primary">Glass Specifications ({index + 1})</h2>
            {formData.glassSpecsList.length > 1 && (
              <Button 
                type="button" 
                variant="destructive" 
                size="sm"
                onClick={() => removeGlassSpec(index)}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Remove
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="input-group">
              <Label>Glass Type</Label>
              <select 
                className="border rounded-md p-2 w-full"
                value={spec.glassType}
                onChange={(e) => handleGlassSpecChange(index, 'glassType', e.target.value)}
                required
              >
                <option value="Toughened">Toughened Glass</option>
                <option value="Annealed">Annealed Glass</option>
                <option value="Laminated">Laminated Glass</option>
                <option value="DGU">Double Glazed Unit</option>
                <option value="Frosted">Frosted Glass</option>
                <option value="Heat Strengthened">Heat Strengthened Glass</option>
              </select>
            </div>
            
            <div className="input-group">
              <Label>Width (mm)</Label>
              <Input 
                type="number"
                min="0"
                value={spec.width}
                onChange={(e) => handleGlassSpecChange(index, 'width', e.target.value)}
                required
              />
            </div>
            
            <div className="input-group">
              <Label>Height (mm)</Label>
              <Input 
                type="number"
                min="0"
                value={spec.height}
                onChange={(e) => handleGlassSpecChange(index, 'height', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div className="input-group">
              <Label>Quantity</Label>
              <Input 
                type="number"
                min="1"
                value={spec.quantity}
                onChange={(e) => handleGlassSpecChange(index, 'quantity', e.target.value)}
                required
              />
            </div>
            
            <div className="input-group">
              <Label>Number of Holes</Label>
              <Input 
                type="number"
                min="0"
                value={spec.holes}
                onChange={(e) => handleGlassSpecChange(index, 'holes', e.target.value)}
              />
            </div>
            
            <div className="input-group">
              <Label>Cutouts</Label>
              <Input 
                type="number"
                min="0"
                value={spec.cutouts}
                onChange={(e) => handleGlassSpecChange(index, 'cutouts', e.target.value)}
              />
            </div>
            
            <div className="input-group">
              <Label>Big Cutouts</Label>
              <Input 
                type="number"
                min="0"
                value={spec.bigCutouts}
                onChange={(e) => handleGlassSpecChange(index, 'bigCutouts', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="input-group">
              <Label>Rate per sqm (₹)</Label>
              <Input 
                type="number"
                min="0"
                step="0.01"
                value={spec.ratePerSqm}
                onChange={(e) => handleGlassSpecChange(index, 'ratePerSqm', e.target.value)}
                required
              />
            </div>
            
            <div className="input-group">
              <Label>Rate per Hole (₹)</Label>
              <Input 
                type="number"
                min="0"
                step="0.01"
                value={spec.ratePerHole}
                onChange={(e) => handleGlassSpecChange(index, 'ratePerHole', e.target.value)}
              />
            </div>
            
            <div className="input-group">
              <Label>Rate per Cutout (₹)</Label>
              <Input 
                type="number"
                min="0"
                step="0.01"
                value={spec.ratePerCutout}
                onChange={(e) => handleGlassSpecChange(index, 'ratePerCutout', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="input-group">
              <Label>Rate per Big Cutout (₹)</Label>
              <Input 
                type="number"
                min="0"
                step="0.01"
                value={spec.ratePerBigCutout}
                onChange={(e) => handleGlassSpecChange(index, 'ratePerBigCutout', e.target.value)}
              />
            </div>
            
            <div className="input-group">
              <Label>Tax Percentage (%)</Label>
              <Input 
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={spec.tax}
                onChange={(e) => handleGlassSpecChange(index, 'tax', e.target.value)}
                required
              />
            </div>
            
            <div className="input-group">
              <Label>Freight Charges (₹)</Label>
              <Input 
                type="number"
                min="0"
                step="0.01"
                value={spec.freight}
                onChange={(e) => handleGlassSpecChange(index, 'freight', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="input-group">
              <Label>Loading/Unloading Charges (₹)</Label>
              <Input 
                type="number"
                min="0"
                step="0.01"
                value={spec.loadingCharges}
                onChange={(e) => handleGlassSpecChange(index, 'loadingCharges', e.target.value)}
              />
            </div>
            
            <div className="input-group">
              <Label>Jumbo Size Premium (%)</Label>
              <Input 
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={spec.jumboSizePremium}
                onChange={(e) => handleGlassSpecChange(index, 'jumboSizePremium', e.target.value)}
                disabled={!spec.isJumboSize}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mt-4">
            <Checkbox 
              checked={spec.isJumboSize}
              onCheckedChange={(checked) => handleCheckboxChange(index, checked as boolean)}
            />
            <label className="text-sm font-medium">
              Apply Jumbo Size Premium (for glass size &gt; 5 sqm)
            </label>
          </div>
        </Card>
      ))}
      
      {/* Add More Button */}
      <div className="mt-6 flex justify-center">
        <Button 
          type="button" 
          variant="outline" 
          size="lg"
          onClick={addGlassSpec}
          className="px-8"
        >
          <Plus className="h-5 w-5 mr-2" /> Add More Glass
        </Button>
      </div>
      
      <div className="mt-6 flex justify-center">
        <Button type="submit" size="lg" className="px-8 py-6 text-lg">
          Generate Invoice
        </Button>
      </div>
    </form>
  );
};

export default InvoiceForm;
