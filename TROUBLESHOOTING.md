# 🔧 Troubleshooting Guide - "Failed to load invoice" Error

## Problem
History page pe click karne par **"Failed to load invoice"** error aa raha hai.

## Root Causes (Possible)

### 1️⃣ Backend Server Running Nahi Hai
**Check karo:**
```bash
# Backend folder mein jao
cd backend

# Server start karo
npm run dev
```

**Expected Output:**
```
🚀 Server running on port 5000
✅ MongoDB Connected: cluster0.g1dqilw.mongodb.net
```

Agar ye output nahi aa raha, to backend nahi chal raha!

---

### 2️⃣ MongoDB Connection Issue
**Agar ye error aaye:**
```
❌ Error: connect ECONNREFUSED
```

**Solution:**
- `.env` file check karo backend folder mein
- `MONGODB_URI` sahi hai ya nahi verify karo
- Internet connection check karo (MongoDB Atlas cloud pe hai)

---

### 3️⃣ Database Mein Koi Invoice Nahi Hai
**Agar backend chal raha hai but invoices nahi aa rahe:**

Pehle ek invoice create karo:
1. Home page (`http://localhost:5173/`) pe jao
2. Customer details bharo
3. Glass specifications add karo
4. "Generate Invoice" click karo
5. Phir History page pe jao

---

## Quick Fix Commands

### Step 1: Backend Start Karo
```bash
# Terminal 1 - Backend
cd d:\Deepiots\glass-invoice-genie-main\backend
npm run dev
```

### Step 2: Frontend Start Karo
```bash
# Terminal 2 - Frontend (new terminal)
cd d:\Deepiots\glass-invoice-genie-main\frontend
npm run dev
```

### Step 3: Browser Console Check Karo
1. Browser mein `F12` press karo
2. Console tab open karo
3. History page pe jao
4. Koi error dikhe to note karo

---

## Common Errors & Solutions

### Error: "Network Error"
**Matlab:** Backend se connection nahi ho pa raha

**Fix:**
- Backend server running hai ya nahi check karo
- Port 5000 already use mein to nahi hai
- `.env` file mein `VITE_API_URL=http://localhost:5000/api` sahi hai

---

### Error: "MongooseServerSelectionError"
**Matlab:** MongoDB se connect nahi ho pa raha

**Fix:**
- Internet connection check karo
- MongoDB Atlas credentials sahi hain ya nahi
- Firewall MongoDB ko block to nahi kar raha

---

### Error: "Cannot GET /api/invoices"
**Matlab:** Backend routes properly setup nahi hain

**Fix:**
- Backend restart karo
- `server.js` file check karo
- Routes properly import hue hain ya nahi

---

## Testing Backend Manually

Backend test karne ke liye browser mein ye URL kholo:
```
http://localhost:5000/
```

**Expected Response:**
```json
{"message": "Invoiceary API Running"}
```

Agar ye response aaye, backend sahi chal raha hai!

---

## Still Not Working?

### Check These Files:

1. **Backend .env** (`backend/.env`):
```env
PORT=5000
MONGODB_URI=mongodb+srv://kaamh2678_db_user:kblUBHB0Njf6GI0i@cluster0.g1dqilw.mongodb.net/invoiceary?retryWrites=true&w=majority
```

2. **Frontend .env** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

3. **Both servers running:**
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

---

## Debug Mode

Agar abhi bhi problem hai, to backend mein console.log add karo:

**File:** `backend/controllers/invoiceController.js`

```javascript
export const getInvoices = async (req, res) => {
  try {
    console.log('📥 GET /api/invoices called');
    console.log('Query params:', req.query);
    
    // ... rest of code
    
    console.log('✅ Found invoices:', invoices.length);
    res.json({ invoices, totalPages, currentPage, total: count });
  } catch (error) {
    console.error('❌ Error in getInvoices:', error);
    res.status(500).json({ error: error.message });
  }
};
```

Phir backend terminal mein logs dekhoge!

---

## Contact
Agar koi aur problem ho to error message screenshot leke help mango! 🙏
