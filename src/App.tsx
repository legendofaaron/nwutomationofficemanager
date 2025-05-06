
import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import { AppProvider } from '@/context/AppContext';
import MainLayout from '@/components/MainLayout';
import { ThemeProvider } from '@/context/ThemeContext';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import SetupAssistant from './pages/SetupAssistant';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { LoadingScreen } from './components/LoadingScreen';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected route component with enhanced security
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading, isDemoMode } = useAuth();
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  // Allow access if user is authenticated or in demo mode
  if (session || isDemoMode) {
    return <>{children}</>;
  }
  
  return <Navigate to="/login" state={{ from: location.pathname }} replace />;
};

// Public route that redirects authenticated users
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading, isDemoMode } = useAuth();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return (session || isDemoMode) ? <Navigate to={from} replace /> : <>{children}</>;
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
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><MainLayout /></ProtectedRoute>} />
      <Route path="/setup-assistant" element={<ProtectedRoute><SetupAssistant /></ProtectedRoute>} />
      
      {/* Home page - redirect based on authentication */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
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
