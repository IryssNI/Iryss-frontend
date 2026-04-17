# IRYSS · Pitch Video

A 90-second Remotion-built pitch video telling the Iryss story end-to-end.

- **Runtime**: 90 seconds
- **Format**: 1920 × 1080 @ 30fps (2700 frames total)
- **Composition ID**: `IryssPitch`

## Scene breakdown

| # | Timing | Scene | Purpose |
|---|--------|-------|---------|
| 1 | 0:00 – 0:08  | **Hook** | *"Specsavers has 500 marketers. You now have one."* |
| 2 | 0:08 – 0:20  | **Problem** | The 25% retention loss + three pain-point chips |
| 3 | 0:20 – 0:35  | **Solution** | Introduces Iryss with the Practice Score ring animating to 87 |
| 4 | 0:35 – 0:55  | **Features** | 4 feature cards: WhatsApp inbox · Revenue leakage · Myopia Clinic · AI Scribe |
| 5 | 0:55 – 1:10  | **The maths** | £20,000 count-up + 8× ROI + < 6 weeks payback |
| 6 | 1:10 – 1:25  | **Who it's for** | UK/Irish independents + CRM compatibility chips |
| 7 | 1:25 – 1:30  | **Close** | Logo + *"Book a demo at theiryss.com"* |

Voiceover script lives in **[VOICEOVER.md](./VOICEOVER.md)**.

## Preview locally

```bash
cd ~/iryss-frontend/iryss-video
npm install         # first time only
npm run dev          # opens Remotion Studio at http://localhost:3000
```

Use the studio timeline to scrub and iterate on scenes without re-rendering.

## Render to MP4

```bash
npx remotion render IryssPitch out/iryss-pitch.mp4
```

With custom concurrency for speed on a laptop:

```bash
npx remotion render IryssPitch out/iryss-pitch.mp4 --concurrency 4
```

Output lands at `out/iryss-pitch.mp4`. Typical render time on Apple Silicon: 2–3 minutes.

## Swapping in a real voiceover

Record the voiceover to WAV (48kHz) following [VOICEOVER.md](./VOICEOVER.md), then:

1. Drop `voice.wav` into `public/`
2. In `src/Composition.tsx`, import Audio and add `<Audio src={staticFile("voice.wav")} />` inside the top-level `AbsoluteFill`
3. Re-render

## Exporting for different channels

| Channel | Command add-ons |
|---------|----------------|
| YouTube (1080p) | (default) |
| Twitter / LinkedIn | `--codec h264 --crf 23` for smaller files |
| Square (1:1 for Insta) | Change `width` and `height` in `src/Root.tsx` to 1080×1080 and adjust layouts |
| Vertical (9:16 Reels) | 1080×1920 — most layouts will need tweaking |

## Files in this project

- `src/Root.tsx` — registers the composition (duration, dimensions)
- `src/Composition.tsx` — all 7 scenes in one file
- `src/index.ts` — Remotion entry point
- `VOICEOVER.md` — word-for-word voiceover script with pacing notes

---

Built on Remotion · [remotion.dev](https://www.remotion.dev/)
