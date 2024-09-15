/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#16423C',
          DEFAULT: '#6A9C89',
          light: '#C4DAD2',
          lightest: '#E9EFEC',
        },
      },
    },
  },
  plugins: [],
}

