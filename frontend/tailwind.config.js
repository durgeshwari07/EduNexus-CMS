/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Sets Inter as the default sans font for all Tailwind classes
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // Define your high-fidelity brand palette
        brandBlue: '#136dec',   // From your "Add Subject" button
        brandGreen: '#10b981',  // From your "Assign Teacher" button
        brandSlate: '#0f172a',  // For deep headers
      },
    },
  },
  plugins: [],
};


