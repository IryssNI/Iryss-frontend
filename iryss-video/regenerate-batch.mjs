// Regenerate a specific batch of clips with fixed pronunciation + pricing
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, ".env");
const apiKey = fs.readFileSync(envPath, "utf-8").match(/ELEVENLABS_API_KEY=(.+)/)?.[1]?.trim();
const VOICE_ID = "SB13jgWjPxi4e4JoTT1H";
const publicDir = path.join(__dirname, "public");

// Notes:
//  · "Iryss" → "Iris" in input text so the TTS pronounces it correctly.
//    On-screen text stays "Iryss" — we're only tricking the speech engine.
//  · hook-b regenerated with different voice settings so "one" sounds natural.
//  · maths-d reflects Essentials-tier pricing (£99/mo) which looks far more attractive
//    than £2,400/year and is genuinely achievable for any practice.
const updates = [
  // Fix "one" sounding bizarre — try more stable, less expressive settings
  { n: "hook-b",      text: "You now have one.",
    settings: { stability: 0.75, similarity_boost: 0.8, style: 0, use_speaker_boost: true } },

  // "Iryss" → "Iris" for correct pronunciation
  { n: "solution-a",  text: "Meet Iris. The growth engine for independent opticians." },
  { n: "whofor-a",    text: "Iris is built for independent UK and Irish opticians." },
  { n: "close-a",     text: "Iris." },
  { n: "close-b",     text: "Book a demo at the Iris dot com." },

  // Updated pricing — more attractive entry-level anchor
  { n: "maths-d",     text: "Iris starts from just ninety-nine pounds a month. An eight-times return. Payback in six weeks." },
];

async function generate(text, settings) {
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: "POST",
    headers: { "xi-api-key": apiKey, "Content-Type": "application/json", Accept: "audio/mpeg" },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: settings || { stability: 0.5, similarity_boost: 0.75, style: 0.15, use_speaker_boost: true },
    }),
  });
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
  return Buffer.from(await r.arrayBuffer());
}

for (const u of updates) {
  process.stdout.write(`${u.n.padEnd(14)} · ${u.text.slice(0, 56)}… `);
  const buf = await generate(u.text, u.settings);
  const out = path.join(publicDir, `${u.n}.mp3`);
  fs.writeFileSync(out, buf);
  const dur = execSync(`afinfo "${out}" 2>&1 | grep "estimated duration"`).toString().match(/([\d.]+) sec/)[1];
  console.log(`✓ ${dur}s`);
}
console.log("\n✅ Batch regenerated.");
