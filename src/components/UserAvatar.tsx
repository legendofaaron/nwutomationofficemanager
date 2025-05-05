
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface UserAvatarProps {
  className?: string;
  showFallback?: boolean;
  onClick?: () => void;
  showTooltip?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function UserAvatar({ 
  className, 
  showFallback = true, 
  onClick, 
  showTooltip = false,
  size = 'md'
}: UserAvatarProps) {
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
  
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16"
  };
  
  const avatar = (
    <Avatar 
      className={cn(
        "bg-primary", 
        sizeClasses[size],
        onClick && "cursor-pointer hover:opacity-90 transition-opacity",
        className
      )}
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
  
  if (showTooltip && user) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {avatar}
        </TooltipTrigger>
        <TooltipContent>
          <p>{user.user_metadata?.full_name || user.email}</p>
          {user.user_metadata?.username && (
            <p className="text-xs text-muted-foreground">@{user.user_metadata.username}</p>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }
  
  return avatar;
}
