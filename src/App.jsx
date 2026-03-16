import { useState, useRef } from "react";

const C = {
  navy:"#0A1628", teal:"#0891B2", tealLt:"#06B6D4", tealPale:"#E0F7FA",
  cream:"#F8FBFD", border:"#E2E8F0", slate:"#64748B", white:"#FFFFFF",
  red:"#EF4444", amber:"#F59E0B", green:"#10B981", purple:"#8B5CF6",
};

const PATIENTS = [
  { id:"P-001", name:"Sarah O'Neill",   initials:"SO",  phone:"+447827001001", lastVisit:"14 months ago", product:"Varifocals",               risk:"high",   riskScore:92, revenue:320, status:"pending"   },
  { id:"P-002", name:"Tom Bradley",     initials:"TB",  phone:"+447827001002", lastVisit:"9 months ago",  product:"Monthly Contact Lenses",    risk:"medium", riskScore:61, revenue:185, status:"sent"      },
  { id:"P-003", name:"Margaret Flynn",  initials:"MF",  phone:"+447827001003", lastVisit:"11 months ago", product:"Glasses + Contact Lenses",  risk:"high",   riskScore:88, revenue:410, status:"alert"     },
  { id:"P-004", name:"Ciara Murphy",    initials:"CM",  phone:"+447827001004", lastVisit:"4 months ago",  product:"Glasses",                   risk:"low",    riskScore:24, revenue:240, status:"checkin"   },
  { id:"P-005", name:"James Brew",      initials:"JB",  phone:"+447827001005", lastVisit:"7 months ago",  product:"Daily Contact Lenses",      risk:"medium", riskScore:54, revenue:160, status:"booked"    },
  { id:"P-006", name:"Sarah Flynn",     initials:"SF",  phone:"+447827001006", lastVisit:"3 months ago",  product:"Varifocals",                risk:"low",    riskScore:18, revenue:380, status:"booked"    },
  { id:"P-007", name:"Shona Everden",   initials:"SE",  phone:"+447711552094", lastVisit:"13 months ago", product:"Progressive Lenses",        risk:"high",   riskScore:79, revenue:295, status:"pending"   },
  { id:"P-008", name:"Jessica Bayman",  initials:"JB2", phone:"+447572043380", lastVisit:"5 months ago",  product:"Monthly CL + Glasses",      risk:"low",    riskScore:31, revenue:220, status:"recovered" },
];

const INBOX = [
  { id:1, patient:"Margaret Flynn", initials:"MF", preview:"I've been having some issues with my vision…", time:"2m ago", unread:true, urgent:true, thread:[
    { from:"practice", text:"Hi Margaret 👋 It's been a while since your last visit — we wanted to check in and see how you're getting on with your glasses. Bright Eyes Opticians 😊", time:"09:05" },
    { from:"patient",  text:"Hi, yes actually I've been having some issues with my vision lately, things seem a bit blurry on the left side", time:"09:18", urgent:true },
  ]},
  { id:2, patient:"Tom Bradley", initials:"TB", preview:"Wednesday 2pm works perfectly, thank you!", time:"14m ago", unread:true, urgent:false, thread:[
    { from:"practice", text:"Hi Tom 👋 Just checking in — it's been 9 months since your last contact lens check. Ready to book in? 😊", time:"09:05" },
    { from:"patient",  text:"Hi! Yes, I was meaning to get in touch actually. Do you have anything next week?", time:"09:31" },
    { from:"practice", text:"Of course! I have Wednesday 18th at 2pm or Thursday 19th at 11am — which works best for you? 😊", time:"09:31" },
    { from:"patient",  text:"Wednesday 2pm works perfectly, thank you!", time:"09:46" },
    { from:"practice", text:"Brilliant! Wednesday 18th at 2pm is confirmed for you Tom. See you then! 😊", time:"09:46" },
  ]},
  { id:3, patient:"James Brew", initials:"JB", preview:"Do you do multifocal contact lenses?", time:"1h ago", unread:false, urgent:false, thread:[
    { from:"patient",  text:"Hi, do you do multifocal contact lenses? I've been struggling with reading glasses on top of my monthlies", time:"14:32" },
    { from:"practice", text:"Hi James! Yes we do 😊 Multifocal contact lenses are brilliant for exactly that. We fit daily and monthly multifocals including Acuvue Oasys and CooperVision Biofinity Multifocal.\n\nIt'd be worth a fitting appointment to find the right lens. Shall I check availability?", time:"14:32" },
    { from:"patient",  text:"Yes please! Friday would be best for me", time:"14:45" },
    { from:"practice", text:"I have Friday 21st at 3:30pm — does that work? 😊", time:"14:45" },
    { from:"patient",  text:"Friday 3:30 works perfectly!", time:"15:02" },
  ]},
  { id:4, patient:"Ciara Murphy", initials:"CM", preview:"Thanks so much, see you Thursday!", time:"3h ago", unread:false, urgent:false, thread:[
    { from:"practice", text:"Hi Ciara! Hope you're well. We just wanted to check in — you haven't needed any new glasses or lenses recently so all good, but we're here whenever you need us 😊", time:"11:00" },
    { from:"patient",  text:"Thanks so much! I'm due an eye test soon actually, I'll call to book in", time:"11:15" },
    { from:"practice", text:"Wonderful! See you soon Ciara 😊", time:"11:15" },
    { from:"patient",  text:"Thanks so much, see you Thursday!", time:"13:20" },
  ]},
  { id:5, patient:"Sarah Flynn", initials:"SF", preview:"Wednesday at 2pm confirmed ✓", time:"Yesterday", unread:false, urgent:false, thread:[
    { from:"practice", text:"Hi Sarah 👋 Just a reminder your appointment is tomorrow, Wednesday 18th at 2pm. See you then! 😊", time:"09:00" },
    { from:"patient",  text:"Wednesday at 2pm confirmed ✓ See you then!", time:"09:47" },
  ]},
];

const REVIEWS = [
  { name:"Sarah M.",    stars:5, text:"Got a lovely WhatsApp the day after my appointment — such a personal touch. Couldn't not leave a review!", days:"1 day ago",   via:true  },
  { name:"Claire D.",   stars:5, text:"They followed up after my kids' appointment to check we were happy. Brilliant practice.",                  days:"3 days ago",  via:true  },
  { name:"Tom B.",      stars:5, text:"New glasses are perfect. The WhatsApp check-in was a really nice touch — felt genuinely cared for.",       days:"1 week ago",  via:true  },
  { name:"Patricia R.", stars:5, text:"Fantastic service from start to finish. Was surprised to get a message checking in afterwards!",            days:"2 weeks ago", via:false },
];

const APPOINTMENTS = [
  { patient:"Emma Wilson",    type:"Eye Test",              time:"09:00", optician:"Dr. Patel", confirmed:true,  viaIryss:false },
  { patient:"Tom Bradley",    type:"Contact Lens Fitting",  time:"10:30", optician:"Dr. Chen",  confirmed:true,  viaIryss:true  },
  { patient:"Priya Sharma",   type:"Glasses Collection",    time:"11:15", optician:"Dr. Patel", confirmed:true,  viaIryss:false },
  { patient:"James Brew",     type:"Multifocal CL Trial",   time:"15:30", optician:"Dr. Chen",  confirmed:true,  viaIryss:true  },
  { patient:"Carol Mitchell", type:"Follow-Up",             time:"17:00", optician:"Dr. Patel", confirmed:false, viaIryss:false },
];

const riskLabel = { high:"HIGH", medium:"MEDIUM", low:"LOW" };
const riskBg    = { high:"rgba(239,68,68,.15)", medium:"rgba(245,158,11,.15)", low:"rgba(16,185,129,.15)" };
const riskFg    = { high:"#FCA5A5", medium:"#FCD34D", low:"#6EE7B7" };

const avatarColors = ["#0891B2","#8B5CF6","#F59E0B","#10B981","#EF4444","#EC4899","#6366F1","#14B8A6"];
const getColor = i => avatarColors[i % avatarColors.length];

function Avatar({ initials, bg=C.teal, size=36 }) {
  return <div style={{ width:size, height:size, borderRadius:"50%", background:bg, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:size*0.35, color:"#fff", flexShrink:0, fontFamily:"inherit" }}>{initials}</div>;
}

// ── Drilldown slide-in panel ─────────────────────────────────────────
function DrillPanel({ title, sub, onClose, children, onFullPage }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(10,22,40,.65)", zIndex:900, display:"flex", alignItems:"flex-start", justifyContent:"flex-end" }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ width:540, height:"100vh", background:C.white, boxShadow:"-20px 0 60px rgba(0,0,0,.25)", overflow:"auto", padding:32, display:"flex", flexDirection:"column" }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24 }}>
          <div>
            <div style={{ fontSize:18, fontWeight:800, color:C.navy }}>{title}</div>
            {sub && <div style={{ fontSize:12, color:C.slate, marginTop:3 }}>{sub}</div>}
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:24, cursor:"pointer", color:C.slate, lineHeight:1 }}>×</button>
        </div>
        <div style={{ flex:1 }}>{children}</div>
        {onFullPage && (
          <button onClick={onFullPage} style={{ width:"100%", marginTop:20, background:C.navy, color:"#fff", border:"none", borderRadius:12, padding:14, fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>
            View full page →
          </button>
        )}
      </div>
    </div>
  );
}

