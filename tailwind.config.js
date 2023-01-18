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
