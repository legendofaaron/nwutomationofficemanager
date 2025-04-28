
import React from 'react';
import { ArrowRight, MessageSquare, BookOpenText, PlayIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';
import { Logo } from './Logo';

const WelcomeDashboard = () => {
  const {
    setAiAssistantOpen,
    setViewMode
  } = useAppContext();

  const startAssistant = () => {
    setAiAssistantOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex justify-center mb-8">
        <Logo />
      </div>
      
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-app-blue mb-3">Welcome to Office Manager</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          A secure, lightweight solution by Northwestern Automation for document management, schedule organization, and enhanced workplace productivity.
        </p>
      </div>

      {/* Main Feature Card */}
      <Card className="mb-8 border-app-blue/20 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
          <CardTitle className="text-2xl flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-app-blue" />
            Intelligent Assistant
          </CardTitle>
          <CardDescription>
            A locally-hosted assistant that helps you create documents, manage schedules, and optimize workflow
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="mb-6">
            Our intelligent assistant can help you draft documents, organize schedules, manage your knowledge base, 
            and provide insights for your office operations—all while keeping your data secure on your local system.
          </p>
          <div className="flex justify-center">
            <Button onClick={startAssistant} size="lg" className="gap-2">
              Start Your Assistant <PlayIcon className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Explore Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpenText className="h-5 w-5 text-app-blue" />
              Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Create, edit, and manage your documents with intelligent assistance
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full text-sm" onClick={() => setViewMode('document')}>
              View Files <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpenText className="h-5 w-5 text-app-blue" />
              Knowledge Base
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Organize and access your company's information efficiently
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full text-sm" onClick={() => setViewMode('knowledge')}>
              Open Knowledge Base <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpenText className="h-5 w-5 text-app-blue" />
              Office Manager
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Streamline operations, schedules, and productivity tracking
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full text-sm" onClick={() => setViewMode('office')}>
              Open Office Manager <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="text-center text-gray-500 text-sm mt-8">
        <p>Select a feature from the sidebar or use the Intelligent Assistant to get started</p>
      </div>
    </div>
  );
};

export default WelcomeDashboard;
