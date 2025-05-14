
import * as React from "react"
import { 
  Toast,
  ToastClose, 
  ToastDescription, 
  ToastProvider, 
  ToastTitle, 
  ToastViewport 
} from "@/components/ui/toast"
import { useToast as useToastImpl } from "@/components/ui/use-toast"

type ToastActionElement = React.ReactElement<typeof Toast>

export const toastClass = {
  destructive: "destructive",
  default: "default"
} as const

const useToast = () => {
  return useToastImpl();
}

const toast = (props: React.ComponentProps<typeof Toast>) => {
  const { toast } = useToastImpl()
  toast(props)
}

export { useToast, toast }
