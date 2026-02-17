## Quick Reference - MERN Bank Management System

### 🚀 START THE APP
From project root:
```bash
dev.bat
```
Opens 2 terminals:
- **Backend**: http://localhost:5000/api
- **Frontend**: http://localhost:3000

---

### 📁 FOLDER STRUCTURE
```
/backend          → Node.js/Express API server
/frontend/client  → React frontend with Vite
```

---

### 🔧 CONFIGURATION

| File | Purpose |
|------|---------|
| `backend/.env` | Backend: PORT, MONGO_URI, JWT_SECRET, **FRONTEND_URL** |
| `frontend/client/.env` | Frontend: **VITE_BACKEND_URL** (points to backend) |

---

### ⚡ DEVELOPMENT COMMANDS

**Start Backend Only:**
```bash
cd backend && npm start
```

**Start Frontend Only:**
```bash
cd frontend/client && npm start
```

**Build Frontend for Production:**
```bash
cd frontend/client && npm run build
```

---

### 🌐 KEY URLS

| Component | URL |
|-----------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000/api |
| Health Check | http://localhost:5000/health |

---

### 📡 API CONFIGURATION

Frontend uses:
```javascript
// src/services/api.js
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
```

All requests automatically:
- ✓ Send auth token from localStorage
- ✓ Use proper CORS headers
- ✓ Redirect to login on 401

---

### 🔐 CORS SETUP

Backend automatically allows requests from:
- Frontend URL specified in `FRONTEND_URL` env variable
- Default: `http://localhost:3000`

To change: Edit `backend/.env` → `FRONTEND_URL=YOUR_NEW_URL`

---

### ✅ VERIFY EVERYTHING WORKS

1. Go to http://localhost:3000 → See login page?  ✓
2. Go to http://localhost:5000/health → See `{ "ok": true }`?  ✓
3. Try logging in → Makes successful API call?  ✓

---

### 🐛 QUICK TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| Port 5000 busy | Backend auto-switches to 5001+ |
| Frontend shows blank | Make sure `npm install` was done in `frontend/client` |
| API calls fail | Check `VITE_BACKEND_URL` in `frontend/client/.env` |
| CORS error | Check `FRONTEND_URL` in `backend/.env` matches http://localhost:3000 |

---

### 📦 TECH STACK

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- CORS enabled

**Frontend:**
- React 18
- Vite (not Create React App!)
- Material-UI
- Axios

---

### 🎯 WHAT CHANGED FROM ORIGINAL

✅ **Removed**: react-scripts (Create React App)  
✅ **Added**: Vite for much faster development  
✅ **Updated**: Backend CORS to read from .env  
✅ **Created**: Environment files for both apps  
✅ **Added**: Independent startup scripts  

Both frontend and backend are now **truly independent** and properly connected!
