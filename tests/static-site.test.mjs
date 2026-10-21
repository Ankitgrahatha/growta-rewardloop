import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const app = await readFile(new URL("../app.js", import.meta.url), "utf8");
const manifest = await readFile(new URL("../manifest.webmanifest", import.meta.url), "utf8");
const sw = await readFile(new URL("../sw.js", import.meta.url), "utf8");

test("homepage identifies Growta RewardLoop", () => {
  assert.match(html, /Growta\s*<b>RewardLoop<\/b>/i);
});

test("homepage includes responsive mobile viewport", () => {
  assert.match(html, /name="viewport"/i);
  assert.match(html, /width=device-width/i);
});

test("farmer journey includes authentication, profile, QR claim and rewards", () => {
  assert.match(html, /id="auth-form"/);
  assert.match(html, /id="profile-form"/);
  assert.match(html, /id="claim-form"/);
  assert.match(html, /id="rewards-list"/);
});

test("the PWA has an install manifest and service worker", () => {
  assert.match(html, /rel="manifest"/);
  assert.match(manifest, /"display": "standalone"/);
  assert.match(sw, /addAll\(SHELL\)/);
});

test("claim and redemption are routed through the authenticated API", () => {
  assert.match(app, /invoke\("claim"/);
  assert.match(app, /invoke\("redeem"/);
  assert.match(app, /Authorization.*Bearer/);
});

test("demo rewards are excluded from the farmer catalogue", () => {
  assert.match(app, /eq\("is_demo",false\)/);
});

test("no UI success is shown before the server response", () => {
  assert.match(app, /const result=await invoke\("claim"/);
  assert.match(app, /if\(result\.ok\)/);
});
