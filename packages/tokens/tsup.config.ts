import { defineConfig } from "tsup";
import { copyFile } from "node:fs/promises";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    tokens: "src/theme/tokens.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  outExtension({ format }) {
    return { js: format === "cjs" ? ".cjs" : ".js" };
  },
  async onSuccess() {
    await copyFile("src/theme/tokens.css", "dist/tokens.css");
  },
});
