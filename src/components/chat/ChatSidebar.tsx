
import React, { useState } from 'react';
import { MessageSquare, Search, PenLine, Image, FileText, Eye, Maximize, Mail, Settings, User, X } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';
import { ChatView } from './ChatView';

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ isOpen, onClose }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const isSuperDark = resolvedTheme === 'superdark';
  const [activeView, setActiveView] = useState<string>('chat');
  
  if (!isOpen) return null;
  
  // Sidebar actions based on the image
  const sidebarActions = [
    { id: 'chat', icon: MessageSquare, label: 'Chat', action: () => setActiveView('chat') },
    { id: 'search', icon: Search, label: 'Search', action: () => setActiveView('search') },
    { id: 'write', icon: PenLine, label: 'Write', action: () => setActiveView('write') },
    { id: 'image', icon: Image, label: 'Image', action: () => setActiveView('image') },
    { id: 'chatfile', icon: FileText, label: 'ChatFile', action: () => setActiveView('chatfile') },
    { id: 'vision', icon: Eye, label: 'Vision', action: () => setActiveView('vision') },
    { id: 'fullpage', icon: Maximize, label: 'Full Page', action: () => setActiveView('fullpage') }
  ];
  
  // Footer actions
  const footerActions = [
    { id: 'mail', icon: Mail, label: 'Mail', action: () => setActiveView('mail') },
    { id: 'settings', icon: Settings, label: 'Settings', action: () => setActiveView('settings') },
    { id: 'user', icon: User, label: 'User', action: () => setActiveView('user') }
  ];
  
  return (
    <div className="fixed inset-0 flex z-50">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="ml-auto flex flex-row h-full">
        {/* Sidebar with icons */}
        <div className="bg-black border-l border-gray-800 w-[60px] flex flex-col justify-between shadow-xl">
          <div className="flex flex-col items-center pt-4">
            {/* Logo at the top */}
            <div className="w-10 h-10 mb-8 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-black"></div>
              </div>
            </div>
            
            {/* Main sidebar actions */}
            <div className="flex flex-col items-center space-y-6">
              {sidebarActions.map((item) => (
                <button 
                  key={item.id}
                  onClick={item.action}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors duration-200 ${
                    activeView === item.id 
                      ? 'bg-gray-800 text-blue-400' 
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                  }`}
                  title={item.label}
                >
                  <item.icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>
          
          {/* Footer actions */}
          <div className="flex flex-col items-center space-y-6 pb-8">
            {footerActions.map((item) => (
              <button 
                key={item.id}
                onClick={item.action}
                className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors duration-200 ${
                  activeView === item.id 
                    ? 'bg-gray-800 text-blue-400' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                }`}
                title={item.label}
              >
                <item.icon className="w-5 h-5" />
              </button>
            ))}
          </div>
        </div>
        
        {/* Content area */}
        <div className="bg-black border-l border-gray-800 w-[380px] shadow-2xl">
          {activeView === 'chat' ? (
            <ChatView />
          ) : (
            <div className="flex flex-col h-full">
              <header className="p-4 border-b border-gray-800 bg-black/40 flex items-center justify-between">
                <h3 className="text-lg font-medium text-white capitalize">{activeView}</h3>
                <button 
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-800 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </header>
              <div className="flex-1 flex items-center justify-center text-gray-400 bg-black/20">
                <div className="text-center p-6">
                  <div className="mb-4 inline-block p-3 bg-gray-800/50 rounded-full">
                    <sidebarActions.find(item => item.id === activeView)?.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <p className="text-gray-300">{activeView} feature coming soon</p>
                  <p className="text-sm text-gray-500 mt-1">This feature is currently under development</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
