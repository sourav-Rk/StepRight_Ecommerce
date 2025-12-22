import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminLoginPrivate = ({ children }) => {
  const { user } = useSelector((state) => state.user);

   if (user && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  if (user && user?.role === "admin") {
    return <Navigate to={"/admin/products"}/>;
  }

  return children;
};

export default AdminLoginPrivate;
