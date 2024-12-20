const jwt = require("jsonwebtoken");

const ensureAuthenticated = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    console.log("Authorization header is missing");
    return res
      .status(403)
      .json({ message: "Unauthorized, JWT token is required" });
  }

  const token = authHeader.split(" ")[1]; // Extract token from Bearer scheme

  if (!token) {
    console.log("Token is missing");
    return res
      .status(403)
      .json({ message: "Unauthorized, JWT token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log(`User authenticated: ${JSON.stringify(decoded)}`); // Log the authenticated user
    next();
  } catch (err) {
    console.log("Token verification failed:", err);
    return res
      .status(403)
      .json({ message: "Unauthorized, JWT token wrong or expired" });
  }
};

module.exports = ensureAuthenticated;
