
import { useTheme } from "@/context/ThemeContext"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { resolvedTheme } = useTheme()

  return (
    <Sonner
      theme={resolvedTheme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
        style: {
          ...(resolvedTheme === 'superdark' ? {
            background: '#0A0A0A',
            border: '1px solid #181818',
            color: '#E0E0E0',
          } : resolvedTheme === 'dark' ? {
            background: '#0D1117',
            border: '1px solid #1E2430',
            color: '#E5EAF2',
          } : {}),
        }
      }}
      {...props}
    />
  )
}

export { Toaster }
