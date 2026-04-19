/**
 * IRYSS — Voiceover generator via ElevenLabs
 *
 * Usage:
 *   node generate-voice.mjs            (uses default voice "Charlotte")
 *   node generate-voice.mjs lily       (uses preset "lily")
 *   node generate-voice.mjs <voice_id> (uses a custom voice ID)
 *
 * Reads ELEVENLABS_API_KEY from .env
 * Writes public/voice.mp3 for Remotion to embed.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Load .env ─────────────────────────────────────────────
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const match = line.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/);
    if (match) process.env[match[1]] = match[2];
  });
}
const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
  console.error("❌ ELEVENLABS_API_KEY not set. Create iryss-video/.env with:\n   ELEVENLABS_API_KEY=sk_xxxxx");
  process.exit(1);
}

// ── Voice presets (British + professional) ──────────────
const VOICES = {
  charlotte: { id: "XB0fDUnXU5powFXDhCwa", name: "Charlotte — calm British female" },
  george:    { id: "JBFqnCBsd6RMkjVDRZzb", name: "George — warm British male" },
  lily:      { id: "pFZP5JQG7iQjIQuC4Bku", name: "Lily — young British female" },
  alice:     { id: "Xb7hH8MSUJpSbSDYk0k2", name: "Alice — clear British female" },
};

const arg = process.argv[2] || "charlotte";
const preset = VOICES[arg.toLowerCase()];
const voiceId = preset?.id || arg;
const voiceLabel = preset?.name || `custom voice (${arg})`;

// ── The script ────────────────────────────────────────────
// 90-second pitch, ~1,430 chars. Pauses conveyed with sentence breaks + ellipses.
const script = `Specsavers has five hundred marketers. ... You now have one.

Independent practices lose up to twenty-five percent of patients they should retain. ... Paper recalls die. SMS gets ignored. ... And your CRM stores data — it doesn't act on it.

Meet Iryss. ... The AI growth layer that sits alongside your existing CRM — and turns your patient list into a live retention engine. ... One number, every morning, tells you exactly how your practice is doing.

WhatsApp-native patient inbox — ninety-eight percent open rates, with sentiment detection built in.

A live breakdown of revenue walking out the door — with one click to launch a personalised WhatsApp campaign.

A full myopia clinic — axial length tracking, treatment plans, parent WhatsApp, AI recommendations.

And AI Scribe. Dictate the exam. Iryss writes the record, the referral letter, and the GOS claim. ... Eleven minutes saved per patient.

The maths is simple. Save just two patients a month — that's twenty thousand pounds recovered in your first year. ... Iryss costs two thousand four hundred. That's an eight-times return. ... Payback in under six weeks.

Iryss is built for independent UK and Irish opticians. ... It sits alongside Optix, Ocuco, Optisoft, Acuitas, or whatever you use. ... No migration. No retraining. Live in under a week.

Iryss. ... Book a demo at theiryss dot com.`;

// ── Call ElevenLabs ──────────────────────────────────────
console.log(`🎙  Generating voiceover with ${voiceLabel}`);
console.log(`📝  Script length: ${script.length} characters`);
console.log("⏳  Calling ElevenLabs API…");

const response = await fetch(
  `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
  {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      "Accept": "audio/mpeg",
    },
    body: JSON.stringify({
      text: script,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.55,
        similarity_boost: 0.75,
        style: 0.2,
        use_speaker_boost: true,
      },
    }),
  },
);

if (!response.ok) {
  const errText = await response.text();
  console.error(`❌ ElevenLabs API error (${response.status}): ${errText}`);
  process.exit(1);
}

const audioBuffer = Buffer.from(await response.arrayBuffer());
const outDir = path.join(__dirname, "public");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "voice.mp3");
fs.writeFileSync(outPath, audioBuffer);

console.log(`✅ Written ${(audioBuffer.length / 1024).toFixed(0)} KB to ${outPath}`);
console.log(`\nNext: re-render the video with`);
console.log(`  npx remotion render IryssPitch out/iryss-pitch.mp4`);
