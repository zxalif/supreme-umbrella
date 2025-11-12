import type { Config } from "tailwindcss";

/**
 * Tailwind CSS Configuration with Centralized Design System
 * 
 * IMPORTANT: All colors, spacing, and design tokens are centralized here.
 * Changes to this file will impact the entire application.
 * 
 * DO NOT use arbitrary values like `bg-[#FF0000]` in components.
 * Always use the design tokens defined here.
 */

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /**
       * CENTRALIZED COLOR SYSTEM
       * 
       * All colors are defined here. Use these in your components:
       * - bg-primary, text-primary, border-primary
       * - bg-secondary, text-secondary, border-secondary
       * - bg-accent, text-accent, border-accent
       * 
       * To change the entire app's color scheme, modify these values.
       */
      colors: {
        // Brand Colors - Soft Blue Palette (Professional + Friendly)
        primary: {
          50: "#eff6ff",   // Lightest blue
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",  // Main primary color - Soft Blue
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",  // Darkest blue
          950: "#172554",
        },
        secondary: {
          50: "#faf5ff",   // Lightest purple
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",  // Main secondary color - Purple
          600: "#9333ea",
          700: "#7e22ce",
          800: "#6b21a8",
          900: "#581c87",  // Darkest purple
          950: "#3b0764",
        },
        accent: {
          50: "#ecfdf5",   // Lightest green
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",  // Main accent color - Green
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",  // Darkest green
          950: "#022c22",
        },
        // Status Colors (Aligned with Soft Blue palette)
        success: {
          50: "#ecfdf5",   // Same as accent (green)
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",  // Main success color (same as accent)
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",  // Main warning color - Amber
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        error: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",  // Main error color - Red
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
        },
        info: {
          50: "#eff6ff",   // Same as primary (blue)
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",  // Main info color (same as primary)
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        // Neutral/Gray (for backgrounds, borders, text)
        gray: {
          50: "#fafafa",
          100: "#f4f4f5",
          200: "#e4e4e7",
          300: "#d4d4d8",
          400: "#a1a1aa",
          500: "#71717a",
          600: "#52525b",
          700: "#3f3f46",
          800: "#27272a",
          900: "#18181b",
          950: "#09090b",
        },
      },
      
      /**
       * CENTRALIZED SPACING SYSTEM
       * 
       * Use these for consistent spacing throughout the app.
       * Example: p-section, gap-card, space-y-form
       */
      spacing: {
        'section': '4rem',      // 64px - Section padding
        'card': '1.5rem',       // 24px - Card padding
        'form': '1rem',         // 16px - Form element spacing
        'button': '0.75rem',    // 12px - Button padding
      },
      
      /**
       * CENTRALIZED BORDER RADIUS
       * 
       * Use these for consistent rounded corners.
       * Example: rounded-card, rounded-button
       */
      borderRadius: {
        'card': '0.75rem',      // 12px - Card border radius
        'button': '0.5rem',     // 8px - Button border radius
        'input': '0.5rem',      // 8px - Input border radius
        'badge': '9999px',      // Fully rounded badges
      },
      
      /**
       * CENTRALIZED FONT SIZES
       * 
       * Use these for consistent typography.
       * Example: text-heading-1, text-body, text-caption
       */
      fontSize: {
        'heading-1': ['2.5rem', { lineHeight: '3rem', fontWeight: '700' }],      // 40px
        'heading-2': ['2rem', { lineHeight: '2.5rem', fontWeight: '700' }],      // 32px
        'heading-3': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],      // 24px
        'heading-4': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],  // 20px
        'body': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],           // 16px
        'body-sm': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }],   // 14px
        'caption': ['0.75rem', { lineHeight: '1rem', fontWeight: '400' }],       // 12px
      },
      
      /**
       * CENTRALIZED SHADOWS
       * 
       * Use these for consistent elevation.
       * Example: shadow-card, shadow-modal
       */
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'modal': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        'button': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      },
      
      /**
       * CENTRALIZED TRANSITIONS
       * 
       * Use these for consistent animations.
       * Example: transition-default, transition-fast
       */
      transitionDuration: {
        'fast': '150ms',
        'default': '200ms',
        'slow': '300ms',
      },
      
      /**
       * CENTRALIZED Z-INDEX
       * 
       * Use these for consistent layering.
       * Example: z-modal, z-dropdown
       */
      zIndex: {
        'dropdown': '1000',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
      },
    },
  },
  plugins: [],
};

export default config;
