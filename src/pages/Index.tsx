
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const Index = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const navigate = useNavigate();
  
  useEffect(() => {
    // Force navigation check on component mount
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);
  
  // This is a fallback in case the useEffect doesn't trigger
  return isLoggedIn ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

export default Index;
