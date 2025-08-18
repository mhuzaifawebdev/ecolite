
// eslint-disable-next-line no-unused-vars
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ component: Component, role, ...rest }) => {
  const user = useSelector((state) => state.user?.user);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/user-dashboard" />;
  }

  return <Component {...rest} />;
};

export default ProtectedRoute;
