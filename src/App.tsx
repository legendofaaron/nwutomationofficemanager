
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Payment from './pages/Payment';
import Pricing from './pages/Pricing';
import Settings from './pages/Settings';
import SchedulePage from './pages/SchedulePage';
import { Toast } from '@/components/ui/toast';

// Import the CalendarSyncProvider
import { CalendarSyncProvider } from './context/CalendarSyncContext';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  function PrivateRoute({ children }: { children: JSX.Element }) {
    const { isLoggedIn } = useAuth();
    
    if (loading) {
      return <div>Loading...</div>; // Or a more sophisticated loading indicator
    }

    return isLoggedIn ? children : <Navigate to="/login" />;
  }

  return (
    <BrowserRouter>
      <AppProvider>
        <CalendarSyncProvider>
          <Toast />
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/" element={<Navigate to="/dashboard" />} />
              
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/payment" element={
                <PrivateRoute>
                  <Payment />
                </PrivateRoute>
              } />
              <Route path="/settings" element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              } />
              <Route path="/schedule" element={
                <PrivateRoute>
                  <SchedulePage />
                </PrivateRoute>
              } />
            </Routes>
          </AuthProvider>
        </CalendarSyncProvider>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
