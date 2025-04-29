
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, FileText, Image, Upload, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

// Define file types we can handle
type TargetSection = 'employees' | 'schedule' | 'invoices' | 'bookings';

interface AnalysisResult {
  id: string;
  filename: string;
  targetSection: TargetSection;
  status: 'processing' | 'completed' | 'error';
  extractedData?: Record<string, any>;
  previewUrl?: string;
  error?: string;
}

const UploadAnalyzeView = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [targetSection, setTargetSection] = useState<TargetSection>('employees');
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };
  
  const handleUpload = () => {
    if (files.length === 0) {
      toast.error("Please select files to upload");
      return;
    }
    
    setIsUploading(true);
    
    // Simulate file processing
    const newResults: AnalysisResult[] = files.map(file => {
      const isImage = file.type.startsWith('image/');
      return {
        id: Math.random().toString(36).substring(2, 9),
        filename: file.name,
        targetSection,
        status: 'processing',
        previewUrl: isImage ? URL.createObjectURL(file) : undefined
      };
    });
    
    setAnalysisResults([...analysisResults, ...newResults]);
    
    // Mock processing delay
    setTimeout(() => {
      setAnalysisResults(prev => 
        prev.map(result => {
          const isBeingProcessed = newResults.some(r => r.id === result.id);
          if (isBeingProcessed) {
            // Mock extracted data based on target section
            let extractedData: Record<string, any> = {};
            
            switch (targetSection) {
              case 'employees':
                extractedData = {
                  name: "John Smith",
                  role: "Marketing Specialist",
                  department: "Marketing",
                  email: "john.smith@company.com",
                  phone: "555-1234"
                };
                break;
              case 'schedule':
                extractedData = {
                  title: "Marketing Meeting",
                  date: "2025-05-15",
                  startTime: "10:00",
                  endTime: "11:30",
                  attendees: ["John Smith", "Jane Doe"]
                };
                break;
              case 'invoices':
                extractedData = {
                  invoiceNumber: "INV-2025-0042",
                  date: "2025-04-28",
                  amount: "$1,250.00",
                  client: "Acme Corp",
                  dueDate: "2025-05-28"
                };
                break;
              case 'bookings':
                extractedData = {
                  resourceName: "Conference Room A",
                  date: "2025-05-10",
                  startTime: "14:00",
                  endTime: "16:00",
                  bookedBy: "Marketing Team"
                };
                break;
            }
            
            return {
              ...result,
              status: 'completed',
              extractedData
            };
          }
          return result;
        })
      );
      
      setIsUploading(false);
      setFiles([]);
      toast.success(`Files processed successfully for ${targetSection}`);
    }, 2000);
  };
  
  const handleApplyData = (result: AnalysisResult) => {
    toast.success(`Applied data to ${result.targetSection} section`);
    // Here we would actually save the data to the relevant section
  };
  
  // Group results by target section
  const resultsBySection: Record<TargetSection, AnalysisResult[]> = {
    employees: analysisResults.filter(r => r.targetSection === 'employees'),
    schedule: analysisResults.filter(r => r.targetSection === 'schedule'),
    invoices: analysisResults.filter(r => r.targetSection === 'invoices'),
    bookings: analysisResults.filter(r => r.targetSection === 'bookings'),
  };

  return (
    <div className="p-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Upload & Analyze Documents</h2>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload Files</CardTitle>
            <CardDescription>
              Upload documents, images, or spreadsheets to extract information for your office management system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="target-section">Target Section</Label>
                <Select 
                  value={targetSection} 
                  onValueChange={(value) => setTargetSection(value as TargetSection)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employees">Employees</SelectItem>
                    <SelectItem value="schedule">Schedule</SelectItem>
                    <SelectItem value="invoices">Invoices</SelectItem>
                    <SelectItem value="bookings">Bookings</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col gap-2">
                <Label htmlFor="file-upload">Select Files</Label>
                <div className="flex gap-4">
                  <Input 
                    id="file-upload" 
                    type="file" 
                    multiple 
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx,.csv"
                  />
                  <Button 
                    onClick={handleUpload} 
                    disabled={isUploading || files.length === 0}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload & Analyze
                      </>
                    )}
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {files.length > 0 ? `${files.length} file(s) selected` : "No files selected"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Results</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {analysisResults.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {analysisResults.map(result => (
                  <AnalysisResultCard 
                    key={result.id} 
                    result={result} 
                    onApply={() => handleApplyData(result)} 
                  />
                ))}
              </div>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No analysis results</AlertTitle>
                <AlertDescription>
                  Upload and analyze files to see results.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
          
          {(Object.keys(resultsBySection) as TargetSection[]).map((section) => (
            <TabsContent key={section} value={section}>
              {resultsBySection[section].length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {resultsBySection[section].map(result => (
                    <AnalysisResultCard 
                      key={result.id} 
                      result={result} 
                      onApply={() => handleApplyData(result)} 
                    />
                  ))}
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No {section} analysis results</AlertTitle>
                  <AlertDescription>
                    Upload and analyze files targeted for {section} to see results.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

interface AnalysisResultCardProps {
  result: AnalysisResult;
  onApply: () => void;
}

const AnalysisResultCard = ({ result, onApply }: AnalysisResultCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isImage = result.previewUrl !== undefined;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isImage ? (
              <Image className="h-5 w-5 text-blue-500" />
            ) : (
              <FileText className="h-5 w-5 text-amber-500" />
            )}
            <CardTitle className="text-base truncate">{result.filename}</CardTitle>
          </div>
          {result.status === 'processing' && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
          {result.status === 'completed' && (
            <CheckCircle className="h-4 w-4 text-green-500" />
          )}
          {result.status === 'error' && (
            <AlertCircle className="h-4 w-4 text-red-500" />
          )}
        </div>
        <CardDescription>
          Target section: <span className="capitalize">{result.targetSection}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {result.previewUrl && (
          <div className="mb-4">
            <img 
              src={result.previewUrl} 
              alt={result.filename} 
              className="w-full h-32 object-cover rounded-md"
            />
          </div>
        )}
        
        {result.status === 'processing' && (
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Analyzing document...
          </div>
        )}
        
        {result.status === 'error' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{result.error || "Failed to analyze document"}</AlertDescription>
          </Alert>
        )}
        
        {result.status === 'completed' && result.extractedData && (
          <>
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium">Extracted Data</h4>
              <Button 
                variant="link" 
                size="sm" 
                className="p-0 h-auto text-xs"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? "Hide details" : "Show details"}
              </Button>
            </div>
            
            {isOpen && (
              <div className="text-sm rounded bg-muted p-2 mb-2 overflow-auto max-h-40">
                <pre className="whitespace-pre-wrap text-xs">
                  {JSON.stringify(result.extractedData, null, 2)}
                </pre>
              </div>
            )}
          </>
        )}
      </CardContent>
      {result.status === 'completed' && (
        <CardFooter>
          <Button 
            size="sm" 
            className="w-full"
            onClick={onApply}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Apply to {result.targetSection}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default UploadAnalyzeView;
