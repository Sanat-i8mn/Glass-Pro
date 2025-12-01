# 🚂 Railway Deployment - Step by Step

## ✅ Step 1: Code GitHub pe Push (DONE!)
```
✅ Git initialized
✅ Code committed
✅ Pushed to: https://github.com/Sanat-i8mn/Glass-Pro.git
```

---

## 🚀 Step 2: Deploy Backend on Railway

### A. Railway Dashboard Open Karo
1. Go to: **https://railway.app/dashboard**
2. Login with GitHub

### B. New Project Create Karo
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose repository: **`Sanat-i8mn/Glass-Pro`**
4. Click **"Deploy Now"**

### C. Environment Variables Add Karo
1. Project open karne ke baad, **"Variables"** tab pe click karo
2. Ye variables add karo:

```env
PORT=5000
MONGODB_URI=mongodb+srv://kaamh2678_db_user:kblUBHB0Njf6GI0i@cluster0.g1dqilw.mongodb.net/invoiceary?retryWrites=true&w=majority
JWT_SECRET=invoiceary_super_secret_key_change_this_in_production_2024
JWT_EXPIRE=7d
NODE_ENV=production
```

3. **Save** karo

### D. Settings Configure Karo
1. **Settings** tab pe jao
2. **Root Directory** set karo: `backend`
3. **Start Command** verify karo: `npm start`
4. Save karo

### E. Domain Generate Karo
1. **Settings** tab mein scroll down karo
2. **"Generate Domain"** button click karo
3. Domain copy karo (e.g., `glass-pro-production.up.railway.app`)
4. Ye URL save kar lo - **BACKEND_URL**

### F. Deployment Check Karo
1. **Deployments** tab pe jao
2. Wait for "Deployment successful" message
3. Logs check karo:
   - ✅ `Server running on port 5000`
   - ✅ `MongoDB Connected`

### G. Test Backend
Browser mein open karo:
```
https://your-backend-url.railway.app/
```

**Expected Response:**
```json
{"message": "Invoiceary API Running"}
```

---

## 🎨 Step 3: Deploy Frontend on Vercel

### A. Vercel Dashboard Open Karo
1. Go to: **https://vercel.com/new**
2. Login with GitHub

### B. Import Repository
1. Click **"Import Git Repository"**
2. Select: **`Sanat-i8mn/Glass-Pro`**
3. Click **"Import"**

### C. Configure Project
1. **Project Name:** `glass-invoice-genie` (ya koi bhi naam)
2. **Framework Preset:** Vite
3. **Root Directory:** Click "Edit" → Select `frontend`
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist`

### D. Environment Variables Add Karo
1. **Environment Variables** section mein:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-railway-backend-url.railway.app/api`
   
   ⚠️ **IMPORTANT:** Railway se copy kiya hua backend URL use karo!

2. Click **"Add"**

### E. Deploy!
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Deployment complete hone ka wait karo

### F. Frontend URL Copy Karo
1. Deployment complete hone ke baad
2. **"Visit"** button se URL copy karo
3. Save kar lo - **FRONTEND_URL**

---

## 🔄 Step 4: Update Backend CORS (IMPORTANT!)

### A. Backend mein Frontend URL Add Karo

1. Railway dashboard mein backend project open karo
2. **Variables** tab pe jao
3. Naya variable add karo:
   - **Name:** `CLIENT_URL`
   - **Value:** `https://your-vercel-frontend-url.vercel.app`

4. Save karo
5. Railway automatically redeploy karega

---

## ✅ Step 5: Final Testing

### Test 1: Backend API
```
https://your-backend.railway.app/
```
✅ Should show: `{"message": "Invoiceary API Running"}`

### Test 2: Frontend
```
https://your-frontend.vercel.app/
```
✅ Should show invoice form

### Test 3: Create Invoice
1. Frontend pe jao
2. Customer details bharo
3. Glass specs add karo
4. "Generate Invoice" click karo
5. ✅ Invoice create hona chahiye

### Test 4: History Page
1. "History" button click karo
2. ✅ Created invoice dikhai dena chahiye

---

## 📊 Your Live URLs

After deployment, update these:

```
🌐 Frontend: https://__________.vercel.app
🔧 Backend:  https://__________.railway.app
📊 Database: MongoDB Atlas (already configured)
```

---

## 🐛 Troubleshooting

### Issue: Backend not starting
**Check:**
- Railway logs mein errors dekho
- Environment variables sahi hain ya nahi
- MongoDB connection string test karo

### Issue: Frontend can't connect to backend
**Check:**
- `VITE_API_URL` sahi set hai ya nahi
- Backend CORS mein frontend URL add hai ya nahi
- Browser console mein network errors dekho

### Issue: "Failed to load invoices"
**Check:**
- Backend running hai ya nahi
- MongoDB connected hai ya nahi
- API endpoint `/api/invoices` accessible hai ya nahi

---

## 🎉 Success Checklist

- [ ] Code GitHub pe pushed
- [ ] Backend Railway pe deployed
- [ ] Backend domain generated
- [ ] Backend environment variables set
- [ ] Backend API working (test URL)
- [ ] Frontend Vercel pe deployed
- [ ] Frontend environment variable set (`VITE_API_URL`)
- [ ] Backend CORS updated with frontend URL
- [ ] Invoice creation working
- [ ] History page working
- [ ] PDF download working

---

## 💡 Pro Tips

1. **Custom Domain:** Dono platforms pe custom domain add kar sakte ho
2. **Auto Deploy:** GitHub pe push karte hi auto-deploy hoga
3. **Logs:** Railway aur Vercel dono mein real-time logs dekh sakte ho
4. **Free Tier:** Dono platforms ka free tier kaafi hai small projects ke liye

---

## 📞 Support

Agar koi problem aaye to:
1. Railway logs check karo
2. Vercel deployment logs check karo
3. Browser console check karo
4. MongoDB Atlas mein connection check karo

---

**🚀 Ready to Deploy!**

Next Step: Railway dashboard pe jao aur deployment start karo! 🎯
