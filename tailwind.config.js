module.exports = {
  content: ["./src/**/*.tsx", "./src/**/*.css"],
theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      
            colors: {
              primary: '#3b82f6', // Define primary como un tono de azul
            },

    },
  },
  plugins: [require("@tailwindcss/forms")],
};
