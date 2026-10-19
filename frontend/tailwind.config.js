/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/**/*.{html,ts}',
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
        mb: '425px',
      },
    },
    fontFamily: {
      sans: ['Roboto', 'sans-serif'],
      Orbitron: ['Orbitron', 'sans-serif'],
    },
    extend: {
      backgroundImage: {
        'profile-bg': "url('/assets/img_profile.jpeg')",
        'workout-bg': "url('/assets/img_workout.jpg')",
      },
      colors: {
        // Light mode colors (default)
        background: 'hsl(0 0% 100%)',
        foreground: 'hsl(222.2 47.4% 11.2%)',
        muted: 'hsl(210 40% 96.1%)',
        'muted-foreground': 'hsl(215.4 16.3% 46.9%)',
        popover: 'hsl(0 0% 100%)',
        'popover-foreground': 'hsl(222.2 47.4% 11.2%)',
        border: 'hsl(214.3 31.8% 91.4%)',
        input: 'hsl(214.3 31.8% 91.4%)',
        card: 'hsl(0 0% 100%)',
        'card-foreground': 'hsl(222.2 47.4% 11.2%)',
        primary: {
          DEFAULT: 'hsl(222.2 47.4% 11.2%)',
          foreground: 'hsl(210 40% 98%)',
        },
        secondary: {
          DEFAULT: 'hsl(210 40% 96.1%)',
          foreground: 'hsl(222.2 47.4% 11.2%)',
        },
        accent: {
          DEFAULT: 'hsl(210 40% 96.1%)',
          foreground: 'hsl(222.2 47.4% 11.2%)',
        },
        destructive: {
          DEFAULT: 'hsl(0 100% 50%)',
          foreground: 'hsl(210 40% 98%)',
        },
        ring: 'hsl(215 20.2% 65.1%)',

        // Dark mode colors
        dark: {
          background: 'hsl(224 71% 4%)',
          foreground: 'hsl(213 31% 91%)',
          muted: 'hsl(223 47% 11%)',
          'muted-foreground': 'hsl(215.4 16.3% 56.9%)',
          popover: 'hsl(224 71% 4%)',
          'popover-foreground': 'hsl(215 20.2% 65.1%)',
          border: 'hsl(216 34% 17%)',
          input: 'hsl(216 34% 17%)',
          card: 'hsl(224 71% 4%)',
          'card-foreground': 'hsl(213 31% 91%)',
          primary: {
            DEFAULT: 'hsl(210 40% 98%)',
            foreground: 'hsl(222.2 47.4% 1.2%)',
          },
          secondary: {
            DEFAULT: 'hsl(222.2 47.4% 11.2%)',
            foreground: 'hsl(210 40% 98%)',
          },
          accent: {
            DEFAULT: 'hsl(216 34% 17%)',
            foreground: 'hsl(210 40% 98%)',
          },
          destructive: {
            DEFAULT: 'hsl(0 63% 31%)',
            foreground: 'hsl(210 40% 98%)',
          },
          ring: 'hsl(216 34% 17%)',
        },
      },
      borderRadius: {
        lg: '0.5rem',
        md: 'calc(0.5rem - 2px)',
        sm: 'calc(0.5rem - 4px)',
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
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [],
};
