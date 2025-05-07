
import React, { useState } from 'react';
import { Building2, Calendar, Receipt, Settings, Users, BookOpen, Briefcase, Heart, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmployeesView from './EmployeesView';
import ScheduleView from './ScheduleView';
import InvoicesView from './InvoicesView';
import { Logo } from './Logo';
import SystemSettings from './SystemSettings';
import BookingView from './BookingView';
import ClientsView from './ClientsView';
import { useTheme } from '@/context/ThemeContext';
import { Separator } from '@/components/ui/separator';
import { PaymentVerifier } from './payment/PaymentVerifier';

const OfficeManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState<'employees' | 'clients' | 'schedule' | 'invoices' | 'bookings' | 'settings'>('employees');
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const isSuperDark = resolvedTheme === 'superdark';
  
  const borderColor = isSuperDark ? 'border-[#151515]' : isDark ? 'border-[#1a1e26]' : 'border-gray-200';
  const bgColor = isSuperDark ? 'bg-black' : isDark ? 'bg-[#0a0c10]' : 'bg-white';
  const headerBgColor = isSuperDark ? 'bg-black' : isDark ? 'bg-[#0f1419]' : 'bg-[#F8F9FA]';

  const handleTipMe = () => {
    window.open('https://paypal.me/aaronthelegend', '_blank');
  };

  return (
    <>
      <PaymentVerifier />
      <div className="h-full flex flex-col">
        <div className={`flex items-center justify-between p-4 ${headerBgColor} border-b ${borderColor} shadow-sm`}>
          <div className="flex items-center gap-3">
            <Logo small />
            <div className="font-medium text-xl">Office Manager</div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleTipMe}
            className="gap-2 text-amber-500 hover:text-amber-600 hover:bg-amber-100/10"
          >
            <Coffee className="h-4 w-4" />
            Tip Developer
          </Button>
        </div>

        <div className={`p-3 border-b ${bgColor} ${borderColor} shadow-sm`}>
          <div className="flex items-center gap-3 flex-wrap">
            <Button 
              variant={activeTab === 'employees' ? 'default' : 'ghost'} 
              size="sm" 
              className={`gap-2 rounded-md ${activeTab === 'employees' ? '' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`} 
              onClick={() => setActiveTab('employees')}
            >
              <Users className="h-4 w-4" />
              Employees
            </Button>
            <Button 
              variant={activeTab === 'clients' ? 'default' : 'ghost'} 
              size="sm" 
              className={`gap-2 rounded-md ${activeTab === 'clients' ? '' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              onClick={() => setActiveTab('clients')}
            >
              <Briefcase className="h-4 w-4" />
              Clients
            </Button>
            <Button 
              variant={activeTab === 'schedule' ? 'default' : 'ghost'} 
              size="sm" 
              className={`gap-2 rounded-md ${activeTab === 'schedule' ? '' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              onClick={() => setActiveTab('schedule')}
            >
              <Calendar className="h-4 w-4" />
              Schedule
            </Button>
            <Button 
              variant={activeTab === 'invoices' ? 'default' : 'ghost'} 
              size="sm" 
              className={`gap-2 rounded-md ${activeTab === 'invoices' ? '' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              onClick={() => setActiveTab('invoices')}
            >
              <Receipt className="h-4 w-4" />
              Invoices
            </Button>
            <Button 
              variant={activeTab === 'bookings' ? 'default' : 'ghost'} 
              size="sm" 
              className={`gap-2 rounded-md ${activeTab === 'bookings' ? '' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              onClick={() => setActiveTab('bookings')}
            >
              <BookOpen className="h-4 w-4" />
              Bookings
            </Button>
            <Button 
              variant={activeTab === 'settings' ? 'default' : 'ghost'} 
              size="sm" 
              className={`gap-2 rounded-md ${activeTab === 'settings' ? '' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        <div className={`flex-1 overflow-auto p-5 ${isSuperDark ? 'bg-black' : isDark ? 'bg-[#0a0c10]' : 'bg-[#F9FAFB]'}`}>
          {activeTab === 'employees' && <EmployeesView />}
          {activeTab === 'clients' && <ClientsView />}
          {activeTab === 'schedule' && <ScheduleView />}
          {activeTab === 'invoices' && <InvoicesView />}
          {activeTab === 'bookings' && <BookingView />}
          {activeTab === 'settings' && <SystemSettings />}
        </div>
      </div>
    </>
  );
};

export default OfficeManagerDashboard;
