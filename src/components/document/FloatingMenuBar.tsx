import React, { useState, useEffect } from 'react';
import { 
  File, Edit, Eye, FileInput, CircleDashed, HelpCircle, 
  FileText, Download, Printer, Share2, Save
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FloatingMenuBarProps {
  onSave?: () => void;
  onFormatText?: (format: string) => void;
}

const FloatingMenuBar: React.FC<FloatingMenuBarProps> = ({
  onSave,
  onFormatText,
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const isSuperDark = resolvedTheme === 'superdark';
  
  const [isVisible, setIsVisible] = useState(false);
  const [mouseAtTop, setMouseAtTop] = useState(false);
  
  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Show when mouse is near the top of the window (within 20px)
      const isNearTop = e.clientY < 20;
      setMouseAtTop(isNearTop);
      
      // If mouse is near top, make visible immediately
      // Otherwise, use a timeout to hide
      if (isNearTop && !isVisible) {
        setIsVisible(true);
      } else if (!isNearTop && isVisible) {
        // We'll keep it open for a bit to avoid flickering
        // when the user moves slightly away from the menu
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isVisible]);
  
  // Effect to handle hiding the menu with a delay
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (!mouseAtTop && isVisible) {
      timer = setTimeout(() => {
        setIsVisible(false);
      }, 1000); // 1 second delay before hiding
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [mouseAtTop, isVisible]);
  
  // Get theme-specific styles
  const getMenuBarStyles = () => {
    if (isSuperDark) return 'bg-black border-[#181818]';
    if (isDark) return 'bg-[#0D1117] border-[#1a1e26]';
    return 'bg-white border-gray-200';
  };
  
  const getButtonHoverStyles = () => {
    if (isSuperDark || isDark) return 'hover:bg-[#1E2430] hover:text-white';
    return 'hover:bg-gray-100 hover:text-gray-900';
  };
  
  const getTextColor = () => {
    if (isSuperDark || isDark) return 'text-gray-300';
    return 'text-gray-700';
  };
  
  // Action handlers
  const handleAction = (action: string) => {
    switch (action) {
      case 'save':
        if (onSave) onSave();
        else toast.success('Document saved');
        break;
      case 'print':
        window.print();
        toast.success('Printing document');
        break;
      case 'download':
        toast.success('Downloading document');
        break;
      case 'share':
        toast.success('Share dialog opened');
        break;
      case 'new-schedule':
        toast.success('Creating new schedule');
        break;
      default:
        if (onFormatText && action.startsWith('format-')) {
          const format = action.replace('format-', '');
          onFormatText(format);
        }
        break;
    }
  };
  
  // Menu content for each menu item
  const fileMenuContent = (
    <div className="w-48 py-1">
      <Button 
        variant="ghost" 
        className={`w-full justify-start text-left rounded-none ${getTextColor()} ${getButtonHoverStyles()}`}
        onClick={() => handleAction('new-document')}
      >
        New Document
      </Button>
      <Button 
        variant="ghost" 
        className={`w-full justify-start text-left rounded-none ${getTextColor()} ${getButtonHoverStyles()}`}
        onClick={() => handleAction('new-schedule')}
      >
        New Schedule
      </Button>
      <Button 
        variant="ghost" 
        className={`w-full justify-start text-left rounded-none ${getTextColor()} ${getButtonHoverStyles()}`}
        onClick={() => handleAction('open')}
      >
        Open...
      </Button>
      <hr className="my-1 border-gray-200 dark:border-gray-700" />
      <Button 
        variant="ghost" 
        className={`w-full justify-start text-left rounded-none ${getTextColor()} ${getButtonHoverStyles()}`}
        onClick={() => handleAction('save')}
      >
        Save
      </Button>
      <Button 
        variant="ghost" 
        className={`w-full justify-start text-left rounded-none ${getTextColor()} ${getButtonHoverStyles()}`}
        onClick={() => handleAction('save-as')}
      >
        Save As...
      </Button>
      <hr className="my-1 border-gray-200 dark:border-gray-700" />
      <Button 
        variant="ghost" 
        className={`w-full justify-start text-left rounded-none ${getTextColor()} ${getButtonHoverStyles()}`}
        onClick={() => handleAction('print')}
      >
        Print
      </Button>
    </div>
  );
  
  const editMenuContent = (
    <div className="w-48 py-1">
      <Button 
        variant="ghost" 
        className={`w-full justify-start text-left rounded-none ${getTextColor()} ${getButtonHoverStyles()}`}
        onClick={() => handleAction('format-undo')}
      >
        Undo
      </Button>
      <Button 
        variant="ghost" 
        className={`w-full justify-start text-left rounded-none ${getTextColor()} ${getButtonHoverStyles()}`}
        onClick={() => handleAction('format-redo')}
      >
        Redo
      </Button>
      <hr className="my-1 border-gray-200 dark:border-gray-700" />
      <Button 
        variant="ghost" 
        className={`w-full justify-start text-left rounded-none ${getTextColor()} ${getButtonHoverStyles()}`}
        onClick={() => handleAction('cut')}
      >
        Cut
      </Button>
      <Button 
        variant="ghost" 
        className={`w-full justify-start text-left rounded-none ${getTextColor()} ${getButtonHoverStyles()}`}
        onClick={() => handleAction('copy')}
      >
        Copy
      </Button>
      <Button 
        variant="ghost" 
        className={`w-full justify-start text-left rounded-none ${getTextColor()} ${getButtonHoverStyles()}`}
        onClick={() => handleAction('paste')}
      >
        Paste
      </Button>
    </div>
  );
  
  const viewMenuContent = (
    <div className="w-48 py-1">
      <Button 
        variant="ghost" 
        className={`w-full justify-start text-left rounded-none ${getTextColor()} ${getButtonHoverStyles()}`}
        onClick={() => handleAction('zoom-in')}
      >
        Zoom In
      </Button>
      <Button 
        variant="ghost" 
        className={`w-full justify-start text-left rounded-none ${getTextColor()} ${getButtonHoverStyles()}`}
        onClick={() => handleAction('zoom-out')}
      >
        Zoom Out
      </Button>
      <hr className="my-1 border-gray-200 dark:border-gray-700" />
      <Button 
        variant="ghost" 
        className={`w-full justify-start text-left rounded-none ${getTextColor()} ${getButtonHoverStyles()}`}
        onClick={() => handleAction('fullscreen')}
      >
        Full Screen
      </Button>
    </div>
  );
  
  const insertMenuContent = (
    <div className="w-48 py-1">
      <Button 
        variant="ghost" 
        className={`w-full justify-start text-left rounded-none ${getTextColor()} ${getButtonHoverStyles()}`}
        onClick={() => handleAction('insert-table')}
      >
        Table
      </Button>
      <Button 
        variant="ghost" 
        className={`w-full justify-start text-left rounded-none ${getTextColor()} ${getButtonHoverStyles()}`}
        onClick={() => handleAction('insert-image')}
      >
        Image
      </Button>
      <Button 
        variant="ghost" 
        className={`w-full justify-start text-left rounded-none ${getTextColor()} ${getButtonHoverStyles()}`}
        onClick={() => handleAction('insert-link')}
      >
        Link
      </Button>
      <hr className="my-1 border-gray-200 dark:border-gray-700" />
      <Button 
        variant="ghost" 
        className={`w-full justify-start text-left rounded-none ${getTextColor()} ${getButtonHoverStyles()}`}
        onClick={() => handleAction('insert-comment')}
      >
        Comment
      </Button>
    </div>
  );
  
  const formatMenuContent = (
    <div className="w-48 py-1">
      <Button 
        variant="ghost" 
        className={`w-full justify-start text-left rounded-none ${getTextColor()} ${getButtonHoverStyles()}`}
        onClick={() => handleAction('format-bold')}
      >
        Bold
      </Button>
      <Button 
        variant="ghost" 
        className={`w-full justify-start text-left rounded-none ${getTextColor()} ${getButtonHoverStyles()}`}
        onClick={() => handleAction('format-italic')}
      >
        Italic
      </Button>
      <Button 
        variant="ghost" 
        className={`w-full justify-start text-left rounded-none ${getTextColor()} ${getButtonHoverStyles()}`}
        onClick={() => handleAction('format-underline')}
      >
        Underline
      </Button>
      <hr className="my-1 border-gray-200 dark:border-gray-700" />
      <Button 
        variant="ghost" 
        className={`w-full justify-start text-left rounded-none ${getTextColor()} ${getButtonHoverStyles()}`}
        onClick={() => handleAction('format-h1')}
      >
        Heading 1
      </Button>
      <Button 
        variant="ghost" 
        className={`w-full justify-start text-left rounded-none ${getTextColor()} ${getButtonHoverStyles()}`}
        onClick={() => handleAction('format-h2')}
      >
        Heading 2
      </Button>
      <Button 
        variant="ghost" 
        className={`w-full justify-start text-left rounded-none ${getTextColor()} ${getButtonHoverStyles()}`}
        onClick={() => handleAction('format-h3')}
      >
        Heading 3
      </Button>
    </div>
  );
  
  const helpMenuContent = (
    <div className="w-48 py-1">
      <Button 
        variant="ghost" 
        className={`w-full justify-start text-left rounded-none ${getTextColor()} ${getButtonHoverStyles()}`}
        onClick={() => handleAction('help-docs')}
      >
        Documentation
      </Button>
      <Button 
        variant="ghost" 
        className={`w-full justify-start text-left rounded-none ${getTextColor()} ${getButtonHoverStyles()}`}
        onClick={() => handleAction('help-shortcuts')}
      >
        Keyboard Shortcuts
      </Button>
      <hr className="my-1 border-gray-200 dark:border-gray-700" />
      <Button 
        variant="ghost" 
        className={`w-full justify-start text-left rounded-none ${getTextColor()} ${getButtonHoverStyles()}`}
        onClick={() => handleAction('help-about')}
      >
        About
      </Button>
    </div>
  );
  
  // Second row with quick action buttons
  const actionButtons = [
    { icon: FileText, label: 'New Schedule', action: 'new-schedule' },
    { icon: Save, label: 'Save', action: 'save' },
    { icon: Download, label: 'Download', action: 'download' },
    { icon: Printer, label: 'Print', action: 'print' },
    { icon: Share2, label: 'Share', action: 'share' },
  ];
  
  if (!isVisible) return null;
  
  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 transform ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* Menu bar row */}
      <div className={`${getMenuBarStyles()} border-b`}>
        <NavigationMenu className="max-w-full justify-start">
          <NavigationMenuList className="flex w-full px-1 h-10">
            {/* File Menu */}
            <NavigationMenuItem>
              <NavigationMenuTrigger 
                className={`h-9 text-sm font-medium cursor-pointer ${getTextColor()} px-4 ${getButtonHoverStyles()} bg-transparent`}
              >
                <File className="w-4 h-4 mr-1" /> File
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                {fileMenuContent}
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            {/* Edit Menu */}
            <NavigationMenuItem>
              <NavigationMenuTrigger 
                className={`h-9 text-sm font-medium cursor-pointer ${getTextColor()} px-4 ${getButtonHoverStyles()} bg-transparent`}
              >
                <Edit className="w-4 h-4 mr-1" /> Edit
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                {editMenuContent}
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            {/* View Menu */}
            <NavigationMenuItem>
              <NavigationMenuTrigger 
                className={`h-9 text-sm font-medium cursor-pointer ${getTextColor()} px-4 ${getButtonHoverStyles()} bg-transparent`}
              >
                <Eye className="w-4 h-4 mr-1" /> View
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                {viewMenuContent}
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            {/* Insert Menu */}
            <NavigationMenuItem>
              <NavigationMenuTrigger 
                className={`h-9 text-sm font-medium cursor-pointer ${getTextColor()} px-4 ${getButtonHoverStyles()} bg-transparent`}
              >
                <FileInput className="w-4 h-4 mr-1" /> Insert
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                {insertMenuContent}
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            {/* Format Menu */}
            <NavigationMenuItem>
              <NavigationMenuTrigger 
                className={`h-9 text-sm font-medium cursor-pointer ${getTextColor()} px-4 ${getButtonHoverStyles()} bg-transparent`}
              >
                <CircleDashed className="w-4 h-4 mr-1" /> Format
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                {formatMenuContent}
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            {/* Help Menu */}
            <NavigationMenuItem>
              <NavigationMenuTrigger 
                className={`h-9 text-sm font-medium cursor-pointer ${getTextColor()} px-4 ${getButtonHoverStyles()} bg-transparent`}
              >
                <HelpCircle className="w-4 h-4 mr-1" /> Help
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                {helpMenuContent}
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      
      {/* Second row with quick action buttons */}
      <div className={`${getMenuBarStyles()} border-b flex items-center px-4 py-2`}>
        <div className="flex-1 flex items-center">
          <FileText className={`h-5 w-5 ${getTextColor()} mr-2`} />
          <span className={`text-sm font-medium ${getTextColor()}`}>New Schedule</span>
        </div>
        
        <div className="flex gap-2">
          {actionButtons.map((button, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className={`h-8 ${getTextColor()}`}
              onClick={() => handleAction(button.action)}
            >
              <button.icon className="h-4 w-4 mr-1" />
              <span className="sr-only md:not-sr-only md:inline-block">
                {button.label}
              </span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FloatingMenuBar;
