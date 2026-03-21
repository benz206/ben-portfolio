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
                "noir-gradient-cool":
                    "linear-gradient(150deg, rgba(8,12,25,0.95) 0%, rgba(5,10,24,0.94) 50%, rgba(7,14,32,0.96) 100%)",
                "noir-gradient-warm":
                    "linear-gradient(150deg, rgba(18,8,20,0.95) 0%, rgba(26,9,25,0.94) 50%, rgba(34,11,28,0.96) 100%)",
                "noir-gradient-emerald":
                    "linear-gradient(150deg, rgba(6,14,12,0.95) 0%, rgba(5,18,22,0.94) 48%, rgba(8,26,28,0.96) 100%)",
                "noir-radial-cool":
                    "radial-gradient(circle at 15% 20%, rgba(112,128,255,0.22), transparent 55%), radial-gradient(circle at 80% 15%, rgba(94,216,255,0.18), transparent 50%), radial-gradient(circle at 35% 85%, rgba(92,216,189,0.18), transparent 55%)",
                "noir-radial-warm":
                    "radial-gradient(circle at 20% 20%, rgba(255,154,122,0.2), transparent 55%), radial-gradient(circle at 80% 10%, rgba(255,104,181,0.18), transparent 45%), radial-gradient(circle at 40% 80%, rgba(255,204,112,0.18), transparent 55%)",
                "noir-radial-emerald":
                    "radial-gradient(circle at 20% 20%, rgba(112,255,213,0.2), transparent 55%), radial-gradient(circle at 80% 10%, rgba(112,186,255,0.18), transparent 45%), radial-gradient(circle at 40% 80%, rgba(122,255,168,0.18), transparent 55%)",
                "noir-gradient-berry":
                    "linear-gradient(150deg, rgba(6,3,20,0.97) 0%, rgba(12,3,29,0.98) 45%, rgba(9,1,20,0.99) 100%)",
                "noir-radial-berry":
                    "radial-gradient(circle at 18% 18%, rgba(129, 140, 248, 0.10), transparent 55%), radial-gradient(circle at 78% 16%, rgba(190, 24, 93, 0.14), transparent 52%), radial-gradient(circle at 26% 80%, rgba(76, 29, 149, 0.10), transparent 58%), radial-gradient(circle at 86% 82%, rgba(48, 17, 40, 0.18), transparent 55%)",
                "noir-gradient-spotify":
                    "linear-gradient(145deg, rgba(6,7,10,0.97) 0%, rgba(5,6,9,0.96) 40%, rgba(1,2,3,0.99) 100%)",
                "noir-radial-spotify":
                    "radial-gradient(circle at 18% 20%, rgba(34,197,94,0.16), transparent 55%), radial-gradient(circle at 78% 18%, rgba(99,102,241,0.14), transparent 52%), radial-gradient(circle at 35% 82%, rgba(236,72,153,0.12), transparent 58%)",
            },
            keyframes: {
                "fade-in": {
                    "0%": { opacity: 0 },
                    "100%": { opacity: 1 },
                },
                "arrow-flicker": {
                    "0%, 100%": { opacity: "0.45" },
                    "50%": { opacity: "1" },
                },
            },
            animation: {
                "fade-in": "fade-in 1s ease-in-out",
                "arrow-flicker": "arrow-flicker 1.8s ease-in-out infinite",
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
