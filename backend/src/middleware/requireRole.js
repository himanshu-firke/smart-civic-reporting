function requireRole(roles) {
  const allowed = Array.isArray(roles) ? roles : [roles];

  return function roleGuard(req, res, next) {
    let role = req.user?.role;
    if (!role) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Normalize spacing discrepancy for Department Admins
    if (role === "Department Admin") {
      role = "DepartmentAdmin";
      req.user.role = "DepartmentAdmin"; // Ensure downstream routes see the normalized string
    }

    if (!allowed.includes(role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return next();
  };
}

module.exports = { requireRole };
