// Capture Iryss dashboard screenshots for Claude Design / marketing use.
//
// Setup (one-time):
//   cd ~/iryss-frontend
//   npm install --save-dev playwright
//   npx playwright install chromium
//
// Usage:
//   Terminal 1:  npm run dev          (leave this running on localhost:5173)
//   Terminal 2:  node capture-dashboard-screenshots.mjs
//
// Output:  ~/iryss-frontend/screenshots/*.png   at 1920x1200, full page
//
// The React app uses state-based nav (setNav), so this clicks sidebar items
// rather than navigating URLs. If a view doesn't capture, the sidebar label
// probably differs — adjust SIDEBAR_LABELS below.

import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, 'screenshots');
const BASE_URL = process.env.IRYSS_URL || 'http://localhost:5173';

// Sidebar nav labels as they appear in your UI (visible text).
// If any of these don't match what's in the sidebar, edit this array.
const SIDEBAR_LABELS = [
  'Dashboard',
  "Today's Tasks",
  'Patients',
  'Inbox',
  'Recalls',
  // Modules — add any that appear in your sidebar
  'GOS Claims',
  'Referrals',
  'Myopia Clinic',
  'Reviews',
  'Intelligence',
  'AI Scribe',
];

const VIEWPORT = { width: 1920, height: 1200 };
const WAIT_AFTER_CLICK_MS = 900;

fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log(`> Launching Chromium against ${BASE_URL}`);
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2 });
  const page = await context.newPage();

  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
  // If a login screen appears, attempt to skip: click any Continue/Enter button.
  const maybeLoginButton = await page.$('button:has-text("Continue"), button:has-text("Enter"), button:has-text("Log in"), button:has-text("Sign in")');
  if (maybeLoginButton) {
    console.log('> Detected login screen, clicking continue');
    await maybeLoginButton.click().catch(() => {});
    await page.waitForTimeout(1000);
  }

  // Screenshot each sidebar view
  for (const label of SIDEBAR_LABELS) {
    // Find the sidebar item by visible text. Try a few selector strategies.
    const selectors = [
      `nav :text("${label}")`,
      `aside :text("${label}")`,
      `:text-is("${label}")`,
      `button:has-text("${label}")`,
      `a:has-text("${label}")`,
    ];
    let clicked = false;
    for (const sel of selectors) {
      const loc = page.locator(sel).first();
      if (await loc.count().catch(() => 0)) {
        try {
          await loc.click({ timeout: 2500 });
          clicked = true;
          break;
        } catch { /* try next */ }
      }
    }
    if (!clicked) {
      console.warn(`! Could not find sidebar item "${label}" — skipping`);
      continue;
    }
    await page.waitForTimeout(WAIT_AFTER_CLICK_MS);

    const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const file = path.join(OUT_DIR, `${slug}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(`  ✓ ${file}`);
  }

  // Bonus captures — overlays you'd want Claude Design to see
  // 1) Command palette (⌘K)
  try {
    await page.keyboard.press('Meta+K');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUT_DIR, 'command-palette.png'), fullPage: true });
    console.log('  ✓ command-palette.png');
    await page.keyboard.press('Escape');
  } catch {}

  // 2) Notifications bell dropdown
  try {
    const bell = page.locator('[aria-label="Notifications"], button:has([data-icon="bell"]), button:has-text("🔔")').first();
    if (await bell.count()) {
      await bell.click({ timeout: 2000 });
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(OUT_DIR, 'notifications.png'), fullPage: true });
      console.log('  ✓ notifications.png');
    }
  } catch {}

  await browser.close();
  console.log(`\nDone. Screenshots in: ${OUT_DIR}`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
