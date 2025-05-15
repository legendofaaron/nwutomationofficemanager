
// Re-export from sonner
import * as React from "react";
import { toast as sonnerToast, ToasterToast as SonnerToasterToast, Toast as SonnerToast } from 'sonner';

// Define interfaces to match our component expectations
export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive" | "success" | "warning";
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export interface ToastActionElement {
  altText: string;
  action: React.ReactNode;
}

export type ToasterToast = SonnerToasterToast & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

export const toast = sonnerToast;

export function useToast() {
  return {
    toast: sonnerToast,
    dismiss: sonnerToast.dismiss,
    error: (message: string) => sonnerToast.error(message),
    success: (message: string) => sonnerToast.success(message)
  };
}
