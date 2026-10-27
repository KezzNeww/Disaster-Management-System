/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        '2xl': '1600px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        
        // Exact Enterprise Brand Palette from Specification
        enterprise: {
          slate: '#0F172A',     // Primary dark surface
          gray: '#111827',      // Secondary surface / panel
          blue: '#2563EB',      // Primary telemetry blue
          sky: '#38BDF8',       // Accent cyan / sensor highlights
          emerald: '#22C55E',   // Status safe / operational normal
          red: '#EF4444',       // Critical hazard alert
          deep: '#0B0F17',      // Deepest background canvas
          card: '#131D31',      // Card surface
          muted: '#1E293B',     // Elevated surface / border
          subtle: '#64748B',    // Subdued typography
        },
        
        primary: {
          DEFAULT: '#2563EB',
          foreground: '#FFFFFF',
          hover: '#1D4ED8',
          light: '#38BDF8',
        },
        secondary: {
          DEFAULT: '#1E293B',
          foreground: '#F1F5F9',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        success: {
          DEFAULT: '#22C55E',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#1E293B',
          foreground: '#94A3B8',
        },
        accent: {
          DEFAULT: '#38BDF8',
          foreground: '#0F172A',
        },
        popover: {
          DEFAULT: '#111827',
          foreground: '#F8FAFC',
        },
        card: {
          DEFAULT: '#0F172A',
          foreground: '#F8FAFC',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'radar-sweep': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'radar-sweep': 'radar-sweep 4s linear infinite',
        'pulse-subtle': 'pulse-subtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
