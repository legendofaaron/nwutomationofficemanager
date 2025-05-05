
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MessageSquare, BookOpenText, Building2, LayoutDashboard, Sparkles } from 'lucide-react';
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
  
  const bgClass = isSuperDark 
    ? 'bg-black' 
    : isDark 
      ? 'bg-[#0a0f1a]' 
      : 'bg-gradient-to-br from-blue-50 to-indigo-50';
  
  const cardBgClass = isSuperDark
    ? 'bg-[#090909] border-[#151515]'
    : isDark
      ? 'bg-[#0d1117] border-[#1a1e26]'
      : 'bg-white/80 backdrop-blur-sm';
  
  const buttonClass = isSuperDark
    ? 'bg-blue-600 hover:bg-blue-700 text-white'
    : isDark
      ? 'bg-blue-500 hover:bg-blue-600 text-white'
      : 'bg-blue-500 hover:bg-blue-600 text-white';

  const outlineButtonClass = isSuperDark
    ? 'border-[#202020] bg-black hover:bg-[#0a0a0a] text-white'
    : isDark
      ? 'border-blue-900/50 bg-[#111827] hover:bg-[#1e293b] text-white'
      : 'border-blue-200 bg-white/80 hover:bg-blue-50 text-blue-700';

  return (
    <ScrollArea className="h-full">
      <div className={`mx-auto px-4 pt-6 pb-8 max-w-5xl animate-fade-in ${bgClass} min-h-full`}>
        <div className="flex justify-center mb-4 animate-slide-in">
          <Logo />
        </div>
        
        <div className="text-center mb-8 animate-slide-in" style={{animationDelay: '100ms'}}>
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2 tracking-tight">
            Welcome to Office Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A secure, lightweight solution by {branding.companyName} for document management, 
            schedule organization, and enhanced workplace productivity.
          </p>
        </div>

        {/* Intelligent Assistant Card */}
        <Card className={`mb-8 shadow-lg transform hover:scale-[1.01] transition-all ${cardBgClass} animate-slide-in border-2 border-l-blue-500`} style={{animationDelay: '200ms', borderLeftWidth: '4px'}}>
          <CardContent className="py-8 px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-3">
                    <MessageSquare className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Intelligent Assistant</h2>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300">
                  Our intelligent assistant can help you draft documents, organize schedules, 
                  manage your knowledge base, and provide insights for your office operations—all 
                  while keeping your data secure on your local system.
                </p>
              </div>
              
              <Button 
                onClick={startAssistantSetup} 
                className={`px-6 py-6 h-auto text-base ${buttonClass} shadow`}
              >
                Set Up Your Assistant <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Feature Cards Grid */}
        <div className="space-y-5 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Explore Features</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card className={`${cardBgClass} shadow-md hover:shadow-lg transition-all animate-slide-in`} style={{animationDelay: '300ms'}}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mr-3">
                    <BookOpenText className="h-5 w-5 text-indigo-500" />
                  </div>
                  <CardTitle className="text-lg text-gray-800 dark:text-white">Documents</CardTitle>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 min-h-[60px]">
                  Create, edit, and manage your documents with intelligent assistance
                </p>
                <Button 
                  variant="outline" 
                  className={`w-full justify-between ${outlineButtonClass}`}
                  onClick={() => setViewMode('document')}
                >
                  View Files 
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className={`${cardBgClass} shadow-md hover:shadow-lg transition-all animate-slide-in`} style={{animationDelay: '400ms'}}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mr-3">
                    <BookOpenText className="h-5 w-5 text-emerald-500" />
                  </div>
                  <CardTitle className="text-lg text-gray-800 dark:text-white">Knowledge Base</CardTitle>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 min-h-[60px]">
                  Organize and access your company's information efficiently
                </p>
                <Button 
                  variant="outline" 
                  className={`w-full justify-between ${outlineButtonClass}`}
                  onClick={() => setViewMode('knowledge')}
                >
                  Open Knowledge Base 
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className={`${cardBgClass} shadow-md hover:shadow-lg transition-all animate-slide-in`} style={{animationDelay: '500ms'}}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30 mr-3">
                    <Building2 className="h-5 w-5 text-amber-500" />
                  </div>
                  <CardTitle className="text-lg text-gray-800 dark:text-white">Office Manager</CardTitle>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 min-h-[60px]">
                  Streamline operations, schedules, and productivity tracking
                </p>
                <Button 
                  variant="outline" 
                  className={`w-full justify-between ${outlineButtonClass}`}
                  onClick={() => setViewMode('office')}
                >
                  Open Office Manager 
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm animate-fade-in mt-6" style={{animationDelay: '600ms'}}>
          Select a feature from the sidebar or use the Intelligent Assistant to get started
        </p>
      </div>
    </ScrollArea>
  );
};

export default WelcomeDashboard;
