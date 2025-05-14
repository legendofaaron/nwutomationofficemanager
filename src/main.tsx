
import { createRoot } from 'react-dom/client'
import React from 'react'
import App from './App.tsx'
import './index.css'
import { initializeCapacitorPlugins } from './capacitorApp';
import { ThemeProvider } from './context/ThemeContext';

// Initialize Capacitor plugins
if (typeof window !== 'undefined') {
  initializeCapacitorPlugins();
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
