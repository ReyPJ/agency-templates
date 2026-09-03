// The build can succeed and still ship a site whose images 404. That is not a
// hypothetical: deploying this template through an Astro adapter (Cloudflare's
// Workers flow adds one) switches image handling to a runtime endpoint, so the
// HTML ends up pointing at `/_image?href=...` and the optimized files are never
// written. Served as plain static assets, nothing answers `/_image`.
//
// So the build does not end at `astro build`. It ends here: every local URL the
// HTML references must exist as a file in the output.

import { readdirSync, existsSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const distDir = new URL("../dist/", import.meta.url).pathname;

if (!existsSync(distDir)) {
  console.error("verify-dist: dist/ does not exist. Run `astro build` first.");
  process.exit(1);
}

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

const files = walk(distDir);
const pages = files.filter((f) => f.endsWith(".html"));

if (pages.length === 0) {
  console.error("verify-dist: the build produced no HTML pages.");
  process.exit(1);
}

// An adapter puts the browser-facing files under dist/client/; a plain static
// build puts them at the root. Resolve against whichever one exists.
const assetRoots = [join(distDir, "client"), distDir].filter((d) => existsSync(d));

// URLs that name a file (they carry an extension). Bare routes like "/" or
// "/contacto" are pages the server resolves, not files we can look up.
const hasExtension = /\.[a-z0-9]{2,5}$/i;

const problems = [];

for (const page of pages) {
  const html = readFileSync(page, "utf8");
  const pageName = relative(distDir, page);

  // Astro's on-demand image endpoint. It only answers when a server runs; on a
  // static deploy every one of these is a 404, so the cause is worth naming.
  if (html.includes("/_image?")) {
    problems.push(
      `${pageName}: references Astro's runtime image endpoint (/_image?href=...).\n` +
        `    The images were never optimized at build time, so they will 404 on a static host.\n` +
        `    Cause: the build ran through an adapter that defers image transforms to runtime.\n` +
        `    Fix: build without an adapter, or set imageService: 'compile' on the adapter.`,
    );
    continue;
  }

  const urls = new Set();
  for (const [, value] of html.matchAll(/(?:src|href)="([^"]+)"/g)) urls.add(value);
  for (const [, value] of html.matchAll(/srcset="([^"]+)"/g)) {
    for (const candidate of value.split(",")) urls.add(candidate.trim().split(/\s+/)[0]);
  }

  for (const raw of urls) {
    const url = raw.replaceAll("&amp;", "&").split("#")[0].split("?")[0];
    if (!url.startsWith("/") || url.startsWith("//")) continue;
    if (!hasExtension.test(url)) continue;

    const found = assetRoots.some((root) => existsSync(join(root, url)));
    if (!found) problems.push(`${pageName}: references ${url}, which is not in the build output.`);
  }
}

if (problems.length > 0) {
  console.error(`\nverify-dist: the build output is broken (${problems.length} problem(s)):\n`);
  for (const problem of problems) console.error(`  - ${problem}`);
  console.error("");
  process.exit(1);
}

console.log(`verify-dist: ${pages.length} page(s) checked, every referenced asset is present.`);
