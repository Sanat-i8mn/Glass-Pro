# Invoiceary - Complete Invoice Management System

A production-ready invoice management system with real-time updates, payment integration, and multi-language support.

## 🚀 Features

### Core Features
- ✅ JWT Authentication (Login/Register)
- ✅ Role-based Access Control
- ✅ Dashboard with Stats & Charts
- ✅ Invoice Management (Create, Edit, Delete, Search)
- ✅ Customer Management
- ✅ PDF Generation & Download
- ✅ WhatsApp & Email Sharing
- ✅ Payment Gateway Integration (Stripe, Razorpay, UPI)
- ✅ Real-time Updates (Socket.io)
- ✅ Industry-specific Templates (Kirana, Medical, Clothing, Pet Store)
- ✅ Advanced Search & Filters
- ✅ Mobile-first Responsive Design
- ✅ Bilingual Support (Hindi/English)

## 🛠️ Tech Stack

### Frontend
- Vite + React 18
- TypeScript
- Tailwind CSS
- shadcn/ui Components
- Socket.io Client
- Axios

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Socket.io
- JWT Authentication
- PDFKit
- Nodemailer
- AWS S3

## 📦 Installation

### Prerequisites
- Node.js 18+
- MongoDB Atlas Account
- AWS Account (for S3 backups)

### Backend Setup

1. Navigate to backend folder:
\`\`\`bash
cd backend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create .env file:
\`\`\`bash
copy .env.example .env
\`\`\`

4. Update .env with your credentials:
- MongoDB URI
- JWT Secret
- Email credentials
- AWS credentials
- Payment gateway keys

5. Start backend server:
\`\`\`bash
npm run dev
\`\`\`

Backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to frontend folder:
\`\`\`bash
cd frontend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create .env file:
\`\`\`bash
copy .env.example .env
\`\`\`

4. Start frontend:
\`\`\`bash
npm run dev
\`\`\`

Frontend will run on http://localhost:5173

## 🎯 Quick Start Commands

### Run Everything at Once

**Backend:**
\`\`\`bash
cd backend && npm install && npm run dev
\`\`\`

**Frontend (in new terminal):**
\`\`\`bash
cd frontend && npm install && npm run dev
\`\`\`

## 📱 Usage

1. Register a new account at http://localhost:5173/register
2. Login with your credentials
3. Add customers from the Customers page
4. Create invoices from Dashboard or Invoices page
5. Download PDF or share via WhatsApp/Email
6. Track payments and revenue from Dashboard

## 🏗️ Project Structure

\`\`\`
invoiceary/
├── backend/
│   ├── config/          # Database config
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/  # UI components
    │   ├── context/     # React context
    │   ├── pages/       # Page components
    │   ├── services/    # API services
    │   ├── types/       # TypeScript types
    │   └── App.tsx      # Main app
    └── package.json
\`\`\`

## 🔐 Environment Variables

### Backend (.env)
- PORT
- MONGODB_URI
- JWT_SECRET
- EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS
- AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_BUCKET_NAME
- STRIPE_SECRET_KEY
- RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET

### Frontend (.env)
- VITE_API_URL

## 🎨 Business Types Supported

1. **Kirana Store** - Grocery items with FSSAI
2. **Medical Store** - Medicines with license tracking
3. **Clothing Store** - Apparel with size/color
4. **Pet Store** - Pet supplies with breed info
5. **Other** - General purpose

## 📊 API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile
- PUT /api/auth/profile

### Invoices
- GET /api/invoices
- POST /api/invoices
- GET /api/invoices/:id
- PUT /api/invoices/:id
- DELETE /api/invoices/:id
- GET /api/invoices/:id/download
- POST /api/invoices/:id/share

### Customers
- GET /api/customers
- POST /api/customers
- GET /api/customers/:id
- PUT /api/customers/:id
- DELETE /api/customers/:id

### Dashboard
- GET /api/dashboard/stats

### Payments
- POST /api/payments/create-link
- POST /api/payments/update-status
- GET /api/payments/history

## 🚀 Deployment

### Quick Deploy to Railway + Vercel

**Step 1: Push to GitHub**
\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/Sanat-i8mn/Glass-Pro.git
git push -u origin main
\`\`\`

**Step 2: Deploy Backend on Railway**
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select repository: `Sanat-i8mn/Glass-Pro`
4. Add environment variables (see DEPLOYMENT_GUIDE.md)
5. Generate domain and copy URL

**Step 3: Deploy Frontend on Vercel**
1. Go to https://vercel.com
2. Import Git Repository
3. Root Directory: `frontend`
4. Add environment variable: `VITE_API_URL=<your-railway-url>/api`
5. Deploy!

**📖 Detailed Guide:** See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 📝 License

MIT License

## 💖 Made with Love

Built with ❤️ for small businesses in India
