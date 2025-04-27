
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Save } from 'lucide-react';
import ScheduleView from './ScheduleView';

const DocumentViewer = () => {
  const { currentFile, aiAssistantOpen, setAiAssistantOpen } = useAppContext();
  const [content, setContent] = useState(currentFile?.content || '');
  
  if (!currentFile) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">Select a document to view or edit</p>
      </div>
    );
  }

  const isSchedule = currentFile.name.toLowerCase().includes('schedule');

  return (
    <div className="relative h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-medium">{currentFile.name}</h2>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon">
            <Save className="h-4 w-4" />
          </Button>
          <Button 
            variant={aiAssistantOpen ? "default" : "outline"}
            size="sm"
            onClick={() => setAiAssistantOpen(!aiAssistantOpen)}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            AI Assistant
          </Button>
        </div>
      </div>
      
      <div className="p-6 pb-20">
        {isSchedule ? (
          <ScheduleView content={content} />
        ) : (
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[500px] resize-none p-4 font-mono text-base leading-relaxed border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Start typing..."
          />
        )}
      </div>
    </div>
  );
};

export default DocumentViewer;
