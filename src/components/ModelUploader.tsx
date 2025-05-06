
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { Upload, File, CheckCircle } from 'lucide-react';

interface ModelUploaderProps {
  onModelUploaded: (modelPath: string, modelName: string) => void;
}

export function ModelUploader({ onModelUploaded }: ModelUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check if it's a valid model file (typically .gguf or .bin)
    if (!file.name.endsWith('.gguf') && !file.name.endsWith('.bin')) {
      toast({
        title: "Invalid File Format",
        description: "Please select a valid model file (.gguf or .bin)",
        variant: "destructive"
      });
      return;
    }
    
    // Check file size (allow only files smaller than 5GB)
    if (file.size > 5 * 1024 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Model file must be smaller than 5GB",
        variant: "destructive"
      });
      return;
    }
    
    uploadModel(file);
  };
  
  const uploadModel = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // In a real implementation, this would handle the actual file upload
    // For now, we'll simulate the upload process
    
    // Create a FileReader to simulate reading the file
    const reader = new FileReader();
    
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(progress);
      }
    };
    
    reader.onload = () => {
      // In a real implementation, this is where we would save the file
      // For now, we'll simulate the process
      
      // Simulate processing time
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(100);
        
        // Generate a simulated path for the uploaded model
        const modelPath = `models/${file.name}`;
        const modelName = file.name.replace(/\.(gguf|bin)$/, '');
        
        // Notify parent component about the uploaded model
        onModelUploaded(modelPath, modelName);
        
        toast({
          title: "Upload Complete",
          description: `${file.name} has been uploaded successfully.`,
          variant: "default"
        });
      }, 2000);
    };
    
    reader.onerror = () => {
      setIsUploading(false);
      toast({
        title: "Upload Failed",
        description: "An error occurred while uploading the model.",
        variant: "destructive"
      });
    };
    
    // Start reading a small portion of the file to simulate the upload
    const blob = file.slice(0, 1000000);
    reader.readAsArrayBuffer(blob);
  };
  
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Upload Custom Model</h3>
          <p className="text-xs text-muted-foreground">
            Upload your own GGUF or BIN model files
          </p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".gguf,.bin"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          variant="outline"
          size="sm"
        >
          <Upload className="h-4 w-4 mr-1" />
          Browse
        </Button>
      </div>
      
      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Uploading model file...
          </p>
        </div>
      )}
    </div>
  );
}
