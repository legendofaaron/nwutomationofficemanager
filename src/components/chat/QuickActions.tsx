
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
    <div className="flex p-2 gap-2 border-b border-[#1E2430]/80 bg-[#0D1117] overflow-x-auto">
      {quickActions.map((action, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          className="whitespace-nowrap flex-shrink-0 bg-[#161B22] border-[#2D3747]/50 hover:border-blue-500 hover:bg-[#1E2430] text-gray-300 transition-colors text-xs py-2 h-auto"
          onClick={action.action}
          disabled={disabled}
        >
          <action.icon className="mr-2 h-3.5 w-3.5 text-gray-400" />
          {action.label}
        </Button>
      ))}
    </div>
  );
};
