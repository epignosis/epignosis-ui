import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react({ jsxImportSource: "@emotion/react" })],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "@emotion/react",
        "@emotion/react/jsx-runtime",
        "react-spinners",
        /^@epignosis_llc\/ui-tokens(\/.*)?$/,
        /^@epignosis_llc\/ui-icons(\/.*)?$/,
      ],
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
