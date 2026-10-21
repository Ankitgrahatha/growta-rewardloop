import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const api = await readFile(new URL("../supabase/functions/rewardloop-api/index.ts", import.meta.url), "utf8");
const config = await readFile(new URL("../supabase/config.toml", import.meta.url), "utf8");

test("privileged API verifies caller session with Supabase Auth", () => {
  assert.match(api, /auth\.getUser\(\)/);
  assert.match(api, /Bearer /);
});

test("privileged admin actions require an active tenant admin membership", () => {
  assert.match(api, /tenant_memberships/);
  assert.match(api, /brand_admin/);
  assert.match(api, /super_admin/);
});

test("API uses an explicit origin allowlist, not wildcard CORS", () => {
  assert.match(api, /ALLOWED_ORIGINS/);
  assert.doesNotMatch(api, /Access-Control-Allow-Origin.*\*/);
});

test("service role is read only from server environment", () => {
  assert.match(api, /SUPABASE_SERVICE_ROLE_KEY/);
  assert.doesNotMatch(api, /service_role_key\s*[:=]\s*["'][^"']{20,}["']/i);
});

test("the dispatcher is configured to verify JWTs at the gateway", () => {
  assert.match(config, /\[functions\.rewardloop-api\][\s\S]*?verify_jwt = true/);
});
