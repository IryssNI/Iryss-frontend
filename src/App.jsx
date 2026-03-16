import { useState, useEffect, useRef } from "react";

// ── Brand colours matching the website ──────────────────────────────
const C = {
  navy: "#0A1628",
  teal: "#0891B2",
  tealLt: "#06B6D4",
  tealPale: "#E0F7FA",
  cream: "#F8FBFD",
  border: "#E2E8F0",
  slate: "#64748B",
  white: "#FFFFFF",
  red: "#EF4444",
  amber: "#F59E0B",
  green: "#10B981",
  purple: "#8B5CF6",
};

// ── Demo data mirroring the website's example patients ──────────────
const PATIENTS = [
  { id: "P-001", name: "Sarah O'Neill", initials: "SO", phone: "+447827001001", lastVisit: "14 months ago", product: "Varifocals", risk: "high", riskScore: 92, revenue: 320, status: "pending", color: C.red, bgColor: "rgba(239,68,68,.08)" },
  { id: "P-002", name: "Tom Bradley", initials: "TB", phone: "+447827001002", lastVisit: "9 months ago", product: "Monthly Contact Lenses", risk: "medium", riskScore: 61, revenue: 185, status: "sent", color: C.amber, bgColor: "rgba(245,158,11,.08)" },
  { id: "P-003", name: "Margaret Flynn", initials: "MF", phone: "+447827001003", lastVisit: "11 months ago", product: "Glasses + Contact Lenses", risk: "high", riskScore: 88, revenue: 410, status: "alert", color: C.red, bgColor: "rgba(239,68,68,.08)" },
  { id: "P-004", name: "Ciara Murphy", initials: "CM", phone: "+447827001004", lastVisit: "4 months ago", product: "Glasses", risk: "low", riskScore: 24, revenue: 240, status: "checkin", color: C.green, bgColor: "rgba(16,185,129,.08)" },
  { id: "P-005", name: "James Brew", initials: "JB", phone: "+447827001005", lastVisit: "7 months ago", product: "Daily Contact Lenses", risk: "medium", riskScore: 54, revenue: 160, status: "booked", color: C.amber, bgColor: "rgba(245,158,11,.08)" },
  { id: "P-006", name: "Sarah Flynn", initials: "SF", phone: "+447827001006", lastVisit: "3 months ago", product: "Varifocals", risk: "low", riskScore: 18, revenue: 380, status: "booked", color: C.green, bgColor: "rgba(16,185,129,.08)" },
  { id: "P-007", name: "Shona Everden", initials: "SE", phone: "+447711552094", lastVisit: "13 months ago", product: "Progressive Lenses", risk: "high", riskScore: 79, revenue: 295, status: "pending", color: C.red, bgColor: "rgba(239,68,68,.08)" },
  { id: "P-008", name: "Jessica Bayman", initials: "JB2", phone: "+447572043380", lastVisit: "5 months ago", product: "Monthly CL + Glasses", risk: "low", riskScore: 31, revenue: 220, status: "recovered", color: C.green, bgColor: "rgba(16,185,129,.08)" },
];

const INBOX = [
  { id: 1, patient: "Margaret Flynn", initials: "MF", preview: "I've been having some issues with my vision…", time: "2m ago", unread: true, urgent: true, thread: [
    { from: "practice", text: "Hi Margaret 👋 It's been a while since your last visit — we wanted to check in and see how you're getting on with your glasses. Bright Eyes Opticians 😊", time: "09:05" },
    { from: "patient", text: "Hi, yes actually I've been having some issues with my vision lately, things seem a bit blurry on the left side", time: "09:18", urgent: true },
  ]},
  { id: 2, patient: "Tom Bradley", initials: "TB", preview: "Wednesday 2pm works perfectly, thank you!", time: "14m ago", unread: true, urgent: false, thread: [
    { from: "practice", text: "Hi Tom 👋 Just checking in — it's been 9 months since your last contact lens check. Ready to book in? 😊", time: "09:05" },
    { from: "patient", text: "Hi! Yes, I was meaning to get in touch actually. Do you have anything next week?", time: "09:31" },
    { from: "practice", text: "Of course! I have Wednesday 18th at 2pm or Thursday 19th at 11am — which works best for you? 😊", time: "09:31" },
    { from: "patient", text: "Wednesday 2pm works perfectly, thank you!", time: "09:46" },
    { from: "practice", text: "Brilliant! Wednesday 18th at 2pm is confirmed for you Tom. See you then! 😊", time: "09:46" },
  ]},
  { id: 3, patient: "James Brew", initials: "JB", preview: "Do you do multifocal contact lenses?", time: "1h ago", unread: false, urgent: false, thread: [
    { from: "patient", text: "Hi, do you do multifocal contact lenses? I've been struggling with reading glasses on top of my monthlies", time: "14:32" },
    { from: "practice", text: "Hi James! Yes we do 😊 Multifocal contact lenses are brilliant for exactly that. We fit daily and monthly multifocals including Acuvue Oasys and CooperVision Biofinity Multifocal.\n\nIt'd be worth a fitting appointment to find the right lens. Shall I check availability?", time: "14:32" },
    { from: "patient", text: "Yes please! Friday would be best for me", time: "14:45" },
    { from: "practice", text: "I have Friday 21st at 3:30pm — does that work? 😊", time: "14:45" },
    { from: "patient", text: "Friday 3:30 works perfectly!", time: "15:02" },
  ]},
  { id: 4, patient: "Ciara Murphy", initials: "CM", preview: "Thanks so much, see you Thursday!", time: "3h ago", unread: false, urgent: false, thread: [
    { from: "practice", text: "Hi Ciara! Hope you're well. We just wanted to check in — you haven't needed any new glasses or lenses recently so all good, but we're here whenever you need us 😊", time: "11:00" },
    { from: "patient", text: "Thanks so much! I'm due an eye test soon actually, I'll call to book in", time: "11:15" },
    { from: "practice", text: "Wonderful! See you soon Ciara 😊", time: "11:15" },
    { from: "patient", text: "Thanks so much, see you Thursday!", time: "13:20" },
  ]},
  { id: 5, patient: "Sarah Flynn", initials: "SF", preview: "Wednesday at 2pm confirmed ✓", time: "Yesterday", unread: false, urgent: false, thread: [
    { from: "practice", text: "Hi Sarah 👋 Just a reminder your appointment is tomorrow, Wednesday 18th at 2pm. See you then! 😊", time: "09:00" },
    { from: "patient", text: "Wednesday at 2pm confirmed ✓ See you then!", time: "09:47" },
  ]},
];

