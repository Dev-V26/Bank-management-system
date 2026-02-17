# Deployment Guide - MERN Bank Management System

## Backend Deployment (Render)

### Setting Environment Variables on Render

Your backend is deployed on Render at: `https://bank-management-system-9mqf.onrender.com`

You need to add these environment variables to your Render service:

1. **Go to Render Dashboard** → Your Service → **Environment**
2. **Add these variables:**

| Variable | Value |
|----------|-------|
| `PORT` | `5000` |
| `MONGO_URI` | Your MongoDB connection string |
| `JWT_SECRET` | Your JWT secret key |
| `CORS_URLS` | `https://bankmanagementsystem-delta.vercel.app,http://localhost:3000,http://localhost:3001` |

### Important: CORS_URLS on Render

The backend reads CORS configuration from the `CORS_URLS` environment variable. Make sure to set:
```
CORS_URLS=https://bankmanagementsystem-delta.vercel.app,http://localhost:3000,http://localhost:3001
```

This allows:
- ✅ Vercel frontend: `https://bankmanagementsystem-delta.vercel.app`
- ✅ Local development: `http://localhost:3000`
- ✅ Alternative local port: `http://localhost:3001`

---

## Frontend Deployment (Vercel)

Your frontend is deployed on Vercel at: `https://bankmanagementsystem-delta.vercel.app`

### Setting Environment Variables on Vercel

1. **Go to Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. **Add this variable:**

| Variable | Value |
|----------|-------|
| `VITE_BACKEND_URL` | `https://bank-management-system-9mqf.onrender.com` |

### Environment Files

**frontend/client/.env:**
```dotenv
VITE_BACKEND_URL=https://bank-management-system-9mqf.onrender.com
```

This tells the frontend to call: `https://bank-management-system-9mqf.onrender.com/api/*`

---

## Local Development

### Backend (Local)

**backend/.env:**
```dotenv
PORT=5000
MONGO_URI=mongodb+srv://admin:tGJ6lHf0EA0B9aQj@cluster0.pr6f0.mongodb.net/bank-management-system
JWT_SECRET=THIS_IS_A_LONG_RANDOM_SECRET_123456789
CORS_URLS=http://localhost:3000,http://localhost:3001,https://bankmanagementsystem-delta.vercel.app
```

### Frontend (Local)

**frontend/client/.env:**
```dotenv
VITE_BACKEND_URL=http://localhost:5000
```

Then run:
```bash
cd backend && npm start        # Starts on http://localhost:5000
cd frontend/client && npm start # Starts on http://localhost:3000
```

---

## Environment Variable Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION (Deployed)                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Frontend (Vercel)                  Backend (Render)        │
│  ─────────────────                  ──────────────          │
│  URL: https://bankmanagementsystem  URL: https://bank-...  │
│  VITE_BACKEND_URL (env) ──calls──> CORS_URLS (env)        │
│                                     ✅ Allows Vercel origin │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    LOCAL DEVELOPMENT (Your Machine)         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Frontend (Local)                   Backend (Local)         │
│  ──────────────────                 ───────────────         │
│  URL: http://localhost:3000         URL: http://localhost:5000
│  VITE_BACKEND_URL (env) ──calls──> CORS_URLS (env)        │
│                                     ✅ Allows localhost     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Checking Current Configuration

### Backend CORS Status
```javascript
// backend/server.js reads CORS from env:
const corsUrls = process.env.CORS_URLS
  ? process.env.CORS_URLS.split(",").map((url) => url.trim())
  : ["http://localhost:3000", "http://localhost:3001"];
```

### Frontend API Config
```javascript
// frontend/client/src/services/api.js reads backend URL from env:
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
});
```

---

## Troubleshooting CORS Errors

### Error: "CORS policy: The 'Access-Control-Allow-Origin' header..."

**Cause:** The backend's `CORS_URLS` environment variable doesn't include your frontend URL.

**Solution:**
1. Go to Render Dashboard → Your backend service
2. Go to Environment variables
3. Add/update `CORS_URLS` to include your Vercel frontend URL:
   ```
   CORS_URLS=https://bankmanagementsystem-delta.vercel.app,http://localhost:3000,http://localhost:3001
   ```
4. Redeploy the backend

### No Environment Variables Set?

Check your Render service:
1. Go to Render Dashboard
2. Select your backend service
3. Click **Environment**
4. Verify all variables are set:
   - `MONGO_URI`
   - `JWT_SECRET` 
   - `PORT`
   - `CORS_URLS` ← Most important for Vercel access

---

## Summary

| Component | Local | Production |
|-----------|-------|-----------|
| **Frontend URL** | http://localhost:3000 | https://bankmanagementsystem-delta.vercel.app |
| **Backend URL** | http://localhost:5000 | https://bank-management-system-9mqf.onrender.com |
| **Frontend env var** | `VITE_BACKEND_URL=http://localhost:5000` | `VITE_BACKEND_URL=https://bank-management-system-9mqf.onrender.com` |
| **Backend env var** | `CORS_URLS=http://localhost:3000,...` | `CORS_URLS=https://bankmanagementsystem-delta.vercel.app,...` |

**Note:** All URLs are **read from environment variables** - no hardcoded URLs in code files.
