
import React from 'react';
import { Route, Routes as RouterRoutes } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import Payment from './pages/Payment';
import NotFound from './pages/NotFound';

export const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  );
};
