
import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Paperclip, Mic, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  placeholder = "Message your assistant..."
}) => {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`p-3 border-t border-[#2D3747]/80 bg-[#1B222C] relative transition-all ${isFocused ? 'shadow-md' : ''}`}
    >
      <div className={`flex items-end rounded-lg border ${isFocused ? 'border-blue-500' : 'border-[#2D3747]/80'} bg-[#0D1117] pr-2 transition-all`}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Please wait..." : placeholder}
          className="flex-1 resize-none py-3 px-3 rounded-l-lg bg-[#0D1117] text-[#E5EAF2] placeholder-[#8493A8] focus:outline-none min-h-[40px] max-h-[150px] overflow-y-auto"
          disabled={disabled || isLoading}
          rows={1}
        />
        <div className="flex items-center h-10">
          <Button
            type="submit"
            size="icon"
            className={`ml-1 h-8 w-8 rounded-md ${disabled || isLoading || !input.trim() ? 'bg-[#1E2430] text-[#5D6B82] hover:bg-[#1E2430] cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'} transition-colors`}
            disabled={disabled || isLoading || !input.trim()}
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <SendHorizontal className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
