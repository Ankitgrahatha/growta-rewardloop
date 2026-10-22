import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const [api, config, browser, settings] = await Promise.all([
  readFile(new URL("supabase/functions/rewardloop-api/index.ts", root), "utf8"),
  readFile(new URL("supabase/config.toml", root), "utf8"),
  readFile(new URL("app.js", root), "utf8"),
  readFile(new URL("supabase/functions/rewardloop-admin-settings/index.ts", root), "utf8"),
]);

test("the primary dispatcher requires platform JWT verification", () => {
  assert.match(config, /\[functions\.rewardloop-api\][\s\S]*?verify_jwt\s*=\s*true/);
});

test("the dispatcher validates the bearer session before creating the privileged client", () => {
  const verify = api.indexOf("await userClient.auth.getUser()");
  const privilegedClient = api.indexOf("createClient(SUPABASE_URL, SERVICE_ROLE_KEY");
  assert.notEqual(verify, -1, "must validate the bearer token with Supabase Auth");
  assert.notEqual(privilegedClient, -1, "must create a server-side privileged client");
  assert.ok(verify < privilegedClient, "session verification must occur before privileged client use");
  assert.match(api, /if \(userError \|\| !user\) return reply\(401/);
});

test("every privileged action is behind active tenant-admin membership authorization", () => {
  const gateStart = api.indexOf('if (["admin_dashboard", "verify_partner"');
  const membershipQuery = api.indexOf('.from("tenant_memberships")', gateStart);
  const membershipCheck = api.indexOf('if (!membership) return reply(403', membershipQuery);
  const firstPrivilegedBranch = api.indexOf('if (action === "admin_dashboard")', gateStart);
  assert.ok(gateStart >= 0 && membershipQuery > gateStart);
  assert.ok(membershipCheck > membershipQuery);
  assert.ok(firstPrivilegedBranch > membershipCheck, "admin actions must not execute before membership check");
  assert.match(api.slice(membershipQuery, membershipCheck), /\.eq\("tenant_id", tenant\.id\)/);
  assert.match(api.slice(membershipQuery, membershipCheck), /\.eq\("user_id", user\.id\)/);
  assert.match(api.slice(membershipQuery, membershipCheck), /\.eq\("status", "active"\)/);
  assert.match(api.slice(membershipQuery, membershipCheck), /\.in\("role", \["brand_admin", "super_admin"\]\)/);
});

test("claim and redemption actor IDs come from the authenticated session, not request data", () => {
  assert.match(api, /p_actor_user_id:\s*user\.id[\s\S]{0,180}p_token:\s*token/);
  assert.match(api, /p_actor_user_id:\s*user\.id[\s\S]{0,180}p_reward_id:\s*rewardId/);
  assert.doesNotMatch(api, /p_actor_user_id:\s*body\./);
});

test("unknown dispatcher actions are rejected instead of falling through to success", () => {
  assert.match(api, /return reply\(400, \{ ok: false, error: "unknown_action" \}\)/);
});

test("the browser bundle does not contain the Supabase service-role key variable or secret", () => {
  assert.doesNotMatch(browser, /SUPABASE_SERVICE_ROLE_KEY|service_role/i);
});

test("legacy endpoints remain explicitly marked as not client entry points", () => {
  assert.match(config, /Legacy functions below are deployed with verify_jwt=false and must not be/);
  assert.match(config, /\[functions\.claim-qr\][\s\S]*?verify_jwt\s*=\s*false/);
});


test("saved farmer locale is applied in both directions on sign-in", () => {
  assert.match(browser, /state\.language = data\.preferred_locale === "en-IN" \? "en" : "hi";/);
});


test("admin settings endpoint verifies session and admin membership before settings access", () => {
  const userVerification = settings.indexOf("await userClient.auth.getUser()");
  const adminClient = settings.indexOf("createClient(URL,SERVICE");
  const membershipCheck = settings.indexOf('if(!member) return reply(403');
  const settingsRead = settings.indexOf('if(action==="admin_settings_get")');
  assert.ok(userVerification >= 0 && adminClient > userVerification);
  assert.ok(membershipCheck > adminClient && settingsRead > membershipCheck);
  assert.match(settings, /\.eq\("user_id",user\.id\)/);
  assert.match(settings, /\.eq\("status","active"\)/);
  assert.match(settings, /\.in\("role",\["brand_admin","super_admin"\]\)/);
});

test("admin settings CORS uses an exact origin allowlist", () => {
  assert.match(settings, /ALLOWED_ORIGINS\.has\(origin\)/);
  assert.doesNotMatch(settings, /Access-Control-Allow-Origin["']?\s*:\s*["']\*["']/);
});

test("admin settings never stores SMTP passwords in application tables", () => {
  assert.match(settings, /Never persist SMTP passwords in application tables/);
  assert.match(settings, /smtp_management_integration_not_configured/);
  assert.doesNotMatch(settings, /allowed\.smtp_password\s*=/);
});
