
import React from 'react';
import { X, Settings, ToggleRight, ToggleLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ChatHeaderProps {
  assistantName: string;
  companyName?: string;
  onSettingsClick: () => void;
  onCloseClick: () => void;
  useN8n?: boolean;
  onToggleN8n?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  assistantName, 
  companyName, 
  onSettingsClick,
  onCloseClick,
  useN8n = false,
  onToggleN8n
}) => {
  return (
    <div className="flex items-center justify-between p-3 border-b border-[#1E2430]/80 bg-[#0D1117]">
      <div className="flex items-center gap-2">
        <Logo small={true} />
        <div className="text-white">
          <h3 className="text-sm font-semibold leading-none">{assistantName}</h3>
          {companyName && (
            <p className="text-xs text-gray-400">{companyName}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        {onToggleN8n && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-gray-400 hover:text-gray-100 rounded-full"
                  onClick={onToggleN8n}
                >
                  {useN8n ? 
                    <ToggleRight className="h-5 w-5" /> : 
                    <ToggleLeft className="h-5 w-5" />
                  }
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {useN8n ? 'Switch to native chat' : 'Switch to n8n chat'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-400 hover:text-gray-100 rounded-full"
                onClick={onSettingsClick}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-400 hover:text-gray-100 rounded-full"
                onClick={onCloseClick}
              >
                <X className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Close</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