function PatientRow({ p, i, total, showWA, waSent, onSendWA }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:i<total-1?`1px solid ${C.border}`:"none" }}>
      <Avatar initials={p.initials} bg={p.risk==="high"?C.red:p.risk==="medium"?C.amber:C.green} size={38} />
      <div style={{ flex:1 }}>
        <div style={{ fontWeight:600, fontSize:14 }}>{p.name}</div>
        <div style={{ fontSize:12, color:C.slate, marginTop:2 }}>{p.product} · Last visit {p.lastVisit}</div>
      </div>
      <div style={{ textAlign:"right", display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
        <span style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20, background:riskBg[p.risk], color:riskFg[p.risk] }}>{riskLabel[p.risk]}</span>
        <span style={{ fontSize:12, fontWeight:700, color:C.navy }}>£{p.revenue}</span>
        {showWA && (waSent[p.id]
          ? <span style={{ fontSize:11, color:C.green, fontWeight:600 }}>Sent ✓</span>
          : <button onClick={()=>onSendWA(p)} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:7, padding:"4px 10px", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Send WhatsApp</button>
        )}
      </div>
    </div>
  );
}

// ── Login Screen ─────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  function handleLogin() {
    setError("");
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin({ email }); }, 900);
  }
  return (
    <div style={{ minHeight:"100vh", background:"#0A1628", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',system-ui,sans-serif", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:"20%", left:"50%", transform:"translateX(-50%)", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle, rgba(8,145,178,.15) 0%, transparent 70%)", pointerEvents:"none" }} />
      <div style={{ width:"100%", maxWidth:420, padding:"0 24px", position:"relative", zIndex:1 }}>
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{ fontSize:36, fontWeight:800, color:"#fff", letterSpacing:-1 }}><span style={{ color:"#06B6D4" }}>iryss</span></div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,.35)", marginTop:6, letterSpacing:2, textTransform:"uppercase" }}>Patient Retention Platform</div>
        </div>
        <div style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:20, padding:36 }}>
          <div style={{ fontSize:20, fontWeight:700, color:"#fff", marginBottom:6 }}>Welcome back</div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,.4)", marginBottom:28 }}>Sign in to your practice dashboard</div>
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,.5)", textTransform:"uppercase", letterSpacing:1, display:"block", marginBottom:8 }}>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder="you@yourpractice.com"
              style={{ width:"100%", background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", borderRadius:10, padding:"12px 14px", fontSize:14, color:"#fff", fontFamily:"inherit", outline:"none", boxSizing:"border-box" }} />
          </div>
          <div style={{ marginBottom:24 }}>
            <label style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,.5)", textTransform:"uppercase", letterSpacing:1, display:"block", marginBottom:8 }}>Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder="••••••••"
              style={{ width:"100%", background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", borderRadius:10, padding:"12px 14px", fontSize:14, color:"#fff", fontFamily:"inherit", outline:"none", boxSizing:"border-box" }} />
          </div>
          {error && <div style={{ background:"rgba(239,68,68,.1)", border:"1px solid rgba(239,68,68,.2)", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#FCA5A5", marginBottom:16 }}>{error}</div>}
          <button onClick={handleLogin} disabled={loading} style={{ width:"100%", background:loading?"rgba(8,145,178,.5)":"#0891B2", border:"none", borderRadius:10, padding:13, fontSize:15, fontWeight:700, color:"#fff", cursor:loading?"default":"pointer", fontFamily:"inherit" }}>
            {loading?"Signing in…":"Sign in →"}
          </button>
          <div style={{ textAlign:"center", marginTop:20, fontSize:12, color:"rgba(255,255,255,.25)" }}>
            Forgot your password? <span style={{ color:"#06B6D4", cursor:"pointer" }}>Contact support</span>
          </div>
        </div>
        <div style={{ textAlign:"center", marginTop:24, fontSize:11, color:"rgba(255,255,255,.2)" }}>GDPR compliant · EU data servers · Built in Belfast</div>
      </div>
    </div>
  );
}

// ── Root ─────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  if (!user) return <LoginScreen onLogin={setUser} />;
  return <Dashboard />;
}

// ── Main Dashboard ───────────────────────────────────────────────────
function Dashboard() {
  const [nav, setNav]               = useState("dashboard");
  const [drill, setDrill]           = useState(null);
  const [filterRisk, setFilterRisk] = useState("all");
  const [selectedThread, setSelectedThread] = useState(INBOX[0]);
  const [sendMsg, setSendMsg]       = useState("");
  const [showSendWA, setShowSendWA] = useState(null);
  const [waMsg, setWaMsg]           = useState("");
  const [waSent, setWaSent]         = useState({});
  const msgEndRef = useRef(null);

  const highRisk       = PATIENTS.filter(p=>p.risk==="high");
  const medRisk        = PATIENTS.filter(p=>p.risk==="medium");
  const lowRisk        = PATIENTS.filter(p=>p.risk==="low");
  const recovered      = PATIENTS.filter(p=>p.status==="recovered"||p.status==="booked");
  const atRiskRevenue  = PATIENTS.filter(p=>p.risk!=="low").reduce((a,p)=>a+p.revenue,0);
  const recoveredRev   = recovered.reduce((a,p)=>a+p.revenue,0);
  const unreadCount    = INBOX.filter(i=>i.unread).length;
  const urgentCount    = INBOX.filter(i=>i.urgent).length;
  const filteredPts    = filterRisk==="all"?PATIENTS:PATIENTS.filter(p=>p.risk===filterRisk);

  const waTemplates = {
    high:   `Hi {name} 👋\n\nWe've been thinking about you and just wanted to check in. It's been a while since your last visit — whenever you're ready, we'd love to welcome you back.\n\nJust reply here and we'll sort everything 😊\n\nBright Eyes Opticians`,
    medium: `Hi {name} 👋\n\nIt's the team at Bright Eyes! It's been a little while — we just wanted to make sure everything is still going well with your {product}.\n\nDo get in touch if you have any questions at all 😊`,
    low:    `Hi {name} 👋\n\nHope you're well! Just a quick friendly check-in from Bright Eyes. We're here whenever you need us 😊`,
  };

  function openSendWA(p) {
    setShowSendWA(p);
    setWaMsg(waTemplates[p.risk].replace("{name}",p.name.split(" ")[0]).replace("{product}",p.product));
  }
  function confirmSendWA(pid) { setWaSent(prev=>({...prev,[pid]:true})); setShowSendWA(null); setWaMsg(""); }
  function goNav(id) { setDrill(null); setNav(id); }

  // ── Stat card (clickable) ──
  function SC({ label, value, sub, accent, onDrill }) {
    return (
      <div onClick={onDrill} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"20px 22px", cursor:onDrill?"pointer":"default", transition:"all .2s", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}
        onMouseEnter={e=>{ if(onDrill) e.currentTarget.style.boxShadow=`0 0 0 2px ${C.teal}40`; }}
        onMouseLeave={e=>{ e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,.04)"; }}>
        <div style={{ width:"100%", height:3, background:accent, borderRadius:2, marginBottom:12 }} />
        <div style={{ fontSize:26, fontWeight:800, color:C.navy, letterSpacing:-1 }}>{value}</div>
        <div style={{ fontSize:12, color:C.slate, marginTop:3 }}>{label}</div>
        {sub && <div style={{ fontSize:11, color:C.teal, marginTop:4, fontWeight:600 }}>{sub}</div>}
        {onDrill && <div style={{ fontSize:10, color:C.slate, marginTop:6, opacity:0.6 }}>Click to see breakdown ↗</div>}
      </div>
    );
  }

  return (
    <div style={{ display:"flex", height:"100vh", fontFamily:"'DM Sans','Outfit',system-ui,sans-serif", background:"#F0F4F8", color:C.navy, overflow:"hidden" }}>

      {/* ── Sidebar ── */}
      <div style={{ width:230, background:C.navy, display:"flex", flexDirection:"column", flexShrink:0, padding:"0 12px 12px" }}>
        <div style={{ padding:"22px 6px 20px", borderBottom:"1px solid rgba(255,255,255,.08)", marginBottom:12 }}>
          <div style={{ fontSize:22, fontWeight:800, color:C.white, letterSpacing:-0.5 }}><span style={{ color:C.tealLt }}>iryss</span></div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,.35)", marginTop:2, letterSpacing:1 }}>BRIGHT EYES OPTICIANS</div>
        </div>
        <nav style={{ display:"flex", flexDirection:"column", gap:3, flex:1 }}>
          {[
            { id:"dashboard",    label:"Dashboard",       icon:"⬡"  },
            { id:"patients",     label:"At-Risk Patients",icon:"🎯", badge:highRisk.length },
            { id:"inbox",        label:"Inbox",           icon:"💬", badge:unreadCount },
            { id:"revenue",      label:"Revenue",         icon:"£"  },
            { id:"reviews",      label:"Google Reviews",  icon:"⭐" },
            { id:"appointments", label:"Appointments",    icon:"📅" },
            { id:"receptionist", label:"AI Receptionist", icon:"🤖" },
          ].map(item=>(
            <button key={item.id} onClick={()=>goNav(item.id)} style={{
              display:"flex", alignItems:"center", gap:10, width:"100%", padding:"10px 14px", border:"none",
              background:nav===item.id?"rgba(8,145,178,.2)":"transparent", borderRadius:10, cursor:"pointer",
              color:nav===item.id?C.tealLt:"rgba(255,255,255,.55)",
              fontWeight:nav===item.id?700:400, fontSize:14, fontFamily:"inherit", textAlign:"left",
              borderLeft:nav===item.id?`3px solid ${C.teal}`:"3px solid transparent", transition:"all .15s"
            }}>
              <span style={{ fontSize:16, width:20, textAlign:"center" }}>{item.icon}</span>
              <span style={{ flex:1 }}>{item.label}</span>
              {item.badge>0 && <span style={{ background:C.red, color:"#fff", borderRadius:20, fontSize:10, fontWeight:700, padding:"2px 7px" }}>{item.badge}</span>}
            </button>
          ))}
        </nav>
        <div style={{ borderTop:"1px solid rgba(255,255,255,.08)", paddingTop:12, marginTop:8 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 14px" }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:C.green }} />
            <span style={{ fontSize:12, color:"rgba(255,255,255,.45)" }}>All systems live</span>
          </div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,.25)", padding:"0 14px" }}>Next scoring: 02:00 tonight</div>
        </div>
      </div>

      {/* ── Main ── */}
      <div style={{ flex:1, overflow:"auto", display:"flex", flexDirection:"column" }}>

        {/* Topbar */}
        <div style={{ background:C.white, borderBottom:`1px solid ${C.border}`, padding:"14px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <div>
            <div style={{ fontSize:18, fontWeight:700, color:C.navy }}>
              {nav==="dashboard"&&"Good morning 👋"}{nav==="patients"&&"At-Risk Patients"}
              {nav==="inbox"&&"WhatsApp Inbox"}{nav==="revenue"&&"Revenue Dashboard"}
              {nav==="reviews"&&"Google Reviews"}{nav==="appointments"&&"Today's Appointments"}
              {nav==="receptionist"&&"AI Receptionist"}
            </div>
            <div style={{ fontSize:12, color:C.slate, marginTop:2 }}>Tuesday, 10 March 2026</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {urgentCount>0&&(
              <div onClick={()=>goNav("inbox")} style={{ background:"rgba(239,68,68,.1)", border:"1px solid rgba(239,68,68,.2)", borderRadius:10, padding:"6px 12px", cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ fontSize:14 }}>🚨</span>
                <span style={{ fontSize:12, fontWeight:700, color:C.red }}>{urgentCount} urgent alert{urgentCount>1?"s":""}</span>
              </div>
            )}
            <Avatar initials="BE" bg={C.teal} size={34} />
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflow:"auto", padding:28 }}>

          {/* ═══ DASHBOARD ═══ */}
          {nav==="dashboard"&&(
            <div>
              {INBOX.filter(i=>i.urgent).map(alert=>(
                <div key={alert.id} onClick={()=>{ setSelectedThread(alert); goNav("inbox"); }}
                  style={{ background:"rgba(239,68,68,.06)", border:"1px solid rgba(239,68,68,.2)", borderRadius:14, padding:"14px 18px", marginBottom:20, display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}>
                  <span style={{ fontSize:22 }}>🚨</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, color:C.red, fontSize:14 }}>Urgent — {alert.patient}</div>
                    <div style={{ fontSize:13, color:C.slate, marginTop:2 }}>{alert.preview} — <span style={{ color:C.teal }}>View conversation →</span></div>
                  </div>
                  <div style={{ fontSize:11, color:C.slate }}>{alert.time}</div>
                </div>
              ))}

              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:28 }}>
                <SC label="Patients at risk"    value={highRisk.length}          sub={`${medRisk.length} medium · ${lowRisk.length} low`} accent={`linear-gradient(90deg,${C.red},#F97316)`}    onDrill={()=>setDrill("at-risk")} />
                <SC label="Revenue at risk"     value={`£${atRiskRevenue.toLocaleString()}`} sub="This month"    accent={`linear-gradient(90deg,${C.amber},#EAB308)`}  onDrill={()=>setDrill("rev-risk")} />
                <SC label="Patients recovered"  value={recovered.length}         sub="This month"    accent={`linear-gradient(90deg,${C.green},#34D399)`}  onDrill={()=>setDrill("recovered")} />
                <SC label="Revenue recovered"   value={`£${recoveredRev.toLocaleString()}`} sub="↑ This month"  accent={`linear-gradient(90deg,${C.teal},${C.tealLt})`} onDrill={()=>setDrill("rev-recovered")} />
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
                {/* High-risk list */}
                <div style={{ background:C.white, borderRadius:16, padding:22, border:`1px solid ${C.border}` }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
                    <div style={{ fontWeight:700, fontSize:15 }}>🎯 High-Risk Patients</div>
                    <button onClick={()=>goNav("patients")} style={{ background:"none", border:"none", color:C.teal, fontSize:12, cursor:"pointer", fontWeight:600, fontFamily:"inherit" }}>View all →</button>
                  </div>
                  {highRisk.map((p,i)=>(
                    <div key={p.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:i<highRisk.length-1?`1px solid ${C.border}`:"none" }}>
                      <Avatar initials={p.initials} bg={C.red} size={36} />
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:600, fontSize:13 }}>{p.name}</div>
                        <div style={{ fontSize:11, color:C.slate }}>{p.lastVisit} · {p.product}</div>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:20, background:riskBg.high, color:riskFg.high }}>HIGH</span>
                        {!waSent[p.id]
                          ? <button onClick={()=>openSendWA(p)} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:8, padding:"5px 10px", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Send WhatsApp</button>
                          : <span style={{ fontSize:11, color:C.green, fontWeight:600 }}>Sent ✓</span>
                        }
                      </div>
                    </div>
                  ))}
                </div>

                {/* Inbox preview */}
                <div style={{ background:C.white, borderRadius:16, padding:22, border:`1px solid ${C.border}` }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
                    <div style={{ fontWeight:700, fontSize:15 }}>💬 Recent Inbox</div>
                    <button onClick={()=>goNav("inbox")} style={{ background:"none", border:"none", color:C.teal, fontSize:12, cursor:"pointer", fontWeight:600, fontFamily:"inherit" }}>View all →</button>
                  </div>
                  {INBOX.slice(0,4).map((m,i)=>(
                    <div key={m.id} onClick={()=>{ setSelectedThread(m); goNav("inbox"); }}
                      style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:i<3?`1px solid ${C.border}`:"none", cursor:"pointer" }}>
                      <Avatar initials={m.initials} bg={getColor(i)} size={36} />
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:m.unread?700:500, fontSize:13 }}>{m.patient}</div>
                        <div style={{ fontSize:11, color:C.slate, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.preview}</div>
                      </div>
                      <div style={{ flexShrink:0, textAlign:"right" }}>
                        <div style={{ fontSize:10, color:C.slate }}>{m.time}</div>
                        {m.urgent&&<div style={{ background:"rgba(239,68,68,.15)", color:C.red, fontSize:10, fontWeight:700, padding:"2px 6px", borderRadius:20, marginTop:3 }}>Urgent</div>}
                        {m.unread&&!m.urgent&&<div style={{ background:`rgba(8,145,178,.15)`, color:C.teal, fontSize:10, fontWeight:700, padding:"2px 6px", borderRadius:20, marginTop:3 }}>New</div>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Appointments */}
                <div style={{ background:C.white, borderRadius:16, padding:22, border:`1px solid ${C.border}` }}>
                  <div style={{ fontWeight:700, fontSize:15, marginBottom:16 }}>📅 Today's Appointments</div>
                  {APPOINTMENTS.map((a,i)=>(
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"9px 0", borderBottom:i<APPOINTMENTS.length-1?`1px solid ${C.border}`:"none" }}>
                      <div style={{ width:42, textAlign:"center", flexShrink:0 }}>
                        <div style={{ fontSize:12, fontWeight:700, color:C.navy }}>{a.time}</div>
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:600 }}>{a.patient}</div>
                        <div style={{ fontSize:11, color:C.slate }}>{a.type} · {a.optician}</div>
                      </div>
                      <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, background:a.confirmed?"rgba(16,185,129,.12)":"rgba(245,158,11,.12)", color:a.confirmed?C.green:C.amber }}>
                        {a.confirmed?"Confirmed":"Pending"}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Google rating */}
                <div style={{ background:C.navy, borderRadius:16, padding:22 }}>
                  <div style={{ fontWeight:700, fontSize:15, color:C.white, marginBottom:16 }}>⭐ Google Reviews</div>
                  <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:16 }}>
                    <div>
                      <div style={{ fontSize:40, fontWeight:800, color:C.white, lineHeight:1 }}>4.9</div>
                      <div style={{ color:"#FBBC05", fontSize:18, marginTop:2 }}>★★★★★</div>
                      <div style={{ fontSize:11, color:"rgba(255,255,255,.4)", marginTop:4 }}>147 reviews</div>
                    </div>
                    <div style={{ marginLeft:"auto", textAlign:"right" }}>
                      <div style={{ fontSize:28, fontWeight:800, color:C.green }}>+38</div>
                      <div style={{ fontSize:11, color:"rgba(255,255,255,.4)" }}>this month</div>
                      <div style={{ fontSize:11, color:C.tealLt, fontWeight:600, marginTop:4 }}>via Iryss ✓</div>
                    </div>
                  </div>
                  <button onClick={()=>goNav("reviews")} style={{ width:"100%", background:"rgba(255,255,255,.08)", border:"1px solid rgba(255,255,255,.12)", borderRadius:10, padding:10, color:C.white, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
                    View all reviews →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ═══ AT-RISK PATIENTS ═══ */}
          {nav==="patients"&&(
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
                <SC label="High risk"             value={highRisk.length}    accent={`linear-gradient(90deg,${C.red},#F97316)`}    onDrill={()=>setDrill("high-risk")} />
                <SC label="Medium risk"           value={medRisk.length}     accent={`linear-gradient(90deg,${C.amber},#EAB308)`}  onDrill={()=>setDrill("med-risk")} />
                <SC label="Low risk"              value={lowRisk.length}     accent={`linear-gradient(90deg,${C.green},#34D399)`}  onDrill={()=>setDrill("low-risk")} />
                <SC label="Total revenue at risk" value={`£${atRiskRevenue.toLocaleString()}`} accent={`linear-gradient(90deg,${C.teal},${C.tealLt})`} onDrill={()=>setDrill("rev-risk")} />
              </div>
              <div style={{ display:"flex", gap:8, marginBottom:20 }}>
                {["all","high","medium","low"].map(r=>(
                  <button key={r} onClick={()=>setFilterRisk(r)} style={{
                    padding:"7px 16px", borderRadius:20, cursor:"pointer", fontFamily:"inherit",
                    background:filterRisk===r?C.navy:C.white, color:filterRisk===r?C.white:C.slate,
                    fontWeight:filterRisk===r?700:500, fontSize:13,
                    border:`1px solid ${filterRisk===r?C.navy:C.border}`
                  }}>
                    {r==="all"?"All patients":r.charAt(0).toUpperCase()+r.slice(1)+" risk"}
                  </button>
                ))}
              </div>
              <div style={{ background:C.white, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 130px 130px 120px 160px", gap:12, padding:"12px 20px", borderBottom:`1px solid ${C.border}`, background:"#FAFBFC" }}>
                  {["Patient","Last Visit","Product","Risk Score","Action"].map(h=>(
                    <div key={h} style={{ fontSize:11, fontWeight:700, color:C.slate, textTransform:"uppercase", letterSpacing:0.5 }}>{h}</div>
                  ))}
                </div>
                {filteredPts.map((p,i)=>(
                  <div key={p.id} style={{ display:"grid", gridTemplateColumns:"1fr 130px 130px 120px 160px", gap:12, padding:"14px 20px", borderBottom:i<filteredPts.length-1?`1px solid ${C.border}`:"none", alignItems:"center" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <Avatar initials={p.initials} bg={p.risk==="high"?C.red:p.risk==="medium"?C.amber:C.green} size={32} />
                      <div>
                        <div style={{ fontWeight:600, fontSize:13 }}>{p.name}</div>
                        <div style={{ fontSize:11, color:C.slate }}>{p.phone}</div>
                      </div>
                    </div>
                    <div style={{ fontSize:13, color:C.slate }}>{p.lastVisit}</div>
                    <div style={{ fontSize:12, color:C.navy }}>{p.product}</div>
                    <div>
                      <span style={{ fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:20, background:riskBg[p.risk], color:riskFg[p.risk] }}>{riskLabel[p.risk]}</span>
                      <div style={{ fontSize:10, color:C.slate, marginTop:3 }}>Score: {p.riskScore}</div>
                    </div>
                    <div>
                      {waSent[p.id]
                        ? <span style={{ fontSize:12, color:C.green, fontWeight:600 }}>✓ Sent</span>
                        : <button onClick={()=>openSendWA(p)} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:8, padding:"6px 12px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Send WhatsApp</button>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ INBOX ═══ */}
          {nav==="inbox"&&(
            <div style={{ display:"grid", gridTemplateColumns:"300px 1fr", gap:20, height:"calc(100vh - 160px)" }}>
              <div style={{ background:C.white, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden", display:"flex", flexDirection:"column" }}>
                <div style={{ padding:"16px 16px 12px", borderBottom:`1px solid ${C.border}`, fontWeight:700, fontSize:14 }}>
                  Conversations <span style={{ background:C.red, color:"#fff", borderRadius:20, fontSize:10, fontWeight:700, padding:"2px 7px", marginLeft:6 }}>{unreadCount}</span>
                </div>
                <div style={{ overflow:"auto", flex:1 }}>
                  {INBOX.map((m,i)=>(
                    <div key={m.id} onClick={()=>setSelectedThread(m)} style={{
                      display:"flex", gap:10, padding:"12px 16px", cursor:"pointer", alignItems:"flex-start",
                      background:selectedThread?.id===m.id?"rgba(8,145,178,.07)":m.urgent?"rgba(239,68,68,.04)":"transparent",
                      borderBottom:`1px solid ${C.border}`, borderLeft:selectedThread?.id===m.id?`3px solid ${C.teal}`:"3px solid transparent"
                    }}>
                      <Avatar initials={m.initials} bg={getColor(i)} size={36} />
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                          <div style={{ fontWeight:m.unread?700:500, fontSize:13 }}>{m.patient}</div>
                          <div style={{ fontSize:10, color:C.slate, flexShrink:0 }}>{m.time}</div>
                        </div>
                        <div style={{ fontSize:11, color:C.slate, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginTop:2 }}>{m.preview}</div>
                        {m.urgent&&<span style={{ display:"inline-block", marginTop:4, background:"rgba(239,68,68,.15)", color:C.red, fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:20 }}>🚨 Urgent</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {selectedThread?(
                <div style={{ background:C.white, borderRadius:16, border:`1px solid ${C.border}`, display:"flex", flexDirection:"column", overflow:"hidden" }}>
                  <div style={{ padding:"16px 20px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:12 }}>
                    <Avatar initials={selectedThread.initials} bg={getColor(INBOX.indexOf(selectedThread))} size={38} />
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:15 }}>{selectedThread.patient}</div>
                      {selectedThread.urgent&&<span style={{ fontSize:11, color:C.red, fontWeight:600 }}>⚠ Urgent — requires human review</span>}
                    </div>
                  </div>
                  <div style={{ flex:1, overflow:"auto", padding:20, display:"flex", flexDirection:"column", gap:10, background:"#F8FBFD" }}>
                    {selectedThread.urgent&&(
                      <div style={{ background:"rgba(239,68,68,.08)", border:"1px solid rgba(239,68,68,.2)", borderRadius:12, padding:"10px 14px", display:"flex", gap:10, alignItems:"center" }}>
                        <span>🚨</span>
                        <div style={{ fontSize:12, color:C.red, fontWeight:600 }}>AI flagged this as urgent — patient may need a clinical callback today.</div>
                      </div>
                    )}
                    {selectedThread.thread.map((msg,i)=>(
                      <div key={i} style={{ display:"flex", justifyContent:msg.from==="practice"?"flex-end":"flex-start" }}>
                        <div style={{ maxWidth:"70%", background:msg.from==="practice"?C.teal:C.white, color:msg.from==="practice"?"#fff":C.navy, borderRadius:msg.from==="practice"?"16px 16px 4px 16px":"16px 16px 16px 4px", padding:"10px 14px", fontSize:13, lineHeight:1.6, border:msg.from==="patient"?`1px solid ${C.border}`:"none", boxShadow:"0 1px 4px rgba(0,0,0,.06)", whiteSpace:"pre-wrap" }}>
                          {msg.from==="practice"&&<div style={{ fontSize:9, opacity:0.7, marginBottom:4, textTransform:"uppercase", letterSpacing:1 }}>Bright Eyes · Iryss AI</div>}
                          {msg.text}
                          <div style={{ fontSize:10, opacity:0.55, textAlign:"right", marginTop:4 }}>{msg.time}{msg.from==="practice"?" ✓✓":""}</div>
                        </div>
                      </div>
                    ))}
                    <div ref={msgEndRef} />
                  </div>
                  <div style={{ padding:16, borderTop:`1px solid ${C.border}`, display:"flex", gap:10, alignItems:"center" }}>
                    <input value={sendMsg} onChange={e=>setSendMsg(e.target.value)} placeholder="Type a reply…"
                      style={{ flex:1, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", fontSize:13, fontFamily:"inherit", outline:"none", background:C.cream }} />
                    <button onClick={()=>setSendMsg("")} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:10, padding:"10px 18px", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Send</button>
                  </div>
                </div>
              ):(
                <div style={{ background:C.white, borderRadius:16, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <div style={{ color:C.slate, fontSize:14 }}>Select a conversation</div>
                </div>
              )}
            </div>
          )}

          {/* ═══ REVENUE ═══ */}
          {nav==="revenue"&&(
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
                <SC label="Revenue at risk"        value={`£${atRiskRevenue.toLocaleString()}`}                                                         accent={`linear-gradient(90deg,${C.red},#F97316)`}    onDrill={()=>setDrill("rev-risk")} />
                <SC label="Recovered this month"   value={`£${recoveredRev.toLocaleString()}`}  sub={`${recovered.length} patients`}                    accent={`linear-gradient(90deg,${C.green},#34D399)`}  onDrill={()=>setDrill("rev-recovered")} />
                <SC label="Recovered YTD"          value="£8,400"                               sub="Since April 2025"                                  accent={`linear-gradient(90deg,${C.teal},${C.tealLt})`} />
                <SC label="ROI on Iryss"           value="7.5×"                                 sub="£1,650 recovered · £220 plan"                      accent={`linear-gradient(90deg,#8B5CF6,#A78BFA)`} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
                <div style={{ background:C.white, borderRadius:16, padding:22, border:`1px solid ${C.border}` }}>
                  <div style={{ fontWeight:700, fontSize:15, marginBottom:16 }}>Revenue by patient</div>
                  {PATIENTS.map((p,i)=>(
                    <div key={p.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 0", borderBottom:i<PATIENTS.length-1?`1px solid ${C.border}`:"none" }}>
                      <Avatar initials={p.initials} bg={p.risk==="high"?C.red:p.risk==="medium"?C.amber:C.green} size={30} />
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:600 }}>{p.name}</div>
                        <div style={{ fontSize:11, color:C.slate }}>{p.product}</div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:13, fontWeight:700, color:p.risk==="high"?C.red:p.risk==="medium"?C.amber:C.navy }}>£{p.revenue}</div>
                        <span style={{ fontSize:10, fontWeight:700, padding:"1px 7px", borderRadius:20, background:riskBg[p.risk], color:riskFg[p.risk] }}>{riskLabel[p.risk]}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ background:C.navy, borderRadius:16, padding:22 }}>
                  <div style={{ fontWeight:700, fontSize:15, color:C.white, marginBottom:6 }}>Your Iryss ROI</div>
                  <div style={{ fontSize:13, color:"rgba(255,255,255,.5)", marginBottom:20 }}>Month of March 2026</div>
                  {[
                    { label:"Subscription cost",  val:"£220",                         accent:"rgba(255,255,255,.1)",    fgc:"rgba(255,255,255,.5)" },
                    { label:"Revenue recovered",  val:`£${recoveredRev}`,             accent:"rgba(16,185,129,.15)",    fgc:"#6EE7B7" },
                    { label:"Net return",         val:`£${recoveredRev-220}`,         accent:"rgba(8,145,178,.15)",     fgc:C.tealLt },
                  ].map(item=>(
                    <div key={item.label} style={{ background:item.accent, borderRadius:10, padding:"14px 16px", marginBottom:10 }}>
                      <div style={{ fontSize:11, color:"rgba(255,255,255,.4)", textTransform:"uppercase", letterSpacing:1 }}>{item.label}</div>
                      <div style={{ fontSize:22, fontWeight:800, color:item.fgc, marginTop:4 }}>{item.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══ REVIEWS ═══ */}
          {nav==="reviews"&&(
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
                <SC label="Google rating"         value="4.9 ★" sub="All time"          accent={`linear-gradient(90deg,#FBBC05,#F59E0B)`} />
                <SC label="Total reviews"         value="147"   sub="+38 this month"    accent={`linear-gradient(90deg,${C.teal},${C.tealLt})`} onDrill={()=>setDrill("all-reviews")} />
                <SC label="Via Iryss this month"  value="38"    sub="Fully automatic"   accent={`linear-gradient(90deg,${C.green},#34D399)`}  onDrill={()=>setDrill("iryss-reviews")} />
                <SC label="Review requests sent"  value="52"    sub="73% response rate" accent={`linear-gradient(90deg,${C.purple},#A78BFA)`} onDrill={()=>setDrill("review-requests")} />
              </div>
              <div style={{ background:C.white, borderRadius:16, padding:24, border:`1px solid ${C.border}`, marginBottom:20 }}>
                <div style={{ fontWeight:700, fontSize:15, marginBottom:16 }}>How it works</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16 }}>
                  {[
                    { step:"1", title:"Appointment logged",    desc:"Patient attends their appointment. Click 'Log appointment' to start the automation." },
                    { step:"2", title:"24hr WhatsApp check-in", desc:"Iryss sends a warm message asking how their visit went — in your practice's voice." },
                    { step:"3", title:"Review link sent",      desc:"If they're happy, a direct link to your Google Business profile goes with the next message." },
                  ].map(s=>(
                    <div key={s.step} style={{ background:C.cream, borderRadius:12, padding:16, border:`1px solid ${C.border}` }}>
                      <div style={{ width:36, height:36, borderRadius:"50%", background:C.navy, color:C.white, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:14, marginBottom:10 }}>{s.step}</div>
                      <div style={{ fontWeight:700, fontSize:13, marginBottom:4 }}>{s.title}</div>
                      <div style={{ fontSize:12, color:C.slate, lineHeight:1.6 }}>{s.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background:C.white, borderRadius:16, padding:22, border:`1px solid ${C.border}` }}>
                <div style={{ fontWeight:700, fontSize:15, marginBottom:16 }}>Recent reviews via Iryss</div>
                {REVIEWS.map((r,i)=>(
                  <div key={i} style={{ padding:"14px 0", borderBottom:i<REVIEWS.length-1?`1px solid ${C.border}`:"none" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                      <div style={{ color:"#FBBC05", fontSize:14 }}>{"★".repeat(r.stars)}</div>
                      <div style={{ fontWeight:600, fontSize:13 }}>{r.name}</div>
                      <div style={{ fontSize:11, color:C.slate, marginLeft:"auto" }}>{r.days}</div>
                      {r.via&&<span style={{ fontSize:10, color:C.teal, fontWeight:600, background:C.tealPale, padding:"2px 7px", borderRadius:20 }}>via Iryss ✓</span>}
                    </div>
                    <div style={{ fontSize:13, color:C.slate, lineHeight:1.6, fontStyle:"italic" }}>"{r.text}"</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ APPOINTMENTS ═══ */}
          {nav==="appointments"&&(
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:24 }}>
                <SC label="Today's appointments" value={APPOINTMENTS.length}                           accent={`linear-gradient(90deg,${C.teal},${C.tealLt})`} onDrill={()=>setDrill("all-appts")} />
                <SC label="Confirmed"            value={APPOINTMENTS.filter(a=>a.confirmed).length}   accent={`linear-gradient(90deg,${C.green},#34D399)`}  onDrill={()=>setDrill("confirmed-appts")} />
                <SC label="Booked via Iryss"     value={APPOINTMENTS.filter(a=>a.viaIryss).length}   sub="WhatsApp bookings" accent={`linear-gradient(90deg,${C.purple},#A78BFA)`} onDrill={()=>setDrill("iryss-appts")} />
              </div>
              <div style={{ background:C.white, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden" }}>
                <div style={{ display:"grid", gridTemplateColumns:"80px 1fr 180px 160px 120px", gap:12, padding:"12px 20px", borderBottom:`1px solid ${C.border}`, background:"#FAFBFC" }}>
                  {["Time","Patient","Type","Optician","Status"].map(h=>(
                    <div key={h} style={{ fontSize:11, fontWeight:700, color:C.slate, textTransform:"uppercase", letterSpacing:0.5 }}>{h}</div>
                  ))}
                </div>
                {APPOINTMENTS.map((a,i)=>(
                  <div key={i} style={{ display:"grid", gridTemplateColumns:"80px 1fr 180px 160px 120px", gap:12, padding:"14px 20px", borderBottom:i<APPOINTMENTS.length-1?`1px solid ${C.border}`:"none", alignItems:"center" }}>
                    <div style={{ fontWeight:700, fontSize:14 }}>{a.time}</div>
                    <div>
                      <div style={{ fontWeight:600, fontSize:13 }}>{a.patient}</div>
                      {a.viaIryss&&<span style={{ fontSize:10, color:C.teal, fontWeight:600, background:C.tealPale, padding:"1px 7px", borderRadius:20 }}>via Iryss WhatsApp</span>}
                    </div>
                    <div style={{ fontSize:13, color:C.slate }}>{a.type}</div>
                    <div style={{ fontSize:13 }}>{a.optician}</div>
                    <span style={{ fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:20, background:a.confirmed?"rgba(16,185,129,.12)":"rgba(245,158,11,.12)", color:a.confirmed?C.green:C.amber }}>
                      {a.confirmed?"Confirmed":"Unconfirmed"}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:20, background:C.navy, borderRadius:16, padding:22, display:"flex", alignItems:"center", gap:16 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:15, color:C.white }}>Log an appointment</div>
                  <div style={{ fontSize:13, color:"rgba(255,255,255,.5)", marginTop:4 }}>After logging, Iryss automatically sends a WhatsApp check-in after 24hrs and a Google review request if they're happy.</div>
                </div>
                <button style={{ background:C.teal, color:"#fff", border:"none", borderRadius:10, padding:"12px 24px", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit", flexShrink:0 }}>+ Log appointment</button>
              </div>
            </div>
          )}

          {/* ═══ AI RECEPTIONIST ═══ */}
          {nav==="receptionist"&&(
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:24 }}>
                <SC label="Conversations handled" value="142" sub="This month" accent={`linear-gradient(90deg,${C.teal},${C.tealLt})`} onDrill={()=>setDrill("conversations")} />
                <SC label="Avg response time"     value="<2s" sub="24/7 available"  accent={`linear-gradient(90deg,${C.green},#34D399)`} />
                <SC label="Escalated to human"    value="3"   sub="This month"      accent={`linear-gradient(90deg,${C.amber},#EAB308)`} onDrill={()=>setDrill("escalated")} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
                <div style={{ background:C.navy, borderRadius:16, overflow:"hidden" }}>
                  <div style={{ background:"rgba(255,255,255,.06)", padding:"10px 16px", display:"flex", alignItems:"center", gap:8, borderBottom:"1px solid rgba(255,255,255,.06)" }}>
                    <div style={{ width:10, height:10, borderRadius:"50%", background:"#EF4444" }} />
                    <div style={{ width:10, height:10, borderRadius:"50%", background:"#F59E0B" }} />
                    <div style={{ width:10, height:10, borderRadius:"50%", background:"#10B981" }} />
                    <span style={{ fontSize:11, color:"rgba(255,255,255,.4)", marginLeft:6 }}>AI Receptionist · Live Conversation</span>
                    <span style={{ marginLeft:"auto", fontSize:10, color:"#6EE7B7", fontWeight:600 }}>● Live</span>
                  </div>
                  <div style={{ padding:20, display:"flex", flexDirection:"column", gap:10 }}>
                    {[
                      { from:"patient",  text:"Hi, do you do multifocal contact lenses? I've been struggling with reading glasses on top of my monthlies" },
                      { from:"practice", text:"Hi James! Yes we do 😊 Multifocal contact lenses are brilliant for exactly that situation. We fit daily and monthly multifocals including Acuvue Oasys and CooperVision Biofinity Multifocal.\n\nIt'd be worth a fitting appointment so we can find the right lens for your prescription. Shall I check availability this week?" },
                      { from:"patient",  text:"Yes please! What's the earliest?" },
                      { from:"practice", text:"I have Thursday 20th at 11am or Friday 21st at 3:30pm — which suits you better? 😊" },
                    ].map((msg,i)=>(
                      <div key={i} style={{ display:"flex", justifyContent:msg.from==="practice"?"flex-end":"flex-start" }}>
                        <div style={{ maxWidth:"75%", padding:"10px 14px", borderRadius:msg.from==="practice"?"14px 14px 4px 14px":"14px 14px 14px 4px", background:msg.from==="practice"?"rgba(8,145,178,.25)":"rgba(255,255,255,.07)", border:`1px solid ${msg.from==="practice"?"rgba(8,145,178,.3)":"rgba(255,255,255,.08)"}`, fontSize:12, color:"rgba(255,255,255,.8)", lineHeight:1.55, whiteSpace:"pre-wrap" }}>
                          {msg.from==="practice"&&<div style={{ fontSize:9, color:C.tealLt, fontWeight:700, marginBottom:4, textTransform:"uppercase", letterSpacing:1 }}>Iryss AI</div>}
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                  <div style={{ background:C.white, borderRadius:16, padding:20, border:`1px solid ${C.border}` }}>
                    <div style={{ fontWeight:700, fontSize:14, marginBottom:12 }}>🎓 What the AI knows</div>
                    {["Glasses · frames · varifocals · progressives","Contact lenses (daily, monthly, multifocal, toric)","Eye conditions — dry eye, myopia, presbyopia","Appointment booking & availability","NHS vs private options & pricing","Children's eye health & myopia management","Opening hours, location, parking"].map((item,i,arr)=>(
                      <div key={i} style={{ display:"flex", gap:8, alignItems:"center", padding:"6px 0", borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none" }}>
                        <span style={{ color:C.green, fontSize:13 }}>✓</span>
                        <span style={{ fontSize:13, color:C.slate }}>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background:"rgba(239,68,68,.05)", borderRadius:16, padding:20, border:"1px solid rgba(239,68,68,.12)" }}>
                    <div style={{ fontWeight:700, fontSize:14, marginBottom:8 }}>🚨 Escalation triggers</div>
                    <div style={{ fontSize:13, color:C.slate, lineHeight:1.7 }}>When a patient mentions <strong>sudden vision loss</strong>, <strong>eye pain</strong>, <strong>flashes or floaters</strong>, or any urgent symptom — Iryss immediately alerts your team and pauses the AI response.</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══ DRILLDOWN PANELS ═══ */}

      {drill==="at-risk"&&(
        <DrillPanel title="Patients at Risk" sub="March 2026 · all risk levels" onClose={()=>setDrill(null)} onFullPage={()=>goNav("patients")}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:20 }}>
            {[{label:"High",value:highRisk.length,c:C.red},{label:"Medium",value:medRisk.length,c:C.amber},{label:"Low",value:lowRisk.length,c:C.green}].map(s=>(
              <div key={s.label} style={{ background:C.cream, borderRadius:10, padding:"12px 14px", border:`1px solid ${C.border}`, textAlign:"center" }}>
                <div style={{ fontSize:22, fontWeight:800, color:s.c }}>{s.value}</div>
                <div style={{ fontSize:11, color:C.slate, marginTop:2 }}>{s.label} risk</div>
              </div>
            ))}
          </div>
          {PATIENTS.map((p,i)=><PatientRow key={p.id} p={p} i={i} total={PATIENTS.length} showWA waSent={waSent} onSendWA={p=>{setDrill(null);openSendWA(p);}} />)}
        </DrillPanel>
      )}

      {drill==="high-risk"&&(
        <DrillPanel title="High Risk Patients" sub={`${highRisk.length} patients · Score 70–100`} onClose={()=>setDrill(null)} onFullPage={()=>goNav("patients")}>
          <div style={{ background:"rgba(239,68,68,.06)", border:"1px solid rgba(239,68,68,.15)", borderRadius:12, padding:"12px 16px", marginBottom:20 }}>
            <div style={{ fontSize:12, color:C.slate }}>These patients are most at risk of not returning. We recommend sending a WhatsApp message today.</div>
          </div>
          {highRisk.map((p,i)=><PatientRow key={p.id} p={p} i={i} total={highRisk.length} showWA waSent={waSent} onSendWA={p=>{setDrill(null);openSendWA(p);}} />)}
        </DrillPanel>
      )}

      {drill==="med-risk"&&(
        <DrillPanel title="Medium Risk Patients" sub={`${medRisk.length} patients · Score 40–69`} onClose={()=>setDrill(null)} onFullPage={()=>goNav("patients")}>
          {medRisk.map((p,i)=><PatientRow key={p.id} p={p} i={i} total={medRisk.length} showWA waSent={waSent} onSendWA={p=>{setDrill(null);openSendWA(p);}} />)}
        </DrillPanel>
      )}

      {drill==="low-risk"&&(
        <DrillPanel title="Low Risk Patients" sub={`${lowRisk.length} patients · Score 0–39`} onClose={()=>setDrill(null)} onFullPage={()=>goNav("patients")}>
          {lowRisk.map((p,i)=><PatientRow key={p.id} p={p} i={i} total={lowRisk.length} showWA waSent={waSent} onSendWA={p=>{setDrill(null);openSendWA(p);}} />)}
        </DrillPanel>
      )}

      {drill==="rev-risk"&&(
        <DrillPanel title="Revenue at Risk" sub="High + medium risk patients this month" onClose={()=>setDrill(null)} onFullPage={()=>goNav("revenue")}>
          <div style={{ background:"rgba(239,68,68,.06)", border:"1px solid rgba(239,68,68,.15)", borderRadius:12, padding:"14px 16px", marginBottom:20 }}>
            <div style={{ fontSize:11, color:C.slate, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Total at risk</div>
            <div style={{ fontSize:32, fontWeight:800, color:C.red }}>£{atRiskRevenue.toLocaleString()}</div>
          </div>
          {PATIENTS.filter(p=>p.risk!=="low").sort((a,b)=>b.revenue-a.revenue).map((p,i,arr)=>(
            <div key={p.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none" }}>
              <Avatar initials={p.initials} bg={p.risk==="high"?C.red:C.amber} size={38} />
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:14 }}>{p.name}</div>
                <div style={{ fontSize:12, color:C.slate, marginTop:2 }}>{p.product} · {p.lastVisit}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:18, fontWeight:800, color:p.risk==="high"?C.red:C.amber }}>£{p.revenue}</div>
                <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, background:riskBg[p.risk], color:riskFg[p.risk] }}>{riskLabel[p.risk]}</span>
              </div>
            </div>
          ))}
          <div style={{ marginTop:16, padding:"12px 16px", background:C.cream, borderRadius:10, border:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between" }}>
            <span style={{ fontSize:13, fontWeight:600 }}>Total</span>
            <span style={{ fontSize:14, fontWeight:800, color:C.red }}>£{atRiskRevenue.toLocaleString()}</span>
          </div>
        </DrillPanel>
      )}

      {drill==="recovered"&&(
        <DrillPanel title="Patients Recovered" sub="Re-engaged via Iryss WhatsApp this month" onClose={()=>setDrill(null)} onFullPage={()=>goNav("patients")}>
          <div style={{ background:"rgba(16,185,129,.06)", border:"1px solid rgba(16,185,129,.15)", borderRadius:12, padding:"14px 16px", marginBottom:20 }}>
            <div style={{ fontSize:11, color:C.slate, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Recovered this month</div>
            <div style={{ fontSize:32, fontWeight:800, color:C.green }}>{recovered.length} patients</div>
          </div>
          {recovered.map((p,i)=>(
            <div key={p.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 0", borderBottom:i<recovered.length-1?`1px solid ${C.border}`:"none" }}>
              <Avatar initials={p.initials} bg={C.green} size={38} />
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:14 }}>{p.name}</div>
                <div style={{ fontSize:12, color:C.slate, marginTop:2 }}>{p.product} · {p.lastVisit}</div>
                <div style={{ fontSize:11, color:C.green, marginTop:3, fontWeight:600 }}>
                  {p.status==="booked"?"✓ Appointment booked via WhatsApp":"✓ Re-engaged and returned"}
                </div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:18, fontWeight:800, color:C.green }}>£{p.revenue}</div>
                <div style={{ fontSize:11, color:C.slate }}>recovered</div>
              </div>
            </div>
          ))}
        </DrillPanel>
      )}

      {drill==="rev-recovered"&&(
        <DrillPanel title="Revenue Recovered" sub="This month via Iryss" onClose={()=>setDrill(null)} onFullPage={()=>goNav("revenue")}>
          <div style={{ background:"rgba(8,145,178,.06)", border:"1px solid rgba(8,145,178,.15)", borderRadius:12, padding:"14px 16px", marginBottom:20 }}>
            <div style={{ fontSize:11, color:C.slate, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Total recovered</div>
            <div style={{ fontSize:32, fontWeight:800, color:C.teal }}>£{recoveredRev.toLocaleString()}</div>
            <div style={{ fontSize:12, color:C.slate, marginTop:4 }}>vs £220 subscription = {Math.round(recoveredRev/220*10)/10}× ROI</div>
          </div>
          {recovered.sort((a,b)=>b.revenue-a.revenue).map((p,i)=>(
            <div key={p.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:i<recovered.length-1?`1px solid ${C.border}`:"none" }}>
              <Avatar initials={p.initials} bg={C.teal} size={38} />
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:14 }}>{p.name}</div>
                <div style={{ fontSize:12, color:C.slate, marginTop:2 }}>{p.product}</div>
                <div style={{ fontSize:11, color:C.teal, marginTop:3, fontWeight:600 }}>{p.status==="booked"?"Appointment booked via Iryss":"Returned via Iryss"}</div>
              </div>
              <div style={{ fontSize:18, fontWeight:800, color:C.teal }}>£{p.revenue}</div>
            </div>
          ))}
          <div style={{ marginTop:16, padding:"12px 16px", background:C.cream, borderRadius:10, border:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between" }}>
            <span style={{ fontSize:13, fontWeight:600 }}>Total recovered</span>
            <span style={{ fontSize:14, fontWeight:800, color:C.teal }}>£{recoveredRev.toLocaleString()}</span>
          </div>
        </DrillPanel>
      )}

      {drill==="all-reviews"&&(
        <DrillPanel title="All Reviews" sub="147 total reviews · 4.9 average" onClose={()=>setDrill(null)} onFullPage={()=>goNav("reviews")}>
          {[...REVIEWS,...REVIEWS].map((r,i)=>(
            <div key={i} style={{ padding:"12px 0", borderBottom:i<REVIEWS.length*2-1?`1px solid ${C.border}`:"none" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                <div style={{ color:"#FBBC05", fontSize:13 }}>{"★".repeat(r.stars)}</div>
                <div style={{ fontWeight:600, fontSize:13 }}>{r.name}</div>
                <div style={{ fontSize:11, color:C.slate, marginLeft:"auto" }}>{r.days}</div>
              </div>
              <div style={{ fontSize:13, color:C.slate, lineHeight:1.5, fontStyle:"italic" }}>"{r.text}"</div>
            </div>
          ))}
        </DrillPanel>
      )}

      {drill==="iryss-reviews"&&(
        <DrillPanel title="Reviews via Iryss" sub="38 reviews generated this month automatically" onClose={()=>setDrill(null)}>
          <div style={{ background:"rgba(16,185,129,.06)", border:"1px solid rgba(16,185,129,.15)", borderRadius:12, padding:"14px 16px", marginBottom:20 }}>
            <div style={{ fontSize:11, color:C.slate, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Generated via Iryss this month</div>
            <div style={{ fontSize:32, fontWeight:800, color:C.green }}>38 reviews</div>
            <div style={{ fontSize:12, color:C.slate, marginTop:4 }}>From 52 requests sent · 73% response rate</div>
          </div>
          {REVIEWS.filter(r=>r.via).map((r,i,arr)=>(
            <div key={i} style={{ padding:"12px 0", borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                <div style={{ color:"#FBBC05", fontSize:13 }}>{"★".repeat(r.stars)}</div>
                <div style={{ fontWeight:600, fontSize:13 }}>{r.name}</div>
                <span style={{ fontSize:10, color:C.teal, fontWeight:600, background:C.tealPale, padding:"2px 7px", borderRadius:20 }}>via Iryss ✓</span>
                <div style={{ fontSize:11, color:C.slate, marginLeft:"auto" }}>{r.days}</div>
              </div>
              <div style={{ fontSize:13, color:C.slate, lineHeight:1.5, fontStyle:"italic" }}>"{r.text}"</div>
            </div>
          ))}
        </DrillPanel>
      )}

      {drill==="review-requests"&&(
        <DrillPanel title="Review Requests Sent" sub="52 requests this month · 73% responded" onClose={()=>setDrill(null)}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
            {[{label:"Sent",value:"52",c:C.teal},{label:"Responded",value:"38",c:C.green},{label:"Response rate",value:"73%",c:C.purple},{label:"Left a review",value:"38",c:C.green}].map(s=>(
              <div key={s.label} style={{ background:C.cream, borderRadius:10, padding:"12px 14px", border:`1px solid ${C.border}`, textAlign:"center" }}>
                <div style={{ fontSize:22, fontWeight:800, color:s.c }}>{s.value}</div>
                <div style={{ fontSize:11, color:C.slate, marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>
          {APPOINTMENTS.map((a,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:i<APPOINTMENTS.length-1?`1px solid ${C.border}`:"none" }}>
              <Avatar initials={a.patient.split(" ").map(w=>w[0]).join("").slice(0,2)} bg={getColor(i)} size={34} />
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:13 }}>{a.patient}</div>
                <div style={{ fontSize:11, color:C.slate }}>{a.type} · {a.time}</div>
              </div>
              <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:20, background:i<3?"rgba(16,185,129,.12)":"rgba(245,158,11,.12)", color:i<3?C.green:C.amber }}>
                {i<3?"Review left ✓":"Pending"}
              </span>
            </div>
          ))}
        </DrillPanel>
      )}

      {drill==="all-appts"&&(
        <DrillPanel title="Today's Appointments" sub={`${APPOINTMENTS.length} total · ${APPOINTMENTS.filter(a=>a.confirmed).length} confirmed`} onClose={()=>setDrill(null)}>
          {APPOINTMENTS.map((a,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:i<APPOINTMENTS.length-1?`1px solid ${C.border}`:"none" }}>
              <div style={{ width:46, textAlign:"center", background:C.cream, borderRadius:8, padding:"6px 0", flexShrink:0 }}>
                <div style={{ fontSize:13, fontWeight:800, color:C.navy }}>{a.time}</div>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:14 }}>{a.patient}</div>
                <div style={{ fontSize:12, color:C.slate }}>{a.type} · {a.optician}</div>
                {a.viaIryss&&<span style={{ fontSize:10, color:C.teal, fontWeight:600 }}>via Iryss WhatsApp</span>}
              </div>
              <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:20, background:a.confirmed?"rgba(16,185,129,.12)":"rgba(245,158,11,.12)", color:a.confirmed?C.green:C.amber }}>
                {a.confirmed?"Confirmed":"Pending"}
              </span>
            </div>
          ))}
        </DrillPanel>
      )}

      {drill==="confirmed-appts"&&(
        <DrillPanel title="Confirmed Appointments" sub={`${APPOINTMENTS.filter(a=>a.confirmed).length} confirmed today`} onClose={()=>setDrill(null)}>
          {APPOINTMENTS.filter(a=>a.confirmed).map((a,i,arr)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none" }}>
              <div style={{ width:46, textAlign:"center", background:"rgba(16,185,129,.08)", borderRadius:8, padding:"6px 0", flexShrink:0 }}>
                <div style={{ fontSize:13, fontWeight:800, color:C.green }}>{a.time}</div>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:14 }}>{a.patient}</div>
                <div style={{ fontSize:12, color:C.slate }}>{a.type} · {a.optician}</div>
                {a.viaIryss&&<span style={{ fontSize:10, color:C.teal, fontWeight:600 }}>via Iryss WhatsApp</span>}
              </div>
              <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:20, background:"rgba(16,185,129,.12)", color:C.green }}>✓ Confirmed</span>
            </div>
          ))}
        </DrillPanel>
      )}

      {drill==="iryss-appts"&&(
        <DrillPanel title="Booked via Iryss WhatsApp" sub={`${APPOINTMENTS.filter(a=>a.viaIryss).length} appointments this month`} onClose={()=>setDrill(null)}>
          <div style={{ background:"rgba(139,92,246,.06)", border:"1px solid rgba(139,92,246,.15)", borderRadius:12, padding:"14px 16px", marginBottom:20 }}>
            <div style={{ fontSize:12, color:C.slate, lineHeight:1.6 }}>These appointments were booked directly through Iryss WhatsApp re-engagement — patients who would otherwise not have returned.</div>
          </div>
          {APPOINTMENTS.filter(a=>a.viaIryss).map((a,i,arr)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none" }}>
              <Avatar initials={a.patient.split(" ").map(w=>w[0]).join("").slice(0,2)} bg={C.purple} size={38} />
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:14 }}>{a.patient}</div>
                <div style={{ fontSize:12, color:C.slate }}>{a.type} · {a.time} · {a.optician}</div>
              </div>
              <span style={{ fontSize:10, color:C.purple, fontWeight:600, background:"rgba(139,92,246,.1)", padding:"3px 9px", borderRadius:20 }}>via Iryss ✓</span>
            </div>
          ))}
        </DrillPanel>
      )}
{drill==="conversations"&&(
  <DrillPanel title="Conversations Handled" sub="142 conversations this month via AI Receptionist" onClose={()=>setDrill(null)}>
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
      {[{label:"Booking enquiries",value:"61",c:C.teal},{label:"Product questions",value:"44",c:C.purple},{label:"Appointment changes",value:"24",c:C.amber},{label:"Escalated to human",value:"3",c:C.red}].map(s=>(
        <div key={s.label} style={{ background:C.cream, borderRadius:10, padding:"12px 14px", border:`1px solid ${C.border}`, textAlign:"center" }}>
          <div style={{ fontSize:22, fontWeight:800, color:s.c }}>{s.value}</div>
          <div style={{ fontSize:11, color:C.slate, marginTop:2 }}>{s.label}</div>
        </div>
      ))}
    </div>
    {[
      { patient:"James Brew",      topic:"Multifocal contact lens enquiry → appointment booked", time:"Today 14:32",   resolved:true  },
      { patient:"Ciara Murphy",    topic:"Asked about eye test frequency for children",           time:"Today 11:00",   resolved:true  },
      { patient:"Sarah Flynn",     topic:"Appointment reminder confirmation",                     time:"Today 09:00",   resolved:true  },
      { patient:"Robert Hughes",   topic:"Query about varifocal adaptation period",               time:"Yesterday",     resolved:true  },
      { patient:"Emma Wilson",     topic:"Asked about contact lens trial process",                time:"Yesterday",     resolved:true  },
      { patient:"Margaret Flynn",  topic:"Reported blurry vision — escalated to clinician",       time:"Today 09:18",   resolved:false },
    ].map((c,i,arr)=>(
      <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none" }}>
        <Avatar initials={c.patient.split(" ").map(w=>w[0]).join("").slice(0,2)} bg={c.resolved?C.teal:C.red} size={36} />
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:600, fontSize:13 }}>{c.patient}</div>
          <div style={{ fontSize:12, color:C.slate, marginTop:2 }}>{c.topic}</div>
          <div style={{ fontSize:11, color:C.slate, marginTop:2 }}>{c.time}</div>
        </div>
        <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:20, background:c.resolved?"rgba(16,185,129,.12)":"rgba(239,68,68,.12)", color:c.resolved?C.green:C.red }}>
          {c.resolved?"Resolved":"Escalated"}
        </span>
      </div>
    ))}
  </DrillPanel>
)}
      {drill==="escalated"&&(
        <DrillPanel title="Escalated to Human" sub="3 conversations this month" onClose={()=>setDrill(null)}>
          <div style={{ background:"rgba(245,158,11,.06)", border:"1px solid rgba(245,158,11,.2)", borderRadius:12, padding:"12px 16px", marginBottom:20 }}>
            <div style={{ fontSize:12, color:C.slate, lineHeight:1.6 }}>These conversations were flagged by the AI as requiring human clinical judgment and paused automatically.</div>
          </div>
          {[
            { patient:"Margaret Flynn", reason:"Reported blurry vision on left side", time:"Today 09:18", status:"Urgent" },
            { patient:"Robert Cairns",  reason:"Mentioned eye pain after new glasses",  time:"8 Mar 14:32", status:"Resolved" },
            { patient:"Ann Hughes",     reason:"Asked about symptoms of glaucoma",       time:"5 Mar 11:05", status:"Resolved" },
          ].map((e,i,arr)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 0", borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none" }}>
              <Avatar initials={e.patient.split(" ").map(w=>w[0]).join("")} bg={i===0?C.red:C.slate} size={38} />
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:14 }}>{e.patient}</div>
                <div style={{ fontSize:12, color:C.slate, marginTop:2 }}>{e.reason}</div>
                <div style={{ fontSize:11, color:C.slate, marginTop:2 }}>{e.time}</div>
              </div>
              <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:20, background:i===0?"rgba(239,68,68,.12)":"rgba(16,185,129,.12)", color:i===0?C.red:C.green }}>
                {e.status}
              </span>
            </div>
          ))}
        </DrillPanel>
      )}

      {/* ── WhatsApp send modal ── */}
      {showSendWA&&(
        <div style={{ position:"fixed", inset:0, background:"rgba(10,22,40,.85)", zIndex:950, display:"flex", alignItems:"center", justifyContent:"center" }} onClick={()=>setShowSendWA(null)}>
          <div onClick={e=>e.stopPropagation()} style={{ background:C.white, borderRadius:20, padding:28, width:520, boxShadow:"0 40px 120px rgba(0,0,0,.3)" }}>
            <div style={{ fontWeight:700, fontSize:17, marginBottom:4 }}>Send WhatsApp to {showSendWA.name}</div>
            <div style={{ fontSize:12, color:C.slate, marginBottom:16 }}>Risk: <span style={{ color:showSendWA.risk==="high"?C.red:showSendWA.risk==="medium"?C.amber:C.green, fontWeight:700 }}>{riskLabel[showSendWA.risk]}</span> · Last visit: {showSendWA.lastVisit}</div>
            <textarea value={waMsg} onChange={e=>setWaMsg(e.target.value)}
              style={{ width:"100%", height:180, border:`1px solid ${C.border}`, borderRadius:12, padding:14, fontSize:13, fontFamily:"inherit", resize:"none", outline:"none", boxSizing:"border-box", lineHeight:1.65 }} />
            <div style={{ display:"flex", gap:10, marginTop:16 }}>
              <button onClick={()=>setShowSendWA(null)} style={{ flex:1, background:C.cream, border:`1px solid ${C.border}`, borderRadius:10, padding:12, fontWeight:600, fontSize:14, cursor:"pointer", fontFamily:"inherit", color:C.navy }}>Cancel</button>
              <button onClick={()=>confirmSendWA(showSendWA.id)} style={{ flex:2, background:C.teal, border:"none", borderRadius:10, padding:12, fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit", color:"#fff" }}>
                Send WhatsApp ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
