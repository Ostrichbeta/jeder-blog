module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            typography: {
                DEFAULT: {
                    css: {
                        maxWidth: "none",
                    },
                },
            },
        },
    },
    /* eslint-disable */
    plugins: [require("@tailwindcss/typography")],
    /* eslint-enable */
};
