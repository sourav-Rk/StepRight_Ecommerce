export const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.userRole) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};
