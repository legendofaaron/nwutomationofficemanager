
import React from 'react';
import { ArrowRight, MessageSquare, BookOpenText, PlayIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';

const WelcomeDashboard = () => {
  const { setAiAssistantOpen, setViewMode } = useAppContext();
  
  const startAssistant = () => {
    setAiAssistantOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-app-blue mb-3">Welcome to NorthwesternAI Dashboard</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Your intelligent workplace companion for document management, knowledge organization, and office productivity.
        </p>
      </div>

      {/* Main Feature Card */}
      <Card className="mb-8 border-app-blue/20 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
          <CardTitle className="text-2xl flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-app-blue" />
            AI Assistant
          </CardTitle>
          <CardDescription>
            Your personal AI-powered assistant ready to help with documents, databases, and more
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="mb-6">
            The AI Assistant can help you create documents, analyze data, organize your knowledge base, 
            and provide insights about your office operations.
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
              Create, edit and manage your documents and spreadsheets with ease
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full text-sm" onClick={() => setViewMode('files')}>
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
              Access and expand your organization's collective knowledge
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
              Manage office operations, schedules, and productivity tracking
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
        <p>Choose a feature from the sidebar or use the AI Assistant to get started</p>
      </div>
    </div>
  );
};

export default WelcomeDashboard;
