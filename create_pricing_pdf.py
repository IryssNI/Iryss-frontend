from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor, white, Color
from reportlab.pdfgen import canvas
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.platypus import Paragraph, Frame
from reportlab.lib.styles import ParagraphStyle

# Brand colors
CYAN = HexColor('#0891B2')
DARK_NAVY = HexColor('#0C1220')
LIGHT_NAVY = HexColor('#141B2D')
CARD_BG = HexColor('#1A2235')
SUBTLE_TEXT = HexColor('#8896AB')
WHITE = HexColor('#FFFFFF')
LIGHT_CYAN = HexColor('#E0F7FA')
GREEN = HexColor('#10B981')
BORDER_COLOR = HexColor('#1E293B')

WIDTH, HEIGHT = A4  # 210 x 297 mm

def draw_rounded_rect(c, x, y, w, h, r, fill_color=None, stroke_color=None, stroke_width=0.5):
    """Draw a rounded rectangle."""
    c.saveState()
    p = c.beginPath()
    p.moveTo(x + r, y)
    p.lineTo(x + w - r, y)
    p.arcTo(x + w - r, y, x + w, y + r, 0, 90)
    p.lineTo(x + w, y + h - r)
    p.arcTo(x + w - r, y + h - r, x + w, y + h, 0, 90)
    p.lineTo(x + r, y + h)
    p.arcTo(x, y + h - r, x + r, y + h, 0, 90)
    p.lineTo(x, y + r)
    p.arcTo(x, y, x + r, y + r, 0, 90)
    p.close()
    if fill_color:
        c.setFillColor(fill_color)
    if stroke_color:
        c.setStrokeColor(stroke_color)
        c.setLineWidth(stroke_width)
        c.drawPath(p, fill=1 if fill_color else 0, stroke=1 if stroke_color else 0)
    else:
        c.drawPath(p, fill=1 if fill_color else 0, stroke=0)
    c.restoreState()

