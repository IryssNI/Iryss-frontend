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
//  · hook-a: drop "Specsavers" (defamation/passing-off risk on a public asset)
//    in favour of "the chains" — matches website + social copy.
//  · problem-b: same swap — "the multiples" → "the chains" for consistency.
//  · Previously regenerated and current: hook-b, solution-a, whofor-a, close-a,
//    close-b, maths-d. Re-running this script will leave them unchanged because
//    they are not in this updates array.
const updates = [
  // Add the Founding Rate hook to the maths pitch — matches website's strongest
  // sales lever (£99/mo locked for life for first 50 practices). Use "Iris" for
  // ElevenLabs pronunciation; visuals still show "IRYSS".
  { n: "maths-d",     text: "Iris founding rate, ninety-nine pounds a month, locked for life. An eight-times return. Six-week payback." },
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
