
import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/context/ThemeContext';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  disabled = false, 
  isLoading = false,
  placeholder = "Message GPT-4o Mini..."
}) => {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();
  const { resolvedTheme } = useTheme();
  
  const isSuperDark = resolvedTheme === 'superdark';
  const isDark = resolvedTheme === 'dark' || isSuperDark;

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      const newHeight = Math.min(inputRef.current.scrollHeight, 150);
      inputRef.current.style.height = `${newHeight}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); 
    
    if (input.trim() && !disabled && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
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

  const handleButtonClick = (callback?: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    callback?.();
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      onClick={(e) => e.stopPropagation()}
      className="p-3 border-t border-gray-700 bg-black relative"
    >
      <div className="flex items-end rounded-lg border border-gray-700 bg-black transition-all overflow-hidden">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Please wait..." : placeholder}
          className="flex-1 resize-none py-3 px-4 bg-black text-white placeholder-gray-500 focus:outline-none min-h-[40px] max-h-[150px] overflow-y-auto"
          disabled={disabled || isLoading}
          rows={1}
          onClick={(e) => e.stopPropagation()}
        />
        <Button
          type="submit"
          className={`mr-2 mb-2 h-8 w-8 p-0 rounded-md ${
            disabled || isLoading || !input.trim() 
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
          disabled={disabled || isLoading || !input.trim()}
          onClick={handleButtonClick(() => handleSubmit(new Event('submit') as unknown as React.FormEvent))}
        >
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <SendHorizontal className="h-4 w-4" />
          )}
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;
