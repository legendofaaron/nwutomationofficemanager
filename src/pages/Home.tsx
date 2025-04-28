
import React, { useEffect } from 'react';
import { ArrowRight, Brain, Building2, Database, FileText, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    if (hasVisited) {
      navigate('/dashboard');
    } else {
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  }, [navigate]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-app-blue mb-4">Welcome to Office Manager</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          A lightweight, locally-hosted Retrieval Augmented Generation (RAG) solution by Northwestern Automation for document creation, knowledge management, and office operations.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-app-blue" />
              Document Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Create and organize documents with intelligent assistance, while maintaining complete data privacy and security.
            </p>
            <Button variant="outline" className="w-full" onClick={() => navigate('/dashboard')}>
              Access Documents <ArrowRight className="ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-app-blue" />
              Local Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              All data remains local to your system, ensuring complete control and confidentiality of your information.
            </p>
            <Button variant="outline" className="w-full" onClick={() => navigate('/dashboard')}>
              Explore Database <ArrowRight className="ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-app-blue" />
              AI-Powered Assistant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Leverage configurable language models to enhance productivity without compromising your data security.
            </p>
            <Button variant="outline" className="w-full" onClick={() => navigate('/dashboard')}>
              Configure Assistant <ArrowRight className="ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-app-blue" />
              Privacy-Focused
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              No data collection, no cloud dependencies, complete privacy. Your information never leaves your system.
            </p>
            <Button variant="outline" className="w-full" onClick={() => navigate('/dashboard')}>
              Learn More <ArrowRight className="ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Button size="lg" onClick={() => navigate('/dashboard')}>
          Get Started <ArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default Home;
