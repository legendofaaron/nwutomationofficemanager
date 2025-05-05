
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { File, Database, Book, Info } from 'lucide-react';
import { KnowledgeItem } from './types';

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
              onClick={() => onSelectCategory(category.id)}
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
  );
};
