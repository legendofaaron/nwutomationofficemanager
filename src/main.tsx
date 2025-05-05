
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeCapacitorPlugins } from './capacitorApp';

// Initialize Capacitor plugins
if (typeof window !== 'undefined') {
  initializeCapacitorPlugins();
}

createRoot(document.getElementById("root")!).render(<App />);
