import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MessageSquare, BookOpenText, PlayIcon, Building2, Brain, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from './ui/scroll-area';
import { Logo } from './Logo';
import { useTheme } from '@/context/ThemeContext';
const WelcomeDashboard = () => {
  const {
    setViewMode,
    branding
  } = useAppContext();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const {
    resolvedTheme
  } = useTheme();
  const startAssistantSetup = () => {
    navigate('/setup-assistant');
  };
  const isDark = resolvedTheme === 'dark';
  return <ScrollArea className="h-full">
      <div className={`mx-auto px-3 pt-4 pb-6 max-w-5xl`}>
        <div className="text-center mb-5">
          <h1 className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-app-blue'} mb-2`}>Welcome to Office Manager</h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm max-w-2xl mx-auto">
            A secure solution by {branding.companyName} for document management and workplace productivity.
          </p>
        </div>

        {/* Main Nav Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <Card className={`hover:shadow-md transition-shadow ${isDark ? 'border-[#1a1e26] dashboard-card' : 'border-app-blue/10'}`}>
            <CardHeader className={`${isDark ? 'bg-[#0d0f13]' : 'bg-gradient-to-r from-blue-50 to-white'} p-3`}>
              <CardTitle className="text-lg flex items-center gap-2 text-slate-950">
                <Building2 className={`h-4 w-4 ${isDark ? 'text-blue-400' : 'text-app-blue'}`} />
                Office Manager
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2 px-3">
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                Manage employees, schedules and invoices in one centralized location
              </p>
            </CardContent>
            <CardFooter className="p-3 pt-0">
              <Button onClick={() => setViewMode('office')} size="sm" className="w-full gap-1 text-xs">
                Open Manager <ArrowRight className="h-3 w-3" />
              </Button>
            </CardFooter>
          </Card>

          <Card className={`hover:shadow-md transition-shadow ${isDark ? 'border-[#1a1e26] dashboard-card' : 'border-app-blue/10'}`}>
            <CardHeader className={`${isDark ? 'bg-[#0d0f13]' : 'bg-gradient-to-r from-blue-50 to-white'} p-3`}>
              <CardTitle className="text-lg flex items-center gap-2 text-slate-950">
                <Brain className={`h-4 w-4 ${isDark ? 'text-blue-400' : 'text-app-blue'}`} />
                Knowledge Base
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2 px-3">
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                Access and organize your company's information resources
              </p>
            </CardContent>
            <CardFooter className="p-3 pt-0">
              <Button onClick={() => setViewMode('knowledge')} size="sm" className="w-full gap-1 text-xs">
                Open KB <ArrowRight className="h-3 w-3" />
              </Button>
            </CardFooter>
          </Card>
          
          <Card className={`hover:shadow-md transition-shadow ${isDark ? 'border-[#1a1e26] dashboard-card' : 'border-app-blue/10'}`}>
            <CardHeader className={`${isDark ? 'bg-[#0d0f13]' : 'bg-gradient-to-r from-blue-50 to-white'} p-3`}>
              <CardTitle className="text-lg flex items-center gap-2 text-zinc-950">
                <LayoutDashboard className={`h-4 w-4 ${isDark ? 'text-blue-400' : 'text-app-blue'}`} />
                Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2 px-3">
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                View your overview dashboard with all key metrics
              </p>
            </CardContent>
            <CardFooter className="p-3 pt-0">
              <Button onClick={() => setViewMode('welcome')} size="sm" className="w-full gap-1 text-xs" disabled>
                Current View <ArrowRight className="h-3 w-3" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Intelligent Assistant Card */}
        <Card className={`mb-6 ${isDark ? 'border-blue-900/30 bg-[#0d0f13]' : 'border-app-blue/20'} shadow-sm`}>
          <CardHeader className={`${isDark ? 'bg-[#0d0f13]' : 'bg-gradient-to-r from-blue-50 to-white'} p-3`}>
            <CardTitle className="text-xl flex items-center gap-2 text-gray-950">
              <MessageSquare className={`h-5 w-5 ${isDark ? 'text-blue-400' : 'text-app-blue'}`} />
              Intelligent Assistant
            </CardTitle>
            <CardDescription className="text-xs">
              A locally-hosted assistant that helps manage your workflow
            </CardDescription>
          </CardHeader>
          <CardContent className="py-3 px-4">
            <p className="text-sm mb-3 dark:text-gray-300">
              Our intelligent assistant can help you draft documents, organize schedules, and provide insights—all while keeping your data secure.
            </p>
            <div className="flex justify-center">
              <Button onClick={startAssistantSetup} size="sm" className="gap-2">
                Set Up Assistant <PlayIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="space-y-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Explore Features</h2>
          <div className="grid grid-cols-3 gap-3">
            <Card className={`hover:shadow-sm transition-shadow ${isDark ? 'bg-[#0d0f13] border-[#1a1e26]' : ''}`}>
              <CardHeader className="p-3">
                <CardTitle className="text-sm flex items-center gap-1">
                  <BookOpenText className={`h-4 w-4 ${isDark ? 'text-blue-400' : 'text-app-blue'}`} />
                  Documents
                </CardTitle>
              </CardHeader>
              <CardFooter className="p-3 pt-0">
                <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => setViewMode('document')}>
                  View Files
                </Button>
              </CardFooter>
            </Card>
            
            <Card className={`hover:shadow-sm transition-shadow ${isDark ? 'bg-[#0d0f13] border-[#1a1e26]' : ''}`}>
              <CardHeader className="p-3">
                <CardTitle className="text-sm flex items-center gap-1">
                  <Brain className={`h-4 w-4 ${isDark ? 'text-blue-400' : 'text-app-blue'}`} />
                  Knowledge
                </CardTitle>
              </CardHeader>
              <CardFooter className="p-3 pt-0">
                <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => setViewMode('knowledge')}>
                  Open KB
                </Button>
              </CardFooter>
            </Card>
            
            <Card className={`hover:shadow-sm transition-shadow ${isDark ? 'bg-[#0d0f13] border-[#1a1e26]' : ''}`}>
              <CardHeader className="p-3">
                <CardTitle className="text-sm flex items-center gap-1">
                  <Building2 className={`h-4 w-4 ${isDark ? 'text-blue-400' : 'text-app-blue'}`} />
                  Office
                </CardTitle>
              </CardHeader>
              <CardFooter className="p-3 pt-0">
                <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => setViewMode('office')}>
                  Manager
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </ScrollArea>;
};
export default WelcomeDashboard;