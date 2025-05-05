
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendHorizontal } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
}

export const ChatInput = ({ onSendMessage, placeholder = "Type message..." }: ChatInputProps) => {
  const [input, setInput] = useState('');
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark' || resolvedTheme === 'superdark';
  
  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };
  
  return (
    <div className={`p-2 ${isDark ? 'border-border/30' : 'border-gray-200/50'} border-t rounded-b-xl bg-card/40 shadow-inner`}>
      <div className="flex gap-1.5 items-center">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 h-7 text-xs rounded-full"
        />
        <Button 
          onClick={handleSend} 
          size="icon" 
          className={`${isDark ? 'bg-primary hover:bg-primary/90' : 'bg-primary hover:bg-primary/90'} text-primary-foreground rounded-full h-7 w-7 flex-shrink-0 shadow-md`}
          aria-label="Send message"
        >
          <SendHorizontal className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};
