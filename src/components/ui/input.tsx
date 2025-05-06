
import * as React from "react"
import { useTheme } from "@/context/ThemeContext"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const { resolvedTheme } = useTheme();
    const isDarkMode = resolvedTheme === 'dark';
    const isSuperDarkMode = resolvedTheme === 'superdark';
    
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          isDarkMode && "border-[#2a2f38] focus-visible:border-blue-600 text-gray-100 placeholder:text-gray-500",
          isSuperDarkMode && "border-[#181818] focus-visible:border-[#2563eb] focus-visible:ring-[#2563eb]/20 text-gray-200 placeholder:text-gray-600",
          !isDarkMode && !isSuperDarkMode && "border-gray-200 focus-visible:border-blue-500 focus-visible:ring-blue-500/30",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
