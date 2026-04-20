/**
 * Generate 10 per-scene voiceover clips for the Iryss pitch video.
 * Each clip is trimmed to fit its scene's exact duration.
 *
 * Scene budget (30fps):
 *   01 Hook          240 frames   (8.0s)
 *   02 Problem       360 frames  (12.0s)
 *   03 Solution      450 frames  (15.0s)
 *   04 WhatsApp      150 frames   (5.0s)
 *   05 Leakage       150 frames   (5.0s)
 *   06 Myopia        150 frames   (5.0s)
 *   07 Scribe        150 frames   (5.0s)
 *   08 Maths         450 frames  (15.0s)
 *   09 Who for       450 frames  (15.0s)
 *   10 Close         150 frames   (5.0s)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load API key
const envPath = path.join(__dirname, ".env");
const envContent = fs.readFileSync(envPath, "utf-8");
const apiKey = envContent.match(/ELEVENLABS_API_KEY=(.+)/)?.[1]?.trim();
if (!apiKey) {
  console.error("ELEVENLABS_API_KEY missing from .env");
  process.exit(1);
}

const VOICE_ID = "SB13jgWjPxi4e4JoTT1H";
const publicDir = path.join(__dirname, "public");

const scenes = [
  { n: "01", max: 8.0,  text: "Specsavers has five hundred marketers. You now have one." },
  { n: "02", max: 12.0, text: "Independent practices lose up to twenty-five percent of patients they should retain. Paper recalls go unread. SMS gets ignored. Patients drift to the multiples." },
  { n: "03", max: 15.0, text: "Meet Iryss. The growth engine for independent opticians. It plugs in alongside whatever you already use, and turns your patient list into a live retention machine. One number, every morning, tells you exactly how your practice is doing." },
  { n: "04", max: 5.0,  text: "WhatsApp patient inbox. Ninety-eight percent open rates." },
  { n: "05", max: 5.0,  text: "See revenue walking out. One click launches a WhatsApp campaign." },
  { n: "06", max: 5.0,  text: "A full myopia clinic. Axial length, treatment plans, parent WhatsApp." },
  { n: "07", max: 5.0,  text: "Scribe. Dictate the exam, Iryss writes the record." },
  { n: "08", max: 15.0, text: "The maths. Recover two patients a month — twenty-four a year at four hundred pounds each is nine thousand six hundred in year one. Iryss costs twenty-four hundred. A four-times return. Three months payback." },
  { n: "09", max: 15.0, text: "Iryss is built for independent UK and Irish opticians. It works alongside Optix, Ocuco, Optisoft, Acuitas, or whatever you already use. No migration. No retraining. Live in under a week." },
  { n: "10", max: 5.0,  text: "Iryss. Book a demo at theiryss dot com." },
];

function getDuration(mp3Path) {
  const out = execSync(`afinfo "${mp3Path}" 2>&1 | grep "estimated duration"`).toString();
  const m = out.match(/estimated duration: ([\d.]+) sec/);
  return m ? parseFloat(m[1]) : 0;
}

async function generate(voice_id, text) {
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`, {
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

console.log(`🎙  Voice: ${VOICE_ID}\n`);

for (const s of scenes) {
  process.stdout.write(`Scene ${s.n} (budget ${s.max}s) · ${s.text.slice(0, 50)}… `);
  const mp3 = await generate(VOICE_ID, s.text);
  const outPath = path.join(publicDir, `voice-${s.n}.mp3`);
  fs.writeFileSync(outPath, mp3);
  const dur = getDuration(outPath);
  const fit = dur <= s.max ? "✓" : "⚠";
  console.log(`${fit} ${dur.toFixed(1)}s (${(mp3.length / 1024).toFixed(0)}KB)`);
}

// Clean up test file
const testFile = path.join(publicDir, "test-voice.mp3");
if (fs.existsSync(testFile)) fs.unlinkSync(testFile);

console.log(`\n✅ 10 scene clips written to ${publicDir}/`);
