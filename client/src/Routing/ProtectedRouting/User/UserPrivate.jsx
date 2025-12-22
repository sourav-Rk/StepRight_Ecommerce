import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const UserPrivate = ({ children, allowedRoles }) => {
  const { user } = useSelector((state) => state.user);

  if (user && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (user) {
    return children;
  }

  return <Navigate to={"/login"} replace />;
};

export default UserPrivate;
