
import * as React from "react"
import { useTheme } from "@/context/ThemeContext"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    const { resolvedTheme } = useTheme();
    const isDarkMode = resolvedTheme === 'dark';
    const isSuperDarkMode = resolvedTheme === 'superdark';
    
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          isDarkMode && "text-gray-100 bg-[#0d1117] border-[#1a1e26] focus-visible:border-blue-600",
          isSuperDarkMode && "text-gray-200 bg-[#0A0A0A] border-[#181818] focus-visible:ring-blue-500/50 focus-visible:border-[#2563eb] placeholder:text-gray-600",
          !isDarkMode && !isSuperDarkMode && "text-gray-900 bg-white border-gray-200 focus-visible:ring-blue-500/30",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
