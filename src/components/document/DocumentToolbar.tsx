
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  AlignLeft, AlignCenter, AlignRight, 
  Bold, Italic, Underline, 
  List, ListOrdered, Image, Link 
} from 'lucide-react';

const DocumentToolbar = () => {
  return (
    <div className="border-b border-gray-200/50 px-4 py-2 flex items-center gap-1 bg-white/50 backdrop-blur-sm sticky top-16 z-10">
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="hover:bg-white/90">
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-white/90">
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-white/90">
          <Underline className="h-4 w-4" />
        </Button>
      </div>
      <Separator orientation="vertical" className="mx-2 h-6" />
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="hover:bg-white/90">
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-white/90">
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-white/90">
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>
      <Separator orientation="vertical" className="mx-2 h-6" />
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="hover:bg-white/90">
          <List className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-white/90">
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>
      <Separator orientation="vertical" className="mx-2 h-6" />
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="hover:bg-white/90">
          <Image className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-white/90">
          <Link className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DocumentToolbar;
