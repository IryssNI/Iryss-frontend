/**
 * Phrase-level voiceover clips for the Iryss pitch video.
 *
 * Each clip is scoped to a single phrase and played in Remotion at the exact
 * frame its matching visual appears. This keeps voice tightly synced to what's
 * on screen — the voice only says a thing when the viewer can see that thing.
 *
 * Visual frame targets (30fps) and budgets are documented inline.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, ".env");
const envContent = fs.readFileSync(envPath, "utf-8");
const apiKey = envContent.match(/ELEVENLABS_API_KEY=(.+)/)?.[1]?.trim();
if (!apiKey) { console.error("ELEVENLABS_API_KEY missing"); process.exit(1); }

const VOICE_ID = "SB13jgWjPxi4e4JoTT1H";
const publicDir = path.join(__dirname, "public");

// Each clip: name, budget (seconds), text
const clips = [
  // SCENE 1 — Hook (0-240). Visual: logo @0-40, line1 reveals f50-102, line2 f130-161
  { n: "hook-a",      max: 3.5, text: "Specsavers has five hundred marketers." },
  { n: "hook-b",      max: 2.5, text: "You now have one." },

  // SCENE 2 — Problem (240-600). Visual: 25% counts f255-320, caption at f320, table rows LOST f390-498, pain chips cascade f500-545
  { n: "problem-a",   max: 7.0, text: "Independent practices lose up to twenty-five percent of patients they should retain." },
  { n: "problem-b",   max: 5.0, text: "Paper recalls go unread. SMS gets ignored. Patients drift to the multiples." },

  // SCENE 3 — Solution (600-1050). Visual: tag f600, headline f615-638, dashboard slides up f645, score counts f660-780, bottom tagline f830
  { n: "solution-a",  max: 4.0, text: "Meet Iryss. The growth engine for independent opticians." },
  { n: "solution-b",  max: 7.5, text: "It plugs in alongside whatever you already use, and turns your patient list into a live retention machine." },
  { n: "solution-c",  max: 5.0, text: "One number, every morning, tells you exactly how your practice is doing." },

  // SCENE 4 Features — 4×150 frames (5s each)
  { n: "feat-whatsapp", max: 5.0, text: "WhatsApp patient inbox. Ninety-eight percent open rates." },
  { n: "feat-leakage",  max: 5.0, text: "See revenue walking out. One click launches a WhatsApp campaign." },
  { n: "feat-myopia",   max: 5.0, text: "A full myopia clinic. Axial length, treatment plans, parent WhatsApp." },
  { n: "feat-scribe",   max: 5.0, text: "Scribe. Dictate the exam — Iryss writes the record." },

  // SCENE 5 — Maths (1650-2100). Visual: chip f1650, tagline f1660-1682, calc boxes 1690/1710/1732/1775, result f1820, stat cards f1930+
  { n: "maths-a", max: 1.5, text: "The maths." },
  { n: "maths-b", max: 6.5, text: "Recover two patients a month — twenty-four a year, at four hundred pounds each." },
  { n: "maths-c", max: 4.0, text: "That's nine thousand six hundred, recovered in year one." },
  { n: "maths-d", max: 5.0, text: "Iryss costs twenty-four hundred. A four-times return. Three months payback." },

  // SCENE 6 — Who For (2100-2550). Visual: Built-for f2100, headline f2110-2132, subtitle f2170-2192, CRM chips f2220-2260, checks f2320
  { n: "whofor-a", max: 4.5, text: "Iryss is built for independent UK and Irish opticians." },
  { n: "whofor-b", max: 6.0, text: "It works alongside Optix, Ocuco, Optisoft, Acuitas — or whatever you already use." },
  { n: "whofor-c", max: 5.0, text: "No migration. No retraining. Up and running in under a week." },

  // SCENE 7 — Close (2550-2700). Logo f2550, book-a-demo f2565, URL types f2595-2640
  { n: "close-a", max: 1.5, text: "Iryss." },
  { n: "close-b", max: 3.5, text: "Book a demo at theiryss dot com." },
];

function getDuration(mp3Path) {
  const out = execSync(`afinfo "${mp3Path}" 2>&1 | grep "estimated duration"`).toString();
  const m = out.match(/estimated duration: ([\d.]+) sec/);
  return m ? parseFloat(m[1]) : 0;
}

async function generate(text) {
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: "POST",
    headers: { "xi-api-key": apiKey, "Content-Type": "application/json", Accept: "audio/mpeg" },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.15, use_speaker_boost: true },
    }),
  });
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
  return Buffer.from(await r.arrayBuffer());
}

// Clean up old per-scene clips from the previous approach
for (const f of fs.readdirSync(publicDir)) {
  if (/^voice-\d+\.mp3$/.test(f)) fs.unlinkSync(path.join(publicDir, f));
}

console.log(`🎙  Voice: ${VOICE_ID}  ·  ${clips.length} phrase clips\n`);

for (const c of clips) {
  process.stdout.write(`${c.n.padEnd(16)} (≤${c.max}s) · ${c.text.slice(0, 48)}… `);
  const mp3 = await generate(c.text);
  const outPath = path.join(publicDir, `${c.n}.mp3`);
  fs.writeFileSync(outPath, mp3);
  const dur = getDuration(outPath);
  const fit = dur <= c.max ? "✓" : "⚠";
  console.log(`${fit} ${dur.toFixed(1)}s`);
}

console.log(`\n✅ ${clips.length} clips written to ${publicDir}/`);
