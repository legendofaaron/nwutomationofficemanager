
import React from 'react';
import { cn } from '@/lib/utils';
import { Hexagon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  small?: boolean; // Added missing property
  onClick?: () => void; // Added missing property
}

export const Logo: React.FC<LogoProps> = ({ 
  className, 
  size = 'md',
  showText = false,
  small = false, // Default value for small
  onClick // Added onClick handler
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const isSuperDark = resolvedTheme === 'superdark';
  
  // If small prop is provided, override size to 'sm'
  const logoSize = small ? 'sm' : size;
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };
  
  const logoColor = isSuperDark 
    ? 'text-blue-600' 
    : isDark 
      ? 'text-blue-500' 
      : 'text-blue-600';

  const innerColor = isSuperDark 
    ? 'text-blue-400' 
    : isDark 
      ? 'text-blue-300' 
      : 'text-blue-400';
  
  const textColor = isSuperDark 
    ? 'text-gray-200' 
    : isDark 
      ? 'text-gray-100' 
      : 'text-gray-800';

  return (
    <div 
      className={cn('flex items-center gap-2', onClick && 'cursor-pointer', className)}
      onClick={onClick}
    >
      <div className="relative">
        <Hexagon className={cn('stroke-2', sizeClasses[logoSize], logoColor)} />
        <Hexagon 
          className={cn(
            'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-60', 
            sizeClasses[logoSize],
            innerColor
          )}
          style={{ transform: 'translate(-50%, -50%) scale(0.6)' }}
        />
      </div>
      
      {showText && (
        <div className={cn('font-bold tracking-tight', textColor)}>
          Office Manager
        </div>
      )}
    </div>
  );
};
