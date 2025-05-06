
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, Receipt, ScanSearch, Info } from 'lucide-react';

interface QuickActionProps {
  onActionClick: (action: string) => void;
  disabled?: boolean;
}

export const QuickActions = ({ onActionClick, disabled = false }: QuickActionProps) => {
  const quickActions = [
    { icon: FileText, label: 'Create Document', action: () => onActionClick('create document') },
    { icon: Calendar, label: 'Create Schedule', action: () => onActionClick('create schedule') },
    { icon: Receipt, label: 'Create Invoice', action: () => onActionClick('create invoice') },
    { icon: ScanSearch, label: 'Analyze Receipt', action: () => onActionClick('analyze receipt') },
    { icon: Info, label: 'How to use', action: () => onActionClick('explain how to use') }
  ];

  return (
    <div className="grid grid-cols-1 gap-1.5 p-3 border-b border-[#1E2430]/80 bg-[#0D1117]">
      {quickActions.map((action, index) => (
        <Button
          key={index}
          variant="ghost"
          className="w-full justify-start text-xs py-2 h-auto bg-transparent hover:bg-[#161B22] text-gray-300 transition-colors"
          onClick={action.action}
          disabled={disabled}
        >
          <action.icon className="mr-2 h-4 w-4 text-gray-400" />
          {action.label}
        </Button>
      ))}
    </div>
  );
};
