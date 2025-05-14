
import { toast as sonnerToast, ToastT } from 'sonner';

type ToastProps = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number;
};

export function toast({ title, description, variant = 'default', duration = 3000 }: ToastProps) {
  const options = {
    duration,
    className: variant === 'destructive' 
      ? 'bg-destructive text-destructive-foreground' 
      : variant === 'success'
      ? 'bg-green-500 text-white' 
      : undefined
  };

  if (title && description) {
    return sonnerToast(title, {
      description,
      ...options
    });
  }

  return sonnerToast(title || description || '', options);
}

export const useToast = () => {
  return { toast };
};

export type { ToastProps };
