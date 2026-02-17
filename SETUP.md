# MERN Bank Management System - Independent Frontend & Backend

This project is configured to run the Frontend and Backend completely independently with separate URLs and proper communication between them.

## Architecture

- **Backend**: Node.js/Express server running on `http://localhost:5000`
- **Frontend**: React app with Vite running on `http://localhost:3000`
- **Communication**: RESTful API via HTTP with CORS enabled

## Quick Start

### Option 1: Automatic Start (Windows)
Run the batch file from the project root:

```bash
dev.bat
```

This will:
- Open Backend in a new terminal (compiles and starts on port 5000)
- Open Frontend in a new terminal (starts Vite on port 3000)

### Option 2: Manual Start

**Terminal 1 - Start Backend:**
```bash
cd backend
npm install  # First time only
npm start    # or: npm run dev (if nodemon is configured)
```

Backend APIs will be available at: `http://localhost:5000/api`

**Terminal 2 - Start Frontend:**
```bash
cd frontend/client
npm install  # First time only
npm start    # Starts Vite dev server
```

Frontend will be available at: `http://localhost:3000`

## Configuration

### Backend Configuration
File: `backend/.env`
```env
PORT=5000                                    # Backend server port
MONGO_URI=mongodb://connection...          # MongoDB connection string
JWT_SECRET=your-secret-key                 # JWT authentication secret
FRONTEND_URL=http://localhost:3000         # Frontend URL for CORS
```

### Frontend Configuration
File: `frontend/client/.env`
```env
VITE_BACKEND_URL=http://localhost:5000    # Backend URL
```

## How Frontend-Backend Communication Works

1. **API Service**: All API calls are made through `src/services/api.js`
   ```javascript
   const api = axios.create({
     baseURL: `${BACKEND_URL}/api`,  // Uses VITE_BACKEND_URL env variable
     withCredentials: true,          // Allows credentials in cross-origin requests
   });
   ```

2. **CORS**: Backend is configured to accept requests from the frontend URL specified in `FRONTEND_URL` environment variable

3. **Authentication**: Token is stored in localStorage and sent in request headers as `x-auth-token`

## Key Changes From Create React App Setup

### Frontend (Vite instead of react-scripts)
- ✅ **No more `react-scripts`** - Uses Vite for much faster development
- ✅ **Separate configuration** - Uses `vite.config.js` instead of CRA defaults
- ✅ **Environment variables** - Uses `VITE_*` prefix for environment variables
- ✅ **Direct API calls** - No proxy needed, API backend URL is configured directly

### Backend (CORS Configuration)
- ✅ **Flexible CORS** - Reads `FRONTEND_URL` from `.env` file
- ✅ **Environment-based** - Can easily switch to different frontend URLs

## Ports

- **Frontend Dev Server**: `http://localhost:3000` (Vite)
- **Backend API Server**: `http://localhost:5000`

If these ports are in use, you can change them:
- Frontend: Edit `vite.config.js` → `server.port`
- Backend: Change `PORT` in `backend/.env`

## Troubleshooting

### "Cannot GET /" on localhost:3000
- Make sure frontend is running: `npm start` from `frontend/client`
- Check that Vite is properly initialized with the new `index.html`

### API calls fail / 404 errors
- Ensure backend is running on the correct port (default 5000)
- Check `VITE_BACKEND_URL` in `frontend/client/.env`
- Verify `FRONTEND_URL` in `backend/.env` matches frontend URL

### CORS errors
- Backend's `FRONTEND_URL` must match where frontend is running
- If frontend runs on port 3001 instead, update both:
  - `backend/.env`: `FRONTEND_URL=http://localhost:3001`
  - `frontend/.env`: `VITE_BACKEND_URL=http://localhost:5000`

### "Port already in use"
Backend will automatically try the next port (5001, 5002, etc.)
Or manually change in `backend/.env` → `PORT=5001`

## Production Deployment

### Backend
1. Set environment variables on your server
2. Run: `npm install && npm start`
3. Deploy to a server with Node.js runtime

### Frontend
1. Build: `npm run build` (creates `dist/` folder)
2. Deploy the `dist/` folder to a static host (Vercel, Netlify, etc.)
3. Update `VITE_BACKEND_URL` to point to production backend

## File Structure

```
backend/
├── .env                    # Environment configuration
├── server.js              # Main server entry (CORS configured)
├── app.js                 # Express app configuration
├── routes/
│   └── api.js             # API routes
└── ...

frontend/client/
├── .env                   # Environment configuration
├── index.html             # Vite entry HTML (required)
├── vite.config.js         # Vite configuration
├── src/
│   ├── index.js           # React entry point
│   ├── services/
│   │   └── api.js         # Axios instance with VITE_BACKEND_URL
│   └── ...
└── ...
```

## Scripts Summary

| Command | Location | Purpose |
|---------|----------|---------|
| `npm start` | `backend/` | Start Node.js server |
| `npm start` | `frontend/client/` | Start Vite dev server |
| `npm run build` | `frontend/client/` | Build for production |
| `dev.bat` | Root | Start both in new terminal windows |

---

**Now your frontend and backend are completely independent and can be developed, tested, and deployed separately!**
