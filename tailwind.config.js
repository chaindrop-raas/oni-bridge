import formsPlugin from "@tailwindcss/forms";
import process from "process";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: process.env.BRIDGE_ACCENT_COLOR,
        "accent-dark": process.env.BRIDGE_ACCENT_COLOR_DARK,
        "accent-foreground": process.env.BRIDGE_ACCENT_COLOR_FOREGROUND,
        "accent-foreground-dark":
          process.env.BRIDGE_ACCENT_COLOR_FOREGROUND_DARK,
      },
      fontSize: {
        xxs: "0.625rem",
      },
    },
  },
  plugins: [formsPlugin()],
};
