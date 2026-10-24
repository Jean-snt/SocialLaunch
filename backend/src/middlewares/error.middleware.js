/**
 * Middleware centralizado de manejo de errores
 */
const errorHandler = (err, req, res, next) => {
  console.error("🔥 Error capturado en Middleware:", err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Error interno del servidor";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
