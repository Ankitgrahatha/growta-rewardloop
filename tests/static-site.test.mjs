import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

test("homepage identifies Growta RewardLoop", () => {
  assert.match(html, /Growta\s*<span[^>]*>RewardLoop<\/span>/i);
});

test("homepage includes responsive mobile viewport", () => {
  assert.match(html, /name="viewport"/i);
  assert.match(html, /width=device-width/i);
});

test("homepage does not claim a reward was awarded", () => {
  assert.doesNotMatch(html, /points awarded successfully|reward redeemed successfully/i);
});

test("homepage identifies itself as a temporary deployment test", () => {
  assert.match(html, /Temporary deployment test page/i);
});
