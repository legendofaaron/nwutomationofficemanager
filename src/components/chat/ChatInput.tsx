
import React, { useState } from 'react';
import { SendHorizontal } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  disabled = false, 
  isLoading = false 
}) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="p-2 border-t border-[#2D3747]/80 bg-[#1B222C] flex items-center"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={disabled ? "Please wait..." : "Message your assistant..."}
        className="flex-1 p-2 rounded bg-[#0D1117] text-[#E5EAF2] placeholder-[#8493A8] border border-[#2D3747]/80 focus:outline-none focus:border-blue-500"
        disabled={disabled || isLoading}
      />
      <button
        type="submit"
        className={`ml-2 p-2 rounded-full ${disabled || isLoading ? 'bg-[#1E2430] text-[#5D6B82]' : 'bg-blue-600 hover:bg-blue-700 text-white'} transition-colors`}
        disabled={disabled || isLoading || !input.trim()}
      >
        <SendHorizontal className="h-5 w-5" />
      </button>
    </form>
  );
};

export default ChatInput;
