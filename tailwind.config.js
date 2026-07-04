/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#1c49ff', hover: '#6a88ff', light: '#dbe2ff' },
        surface: '#ffffff',
        background: '#f8f9fa',
        border: '#e0e6eb',
        success: '#29c195',
        warning: '#f9cb78',
        danger: '#ff4242',
        ink: { DEFAULT: '#121212', secondary: '#666666', muted: '#9e9e9e' },
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(315deg, #4fffff, #0094ff 36%, #2848f5 71%, #8b61fd)',
      },
      borderRadius: {
        sm: '8px',
        md: '16px',
        lg: '24px',
        full: '9999px',
      },
      boxShadow: {
        card: '0 2px 20px rgba(0,0,0,0.05)',
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
