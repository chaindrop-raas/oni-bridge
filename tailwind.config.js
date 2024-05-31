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
        "accent-fg": process.env.BRIDGE_ACCENT_COLOR_FOREGROUND,
        "accent-fg-dark": process.env.BRIDGE_ACCENT_COLOR_FOREGROUND_DARK,
        subdued: process.env.BRIDGE_SUBDUED_COLOR,
        faded: process.env.BRIDGE_FADED_COLOR,
      },
      fontSize: {
        xxs: "0.625rem",
      },
    },
  },
  plugins: [formsPlugin()],
};
