
import { toast as sonnerToast, type Toast as SonnerToastType } from 'sonner';

type ToastProps = SonnerToastType & {
  variant?: 'default' | 'destructive' | 'success';
  title?: string;
  description?: string;
};

export const useToast = () => {
  const toast = ({ variant = 'default', title, description, ...props }: ToastProps) => {
    // Set the styling based on variant
    const styling: Record<string, any> = {};
    
    if (variant === 'destructive') {
      styling.className = 'bg-destructive text-destructive-foreground';
      styling.icon = '⚠️';
    } else if (variant === 'success') {
      styling.className = 'bg-green-500 text-white';
      styling.icon = '✓';
    }
    
    // Construct the content
    let content = '';
    if (title) {
      content = description ? `${title}\n${description}` : title;
    } else if (description) {
      content = description;
    }
    
    return sonnerToast(content || '', {
      ...styling,
      ...props,
    });
  };

  return { toast };
};

// For direct usage without the hook
export const toast = ({ variant = 'default', title, description, ...props }: ToastProps) => {
  // Set the styling based on variant
  const styling: Record<string, any> = {};
  
  if (variant === 'destructive') {
    styling.className = 'bg-destructive text-destructive-foreground';
    styling.icon = '⚠️';
  } else if (variant === 'success') {
    styling.className = 'bg-green-500 text-white';
    styling.icon = '✓';
  }
  
  // Construct the content
  let content = '';
  if (title) {
    content = description ? `${title}\n${description}` : title;
  } else if (description) {
    content = description;
  }
  
  return sonnerToast(content || '', {
    ...styling,
    ...props,
  });
};
