# 🚀 Railway Deployment Guide - Glass Invoice Genie

## 📋 Pre-Deployment Checklist

✅ MongoDB Atlas account ready  
✅ Railway account created  
✅ GitHub repository ready  
✅ All code committed to GitHub  

---

## 🎯 Step-by-Step Deployment

### **Step 1: Push Code to GitHub**

```bash
# Navigate to project folder
cd d:\Deepiots\glass-invoice-genie-main

# Initialize git (if not already done)
git init

# Add remote repository
git remote add origin https://github.com/Sanat-i8mn/Glass-Pro.git

# Add all files
git add .

# Commit
git commit -m "Initial commit - Glass Invoice Genie"

# Push to GitHub
git push -u origin main
```

**Note:** Agar `main` branch error de, to `master` try karo:
```bash
git push -u origin master
```

---

### **Step 2: Deploy Backend on Railway**

1. **Railway Dashboard pe jao:** https://railway.app/dashboard

2. **New Project → Deploy from GitHub**

3. **Repository select karo:** `Sanat-i8mn/Glass-Pro`

4. **Root Directory set karo:** `backend`

5. **Environment Variables add karo:**
   - Click on **Variables** tab
   - Add these variables:

```env
PORT=5000
MONGODB_URI=mongodb+srv://kaamh2678_db_user:kblUBHB0Njf6GI0i@cluster0.g1dqilw.mongodb.net/invoiceary?retryWrites=true&w=majority
JWT_SECRET=invoiceary_super_secret_key_change_this_in_production_2024
JWT_EXPIRE=7d
CLIENT_URL=${{RAILWAY_PUBLIC_DOMAIN}}
NODE_ENV=production
```

6. **Settings → Generate Domain**
   - Click "Generate Domain"
   - Copy the URL (e.g., `https://glass-pro-backend.railway.app`)

7. **Deploy!**
   - Railway automatically deploy karega
   - Wait for "Deployment successful" message

---

### **Step 3: Deploy Frontend on Vercel/Netlify**

#### **Option A: Vercel (Recommended)**

1. **Vercel pe jao:** https://vercel.com

2. **Import Git Repository**
   - New Project → Import `Sanat-i8mn/Glass-Pro`

3. **Configure Project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

4. **Environment Variables:**
```env
VITE_API_URL=https://your-backend-url.railway.app/api
```
   - Replace `your-backend-url` with Railway backend URL

5. **Deploy!**

#### **Option B: Netlify**

1. **Netlify pe jao:** https://app.netlify.com

2. **Import from Git**
   - Add new site → Import existing project

3. **Build Settings:**
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`

4. **Environment Variables:**
```env
VITE_API_URL=https://your-backend-url.railway.app/api
```

5. **Deploy!**

---

### **Step 4: Update Backend CORS**

Backend mein frontend URL add karna hai:

**File:** `backend/server.js`

```javascript
// Update CORS configuration
const io = new Server(httpServer, {
  cors: { 
    origin: [
      'http://localhost:5173',
      'https://your-frontend-url.vercel.app'  // Add your Vercel URL
    ], 
    credentials: true 
  }
});

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-frontend-url.vercel.app'  // Add your Vercel URL
  ],
  credentials: true
}));
```

Phir commit aur push karo:
```bash
git add .
git commit -m "Update CORS for production"
git push
```

Railway automatically redeploy karega!

---

## 🔍 Testing Deployment

### **Test Backend:**
```
https://your-backend-url.railway.app/
```
**Expected Response:**
```json
{"message": "Invoiceary API Running"}
```

### **Test Frontend:**
```
https://your-frontend-url.vercel.app/
```
Invoice form dikhai dena chahiye!

---

## 🐛 Common Issues & Solutions

### **Issue 1: Backend not starting**
**Solution:**
- Railway logs check karo
- Environment variables sahi hain ya nahi verify karo
- MongoDB connection string test karo

### **Issue 2: Frontend can't connect to backend**
**Solution:**
- `VITE_API_URL` sahi set hai ya nahi check karo
- Backend CORS settings check karo
- Browser console mein errors dekho

### **Issue 3: PDF generation failing**
**Solution:**
- QR code image path check karo
- Railway mein file system read permissions check karo

---

## 📊 Railway Environment Variables (Complete List)

```env
# Required
PORT=5000
MONGODB_URI=mongodb+srv://kaamh2678_db_user:kblUBHB0Njf6GI0i@cluster0.g1dqilw.mongodb.net/invoiceary?retryWrites=true&w=majority
JWT_SECRET=invoiceary_super_secret_key_change_this_in_production_2024
JWT_EXPIRE=7d
CLIENT_URL=${{RAILWAY_PUBLIC_DOMAIN}}
NODE_ENV=production

# Optional (Email)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Optional (AWS S3)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-south-1
AWS_BUCKET_NAME=invoiceary-backups

# Optional (Payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

---

## 🎉 Post-Deployment

### **Update README with Live URLs:**

```markdown
## 🌐 Live Demo

- **Frontend:** https://your-app.vercel.app
- **Backend API:** https://your-backend.railway.app
```

### **Monitor Your App:**

- **Railway Logs:** Check for errors
- **Vercel Analytics:** Monitor traffic
- **MongoDB Atlas:** Check database connections

---

## 💡 Pro Tips

1. **Custom Domain:** Railway aur Vercel dono pe custom domain add kar sakte ho
2. **Auto Deploy:** GitHub pe push karte hi automatically deploy hoga
3. **Environment Secrets:** Sensitive data ko environment variables mein hi rakho
4. **Monitoring:** Railway metrics regularly check karo

---

## 🆘 Need Help?

Agar koi issue aaye to:
1. Railway logs check karo
2. Browser console check karo
3. Network tab mein API calls dekho
4. MongoDB Atlas mein connection check karo

---

## 📝 Quick Commands Reference

```bash
# Git commands
git add .
git commit -m "your message"
git push

# Check git status
git status

# View git remote
git remote -v

# Create new branch
git checkout -b production
```

---

**🎯 Deployment Time:** ~10-15 minutes  
**💰 Cost:** Free tier (Railway + Vercel + MongoDB Atlas)  
**🚀 Ready to go live!**
