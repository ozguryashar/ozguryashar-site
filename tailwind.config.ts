import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0F3460",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#F2C811",
          foreground: "#1A1A2E",
        },
        highlight: {
          DEFAULT: "#118DFF",
          foreground: "#FFFFFF",
        },
        background: "#FAFAFA",
        surface: "#F0F4F8",
        "text-main": "#1A1A2E",
        muted: {
          DEFAULT: "#F0F4F8",
          foreground: "#64748B",
        },
        border: "#E2E8F0",
        foreground: "#1A1A2E",
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1A1A2E",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#1A1A2E",
        },
        secondary: {
          DEFAULT: "#F0F4F8",
          foreground: "#1A1A2E",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        input: "#E2E8F0",
        ring: "#0F3460",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "#1A1A2E",
            "--tw-prose-headings": "#0F3460",
            "--tw-prose-links": "#118DFF",
            "--tw-prose-bold": "#1A1A2E",
            "--tw-prose-code": "#0F3460",
            "--tw-prose-pre-bg": "#1A1A2E",
            "--tw-prose-pre-code": "#F0F4F8",
            "--tw-prose-quotes": "#64748B",
            "--tw-prose-quote-borders": "#F2C811",
            maxWidth: "none",
            "h2, h3, h4": {
              scrollMarginTop: "5rem",
            },
            "pre code": {
              fontSize: "0.875rem",
              lineHeight: "1.7",
            },
            "blockquote p": {
              fontStyle: "italic",
            },
            img: {
              borderRadius: "0.75rem",
            },
          },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};

export default config;
