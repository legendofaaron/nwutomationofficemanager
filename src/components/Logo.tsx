
import React from 'react';
import { Hexagon } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

export const Logo = ({ small, onClick }: { small?: boolean; onClick?: () => void }) => {
  // Try to use AppContext, but don't fail if it's not available
  // This allows the Logo to work in the LoadingScreen where AppContext isn't available
  let branding = { companyName: 'Northwestern Automation', logoType: 'default' as const, logoUrl: '' };
  
  try {
    const appContext = useAppContext();
    if (appContext) {
      branding = appContext.branding;
    }
  } catch (error) {
    // AppContext not available, use default branding
  }
  
  return (
    <div 
      className="flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
      onClick={onClick}
    >
      {branding.logoType === 'image' && branding.logoUrl ? (
        <img 
          src={branding.logoUrl} 
          alt={`${branding.companyName} logo`} 
          className={`h-${small ? '4' : '6'} w-auto`}
        />
      ) : (
        <div className="relative">
          <div className={`rounded-full border-2 border-app-blue ${small ? 'p-0.5' : 'p-1'}`}>
            <Hexagon className={`${small ? 'h-4 w-4' : 'h-6 w-6'} text-app-blue`} />
          </div>
        </div>
      )}
      {!small && <span className="font-semibold text-app-blue">{branding.companyName}</span>}
    </div>
  );
};
