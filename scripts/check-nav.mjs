#!/usr/bin/env node
/**
 * Verifies every nav item marked `status: "ready"` resolves to a real page.
 *
 * The sidebar config and the App Router filesystem are two independent sources
 * of truth. Nothing reconciled them, so a renamed or never-built route stayed
 * silently broken until a user clicked it and got thrown out of the app by a
 * 404. This turns that into a failed check.
 *
 * Run: npm run check:nav   (also runs as part of `npm run build`)
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const NAV_CONFIG = join(ROOT, "app/config/navigation.tsx");
const DASHBOARD_DIR = join(ROOT, "app/dashboard");

/** Every route under app/dashboard that has a page.tsx, as a URL path. */
function collectRoutes(dir, segments = []) {
  const routes = [];

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      // Route groups "(name)" don't appear in the URL; private "_name" folders
      // aren't routes at all.
      if (entry.name.startsWith("_")) continue;
      const isGroup = entry.name.startsWith("(") && entry.name.endsWith(")");
      routes.push(
        ...collectRoutes(
          join(dir, entry.name),
          isGroup ? segments : [...segments, entry.name]
        )
      );
    } else if (entry.name === "page.tsx" || entry.name === "page.ts") {
      routes.push("/dashboard" + segments.map((s) => `/${s}`).join(""));
    }
  }

  return routes;
}

/**
 * Pull { href, status } out of the nav config.
 *
 * Split on `id:` so each chunk holds exactly one item — the JSX icons contain
 * braces (`size={18}`), which defeats naive object-literal matching.
 */
function parseNavItems(source) {
  return source
    .split(/\bid:\s*"/)
    .slice(1)
    .map((chunk) => {
      const id = chunk.slice(0, chunk.indexOf('"'));
      const href = chunk.match(/href:\s*"([^"]+)"/)?.[1];
      const status = chunk.match(/status:\s*"([^"]+)"/)?.[1];
      return href ? { id, href, status } : null;
    })
    .filter(Boolean);
}

// ─── Run ─────────────────────────────────────────────────────────────────────
if (!existsSync(NAV_CONFIG)) {
  console.error(`check-nav: cannot find ${relative(ROOT, NAV_CONFIG)}`);
  process.exit(1);
}

const routes = new Set(collectRoutes(DASHBOARD_DIR));
const items = parseNavItems(readFileSync(NAV_CONFIG, "utf8"));

if (items.length === 0) {
  console.error("check-nav: parsed 0 nav items — the config format changed.");
  process.exit(1);
}

const problems = [];

for (const item of items) {
  if (!item.status) {
    problems.push(`${item.id}: missing a status ("ready" or "soon")`);
    continue;
  }

  if (!item.href.startsWith("/dashboard/")) {
    problems.push(
      `${item.id}: href "${item.href}" is outside /dashboard, so it would render without the dashboard shell`
    );
    continue;
  }

  const exists = routes.has(item.href);

  if (item.status === "ready" && !exists) {
    problems.push(
      `${item.id}: marked "ready" but there is no page at "${item.href}" — it would 404`
    );
  }

  if (item.status === "soon" && exists) {
    problems.push(
      `${item.id}: marked "soon" but "${item.href}" now exists — flip it to "ready"`
    );
  }
}

const soon = items.filter((i) => i.status === "soon").length;

if (problems.length) {
  console.error(`\ncheck-nav: ${problems.length} problem(s)\n`);
  problems.forEach((p) => console.error(`  ✗ ${p}`));
  console.error("");
  process.exit(1);
}

console.log(
  `check-nav: ${items.length} nav items OK ` +
    `(${items.length - soon} live, ${soon} marked coming soon)`
);
