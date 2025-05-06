
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { useTheme } from "@/context/ThemeContext"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        premium: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700",
        subtle: "bg-muted/50 text-muted-foreground hover:bg-muted",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-lg px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const { resolvedTheme } = useTheme();
    const isSuperDark = resolvedTheme === 'superdark';
    const isDark = resolvedTheme === 'dark';
    
    const Comp = asChild ? Slot : "button"
    
    // Enhanced styles based on theme and variant
    let enhancedClassName = className;
    
    if (variant === 'default') {
      if (isSuperDark) {
        enhancedClassName = cn(className, "shadow-superdark-sm active:shadow-button-press");
      } else if (isDark) {
        enhancedClassName = cn(className, "shadow-md active:shadow-button-press");
      } else {
        enhancedClassName = cn(className, "shadow-sm active:shadow-button-press");
      }
    } else if (variant === 'premium') {
      enhancedClassName = cn(className, "shadow-md relative overflow-hidden");
    }
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className: enhancedClassName }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
