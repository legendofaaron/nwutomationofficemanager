
import React, { useState } from 'react';
import { 
  Card, CardHeader, CardTitle, CardContent, CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Task } from './ScheduleTypes';

interface UploadAnalyzeSectionProps {
  selectedDate: Date;
  onAddTask: (task: Task) => void;
}

const UploadAnalyzeSection: React.FC<UploadAnalyzeSectionProps> = ({ 
  selectedDate, 
  onAddTask 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedScheduleData, setAnalyzedScheduleData] = useState<Partial<Task> | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setAnalyzedScheduleData(null);
    }
  };

  const handleAnalyzeFile = () => {
    if (!selectedFile) {
      toast("Please select a file to analyze");
      return;
    }

    setIsAnalyzing(true);

    // Simulate file analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzedScheduleData({
        title: "Quarterly Planning Session",
        assignedTo: "Michael Brown",
        startTime: "13:00",
        endTime: "15:30"
      });
      
      toast("Schedule data extracted successfully");
    }, 1500);
  };

  const handleApplyScheduleData = () => {
    if (!analyzedScheduleData) return;
    
    const newTaskFromFile: Task = {
      id: Date.now().toString(),
      title: analyzedScheduleData.title || 'Untitled Task',
      date: selectedDate,
      completed: false,
      assignedTo: analyzedScheduleData.assignedTo,
      startTime: analyzedScheduleData.startTime,
      endTime: analyzedScheduleData.endTime
    };
    
    onAddTask(newTaskFromFile);
    setSelectedFile(null);
    setAnalyzedScheduleData(null);
    
    toast("New task added from analyzed file");
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Upload & Analyze Schedule</CardTitle>
        <CardDescription>Upload calendar documents or images to extract schedule information automatically</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="schedule-file-upload">Select Schedule File</Label>
          <div className="flex gap-4">
            <Input 
              id="schedule-file-upload" 
              type="file" 
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.csv,.ics"
            />
            <Button 
              onClick={handleAnalyzeFile} 
              disabled={!selectedFile || isAnalyzing}
              variant="secondary"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Analyze
                </>
              )}
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            {selectedFile ? `Selected: ${selectedFile.name}` : "No file selected"}
          </div>
        </div>

        {analyzedScheduleData && (
          <div className="mt-4 space-y-4">
            <h3 className="font-medium">Extracted Schedule Data:</h3>
            <div className="bg-muted rounded-md p-3">
              <pre className="text-sm whitespace-pre-wrap">
                {JSON.stringify(analyzedScheduleData, null, 2)}
              </pre>
            </div>
            <Button 
              onClick={handleApplyScheduleData}
              className="gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Add to Calendar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UploadAnalyzeSection;
