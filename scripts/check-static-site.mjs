import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = await readFile(path.join(root, "index.html"), "utf8");
const app = await readFile(path.join(root, "app.js"), "utf8");
const htmlIds = new Set([...html.matchAll(/id="([^"]+)"/g)].map((match) => match[1]));
const referencedIds = [...new Set([...app.matchAll(/\$\("([^"]+)"\)/g)].map((match) => match[1]))];
const missingIds = referencedIds.filter((id) => !htmlIds.has(id));

const checks = [
  ["HTML document declaration", /<!doctype html>/i],
  ["Supported interface language attribute", /<html[^>]*\blang=["'](en|hi)["']/i],
  ["Responsive viewport", /<meta[^>]*name=["']viewport["'][^>]*content=["'][^"']*width=device-width/i],
  ["Page title", /<title>[^<]+<\/title>/i],
  ["Main content landmark", /<main\b/i],
  ["Frontend JavaScript entry point", /<script[^>]+src="\.?\/?app\.js"/i],
  ["Profile load error recovery view", /id="profile-error-view"/],
  ["Profile retry control", /id="retry-profile-button"/],
];

const failures = checks.filter(([, pattern]) => !pattern.test(html));
if (missingIds.length) {
  console.error(`FAIL: app.js references missing HTML IDs: ${missingIds.join(", ")}`);
  process.exitCode = 1;
}
if (failures.length) {
  for (const [name] of failures) console.error(`FAIL: ${name}`);
  process.exitCode = 1;
} else {
  console.log(`PASS: ${checks.length} static homepage build checks and ${referencedIds.length} JavaScript-to-HTML ID references`);
}
