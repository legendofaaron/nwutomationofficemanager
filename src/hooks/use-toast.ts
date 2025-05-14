
import { toast as sonnerToast } from 'sonner';

type ToastProps = {
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  title?: string;
  description?: string;
  duration?: number;
  action?: React.ReactNode;
  [key: string]: any; // Allow for additional sonner toast properties
};

export const useToast = () => {
  const toast = ({ variant = 'default', title, description, ...props }: ToastProps) => {
    // Configure styling based on variant
    const styling: any = {};
    
    if (variant === 'destructive') {
      styling.className = 'bg-red-500 text-white';
      styling.icon = '✖';
    } else if (variant === 'success') {
      styling.className = 'bg-green-500 text-white';
      styling.icon = '✓';
    } else if (variant === 'warning') {
      styling.className = 'bg-yellow-500 text-white';
      styling.icon = '⚠️';
    }
    
    // Construct the content
    return sonnerToast(title, {
      description,
      ...styling,
      ...props,
    });
  };

  return { toast };
};

// Default export for direct import
export const toast = ({ variant = 'default', title, description, ...props }: ToastProps) => {
  // Configure styling based on variant
  const styling: any = {};
  
  if (variant === 'destructive') {
    styling.className = 'bg-red-500 text-white';
    styling.icon = '✖';
  } else if (variant === 'success') {
    styling.className = 'bg-green-500 text-white';
    styling.icon = '✓';
  } else if (variant === 'warning') {
    styling.className = 'bg-yellow-500 text-white';
    styling.icon = '⚠️';
  }
  
  // Construct the content
  return sonnerToast(title, {
    description,
    ...styling,
    ...props,
  });
};