def create_pdf():
    output_path = "/sessions/elegant-peaceful-volta/mnt/iryss-frontend/IRYSS_Pricing.pdf"
    c = canvas.Canvas(output_path, pagesize=A4)
    
    # ── BACKGROUND ──
    c.setFillColor(DARK_NAVY)
    c.rect(0, 0, WIDTH, HEIGHT, fill=1, stroke=0)
    
    # Subtle gradient orb (top right)
    c.saveState()
    c.setFillColor(Color(8/255, 145/255, 178/255, 0.08))
    c.circle(WIDTH - 60, HEIGHT - 80, 120, fill=1, stroke=0)
    c.restoreState()
    
    # ── HEADER ──
    y = HEIGHT - 45
    
    # Logo text: IRYSS
    c.setFont("Helvetica-Bold", 22)
    c.setFillColor(WHITE)
    c.drawString(30, y, "IRY")
    w1 = c.stringWidth("IRY", "Helvetica-Bold", 22)
    c.setFillColor(CYAN)
    c.drawString(30 + w1, y, "SS")
    
    # Tagline
    c.setFont("Helvetica", 8)
    c.setFillColor(SUBTLE_TEXT)
    c.drawString(30, y - 14, "PATIENT RETENTION FOR OPTICIANS")
    
    # Right side: document title
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(CYAN)
    c.drawRightString(WIDTH - 30, y, "PRICING GUIDE 2026")
    c.setFont("Helvetica", 7.5)
    c.setFillColor(SUBTLE_TEXT)
    c.drawRightString(WIDTH - 30, y - 13, "theiryss.com")
    
    # Divider
    y -= 28
    c.setStrokeColor(BORDER_COLOR)
    c.setLineWidth(0.5)
    c.line(30, y, WIDTH - 30, y)
    
    # ── INTRO LINE ──
    y -= 20
    c.setFont("Helvetica", 9)
    c.setFillColor(HexColor('#CBD5E1'))
    c.drawString(30, y, "Three plans designed to grow with your practice. All include onboarding, training, and ongoing support.")
    
    # ── PRICING CARDS ──
    card_top = y - 18
    card_w = (WIDTH - 30*2 - 16*2) / 3  # 3 cards with 16pt gaps
    card_h = 310
    card_gap = 16
    
    plans = [
        {
            "name": "Essentials",
            "price": "99",
            "annual": "79",
            "desc": "For practices starting their\nretention journey",
            "badge": None,
            "highlight": False,
            "features": [
                ("Automated recall reminders", True),
                ("SMS & email campaigns", True),
                ("Patient messaging inbox", True),
                ("Basic retention dashboard", True),
                ("GOS claim tracking", True),
                ("Up to 2,000 patients", True),
                ("Email support", True),
                ("No-show follow-ups", False),
                ("WhatsApp integration", False),
                ("Myopia management", False),
                ("Google review requests", False),
                ("Health score analytics", False),
            ]
        },
        {
            "name": "Professional",
            "price": "199",
            "annual": "159",
            "desc": "The complete toolkit for\ngrowing practices",
            "badge": "MOST POPULAR",
            "highlight": True,
            "features": [
                ("Everything in Essentials", True),
                ("No-show follow-ups", True),
                ("WhatsApp integration", True),
                ("Google review requests", True),
                ("Patient health scores", True),
                ("Myopia management hub", True),
                ("Up to 8,000 patients", True),
                ("Priority support", True),
                ("Revenue-at-risk alerts", True),
                ("Custom campaign builder", True),
                ("Multi-user access (3)", True),
                ("Quarterly review call", True),
            ]
        },
        {
            "name": "Enterprise",
            "price": "349",
            "annual": "279",
            "desc": "For multi-site groups and\nhigh-volume practices",
            "badge": None,
            "highlight": False,
            "features": [
                ("Everything in Professional", True),
                ("Unlimited patients", True),
                ("Multi-site dashboard", True),
                ("Dedicated account manager", True),
                ("Custom integrations", True),
                ("Advanced analytics & reports", True),
                ("API access", True),
                ("Staff performance tracking", True),
                ("Custom branding", True),
                ("SLA guarantee", True),
                ("Monthly strategy call", True),
                ("Onboarding for all sites", True),
            ]
        }
    ]
    
    for i, plan in enumerate(plans):
        x = 30 + i * (card_w + card_gap)
        cy = card_top - card_h
        
        # Card background
        bg = CARD_BG if not plan["highlight"] else HexColor('#0E2A35')
        draw_rounded_rect(c, x, cy, card_w, card_h, 8, fill_color=bg)
        
        # Highlight border for Professional
        if plan["highlight"]:
            draw_rounded_rect(c, x, cy, card_w, card_h, 8, fill_color=None, stroke_color=CYAN, stroke_width=1.5)
        else:
            draw_rounded_rect(c, x, cy, card_w, card_h, 8, fill_color=None, stroke_color=BORDER_COLOR, stroke_width=0.5)
        
        # Badge
        inner_y = card_top - 18
        if plan["badge"]:
            badge_w = c.stringWidth(plan["badge"], "Helvetica-Bold", 6) + 12
            draw_rounded_rect(c, x + (card_w - badge_w)/2, inner_y - 3, badge_w, 14, 4, fill_color=CYAN)
            c.setFont("Helvetica-Bold", 6)
            c.setFillColor(WHITE)
            c.drawCentredString(x + card_w/2, inner_y, plan["badge"])
            inner_y -= 22
        else:
            inner_y -= 8
        
        # Plan name
        c.setFont("Helvetica-Bold", 14)
        c.setFillColor(WHITE)
        c.drawCentredString(x + card_w/2, inner_y, plan["name"])
        inner_y -= 24
        
        # Price
        c.setFont("Helvetica-Bold", 28)
        c.setFillColor(WHITE if not plan["highlight"] else CYAN)
        price_str = f"£{plan['price']}"
        pw = c.stringWidth(price_str, "Helvetica-Bold", 28)
        c.drawCentredString(x + card_w/2 - 10, inner_y, price_str)
        c.setFont("Helvetica", 9)
        c.setFillColor(SUBTLE_TEXT)
        c.drawString(x + card_w/2 + pw/2 - 8, inner_y + 2, "/mo")
        inner_y -= 16
        
        # Annual price
        c.setFont("Helvetica", 7.5)
        c.setFillColor(GREEN)
        c.drawCentredString(x + card_w/2, inner_y, f"£{plan['annual']}/mo billed annually (save 20%)")
        inner_y -= 18
        
        # Description
        c.setFont("Helvetica", 7)
        c.setFillColor(SUBTLE_TEXT)
        for line in plan["desc"].split("\n"):
            c.drawCentredString(x + card_w/2, inner_y, line)
            inner_y -= 10
        
        inner_y -= 6
        
        # Divider inside card
        c.setStrokeColor(BORDER_COLOR)
        c.setLineWidth(0.3)
        c.line(x + 10, inner_y, x + card_w - 10, inner_y)
        inner_y -= 12
        
        # Features list
        for feat_text, included in plan["features"]:
            if included:
                c.setFillColor(GREEN)
                c.setFont("Helvetica-Bold", 8)
                c.drawString(x + 12, inner_y, "✓")
                c.setFont("Helvetica", 7)
                c.setFillColor(HexColor('#CBD5E1'))
            else:
                c.setFillColor(SUBTLE_TEXT)
                c.setFont("Helvetica", 8)
                c.drawString(x + 12, inner_y + 0.5, "—")
                c.setFont("Helvetica", 7)
                c.setFillColor(HexColor('#4A5568'))
            c.drawString(x + 24, inner_y, feat_text)
            inner_y -= 13.5
    
    # ── ADD-ONS SECTION ──
    addons_y = card_top - card_h - 22
    
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(WHITE)
    c.drawString(30, addons_y, "Optional Add-Ons")
    
    addons_y -= 18
    
    addons = [
        ("Additional SMS bundle", "1,000 messages", "£25/mo"),
        ("Extra practice site", "Enterprise plan", "£249/mo per site"),
        ("Data migration service", "One-time", "£299"),
        ("Custom PMS integration", "One-time setup", "From £499"),
    ]
    
    addon_card_w = (WIDTH - 60 - 12*3) / 4
    for i, (title, subtitle, price) in enumerate(addons):
        ax = 30 + i * (addon_card_w + 12)
        draw_rounded_rect(c, ax, addons_y - 38, addon_card_w, 42, 6, fill_color=CARD_BG, stroke_color=BORDER_COLOR, stroke_width=0.3)
        c.setFont("Helvetica-Bold", 7)
        c.setFillColor(WHITE)
        c.drawString(ax + 8, addons_y - 8, title)
        c.setFont("Helvetica", 6)
        c.setFillColor(SUBTLE_TEXT)
        c.drawString(ax + 8, addons_y - 19, subtitle)
        c.setFont("Helvetica-Bold", 8)
        c.setFillColor(CYAN)
        c.drawString(ax + 8, addons_y - 31, price)
    
    # ── BOTTOM SECTION ──
    bottom_y = addons_y - 68
    
    # Left: Key details
    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(WHITE)
    c.drawString(30, bottom_y, "What's Included in Every Plan")
    
    bottom_y -= 16
    included_items = [
        "Free onboarding & training",
        "No setup fees",
        "Cancel anytime (monthly plans)",
        "GDPR compliant & UK data hosting",
        "Regular product updates",
        "PMS integration (Optisoft, Optix, etc.)",
    ]
    
    col1_items = included_items[:3]
    col2_items = included_items[3:]
    
    for idx, item in enumerate(col1_items):
        c.setFont("Helvetica-Bold", 7)
        c.setFillColor(GREEN)
        c.drawString(30, bottom_y - idx * 13, "✓")
        c.setFont("Helvetica", 7)
        c.setFillColor(HexColor('#CBD5E1'))
        c.drawString(42, bottom_y - idx * 13, item)
    
    for idx, item in enumerate(col2_items):
        c.setFont("Helvetica-Bold", 7)
        c.setFillColor(GREEN)
        c.drawString(WIDTH/2, bottom_y - idx * 13, "✓")
        c.setFont("Helvetica", 7)
        c.setFillColor(HexColor('#CBD5E1'))
        c.drawString(WIDTH/2 + 12, bottom_y - idx * 13, item)
    
    # ── FOOTER ──
    footer_y = 30
    c.setStrokeColor(BORDER_COLOR)
    c.setLineWidth(0.5)
    c.line(30, footer_y + 16, WIDTH - 30, footer_y + 16)
    
    c.setFont("Helvetica", 7)
    c.setFillColor(SUBTLE_TEXT)
    c.drawString(30, footer_y, "IRYSS Ltd  •  theiryss.com  •  hello@theiryss.com")
    c.drawRightString(WIDTH - 30, footer_y, "All prices exclude VAT  •  Pricing valid from April 2026")
    
    c.save()
    print(f"PDF created: {output_path}")

create_pdf()
