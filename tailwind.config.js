/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}", // Inclure les fichiers HTML et JS du dossier src
    "./index.html"          // Inclure le fichier HTML principal
  ],
  theme: {
    extend: {
      colors: {
        customYellow: '#FFD15B',
      },
      fontFamily: {
        anton: ['anton', 'sans-serif'],
      },
    },
  },
  variants: {},
  plugins: [],
}

