
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendHorizontal } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const ChatInput = ({ onSendMessage, placeholder = "Type your message...", disabled = false }: ChatInputProps) => {
  const [input, setInput] = useState('');
  const { resolvedTheme } = useTheme();
  
  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };
  
  return (
    <div className="p-3 border-t border-[#1E2430]/80 bg-[#0D1117]">
      <div className="flex gap-2 items-center">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 h-10 text-sm rounded-md bg-[#161B22] border-[#1E2430] text-gray-200 placeholder:text-gray-500 focus-visible:ring-blue-500"
          disabled={disabled}
        />
        <Button 
          onClick={handleSend} 
          size="icon" 
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full h-9 w-9 flex-shrink-0 shadow-md transition-colors"
          aria-label="Send message"
          disabled={disabled || !input.trim()}
        >
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
