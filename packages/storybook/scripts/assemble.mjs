import { cpSync, mkdirSync, rmSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "../../../");
const out = resolve(__dirname, "../storybook-static");

// sub-Storybook dist dirs → subpath under the hub's static output
const refs = [
  { src: "packages/react/storybook-static", dest: "react" },
  { src: "packages/vue/storybook-static", dest: "vue" },
  { src: "packages/icons/storybook-static", dest: "icons" },
  { src: "packages/tokens/storybook-static", dest: "tokens" },
];

for (const { src, dest } of refs) {
  const srcPath = resolve(root, src);
  const destPath = resolve(out, dest);
  rmSync(destPath, { recursive: true, force: true });
  mkdirSync(destPath, { recursive: true });
  cpSync(srcPath, destPath, { recursive: true });
  console.log(`copied ${src} → storybook-static/${dest}`);
}

console.log("assembly done →", out);
