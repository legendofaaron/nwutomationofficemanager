
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ScheduleView from './schedule/ScheduleView';
import ClientsView from './ClientsView';
import EmployeesView from './EmployeesView';
import InvoicesView from './InvoicesView';
import BookingView from './BookingView';
import { Buildings, Users, ClipboardList, Calendar, Building, CreditCard } from "lucide-react";

// Hide the DashboardCalendar component as we're moving all calendar functionality
// to the TodoCalendar component in the top right corner

const OfficeManagerDashboard: React.FC = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6 mt-2">Office Manager Dashboard</h1>
      
      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList className="grid grid-cols-5 h-auto gap-2">
          <TabsTrigger value="schedule" className="flex flex-col items-center py-2 px-4 text-xs sm:text-sm sm:flex-row sm:gap-2">
            <Calendar className="h-4 w-4" />
            <span>Schedule</span>
          </TabsTrigger>
          <TabsTrigger value="clients" className="flex flex-col items-center py-2 px-4 text-xs sm:text-sm sm:flex-row sm:gap-2">
            <Buildings className="h-4 w-4" />
            <span>Clients</span>
          </TabsTrigger>
          <TabsTrigger value="employees" className="flex flex-col items-center py-2 px-4 text-xs sm:text-sm sm:flex-row sm:gap-2">
            <Users className="h-4 w-4" />
            <span>Employees</span>
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex flex-col items-center py-2 px-4 text-xs sm:text-sm sm:flex-row sm:gap-2">
            <Building className="h-4 w-4" />
            <span>Bookings</span>
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex flex-col items-center py-2 px-4 text-xs sm:text-sm sm:flex-row sm:gap-2">
            <CreditCard className="h-4 w-4" />
            <span>Invoices</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="schedule" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            <ScheduleView />
          </div>
        </TabsContent>
        
        <TabsContent value="clients">
          <ClientsView />
        </TabsContent>
        
        <TabsContent value="employees">
          <EmployeesView />
        </TabsContent>
        
        <TabsContent value="bookings">
          <BookingView />
        </TabsContent>
        
        <TabsContent value="invoices">
          <InvoicesView />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OfficeManagerDashboard;
