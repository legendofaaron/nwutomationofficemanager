
import React from 'react';
import { AppProvider } from '@/context/AppContext';
import MainLayout from '@/components/MainLayout';

const Index = () => {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
};

export default Index;
