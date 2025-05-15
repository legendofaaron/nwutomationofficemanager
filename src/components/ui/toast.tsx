
import * as React from "react"
import * as SonnerToast from "sonner"

import { cn } from "@/lib/utils"

export interface ToastActionElement {
  altText: string;
  action: React.ReactNode;
}

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive" | "success" | "warning";
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

const Toast = SonnerToast.Toaster;

function useToast() {
  return SonnerToast.toast;
}

export { Toast, useToast };
