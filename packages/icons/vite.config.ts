import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        // Render with `currentColor` so consumers can recolor via CSS.
        replaceAttrValues: {
          "#000": "currentColor",
          "#000000": "currentColor",
        },
      },
      include: "**/*.svg",
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime"],
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
