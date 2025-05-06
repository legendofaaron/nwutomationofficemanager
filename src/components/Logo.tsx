
import React from 'react';
import { Hexagon } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';

type LogoType = 'default' | 'text' | 'image';

interface DefaultBranding {
  companyName: string;
  logoType: LogoType;
  logoUrl: string;
}

export const Logo = ({
  small,
  onClick
}: {
  small?: boolean;
  onClick?: () => void;
}) => {
  const { resolvedTheme } = useTheme();
  
  // Try to use AppContext, but don't fail if it's not available
  // This allows the Logo to work in the LoadingScreen where AppContext isn't available
  let branding: DefaultBranding = {
    companyName: 'Northwestern Automation',
    logoType: 'default',
    logoUrl: ''
  };

  try {
    const appContext = useAppContext();
    if (appContext) {
      branding = appContext.branding as DefaultBranding;
    }
  } catch (error) {
    // AppContext not available, use default branding
  }

  // Determine text color based on theme
  const textColor = resolvedTheme === 'light' 
    ? 'text-gray-800' 
    : resolvedTheme === 'superdark'
      ? 'text-gray-200'
      : 'text-gray-200';
  
  // Determine logo color based on theme
  const logoColor = resolvedTheme === 'light'
    ? 'text-gray-700'
    : resolvedTheme === 'superdark'
      ? 'text-gray-300'
      : 'text-gray-300';

  return (
    <div className="flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer" onClick={onClick}>
      {branding.logoType === 'image' && branding.logoUrl ? (
        <img 
          src={branding.logoUrl} 
          alt={`${branding.companyName} logo`} 
          className={`h-${small ? '4' : '6'} w-auto`} 
        />
      ) : (
        <div className="relative">
          <Hexagon className={`h-${small ? '4' : '6'} w-${small ? '4' : '6'} ${logoColor}`} />
        </div>
      )}
      {(!small || branding.logoType === 'text') && (
        <span className={`font-medium ${small ? 'text-sm' : 'text-lg'} ${textColor}`}>
          {branding.companyName}
        </span>
      )}
    </div>
  );
};
