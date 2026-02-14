/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        "poppins": ["Poppins"],
        "poppins-med": ["Poppins-med"],
        "poppins-semi": ["Poppins-semi"],
      },
    },
  },
  plugins: [],
}