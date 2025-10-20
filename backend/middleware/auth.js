const jwt = require("jsonwebtoken");

const SECRET_KEY = "mysecretkey"; // 🔹 nhớ đồng bộ với server.js

// ✅ Middleware xác thực JWT
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
}

// ✅ Middleware kiểm tra admin
function adminMiddleware(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
}

module.exports = { authMiddleware, adminMiddleware };
