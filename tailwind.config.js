import formsPlugin from "@tailwindcss/forms";
import process from "process";

const autoDark = ({ addUtilities, theme }) => {
  const newUtilities = {
    ".dark .bg-accent": {
      background: theme("colors.accent-dark"),
    },
    ".dark .bg-base": {
      background: theme("colors.base-dark"),
    },
    ".dark .bg-grouping": {
      background: theme("colors.grouping-dark"),
    },
    ".dark .text-accent-fg": {
      color: theme("colors.accent-fg-dark"),
    },
    ".dark .text-foreground": {
      color: theme("colors.foreground-dark"),
    },
    ".dark .text-faded": {
      color: theme("colors.faded-dark"),
    },
    ".dark .bg-faded": {
      color: theme("colors.faded-dark"),
    },
    ".dark .border-faded": {
      borderColor: theme("colors.faded-dark"),
    },
  };
  addUtilities(newUtilities, ["responsive", "dark", "hover"]);
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: process.env.BRIDGE_ACCENT_COLOR,
        "accent-dark": process.env.BRIDGE_ACCENT_COLOR_DARK,
        "accent-fg": process.env.BRIDGE_ACCENT_COLOR_FOREGROUND,
        "accent-fg-dark": process.env.BRIDGE_ACCENT_COLOR_FOREGROUND_DARK,
        base: process.env.BRIDGE_BACKGROUND_COLOR,
        "base-dark": process.env.BRIDGE_BACKGROUND_COLOR_DARK,
        foreground: process.env.BRIDGE_FOREGROUND_COLOR,
        "foreground-dark": process.env.BRIDGE_FOREGROUND_COLOR_DARK,
        faded: process.env.BRIDGE_FADED_COLOR,
        "faded-dark": process.env.BRIDGE_FADED_COLOR_DARK,
        grouping: process.env.BRIDGE_GROUPING_COLOR,
        "grouping-dark": process.env.BRIDGE_GROUPING_COLOR_DARK,
        subdued: process.env.BRIDGE_SUBDUED_COLOR,
      },
      fontSize: {
        xxs: "0.625rem",
      },
      screens: {
        body: "488px",
      },
    },
  },
  plugins: [formsPlugin(), autoDark],
};
