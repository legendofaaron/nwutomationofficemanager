
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  AlignLeft, AlignCenter, AlignRight, 
  Bold, Italic, Underline, 
  List, ListOrdered, Image, Link, Heading1, Heading2, Heading3
} from 'lucide-react';

interface DocumentToolbarProps {
  onFormatText: (format: string) => void;
}

const DocumentToolbar = ({ onFormatText }: DocumentToolbarProps) => {
  return (
    <div className="border-b border-gray-200/50 px-4 py-2 flex items-center gap-1 bg-white/50 backdrop-blur-sm sticky top-16 z-10 overflow-x-auto">
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="hover:bg-white/90" onClick={() => onFormatText('bold')}>
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-white/90" onClick={() => onFormatText('italic')}>
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-white/90" onClick={() => onFormatText('underline')}>
          <Underline className="h-4 w-4" />
        </Button>
      </div>
      <Separator orientation="vertical" className="mx-2 h-6" />
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="hover:bg-white/90" onClick={() => onFormatText('h1')}>
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-white/90" onClick={() => onFormatText('h2')}>
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-white/90" onClick={() => onFormatText('h3')}>
          <Heading3 className="h-4 w-4" />
        </Button>
      </div>
      <Separator orientation="vertical" className="mx-2 h-6" />
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="hover:bg-white/90" onClick={() => onFormatText('alignLeft')}>
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-white/90" onClick={() => onFormatText('alignCenter')}>
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-white/90" onClick={() => onFormatText('alignRight')}>
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>
      <Separator orientation="vertical" className="mx-2 h-6" />
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="hover:bg-white/90" onClick={() => onFormatText('bulletList')}>
          <List className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-white/90" onClick={() => onFormatText('numberedList')}>
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>
      <Separator orientation="vertical" className="mx-2 h-6" />
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="hover:bg-white/90" onClick={() => onFormatText('image')}>
          <Image className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-white/90" onClick={() => onFormatText('link')}>
          <Link className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DocumentToolbar;
