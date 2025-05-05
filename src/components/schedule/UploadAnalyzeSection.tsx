
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Task } from './ScheduleTypes';
import { toast } from 'sonner';
import { Upload, FileText, FileQuestion } from 'lucide-react';

interface UploadAnalyzeSectionProps {
  selectedDate: Date;
  onApplyScheduleData: (task: Task) => void;
}

const UploadAnalyzeSection: React.FC<UploadAnalyzeSectionProps> = ({ 
  selectedDate,
  onApplyScheduleData 
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    
    if (selectedFile) {
      toast.success("File selected", {
        description: selectedFile.name,
        duration: 3000
      });
    }
  };
  
  const handleAnalyze = () => {
    if (!file) {
      toast.error("Please select a file to analyze");
      return;
    }
    
    setAnalyzing(true);
    
    // Simulate analysis with a timeout (in a real app, this would call an API)
    setTimeout(() => {
      setAnalyzing(false);
      
      // Create a mock task from the "analyzed" file
      const mockTask: Task = {
        id: Date.now().toString(),
        title: `Task from ${file.name}`,
        date: selectedDate,
        completed: false,
        startTime: '10:00',
        endTime: '11:30',
        location: 'Extracted from file',
        assignedTo: 'John Smith'
      };
      
      onApplyScheduleData(mockTask);
      
      // Reset file selection
      setFile(null);
      if (document.getElementById('file-upload') instanceof HTMLInputElement) {
        (document.getElementById('file-upload') as HTMLInputElement).value = '';
      }
      
      toast.success("Analysis complete", {
        description: "Schedule data has been extracted and applied"
      });
    }, 2000);
  };
  
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground mb-4">
        Upload calendar documents or images to extract schedule information automatically
      </p>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="border border-dashed border-border rounded-lg p-6 text-center bg-muted/20 hover:bg-muted/30 transition-colors">
            <label 
              htmlFor="file-upload" 
              className="flex flex-col items-center justify-center gap-2 cursor-pointer"
            >
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-sm font-medium">
                {file ? file.name : "Choose a file"}
              </div>
              <p className="text-xs text-muted-foreground max-w-[300px]">
                Drag and drop or click to select a file (.pdf, .jpg, .png)
              </p>
              <Input 
                id="file-upload"
                type="file" 
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
          
          <Button 
            onClick={handleAnalyze}
            disabled={!file || analyzing}
            className="w-full"
            variant="default"
          >
            {analyzing ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Analyzing...
              </>
            ) : (
              <>Analyze File</>
            )}
          </Button>
        </div>
        
        <Card className="border-dashed p-4 flex flex-col items-center justify-center text-center">
          {file ? (
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-sm font-medium">Ready to Analyze</div>
              <p className="text-xs text-muted-foreground">
                Click "Analyze File" to extract schedule data from {file.name}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 rounded-full bg-muted">
                <FileQuestion className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="text-sm font-medium">No File Selected</div>
              <p className="text-xs text-muted-foreground">
                Select a file to extract schedule information
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default UploadAnalyzeSection;