const REVIEWS = [
  { name: "Sarah M.", stars: 5, text: "Got a lovely WhatsApp the day after my appointment — such a personal touch. Couldn't not leave a review!", days: "1 day ago", via: true },
  { name: "Claire D.", stars: 5, text: "They followed up after my kids' appointment to check we were happy. Brilliant practice.", days: "3 days ago", via: true },
  { name: "Tom B.", stars: 5, text: "New glasses are perfect. The WhatsApp check-in was a really nice touch — felt genuinely cared for.", days: "1 week ago", via: true },
  { name: "Patricia R.", stars: 5, text: "Fantastic service from start to finish. Was surprised to get a message checking in afterwards!", days: "2 weeks ago", via: false },
];

const APPOINTMENTS = [
  { patient: "Emma Wilson", type: "Eye Test", time: "09:00", optician: "Dr. Patel", confirmed: true },
  { patient: "Tom Bradley", type: "Contact Lens Fitting", time: "10:30", optician: "Dr. Chen", confirmed: true, note: "Via Iryss" },
  { patient: "Priya Sharma", type: "Glasses Collection", time: "11:15", optician: "Dr. Patel", confirmed: true },
  { patient: "James Brew", type: "Multifocal CL Trial", time: "15:30", optician: "Dr. Chen", confirmed: true, note: "Via Iryss" },
  { patient: "Carol Mitchell", type: "Follow-Up", time: "17:00", optician: "Dr. Patel", confirmed: false },
];

const riskLabel = { high: "HIGH", medium: "MEDIUM", low: "LOW" };
const riskBg = { high: "rgba(239,68,68,.15)", medium: "rgba(245,158,11,.15)", low: "rgba(16,185,129,.15)" };
const riskFg = { high: "#FCA5A5", medium: "#FCD34D", low: "#6EE7B7" };
const statusLabels = { pending: "Pending", sent: "Sent", alert: "⚠ Urgent", checkin: "Check-in", booked: "Booked ✓", recovered: "Recovered ✓" };
const statusBg = {
  pending: "rgba(148,163,184,.15)", sent: "rgba(8,145,178,.15)", alert: "rgba(239,68,68,.15)",
  checkin: "rgba(139,92,246,.15)", booked: "rgba(16,185,129,.15)", recovered: "rgba(16,185,129,.2)"
};
const statusFg = {
  pending: "#94A3B8", sent: "#06B6D4", alert: "#FCA5A5",
  checkin: "#C4B5FD", booked: "#6EE7B7", recovered: "#34D399"
};

// ── Shared components ────────────────────────────────────────────────
function Avatar({ initials, bg = C.teal, size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 700, fontSize: size * 0.35, color: "#fff", flexShrink: 0, fontFamily: "inherit"
    }}>{initials}</div>
  );
}

function StatCard({ label, value, sub, accent, onClick, active }) {
  return (
    <div onClick={onClick} style={{
      background: active ? C.navy : C.white, border: `1px solid ${active ? C.teal : C.border}`,
      borderRadius: 16, padding: "20px 22px", cursor: onClick ? "pointer" : "default",
      transition: "all .2s", boxShadow: active ? `0 0 0 2px ${C.teal}30` : "0 1px 4px rgba(0,0,0,.04)"
    }}>
      <div style={{ width: "100%", height: 3, background: accent, borderRadius: 2, marginBottom: 12 }} />
      <div style={{ fontSize: 26, fontWeight: 800, color: active ? C.white : C.navy, letterSpacing: -1 }}>{value}</div>
      <div style={{ fontSize: 12, color: active ? "rgba(255,255,255,.55)" : C.slate, marginTop: 3 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: active ? C.tealLt : C.teal, marginTop: 4, fontWeight: 600 }}>{sub}</div>}
    </div>
  );
}

