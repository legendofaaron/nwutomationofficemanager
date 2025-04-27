
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import AppSidebar, { SidebarToggle } from './AppSidebar';
import DocumentViewer from './DocumentViewer';
import DatabaseViewer from './DatabaseViewer';
import AiAssistant from './AiAssistant';
import ChatUI from './ChatUI';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Calendar, 
  Receipt, 
  List,
  FilePlus,
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const MainLayout = () => {
  const { viewMode, sidebarOpen } = useAppContext();
  
  return (
    <div className="min-h-screen bg-app-gray-lightest">
      <AppSidebar />
      <SidebarToggle />
      
      <main 
        className={cn(
          "min-h-screen transition-all duration-300 pt-16",
          sidebarOpen ? "ml-64" : "ml-0"
        )}
      >
        <div className="max-w-7xl mx-auto p-4 bg-white shadow-sm min-h-[calc(100vh-64px)] rounded-md">
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <h1 className="text-xl font-semibold">Office Manager</h1>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline">
                <FilePlus className="mr-2 h-4 w-4" />
                Add File
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Create Document
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <FileText className="mr-2 h-4 w-4" />
                    New Document
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Receipt className="mr-2 h-4 w-4" />
                    New Invoice
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Calendar className="mr-2 h-4 w-4" />
                    New Schedule
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button size="sm" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedules
              </Button>
              
              <Button size="sm" variant="outline">
                <Receipt className="mr-2 h-4 w-4" />
                Invoices
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline">
                    <List className="mr-2 h-4 w-4" />
                    Select LLM
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    GPT-4o-mini
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    GPT-4o
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    GPT-4.5-preview
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {viewMode === 'document' && <DocumentViewer />}
          {viewMode === 'database' && <DatabaseViewer />}
          {viewMode === 'files' && (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">Select a file or database table to view</p>
            </div>
          )}
        </div>
      </main>
      
      <AiAssistant />
      <ChatUI />
    </div>
  );
};

export default MainLayout;
