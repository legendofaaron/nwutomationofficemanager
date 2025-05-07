
import React, { useState } from 'react';
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

const OfficeManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState<'employees' | 'clients' | 'schedule' | 'invoices' | 'bookings' | 'settings'>('schedule');
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const isSuperDark = resolvedTheme === 'superdark';
  
  const borderColor = isSuperDark ? 'border-[#151515]' : isDark ? 'border-[#1a1e26]' : 'border-gray-200';
  const bgColor = isSuperDark ? 'bg-black' : isDark ? 'bg-[#0a0c10]' : 'bg-white';
  const headerBgColor = isSuperDark ? 'bg-black' : isDark ? 'bg-[#0f1419]' : 'bg-[#F8F9FA]';
  
  // Custom tab style for active and inactive states
  const getTabStyle = (isActive: boolean) => {
    if (isActive) {
      return `bg-primary text-primary-foreground shadow-sm`;
    }
    return `bg-transparent hover:bg-accent hover:text-accent-foreground`;
  };

  return (
    <div className="h-full flex flex-col">
      <div className={`flex items-center justify-between p-4 ${headerBgColor} border-b ${borderColor} shadow-sm`}>
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
        <Card className={`w-64 border-r ${borderColor} rounded-none shadow-none`}>
          <div className="p-4 space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground px-2">Main</h3>
              <div className="space-y-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn("w-full justify-start gap-3 px-2", 
                    activeTab === 'schedule' && "font-medium text-primary")} 
                  onClick={() => setActiveTab('schedule')}
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
                  onClick={() => setActiveTab('employees')}
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
                  onClick={() => setActiveTab('clients')}
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
                  onClick={() => setActiveTab('invoices')}
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
                  onClick={() => setActiveTab('bookings')}
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
                onClick={() => setActiveTab('settings')}
              >
                <Settings className="h-4 w-4" />
                Settings
                {activeTab === 'settings' && <ChevronRight className="h-4 w-4 ml-auto" />}
              </Button>
            </div>
          </div>
        </Card>

        {/* Main content area */}
        <div className={`flex-1 overflow-auto p-5 ${isSuperDark ? 'bg-black' : isDark ? 'bg-[#0a0c10]' : 'bg-[#F9FAFB]'}`}>
          {activeTab === 'employees' && <EmployeesView />}
          {activeTab === 'clients' && <ClientsView />}
          {activeTab === 'schedule' && <ScheduleView />}
          {activeTab === 'invoices' && <InvoicesView />}
          {activeTab === 'bookings' && <BookingView />}
          {activeTab === 'settings' && <SystemSettings />}
        </div>
      </div>
    </div>
  );
};

export default OfficeManagerDashboard;
