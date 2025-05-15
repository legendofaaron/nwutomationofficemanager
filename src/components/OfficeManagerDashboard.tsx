
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

const OfficeManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState<'employees' | 'clients' | 'schedule' | 'invoices' | 'bookings' | 'settings'>('employees');
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const isSuperDark = resolvedTheme === 'superdark';
  const isMobile = useIsMobile();
  
  // Enhanced styling variables with more polish
  const borderColor = isSuperDark ? 'border-[#151515]' : isDark ? 'border-[#1a1e26]' : 'border-gray-200';
  const bgColor = isSuperDark ? 'bg-black' : isDark ? 'bg-[#0a0c10]' : 'bg-white';
  
  // Enhanced header with gradient for visual appeal
  const headerBgColor = isSuperDark 
    ? 'bg-black' 
    : isDark 
      ? 'bg-gradient-to-r from-[#0f1419] to-[#12171e]' 
      : 'bg-gradient-to-r from-[#F8F9FA] to-[#F3F4F6]';
  
  // More visually interesting content background
  const contentBgColor = isSuperDark 
    ? 'bg-black' 
    : isDark 
      ? 'bg-[#0a0c10]' 
      : 'bg-[#F9FAFB]';
  
  // Better tab styling with more defined active states
  const tabActiveClass = isSuperDark 
    ? 'bg-[#151515] text-white shadow-superdark' 
    : isDark 
      ? 'bg-gradient-to-r from-[#1e40af] to-[#3b82f6] text-white shadow-md' 
      : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-sm';
  
  const tabHoverClass = isSuperDark 
    ? 'hover:bg-[#111] hover:text-gray-300 hover:shadow-superdark-sm' 
    : isDark 
      ? 'hover:bg-[#161b22] hover:text-gray-300 hover:shadow-sm' 
      : 'hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm';

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
        {/* Enhanced header with better spacing and visual hierarchy */}
        <div className={`flex items-center justify-between p-3.5 md:p-4 lg:p-5 ${headerBgColor} border-b ${borderColor} shadow-sm`}>
          <div className="flex items-center gap-2 md:gap-3">
            <Logo small />
            <div className="font-medium text-lg md:text-xl tracking-tight">Office Manager</div>
          </div>
          <div className="flex items-center gap-1.5 md:gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEmailDeveloper}
              className="gap-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100/10 dark:hover:bg-gray-800/20 transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Contact</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleTipMe}
              className="gap-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100/10 dark:hover:bg-gray-800/20 transition-colors"
            >
              <Heart className="h-3.5 w-3.5 text-pink-500" />
              <span className="hidden sm:inline">Support</span>
            </Button>
          </div>
        </div>

        {/* Improved tab navigation with better visual feedback */}
        <div className={`p-3 md:p-4 lg:p-5 border-b ${bgColor} ${borderColor} shadow-sm overflow-x-auto`}>
          <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 flex-nowrap min-w-max">
            <Button 
              variant={activeTab === 'employees' ? 'default' : 'ghost'} 
              size="sm" 
              className={`gap-1.5 md:gap-2 rounded-md transition-all ${activeTab === 'employees' ? tabActiveClass : tabHoverClass}`} 
              onClick={() => setActiveTab('employees')}
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Employees</span>
              <span className="sm:hidden">Emp</span>
            </Button>
            <Button 
              variant={activeTab === 'clients' ? 'default' : 'ghost'} 
              size="sm" 
              className={`gap-1.5 md:gap-2 rounded-md transition-all ${activeTab === 'clients' ? tabActiveClass : tabHoverClass}`}
              onClick={() => setActiveTab('clients')}
            >
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Clients</span>
              <span className="sm:hidden">Cli</span>
            </Button>
            <Button 
              variant={activeTab === 'schedule' ? 'default' : 'ghost'} 
              size="sm" 
              className={`gap-1.5 md:gap-2 rounded-md transition-all ${activeTab === 'schedule' ? tabActiveClass : tabHoverClass}`}
              onClick={() => setActiveTab('schedule')}
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Schedule</span>
              <span className="sm:hidden">Sch</span>
            </Button>
            <Button 
              variant={activeTab === 'invoices' ? 'default' : 'ghost'} 
              size="sm" 
              className={`gap-1.5 md:gap-2 rounded-md transition-all ${activeTab === 'invoices' ? tabActiveClass : tabHoverClass}`}
              onClick={() => setActiveTab('invoices')}
            >
              <Receipt className="h-4 w-4" />
              <span className="hidden sm:inline">Invoices</span>
              <span className="sm:hidden">Inv</span>
            </Button>
            <Button 
              variant={activeTab === 'bookings' ? 'default' : 'ghost'} 
              size="sm" 
              className={`gap-1.5 md:gap-2 rounded-md transition-all ${activeTab === 'bookings' ? tabActiveClass : tabHoverClass}`}
              onClick={() => setActiveTab('bookings')}
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Bookings</span>
              <span className="sm:hidden">Book</span>
            </Button>
            <Button 
              variant={activeTab === 'settings' ? 'default' : 'ghost'} 
              size="sm" 
              className={`gap-1.5 md:gap-2 rounded-md transition-all ${activeTab === 'settings' ? tabActiveClass : tabHoverClass}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
              <span className="sm:hidden">Set</span>
            </Button>
          </div>
        </div>

        {/* Enhanced content area with better padding and animation */}
        <div className={`flex-1 overflow-auto p-3 md:p-5 lg:p-6 ${contentBgColor} animate-fade-in transition-all`}>
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
