
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes } from './routes';
import { Toaster } from '@/components/ui/toaster';
import { AppProvider } from '@/context/AppContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { DragDropProvider } from './components/schedule/DragDropContext';
import { CalendarSyncProvider } from './context/CalendarSyncContext';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AppProvider>
          <CalendarSyncProvider>
            <DragDropProvider>
              <Routes />
              <Toaster />
            </DragDropProvider>
          </CalendarSyncProvider>
        </AppProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
