
import React, { useState, useMemo } from 'react';
import { Building2, Calendar, Receipt, Settings, Users, BookOpen, Briefcase, ChevronRight, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import EmployeesView from './EmployeesView';
import ScheduleView from './ScheduleView';
import InvoicesView from './InvoicesView';
import { Logo } from './Logo';
import SystemSettings from './SystemSettings';
import BookingView from './BookingView';
import ClientsView from './ClientsView';
import { useTheme } from '@/context/ThemeContext';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { DragDropProvider } from './schedule/DragDropContext';

// Memoize content views to prevent unnecessary re-renders
const MemoizedEmployeesView = React.memo(EmployeesView);
const MemoizedClientView = React.memo(ClientsView);
const MemoizedScheduleView = React.memo(ScheduleView);
const MemoizedInvoicesView = React.memo(InvoicesView);
const MemoizedBookingView = React.memo(BookingView);
const MemoizedSystemSettings = React.memo(SystemSettings);

const OfficeManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState<'employees' | 'clients' | 'schedule' | 'invoices' | 'bookings' | 'settings'>('schedule');
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const isSuperDark = resolvedTheme === 'superdark';
  
  // Memoize theme classes to prevent unnecessary re-renders
  const themeClasses = useMemo(() => {
    const borderColor = isSuperDark ? 'border-[#151515]' : isDark ? 'border-[#1a1e26]' : 'border-gray-200';
    const bgColor = isSuperDark ? 'bg-black' : isDark ? 'bg-[#0a0c10]' : 'bg-white';
    const headerBgColor = isSuperDark ? 'bg-black' : isDark ? 'bg-[#0f1419]' : 'bg-[#F8F9FA]';
    
    return { borderColor, bgColor, headerBgColor };
  }, [isDark, isSuperDark]);
  
  // Handle tab changes - wrapped in callback to stay stable
  const handleTabChange = (tab: 'employees' | 'clients' | 'schedule' | 'invoices' | 'bookings' | 'settings') => {
    setActiveTab(tab);
  };

  // Render content based on active tab - only re-renders when activeTab changes
  const renderContent = useMemo(() => {
    switch(activeTab) {
      case 'employees':
        return <MemoizedEmployeesView />;
      case 'clients':
        return <MemoizedClientView />;
      case 'schedule':
        return <MemoizedScheduleView />;
      case 'invoices':
        return <MemoizedInvoicesView />;
      case 'bookings':
        return <MemoizedBookingView />;
      case 'settings':
        return <MemoizedSystemSettings />;
      default:
        return <MemoizedScheduleView />;
    }
  }, [activeTab]);

  return (
    <div className="h-full flex flex-col">
      <div className={`flex items-center justify-between p-4 ${themeClasses.headerBgColor} border-b ${themeClasses.borderColor} shadow-sm`} style={{ willChange: 'transform', transform: 'translateZ(0)' }}>
        <div className="flex items-center gap-3">
          <Logo small />
          <div className="font-medium text-xl">Office Manager</div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-full relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">3</Badge>
          </Button>
        </div>
      </div>

      <div className="flex h-full">
        {/* Side navigation */}
        <Card className={`w-64 border-r ${themeClasses.borderColor} rounded-none shadow-none`} style={{ willChange: 'transform', transform: 'translateZ(0)' }}>
          <div className="p-4 space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground px-2">Main</h3>
              <div className="space-y-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn("w-full justify-start gap-3 px-2", 
                    activeTab === 'schedule' && "font-medium text-primary")} 
                  onClick={() => handleTabChange('schedule')}
                >
                  <Calendar className="h-4 w-4" />
                  Schedule
                  {activeTab === 'schedule' && <ChevronRight className="h-4 w-4 ml-auto" />}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn("w-full justify-start gap-3 px-2", 
                    activeTab === 'employees' && "font-medium text-primary")} 
                  onClick={() => handleTabChange('employees')}
                >
                  <Users className="h-4 w-4" />
                  Employees
                  {activeTab === 'employees' && <ChevronRight className="h-4 w-4 ml-auto" />}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn("w-full justify-start gap-3 px-2", 
                    activeTab === 'clients' && "font-medium text-primary")} 
                  onClick={() => handleTabChange('clients')}
                >
                  <Briefcase className="h-4 w-4" />
                  Clients
                  {activeTab === 'clients' && <ChevronRight className="h-4 w-4 ml-auto" />}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground px-2">Business</h3>
              <div className="space-y-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn("w-full justify-start gap-3 px-2", 
                    activeTab === 'invoices' && "font-medium text-primary")} 
                  onClick={() => handleTabChange('invoices')}
                >
                  <Receipt className="h-4 w-4" />
                  Invoices
                  {activeTab === 'invoices' && <ChevronRight className="h-4 w-4 ml-auto" />}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn("w-full justify-start gap-3 px-2", 
                    activeTab === 'bookings' && "font-medium text-primary")} 
                  onClick={() => handleTabChange('bookings')}
                >
                  <BookOpen className="h-4 w-4" />
                  Bookings
                  {activeTab === 'bookings' && <ChevronRight className="h-4 w-4 ml-auto" />}
                </Button>
              </div>
            </div>
            
            <div className="space-y-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn("w-full justify-start gap-3 px-2", 
                  activeTab === 'settings' && "font-medium text-primary")} 
                onClick={() => handleTabChange('settings')}
              >
                <Settings className="h-4 w-4" />
                Settings
                {activeTab === 'settings' && <ChevronRight className="h-4 w-4 ml-auto" />}
              </Button>
            </div>
          </div>
        </Card>

        {/* Main content area */}
        <div 
          className={`flex-1 overflow-auto p-5 ${isSuperDark ? 'bg-black' : isDark ? 'bg-[#0a0c10]' : 'bg-[#F9FAFB]'}`}
          style={{ willChange: 'transform', transform: 'translateZ(0)' }}
        >
          <DragDropProvider>
            {renderContent}
          </DragDropProvider>
        </div>
      </div>
    </div>
  );
};

export default OfficeManagerDashboard;
