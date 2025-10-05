// middleware/isAdminMiddleware.js

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // proceed if admin
  } else {
    res.status(403).json({ message: "Access denied: Admins only" });
  }
};

module.exports = { isAdmin };
