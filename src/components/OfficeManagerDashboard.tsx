
import React, { useState } from 'react';
import { Building2, Calendar, Receipt, Settings, Users, BookOpen, Briefcase, Heart, Coffee, Mail } from 'lucide-react';
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
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const OfficeManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState<'employees' | 'clients' | 'schedule' | 'invoices' | 'bookings' | 'settings'>('employees');
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const isSuperDark = resolvedTheme === 'superdark';
  const isMobile = useIsMobile();
  
  // Enhanced styling variables
  const borderColor = isSuperDark ? 'border-[#151515]' : isDark ? 'border-[#1a1e26]' : 'border-gray-200';
  const bgColor = isSuperDark ? 'bg-black' : isDark ? 'bg-[#0a0c10]' : 'bg-white';
  const headerBgColor = isSuperDark ? 'bg-black' : isDark ? 'bg-[#0f1419]' : 'bg-[#F8F9FA]';
  const contentBgColor = isSuperDark ? 'bg-black' : isDark ? 'bg-[#0a0c10]' : 'bg-[#F9FAFB]';
  const tabActiveClass = isSuperDark ? 'bg-[#151515] text-white' : isDark ? 'bg-[#1a1e26] text-white' : 'bg-blue-600 text-white';
  const tabHoverClass = isSuperDark ? 'hover:bg-[#111] hover:text-gray-300' : isDark ? 'hover:bg-[#161b22] hover:text-gray-300' : 'hover:bg-blue-50 hover:text-blue-700';

  const handleTipMe = () => {
    window.open('https://paypal.me/aaronthelegend', '_blank');
  };

  const handleEmailDeveloper = () => {
    window.location.href = 'mailto:northwesternautomation@gmail.com?subject=Office%20Manager%20Source%20Code%20Request&body=I%20would%20like%20to%20request%20the%20source%20code%20for%20Office%20Manager.';
  };

  return (
    <>
      <PaymentVerifier />
      <div className="h-full flex flex-col">
        <div className={`flex items-center justify-between p-3 md:p-4 lg:p-5 ${headerBgColor} border-b ${borderColor} shadow-sm`}>
          <div className="flex items-center gap-2 md:gap-3">
            <Logo small />
            <div className="font-medium text-lg md:text-xl">Office Manager</div>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEmailDeveloper}
              className="gap-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100/10 dark:hover:bg-gray-800/20"
            >
              <Mail className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Contact</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleTipMe}
              className="gap-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100/10 dark:hover:bg-gray-800/20"
            >
              <Heart className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Support</span>
            </Button>
          </div>
        </div>

        <div className={`p-2 md:p-3 lg:p-4 border-b ${bgColor} ${borderColor} shadow-sm overflow-x-auto`}>
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-nowrap min-w-max">
            <Button 
              variant={activeTab === 'employees' ? 'default' : 'ghost'} 
              size="sm" 
              className={cn(
                "gap-1 md:gap-2 rounded-md transition-colors flex items-center", 
                activeTab === 'employees' ? tabActiveClass : tabHoverClass
              )} 
              onClick={() => setActiveTab('employees')}
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Employees</span>
              <span className="sm:hidden">Emp</span>
            </Button>
            <Button 
              variant={activeTab === 'clients' ? 'default' : 'ghost'} 
              size="sm" 
              className={cn(
                "gap-1 md:gap-2 rounded-md transition-colors flex items-center",
                activeTab === 'clients' ? tabActiveClass : tabHoverClass
              )}
              onClick={() => setActiveTab('clients')}
            >
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Clients</span>
              <span className="sm:hidden">Cli</span>
            </Button>
            
            {/* Enhanced Schedule Button with animation and highlight effect */}
            <Button 
              variant={activeTab === 'schedule' ? 'default' : 'ghost'} 
              size="sm" 
              className={cn(
                "gap-1 md:gap-2 rounded-md transition-all duration-300 flex items-center",
                activeTab === 'schedule' 
                  ? `${tabActiveClass} shadow-lg scale-105 border border-blue-400/30` 
                  : `${tabHoverClass} hover:scale-105`,
                "relative overflow-hidden"
              )}
              onClick={() => setActiveTab('schedule')}
            >
              <div className={cn(
                "absolute inset-0 opacity-20 bg-gradient-to-r",
                isDark 
                  ? "from-blue-600/30 to-purple-600/30" 
                  : "from-blue-400/30 to-purple-400/30",
                activeTab === 'schedule' ? "opacity-40" : "opacity-0 hover:opacity-20"
              )} />
              <Calendar className={cn(
                "h-4 w-4 transition-all",
                activeTab === 'schedule' && "text-white"
              )} />
              <span className="hidden sm:inline relative z-10">Schedule</span>
              <span className="sm:hidden relative z-10">Sch</span>
              {activeTab !== 'schedule' && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              )}
            </Button>
            
            <Button 
              variant={activeTab === 'invoices' ? 'default' : 'ghost'} 
              size="sm" 
              className={cn(
                "gap-1 md:gap-2 rounded-md transition-colors flex items-center",
                activeTab === 'invoices' ? tabActiveClass : tabHoverClass
              )}
              onClick={() => setActiveTab('invoices')}
            >
              <Receipt className="h-4 w-4" />
              <span className="hidden sm:inline">Invoices</span>
              <span className="sm:hidden">Inv</span>
            </Button>
            <Button 
              variant={activeTab === 'bookings' ? 'default' : 'ghost'} 
              size="sm" 
              className={cn(
                "gap-1 md:gap-2 rounded-md transition-colors flex items-center",
                activeTab === 'bookings' ? tabActiveClass : tabHoverClass
              )}
              onClick={() => setActiveTab('bookings')}
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Bookings</span>
              <span className="sm:hidden">Book</span>
            </Button>
            <Button 
              variant={activeTab === 'settings' ? 'default' : 'ghost'} 
              size="sm" 
              className={cn(
                "gap-1 md:gap-2 rounded-md transition-colors flex items-center",
                activeTab === 'settings' ? tabActiveClass : tabHoverClass
              )}
              onClick={() => setActiveTab('settings')}
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
              <span className="sm:hidden">Set</span>
            </Button>
          </div>
        </div>

        <div className={`flex-1 overflow-auto p-2 md:p-4 lg:p-6 ${contentBgColor} animate-fade-in`}>
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
