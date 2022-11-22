/** @type {import('tailwindcss').Config} */
module.exports = {
    variants: {
        extend: {
          visibility: ["group-hover"],
        },
    },
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
  
        },
    },
    corePlugins: {
        // Remove Tailwind CSS's preflight style, so it can use the MUI's preflight instead (CssBaseline).
        preflight: false
    },
    plugins: [],
}