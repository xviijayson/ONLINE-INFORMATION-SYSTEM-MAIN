const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "dist");

const entries = [
  "index.html",
  "client.html",
  "unified-search-updated.html",
  "logo.png",
  "4cm.png",
  "css",
  "js",
  "pages",
  "data"
];

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

for (const entry of entries) {
  const source = path.join(root, entry);
  if (!fs.existsSync(source)) continue;

  const destination = path.join(outDir, entry);
  fs.cpSync(source, destination, { recursive: true });
}

console.log(`Static site copied to ${path.relative(root, outDir)}`);
