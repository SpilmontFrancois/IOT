/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  darkMode: 'class',
  content: [
    './pages/**/*.vue',
    './components/**/*.vue',
    './layouts/**/*.vue',
    'node_modules/tv-*/dist/tv-*.umd.min.js',
  ],
  safelist: [],
  theme: {
    extend: {
      colors: {
        back: {
          DEFAULT: '#edf2f9',
        },
        text: {
          DEFAULT: '#222',
        },
        card: {
          DEFAULT: '#fff',
        },
        blue: {
          DEFAULT: '#1b9dd9',
          hover: '#0071a5',
          focus: '#94d7f6',
          secondary: {
            DEFAULT: '#004c6b',
            hover: '#003043',
            focus: '#1b80a9',
          },
        },
        red: {
          DEFAULT: '#e5352b',
          hover: '#cf2c23',
          focus: '#fc746c',
        },
        orange: {
          DEFAULT: '#f5803e',
          hover: '#e66015',
          focus: '#ffb88f',
        },
        green: {
          DEFAULT: '#61bc61',
          hover: '#49a249',
          focus: '#9ce99c',
        },
        gray: {
          DEFAULT: '#8d8f93',
        },
        yellow: {
          DEFAULT: '#f8b133',
        },
      },
      borderRadius: {
        md: '7px',
        lg: '10px',
        left: '4px 0px 0px 4px',
        right: '0px 4px 4px 0px',
      },
      boxShadow: {
        all: '0px 0px 40px rgba(0, 0, 0, 0.15);',
      },
      width: {
        112: '30rem',
        '1/9': '11.11%',
      },
      fontSize: {
        xxs: '0.625rem',
      },
      cursor: {
        grab: 'grab',
      },
      gridTemplateColumns: {
        12: 'repeat(12, minmax(0, 1fr))',
        14: 'repeat(14, minmax(0, 1fr))',
        16: 'repeat(16, minmax(0, 1fr))',
      },
    },
  },
  corePlugins: {
    fontWeight: false,
  },
}
