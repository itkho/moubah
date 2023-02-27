const colors = require("tailwindcss/colors");

const base = colors.neutral;
const primary = colors.emerald;
const error = colors.red;

module.exports = {
    darkMode: "class",
    content: ["./renderer/**/*.html", "./renderer/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                // Neutral / Green
                ok: primary[700],
                ko: {
                    500: error[500],
                    600: error[600],
                    700: error[700],
                },
                highlight: {
                    hover: {
                        light: primary[500],
                        dark: primary[500],
                    },
                    light: primary[600],
                    dark: primary[600],
                },
                background: {
                    light: base[100],
                    dark: base[800],
                },
                base: {
                    100: {
                        light: base[100],
                        dark: base[800],
                    },
                    200: {
                        light: base[200],
                        dark: base[700],
                    },
                    300: {
                        light: base[300],
                        dark: base[600],
                    },
                    400: {
                        light: base[400],
                        dark: base[500],
                    },
                    500: {
                        light: base[500],
                        dark: base[400],
                    },
                    600: {
                        light: base[600],
                        dark: base[300],
                    },
                    700: {
                        light: base[700],
                        dark: base[200],
                    },
                    800: {
                        light: base[800],
                        dark: base[100],
                    },
                    900: {
                        light: base[900],
                        dark: base[50],
                    },
                },
            },
            keyframes: {
                bounceCentered: {
                    "0%, 100%": {
                        transform: "translateY(-25%) translateX(-50%)",
                        transitionTimingFunction: "cubic-bezier(0.8,0,1,1)",
                    },
                    "50%": {
                        transform: "translateX(-50%)",
                        transitionTimingFunction: "cubic-bezier(0,0,0.2,1)",
                    },
                },
                translateLeft: {
                    "0%": {
                        transform: "translateX(10rem)",
                    },
                    "100%": {
                        transform: "translateX(0px)",
                    },
                },
                appear: {
                    "0%": {
                        visibility: "hidden",
                    },
                    "99%": {
                        visibility: "hidden",
                    },
                    "100%": {
                        visibility: "visible",
                    },
                },
            },
            animation: {
                "bounce-slow": "bounceCentered 2s infinite",
                "translate-left": "translateLeft 0.5s",
                "delayed-show-10": "appear 10s",
                "delayed-show-1": "appear 1s",
            },
            fontFamily: {
                "fredoka-one": ['"Fredoka One"', "cursive"],
                rubik: ["Rubik", "sans-serif"],
            },
        },
    },
    variants: {
        extend: {},
        fontFamily: {
            sans: ["Inter", "ui-sans-serif", "system-ui"],
        },
    },
    plugins: [
        require("@tailwindcss/line-clamp"),
        require("tailwind-scrollbar")({ nocompatible: true }),
    ],
};