function NavBtn({ id, label, icon, current, onClick, badge }) {
  const active = current === id;
  return (
    <button onClick={() => onClick(id)} style={{
      display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "11px 16px",
      border: "none", background: active ? "rgba(8,145,178,.12)" : "transparent",
      borderRadius: 10, cursor: "pointer", color: active ? C.teal : C.slate,
      fontWeight: active ? 700 : 500, fontSize: 14, fontFamily: "inherit", textAlign: "left",
      borderLeft: active ? `3px solid ${C.teal}` : "3px solid transparent", transition: "all .15s",
      position: "relative"
    }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span>{label}</span>
      {badge > 0 && <span style={{ marginLeft: "auto", background: C.red, color: "#fff", borderRadius: 20, fontSize: 11, fontWeight: 700, padding: "2px 7px", minWidth: 20, textAlign: "center" }}>{badge}</span>}
    </button>
  );
}

// ── Main App ────────────────────────────────────────────────────────
export default function IryssDashboard() {
  const [nav, setNav] = useState("dashboard");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedThread, setSelectedThread] = useState(INBOX[0]);
  const [sendMsg, setSendMsg] = useState("");
  const [sentMsgs, setSentMsgs] = useState({});
  const [filterRisk, setFilterRisk] = useState("all");
  const [showSendWA, setShowSendWA] = useState(null);
  const [waMsg, setWaMsg] = useState("");
  const [waSent, setWaSent] = useState({});
  const msgEndRef = useRef(null);

  const highRisk = PATIENTS.filter(p => p.risk === "high");
  const atRiskRevenue = highRisk.reduce((a, p) => a + p.revenue, 0);
  const recoveredRevenue = PATIENTS.filter(p => p.status === "recovered" || p.status === "booked").reduce((a, p) => a + p.revenue, 0);
  const recoveredCount = PATIENTS.filter(p => p.status === "recovered" || p.status === "booked").length;
  const unreadCount = INBOX.filter(i => i.unread).length;
  const urgentCount = INBOX.filter(i => i.urgent).length;

  const filteredPatients = filterRisk === "all" ? PATIENTS : PATIENTS.filter(p => p.risk === filterRisk);

  const avatarColors = ["#0891B2", "#8B5CF6", "#F59E0B", "#10B981", "#EF4444", "#EC4899", "#6366F1", "#14B8A6"];
  const getColor = (i) => avatarColors[i % avatarColors.length];

  function sendWhatsApp(pid) {
    setWaSent(prev => ({ ...prev, [pid]: true }));
    setShowSendWA(null);
    setWaMsg("");
  }

  const waTemplates = {
    high: `Hi {name} 👋\n\nWe've been thinking about you and just wanted to check in. It's been a while since your last visit — whenever you're ready, we'd love to welcome you back.\n\nJust reply here and we'll sort everything 😊\n\nBright Eyes Opticians`,
    medium: `Hi {name} 👋\n\nIt's the team at Bright Eyes! It's been a little while — we just wanted to make sure everything is still going well with your {product}.\n\nDo get in touch if you have any questions at all 😊`,
    low: `Hi {name} 👋\n\nHope you're well! Just a quick friendly check-in from Bright Eyes. We're here whenever you need us 😊`,
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'DM Sans', 'Outfit', system-ui, sans-serif", background: "#F0F4F8", color: C.navy, overflow: "hidden" }}>

      {/* ── Sidebar ── */}
      <div style={{ width: 230, background: C.navy, display: "flex", flexDirection: "column", flexShrink: 0, padding: "0 12px 12px" }}>
        {/* Logo */}
        <div style={{ padding: "22px 6px 20px", borderBottom: "1px solid rgba(255,255,255,.08)", marginBottom: 12 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.white, letterSpacing: -0.5 }}>
            <span style={{ color: C.tealLt }}>iryss</span>
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,.35)", marginTop: 2, letterSpacing: 1 }}>BRIGHT EYES OPTICIANS</div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
          {[
            { id: "dashboard", label: "Dashboard", icon: "⬡" },
            { id: "patients", label: "At-Risk Patients", icon: "🎯", badge: highRisk.length },
            { id: "inbox", label: "Inbox", icon: "💬", badge: unreadCount },
            { id: "revenue", label: "Revenue", icon: "£" },
            { id: "reviews", label: "Google Reviews", icon: "⭐" },
            { id: "appointments", label: "Appointments", icon: "📅" },
            { id: "receptionist", label: "AI Receptionist", icon: "🤖" },
          ].map(item => (
            <button key={item.id} onClick={() => setNav(item.id)} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%",
              padding: "10px 14px", border: "none",
              background: nav === item.id ? "rgba(8,145,178,.2)" : "transparent",
              borderRadius: 10, cursor: "pointer",
              color: nav === item.id ? C.tealLt : "rgba(255,255,255,.55)",
              fontWeight: nav === item.id ? 700 : 400, fontSize: 14, fontFamily: "inherit",
              textAlign: "left", borderLeft: nav === item.id ? `3px solid ${C.teal}` : "3px solid transparent",
              transition: "all .15s"
            }}>
              <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge > 0 && <span style={{ background: C.red, color: "#fff", borderRadius: 20, fontSize: 10, fontWeight: 700, padding: "2px 7px" }}>{item.badge}</span>}
            </button>
          ))}
        </nav>

        <div style={{ borderTop: "1px solid rgba(255,255,255,.08)", paddingTop: 12, marginTop: 8 }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,.3)", padding: "4px 14px", marginBottom: 6, letterSpacing: 1 }}>SYSTEM</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green }} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,.45)" }}>All systems live</span>
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,.25)", padding: "0 14px" }}>
            Next scoring: 02:00 tonight
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>

        {/* Top bar */}
        <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.navy }}>
              {nav === "dashboard" && "Good morning 👋"}
              {nav === "patients" && "At-Risk Patients"}
              {nav === "inbox" && "WhatsApp Inbox"}
              {nav === "revenue" && "Revenue Dashboard"}
              {nav === "reviews" && "Google Reviews"}
              {nav === "appointments" && "Today's Appointments"}
              {nav === "receptionist" && "AI Receptionist"}
            </div>
            <div style={{ fontSize: 12, color: C.slate, marginTop: 2 }}>Tuesday, 10 March 2026</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {urgentCount > 0 && (
              <div onClick={() => setNav("inbox")} style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.2)", borderRadius: 10, padding: "6px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14 }}>🚨</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.red }}>{urgentCount} urgent alert{urgentCount > 1 ? "s" : ""}</span>
              </div>
            )}
            <Avatar initials="BE" bg={C.teal} size={34} />
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, overflow: "auto", padding: 28 }}>

          {/* ═══ DASHBOARD ═══ */}
          {nav === "dashboard" && (
            <div>
              {/* Urgent alert if any */}
              {INBOX.filter(i => i.urgent).map(alert => (
                <div key={alert.id} onClick={() => { setSelectedThread(alert); setNav("inbox"); }}
                  style={{ background: "rgba(239,68,68,.06)", border: "1px solid rgba(239,68,68,.2)", borderRadius: 14, padding: "14px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                  <span style={{ fontSize: 22 }}>🚨</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: C.red, fontSize: 14 }}>Urgent — {alert.patient}</div>
                    <div style={{ fontSize: 13, color: C.slate, marginTop: 2 }}>{alert.preview} — <span style={{ color: C.teal }}>View conversation →</span></div>
                  </div>
                  <div style={{ fontSize: 11, color: C.slate }}>{alert.time}</div>
                </div>
              ))}

              {/* KPI stat cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
                <StatCard label="Patients at risk" value={highRisk.length} sub={`${PATIENTS.filter(p => p.risk === "medium").length} medium · ${PATIENTS.filter(p => p.risk === "low").length} low`} accent={`linear-gradient(90deg, ${C.red}, #F97316)`} onClick={() => setNav("patients")} />
                <StatCard label="Revenue at risk" value={`£${atRiskRevenue.toLocaleString()}`} sub="This month" accent={`linear-gradient(90deg, ${C.amber}, #EAB308)`} onClick={() => setNav("revenue")} />
                <StatCard label="Patients recovered" value={recoveredCount} sub="This month" accent={`linear-gradient(90deg, ${C.green}, #34D399)`} onClick={() => setNav("patients")} />
                <StatCard label="Revenue recovered" value={`£${recoveredRevenue.toLocaleString()}`} sub="↑ This month" accent={`linear-gradient(90deg, ${C.teal}, ${C.tealLt})`} onClick={() => setNav("revenue")} />
              </div>

              {/* Two columns */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

                {/* High-risk patients */}
                <div style={{ background: C.white, borderRadius: 16, padding: 22, border: `1px solid ${C.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>🎯 High-Risk Patients</div>
                    <button onClick={() => setNav("patients")} style={{ background: "none", border: "none", color: C.teal, fontSize: 12, cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>View all →</button>
                  </div>
                  {PATIENTS.filter(p => p.risk === "high").map((p, i) => (
                    <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < highRisk.length - 1 ? `1px solid ${C.border}` : "none" }}>
                      <Avatar initials={p.initials} bg={getColor(i)} size={36} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: C.navy }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: C.slate }}>{p.lastVisit} · {p.product}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: riskBg[p.risk], color: riskFg[p.risk] }}>{riskLabel[p.risk]}</span>
                        {!waSent[p.id] ? (
                          <button onClick={() => { setShowSendWA(p); setWaMsg(waTemplates[p.risk].replace("{name}", p.name.split(" ")[0]).replace("{product}", p.product)); }}
                            style={{ background: C.teal, color: "#fff", border: "none", borderRadius: 8, padding: "5px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                            Send WhatsApp
                          </button>
                        ) : (
                          <span style={{ fontSize: 11, color: C.green, fontWeight: 600 }}>Sent ✓</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent inbox */}
                <div style={{ background: C.white, borderRadius: 16, padding: 22, border: `1px solid ${C.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>💬 Recent Inbox</div>
                    <button onClick={() => setNav("inbox")} style={{ background: "none", border: "none", color: C.teal, fontSize: 12, cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>View all →</button>
                  </div>
                  {INBOX.slice(0, 4).map((m, i) => (
                    <div key={m.id} onClick={() => { setSelectedThread(m); setNav("inbox"); }}
                      style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 3 ? `1px solid ${C.border}` : "none", cursor: "pointer" }}>
                      <Avatar initials={m.initials} bg={getColor(i)} size={36} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: m.unread ? 700 : 500, fontSize: 13, color: C.navy }}>{m.patient}</div>
                        <div style={{ fontSize: 11, color: C.slate, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.preview}</div>
                      </div>
                      <div style={{ flexShrink: 0, textAlign: "right" }}>
                        <div style={{ fontSize: 10, color: C.slate }}>{m.time}</div>
                        {m.urgent && <div style={{ background: "rgba(239,68,68,.15)", color: C.red, fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 20, marginTop: 3 }}>Urgent</div>}
                        {m.unread && !m.urgent && <div style={{ background: `rgba(8,145,178,.15)`, color: C.teal, fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 20, marginTop: 3 }}>New</div>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Today's appointments */}
                <div style={{ background: C.white, borderRadius: 16, padding: 22, border: `1px solid ${C.border}` }}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>📅 Today's Appointments</div>
                  {APPOINTMENTS.map((a, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: i < APPOINTMENTS.length - 1 ? `1px solid ${C.border}` : "none" }}>
                      <div style={{ width: 42, textAlign: "center", flexShrink: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>{a.time}</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{a.patient}</div>
                        <div style={{ fontSize: 11, color: C.slate }}>{a.type} · {a.optician}</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: a.confirmed ? "rgba(16,185,129,.12)" : "rgba(245,158,11,.12)", color: a.confirmed ? C.green : C.amber }}>
                          {a.confirmed ? "Confirmed" : "Pending"}
                        </span>
                        {a.note && <span style={{ fontSize: 9, color: C.teal, fontWeight: 600 }}>via Iryss</span>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Google rating snapshot */}
                <div style={{ background: C.navy, borderRadius: 16, padding: 22 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: C.white, marginBottom: 16 }}>⭐ Google Reviews</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 40, fontWeight: 800, color: C.white, lineHeight: 1 }}>4.9</div>
                      <div style={{ color: "#FBBC05", fontSize: 18, marginTop: 2 }}>★★★★★</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", marginTop: 4 }}>147 reviews</div>
                    </div>
                    <div style={{ marginLeft: "auto", textAlign: "right" }}>
                      <div style={{ fontSize: 28, fontWeight: 800, color: C.green }}>+38</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)" }}>this month</div>
                      <div style={{ fontSize: 11, color: C.tealLt, fontWeight: 600, marginTop: 4 }}>via Iryss ✓</div>
                    </div>
                  </div>
                  <button onClick={() => setNav("reviews")} style={{ width: "100%", background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 10, padding: "10px", color: C.white, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    View all reviews →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ═══ AT-RISK PATIENTS ═══ */}
          {nav === "patients" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
                <StatCard label="High risk" value={PATIENTS.filter(p => p.risk === "high").length} accent={`linear-gradient(90deg,${C.red},#F97316)`} />
                <StatCard label="Medium risk" value={PATIENTS.filter(p => p.risk === "medium").length} accent={`linear-gradient(90deg,${C.amber},#EAB308)`} />
                <StatCard label="Low risk" value={PATIENTS.filter(p => p.risk === "low").length} accent={`linear-gradient(90deg,${C.green},#34D399)`} />
                <StatCard label="Total revenue at risk" value={`£${PATIENTS.reduce((a, p) => a + (p.risk !== "low" ? p.revenue : 0), 0).toLocaleString()}`} accent={`linear-gradient(90deg,${C.teal},${C.tealLt})`} />
              </div>

              {/* Filter */}
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                {["all", "high", "medium", "low"].map(r => (
                  <button key={r} onClick={() => setFilterRisk(r)} style={{
                    padding: "7px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontFamily: "inherit",
                    background: filterRisk === r ? C.navy : C.white, color: filterRisk === r ? C.white : C.slate,
                    fontWeight: filterRisk === r ? 700 : 500, fontSize: 13, border: `1px solid ${filterRisk === r ? C.navy : C.border}`
                  }}>
                    {r === "all" ? "All patients" : r.charAt(0).toUpperCase() + r.slice(1) + " risk"}
                  </button>
                ))}
              </div>

              <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                {/* Header */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 130px 130px 120px 160px", gap: 12, padding: "12px 20px", borderBottom: `1px solid ${C.border}`, background: "#FAFBFC" }}>
                  {["Patient", "Last Visit", "Product", "Risk Score", "Action"].map(h => (
                    <div key={h} style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</div>
                  ))}
                </div>
                {filteredPatients.map((p, i) => (
                  <div key={p.id} style={{
                    display: "grid", gridTemplateColumns: "1fr 130px 130px 120px 160px", gap: 12, padding: "14px 20px",
                    borderBottom: i < filteredPatients.length - 1 ? `1px solid ${C.border}` : "none",
                    background: p.risk === "high" ? "rgba(239,68,68,.02)" : "transparent", alignItems: "center"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar initials={p.initials} bg={p.color === C.red ? "#EF4444" : p.color === C.amber ? "#F59E0B" : "#10B981"} size={32} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: C.slate }}>{p.phone}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: C.slate }}>{p.lastVisit}</div>
                    <div style={{ fontSize: 12, color: C.navy }}>{p.product}</div>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, background: riskBg[p.risk], color: riskFg[p.risk] }}>
                        {riskLabel[p.risk]}
                      </span>
                      <div style={{ fontSize: 10, color: C.slate, marginTop: 3 }}>Score: {p.riskScore}</div>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {waSent[p.id] ? (
                        <span style={{ fontSize: 12, color: C.green, fontWeight: 600 }}>✓ Sent</span>
                      ) : (
                        <button onClick={() => {
                          setShowSendWA(p);
                          setWaMsg(waTemplates[p.risk].replace("{name}", p.name.split(" ")[0]).replace("{product}", p.product));
                        }} style={{
                          background: C.teal, color: "#fff", border: "none", borderRadius: 8,
                          padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit"
                        }}>Send WhatsApp</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ INBOX ═══ */}
          {nav === "inbox" && (
            <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20, height: "calc(100vh - 160px)" }}>
              {/* Thread list */}
              <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "16px 16px 12px", borderBottom: `1px solid ${C.border}`, fontWeight: 700, fontSize: 14 }}>
                  Conversations <span style={{ background: C.red, color: "#fff", borderRadius: 20, fontSize: 10, fontWeight: 700, padding: "2px 7px", marginLeft: 6 }}>{unreadCount}</span>
                </div>
                <div style={{ overflow: "auto", flex: 1 }}>
                  {INBOX.map((m, i) => (
                    <div key={m.id} onClick={() => setSelectedThread(m)} style={{
                      display: "flex", gap: 10, padding: "12px 16px", cursor: "pointer", alignItems: "flex-start",
                      background: selectedThread?.id === m.id ? "rgba(8,145,178,.07)" : m.urgent ? "rgba(239,68,68,.04)" : "transparent",
                      borderBottom: `1px solid ${C.border}`, borderLeft: selectedThread?.id === m.id ? `3px solid ${C.teal}` : "3px solid transparent"
                    }}>
                      <Avatar initials={m.initials} bg={avatarColors[i % avatarColors.length]} size={36} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ fontWeight: m.unread ? 700 : 500, fontSize: 13 }}>{m.patient}</div>
                          <div style={{ fontSize: 10, color: C.slate, flexShrink: 0 }}>{m.time}</div>
                        </div>
                        <div style={{ fontSize: 11, color: C.slate, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2 }}>{m.preview}</div>
                        {m.urgent && <span style={{ display: "inline-block", marginTop: 4, background: "rgba(239,68,68,.15)", color: C.red, fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20 }}>🚨 Urgent</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Thread view */}
              {selectedThread ? (
                <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  {/* Thread header */}
                  <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
                    <Avatar initials={selectedThread.initials} bg={avatarColors[INBOX.indexOf(selectedThread) % avatarColors.length]} size={38} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{selectedThread.patient}</div>
                      {selectedThread.urgent && <span style={{ fontSize: 11, color: C.red, fontWeight: 600 }}>⚠ Urgent — requires human review</span>}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button style={{ background: "rgba(8,145,178,.1)", border: "none", borderRadius: 8, padding: "7px 14px", color: C.teal, fontWeight: 600, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                        View patient
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div style={{ flex: 1, overflow: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 10, background: "#F8FBFD" }}>
                    {selectedThread.urgent && (
                      <div style={{ background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.2)", borderRadius: 12, padding: "10px 14px", display: "flex", gap: 10, alignItems: "center" }}>
                        <span>🚨</span>
                        <div style={{ fontSize: 12, color: C.red, fontWeight: 600 }}>AI flagged this as urgent — patient may need a clinical callback today.</div>
                      </div>
                    )}
                    {selectedThread.thread.map((msg, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: msg.from === "practice" ? "flex-end" : "flex-start" }}>
                        <div style={{
                          maxWidth: "70%", background: msg.from === "practice" ? C.teal : C.white,
                          color: msg.from === "practice" ? "#fff" : C.navy,
                          borderRadius: msg.from === "practice" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                          padding: "10px 14px", fontSize: 13, lineHeight: 1.6,
                          border: msg.from === "patient" ? `1px solid ${C.border}` : "none",
                          boxShadow: "0 1px 4px rgba(0,0,0,.06)", whiteSpace: "pre-wrap"
                        }}>
                          {msg.from === "practice" && <div style={{ fontSize: 9, opacity: 0.7, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Bright Eyes · Iryss AI</div>}
                          {msg.text}
                          <div style={{ fontSize: 10, opacity: 0.55, textAlign: "right", marginTop: 4 }}>{msg.time}{msg.from === "practice" ? " ✓✓" : ""}</div>
                        </div>
                      </div>
                    ))}
                    <div ref={msgEndRef} />
                  </div>

                  {/* Reply bar */}
                  <div style={{ padding: 16, borderTop: `1px solid ${C.border}`, display: "flex", gap: 10, alignItems: "center" }}>
                    <input value={sendMsg} onChange={e => setSendMsg(e.target.value)}
                      placeholder="Type a reply…"
                      style={{ flex: 1, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", fontSize: 13, fontFamily: "inherit", outline: "none", background: C.cream }} />
                    <button onClick={() => setSendMsg("")} style={{
                      background: C.teal, color: "#fff", border: "none", borderRadius: 10,
                      padding: "10px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit"
                    }}>Send</button>
                  </div>
                </div>
              ) : (
                <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ color: C.slate, fontSize: 14 }}>Select a conversation</div>
                </div>
              )}
            </div>
          )}

          {/* ═══ REVENUE ═══ */}
          {nav === "revenue" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
                <StatCard label="Revenue at risk" value={`£${atRiskRevenue.toLocaleString()}`} sub="From high-risk patients" accent={`linear-gradient(90deg,${C.red},#F97316)`} />
                <StatCard label="Recovered this month" value={`£${recoveredRevenue.toLocaleString()}`} sub={`${recoveredCount} patients`} accent={`linear-gradient(90deg,${C.green},#34D399)`} />
                <StatCard label="Recovered YTD" value="£8,400" sub="Since April 2025" accent={`linear-gradient(90deg,${C.teal},${C.tealLt})`} />
                <StatCard label="ROI on Iryss this month" value="7.5×" sub="£1,650 recovered · £220 plan" accent={`linear-gradient(90deg,#8B5CF6,#A78BFA)`} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {/* Revenue breakdown */}
                <div style={{ background: C.white, borderRadius: 16, padding: 22, border: `1px solid ${C.border}` }}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Revenue by patient</div>
                  {PATIENTS.map((p, i) => (
                    <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < PATIENTS.length - 1 ? `1px solid ${C.border}` : "none" }}>
                      <Avatar initials={p.initials} bg={p.risk === "high" ? C.red : p.risk === "medium" ? C.amber : C.green} size={30} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: C.slate }}>{p.product}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: p.risk === "high" ? C.red : p.risk === "medium" ? C.amber : C.navy }}>£{p.revenue}</div>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 20, background: riskBg[p.risk], color: riskFg[p.risk] }}>{riskLabel[p.risk]}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ROI calculator */}
                <div style={{ background: C.navy, borderRadius: 16, padding: 22 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: C.white, marginBottom: 6 }}>Your Iryss ROI</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", marginBottom: 20 }}>Month of March 2026</div>
                  {[
                    { label: "Subscription cost", val: "£220", accent: "rgba(255,255,255,.1)", fgc: "rgba(255,255,255,.5)" },
                    { label: "Revenue recovered", val: `£${recoveredRevenue}`, accent: "rgba(16,185,129,.15)", fgc: "#6EE7B7" },
                    { label: "Net return", val: `£${recoveredRevenue - 220}`, accent: "rgba(8,145,178,.15)", fgc: C.tealLt },
                  ].map(item => (
                    <div key={item.label} style={{ background: item.accent, borderRadius: 10, padding: "14px 16px", marginBottom: 10 }}>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", textTransform: "uppercase", letterSpacing: 1 }}>{item.label}</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: item.fgc, marginTop: 4 }}>{item.val}</div>
                    </div>
                  ))}
                  <div style={{ background: "rgba(16,185,129,.12)", border: "1px solid rgba(16,185,129,.2)", borderRadius: 12, padding: 16, textAlign: "center", marginTop: 16 }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", textTransform: "uppercase", letterSpacing: 1 }}>This month's ROI</div>
                    <div style={{ fontSize: 36, fontWeight: 800, color: "#6EE7B7", marginTop: 4 }}>7.5×</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══ REVIEWS ═══ */}
          {nav === "reviews" && (
            <div>
              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
                <StatCard label="Google rating" value="4.9 ★" sub="All time" accent={`linear-gradient(90deg,#FBBC05,#F59E0B)`} />
                <StatCard label="Total reviews" value="147" sub="+38 this month" accent={`linear-gradient(90deg,${C.teal},${C.tealLt})`} />
                <StatCard label="Via Iryss this month" value="38" sub="Fully automatic" accent={`linear-gradient(90deg,${C.green},#34D399)`} />
                <StatCard label="Review requests sent" value="52" sub="73% response rate" accent={`linear-gradient(90deg,${C.purple},#A78BFA)`} />
              </div>

              {/* How it works */}
              <div style={{ background: C.white, borderRadius: 16, padding: 24, border: `1px solid ${C.border}`, marginBottom: 20 }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>How it works</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                  {[
                    { step: "1", title: "Appointment logged", desc: "Patient attends their appointment. Click 'Log appointment' to start the automation.", icon: "📅" },
                    { step: "2", title: "24hr WhatsApp check-in", desc: "Iryss sends a warm message asking how their visit went — in your practice's voice.", icon: "💬" },
                    { step: "3", title: "Review link sent", desc: "If they're happy, a direct link to your Google Business profile goes with the next message.", icon: "⭐" },
                  ].map(s => (
                    <div key={s.step} style={{ background: C.cream, borderRadius: 12, padding: 16, border: `1px solid ${C.border}` }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.navy, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, marginBottom: 10 }}>{s.step}</div>
                      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{s.title}</div>
                      <div style={{ fontSize: 12, color: C.slate, lineHeight: 1.6 }}>{s.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent reviews */}
              <div style={{ background: C.white, borderRadius: 16, padding: 22, border: `1px solid ${C.border}` }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Recent reviews via Iryss</div>
                {REVIEWS.map((r, i) => (
                  <div key={i} style={{ padding: "14px 0", borderBottom: i < REVIEWS.length - 1 ? `1px solid ${C.border}` : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <div style={{ color: "#FBBC05", fontSize: 14 }}>{"★".repeat(r.stars)}</div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{r.name}</div>
                      <div style={{ fontSize: 11, color: C.slate, marginLeft: "auto" }}>{r.days}</div>
                      {r.via && <span style={{ fontSize: 10, color: C.teal, fontWeight: 600, background: C.tealPale, padding: "2px 7px", borderRadius: 20 }}>via Iryss ✓</span>}
                    </div>
                    <div style={{ fontSize: 13, color: C.slate, lineHeight: 1.6, fontStyle: "italic" }}>"{r.text}"</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ APPOINTMENTS ═══ */}
          {nav === "appointments" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
                <StatCard label="Today's appointments" value={APPOINTMENTS.length} accent={`linear-gradient(90deg,${C.teal},${C.tealLt})`} />
                <StatCard label="Confirmed" value={APPOINTMENTS.filter(a => a.confirmed).length} accent={`linear-gradient(90deg,${C.green},#34D399)`} />
                <StatCard label="Booked via Iryss" value={APPOINTMENTS.filter(a => a.note).length} sub="WhatsApp bookings" accent={`linear-gradient(90deg,${C.purple},#A78BFA)`} />
              </div>

              <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 180px 160px 120px", gap: 12, padding: "12px 20px", borderBottom: `1px solid ${C.border}`, background: "#FAFBFC" }}>
                  {["Time", "Patient", "Type", "Optician", "Status"].map(h => (
                    <div key={h} style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</div>
                  ))}
                </div>
                {APPOINTMENTS.map((a, i) => (
                  <div key={i} style={{
                    display: "grid", gridTemplateColumns: "80px 1fr 180px 160px 120px", gap: 12,
                    padding: "14px 20px", borderBottom: i < APPOINTMENTS.length - 1 ? `1px solid ${C.border}` : "none", alignItems: "center"
                  }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: C.navy }}>{a.time}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{a.patient}</div>
                      {a.note && <span style={{ fontSize: 10, color: C.teal, fontWeight: 600, background: C.tealPale, padding: "1px 7px", borderRadius: 20 }}>via Iryss WhatsApp</span>}
                    </div>
                    <div style={{ fontSize: 13, color: C.slate }}>{a.type}</div>
                    <div style={{ fontSize: 13, color: C.navy }}>{a.optician}</div>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, background: a.confirmed ? "rgba(16,185,129,.12)" : "rgba(245,158,11,.12)", color: a.confirmed ? C.green : C.amber }}>
                      {a.confirmed ? "Confirmed" : "Unconfirmed"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Log appointment button */}
              <div style={{ marginTop: 20, background: C.navy, borderRadius: 16, padding: 22, display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: C.white }}>Log an appointment</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", marginTop: 4 }}>After logging, Iryss automatically sends a WhatsApp check-in after 24hrs and a Google review request if they're happy.</div>
                </div>
                <button style={{ background: C.teal, color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>
                  + Log appointment
                </button>
              </div>
            </div>
          )}

          {/* ═══ AI RECEPTIONIST ═══ */}
          {nav === "receptionist" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
                <StatCard label="Conversations handled" value="142" sub="This month" accent={`linear-gradient(90deg,${C.teal},${C.tealLt})`} />
                <StatCard label="Avg response time" value="&lt;2s" sub="24/7 availability" accent={`linear-gradient(90deg,${C.green},#34D399)`} />
                <StatCard label="Escalated to human" value="3" sub="This month" accent={`linear-gradient(90deg,${C.amber},#EAB308)`} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {/* Live demo */}
                <div style={{ background: C.navy, borderRadius: 16, overflow: "hidden" }}>
                  <div style={{ background: "rgba(255,255,255,.06)", padding: "10px 16px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid rgba(255,255,255,.06)" }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#EF4444" }} />
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#F59E0B" }} />
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10B981" }} />
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,.4)", marginLeft: 6 }}>AI Receptionist · Live Conversation</span>
                    <span style={{ marginLeft: "auto", fontSize: 10, color: "#6EE7B7", fontWeight: 600 }}>● Live</span>
                  </div>
                  <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      { from: "patient", name: "James Brew", text: "Hi, do you do multifocal contact lenses? I've been struggling with reading glasses on top of my monthlies" },
                      { from: "practice", text: "Hi James! Yes we do 😊 Multifocal contact lenses are brilliant for exactly that situation. We fit daily and monthly multifocals including Acuvue Oasys and CooperVision Biofinity Multifocal.\n\nIt'd be worth a fitting appointment so we can find the right lens for your prescription. Shall I check availability this week?" },
                      { from: "patient", name: "James Brew", text: "Yes please! What's the earliest?" },
                      { from: "practice", text: "I have Thursday 20th at 11am or Friday 21st at 3:30pm — which suits you better? 😊" },
                    ].map((msg, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: msg.from === "practice" ? "flex-end" : "flex-start" }}>
                        <div style={{
                          maxWidth: "75%", padding: "10px 14px", borderRadius: msg.from === "practice" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                          background: msg.from === "practice" ? "rgba(8,145,178,.25)" : "rgba(255,255,255,.07)",
                          border: `1px solid ${msg.from === "practice" ? "rgba(8,145,178,.3)" : "rgba(255,255,255,.08)"}`,
                          fontSize: 12, color: "rgba(255,255,255,.8)", lineHeight: 1.55, whiteSpace: "pre-wrap"
                        }}>
                          {msg.from === "practice" && <div style={{ fontSize: 9, color: C.tealLt, fontWeight: 700, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Iryss AI</div>}
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Knowledge + escalation */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ background: C.white, borderRadius: 16, padding: 20, border: `1px solid ${C.border}` }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>🎓 What the AI knows</div>
                    {[
                      "Glasses · frames · varifocals · progressives",
                      "Contact lenses (daily, monthly, multifocal, toric)",
                      "Eye conditions — dry eye, myopia, presbyopia",
                      "Appointment booking & availability",
                      "NHS vs private options & pricing",
                      "Children's eye health & myopia management",
                      "Opening hours, location, parking",
                    ].map((item, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", padding: "6px 0", borderBottom: i < 6 ? `1px solid ${C.border}` : "none" }}>
                        <span style={{ color: C.green, fontSize: 13 }}>✓</span>
                        <span style={{ fontSize: 13, color: C.slate }}>{item}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: "rgba(239,68,68,.05)", borderRadius: 16, padding: 20, border: "1px solid rgba(239,68,68,.12)" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8, color: C.navy }}>🚨 Escalation triggers</div>
                    <div style={{ fontSize: 13, color: C.slate, lineHeight: 1.7 }}>
                      When a patient mentions <strong>sudden vision loss</strong>, <strong>eye pain</strong>, <strong>flashes or floaters</strong>, or any urgent symptom — Iryss immediately alerts your team and pauses the AI response, so a clinician can take over.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── WhatsApp send modal ── */}
      {showSendWA && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10,22,40,.85)", zIndex: 900, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setShowSendWA(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: C.white, borderRadius: 20, padding: 28, width: 520, boxShadow: "0 40px 120px rgba(0,0,0,.3)" }}>
            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>Send WhatsApp to {showSendWA.name}</div>
            <div style={{ fontSize: 12, color: C.slate, marginBottom: 16 }}>Risk level: <span style={{ color: showSendWA.risk === "high" ? C.red : showSendWA.risk === "medium" ? C.amber : C.green, fontWeight: 700 }}>{riskLabel[showSendWA.risk]}</span> · Last visit: {showSendWA.lastVisit}</div>
            <textarea value={waMsg} onChange={e => setWaMsg(e.target.value)}
              style={{ width: "100%", height: 180, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, fontSize: 13, fontFamily: "inherit", resize: "none", outline: "none", boxSizing: "border-box", lineHeight: 1.65 }} />
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button onClick={() => setShowSendWA(null)} style={{ flex: 1, background: C.cream, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12, fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit", color: C.navy }}>Cancel</button>
              <button onClick={() => sendWhatsApp(showSendWA.id)} style={{ flex: 2, background: C.teal, border: "none", borderRadius: 10, padding: 12, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit", color: "#fff" }}>
                Send WhatsApp ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
