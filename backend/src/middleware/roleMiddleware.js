// src/middleware/roleMiddleware.js
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Access denied. No role found.' });
    }
    const hasPermission = allowedRoles.includes(req.user.role);
    if (!hasPermission) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};

module.exports = authorizeRoles;