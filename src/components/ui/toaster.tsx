
import { Toaster as SonnerToaster } from "sonner"
import { useTheme } from "@/context/ThemeContext"

export function Toaster() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const isSuperDark = resolvedTheme === 'superdark'
  
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: isSuperDark ? '#0A0A0A' : isDark ? '#0D1117' : 'white',
          color: isSuperDark || isDark ? 'white' : '#1f2937',
          border: `1px solid ${isSuperDark ? '#181818' : isDark ? '#1a1e26' : '#e5e7eb'}`
        },
        descriptionStyle: {
          color: isSuperDark ? '#9ca3af' : isDark ? '#d1d5db' : '#4b5563'
        }
      }}
    />
  )
}
