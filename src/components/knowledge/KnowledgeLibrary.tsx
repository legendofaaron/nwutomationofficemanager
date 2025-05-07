
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Book, File, Database, Info, Tag } from 'lucide-react';
import { KnowledgeItem } from './types';
import { EmptyKnowledgeState } from './EmptyKnowledgeState';
import { categories } from './KnowledgeSidebar';

interface KnowledgeLibraryProps {
  filteredItems: KnowledgeItem[];
  hasKnowledgeItems: boolean;
  onAddClick: () => void;
  onUploadClick: () => void;
  onDeleteItem: (id: string) => void;
  searchQuery: string;
  onClearFilters: () => void;
}

export const KnowledgeLibrary: React.FC<KnowledgeLibraryProps> = ({
  filteredItems,
  hasKnowledgeItems,
  onAddClick,
  onUploadClick,
  onDeleteItem,
  searchQuery,
  onClearFilters
}) => {
  
  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'docs':
        return <File className="h-4 w-4 mr-2 text-muted-foreground" />;
      case 'data':
        return <Database className="h-4 w-4 mr-2 text-muted-foreground" />;
      case 'guides':
        return <Book className="h-4 w-4 mr-2 text-muted-foreground" />;
      case 'info':
        return <Info className="h-4 w-4 mr-2 text-muted-foreground" />;
      default:
        return <File className="h-4 w-4 mr-2 text-muted-foreground" />;
    }
  };

  return (
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
              onAddClick={onAddClick}
              onUploadClick={onUploadClick}
            />
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <p className="text-muted-foreground">No items match your search criteria</p>
              <Button variant="link" onClick={onClearFilters}>
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
                        {getCategoryIcon(item.category)}
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
                              onClick={() => onDeleteItem(item.id)}
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
  );
};
