
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentTemplate, documentTemplates, generateDocumentFromTemplate } from './DocumentTemplates';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/context/AppContext';
import { Wand2, Loader2, FileText, Save } from 'lucide-react';
import { usePremiumFeature } from '@/hooks/usePremiumFeature';

interface DocumentGeneratorProps {
  onClose: () => void;
}

const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({ onClose }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate>(documentTemplates[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const { setFiles, files, setCurrentFile, setViewMode } = useAppContext();
  const { checkAccess, PremiumFeatureGate } = usePremiumFeature();

  const handleTemplateChange = (templateId: string) => {
    const template = documentTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerateDocument = async () => {
    // Check for premium access to AI document generation
    if (!checkAccess('Document Generation')) {
      return;
    }

    // Validate required fields
    if (!formValues.name) {
      toast({
        title: "Document name required",
        description: "Please enter a document name",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsGenerating(true);
      
      toast({
        title: "Generating document",
        description: "Creating your document with AI assistance...",
      });
      
      // Generate content based on the template
      const generatedContent = await generateDocumentFromTemplate(
        selectedTemplate, 
        formValues
      );
      
      // Create new document
      const newDoc = {
        id: `doc-${Date.now()}`,
        name: formValues.name || "New Document",
        type: "document" as const,
        content: generatedContent
      };

      // Add to files
      setFiles([...files, newDoc]);
      setCurrentFile(newDoc);
      setViewMode('document');
      
      toast({
        title: "Document created",
        description: `"${newDoc.name}" has been created successfully with AI-generated content`,
        duration: 3000,
      });
      
      onClose();
    } catch (error) {
      console.error("Error generating document:", error);
      toast({
        title: "Generation failed",
        description: "There was an error generating your document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto border border-gray-200 dark:border-gray-800">
      <PremiumFeatureGate />
      
      <CardContent className="pt-6">
        <Tabs defaultValue="report">
          <TabsList className="grid grid-cols-3 mb-6">
            {documentTemplates.map(template => (
              <TabsTrigger 
                key={template.id} 
                value={template.id}
                onClick={() => handleTemplateChange(template.id)}
              >
                {template.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {documentTemplates.map(template => (
            <TabsContent key={template.id} value={template.id} className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">{template.name}</h3>
                <p className="text-muted-foreground text-sm">{template.description}</p>
              </div>
              
              <div className="space-y-4">
                {template.placeholders.map(field => (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={field} className="capitalize">
                      {field}
                    </Label>
                    
                    {field === 'purpose' || field === 'summary' ? (
                      <Textarea
                        id={field}
                        placeholder={`Enter ${field}...`}
                        className="min-h-[100px]"
                        value={formValues[field] || ''}
                        onChange={e => handleInputChange(field, e.target.value)}
                      />
                    ) : (
                      <Input
                        id={field}
                        placeholder={`Enter ${field}...`}
                        value={formValues[field] || ''}
                        onChange={e => handleInputChange(field, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">AI will generate content for:</h4>
                <ul className="grid grid-cols-2 gap-2">
                  {template.aiGenerated.map(field => (
                    <li key={field} className="flex items-center text-sm text-muted-foreground">
                      <Wand2 className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                      <span className="capitalize">{field}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleGenerateDocument} 
                  disabled={isGenerating}
                  className="min-w-[140px]"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Generate Document
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DocumentGenerator;

