
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MessageSquare, BookOpenText, Building2, Heart, Coffee, Sparkles, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  const { resolvedTheme } = useTheme();
  
  const startAssistantSetup = () => {
    navigate('/setup-assistant');
  };

  const isSuperDark = resolvedTheme === 'superdark';
  const isDark = resolvedTheme === 'dark' || isSuperDark;
  
  // Enhanced gradient backgrounds for modern look
  const bgClass = isSuperDark 
    ? 'bg-gradient-to-br from-black to-[#050505]' 
    : isDark 
      ? 'bg-gradient-to-br from-[#0a0f1a] to-[#111827]' 
      : 'bg-gradient-to-br from-gray-50 to-blue-50/40';
  
  const cardBgClass = isSuperDark
    ? 'bg-[#090909] border-[#151515] shadow-superdark hover:shadow-superdark-md transition-shadow'
    : isDark
      ? 'bg-[#0d1117] border-[#1a1e26] shadow-md hover:shadow-lg transition-shadow'
      : 'bg-white/95 backdrop-blur-sm shadow-elegant hover-lift transition-all';
  
  const buttonClass = isSuperDark
    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-superdark-sm'
    : isDark
      ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md'
      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm';

  const outlineButtonClass = isSuperDark
    ? 'border-[#202020] bg-black hover:bg-[#0a0a0a] text-white'
    : isDark
      ? 'border-blue-900/50 bg-[#111827] hover:bg-[#1e293b] text-white'
      : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700';
      
  const handleTipMe = () => {
    window.open('https://paypal.me/aaronthelegend', '_blank');
  };

  const handleEmailDeveloper = () => {
    window.location.href = 'mailto:northwesternautomation@gmail.com?subject=Office%20Manager%20Source%20Code%20Request&body=I%20would%20like%20to%20request%20the%20source%20code%20for%20Office%20Manager.';
  };

  return (
    <ScrollArea className="h-full">
      <div className={`mx-auto px-4 md:px-6 pt-6 pb-8 max-w-5xl ${bgClass} min-h-full`}>
        <div className="flex justify-center mb-6 animate-fade-in">
          <Logo className="w-16 h-16 drop-shadow-md" />
        </div>
        
        <div className="text-center mb-10 animate-fade-in" style={{animationDelay: '100ms'}}>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3 tracking-tight">
            Welcome to Office Manager
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A secure, lightweight solution by {branding.companyName} for document management, 
            schedule organization, and enhanced workplace productivity.
          </p>
        </div>

        {/* Intelligent Assistant Card - Enhanced with border accent and improved shadow */}
        <Card className={`mb-10 transition-all ${cardBgClass} animate-fade-in border-l-blue-600`} style={{animationDelay: '200ms', borderLeftWidth: '4px'}}>
          <CardContent className={`py-8 px-4 md:px-8`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center">
                  <div className="p-2.5 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-3.5 shadow-sm">
                    <MessageSquare className="h-5 w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-medium text-gray-800 dark:text-white">Intelligent Assistant</h2>
                </div>
                
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                  Our intelligent assistant can help you draft documents, organize schedules, 
                  manage your knowledge base, and provide insights for your office operations—all 
                  while keeping your data secure on your local system.
                </p>
              </div>
              
              <Button 
                onClick={startAssistantSetup} 
                className={`px-5 md:px-7 py-5 md:py-6 h-auto text-sm md:text-base ${buttonClass} whitespace-nowrap rounded-lg transition-all`}
              >
                Set Up Assistant <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Feature Cards Grid - Enhanced with consistent spacing and improved hover effects */}
        <div className="space-y-5 mb-10">
          <div className="flex items-center gap-2.5 mb-5">
            <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg md:text-xl font-medium text-gray-800 dark:text-gray-200">Explore Features</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
            <Card className={`${cardBgClass} transition-all animate-fade-in`} style={{animationDelay: '300ms'}}>
              <CardHeader className="pb-2">
                <div className="flex items-center mb-2.5">
                  <div className="p-2.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mr-3.5">
                    <BookOpenText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <CardTitle className="text-base md:text-lg text-gray-800 dark:text-white">Documents</CardTitle>
                </div>
                <CardDescription className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  Create, edit and manage your documents with intelligent assistance
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <Button 
                  variant="outline" 
                  className={`w-full justify-between text-sm ${outlineButtonClass} rounded-md`}
                  onClick={() => setViewMode('document')}
                >
                  View Files 
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className={`${cardBgClass} transition-all animate-fade-in`} style={{animationDelay: '400ms'}}>
              <CardHeader className="pb-2">
                <div className="flex items-center mb-2.5">
                  <div className="p-2.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mr-3.5">
                    <BookOpenText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <CardTitle className="text-base md:text-lg text-gray-800 dark:text-white">Knowledge Base</CardTitle>
                </div>
                <CardDescription className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  Organize and access your company's information efficiently
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <Button 
                  variant="outline" 
                  className={`w-full justify-between text-sm ${outlineButtonClass} rounded-md`}
                  onClick={() => setViewMode('knowledge')}
                >
                  Open Knowledge 
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className={`${cardBgClass} transition-all animate-fade-in sm:col-span-2 md:col-span-1`} style={{animationDelay: '500ms'}}>
              <CardHeader className="pb-2">
                <div className="flex items-center mb-2.5">
                  <div className="p-2.5 rounded-full bg-amber-100 dark:bg-amber-900/30 mr-3.5">
                    <Building2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <CardTitle className="text-base md:text-lg text-gray-800 dark:text-white">Office Manager</CardTitle>
                </div>
                <CardDescription className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  Streamline operations, schedules, and productivity tracking
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <Button 
                  variant="outline" 
                  className={`w-full justify-between text-sm ${outlineButtonClass} rounded-md`}
                  onClick={() => setViewMode('office')}
                >
                  Open Office 
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <p className="text-center text-xs md:text-sm text-gray-500 dark:text-gray-400 animate-fade-in mt-8" style={{animationDelay: '600ms'}}>
          Select a feature from the sidebar or use the Intelligent Assistant to get started
        </p>
        
        {/* Contact for Source Code and Tip Developer Section - More subtle and elegant */}
        <div className="mt-12 text-center animate-fade-in" style={{animationDelay: '700ms'}}>
          <Card className={`max-w-xl mx-auto ${cardBgClass} border-t border-t-gray-200 dark:border-t-gray-700`}>
            <CardContent className="pt-6 pb-5">
              <div className="flex items-center justify-center gap-2.5 mb-3.5">
                <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <h3 className="text-base font-medium text-gray-700 dark:text-gray-300">Contact Information</h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-5 max-w-lg mx-auto">
                Have questions about Office Manager? Need additional resources?
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button 
                  onClick={handleEmailDeveloper} 
                  variant="outline"
                  size="sm"
                  className="text-xs border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors"
                >
                  <Mail className="h-3.5 w-3.5 mr-1.5 text-gray-500" /> Contact for Resources
                </Button>
                <Button 
                  onClick={handleTipMe}
                  variant="outline"
                  size="sm"
                  className="text-xs border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors"
                >
                  <Heart className="h-3.5 w-3.5 mr-1.5 text-gray-500" /> Support Development
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
};

export default WelcomeDashboard;
