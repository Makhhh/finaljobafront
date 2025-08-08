import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch {
    user = null;
  }


  const userEmail = localStorage.getItem('user_email');

  if ((!user || !user.token) && !userEmail) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
