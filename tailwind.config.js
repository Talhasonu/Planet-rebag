/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
          colors: {
        primaryGreen: '#79AA00', // your custom green
        greenText: '#526D00', // your custom green
        white: '#FFFFFF', // your custom white
      },
    },
  },
  plugins: [],
};
