import  flowbite from "flowbite/plugin";
import tailwindForms from '@tailwindcss/forms'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/lib/esm/**/*.js'
  ],
  theme: {
    extend: {
      animation: {
        spin: 'spin 1s linear infinite',
      },
      colors: {
        primary: "#004953",
        primaryHover: "#002a30",
        buttonsBg: "#EE3844",
        dark1: "#2E2E2E",
        dark2: "#292929",
        gray2: "#E1E1E1",
        gray3: "#505050",
        gray4: "rgba(137, 207, 240, 0.06)",
        secondary: "#F4F4F4",
        n1: "#D1D1D1",
        n2: "#E1E1E1",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      keyframes: {
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [
    flowbite,
    tailwindForms
],
}

