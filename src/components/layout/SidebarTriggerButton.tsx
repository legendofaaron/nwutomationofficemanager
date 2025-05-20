
import React from 'react';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Logo } from '@/components/Logo';
import { useTheme } from '@/context/ThemeContext';

interface SidebarTriggerButtonProps {
  triggerPosition: number;
  onDragStart: (e: React.MouseEvent) => void;
}

export const SidebarTriggerButton: React.FC<SidebarTriggerButtonProps> = ({ 
  triggerPosition, 
  onDragStart 
}) => {
  const { resolvedTheme } = useTheme();
  const { setOpen } = useSidebar();
  const isDark = resolvedTheme === 'dark';
  const isSuperDark = resolvedTheme === 'superdark';

  const sidebarButtonBg = isSuperDark 
    ? 'bg-black border border-[#151515]' 
    : isDark 
      ? 'bg-[#0d0f13] border border-[#1a1e26]'
      : 'bg-white border border-gray-200 shadow-sm';

  const sidebarHoverBg = isSuperDark
    ? 'hover:bg-[#0a0a0a]'
    : isDark
      ? 'hover:bg-[#171b24]'
      : 'hover:bg-gray-50';
      
  const handleMouseEnter = () => {
    setOpen(true);
  };

  return (
    <div 
      className="absolute -right-7 z-20" 
      style={{ top: `${triggerPosition}px` }}
      onMouseEnter={handleMouseEnter}
    >
      <SidebarTrigger 
        className={`h-8 w-6 sm:h-10 sm:w-7 ${sidebarButtonBg} rounded-r-lg flex items-center justify-center ${sidebarHoverBg} transition-all group cursor-move`}
        onMouseDown={onDragStart}
      >
        <div className="transition-transform duration-700 ease-in-out group-hover:rotate-[360deg] scale-75">
          <Logo small />
        </div>
      </SidebarTrigger>
    </div>
  );
};
