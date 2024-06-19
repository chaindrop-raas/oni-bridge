import formsPlugin from "@tailwindcss/forms";
import type { Config } from "tailwindcss";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: "var(--color-accent)",
        "accent-dark": "var(--color-accent-dark)",
        "accent-fg": "var(--color-accent-fg)",
        "accent-fg-dark": "var(--color-accent-fg-dark)",
        base: "var(--color-base)",
        "base-dark": "var(--color-base-dark)",
        faded: "var(--color-faded)",
        "faded-dark": "var(--color-faded-dark)",
        foreground: "var(--color-foreground)",
        "foreground-dark": "var(--color-foreground-dark)",
        grouping: "var(--color-grouping)",
        "grouping-dark": "var(--color-grouping-dark)",
        subdued: "var(--color-subdued)",
      },
      fontSize: {
        xxs: "0.625rem",
      },
      screens: {
        body: "488px",
      },
    },
  },
  plugins: [formsPlugin()],
} satisfies Config;
