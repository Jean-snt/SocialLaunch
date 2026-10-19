/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mapeo exacto según especificación técnica Sección 5
        brand: {
          primary: "var(--primary-color, #2563EB)",
          secondary: "var(--secondary-color, #0F172A)",
          accent: "var(--accent-color, #10B981)",
          surface: "var(--bg-surface, #F8FAFC)",
          dark: "var(--bg-dark, #1E293B)",
        },

        // Variables CSS dinámicas consumidas por utilidades de diseño
        primary: "var(--primary-color, #2563EB)",
        "primary-container": "var(--primary-color, #2563EB)",
        "on-primary": "#ffffff",
        "on-primary-container": "#eeefff",
        "primary-fixed": "#dbe1ff",

        secondary: "var(--secondary-color, #0F172A)",
        "secondary-container": "#dae2fd",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#5c647a",

        tertiary: "var(--accent-color, #10B981)",
        "tertiary-container": "var(--accent-color, #10B981)",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#bdffdb",
        "tertiary-fixed": "#6ffbbe",
        "on-tertiary-fixed": "#002113",

        surface: "var(--bg-surface, #F8FAFC)",
        "surface-dim": "#d8dadc",
        "surface-bright": "#f7f9fb",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f2f4f6",
        "surface-container": "#eceef0",
        "surface-container-high": "#e6e8ea",
        "surface-container-highest": "#e0e3e5",
        "on-surface": "#191c1e",
        "on-surface-variant": "#434655",

        "inverse-surface": "var(--bg-dark, #1E293B)",
        "inverse-on-surface": "#eff1f3",

        outline: "#737686",
        "outline-variant": "#c3c6d7",

        error: "#ba1a1a",
        "error-container": "#ffdad6",
      },
      fontFamily: {
        headline: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Inter", "sans-serif"],
        sans: ["var(--font-family, 'Plus Jakarta Sans', sans-serif)"],
      },
      spacing: {
        gutter: "1.5rem",
        "gutter-mobile": "0.75rem",
        margin: "2rem",
        "margin-mobile": "1rem",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
};
