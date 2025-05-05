
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Upload } from 'lucide-react';
import { KnowledgeSidebar } from './knowledge/KnowledgeSidebar';
import { KnowledgeLibrary } from './knowledge/KnowledgeLibrary';
import { KnowledgeTraining } from './knowledge/KnowledgeTraining';
import { AddKnowledgeDialog } from './knowledge/dialogs/AddKnowledgeDialog';
import { UploadFileDialog } from './knowledge/dialogs/UploadFileDialog';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';

const KnowledgeBase = () => {
  const [knowledgeItems, setKnowledgeItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const { toast } = useToast();

  // Filter knowledge items based on selected category and search query
  const filteredItems = knowledgeItems.filter(item => {
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  // Handle adding a new knowledge item
  const handleAddItem = (newItem) => {
    const fullItem = {
      id: uuidv4(),
      title: newItem.title || 'Untitled',
      content: newItem.content || '',
      category: newItem.category || 'docs',
      tags: newItem.tags || [],
      dateAdded: new Date().toLocaleDateString()
    };
    
    setKnowledgeItems([...knowledgeItems, fullItem]);
    setIsAddDialogOpen(false);
    
    toast({
      title: "Knowledge item added",
      description: `"${fullItem.title}" has been added to your knowledge base.`,
    });
  };

  // Handle uploading a file
  const handleUploadFile = (file) => {
    // Convert single file to array to maintain compatibility with existing code
    const files = [file];
    
    const newItems = files.map(file => ({
      id: uuidv4(),
      title: file.name,
      content: `Content from ${file.name}`,
      category: 'docs',
      tags: [file.type.split('/')[1] || 'document'],
      dateAdded: new Date().toLocaleDateString()
    }));
    
    setKnowledgeItems([...knowledgeItems, ...newItems]);
    setIsUploadDialogOpen(false);
    
    toast({
      title: "Files uploaded",
      description: `${files.length} file(s) have been uploaded to your knowledge base.`,
    });
  };

  // Handle deleting a knowledge item
  const handleDeleteItem = (id) => {
    setKnowledgeItems(knowledgeItems.filter(item => item.id !== id));
    
    toast({
      title: "Knowledge item deleted",
      description: "The item has been removed from your knowledge base.",
    });
  };

  // Handle starting the AI training process
  const handleStartTraining = () => {
    setIsTraining(true);
    setTrainingProgress(0);
    
    // Simulate training progress
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          
          toast({
            title: "Training complete",
            description: "Your AI assistant has been successfully trained with your knowledge base.",
          });
          
          return 100;
        }
        return prev + Math.floor(Math.random() * 10) + 1;
      });
    }, 800);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-2xl font-bold">Knowledge Base</h1>
        <div className="flex items-center space-x-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search knowledge base..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
          <Button variant="outline" onClick={() => setIsUploadDialogOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-hidden">
        <Tabs defaultValue="library" className="h-full">
          <TabsList>
            <TabsTrigger value="library">Library</TabsTrigger>
            <TabsTrigger value="training">AI Training</TabsTrigger>
          </TabsList>
          
          <TabsContent value="library" className="h-[calc(100%-2.5rem)] pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
              <KnowledgeSidebar 
                selectedCategory={selectedCategory} 
                knowledgeItems={knowledgeItems}
                onSelectCategory={(categoryId) => {
                  setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
                }} 
              />
              
              <div className="lg:col-span-3 h-full">
                <KnowledgeLibrary 
                  filteredItems={filteredItems}
                  hasKnowledgeItems={knowledgeItems.length > 0}
                  onAddClick={() => setIsAddDialogOpen(true)}
                  onUploadClick={() => setIsUploadDialogOpen(true)}
                  onDeleteItem={handleDeleteItem}
                  searchQuery={searchQuery}
                  onClearFilters={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                  }}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="training" className="h-[calc(100%-2.5rem)] pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
              <KnowledgeSidebar 
                selectedCategory={selectedCategory} 
                knowledgeItems={knowledgeItems}
                onSelectCategory={(categoryId) => {
                  setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
                }} 
              />
              
              <div className="lg:col-span-3 h-full">
                <KnowledgeTraining 
                  knowledgeItems={knowledgeItems}
                  trainingProgress={trainingProgress}
                  isTraining={isTraining}
                  onStartTraining={handleStartTraining}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <AddKnowledgeDialog 
        isOpen={isAddDialogOpen} 
        onClose={() => setIsAddDialogOpen(false)}
        onAddItem={handleAddItem}
      />
      
      <UploadFileDialog 
        isOpen={isUploadDialogOpen} 
        onClose={() => setIsUploadDialogOpen(false)}
        onUploadFile={handleUploadFile}
      />
    </div>
  );
};

export default KnowledgeBase;
