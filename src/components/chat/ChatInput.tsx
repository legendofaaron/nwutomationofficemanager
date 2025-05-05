
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendHorizontal } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
}

export const ChatInput = ({ onSendMessage, placeholder = "Type your message..." }: ChatInputProps) => {
  const [input, setInput] = useState('');
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark' || resolvedTheme === 'superdark';
  
  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };
  
  return (
    <div className="p-3 border-t border-border/20 bg-[#0D1117]">
      <div className="flex gap-2 items-center">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 h-12 text-sm rounded-md bg-[#161B22] border-[#1E2430] text-gray-200 placeholder:text-gray-400 focus-visible:ring-primary"
        />
        <Button 
          onClick={handleSend} 
          size="icon" 
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full h-10 w-10 flex-shrink-0 shadow-md transition-colors"
          aria-label="Send message"
        >
          <SendHorizontal className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
