
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Plus, Upload, Search } from 'lucide-react';
import { toast } from 'sonner';

import { KnowledgeItem } from './types';
import { KnowledgeSidebar } from './KnowledgeSidebar';
import { KnowledgeLibrary } from './KnowledgeLibrary';
import { KnowledgeTraining } from './KnowledgeTraining';
import { AddKnowledgeDialog } from './dialogs/AddKnowledgeDialog';
import { UploadFileDialog } from './dialogs/UploadFileDialog';

const KnowledgeBase = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [isTraining, setIsTraining] = useState(false);

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
  const handleAddItem = (newItem: Partial<KnowledgeItem>) => {
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
    toast.success("Knowledge item added successfully");
  };

  // Handle file upload
  const handleFileUpload = (file: File) => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    // Simulate file processing
    toast.info("Processing file...", { duration: 2000 });
    
    setTimeout(() => {
      const newKnowledgeItem: KnowledgeItem = {
        id: Date.now().toString(),
        title: file.name,
        content: `Content extracted from ${file.name}`,
        category: 'docs',
        tags: ['uploaded', 'document'],
        dateAdded: new Date().toISOString().split('T')[0]
      };

      setKnowledgeItems([...knowledgeItems, newKnowledgeItem]);
      setIsUploadDialogOpen(false);
      toast.success("File processed and added to knowledge base");
    }, 2000);
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
        <KnowledgeSidebar 
          selectedCategory={selectedCategory} 
          knowledgeItems={knowledgeItems}
          onSelectCategory={handleFilterByCategory}
        />

        {/* Main content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search bar */}
          <Card>
            <div className="relative p-6">
              <Search className="absolute left-9 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search knowledge base..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="knowledge" className="h-[calc(100vh-22rem)]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
              <TabsTrigger value="training">AI Training</TabsTrigger>
            </TabsList>

            <TabsContent value="knowledge" className="h-full overflow-hidden">
              <KnowledgeLibrary 
                filteredItems={filteredItems}
                hasKnowledgeItems={hasKnowledgeItems}
                onAddClick={() => setIsAddDialogOpen(true)}
                onUploadClick={() => setIsUploadDialogOpen(true)}
                onDeleteItem={handleDeleteItem}
                searchQuery={searchQuery}
                onClearFilters={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                }}
              />
            </TabsContent>

            <TabsContent value="training" className="h-full overflow-hidden">
              <KnowledgeTraining
                knowledgeItems={knowledgeItems}
                trainingProgress={trainingProgress}
                isTraining={isTraining}
                onStartTraining={handleStartTraining}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Dialogs */}
      <AddKnowledgeDialog 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAddItem={handleAddItem}
      />

      <UploadFileDialog
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        onUploadFile={handleFileUpload}
      />
    </div>
  );
};

export default KnowledgeBase;
