import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);

  if (userInfo && userInfo.role === 'admin') {
    return children;
  }

  // If logged in but not admin, redirect to home. Else go to login.
  return <Navigate to={userInfo ? '/' : '/login'} replace />;
};

export default AdminRoute;
