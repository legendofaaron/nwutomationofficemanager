
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { File, Database, Book, Info, ChevronRight } from 'lucide-react';
import { KnowledgeItem } from './types';
import { cn } from '@/lib/utils';

export const categories = [
  { id: 'docs', name: 'Documents', icon: <File className="h-4 w-4" /> },
  { id: 'data', name: 'Database Records', icon: <Database className="h-4 w-4" /> },
  { id: 'guides', name: 'Guides', icon: <Book className="h-4 w-4" /> },
  { id: 'info', name: 'Information', icon: <Info className="h-4 w-4" /> },
];

interface KnowledgeSidebarProps {
  selectedCategory: string | null;
  knowledgeItems: KnowledgeItem[];
  onSelectCategory: (categoryId: string) => void;
}

export const KnowledgeSidebar: React.FC<KnowledgeSidebarProps> = ({ 
  selectedCategory, 
  knowledgeItems, 
  onSelectCategory 
}) => {
  return (
    <Card className="lg:col-span-1 h-full overflow-hidden shadow-sm border-muted">
      <CardHeader className="pb-3 bg-muted/30">
        <CardTitle className="text-lg font-medium">Knowledge Categories</CardTitle>
        <CardDescription>Browse your knowledge base</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {categories.map((category) => {
            const itemCount = knowledgeItems.filter(item => item.category === category.id).length;
            const isSelected = selectedCategory === category.id;
            
            return (
              <Button
                key={category.id}
                variant={isSelected ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start rounded-none px-4 py-2.5 h-auto text-sm transition-all",
                  isSelected ? "bg-secondary font-medium" : "hover:bg-secondary/50",
                  isSelected && "border-l-4 border-primary"
                )}
                onClick={() => onSelectCategory(category.id)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    {category.icon}
                    <span>{category.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {itemCount > 0 && (
                      <Badge variant={isSelected ? "default" : "secondary"} className="ml-auto">
                        {itemCount}
                      </Badge>
                    )}
                    {isSelected && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
