# How to Add QR Code to Invoice PDF

## Step 1: Add Your QR Code Image

1. Save your QR code image as `qr-code.png` in the `backend/assets/` folder
2. Create the assets folder if it doesn't exist:
   ```
   backend/
   └── assets/
       └── qr-code.png
   ```

## Step 2: Update glassPdfGenerator.js

Replace the QR Code placeholder section with actual image:

### Find this code (around line 150):
```javascript
// QR Code Box (placeholder - you can add actual QR code image here)
doc.rect(450, termsY + 15, 90, 90).stroke('#000');
doc.fontSize(8).fillColor('#999');
doc.text('QR CODE', 465, termsY + 55, { width: 60, align: 'center' });
doc.fontSize(6).text('(Add your QR image here)', 455, termsY + 65, { width: 80, align: 'center' });
```

### Replace with:
```javascript
// QR Code Image
const qrPath = path.join(__dirname, '../assets/qr-code.png');
if (fs.existsSync(qrPath)) {
  doc.image(qrPath, 450, termsY + 15, { width: 90, height: 90 });
} else {
  // Fallback if QR image not found
  doc.rect(450, termsY + 15, 90, 90).stroke('#000');
  doc.fontSize(8).fillColor('#999');
  doc.text('QR CODE', 465, termsY + 55, { width: 60, align: 'center' });
}
```

### Add imports at the top of the file:
```javascript
import path from 'path';
import fs from 'fs';
```

## Step 3: Customize Bank Details

Edit the bank details in `glassPdfGenerator.js` (around line 120):

```javascript
doc.text(`Bank Name: YOUR_BANK_NAME`, 55, bankY);
doc.text(`Account No: YOUR_ACCOUNT_NUMBER`, 305, bankY);
doc.text(`Branch: YOUR_BRANCH_NAME`, 55, bankY + 12);
// ... etc
```

## Step 4: Customize Terms & Conditions

Edit the terms in `glassPdfGenerator.js` (around line 135):

```javascript
doc.text('• Your custom term 1', 50, termsY + 12);
doc.text('• Your custom term 2', 50, termsY + 22);
// ... etc
```

## Current Bank Details (Can be changed):
- Bank Name: State Bank Of India
- Account No: 4158 0745 106
- Branch: SME Branch Agarwal Niwas Bhagwanganj Sagar
- IFS Code: SBIN0012284
- Branch Code: 12284
- MICR Code: 470002010
- UPI ID: 9425170693@sbi
- Company Name: SHRI PARASNATH GLASS TUFF PRIVATE LIMITED

## Current Terms & Conditions (Can be changed):
- This is a proforma invoice and not a tax invoice.
- Payment terms: 50% advance, balance before dispatch.
- Delivery period: 7-10 working days after receipt of advance payment.
- Prices are subject to change without prior notice.
- Goods once sold will not be taken back or exchanged.

---

**Note:** All these details can be edited directly in the `backend/utils/glassPdfGenerator.js` file.
