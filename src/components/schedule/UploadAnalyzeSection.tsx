
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Loader2, CheckCircle, FileText, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Task } from './ScheduleTypes';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface UploadAnalyzeSectionProps {
  onApplyScheduleData: (task: Task) => void;
  selectedDate: Date;
}

const UploadAnalyzeSection: React.FC<UploadAnalyzeSectionProps> = ({ 
  onApplyScheduleData,
  selectedDate 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedScheduleData, setAnalyzedScheduleData] = useState<Partial<Task> | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnalysisError(null);
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
    setAnalysisError(null);

    // Simulate file analysis with different possible outcomes
    setTimeout(() => {
      setIsAnalyzing(false);
      const random = Math.random();
      
      if (random > 0.9) {
        // Simulate occasional error for realistic experience
        setAnalysisError("Could not parse the selected file. Please ensure it's a valid schedule document.");
        toast.error("Analysis failed", {
          description: "Could not extract schedule data from the file"
        });
      } else {
        // Success case
        setAnalyzedScheduleData({
          title: "Quarterly Planning Session",
          assignedTo: "Michael Brown",
          startTime: "13:00",
          endTime: "15:30",
          location: "Conference Room A"
        });
        
        toast.success("Analysis complete", {
          description: "Schedule data extracted successfully"
        });
      }
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
      endTime: analyzedScheduleData.endTime,
      location: analyzedScheduleData.location
    };
    
    onApplyScheduleData(newTaskFromFile);
    setSelectedFile(null);
    setAnalyzedScheduleData(null);
  };
  
  return (
    <Card className="mt-8 shadow-md transition-all border-t-4 border-t-blue-500 hover:shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          Upload & Analyze Schedule
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground">
          Upload calendar documents or images to extract schedule information automatically
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="schedule-file-upload" className="text-base">Select Schedule File</Label>
            <div className="text-sm text-muted-foreground">
              {selectedFile ? `Selected: ${selectedFile.name}` : "No file selected"}
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-[1fr,auto]">
            <div className="relative">
              <Input 
                id="schedule-file-upload" 
                type="file" 
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.csv,.ics"
                className="h-11 cursor-pointer"
              />
            </div>
            <Button 
              onClick={handleAnalyzeFile} 
              disabled={!selectedFile || isAnalyzing}
              variant="default"
              className="h-11 min-w-[120px] bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4.5 w-4.5" />
                  Analyze
                </>
              )}
            </Button>
          </div>
          
          {analysisError && (
            <Alert variant="destructive" className="mt-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error analyzing file</AlertTitle>
              <AlertDescription>{analysisError}</AlertDescription>
            </Alert>
          )}
        </div>

        {analyzedScheduleData && (
          <div className="mt-4 space-y-4 animate-fade-in">
            <div className="flex items-center gap-2 font-medium text-lg">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h3>Extracted Schedule Data:</h3>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Event</dt>
                  <dd className="text-base">{analyzedScheduleData.title}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Assigned To</dt>
                  <dd className="text-base">{analyzedScheduleData.assignedTo}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Time</dt>
                  <dd className="text-base">{analyzedScheduleData.startTime} - {analyzedScheduleData.endTime}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Location</dt>
                  <dd className="text-base">{analyzedScheduleData.location}</dd>
                </div>
              </dl>
            </div>
            <Button 
              onClick={handleApplyScheduleData}
              className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white"
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
