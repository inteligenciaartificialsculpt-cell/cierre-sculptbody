/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'dark-bg': '#000000',
                'dark-card': '#1a1a1a',
                'dark-secondary': '#0f0f0f',
                'accent-red': '#ff0033',
                'accent-red-hover': '#cc0029',
            },
            fontFamily: {
                'industrial': ['Inter', 'system-ui', 'sans-serif'],
            },
            fontWeight: {
                'ultra': '900',
            }
        },
    },
    plugins: [],
}
