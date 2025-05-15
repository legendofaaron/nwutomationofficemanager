
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
import Production from './pages/Production';
import Payment from './pages/Payment';
import { LoadingScreen } from './components/LoadingScreen';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Index from './pages/Index';

// Protected route component with enhanced security
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading, isDemoMode } = useAuth();
  const location = useLocation();
  
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
  return (
    <ErrorBoundary>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
        <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><MainLayout /></ProtectedRoute>} />
        <Route path="/setup-assistant" element={<ProtectedRoute><SetupAssistant /></ProtectedRoute>} />
        <Route path="/production" element={<ProtectedRoute><Production /></ProtectedRoute>} />
        
        {/* Home page - Initial auth check */}
        <Route path="/" element={<Index />} />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
};

export default App;
