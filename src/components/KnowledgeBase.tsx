
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Upload, Search, Book, Brain, File, Database, Info, Tag, X, CheckCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  dateAdded: string;
}

const KnowledgeBase = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState<Partial<KnowledgeItem>>({
    title: '',
    content: '',
    category: 'docs',
    tags: []
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [isTraining, setIsTraining] = useState(false);

  // Sample data for demonstration
  const categories = [
    { id: 'docs', name: 'Documents', icon: <File className="h-4 w-4" /> },
    { id: 'data', name: 'Database Records', icon: <Database className="h-4 w-4" /> },
    { id: 'guides', name: 'Guides', icon: <Book className="h-4 w-4" /> },
    { id: 'info', name: 'Information', icon: <Info className="h-4 w-4" /> },
  ];

  // Load initial knowledge items on component mount
  useEffect(() => {
    // In a real app, this would fetch from an API or database
    const sampleItems = [
      {
        id: '1',
        title: 'Getting Started Guide',
        content: 'This guide explains how to get started with our application.',
        category: 'guides',
        tags: ['beginner', 'setup'],
        dateAdded: '2025-05-01'
      },
      {
        id: '2',
        title: 'Database Schema',
        content: 'Detailed information about our database schema and relationships.',
        category: 'data',
        tags: ['database', 'structure'],
        dateAdded: '2025-05-02'
      },
      {
        id: '3',
        title: 'Company Overview',
        content: 'Overview of our company mission, values, and organization.',
        category: 'info',
        tags: ['company', 'about'],
        dateAdded: '2025-05-03'
      }
    ];
    setKnowledgeItems(sampleItems);
  }, []);

  // Handle filtering by category
  const handleFilterByCategory = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  // Get filtered knowledge items based on search and category
  const getFilteredItems = () => {
    return knowledgeItems.filter(item => {
      const matchesSearch = searchQuery === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === null || item.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  };

  // Handle adding a new knowledge item
  const handleAddItem = () => {
    if (!newItem.title || !newItem.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newKnowledgeItem: KnowledgeItem = {
      id: Date.now().toString(),
      title: newItem.title || '',
      content: newItem.content || '',
      category: newItem.category || 'docs',
      tags: newItem.tags || [],
      dateAdded: new Date().toISOString().split('T')[0]
    };

    setKnowledgeItems([...knowledgeItems, newKnowledgeItem]);
    setIsAddDialogOpen(false);
    setNewItem({
      title: '',
      content: '',
      category: 'docs',
      tags: []
    });
    toast.success("Knowledge item added successfully");
  };

  // Handle file upload
  const handleFileUpload = () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    // Simulate file processing
    toast.info("Processing file...", { duration: 2000 });
    
    setTimeout(() => {
      const newKnowledgeItem: KnowledgeItem = {
        id: Date.now().toString(),
        title: selectedFile.name,
        content: `Content extracted from ${selectedFile.name}`,
        category: 'docs',
        tags: ['uploaded', 'document'],
        dateAdded: new Date().toISOString().split('T')[0]
      };

      setKnowledgeItems([...knowledgeItems, newKnowledgeItem]);
      setIsUploadDialogOpen(false);
      setSelectedFile(null);
      toast.success("File processed and added to knowledge base");
    }, 2000);
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Handle deleting a knowledge item
  const handleDeleteItem = (id: string) => {
    setKnowledgeItems(knowledgeItems.filter(item => item.id !== id));
    toast.success("Item deleted successfully");
  };

  // Handle training the AI
  const handleStartTraining = () => {
    setIsTraining(true);
    setTrainingProgress(0);

    // Simulate training progress
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          toast.success("AI training completed");
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  // Add new tag to the current item being edited
  const handleAddTag = (tag: string) => {
    if (tag && !newItem.tags?.includes(tag)) {
      setNewItem({
        ...newItem,
        tags: [...(newItem.tags || []), tag]
      });
    }
  };

  // Remove tag from the current item being edited
  const handleRemoveTag = (tagToRemove: string) => {
    setNewItem({
      ...newItem,
      tags: newItem.tags?.filter(tag => tag !== tagToRemove)
    });
  };

  const filteredItems = getFilteredItems();
  const hasKnowledgeItems = knowledgeItems.length > 0;

  return (
    <div className="p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Knowledge Base</h2>
          <p className="text-muted-foreground">Manage and train your AI assistant with custom knowledge</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Knowledge
          </Button>
          <Button variant="outline" onClick={() => setIsUploadDialogOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
        {/* Left sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Categories</CardTitle>
            <CardDescription>Browse by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleFilterByCategory(category.id)}
                >
                  {category.icon}
                  <span className="ml-2">{category.name}</span>
                  {knowledgeItems.filter(item => item.category === category.id).length > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {knowledgeItems.filter(item => item.category === category.id).length}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search bar */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search knowledge base..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="knowledge" className="h-[calc(100vh-22rem)]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
              <TabsTrigger value="training">AI Training</TabsTrigger>
            </TabsList>

            <TabsContent value="knowledge" className="h-full overflow-hidden">
              <Card className="h-full overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center">
                    <Book className="mr-2 h-5 w-5 text-primary" />
                    Knowledge Library
                  </CardTitle>
                  <CardDescription>
                    {filteredItems.length === 0 && hasKnowledgeItems
                      ? "No items match your search or filter"
                      : `Browse and manage your knowledge base items (${filteredItems.length} items)`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[calc(100%-5rem)] p-0">
                  <ScrollArea className="h-full p-6">
                    {!hasKnowledgeItems ? (
                      <EmptyKnowledgeState 
                        onAddClick={() => setIsAddDialogOpen(true)} 
                        onUploadClick={() => setIsUploadDialogOpen(true)} 
                      />
                    ) : filteredItems.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center p-4">
                        <p className="text-muted-foreground">No items match your search criteria</p>
                        <Button variant="link" onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory(null);
                        }}>
                          Clear filters
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Accordion type="single" collapsible className="w-full">
                          {filteredItems.map((item) => (
                            <AccordionItem key={item.id} value={item.id}>
                              <AccordionTrigger className="hover:bg-accent/50 px-4 rounded-md">
                                <div className="flex items-center">
                                  {item.category === 'docs' && <File className="h-4 w-4 mr-2 text-muted-foreground" />}
                                  {item.category === 'data' && <Database className="h-4 w-4 mr-2 text-muted-foreground" />}
                                  {item.category === 'guides' && <Book className="h-4 w-4 mr-2 text-muted-foreground" />}
                                  {item.category === 'info' && <Info className="h-4 w-4 mr-2 text-muted-foreground" />}
                                  <span>{item.title}</span>
                                  <Badge className="ml-2" variant="outline">
                                    {categories.find(c => c.id === item.category)?.name || 'Doc'}
                                  </Badge>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="px-4">
                                <div className="space-y-2">
                                  <p>{item.content}</p>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {item.tags.map((tag) => (
                                      <Badge key={tag} variant="outline">
                                        <Tag className="h-3 w-3 mr-1" />
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                  <div className="flex justify-between mt-2">
                                    <span className="text-xs text-muted-foreground">
                                      Added: {item.dateAdded}
                                    </span>
                                    <div className="flex gap-2">
                                      <Button size="sm" variant="outline">Edit</Button>
                                      <Button 
                                        size="sm" 
                                        variant="outline" 
                                        onClick={() => handleDeleteItem(item.id)}
                                      >
                                        Delete
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="training" className="h-full overflow-hidden">
              <Card className="h-full overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="mr-2 h-5 w-5 text-primary" />
                    AI Training
                  </CardTitle>
                  <CardDescription>
                    Train your AI assistant with your knowledge base
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[calc(100%-7rem)]">
                  <ScrollArea className="h-full">
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium flex items-center">
                          <Brain className="h-5 w-5 text-primary mr-2" />
                          Training Status
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          {knowledgeItems.length === 0 
                            ? "No training data available. Add items to your knowledge base first."
                            : `${knowledgeItems.length} items available for training.`}
                        </p>
                        
                        <div className="mt-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">Training progress</p>
                              <p className="text-sm text-muted-foreground">
                                {isTraining 
                                  ? "Training in progress..." 
                                  : trainingProgress === 100 
                                    ? "Training complete" 
                                    : "No training in progress"}
                              </p>
                            </div>
                            <Badge variant="outline">{trainingProgress}%</Badge>
                          </div>
                          
                          {trainingProgress > 0 && trainingProgress < 100 && (
                            <Progress value={trainingProgress} className="w-full" />
                          )}
                          
                          <Button 
                            className="w-full" 
                            disabled={knowledgeItems.length === 0 || isTraining}
                            onClick={handleStartTraining}
                          >
                            <Brain className="h-4 w-4 mr-2" />
                            {isTraining ? "Training..." : trainingProgress === 100 ? "Retrain Model" : "Start Training"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Add Knowledge Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Knowledge Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={newItem.title}
                onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                placeholder="Item title"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <select
                id="category"
                value={newItem.category}
                onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="content" className="text-right">
                Content
              </Label>
              <Textarea
                id="content"
                value={newItem.content}
                onChange={(e) => setNewItem({...newItem, content: e.target.value})}
                placeholder="Knowledge content"
                className="col-span-3"
                rows={5}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tags" className="text-right">
                Tags
              </Label>
              <div className="col-span-3">
                <div className="flex gap-2 mb-2 flex-wrap">
                  {newItem.tags?.map(tag => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    id="tagInput"
                    placeholder="Add tag (press Enter)"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.currentTarget;
                        handleAddTag(input.value);
                        input.value = '';
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAddItem}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Files Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="file-upload">Select File</Label>
            <Input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt,.csv"
            />
            {selectedFile && (
              <div className="text-sm font-medium">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleFileUpload}
              disabled={!selectedFile}
            >
              <Upload className="h-4 w-4 mr-2" />
              Process File
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Empty state component
const EmptyKnowledgeState = ({ onAddClick, onUploadClick }: { onAddClick: () => void, onUploadClick: () => void }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-4">
    <div className="rounded-full bg-primary/10 p-3 mb-4">
      <Book className="h-6 w-6 text-primary" />
    </div>
    <h3 className="font-medium text-lg mb-2">No Knowledge Items</h3>
    <p className="text-muted-foreground max-w-md mb-6">
      Your knowledge base is empty. Add documents, data, or other information to train your AI assistant.
    </p>
    <div className="flex gap-3">
      <Button onClick={onAddClick}>
        <Plus className="h-4 w-4 mr-2" />
        Add Knowledge
      </Button>
      <Button variant="outline" onClick={onUploadClick}>
        <Upload className="h-4 w-4 mr-2" />
        Upload Files
      </Button>
    </div>
  </div>
);

export default KnowledgeBase;
