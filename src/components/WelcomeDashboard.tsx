
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MessageSquare, BookOpenText, Building2, LayoutDashboard } from 'lucide-react';
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
  const {
    resolvedTheme
  } = useTheme();
  
  const startAssistantSetup = () => {
    navigate('/setup-assistant');
  };

  const isSuperDark = resolvedTheme === 'superdark';
  const bgClass = isSuperDark ? 'bg-black' : 'bg-[#0a0f1a]';
  const borderClass = isSuperDark ? 'border-[#151515]' : 'border-blue-900/30';

  return (
    <ScrollArea className="h-full">
      <div className={`mx-auto px-4 pt-6 pb-8 max-w-5xl ${isSuperDark ? 'bg-black' : ''}`}>
        <div className="flex justify-center mb-4">
          <Logo />
        </div>
        
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-400 mb-2">Welcome to Office Manager</h1>
          <p className="text-gray-400 text-sm max-w-2xl mx-auto">
            A secure, lightweight solution by {branding.companyName} for document management, 
            schedule organization, and enhanced workplace productivity.
          </p>
        </div>

        {/* Intelligent Assistant Card */}
        <Card className={`mb-8 ${bgClass} ${borderClass}`}>
          <CardContent className="py-6 px-6">
            <div className="flex items-start mb-3">
              <MessageSquare className="h-6 w-6 text-blue-400 mr-2" />
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">Intelligent Assistant</h2>
                <p className="text-sm text-gray-400">
                  A locally-hosted assistant that helps you create documents, manage schedules, and optimize workflow
                </p>
              </div>
            </div>
            
            <p className="text-sm text-gray-300 mb-4">
              Our intelligent assistant can help you draft documents, organize schedules, manage your knowledge base, and 
              provide insights for your office operations—all while keeping your data secure on your local system.
            </p>
            
            <div className="flex justify-center">
              <Button 
                onClick={startAssistantSetup} 
                className={`${isSuperDark ? 'bg-black hover:bg-[#0a0a0a]' : 'bg-[#111827] hover:bg-[#1e293b]'} text-white border ${isSuperDark ? 'border-[#202020]' : 'border-blue-900/50'}`}
              >
                Set Up Your Assistant <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Feature Cards Grid */}
        <div className="space-y-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-200">Explore Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className={`${bgClass} ${borderClass}`}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <BookOpenText className="h-5 w-5 text-blue-400 mr-2" />
                  <CardTitle className="text-lg text-white">Documents</CardTitle>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  Create, edit, and manage your documents with intelligent assistance
                </p>
                <Button 
                  variant="outline" 
                  className={`w-full justify-between ${isSuperDark ? 'border-[#202020] bg-black hover:bg-[#0a0a0a]' : 'border-blue-900/50 bg-[#111827] hover:bg-[#1e293b]'} text-white`}
                  onClick={() => setViewMode('document')}
                >
                  View Files 
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className={`${bgClass} ${borderClass}`}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <BookOpenText className="h-5 w-5 text-blue-400 mr-2" />
                  <CardTitle className="text-lg text-white">Knowledge Base</CardTitle>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  Organize and access your company's information efficiently
                </p>
                <Button 
                  variant="outline" 
                  className={`w-full justify-between ${isSuperDark ? 'border-[#202020] bg-black hover:bg-[#0a0a0a]' : 'border-blue-900/50 bg-[#111827] hover:bg-[#1e293b]'} text-white`}
                  onClick={() => setViewMode('knowledge')}
                >
                  Open Knowledge Base 
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className={`${bgClass} ${borderClass}`}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Building2 className="h-5 w-5 text-blue-400 mr-2" />
                  <CardTitle className="text-lg text-white">Office Manager</CardTitle>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  Streamline operations, schedules, and productivity tracking
                </p>
                <Button 
                  variant="outline" 
                  className={`w-full justify-between ${isSuperDark ? 'border-[#202020] bg-black hover:bg-[#0a0a0a]' : 'border-blue-900/50 bg-[#111827] hover:bg-[#1e293b]'} text-white`}
                  onClick={() => setViewMode('office')}
                >
                  Open Office Manager 
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <p className="text-center text-gray-500 text-sm">
          Select a feature from the sidebar or use the Intelligent Assistant to get started
        </p>
      </div>
    </ScrollArea>
  );
};

export default WelcomeDashboard;
