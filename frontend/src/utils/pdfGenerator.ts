
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from '@/hooks/use-toast';

export const generatePDF = async (elementId: string, fileName: string = 'invoice'): Promise<void> => {
  try {
    toast({
      title: "Generating PDF",
      description: "Please wait while we generate your invoice...",
    });

    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID ${elementId} not found`);
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true
    });

    const imgData = canvas.toDataURL('image/png');
    
    // A4 size: 210 × 297 mm
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    pdf.save(`${fileName}.pdf`);

    toast({
      title: "PDF Generated Successfully",
      description: "Your invoice has been downloaded.",
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    toast({
      variant: "destructive",
      title: "PDF Generation Failed",
      description: "There was a problem generating your PDF. Please try again."
    });
  }
};

export const printInvoice = (): void => {
  window.print();
};
