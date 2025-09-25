/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./data/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                "rainbow-gradient":
                    "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
            },
            spacing: {
                0: "0rem",
            },
            keyframes: {
                "breathing-gradient": {
                    "0%, 100%": {
                        "background-size": "400% 400%",
                        "background-position": "0% 0%;",
                    },
                    "50%": {
                        "background-size": "200% 200%",
                        "background-position": "100% 100%;",
                    },
                },
                "fade-in": {
                    "0%": { opacity: 0 },
                    "100%": { opacity: 1 },
                },
            },
            animation: {
                "breathing-gradient": "breathing-gradient 20s ease infinite",
                "fade-in": "fade-in 1s ease-in-out",
            },
            height: {
                192: "48rem",
            },
            colors: {
                transparent: "transparent",
            },
            screens: {
                "3xl": "1920px",
            },
            colors: {
                rainbow:
                    "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
            },
        },
    },
    plugins: [],
    darkMode: "class",
};
