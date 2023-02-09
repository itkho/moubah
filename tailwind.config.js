const colors = require("tailwindcss/colors");

module.exports = {
    darkMode: "class",
    content: ["./renderer/index.html", "./renderer/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                // Neutral / Green
                ok: colors.lime[700],
                ko: colors.red[700],
                highlight: {
                    light: colors.lime[600],
                    dark: colors.lime[500],
                },
                background: {
                    light: colors.neutral[100],
                    dark: colors.neutral[900],
                },
                neutral: {
                    100: {
                        light: colors.neutral[100],
                        dark: colors.neutral[900],
                    },
                    200: {
                        light: colors.neutral[200],
                        dark: colors.neutral[800],
                    },
                    300: {
                        hover: {
                            light: colors.neutral[400],
                            dark: colors.neutral[600],
                        },
                        light: colors.neutral[300],
                        dark: colors.neutral[700],
                    },
                    // 350: {
                    //     light: colors.neutral[350],
                    //     dark: colors.neutral[650],
                    // },
                    400: {
                        light: colors.neutral[400],
                        dark: colors.neutral[600],
                    },
                    500: {
                        light: colors.neutral[500],
                        dark: colors.neutral[500],
                    },
                    600: {
                        light: colors.neutral[600],
                        dark: colors.neutral[400],
                    },
                    700: {
                        light: colors.neutral[700],
                        dark: colors.neutral[300],
                    },
                    800: {
                        light: colors.neutral[800],
                        dark: colors.neutral[200],
                    },
                    900: {
                        light: colors.neutral[900],
                        dark: colors.neutral[100],
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
            },
            animation: {
                "bounce-slow": "bounceCentered 2s infinite",
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
