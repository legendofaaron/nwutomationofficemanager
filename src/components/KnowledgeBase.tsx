
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Book, Brain } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const KnowledgeBase = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Knowledge Base & Training</h2>
      </div>

      <Tabs defaultValue="knowledge" className="space-y-4">
        <TabsList>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          <TabsTrigger value="training">AI Training</TabsTrigger>
        </TabsList>

        <TabsContent value="knowledge" className="space-y-4">
          <div className="flex items-center gap-4">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Knowledge
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
          </div>

          <div className="grid gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Book className="h-5 w-5 text-app-blue" />
                <h3 className="font-medium">Knowledge Base Items</h3>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                No items in the knowledge base yet. Add some knowledge to get started.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-app-blue" />
              <h3 className="font-medium">Training Status</h3>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              No training data available. Add items to your knowledge base first.
            </p>
            <Button className="mt-4" disabled>
              <Brain className="h-4 w-4 mr-2" />
              Start Training
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KnowledgeBase;
