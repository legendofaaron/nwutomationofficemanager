
import { Toaster as SonnerToaster } from "sonner";
import { useTheme } from "@/context/ThemeContext";

export function Toaster() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const isSuperDark = resolvedTheme === 'superdark';
  
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: isSuperDark ? '#0A0A0A' : isDark ? '#0D1117' : 'white',
          color: isSuperDark || isDark ? 'white' : '#1f2937',
          border: `1px solid ${isSuperDark ? '#181818' : isDark ? '#1a1e26' : '#e5e7eb'}`,
          borderRadius: '0.75rem',
          fontSize: '0.925rem',
          boxShadow: isSuperDark ? '0 4px 6px rgba(0, 0, 0, 0.5)' : 
                    isDark ? '0 4px 6px rgba(0, 0, 0, 0.3)' : 
                    '0 4px 12px rgba(0, 0, 0, 0.08)',
        }
      }}
      closeButton
      className={isSuperDark ? "superdark-toaster" : isDark ? "dark-toaster" : "light-toaster"}
    />
  );
}
