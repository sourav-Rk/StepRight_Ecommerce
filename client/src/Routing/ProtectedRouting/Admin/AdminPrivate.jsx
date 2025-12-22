import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminPrivate = ({ children, allowedRoles="admin" }) => {
  const { user } = useSelector((state) => state.user);

  if (user &&!allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (user) {
    return children;
  }

  return <Navigate to={"/admin/login"} />;
};

export default AdminPrivate;
