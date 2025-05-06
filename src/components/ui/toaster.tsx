
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { useTheme } from "@/context/ThemeContext"

export function Toaster() {
  const { toasts } = useToast()
  const { resolvedTheme } = useTheme();
  
  const isDark = resolvedTheme === 'dark' || resolvedTheme === 'superdark';
  const isSuperDark = resolvedTheme === 'superdark';

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className={isSuperDark ? "bg-[#0A0A0A] text-white" : ""}>
            <div className="grid gap-1">
              {title && <ToastTitle className={isDark ? "text-white" : ""}>{title}</ToastTitle>}
              {description && (
                <ToastDescription className={isSuperDark ? "text-gray-400" : isDark ? "text-gray-300" : ""}>
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
