
import React from 'react';
import { Navigate } from 'react-router-dom';

const Index = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  // Redirect to dashboard if logged in, otherwise to login page
  return isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
};

export default Index;
