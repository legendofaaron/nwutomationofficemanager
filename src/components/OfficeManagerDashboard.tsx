
import React, { useState } from 'react';
import { Building2, Calendar, Receipt, Settings, Users, BookOpen, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmployeesView from './EmployeesView';
import ScheduleView from './ScheduleView';
import InvoicesView from './InvoicesView';
import { Logo } from './Logo';
import SystemSettings from './SystemSettings';
import BookingView from './BookingView';
import ClientsView from './ClientsView';
import { useTheme } from '@/context/ThemeContext';

const OfficeManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState<'employees' | 'clients' | 'schedule' | 'invoices' | 'bookings' | 'settings'>('employees');
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const isSuperDark = resolvedTheme === 'superdark';
  
  const borderColor = isSuperDark ? 'border-[#151515]' : isDark ? 'border-[#1a1e26]' : '';
  const bgColor = isSuperDark ? 'bg-black' : isDark ? 'bg-[#0a0c10]' : 'bg-zinc-900';

  return <div className="h-full">
      <div className={`flex items-center justify-between p-4 border-b ${borderColor}`}>
        <div className="flex items-center gap-2">
          <Logo small />
          <h2 className="text-lg font-medium">Office Manager</h2>
        </div>
      </div>

      <div className={`p-4 border-b ${bgColor} ${borderColor}`}>
        <div className="flex items-center gap-4 flex-wrap">
          <Button variant={activeTab === 'employees' ? 'default' : 'outline'} size="sm" className="gap-2" onClick={() => setActiveTab('employees')}>
            <Users className="h-4 w-4" />
            Employees
          </Button>
          <Button variant={activeTab === 'clients' ? 'default' : 'outline'} size="sm" className="gap-2" onClick={() => setActiveTab('clients')}>
            <Briefcase className="h-4 w-4" />
            Clients
          </Button>
          <Button variant={activeTab === 'schedule' ? 'default' : 'outline'} size="sm" className="gap-2" onClick={() => setActiveTab('schedule')}>
            <Calendar className="h-4 w-4" />
            Schedule
          </Button>
          <Button variant={activeTab === 'invoices' ? 'default' : 'outline'} size="sm" className="gap-2" onClick={() => setActiveTab('invoices')}>
            <Receipt className="h-4 w-4" />
            Invoices
          </Button>
          <Button variant={activeTab === 'bookings' ? 'default' : 'outline'} size="sm" className="gap-2" onClick={() => setActiveTab('bookings')}>
            <BookOpen className="h-4 w-4" />
            Bookings
          </Button>
          <Button variant={activeTab === 'settings' ? 'default' : 'outline'} size="sm" className="gap-2" onClick={() => setActiveTab('settings')}>
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      <div className={`p-4 ${isSuperDark ? 'bg-black' : ''}`}>
        {activeTab === 'employees' && <EmployeesView />}
        {activeTab === 'clients' && <ClientsView />}
        {activeTab === 'schedule' && <ScheduleView />}
        {activeTab === 'invoices' && <InvoicesView />}
        {activeTab === 'bookings' && <BookingView />}
        {activeTab === 'settings' && <SystemSettings />}
      </div>
    </div>;
};
export default OfficeManagerDashboard;
