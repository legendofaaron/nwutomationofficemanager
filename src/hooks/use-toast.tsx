
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

  const toast = React.useMemo(
    () => ({
      toast: ({ variant = "default", title, description, ...props }: ToastProps) => {
        // Configure styling based on variant
        const styling: any = {};
        
        // Add theme-specific styling
        if (resolvedTheme === "dark" || resolvedTheme === "superdark") {
          styling.style = { backgroundColor: "#1e2030", color: "#e2e8f0" };
        }

        if (variant === "destructive") {
          styling.className = `${resolvedTheme === "dark" || resolvedTheme === "superdark" ? "bg-red-900" : "bg-red-500"} text-white`;
          styling.icon = "✖";
        } else if (variant === "success") {
          styling.className = `${resolvedTheme === "dark" || resolvedTheme === "superdark" ? "bg-green-900" : "bg-green-500"} text-white`;
          styling.icon = "✓";
        } else if (variant === "warning") {
          styling.className = `${resolvedTheme === "dark" || resolvedTheme === "superdark" ? "bg-yellow-900" : "bg-yellow-500"} text-white`;
          styling.icon = "⚠️";
        }
        
        // Return the toast
        return sonnerToast(title, {
          description,
          ...styling,
          ...props,
        });
      },
    }),
    [resolvedTheme]
  );

  return toast;
};

export { sonnerToast as toast };
