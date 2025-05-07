import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MessageSquare, BookOpenText, Building2, Heart, Coffee, Sparkles, Github, Download, Code } from 'lucide-react';
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
    ? 'bg-gradient-to-br from-black to-[#050505]' 
    : isDark 
      ? 'bg-gradient-to-br from-[#0a0f1a] to-[#111827]' 
      : 'bg-gradient-to-br from-gray-50 to-blue-50/30';
  
  const cardBgClass = isSuperDark
    ? 'bg-[#090909] border-[#151515] shadow-superdark'
    : isDark
      ? 'bg-[#0d1117] border-[#1a1e26] shadow-md'
      : 'bg-white/90 backdrop-blur-sm shadow-elegant hover-lift';
  
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

  const handleOpenGithub = () => {
    window.open('https://github.com/lovable-labs/office-manager', '_blank');
  };

  const handleDownloadSource = () => {
    window.open('https://github.com/lovable-labs/office-manager/archive/refs/heads/main.zip', '_blank');
  };

  return (
    <ScrollArea className="h-full">
      <div className={`mx-auto px-4 pt-6 pb-8 max-w-5xl ${bgClass} min-h-full`}>
        <div className="flex justify-center mb-6 animate-fade-in">
          <Logo className="w-16 h-16" />
        </div>
        
        <div className="text-center mb-10 animate-fade-in" style={{animationDelay: '100ms'}}>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3 tracking-tight">
            Welcome to Office Manager
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A secure, lightweight, 100% free and open-source solution by {branding.companyName} for document management, 
            schedule organization, and enhanced workplace productivity.
          </p>
        </div>

        {/* Open Source Banner */}
        <Card className={`mb-6 transition-all ${cardBgClass} animate-fade-in border-green-500`} style={{animationDelay: '150ms', borderLeftWidth: '4px'}}>
          <CardContent className="py-4 px-4 md:px-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center">
                <Code className="h-5 w-5 md:h-6 md:w-6 text-green-500 mr-3" />
                <div>
                  <h3 className="text-base font-medium">100% Free & Open Source</h3>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
                    Free for commercial and personal use under MIT license
                  </p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline" 
                  size="sm"
                  onClick={handleOpenGithub}
                  className="flex items-center gap-1"
                >
                  <Github className="h-4 w-4" /> View Source
                </Button>
                <Button
                  variant="default" 
                  size="sm"
                  onClick={handleDownloadSource}
                  className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                >
                  <Download className="h-4 w-4" /> Download Source
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Intelligent Assistant Card */}
        <Card className={`mb-10 transition-all ${cardBgClass} animate-fade-in border-l-blue-600`} style={{animationDelay: '200ms', borderLeftWidth: '4px'}}>
          <CardContent className={`py-6 md:py-8 px-4 md:px-6`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-3">
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
                className={`px-4 md:px-6 py-4 md:py-6 h-auto text-sm md:text-base ${buttonClass} whitespace-nowrap`}
              >
                Set Up Assistant <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Feature Cards Grid */}
        <div className="space-y-5 mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg md:text-xl font-medium text-gray-800 dark:text-gray-200">Explore Features</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <Card className={`${cardBgClass} transition-all animate-fade-in`} style={{animationDelay: '300ms'}}>
              <CardHeader className="pb-2">
                <div className="flex items-center mb-2">
                  <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mr-3">
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
                  className={`w-full justify-between text-sm ${outlineButtonClass}`}
                  onClick={() => setViewMode('document')}
                >
                  View Files 
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className={`${cardBgClass} transition-all animate-fade-in`} style={{animationDelay: '400ms'}}>
              <CardHeader className="pb-2">
                <div className="flex items-center mb-2">
                  <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mr-3">
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
                  className={`w-full justify-between text-sm ${outlineButtonClass}`}
                  onClick={() => setViewMode('knowledge')}
                >
                  Open Knowledge 
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className={`${cardBgClass} transition-all animate-fade-in sm:col-span-2 md:col-span-1`} style={{animationDelay: '500ms'}}>
              <CardHeader className="pb-2">
                <div className="flex items-center mb-2">
                  <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30 mr-3">
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
                  className={`w-full justify-between text-sm ${outlineButtonClass}`}
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
        
        {/* Free and Open Source Information */}
        <div className="mt-12 text-center animate-fade-in" style={{animationDelay: '650ms'}}>
          <Card className={`max-w-md mx-auto ${cardBgClass} border-t-4 border-t-green-500 mb-6`}>
            <CardContent className="pt-6 pb-4">
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-green-500" />
                  <h3 className="text-lg font-medium">Free & Open Source</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Office Manager is freely available for both commercial and personal use under the MIT License. 
                  You can modify, distribute, and use it in your projects without restrictions.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button 
                    onClick={handleOpenGithub}
                    className="bg-gray-900 hover:bg-black text-white gap-2"
                  >
                    <Github className="h-4 w-4" /> View Source on GitHub
                  </Button>
                  <Button 
                    onClick={handleDownloadSource}
                    className="bg-green-600 hover:bg-green-700 text-white gap-2"
                  >
                    <Download className="h-4 w-4" /> Download Source
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tip Me Section */}
        <div className="mt-6 text-center animate-fade-in" style={{animationDelay: '700ms'}}>
          <Card className={`max-w-md mx-auto ${cardBgClass} border-t-4 border-t-amber-500`}>
            <CardContent className="pt-6 pb-4">
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                  <Coffee className="h-5 w-5 text-amber-500" />
                  <h3 className="text-lg font-medium">Support the Developer</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Enjoying Office Manager? Consider supporting the developer with a small tip.
                </p>
                <Button 
                  onClick={handleTipMe} 
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white gap-2"
                >
                  <Heart className="h-4 w-4" fill="currentColor" /> Tip @aaronthelegend on PayPal
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
