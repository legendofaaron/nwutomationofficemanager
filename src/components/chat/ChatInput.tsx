
import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Paperclip, Mic, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/context/ThemeContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
  useN8n?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  disabled = false, 
  isLoading = false,
  placeholder = "Message your assistant...",
  useN8n = false
}) => {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();
  const { resolvedTheme } = useTheme();
  
  const isSuperDark = resolvedTheme === 'superdark';
  const isDark = resolvedTheme === 'dark' || isSuperDark;

  // Initialize n8n chat if enabled
  useEffect(() => {
    if (useN8n && window.initN8nChat && typeof window.initN8nChat === 'function') {
      window.initN8nChat();
    }
  }, [useN8n]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      // Reset height to auto to correctly calculate the new height
      inputRef.current.style.height = 'auto';
      // Set new height based on scrollHeight, with a max of 150px
      const newHeight = Math.min(inputRef.current.scrollHeight, 150);
      inputRef.current.style.height = `${newHeight}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
      // Reset height after sending message
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // If using n8n chat, don't render our custom input
  if (useN8n) {
    return null; // n8n chat will render its own input UI
  }

  // Theme-specific styling functions
  const getBorderColor = () => {
    if (isFocused) {
      return isSuperDark ? 'border-blue-600' : isDark ? 'border-blue-500' : 'border-blue-400';
    }
    return isSuperDark ? 'border-[#1E1E1E]' : isDark ? 'border-[#2D3747]/80' : 'border-gray-200';
  };

  const getBackgroundColor = () => {
    return isSuperDark ? 'bg-[#0A0A0A]' : isDark ? 'bg-[#0A101B]' : 'bg-white';
  };

  const getTextColor = () => {
    return isSuperDark ? 'text-[#E0E0E0]' : isDark ? 'text-[#E5EAF2]' : 'text-gray-800';
  };

  const getPlaceholderColor = () => {
    return isSuperDark ? 'placeholder-[#666666]' : isDark ? 'placeholder-[#8493A8]' : 'placeholder-gray-400';
  };

  const getButtonStyle = () => {
    const baseStyle = "rounded-md font-medium transition-colors";
    
    if (disabled || isLoading || !input.trim()) {
      return isSuperDark 
        ? `${baseStyle} bg-[#111111] text-[#444444] hover:bg-[#111111] cursor-not-allowed` 
        : isDark 
          ? `${baseStyle} bg-[#1E2430] text-[#5D6B82] hover:bg-[#1E2430] cursor-not-allowed` 
          : `${baseStyle} bg-gray-100 text-gray-400 hover:bg-gray-100 cursor-not-allowed`;
    }
    
    return isSuperDark 
      ? `${baseStyle} bg-blue-600 hover:bg-blue-700 text-white` 
      : isDark 
        ? `${baseStyle} bg-[#4661F1] hover:bg-[#3A51D6] text-white` 
        : `${baseStyle} bg-blue-500 hover:bg-blue-600 text-white`;
  };

  const getFormStyle = () => {
    return isSuperDark 
      ? 'border-[#181818] bg-black' 
      : isDark 
        ? 'border-[#1E2430]/80 bg-[#0D1117]' 
        : 'border-gray-200 bg-white';
  };

  return (
    <TooltipProvider>
      <form 
        onSubmit={handleSubmit} 
        className={`p-3 border-t ${getFormStyle()} relative transition-all ${isFocused ? 'shadow-md' : ''}`}
      >
        <div className={`flex items-end rounded-lg border ${getBorderColor()} ${getBackgroundColor()} transition-all overflow-hidden`}>
          <div className="flex items-center pl-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className={`h-8 w-8 text-gray-400 hover:text-gray-600 rounded-full ${isDark ? 'hover:bg-[#1E2430]/70' : ''}`}
                  disabled={disabled}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Attach file</TooltipContent>
            </Tooltip>
          </div>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? "Please wait..." : placeholder}
            className={`flex-1 resize-none py-3 px-2 ${getBackgroundColor()} ${getTextColor()} ${getPlaceholderColor()} focus:outline-none min-h-[40px] max-h-[150px] overflow-y-auto`}
            disabled={disabled || isLoading}
            rows={1}
          />
          <div className="flex items-center pr-1">
            {!isMobile && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className={`h-8 w-8 text-gray-400 hover:text-gray-600 rounded-full ${isDark ? 'hover:bg-[#1E2430]/70' : ''}`}
                      disabled={disabled}
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Voice input</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className={`h-8 w-8 mr-1 text-gray-400 hover:text-gray-600 rounded-full ${isDark ? 'hover:bg-[#1E2430]/70' : ''}`}
                      disabled={disabled}
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Emoji</TooltipContent>
                </Tooltip>
              </>
            )}
            <Button
              type="submit"
              className={`mr-1 mb-1 h-10 ${isMobile ? 'px-3' : 'px-5'} ${getButtonStyle()}`}
              disabled={disabled || isLoading || !input.trim()}
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                isMobile ? <SendHorizontal className="h-5 w-5" /> : "Send"
              )}
            </Button>
          </div>
        </div>
      </form>
    </TooltipProvider>
  );
};

export default ChatInput;
