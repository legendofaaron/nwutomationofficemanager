
import React from 'react';
import { User, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserAvatar } from '@/components/UserAvatar';
import { useAuth } from '@/context/AuthContext';
import { ViewMode } from '@/context/AppContext';

interface UserMenuProps {
  setViewMode: (mode: ViewMode) => void;
  confirmLogout: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ setViewMode, confirmLogout }) => {
  const { user } = useAuth();

  const navigateToProfile = () => {
    setViewMode('settings');
    // Adding a small delay to ensure the settings component is mounted before trying to focus on the profile tab
    setTimeout(() => {
      const profileTab = document.querySelector('[value="profile"]');
      if (profileTab) {
        (profileTab as HTMLElement).click();
      }
    }, 100);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <UserAvatar className="h-8 w-8 sm:h-9 sm:w-9 transition-all hover:scale-105 cursor-pointer" showTooltip />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 sm:w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <UserAvatar className="h-6 w-6 sm:h-7 sm:w-7" />
          <div className="flex flex-col">
            <span className="font-medium text-xs sm:text-sm">{user?.user_metadata?.full_name || 'User'}</span>
            <span className="text-xs text-muted-foreground truncate">@{user?.user_metadata?.username || 'user'}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={navigateToProfile} className="cursor-pointer text-xs sm:text-sm">
          <User className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setViewMode('settings')} className="cursor-pointer text-xs sm:text-sm">
          <SettingsIcon className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={confirmLogout} className="cursor-pointer text-red-500 dark:text-red-400 text-xs sm:text-sm">
          <LogOut className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
