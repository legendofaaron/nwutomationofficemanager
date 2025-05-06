import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      animation: {
        "spin-slow": "spin-slow 3s linear infinite",
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        "fade-out": {
          "0%": {
            opacity: "1",
          },
          "100%": {
            opacity: "0",
          },
        },
        "slide-in": {
          "0%": {
            transform: "translateY(10px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        "pulse": {
          "0%, 100%": {
            opacity: 1,
          },
          "50%": {
            opacity: 0.8,
          },
        },
        "shimmer": {
          "100%": {
            transform: "translateX(100%)",
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        },
        // Custom colors for our app
        app: {
          blue: {
            light: '#E6F4FF',
            DEFAULT: '#1E90FF',
            dark: '#0066CC'
          },
          gray: {
            lightest: '#F8F9FA',
            light: '#F1F3F5',
            DEFAULT: '#E9ECEF',
            dark: '#DEE2E6',
            darker: '#CED4DA'
          },
          // Professional superdark specific colors
          superdark: {
            bg: '#050505',
            card: '#0A0A0A',
            border: '#1E1E1E',
            muted: '#181818',
            blue: {
              light: '#4284fd',
              DEFAULT: '#1E64D0', 
              dark: '#0F3A7C',
            },
            gray: {
              lightest: '#444444',
              light: '#333333',
              DEFAULT: '#222222',
              dark: '#111111',
              darker: '#0A0A0A'
            },
            text: {
              primary: '#E0E0E0',
              secondary: '#999999',
              muted: '#666666'
            }
          }
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        'fade-in': {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          }
        },
        'fade-out': {
          '0%': {
            opacity: '1',
          },
          '100%': {
            opacity: '0',
          }
        },
        'slide-in': {
          '0%': {
            transform: 'translateY(10px)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1'
          }
        },
        pulse: {
          '0%, 100%': {
            opacity: 1
          },
          '50%': {
            opacity: 0.8
          }
        },
        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        },
      },
      boxShadow: {
        'superdark-sm': '0 1px 2px rgba(0, 0, 0, 0.4)',
        'superdark': '0 4px 6px rgba(0, 0, 0, 0.5)',
        'superdark-md': '0 6px 10px rgba(0, 0, 0, 0.6)',
        'superdark-lg': '0 10px 15px rgba(0, 0, 0, 0.7)',
        'superdark-xl': '0 15px 25px rgba(0, 0, 0, 0.8)',
        'superdark-2xl': '0 25px 50px rgba(0, 0, 0, 0.9)',
        'superdark-inner': 'inset 0 2px 4px rgba(0, 0, 0, 0.5)',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
