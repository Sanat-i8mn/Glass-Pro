
export interface GlassSpecifications {
  width: number; // in mm
  height: number; // in mm
  quantity: number;
  glassType: string;
  holes: number;
  cutouts: number;
  bigCutouts: number;
  ratePerSqm: number;
  ratePerHole: number;
  ratePerCutout: number;
  ratePerBigCutout: number;
  tax: number;
  freight: number;
  loadingCharges: number;
  isJumboSize: boolean;
  jumboSizePremium: number; // percentage
}

export interface InvoiceCalculation {
  areaPerPiece: number; // in sqm
  totalArea: number; // in sqm
  basicAmount: number;
  holesAmount: number;
  cutoutsAmount: number;
  bigCutoutsAmount: number;
  subtotal: number;
  taxAmount: number;
  freightAmount: number;
  loadingAmount: number;
  jumboPremiumAmount: number;
  totalAmount: number;
}

export const calculateInvoice = (specs: GlassSpecifications): InvoiceCalculation => {
  // Convert mm to m² for area calculation
  const areaPerPiece = (specs.width / 1000) * (specs.height / 1000);
  const totalArea = areaPerPiece * specs.quantity;
  
  // Calculate basic glass amount
  const basicAmount = totalArea * specs.ratePerSqm;
  
  // Calculate charges for processing
  const holesAmount = specs.holes * specs.ratePerHole;
  const cutoutsAmount = specs.cutouts * specs.ratePerCutout;
  const bigCutoutsAmount = specs.bigCutouts * specs.ratePerBigCutout;
  
  // Calculate jumbo size premium if applicable
  const jumboPremiumAmount = specs.isJumboSize 
    ? basicAmount * (specs.jumboSizePremium / 100) 
    : 0;
  
  // Calculate subtotal before tax
  const subtotal = basicAmount + holesAmount + cutoutsAmount + 
    bigCutoutsAmount + jumboPremiumAmount;
  
  // Calculate tax
  const taxAmount = subtotal * (specs.tax / 100);
  
  // Add additional charges
  const freightAmount = specs.freight;
  const loadingAmount = specs.loadingCharges;
  
  // Calculate total
  const totalAmount = subtotal + taxAmount + freightAmount + loadingAmount;
  
  return {
    areaPerPiece,
    totalArea,
    basicAmount,
    holesAmount,
    cutoutsAmount,
    bigCutoutsAmount,
    subtotal,
    taxAmount,
    freightAmount,
    loadingAmount,
    jumboPremiumAmount,
    totalAmount
  };
};

// Calculate multiple glass items and return grand total
export const calculateMultipleGlass = (specsList: GlassSpecifications[]): InvoiceCalculation => {
  let totalAreaSum = 0;
  let basicAmountSum = 0;
  let holesAmountSum = 0;
  let cutoutsAmountSum = 0;
  let bigCutoutsAmountSum = 0;
  let subtotalSum = 0;
  let taxAmountSum = 0;
  let freightAmountSum = 0;
  let loadingAmountSum = 0;
  let jumboPremiumAmountSum = 0;
  
  specsList.forEach(spec => {
    const calc = calculateInvoice(spec);
    totalAreaSum += calc.totalArea;
    basicAmountSum += calc.basicAmount;
    holesAmountSum += calc.holesAmount;
    cutoutsAmountSum += calc.cutoutsAmount;
    bigCutoutsAmountSum += calc.bigCutoutsAmount;
    subtotalSum += calc.subtotal;
    taxAmountSum += calc.taxAmount;
    freightAmountSum += calc.freightAmount;
    loadingAmountSum += calc.loadingAmount;
    jumboPremiumAmountSum += calc.jumboPremiumAmount;
  });
  
  const totalAmount = subtotalSum + taxAmountSum + freightAmountSum + loadingAmountSum;
  
  return {
    areaPerPiece: 0,
    totalArea: totalAreaSum,
    basicAmount: basicAmountSum,
    holesAmount: holesAmountSum,
    cutoutsAmount: cutoutsAmountSum,
    bigCutoutsAmount: bigCutoutsAmountSum,
    subtotal: subtotalSum,
    taxAmount: taxAmountSum,
    freightAmount: freightAmountSum,
    loadingAmount: loadingAmountSum,
    jumboPremiumAmount: jumboPremiumAmountSum,
    totalAmount
  };
};

// Format currency for display
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Format number with 2 decimal places
export const formatNumber = (num: number): string => {
  return num.toFixed(2);
};
