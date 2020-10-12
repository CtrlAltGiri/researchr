module.exports = {
  purge: {
    enabled: false,   // enable this if you want to purge even in dev mode.
    content: [
      './views/*.pug',
      './views/**/*.pug'
    ]
  },
  theme: {
    extend: {},
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
    }
  },
  variants: {},
  plugins: [],
}
