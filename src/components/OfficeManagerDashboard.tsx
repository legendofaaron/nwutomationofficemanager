
import React from 'react';
import { Building2, Calendar, Receipt, Settings, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OfficeManagerDashboard = () => {
  return (
    <div className="h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-app-blue" />
          <h2 className="text-lg font-medium">Office Manager</h2>
        </div>
      </div>

      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="gap-2">
            <Users className="h-4 w-4" />
            Employees
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="h-4 w-4" />
            Schedule
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Receipt className="h-4 w-4" />
            Invoices
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      <div className="p-4">
        <p className="text-gray-500">Welcome to the Office Manager Dashboard</p>
      </div>
    </div>
  );
};

export default OfficeManagerDashboard;
