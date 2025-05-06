
import React from 'react';
import { X, Settings, UserCircle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/context/ThemeContext';

interface ChatHeaderProps {
  assistantName?: string;
  companyName?: string;
  onCloseClick: () => void;
  onSettingsClick: () => void;
  useN8n: boolean;
  onToggleN8n: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  assistantName = 'AI Assistant',
  companyName,
  onCloseClick,
  onSettingsClick,
  useN8n,
  onToggleN8n
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const isSuperDark = resolvedTheme === 'superdark';
  
  // Stop event propagation
  const handleButtonClick = (callback: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    callback();
  };
  
  // Get theme-specific styles
  const getHeaderStyles = () => {
    if (isSuperDark) return 'bg-[#0A0A0A] border-[#181818]/80';
    if (isDark) return 'bg-[#0D1117] border-[#1E2430]/80';
    return 'bg-white border-gray-200';
  };
  
  const getTextStyles = () => {
    if (isSuperDark || isDark) return 'text-white';
    return 'text-gray-800';
  };
  
  const getSubTextStyles = () => {
    if (isSuperDark) return 'text-gray-400';
    if (isDark) return 'text-gray-300';
    return 'text-gray-500';
  };
  
  const getIconStyles = () => {
    if (isSuperDark) return 'text-gray-400 hover:text-gray-200';
    if (isDark) return 'text-gray-300 hover:text-white';
    return 'text-gray-500 hover:text-gray-700';
  };
  
  return (
    <div 
      className={`p-4 border-b ${getHeaderStyles()} flex items-center justify-between`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center space-x-2">
        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${
          isSuperDark ? 'from-blue-700 to-blue-900' : 
          isDark ? 'from-blue-500 to-blue-700' : 
          'from-blue-400 to-blue-600'
        } flex items-center justify-center`}>
          <UserCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className={`font-medium text-sm ${getTextStyles()}`}>{assistantName}</h3>
          {companyName && (
            <p className={`text-xs ${getSubTextStyles()}`}>{companyName}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-1">
        <div className="flex items-center mr-2">
          <span className={`text-xs mr-2 ${getSubTextStyles()}`}>
            {useN8n ? 'Cloud' : 'Local'}
          </span>
          <Switch
            checked={useN8n}
            onCheckedChange={(checked) => {
              onToggleN8n();
            }}
            onClick={(e) => e.stopPropagation()}
            className="data-[state=checked]:bg-blue-600"
          />
        </div>
        
        <Button
          variant="ghost" 
          size="icon"
          className={`rounded-full ${getIconStyles()}`}
          onClick={handleButtonClick(onSettingsClick)}
        >
          <Settings className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost" 
          size="icon"
          className={`rounded-full ${getIconStyles()}`}
          onClick={handleButtonClick(onCloseClick)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
