// Regenerate a single clip — usage: node regenerate-single.mjs <name> "text"
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, ".env");
const apiKey = fs.readFileSync(envPath, "utf-8").match(/ELEVENLABS_API_KEY=(.+)/)?.[1]?.trim();
const VOICE_ID = "SB13jgWjPxi4e4JoTT1H";

const name = process.argv[2];
const text = process.argv[3];
if (!name || !text) { console.error("Usage: node regenerate-single.mjs <name> \"text\""); process.exit(1); }

const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
  method: "POST",
  headers: { "xi-api-key": apiKey, "Content-Type": "application/json", Accept: "audio/mpeg" },
  body: JSON.stringify({
    text,
    model_id: "eleven_multilingual_v2",
    voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.15, use_speaker_boost: true },
  }),
});
if (!r.ok) { console.error(r.status, await r.text()); process.exit(1); }
const buf = Buffer.from(await r.arrayBuffer());
const out = path.join(__dirname, "public", `${name}.mp3`);
fs.writeFileSync(out, buf);
const dur = execSync(`afinfo "${out}" 2>&1 | grep "estimated duration"`).toString().match(/([\d.]+) sec/)[1];
console.log(`✅ ${name}.mp3 · ${dur}s · ${(buf.length/1024).toFixed(0)}KB`);
