
import * as React from "react"
import * as SonnerToast from "sonner"

import { cn } from "@/lib/utils"
import { useToast, toast, type ToastProps, type ToastActionElement, type ToasterToast } from "@/hooks/use-toast"

interface ToastPosition {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center";
}

interface ToastConfig extends ToastPosition {
  className?: string;
}

function Toast({ position = "bottom-right", className }: ToastConfig) {
  return (
    <SonnerToast.Toaster 
      position={position}
      toastOptions={{
        classNames: {
          toast: cn(
            "group toast border-border",
            className
          ),
          description: "text-muted-foreground",
          actionButton: "bg-primary text-primary-foreground",
          cancelButton: "border-muted bg-background"
        }
      }}
    />
  )
}

export { Toast, useToast, toast, type ToasterToast, type ToastActionElement, type ToastProps };
