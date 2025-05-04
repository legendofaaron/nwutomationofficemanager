import React, { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import AppSidebar, { SidebarToggle } from '@/components/AppSidebar';
import { AppProvider } from '@/context/AppContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Sidebar, SidebarInset } from '@/components/ui/sidebar';
import AiAssistant from '@/components/AiAssistant';
import { ThemeProvider } from '@/context/ThemeContext';

import TodoCalendarBubble from './components/TodoCalendarBubble';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { aiAssistantOpen } = useAppContext();

  // Add TodoCalendarBubble to the layout
  return (
    <AppProvider>
      <ThemeProvider>
        <Toaster />
        <div className="flex min-h-screen">
          <SidebarProvider defaultOpen={sidebarOpen}>
            <Sidebar
              side="left"
              variant="sidebar"
              collapsible="offcanvas"
            >
              <AppSidebar />
            </Sidebar>
            
            <SidebarInset className="relative">
              <div className="h-screen overflow-auto">
                <div className="container mx-auto p-4">
                  <SidebarToggle />
                  {/* Your main content goes here */}
                </div>
              </div>
              
              {/* Floating UI components */}
              <TodoCalendarBubble />
              {aiAssistantOpen && <AiAssistant />}
            </SidebarInset>
          </SidebarProvider>
        </div>
      </ThemeProvider>
    </AppProvider>
  );
};

export default App;
