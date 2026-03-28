/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#050505',
        'brand-surface': '#0f1012',
        'brand-surface-light': '#1a1b1e',
        'brand-primary': '#d6b052', // Champagne Gold
        'brand-accent': '#0f3d30',  // Deep Emerald 
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'display': ['Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(145deg, rgba(26,27,30,0.8) 0%, rgba(15,16,18,0.8) 100%)',
      }
    },
  },
  plugins: [],
}
