
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Additional utility for generating gradient text
export function gradientText(className?: string) {
  return cn(
    "bg-clip-text text-transparent bg-gradient-to-r",
    className
  )
}

// Utility for enhanced card appearance based on theme
export function enhancedCard(theme: string, className?: string) {
  const baseClasses = "rounded-xl border transition-all duration-300"
  
  if (theme === "superdark") {
    return cn(baseClasses, "bg-[#090909] border-[#151515] shadow-superdark hover:shadow-superdark-md", className)
  }
  
  if (theme === "dark") {
    return cn(baseClasses, "bg-[#0d1117] border-[#1a1e26] shadow-md hover:shadow-lg", className)
  }
  
  return cn(baseClasses, "bg-white border-gray-200 shadow-elegant-sm hover:shadow-elegant", className)
}

// Utility for enhanced button styles based on theme
export function enhancedButton(theme: string, variant: 'primary' | 'secondary' | 'outline' = 'primary', className?: string) {
  if (variant === 'primary') {
    if (theme === "superdark") {
      return cn("bg-blue-600 hover:bg-blue-700 text-white shadow-superdark-sm", className)
    }
    
    if (theme === "dark") {
      return cn("bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-md", className)
    }
    
    return cn("bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-sm", className)
  }
  
  if (variant === 'outline') {
    if (theme === "superdark") {
      return cn("border-[#202020] bg-black hover:bg-[#0a0a0a] text-white", className)
    }
    
    if (theme === "dark") {
      return cn("border-blue-900/50 bg-[#111827] hover:bg-[#1e293b] text-white", className)
    }
    
    return cn("border-gray-200 bg-white hover:bg-gray-50 text-gray-700", className)
  }
  
  // Secondary variant
  if (theme === "superdark") {
    return cn("bg-[#111] hover:bg-[#181818] text-gray-300 shadow-superdark-sm", className)
  }
  
  if (theme === "dark") {
    return cn("bg-[#1a1e26] hover:bg-[#2a3441] text-gray-200 shadow-sm", className)
  }
  
  return cn("bg-gray-100 hover:bg-gray-200 text-gray-800", className)
}
