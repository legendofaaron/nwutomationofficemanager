
import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import { AppProvider } from '@/context/AppContext';
import MainLayout from '@/components/MainLayout';
import { ThemeProvider } from '@/context/ThemeContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SetupAssistant from './pages/SetupAssistant';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <BrowserRouter>
      <AppProvider>
        <ThemeProvider>
          <Toaster />
          <Routes>
            <Route path="/" element={<MainLayout />} />
            <Route path="/setup-assistant" element={<SetupAssistant />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ThemeProvider>
      </AppProvider>
    </BrowserRouter>
  );
};

export default App;
