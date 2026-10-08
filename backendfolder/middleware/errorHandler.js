// Global 404 Handler
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    ok: false,
    error: `Route not found: ${req.originalUrl}`
  });
};

// Global Error Handler
export const globalErrorHandler = (err, req, res, next) => {
  console.error("Unhandled Server Error:", err);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    ok: false,
    error: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
};
