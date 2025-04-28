
import React, { useEffect } from 'react';
import { ArrowRight, Brain, Building2, Database, FileText } from 'lucide-react';
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
        <h1 className="text-4xl font-bold text-app-blue mb-4">Welcome to NorthwesternAI</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your intelligent workplace assistant for managing documents, databases, and office operations.
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
              Efficiently organize and access your documents with our intelligent document management system.
            </p>
            <Button variant="outline" className="w-full" onClick={() => navigate('/dashboard')}>
              View Documents <ArrowRight className="ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-app-blue" />
              Database Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Access and manage your database tables with an intuitive interface.
            </p>
            <Button variant="outline" className="w-full" onClick={() => navigate('/dashboard')}>
              Access Database <ArrowRight className="ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-app-blue" />
              Knowledge Base
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Build and maintain your organization's knowledge with our AI-powered knowledge base.
            </p>
            <Button variant="outline" className="w-full" onClick={() => navigate('/dashboard')}>
              Explore Knowledge Base <ArrowRight className="ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-app-blue" />
              Office Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Streamline your office operations with our comprehensive management tools.
            </p>
            <Button variant="outline" className="w-full" onClick={() => navigate('/dashboard')}>
              Manage Office <ArrowRight className="ml-2" />
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
