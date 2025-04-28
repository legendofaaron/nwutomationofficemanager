
import React from 'react';
import { ArrowRight, MessageSquare, BookOpenText, PlayIcon, Settings, Shield } from 'lucide-react';
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
        <h1 className="text-3xl font-bold text-app-blue mb-3">Welcome to Office Manager</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Your locally-hosted Retrieval Augmented Generation (RAG) solution for document creation, knowledge management, and office operations.
        </p>
      </div>

      {/* Main Feature Card */}
      <Card className="mb-8 border-app-blue/20 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
          <CardTitle className="text-2xl flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-app-blue" />
            RAG Assistant
          </CardTitle>
          <CardDescription>
            A privacy-focused assistant that leverages configurable language models while keeping your data local
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="mb-6">
            The Office Manager assistant helps you create documents, organize schedules, and manage office operations 
            without sending your data to external servers. Select from multiple language models to tailor the experience 
            to your specific requirements and privacy preferences.
          </p>
          <div className="flex justify-center">
            <Button onClick={startAssistant} size="lg" className="gap-2">
              Launch Assistant <PlayIcon className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Core Capabilities</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpenText className="h-5 w-5 text-app-blue" />
              Document Creation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Generate professional documents and spreadsheets with intelligent assistance while maintaining complete data privacy
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full text-sm" onClick={() => setViewMode('files')}>
              Access Documents <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpenText className="h-5 w-5 text-app-blue" />
              Knowledge Repository
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Build and access organizational knowledge with secure, locally-stored information retrieval
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full text-sm" onClick={() => setViewMode('knowledge')}>
              Access Knowledge Base <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="h-5 w-5 text-app-blue" />
              Office Operations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Manage schedules, resources, and administrative tasks with privacy-preserving efficiency tools
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full text-sm" onClick={() => setViewMode('office')}>
              Access Office Tools <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="text-center text-gray-500 text-sm mt-8">
        <p>Select a feature from the sidebar or launch the RAG Assistant to begin</p>
      </div>
    </div>
  );
};

export default WelcomeDashboard;
