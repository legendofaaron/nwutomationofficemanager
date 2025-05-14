
import * as React from "react";
import { toast as sonnerToast } from "sonner";
import { useTheme } from "@/context/ThemeContext";

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive" | "success" | "warning";
  title?: string;
  description?: string;
  action?: React.ReactNode;
  duration?: number;
}

// Enhanced toast function with automatic theme detection
export const useToast = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const isSuperDark = resolvedTheme === 'superdark';
  
  const toast = {
    // Base toast method with styled toasts
    toast(props: ToastProps) {
      const styles = {
        background: isSuperDark ? '#0A0A0A' : isDark ? '#0D1117' : 'white',
        color: isSuperDark || isDark ? 'white' : '#1f2937',
        border: `1px solid ${isSuperDark ? '#181818' : isDark ? '#1a1e26' : '#e5e7eb'}`,
        borderRadius: '0.5rem',
      };

      return sonnerToast(props.title || "", {
        description: props.description,
        style: styles,
        ...props,
      });
    },
    
    // Helper methods for different toast types
    success(props: ToastProps) {
      this.toast({ ...props, variant: "success" });
    },
    error(props: ToastProps) {
      this.toast({ ...props, variant: "destructive" });
    },
    warning(props: ToastProps) {
      this.toast({ ...props, variant: "warning" });
    },
    info(props: ToastProps) {
      this.toast({ ...props, variant: "default" });
    },
  };

  return toast;
};

// Export a standalone toast function for use outside of components
export const toast = (props: ToastProps) => {
  // Basic styling for standalone toast usage
  const styles = {
    borderRadius: '0.5rem',
  };
  
  return sonnerToast(props.title || "", {
    description: props.description,
    style: styles,
    ...props,
  });
};
