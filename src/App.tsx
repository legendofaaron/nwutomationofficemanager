
import React, { useEffect, useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { AppProvider } from '@/context/AppContext';
import MainLayout from '@/components/MainLayout';
import { ThemeProvider } from '@/context/ThemeContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SetupAssistant from './pages/SetupAssistant';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import { LoadingScreen } from './components/LoadingScreen';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setIsAuthenticated(isLoggedIn);
    };
    
    // Slight delay to simulate checking authentication
    const timer = setTimeout(() => {
      checkAuth();
    }, 500); // Small delay for the loading screen to show
    
    // Listen for storage events (in case user logs in/out in another tab)
    window.addEventListener('storage', checkAuth);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);
  
  return (
    <BrowserRouter>
      <ThemeProvider>
        {/* Show loading state while checking authentication */}
        {isAuthenticated === null ? (
          <LoadingScreen />
        ) : (
          <AppProvider>
            <Toaster />
            <Routes>
              {/* Authentication Routes */}
              <Route 
                path="/login" 
                element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
              />
              <Route 
                path="/signup" 
                element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />} 
              />
              
              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/setup-assistant" 
                element={isAuthenticated ? <SetupAssistant /> : <Navigate to="/login" />} 
              />
              
              {/* Home page - redirect based on authentication */}
              <Route 
                path="/" 
                element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
              />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppProvider>
        )}
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
