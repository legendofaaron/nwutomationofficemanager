
import * as React from "react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/context/ThemeContext"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    const { resolvedTheme } = useTheme();
    const isDarkMode = resolvedTheme === 'dark';
    const isSuperDarkMode = resolvedTheme === 'superdark';
    
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-app-gray-light px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          isDarkMode && "text-gray-100 bg-[#0d1117] border-[#1a1e26]",
          isSuperDarkMode && "text-gray-200 bg-[#0A0A0A] border-[#181818] focus-visible:ring-blue-500/50 placeholder:text-gray-600",
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
