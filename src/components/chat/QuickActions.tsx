
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, Receipt, ScanSearch, Info } from 'lucide-react';

interface QuickActionProps {
  onActionClick: (action: string) => void;
  disabled?: boolean;
}

export const QuickActions = ({ onActionClick, disabled = false }: QuickActionProps) => {
  // Stop propagation of all click events
  const handleActionClick = (action: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onActionClick(action);
  };

  const quickActions = [
    { icon: FileText, label: 'Create Document', action: 'create document' },
    { icon: Calendar, label: 'Create Schedule', action: 'create schedule' },
    { icon: Receipt, label: 'Create Invoice', action: 'create invoice' },
    { icon: ScanSearch, label: 'Analyze Receipt', action: 'analyze receipt' },
    { icon: Info, label: 'How to use', action: 'explain how to use' }
  ];

  return (
    <div 
      className="grid grid-cols-2 gap-2 p-2 border-b border-[#1E2430]/80 bg-[#0D1117]"
      onClick={(e) => e.stopPropagation()}
    >
      {quickActions.slice(0, 4).map((action, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          className="flex items-center justify-start whitespace-nowrap bg-[#0A101B] border-[#2D3747]/50 hover:border-blue-500 hover:bg-[#1E2430] text-gray-300 transition-colors text-xs py-3 h-auto gap-2"
          onClick={handleActionClick(action.action)}
          disabled={disabled}
        >
          <action.icon className="h-4 w-4 text-gray-400" />
          {action.label}
        </Button>
      ))}
      <Button
        className="col-span-2 flex items-center justify-start whitespace-nowrap bg-[#0A101B] border-[#2D3747]/50 hover:border-blue-500 hover:bg-[#1E2430] text-gray-300 transition-colors text-xs py-3 h-auto mt-0"
        variant="outline"
        size="sm"
        onClick={handleActionClick(quickActions[4].action)}
        disabled={disabled}
      >
        <Info className="h-4 w-4 text-gray-400 mr-2" />
        {quickActions[4].label}
      </Button>
    </div>
  );
};
