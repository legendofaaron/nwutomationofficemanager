
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  className?: string;
  showFallback?: boolean;
  onClick?: () => void;
}

export function UserAvatar({ className, showFallback = true, onClick }: UserAvatarProps) {
  const { user } = useAuth();
  
  const getInitials = () => {
    const fullName = user?.user_metadata?.full_name || user?.email || '';
    return fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <Avatar 
      className={cn("bg-primary", className, onClick && "cursor-pointer")}
      onClick={onClick}
    >
      <AvatarImage 
        src={user?.user_metadata?.avatar_url} 
        alt={user?.user_metadata?.full_name || 'User'}
      />
      {showFallback && (
        <AvatarFallback>
          {getInitials()}
        </AvatarFallback>
      )}
    </Avatar>
  );
}
