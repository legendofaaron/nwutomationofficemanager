
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, Receipt, ScanSearch, Info } from 'lucide-react';

interface QuickActionProps {
  onActionSelect: (action: string) => void;
}

export const QuickActions = ({ onActionSelect }: QuickActionProps) => {
  const quickActions = [
    { icon: FileText, label: 'Create Document', action: () => onActionSelect('create document') },
    { icon: Calendar, label: 'Create Schedule', action: () => onActionSelect('create schedule') },
    { icon: Receipt, label: 'Create Invoice', action: () => onActionSelect('create invoice') },
    { icon: ScanSearch, label: 'Analyze Receipt', action: () => onActionSelect('analyze receipt') },
    { icon: Info, label: 'How to use', action: () => onActionSelect('explain how to use') }
  ];

  return (
    <div className="grid grid-cols-2 gap-1 p-1.5 border-b border-border/30">
      {quickActions.map((action, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          className="w-full justify-start text-xs py-1 h-7"
          onClick={action.action}
        >
          <action.icon className="mr-1 h-3 w-3" />
          {action.label}
        </Button>
      ))}
    </div>
  );
};
