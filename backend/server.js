const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./config/db");

// ✅ Always load .env from backend folder (works no matter where you start node from)
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

/**
 * ✅ Env validation (fail fast instead of random 500 errors)
 */
if (!process.env.JWT_SECRET) {
  console.error("❌ Missing JWT_SECRET in backend/.env");
  console.error("   Add: JWT_SECRET=some-long-random-string");
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error("❌ Missing MONGO_URI in backend/.env");
  console.error("   Add: MONGO_URI=mongodb://127.0.0.1:27017/mjbank");
  process.exit(1);
}

/**
 * ✅ Middleware
 * - JSON parsing MUST exist or req.body will be undefined and login fails
 * - CORS must allow your React dev server ports
 */
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

/**
 * ✅ Routes
 */
app.use("/api", require("./routes/api"));

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// 404 handler
app.use((_req, res) => res.status(404).json({ message: "Route not found" }));

/**
 * ---- Port handling (prevents EADDRINUSE crashes) --------------------------
 * If the configured port is already in use, automatically try the next ports
 * so nodemon doesn't get stuck in a crash/restart loop.
 */
const BASE_PORT = Number(process.env.PORT) || 5000;
const MAX_PORT_TRIES = 10;

let server;

function startServer(port, remainingTries) {
  server = app
    .listen(port, () => {
      console.log(`✅ Server running on http://localhost:${port}`);
      console.log(`✅ API base: http://localhost:${port}/api`);
    })
    .on("error", (err) => {
      if (err && err.code === "EADDRINUSE" && remainingTries > 0) {
        console.warn(`⚠️  Port ${port} is already in use. Trying port ${port + 1}...`);
        startServer(port + 1, remainingTries - 1);
        return;
      }

      console.error("❌ Failed to start server:", err);
      process.exit(1);
    });
}

/**
 * ✅ Connect DB FIRST, then start server
 * This prevents login 500 errors caused by DB not ready.
 */
(async () => {
  try {
    await connectDB();
    startServer(BASE_PORT, MAX_PORT_TRIES);
  } catch (err) {
    console.error("❌ Failed to connect DB:", err);
    process.exit(1);
  }
})();

/**
 * Crash-safe logs
 */
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  if (server) server.close(() => process.exit(1));
  else process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});