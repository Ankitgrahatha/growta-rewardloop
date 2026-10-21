import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = await readFile(path.join(root, "index.html"), "utf8");

const checks = [
  ["HTML document declaration", /<!doctype html>/i],
  ["Supported interface language attribute", /<html[^>]*\blang=["'](en|hi)["']/i],
  ["Responsive viewport", /<meta[^>]*name=["']viewport["'][^>]*content=["'][^"']*width=device-width/i],
  ["Page title", /<title>[^<]+<\/title>/i],
  ["Main content landmark", /<main\b/i],
];

const failures = checks.filter(([, pattern]) => !pattern.test(html));
if (failures.length) {
  for (const [name] of failures) console.error(`FAIL: ${name}`);
  process.exitCode = 1;
} else {
  console.log(`PASS: ${checks.length} static homepage build checks`);
}
