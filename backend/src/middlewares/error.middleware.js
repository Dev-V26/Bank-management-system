// backend/src/middlewares/error.middleware.js
export function notFound(_req, res) {
  return res.status(404).json({ message: "Route not found" });
}

export function errorHandler(err, _req, res, _next) {
  console.error("🔥 API Error:", err);

  const status = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";

  return res.status(status).json({ message });
}