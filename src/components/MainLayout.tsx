import React from 'react';
import { useAppContext } from '@/context/AppContext';
import AppSidebar, { SidebarToggle } from './AppSidebar';
import DocumentViewer from './DocumentViewer';
import DatabaseViewer from './DatabaseViewer';
import KnowledgeBase from './KnowledgeBase';
import AiAssistant from './AiAssistant';
import ChatUI from './ChatUI';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, Receipt, FilePlus, Brain, Database, File } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Logo } from './Logo';
const MainLayout = () => {
  const {
    viewMode,
    setViewMode,
    sidebarOpen
  } = useAppContext();
  return <div className="min-h-screen bg-app-gray-lightest">
      <AppSidebar />
      <SidebarToggle />
      
      <main className={cn("min-h-screen transition-all duration-300 pt-16", sidebarOpen ? "ml-64" : "ml-0")}>
        <div className="max-w-7xl mx-auto p-4 bg-white shadow-sm min-h-[calc(100vh-64px)] rounded-md">
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setViewMode('files')}>
              <Logo />
              
            </div>
            
            <div className="flex items-center gap-4">
              {/* Files Section */}
              

              {/* Database & Knowledge Section */}
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <Database className="mr-2 h-4 w-4" />
                  Database
                </Button>
                <Button size="sm" variant="outline" onClick={() => setViewMode('knowledge')}>
                  <Brain className="mr-2 h-4 w-4" />
                  Knowledge Base
                </Button>
              </div>

              {/* Document Creation */}
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

              {/* Schedule & Invoice Quick Access */}
              
              <Button size="sm" variant="outline">
                <Receipt className="mr-2 h-4 w-4" />
                Invoices
              </Button>
            </div>
          </div>
          
          {viewMode === 'document' && <DocumentViewer />}
          {viewMode === 'database' && <DatabaseViewer />}
          {viewMode === 'knowledge' && <KnowledgeBase />}
          {viewMode === 'files' && <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">Select a file or database table to view</p>
            </div>}
        </div>
      </main>
      
      <AiAssistant />
      <ChatUI />
    </div>;
};
export default MainLayout;