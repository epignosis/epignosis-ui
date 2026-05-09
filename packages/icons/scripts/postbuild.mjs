// Generate a flat dist/index.d.ts that consumers can use without resolving any
// .svg module references. Walking the source index files is more reliable than
// trying to coax tsc + ambient module declarations through a chain of
// re-exports — that path either hits "Exports not allowed in module
// augmentations" (when index.ts is a module) or yields `string`-typed exports
// (when consumers can't resolve `*.svg`).
//
// Also emits dist/svg/<ComponentName>.svg — raw SVG files for non-React
// consumers (Vue, Svelte, vanilla, etc.) to import as URLs. Filenames mirror
// the React component names so the mental model stays 1:1. The same
// `currentColor` rewrite that vite-plugin-svgr applies to JSX output is
// applied here so visual behavior matches across both entry points.

import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(__dirname, "..", "src");
const DIST = resolve(__dirname, "..", "dist");
const OUT_DTS = resolve(DIST, "index.d.ts");
const OUT_SVG_DIR = resolve(DIST, "svg");

const RE_NAMED_EXPORT = /export\s*{\s*default\s+as\s+(\w+)\s*}\s*from\s*"([^"]+)";?/g;

function collectExports(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...collectExports(full));
      continue;
    }
    if (entry !== "index.ts") continue;
    const content = readFileSync(full, "utf8");
    let match;
    while ((match = RE_NAMED_EXPORT.exec(content))) {
      const [, name, importPath] = match;
      if (!importPath.endsWith(".svg")) continue;
      out.push({ name, sourceSvg: resolve(dir, importPath) });
    }
  }
  return out;
}

const exports = collectExports(SRC).sort((a, b) => a.name.localeCompare(b.name));

const dts = [
  `import type { FunctionComponent, SVGProps } from "react";`,
  ``,
  `type SVGComponent = FunctionComponent<SVGProps<SVGSVGElement>>;`,
  ``,
  ...exports.map(({ name }) => `export declare const ${name}: SVGComponent;`),
  ``,
].join("\n");
writeFileSync(OUT_DTS, dts);
console.log(`Wrote ${exports.length} icon declarations to dist/index.d.ts`);

// Match the `replaceAttrValues` config in vite.config.ts: rewrite hard-coded
// black fills/strokes to currentColor so consumers can recolor via CSS.
const rewriteCurrentColor = (svg) => svg.replace(/="#000(?:000)?"/gi, '="currentColor"');

mkdirSync(OUT_SVG_DIR, { recursive: true });
for (const { name, sourceSvg } of exports) {
  const raw = readFileSync(sourceSvg, "utf8");
  writeFileSync(resolve(OUT_SVG_DIR, `${name}.svg`), rewriteCurrentColor(raw));
}
console.log(`Wrote ${exports.length} raw SVGs to dist/svg/`);
