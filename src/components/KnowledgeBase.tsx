
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Upload, Search, Book, Brain, File, Database, Info, Tag } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

const KnowledgeBase = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Sample data for demonstration
  const categories = [
    { id: 'docs', name: 'Documents', icon: <File className="h-4 w-4" /> },
    { id: 'data', name: 'Database Records', icon: <Database className="h-4 w-4" /> },
    { id: 'guides', name: 'Guides', icon: <Book className="h-4 w-4" /> },
    { id: 'info', name: 'Information', icon: <Info className="h-4 w-4" /> },
  ];

  const handleFilterByCategory = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  return (
    <div className="p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Knowledge Base</h2>
          <p className="text-muted-foreground">Manage and train your AI assistant with custom knowledge</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Knowledge
          </Button>
          <Button variant="outline">
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
                    Browse and manage your knowledge base items
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[calc(100%-5rem)] p-0">
                  <ScrollArea className="h-full p-6">
                    <EmptyKnowledgeState />
                    
                    {/* Uncomment this for when there's content
                    <div className="space-y-4">
                      <Accordion type="single" collapsible className="w-full">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <AccordionItem key={i} value={`item-${i}`}>
                            <AccordionTrigger className="hover:bg-accent/50 px-4 rounded-md">
                              <div className="flex items-center">
                                <File className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>Knowledge Item {i + 1}</span>
                                <Badge className="ml-2" variant="outline">Doc</Badge>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4">
                              <div className="space-y-2">
                                <p>This is a sample knowledge item that can be expanded.</p>
                                <div className="flex gap-2">
                                  <Badge variant="outline">
                                    <Tag className="h-3 w-3 mr-1" />
                                    Tag 1
                                  </Badge>
                                  <Badge variant="outline">
                                    <Tag className="h-3 w-3 mr-1" />
                                    Tag 2
                                  </Badge>
                                </div>
                                <div className="flex gap-2 mt-2">
                                  <Button size="sm" variant="outline">Edit</Button>
                                  <Button size="sm" variant="outline">Delete</Button>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                    */}
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
                          No training data available. Add items to your knowledge base first.
                        </p>
                        
                        <div className="mt-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">Training progress</p>
                              <p className="text-sm text-muted-foreground">No training in progress</p>
                            </div>
                            <Badge variant="outline">0%</Badge>
                          </div>
                          
                          <Button className="w-full" disabled>
                            <Brain className="h-4 w-4 mr-2" />
                            Start Training
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
    </div>
  );
};

// Empty state component
const EmptyKnowledgeState = () => (
  <div className="flex flex-col items-center justify-center h-full text-center p-4">
    <div className="rounded-full bg-primary/10 p-3 mb-4">
      <Book className="h-6 w-6 text-primary" />
    </div>
    <h3 className="font-medium text-lg mb-2">No Knowledge Items</h3>
    <p className="text-muted-foreground max-w-md mb-6">
      Your knowledge base is empty. Add documents, data, or other information to train your AI assistant.
    </p>
    <div className="flex gap-3">
      <Button>
        <Plus className="h-4 w-4 mr-2" />
        Add Knowledge
      </Button>
      <Button variant="outline">
        <Upload className="h-4 w-4 mr-2" />
        Upload Files
      </Button>
    </div>
  </div>
);

export default KnowledgeBase;
