module.exports = {
    content: ["./renderer/index.html", "./renderer/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                highlight: "#e63946",
                background: "#fffcf2",
                gray: {
                    1: "#ccc5b9",
                    2: "#403d39",
                    3: "#252422",
                },
                ok: "#606c38",
                ko: "#e63946",
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
