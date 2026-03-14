import React from "react";
import { Navigate } from "react-router-dom";

import { getAuth } from "../auth/authStorage";

export function ProtectedRoute({ allowedRoles, children }) {
  const auth = getAuth();
  if (!auth?.token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(auth.role)) {
    return <Navigate to="/app" replace />;
  }

  return children;
}
