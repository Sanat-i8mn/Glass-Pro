# 🚀 Railway Deployment Guide

## Deploy Frontend + Backend Together on Railway

### Step 1: Railway Setup
1. Go to https://railway.app/dashboard
2. New Project → Deploy from GitHub
3. Select: `Sanat-i8mn/Glass-Pro`

### Step 2: Environment Variables
Add these in Railway Variables tab:

```env
PORT=5000
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-secret-key>
JWT_EXPIRE=7d
NODE_ENV=production
```

⚠️ **IMPORTANT:** Get MongoDB URI from your MongoDB Atlas dashboard

### Step 3: Build Configuration
Railway will auto-detect and build both frontend and backend.

### Step 4: Test
- Backend: `https://your-app.railway.app/api`
- Frontend: `https://your-app.railway.app/`

## Security Notes
- Never commit .env files
- Never share MongoDB credentials publicly
- Use environment variables for all secrets
