/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Soft Pastels
        'blush-pink': '#F8D7DA',
        'powder-blue': '#B8E0E6',
        'mint-green': '#C8E6C9',
        'warm-cream': '#FFF8E1',
        // Accent Colors
        'terracotta': '#E07A5F',
        'dusty-rose': '#D4A5A5',
        // Neutrals
        'off-white': '#FEFEFE',
        'warm-gray': '#6B6B6B',
        'cotton-white': '#FFFFFF',
        // Legacy colors (keeping for compatibility)
        'primary-pink': '#FFB6C1',
        'primary-pink-dark': '#FF69B4',
        'purple': '#8B5CF6',
        'purple-light': '#A855F7',
        'bg-pink': '#FFF0F5',
        'bg-purple': '#F3E5F5',
        'footer-dark': '#2C3E50',
      },
      fontFamily: {
        'header': ['var(--font-quicksand)', 'var(--font-poppins)', 'sans-serif'],
        'body': ['var(--font-inter)', 'var(--font-dm-sans)', 'sans-serif'],
        'script': ['var(--font-dancing-script)', 'cursive'],
        'playful': ['Comic Sans MS', 'cursive', 'system-ui'],
      },
    },
  },
  plugins: [],
}

