// tailwind.config.js
module.exports = {
    purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
    theme: {
        extend: {
            colors: {
                white: "#FFFFFF", // text, spotlight, textbox
                user: "#043c9d", // user cards
                "user-title": "#005DFF", // 'your team' in table view
                "dark-user": "#072C6D", // guessed user cards, user box in table view
                computer: "#9d0404", // enemy cards
                "computer-title": "#FF0000", // 'their team' in table view
                "dark-computer": "#6D0707", // guessed enemy cards, enemy box in table view
                bystander: "#918D61", // bystander cards, 'bystanders' text in table view
                "dark-bystander": "#2F2E1F", // guessed bystander cards, buttons and help text
                assassin: "#1E1E1E", // dark dark grey
                background: "#0C0C0C", // almost black
                button: "#5E5E5E", // darkish grey
                popup: "#D9D9D9", // grey
                purple: "#39005F", // submit button
            },
            keyframes: {
                "slide-up": {
                    "0%": { transform: "translateY(5%)", opacity: 0.2 },
                    "100%": { transform: "translateY(0)", opacity: 1 },
                },
            },
            animation: {
                "slide-up": "slide-up 0.05s ease-out",
            },
            screens: {
                "non-mobile": "520px",
                "2xl": "1600px",
            },
        },
        fontFamily: {
            courier: ['"Courier Prime"', "monospace"],
            "source-code-pro": ['"Source Code Pro"', "monospace"],
        },
    },
    variants: {},
    plugins: [],
};
