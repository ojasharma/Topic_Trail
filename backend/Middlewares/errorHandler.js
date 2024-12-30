// errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Log request details for debugging
  console.error("Request URL:", req.originalUrl);
  console.error("Request Method:", req.method);
  console.error("Request Query:", req.query);

  res.status(500).json({
    error: err.message || "Internal Server Error",
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
};

module.exports = errorHandler;

// In your app.js or main server file:
const errorHandler = require("./middlewares/errorHandler");
app.use(errorHandler);
