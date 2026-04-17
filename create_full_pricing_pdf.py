"""
IRYSS — Full Pricing & Sales Script PDF (2-page)
Page 1: Pricing tiers + add-ons (polished version of original)
Page 2: Plain-English breakdown + sales scripts for every line item
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, Color
from reportlab.pdfgen import canvas

# Brand
CYAN       = HexColor('#0891B2')
DARK       = HexColor('#0C1220')
CARD       = HexColor('#1A2235')
BORDER     = HexColor('#1E293B')
WHITE      = HexColor('#FFFFFF')
MUTED      = HexColor('#8896AB')
LIGHT      = HexColor('#CBD5E1')
GREEN      = HexColor('#10B981')
RED        = HexColor('#EF4444')
AMBER      = HexColor('#F59E0B')
DARK_ALT   = HexColor('#0E2A35')

W, H = A4

def rrect(c, x, y, w, h, r, fill=None, stroke=None, sw=0.5):
    p = c.beginPath()
    p.moveTo(x+r, y); p.lineTo(x+w-r, y)
    p.arcTo(x+w-r, y, x+w, y+r, 0, 90); p.lineTo(x+w, y+h-r)
    p.arcTo(x+w-r, y+h-r, x+w, y+h, 0, 90); p.lineTo(x+r, y+h)
    p.arcTo(x, y+h-r, x+r, y+h, 0, 90); p.lineTo(x, y+r)
    p.arcTo(x, y, x+r, y+r, 0, 90); p.close()
    c.saveState()
    if fill: c.setFillColor(fill)
    if stroke: c.setStrokeColor(stroke); c.setLineWidth(sw)
    c.drawPath(p, fill=1 if fill else 0, stroke=1 if stroke else 0)
    c.restoreState()

def header(c, subtitle=""):
    c.setFillColor(DARK); c.rect(0, 0, W, H, fill=1, stroke=0)
    # Orb
    c.saveState(); c.setFillColor(Color(8/255,145/255,178/255,0.08))
    c.circle(W-60, H-80, 120, fill=1, stroke=0); c.restoreState()
    y = H - 42
    c.setFont("Helvetica-Bold", 22); c.setFillColor(WHITE); c.drawString(30, y, "IRY")
    w1 = c.stringWidth("IRY","Helvetica-Bold",22)
    c.setFillColor(CYAN); c.drawString(30+w1, y, "SS")
    c.setFont("Helvetica", 8); c.setFillColor(MUTED); c.drawString(30, y-14, "PATIENT RETENTION FOR OPTICIANS")
    c.setFont("Helvetica-Bold", 10); c.setFillColor(CYAN); c.drawRightString(W-30, y, subtitle)
    c.setFont("Helvetica", 7.5); c.setFillColor(MUTED); c.drawRightString(W-30, y-13, "theiryss.com")
    y -= 28; c.setStrokeColor(BORDER); c.setLineWidth(0.5); c.line(30, y, W-30, y)
    return y

def footer(c):
    y = 26
    c.setStrokeColor(BORDER); c.setLineWidth(0.5); c.line(30, y+14, W-30, y+14)
    c.setFont("Helvetica", 6.5); c.setFillColor(MUTED)
    c.drawString(30, y, "IRYSS Ltd  •  theiryss.com  •  IryssNI@outlook.com")
    c.drawRightString(W-30, y, "All prices exclude VAT  •  April 2026")

# ═══════════════════════════════════════════════════════════════
# PAGE 1 — Pricing tiers + add-ons
# ═══════════════════════════════════════════════════════════════
def page1(c):
    y = header(c, "PRICING GUIDE 2026")
    y -= 18
    c.setFont("Helvetica", 9); c.setFillColor(LIGHT)
    c.drawString(30, y, "Three plans designed to grow with your practice. All include onboarding, training, and ongoing support.")

    # Plan cards
    plans = [
        {"name":"Essentials","price":"99","annual":"79",
         "desc":"For practices starting their\nretention journey","pop":False,
         "feats":[
            (True,"Automated recall reminders"),
            (True,"SMS & email campaigns"),
            (True,"Patient messaging inbox"),
            (True,"Basic retention dashboard"),
            (True,"GOS claim tracking"),
            (True,"Up to 2,000 patients"),
            (True,"Email support"),
            (False,"No-show follow-ups"),
            (False,"WhatsApp integration"),
            (False,"Myopia management"),
            (False,"Google review requests"),
            (False,"Health score analytics"),
         ]},
        {"name":"Professional","price":"199","annual":"159",
         "desc":"The complete toolkit for\ngrowing practices","pop":True,
         "feats":[
            (True,"Everything in Essentials"),
            (True,"No-show follow-ups"),
            (True,"WhatsApp integration"),
            (True,"Google review requests"),
            (True,"Patient health scores"),
            (True,"Myopia management hub"),
            (True,"Up to 8,000 patients"),
            (True,"Priority support"),
            (True,"Revenue-at-risk alerts"),
            (True,"Custom campaign builder"),
            (True,"Multi-user access (3)"),
            (True,"Quarterly review call"),
         ]},
        {"name":"Enterprise","price":"349","annual":"279",
         "desc":"For multi-site groups and\nhigh-volume practices","pop":False,
         "feats":[
            (True,"Everything in Professional"),
            (True,"Unlimited patients"),
            (True,"Multi-site dashboard"),
            (True,"Dedicated account manager"),
            (True,"Custom integrations"),
            (True,"Advanced analytics & reports"),
            (True,"API access"),
            (True,"Staff performance tracking"),
            (True,"Custom branding"),
            (True,"SLA guarantee"),
            (True,"Monthly strategy call"),
            (True,"Onboarding for all sites"),
         ]},
    ]

    card_top = y - 16
    cw = (W - 60 - 32) / 3
    ch = 310
    gap = 16

    for i, pl in enumerate(plans):
        x = 30 + i*(cw+gap)
        cy = card_top - ch
        bg = DARK_ALT if pl["pop"] else CARD
        rrect(c, x, cy, cw, ch, 8, fill=bg)
        sc = CYAN if pl["pop"] else BORDER
        sw = 1.5 if pl["pop"] else 0.5
        rrect(c, x, cy, cw, ch, 8, stroke=sc, sw=sw)

        iy = card_top - 16
        if pl["pop"]:
            bw = c.stringWidth("MOST POPULAR","Helvetica-Bold",6)+12
            rrect(c, x+(cw-bw)/2, iy-3, bw, 14, 4, fill=CYAN)
            c.setFont("Helvetica-Bold",6); c.setFillColor(WHITE)
            c.drawCentredString(x+cw/2, iy, "MOST POPULAR")
            iy -= 22
        else:
            iy -= 8

        c.setFont("Helvetica-Bold",14); c.setFillColor(WHITE)
        c.drawCentredString(x+cw/2, iy, pl["name"]); iy -= 24

        c.setFont("Helvetica-Bold",28)
        c.setFillColor(CYAN if pl["pop"] else WHITE)
        ps = f"£{pl['price']}"
        c.drawCentredString(x+cw/2-10, iy, ps)
        c.setFont("Helvetica",9); c.setFillColor(MUTED)
        c.drawString(x+cw/2+c.stringWidth(ps,"Helvetica-Bold",28)/2-8, iy+2, "/mo")
        iy -= 16

        c.setFont("Helvetica",7.5); c.setFillColor(GREEN)
        c.drawCentredString(x+cw/2, iy, f"£{pl['annual']}/mo billed annually (save 20%)")
        iy -= 18

        c.setFont("Helvetica",7); c.setFillColor(MUTED)
        for ln in pl["desc"].split("\n"):
            c.drawCentredString(x+cw/2, iy, ln); iy -= 10
        iy -= 6
        c.setStrokeColor(BORDER); c.setLineWidth(0.3); c.line(x+10, iy, x+cw-10, iy); iy -= 12

        for inc, ft in pl["feats"]:
            if inc:
                c.setFillColor(GREEN); c.setFont("Helvetica-Bold",8); c.drawString(x+12, iy, "✓")
                c.setFont("Helvetica",7); c.setFillColor(LIGHT)
            else:
                c.setFillColor(MUTED); c.setFont("Helvetica",8); c.drawString(x+12, iy+0.5, "—")
                c.setFont("Helvetica",7); c.setFillColor(HexColor('#4A5568'))
            c.drawString(x+24, iy, ft); iy -= 13.5

    # Add-ons
    ay = card_top - ch - 22
    c.setFont("Helvetica-Bold",10); c.setFillColor(WHITE); c.drawString(30, ay, "Optional Add-Ons")
    ay -= 18

    addons = [
        ("Additional SMS bundle","1,000 messages","£25/mo"),
        ("Extra practice site","Per additional site","£249/mo"),
        ("Data migration service","One-time","£299"),
        ("Custom PMS integration","One-time setup","From £499"),
    ]
    aw = (W-60-36)/4
    for i,(t,s,p) in enumerate(addons):
        ax = 30+i*(aw+12)
        rrect(c, ax, ay-38, aw, 42, 6, fill=CARD, stroke=BORDER, sw=0.3)
        c.setFont("Helvetica-Bold",7); c.setFillColor(WHITE); c.drawString(ax+8, ay-8, t)
        c.setFont("Helvetica",6); c.setFillColor(MUTED); c.drawString(ax+8, ay-19, s)
        c.setFont("Helvetica-Bold",8); c.setFillColor(CYAN); c.drawString(ax+8, ay-31, p)

    # Included in every plan
    by = ay - 68
    c.setFont("Helvetica-Bold",9); c.setFillColor(WHITE); c.drawString(30, by, "What's Included in Every Plan")
    by -= 16
    items = [
        "Free onboarding & training","No setup fees","Cancel anytime (monthly plans)",
        "GDPR compliant & UK data hosting","Regular product updates","PMS integration (Optisoft, Optix, etc.)",
    ]
    for i,item in enumerate(items):
        col = 0 if i < 3 else 1
        row = i if i < 3 else i-3
        ox = 30 if col==0 else W/2
        c.setFont("Helvetica-Bold",7); c.setFillColor(GREEN); c.drawString(ox, by-row*13, "✓")
        c.setFont("Helvetica",7); c.setFillColor(LIGHT); c.drawString(ox+12, by-row*13, item)

    footer(c)

# ═══════════════════════════════════════════════════════════════
# PAGE 2 — Plain-English breakdown + sales scripts
# ═══════════════════════════════════════════════════════════════
def page2(c):
    y = header(c, "SALES SCRIPT & BREAKDOWN")
    y -= 16
    c.setFont("Helvetica-Bold", 12); c.setFillColor(WHITE)
    c.drawString(30, y, "What every line item means — in plain English")
    y -= 10
    c.setFont("Helvetica", 7.5); c.setFillColor(MUTED)
    c.drawString(30, y, "Use this as your script when an optician asks \"what does that actually mean for me?\"")
    y -= 18

    # ── Section helper
    def section_title(c, y, text, color=CYAN):
        rrect(c, 30, y-4, W-60, 18, 4, fill=color)
        c.setFont("Helvetica-Bold", 8); c.setFillColor(WHITE)
        c.drawString(38, y, text)
        return y - 24

    def row(c, y, feature, meaning, lh=9):
        c.setFont("Helvetica-Bold", 7); c.setFillColor(WHITE)
        c.drawString(36, y, feature)
        c.setFont("Helvetica", 6.5); c.setFillColor(LIGHT)
        # Wrap meaning text
        words = meaning.split()
        lines = []
        line = ""
        max_w = W - 36 - 200 - 10
        for w in words:
            test = line + " " + w if line else w
            if c.stringWidth(test, "Helvetica", 6.5) > max_w:
                lines.append(line)
                line = w
            else:
                line = test
        if line: lines.append(line)
        for i, ln in enumerate(lines):
            c.drawString(200, y - i*lh, ln)
        used = max(len(lines)*lh, 12)
        return y - used - 2

    # ── ESSENTIALS FEATURES
    y = section_title(c, y, "ESSENTIALS — £99/mo  •  \"Your starting point for patient retention\"")

    items = [
        ("Automated recall reminders", "Watches your patient list and sends recall messages automatically when patients are due. No manual list-building."),
        ("SMS & email campaigns", "Bulk messages to patient segments — e.g. 'all CL wearers overdue 12+ months'. Templates included."),
        ("Patient messaging inbox", "One place for every patient conversation. No more digging through SMS apps or separate emails."),
        ("Basic retention dashboard", "Simple screen: how many overdue, how many contacted, your recall compliance rate at a glance."),
        ("GOS claim tracking", "See which GOS claims are submitted, pending, or about to be rejected — before the patient leaves."),
        ("Up to 2,000 patients", "Covers most single-site independents comfortably. Upgrade if you grow past this."),
        ("Email support", "You email us, we reply within 24 hours. Real humans, not chatbots."),
    ]
    for feat, meaning in items:
        y = row(c, y, feat, meaning)
        if y < 50: c.showPage(); y = header(c, "SALES SCRIPT & BREAKDOWN") - 20

    y -= 6

    # ── PROFESSIONAL UPGRADES
    y = section_title(c, y, "PROFESSIONAL ADDS — £199/mo  •  \"The one 90% of practices choose\"")

    items = [
        ("WhatsApp integration", "The big one. 98% open rate. Recalls, reorder nudges, confirmations — on the channel patients actually read and reply to."),
        ("No-show follow-ups", "Patient doesn't turn up? Iryss sends a WhatsApp within the hour with a rebook link. Recovers 30–40% of no-shows."),
        ("Google review requests", "After a good visit, auto-sends a WhatsApp asking for a Google review. Builds your online reputation on autopilot."),
        ("Patient health scores", "Every patient scored 0–100. See who's about to leave, who's healthy, who needs attention right now."),
        ("Myopia management hub", "Dedicated page for paediatric myopia: axial length tracking, treatment plans, parent WhatsApp, AI recommendations."),
        ("Revenue-at-risk alerts", "\"You have £4,200 at risk this month from patients who haven't rebooked\" — with names, so you can act."),
        ("Custom campaign builder", "Build targeted campaigns yourself — specific patient segments, custom messages, scheduled sends."),
        ("Multi-user access (3)", "You, your manager, and front desk all using it simultaneously. Everyone on the same page."),
        ("Quarterly review call", "Every 3 months we review your numbers together and suggest what to optimise next."),
    ]
    for feat, meaning in items:
        y = row(c, y, feat, meaning)
        if y < 50: c.showPage(); y = header(c, "SALES SCRIPT & BREAKDOWN") - 20

    y -= 6

    # ── ENTERPRISE UPGRADES
    y = section_title(c, y, "ENTERPRISE ADDS — £349/mo  •  \"For multi-site groups\"")

    items = [
        ("Unlimited patients", "No cap. 5,000 or 50,000 across all sites — same price."),
        ("Multi-site dashboard", "See all practices in one view. Compare performance, spot which site is losing patients."),
        ("Dedicated account manager", "A named person who knows your practice and picks up the phone when you call."),
        ("Custom integrations", "Bespoke connections to whatever system you use. If your CRM has an API, we plug into it."),
        ("Staff performance tracking", "See which team member books the most recalls, sends the most WhatsApps, converts the most."),
        ("Custom branding", "Your logo, your colours. Patients see your practice brand, not ours."),
        ("SLA guarantee", "Guaranteed uptime and response times — in writing."),
    ]
    for feat, meaning in items:
        y = row(c, y, feat, meaning)
        if y < 50: c.showPage(); y = header(c, "SALES SCRIPT & BREAKDOWN") - 20

    footer(c)

# ═══════════════════════════════════════════════════════════════
# PAGE 3 — Add-on breakdowns + objection handlers
# ═══════════════════════════════════════════════════════════════
def page3(c):
    y = header(c, "ADD-ONS & OBJECTION HANDLERS")
    y -= 16
    c.setFont("Helvetica-Bold", 12); c.setFillColor(WHITE)
    c.drawString(30, y, "Optional Add-Ons — what to say")
    y -= 18

    addons = [
        ("Additional SMS Bundle — £25/mo",
         "1,000 extra SMS per month on top of your plan.",
         "\"Your plan includes SMS already, but if you're doing a big reactivation campaign with 5,000+ patients, you can bolt on extra at £25 per thousand. Most Professional practices don't need this — WhatsApp replaces 80% of SMS.\""),
        ("Extra Practice Site — £249/mo",
         "Adds another location with its own dashboard, data, and staff access — all visible from master view.",
         "\"Each extra site gets its own dashboard and recalls, but you see everything from one screen. We train staff at each new site as part of setup.\""),
        ("Data Migration — £299 one-off",
         "We take your existing patient data (CSV, spreadsheets) and import it cleanly — mapped, deduplicated, ready.",
         "\"Export from your CRM, send it to us, we clean it and load it. One-off £299. That said, Iryss also connects live to your CRM — so this is optional, more for practices who want historical data from day one.\""),
        ("Custom PMS Integration — from £499 one-off",
         "Bespoke connection between Iryss and your specific CRM — for systems we don't have a standard connector for yet.",
         "\"We already integrate with Optix, Ocuco, Optisoft, Acuitas, XEYEX. If you're on something else, we build it. Starts at £499, includes testing and go-live support. Once built, it works forever — no ongoing charge.\""),
    ]

    for title, desc, script in addons:
        # Title bar
        rrect(c, 30, y-4, W-60, 16, 4, fill=CARD, stroke=BORDER, sw=0.3)
        c.setFont("Helvetica-Bold", 8); c.setFillColor(CYAN)
        c.drawString(38, y-1, title)
        y -= 22

        c.setFont("Helvetica", 7); c.setFillColor(LIGHT)
        c.drawString(36, y, desc)
        y -= 14

        # Script bubble
        sw = c.stringWidth(script, "Helvetica-Oblique", 6.5)
        # Wrap script
        words = script.split()
        lines = []
        line = ""
        max_w = W - 80 - 10
        for w in words:
            test = line + " " + w if line else w
            if c.stringWidth(test, "Helvetica-Oblique", 6.5) > max_w:
                lines.append(line); line = w
            else:
                line = test
        if line: lines.append(line)
        bh = len(lines)*9 + 10
        rrect(c, 36, y-bh+4, W-72, bh, 6, fill=HexColor('#111927'), stroke=CYAN, sw=0.3)
        c.setFont("Helvetica-Bold", 5.5); c.setFillColor(CYAN)
        c.drawString(42, y-2, "SAY THIS:")
        c.setFont("Helvetica-Oblique", 6.5); c.setFillColor(LIGHT)
        for i, ln in enumerate(lines):
            c.drawString(42, y-12-i*9, ln)
        y -= bh + 12
        if y < 120: c.showPage(); y = header(c, "ADD-ONS & OBJECTION HANDLERS") - 20

    # ── OBJECTION HANDLERS
    y -= 8
    c.setFont("Helvetica-Bold", 12); c.setFillColor(WHITE)
    c.drawString(30, y, "Quick objection handlers")
    y -= 18

    objections = [
        ("\"It's too expensive\"",
         "\"How much is one lost patient worth? Average lifetime value is £800–1,200. Retain two extra patients a month and Iryss pays for itself 8x over. Professional is £2,400/year — the maths speaks for itself.\"",
         RED),
        ("\"I already have a CRM\"",
         "\"Good — keep it. Iryss isn't a replacement. Your CRM stores records. Iryss stops patients leaving. It plugs in alongside whatever you use.\"",
         AMBER),
        ("\"Can I try it first?\"",
         "\"Book a demo and we'll show you your own data. You'll see your at-risk patients, revenue at risk, and what Iryss would do — before you pay a penny.\"",
         CYAN),
        ("\"What if I want to cancel?\"",
         "\"Monthly plans cancel anytime. Annual saves 20% and includes a 30-day money-back guarantee. Zero risk.\"",
         GREEN),
    ]

    for objection, response, color in objections:
        rrect(c, 30, y-4, 4, 14, 1, fill=color)
        c.setFont("Helvetica-Bold", 8); c.setFillColor(WHITE)
        c.drawString(40, y, objection)
        y -= 14

        words = response.split()
        lines = []
        line = ""
        max_w = W - 80
        for w in words:
            test = line + " " + w if line else w
            if c.stringWidth(test, "Helvetica-Oblique", 7) > max_w:
                lines.append(line); line = w
            else:
                line = test
        if line: lines.append(line)
        c.setFont("Helvetica-Oblique", 7); c.setFillColor(LIGHT)
        for i, ln in enumerate(lines):
            c.drawString(40, y - i*10, ln)
        y -= len(lines)*10 + 12

    # ── ROI footer
    y -= 4
    rrect(c, 30, y-44, W-60, 48, 8, fill=DARK_ALT, stroke=CYAN, sw=1)
    c.setFont("Helvetica-Bold", 10); c.setFillColor(WHITE)
    c.drawCentredString(W/2, y-12, "The ROI question that closes the deal:")
    c.setFont("Helvetica-Bold", 9); c.setFillColor(CYAN)
    c.drawCentredString(W/2, y-28, "\"If Iryss saves just 2 patients a month, that's £20,000+ a year. Your investment? £2,400.\"")
    c.setFont("Helvetica", 7); c.setFillColor(GREEN)
    c.drawCentredString(W/2, y-40, "Return on investment: 8x  •  Payback period: under 6 weeks")

    footer(c)


# ═══════════════════════════════════════════════════════════════
# BUILD
# ═══════════════════════════════════════════════════════════════
out = "/Users/louiseeverden/iryss-frontend/IRYSS_Pricing_Full.pdf"
c = canvas.Canvas(out, pagesize=A4)
page1(c)
c.showPage()
page2(c)
c.showPage()
page3(c)
c.save()
print(f"✅ Created: {out}")
