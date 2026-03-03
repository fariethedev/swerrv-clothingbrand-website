/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: '#c8ff00',
        'accent-dark': '#a3cc00',
        'grey-900': '#111111',
        'grey-700': '#404040',
        'grey-500': '#808080',
        'grey-300': '#c0c0c0',
        'grey-100': '#f0f0f0',
        'brand-red': '#ff3b30',
        'brand-green': '#34c759',
        'brand-blue': '#007aff',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        grotesk: ['Space Grotesk', 'sans-serif'],
        dancing: ['Dancing Script', 'cursive'],
      },
      letterSpacing: {
        widest2: '0.2em',
        widest3: '0.3em',
        widest4: '0.4em',
      },
      height: {
        nav: '70px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
    },
  },
  plugins: [],
};
