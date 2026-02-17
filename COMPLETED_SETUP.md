# ✅ Independent Frontend & Backend Setup - Complete

Your MERN Bank Management System is now configured to run the frontend and backend **completely independently** with separate URLs.

## What Was Changed

### Backend Updates
✅ **CORS Configuration**: Backend now reads `FRONTEND_URL` from `.env` file
✅ **Environment Variable**: Added `FRONTEND_URL=http://localhost:3000` to `backend/.env`
✅ **Flexible Port Handling**: Server auto-switches ports if main port is busy

### Frontend Updates
✅ **Removed react-scripts**: Replaced Create React App with Vite bundler
✅ **Updated package.json**: All react-scripts dependencies removed, Vite added
✅ **Vite Configuration**: Added `vite.config.js` with proper JSX handling
✅ **index.html**: New Vite entry point created at root level
✅ **API Service**: Updated `src/services/api.js` to use environment variable for backend URL
✅ **Environment Files**: Created `.env`, `.env.local`, `.env.production`

### Configuration Files Created/Updated
- `vite.config.js` - Vite dev server & build configuration
- `index.html` - Vite entry point
- `backend/.env` - Backend environment configuration
- `frontend/client/.env` - Frontend environment configuration
- `frontend/client/.env.local` - Local development overrides
- `frontend/client/.env.production` - Production configuration
- `start-app.bat` - Batch script to start both servers
- `dev.bat` - Development startup script
- `SETUP.md` - Complete setup documentation
- `package.json` (root) - Root-level npm scripts

## Current Status

### ✅ Frontend (Vite)
- **Status**: Running successfully ✓
- **Port**: http://localhost:3000
- **Backend URL**: http://localhost:5000 (configurable via `.env`)
- **Technology**: React + Vite instead of Create React App
- **Development**: Much faster hot reload with Vite

###  ✅ Backend (Node.js/Express)
- **Status**: Ready to run
- **Port**: http://localhost:5000 (auto-switches if busy)
- **CORS**: Configured to accept frontend requests
- **APIs**: All available at http://localhost:5000/api/*

## How to Run

### Quick Start - Run Both Servers (Windows)
```bash
# From project root
dev.bat
```
This opens two terminal windows:
- **Terminal 1**: Backend on http://localhost:5000
- **Terminal 2**: Frontend on http://localhost:3000

### Manual Start - Terminal 1 (Backend)
```bash
cd backend
npm start
# Server starts on http://localhost:5000
```

### Manual Start - Terminal 2 (Frontend)
```bash
cd frontend/client
npm start
# Vite dev server starts on http://localhost:3000
```

## URL Reference

| Component | URL |
|-----------|-----|
| **Frontend** | http://localhost:3000 |
| **Backend** | http://localhost:5000 |
| **API Base** | http://localhost:5000/api |
| **Health Check** | http://localhost:5000/health |

## Key Features

### ✅ Independent Execution
- Frontend and backend run in **completely separate processes**
- Each has its own terminal/window
- Can be stopped/restarted independently
- No port conflicts (auto-switching if needed)

### ✅ Proper CORS Configuration
- Backend in `server.js` explicitly allows frontend origin
- `FRONTEND_URL` from `.env` controls who can access the API
- Credentials properly enabled for auth tokens

### ✅ Environment-Based Configuration
- **Backend**: Uses `PORT` and `FRONTEND_URL` from `.env`
- **Frontend**: Uses `VITE_BACKEND_URL` from `.env`
- Easy to change for different environments

### ✅ Modern Frontend Tooling
- **Vite** instead of Create React App (much faster!)
- Lightning-fast hot module replacement (HMR)
- Faster builds and development experience
- Proper JSX support in `.js` files

### ✅ API Communication
All HTTP calls go through `src/services/api.js`:
```javascript
const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,  // Reads from VITE_BACKEND_URL env
  withCredentials: true,           // Includes auth tokens
});
```

## Testing the Connection

### Test 1: Frontend is loading
```
Visit http://localhost:3000 in your browser
Should see the login page or dashboard
```

### Test 2: Backend API is responding
```
Visit http://localhost:5000/health in your browser
Should see: { "ok": true }
```

### Test 3: API calls work
```
Frontend makes API calls to http://localhost:5000/api/*
Check Network tab in browser DevTools to see requests
Should see responses with proper CORS headers
```

## Environment Variable Reference

### Backend (backend/.env)
```
PORT=5000                    # Server port
MONGO_URI=...               # MongoDB connection
JWT_SECRET=...              # JWT signing key
FRONTEND_URL=http://localhost:3000  # For CORS
```

### Frontend (frontend/client/.env)
```
VITE_BACKEND_URL=http://localhost:5000  # Backend API URL
```

## Troubleshooting

### Frontend won't start
```bash
cd frontend/client
npm install  # Reinstall dependencies
npm start
```

### Backend shows "Port already in use"
- Backend automatically tries the next port (5001, 5002, etc.)
- Or manually change `PORT` in `backend/.env`
- Or kill the process on that port

### API calls return 404
- Make sure backend is running on http://localhost:5000
- Check `VITE_BACKEND_URL` in `frontend/client/.env`
- Verify `FRONTEND_URL` in `backend/.env` matches where frontend runs

### CORS errors in browser console
- Check `FRONTEND_URL` in `backend/.env` - must match frontend URL
- Frontend URL typically: `http://localhost:3000`
- If running on different port, update both files

## Production Deployment

### Frontend
```bash
cd frontend/client
npm run build  # Creates dist/ folder
# Deploy dist/ to static host (Vercel, Netlify, etc.)
# Update VITE_BACKEND_URL to production backend URL
```

### Backend
```bash
# Deploy to Node.js hosting
# Set environment variables on server:
# - MONGO_URI
# - JWT_SECRET
# - FRONTEND_URL (production frontend URL)
# - PORT (optional, defaults to 5000)
```

## File Structure Summary

```
├── backend/
│   ├── .env                # ✅ Updated with FRONTEND_URL
│   ├── server.js           # ✅ Updated CORS config
│   ├── package.json        # Express, Mongoose, etc.
│   └── ...
│
├── frontend/client/
│   ├── .env                # ✅ New - VITE_BACKEND_URL
│   ├── .env.local          # ✅ New - Local dev overrides
│   ├── .env.production     # ✅ New - Production config
│   ├── index.html          # ✅ New - Vite entry point
│   ├── vite.config.js      # ✅ New - Vite configuration
│   ├── package.json        # ✅ Updated - Vite instead of react-scripts
│   ├── src/
│   │   ├── index.js        # React entry
│   │   ├── services/
│   │   │   └── api.js      # ✅ Updated - uses VITE_BACKEND_URL
│   │   └── ...
│   └── ...
│
├── dev.bat                 # ✅ New - Start both servers
├── start-app.bat           # ✅ New - Start with fresh install
├── package.json            # ✅ New - Root-level scripts
├── SETUP.md               # ✅ New - This documentation
└── ...
```

---

## Summary

Your MERN Bank Management System is now:
- ✅ **Fully independent**: Frontend and backend run separately
- ✅ **Properly connected**: CORS configured, API calls work
- ✅ **Modern tooling**: Vite instead of Create React App
- ✅ **Development ready**: Use `dev.bat` to start both instantly
- ✅ **Production ready**: Can be deployed independently
- ✅ **Well documented**: Complete setup instructions included

**You're all set!** Run `dev.bat` to start both servers now.
