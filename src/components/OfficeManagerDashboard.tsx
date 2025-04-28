
import React, { useState } from 'react';
import { Building2, Calendar, Receipt, Settings, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmployeesView from './EmployeesView';
import ScheduleView from './ScheduleView';
import { Logo } from './Logo';

const OfficeManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState<'employees' | 'schedule' | 'invoices' | 'settings'>('employees');

  return (
    <div className="h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Logo small />
          <h2 className="text-lg font-medium">Office Manager</h2>
        </div>
      </div>

      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center gap-4">
          <Button 
            variant={activeTab === 'employees' ? 'default' : 'outline'} 
            size="sm" 
            className="gap-2"
            onClick={() => setActiveTab('employees')}
          >
            <Users className="h-4 w-4" />
            Employees
          </Button>
          <Button 
            variant={activeTab === 'schedule' ? 'default' : 'outline'} 
            size="sm" 
            className="gap-2"
            onClick={() => setActiveTab('schedule')}
          >
            <Calendar className="h-4 w-4" />
            Schedule
          </Button>
          <Button 
            variant={activeTab === 'invoices' ? 'default' : 'outline'} 
            size="sm" 
            className="gap-2"
            onClick={() => setActiveTab('invoices')}
          >
            <Receipt className="h-4 w-4" />
            Invoices
          </Button>
          <Button 
            variant={activeTab === 'settings' ? 'default' : 'outline'} 
            size="sm" 
            className="gap-2"
            onClick={() => setActiveTab('settings')}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      <div className="p-4">
        {activeTab === 'employees' && <EmployeesView />}
        {activeTab === 'schedule' && <ScheduleView />}
        {activeTab === 'invoices' && <p className="text-gray-500">Invoices management features coming soon</p>}
        {activeTab === 'settings' && <p className="text-gray-500">System configuration options coming soon</p>}
      </div>
    </div>
  );
};

export default OfficeManagerDashboard;
