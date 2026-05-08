// Generate a flat dist/index.d.ts that consumers can use without resolving any
// .svg module references. Walking the source index files is more reliable than
// trying to coax tsc + ambient module declarations through a chain of
// re-exports — that path either hits "Exports not allowed in module
// augmentations" (when index.ts is a module) or yields `string`-typed exports
// (when consumers can't resolve `*.svg`).

import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(__dirname, "..", "src");
const OUT = resolve(__dirname, "..", "dist", "index.d.ts");

const RE_NAMED_EXPORT = /export\s*{\s*default\s+as\s+(\w+)\s*}\s*from\s*"[^"]+";?/g;

function collectExports(dir) {
  const names = new Set();
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      for (const n of collectExports(full)) names.add(n);
      continue;
    }
    if (entry !== "index.ts") continue;
    const content = readFileSync(full, "utf8");
    let match;
    while ((match = RE_NAMED_EXPORT.exec(content))) {
      names.add(match[1]);
    }
  }
  return names;
}

const names = [...collectExports(SRC)].sort();

const out = [
  `import type { FunctionComponent, SVGProps } from "react";`,
  ``,
  `type SVGComponent = FunctionComponent<SVGProps<SVGSVGElement>>;`,
  ``,
  ...names.map((n) => `export declare const ${n}: SVGComponent;`),
  ``,
].join("\n");

writeFileSync(OUT, out);
console.log(`Wrote ${names.length} icon declarations to dist/index.d.ts`);
