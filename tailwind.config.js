/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgApp: '#FFFFFF', // Pure White Page Background
        accentCyan: '#007A87', // Cisco Brand Teal
        accentPurple: '#002D62', // Cisco Brand Navy
        accentGold: '#D97706', // Cisco Orange/Amber
        accentGreen: '#1E824C', // Cisco Brand Green
        bgElement: '#FFFFFF',
        bgSelected: '#E0F2F1', // Light Aqua Teal selection
        textSecondary: '#4A5568', // Slate Text
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      boxShadow: {
        glow: '0 4px 14px 0 rgba(0, 122, 135, 0.12)',
        glowPurple: '0 4px 14px 0 rgba(0, 45, 98, 0.12)',
        glowGreen: '0 4px 14px 0 rgba(30, 130, 76, 0.12)',
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #007A87 0%, #002D62 100%)', // Cisco Teal-to-Navy Gradient
      }
    },
  },
  plugins: [],
}
