import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (err) {
    user = null;
  }

  if (!user || !user.email) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
