# Addendum to the Claude Design prompt — dashboard screenshots

**How to use this file:** open your existing Claude Design conversation (the one with the Iryss Instagram brief in it). Drop all 11 dashboard PNGs into a new message, then paste the prompt below underneath them. Claude Design will use this to identify which screenshot is which dashboard view, crop and frame each one to the brand, and slot them into the right Instagram posts from the 20-post plan.

---

## THE PROMPT — copy everything between the lines

---

I'm attaching 11 screenshots of the live Iryss dashboard. They are at native resolution (~2600×1370) and show the full browser viewport for each view. Use them as the source of truth for any product mockup that appears in the 20-post Instagram grid we already agreed.

## Step 1 — identify each screenshot

Match each PNG to one of the 11 dashboard views below using the visual cues. (My filenames are whatever macOS named them — ignore the filenames, work from what's actually on screen.)

1. **Dashboard / home** — large circular **Practice Score** ring (a number out of 100) is the dominant element. Tiles for "patients due", "this week's revenue", a small activity feed. Sidebar on left shows "Dashboard" highlighted.
2. **Today's Tasks** — a vertical list of task cards with patient names, due timestamps, and small action chips ("Call", "Send WhatsApp", "Mark done"). Sidebar shows "Today's Tasks" highlighted.
3. **Patients** — a wide patient table: columns for name, last seen, next recall due, status pill, channel. Filter chips along the top, search field top-right.
4. **Inbox** — a **WhatsApp-style** two-pane messaging UI. Left = list of patient threads with last-message previews and timestamps. Right = open conversation with green/grey message bubbles, a composer at the bottom, suggested-reply chips above the composer.
5. **Recalls** — a campaign / pipeline view. Cards or a table showing recall campaigns with status (draft, sending, sent), recipient counts, and response rates. Often has a "New campaign" button top-right.
6. **GOS Claims** — a claims pre-flight list. Each row is a claim with a status pill (e.g. green "ready", amber "needs review", red "blocked") and reason text. May show an aggregate "ready to submit" total.
7. **Referrals** — referral letters / outbound to HES. List of patient referrals with destination, urgency tag (routine/urgent), and status (drafted, sent, acknowledged).
8. **Myopia Clinic** — clinical charts. **Axial length** vs age plotted as a line, percentile bands shaded behind, treatment markers along the timeline. Looks the most "medical" of the views.
9. **Reviews** — Google Reviews module. Star rating headline, recent review cards, an "ask for review" trigger / counts.
10. **Intelligence** — analytics / insights. Bigger charts (line, bar, donut), KPI tiles across the top, period selector. The most "BI-looking" view.
11. **AI Scribe (beta)** — a dictation / clinical-note view. Big text area with a generated SOAP-style note, a "Recording…" or microphone state indicator, and a "Beta" tag visible.

If two screenshots seem to compete for the same slot, prefer the one with more identifying signal (e.g. the screenshot with an axial-length chart is Myopia, full stop). If a screenshot doesn't match any of the 11 above, surface it back to me before using it.

## Step 2 — map each screenshot to the Instagram posts that need it

Use the table below. Some posts use a tight crop of just one component, not the whole view. Where it says "tight crop on X", crop to roughly that region with ~40px breathing room around it — don't show the full browser chrome or sidebar.

| # | Dashboard view | Used in Instagram post(s) | What to crop / show |
|---|---|---|---|
| 1 | Dashboard / home | **Post 3** (Practice Score feature) | Tight crop on the Practice Score ring + the score number. Hide sidebar, hide other tiles. |
| 2 | Today's Tasks | **Post 7** (behind-the-scenes / build log) — optional secondary use; **Stories template** "Behind the scenes" | A vertical strip of 3–4 task cards, no sidebar. |
| 3 | Patients | **Post 4** (~1 in 3 contact lens drift stat) — as a faint background mockup behind the headline; **Post 18** (install simplicity) — show that a real patient list materialises after the 20-min CRM plug | Wide crop showing rows + filter chips. Soften / dim if used as background. |
| 4 | Inbox | **Post 5** (WhatsApp-native recall inbox) — primary; **Post 11** (recall-letter-in-Word humour) — show the WhatsApp inbox as the alternative on the right side of a before/after | Tight crop on the open conversation pane (right side). Keep 2–3 message bubbles + composer + suggested-reply chips visible. |
| 5 | Recalls | **Post 15** (founding-customer offer) — as a backdrop suggesting a live system; **Stories template** "Demo booked this week" | Crop to a single campaign card showing status + response rate. |
| 6 | GOS Claims | **Post 14** (GOS Claims pre-flight engine) | Tight crop on 3–4 claim rows with the status pills clearly visible. The pills are the hero. |
| 7 | Referrals | **Post 19** (product vision / roadmap) — show as part of the "v1 shipped" stack | Crop to 3–4 referral rows with urgency tags. |
| 8 | Myopia Clinic | **Post 8** (Myopia Clinic feature) | Tight crop on the axial-length chart. Keep axes labels. The chart is the hero — drop the sidebar entirely. |
| 9 | Reviews | **Post 6** (pro-independent manifesto) — as a small "social proof" card in the bottom corner; **Stories template** "Patient testimonial" | Crop to the star-rating headline + one review card. |
| 10 | Intelligence | **Post 16** (industry commentary) — as the backdrop for a "what indies are telling us" stat tile; **Post 9** (the £99/month maths) — borrow one chart as a visual anchor | Crop to one KPI tile + one chart. Don't show the whole BI dashboard — too busy. |
| 11 | AI Scribe | **Post 12** (AI Scribe beta) | Tight crop on the generated note text + the "Beta" tag. Keep the recording-state indicator visible if it's there. |

Posts that **do not use** a dashboard screenshot at all (use designed type/illustration only):
- Post 1 (hero / logo reveal)
- Post 2 (founder introduction)
- Post 10 (pronunciation)
- Post 13 (customer quote template)
- Post 17 (pro-independent tribute, leave space for video)
- Post 20 (hero close)

## Step 3 — framing rules for every product mockup

This is the most important section. The screenshots are full browser captures and will look amateur if dropped in raw. Treat each one as a **product still life**, not a screenshot.

For every post that uses a dashboard image, render the screenshot as a **floating UI card** with the following spec:

- **Crop tight** to the feature being shown (per the table above). Never show the full app, never show the URL bar, never show the macOS chrome.
- **Card shape:** rounded corners at **24px** radius (range 20–28 acceptable depending on crop scale).
- **Card shadow:** soft drop shadow, 60% black, offset 0 / 20px down, blur 60px. No hard edges.
- **Cyan rim-light:** 1px inner highlight on the **top edge only** of the card, in `#19B1D8` at ~30% opacity. This is the signature touch — it ties the mockup back to the brand accent dot. Do not put cyan around all four edges.
- **No device frame.** Do not put the screenshot inside a laptop, phone, browser, or iPad mock. The card floats freely on the slate background.
- **Background treatment:** the card sits on the same dark slate (`#1E2632`) used across the rest of the grid, with the same single off-centre soft cyan light bleed and the same fine film grain. The card does NOT get its own background gradient — it inherits the post's atmosphere.
- **Spec strip beneath the card** (optional, use on feature posts 3, 5, 8, 12, 14): one line of letter-spaced caps in muted grey-blue (`#7A8FB0`), 11–12pt, e.g. `PRACTICE SCORE  ·  LIVE`. Keep it quiet — it's a label, not a headline.
- **Headline placement:** serif headline sits **above** the card, never overlapping it. Body copy or small caption sits below the spec strip.
- **Scale:** the card occupies ~60–70% of the post width, centred horizontally, sitting in the lower two-thirds of the composition. Negative space at the top.

If a screenshot is too busy to crop down cleanly, **redraw the relevant component** in the brand system rather than show a messy crop. Use the colours, type, and rhythm from the real screenshot so it still feels true to the product, but rebuild it at 1080×1080 rendering scale so type doesn't pixelate.

## Step 4 — tone reminder

The product mockups should feel like Apple keynote slides revealing one feature at a time. Restraint over completeness. One thing per post. If the post can't be understood at thumbnail size on a phone, the crop is wrong.

Carry on producing the 20-post grid using these screenshots wherever the table above indicates. Show me the first feature post that uses a dashboard mockup (Post 3 — Practice Score) before producing the rest, so I can confirm the framing reads correctly.

---

## END OF PROMPT
