
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
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return session ? <>{children}</> : <Navigate to="/login" />;
};

// Public route that redirects authenticated users
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return session ? <Navigate to="/dashboard" /> : <>{children}</>;
};

const AppRoutes = () => {
  const { isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Authentication Routes */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><MainLayout /></ProtectedRoute>} />
      <Route path="/setup-assistant" element={<ProtectedRoute><SetupAssistant /></ProtectedRoute>} />
      
      {/* Home page - redirect based on authentication */}
      <Route path="/" element={<Navigate to="/dashboard" />} />
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppProvider>
            <Toaster />
            <AppRoutes />
          </AppProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
