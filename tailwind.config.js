const colors = require("tailwindcss/colors");

module.exports = {
    content: ["./renderer/index.html", "./renderer/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                // Neutral / Green
                highlight: colors.lime[500],
                ok: colors.lime[700],
                ko: colors.red[700],
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
    plugins: [require("@tailwindcss/line-clamp")],
};
