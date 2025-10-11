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
                "noir-gradient":
                    "linear-gradient(140deg, rgba(9,11,16,0.95) 0%, rgba(6,7,12,0.95) 45%, rgba(2,3,5,0.98) 100%)",
                "noir-radial":
                    "radial-gradient(circle at 20% 20%, rgba(98,106,255,0.16), transparent 55%), radial-gradient(circle at 80% 10%, rgba(255,122,225,0.18), transparent 45%), radial-gradient(circle at 30% 80%, rgba(82,217,184,0.12), transparent 55%)",
            },
            spacing: {
                0: "0rem",
            },
            keyframes: {
                "fade-in": {
                    "0%": { opacity: 0 },
                    "100%": { opacity: 1 },
                },
            },
            animation: {
                "fade-in": "fade-in 1s ease-in-out",
            },
            height: {
                192: "48rem",
            },
            screens: {
                "3xl": "1920px",
            },
        },
    },
    plugins: [],
    darkMode: "class",
};
