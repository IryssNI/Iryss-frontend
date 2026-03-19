import { useState, useRef, useEffect } from "react";

// ── Google Font import via style injection ───────────────────────────
const fontStyle = document.createElement('style');
fontStyle.textContent = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');`;
document.head.appendChild(fontStyle);

const C = {
  navy:"#080F1E", navyMid:"#0D1829", navyLight:"#132035",
  teal:"#0891B2", tealLt:"#06B6D4", tealPale:"#E0F7FA",
  cream:"#F7FAFC", border:"#E8EEF4", borderDark:"#1E2D42",
  slate:"#64748B", slateLight:"#94A3B8",
  white:"#FFFFFF", offWhite:"#F8FBFD",
  red:"#EF4444", redDark:"#DC2626",
  amber:"#F59E0B", green:"#10B981", purple:"#8B5CF6",
};

const PATIENTS = [
  { id:"P-001", name:"Louise Everden",  initials:"LE",  phone:"+447827322027", lastVisit:"6 months ago",  product:"Acuvue Oasys Astigmatism", age:33, risk:"low",    riskScore:28, revenue:280, status:"checkin"   },
  { id:"P-002", name:"Tom Bradley",     initials:"TB",  phone:"+447827001002", lastVisit:"9 months ago",  product:"Monthly Contact Lenses",    risk:"medium", riskScore:61, revenue:185, status:"sent"      },
  { id:"P-003", name:"Margaret Flynn",  initials:"MF",  phone:"+447827001003", lastVisit:"11 months ago", product:"Glasses + Contact Lenses",  risk:"high",   riskScore:88, revenue:410, status:"alert"     },
  { id:"P-004", name:"Ciara Murphy",    initials:"CM",  phone:"+447827001004", lastVisit:"4 months ago",  product:"Glasses",                   risk:"low",    riskScore:24, revenue:240, status:"checkin"   },
  { id:"P-005", name:"James Brew",      initials:"JB",  phone:"+447803003472", lastVisit:"8 months ago",  product:"No current spectacles or CL", age:44, risk:"medium", riskScore:61, revenue:150, status:"sent"      },
  { id:"P-006", name:"Sarah Flynn",     initials:"SF",  phone:"+447827001006", lastVisit:"3 months ago",  product:"Varifocals",                risk:"low",    riskScore:18, revenue:380, status:"booked"    },
  { id:"P-007", name:"Shona Everden",   initials:"SE",  phone:"+447711552094", lastVisit:"13 months ago", product:"Varifocals + Acuvue Oasys Max", age:62, risk:"high",   riskScore:82, revenue:420, status:"pending"   },
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
const riskBg    = { high:"rgba(239,68,68,.12)", medium:"rgba(245,158,11,.12)", low:"rgba(16,185,129,.12)" };
const riskFg    = { high:"#EF4444", medium:"#D97706", low:"#059669" };
const avatarColors = ["#0891B2","#8B5CF6","#F59E0B","#10B981","#EF4444","#EC4899","#6366F1","#14B8A6"];
const getColor = i => avatarColors[i % avatarColors.length];
const F = "'DM Sans', system-ui, sans-serif";

function Avatar({ initials, bg=C.teal, size=36 }) {
  return <div style={{ width:size, height:size, borderRadius:"50%", background:bg, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:size*0.33, color:"#fff", flexShrink:0, fontFamily:F, letterSpacing:-0.3 }}>{initials}</div>;
}

function Chip({ children, color, bg }) {
  return <span style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20, background:bg||`${color}18`, color:color, letterSpacing:0.2 }}>{children}</span>;
}

function DrillPanel({ title, sub, onClose, children, onFullPage }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(8,15,30,.7)", zIndex:900, display:"flex", alignItems:"flex-start", justifyContent:"flex-end", backdropFilter:"blur(4px)" }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ width:560, height:"100vh", background:C.white, boxShadow:"-40px 0 80px rgba(0,0,0,.3)", overflow:"auto", padding:"32px 32px 24px", display:"flex", flexDirection:"column", fontFamily:F }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24 }}>
          <div>
            <div style={{ fontSize:19, fontWeight:800, color:C.navy, letterSpacing:-0.5 }}>{title}</div>
            {sub && <div style={{ fontSize:12, color:C.slate, marginTop:4 }}>{sub}</div>}
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:22, cursor:"pointer", color:C.slateLight, lineHeight:1, padding:4 }}>×</button>
        </div>
        <div style={{ flex:1 }}>{children}</div>
        {onFullPage && (
          <button onClick={onFullPage} style={{ width:"100%", marginTop:20, background:C.navy, color:"#fff", border:"none", borderRadius:12, padding:"13px", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:F, letterSpacing:-0.2 }}>
            View full page →
          </button>
        )}
      </div>
    </div>
  );
}

function PatientRow({ p, i, total, showWA, waSent, onSendWA }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 0", borderBottom:i<total-1?`1px solid ${C.border}`:"none" }}>
      <Avatar initials={p.initials} bg={p.risk==="high"?C.red:p.risk==="medium"?C.amber:C.green} size={38} />
      <div style={{ flex:1 }}>
        <div style={{ fontWeight:600, fontSize:14, color:C.navy }}>{p.name}</div>
        <div style={{ fontSize:12, color:C.slate, marginTop:2 }}>{p.product} · Last visit {p.lastVisit}</div>
      </div>
      <div style={{ textAlign:"right", display:"flex", flexDirection:"column", alignItems:"flex-end", gap:5 }}>
        <Chip color={riskFg[p.risk]}>{riskLabel[p.risk]}</Chip>
        <span style={{ fontSize:13, fontWeight:700, color:C.navy }}>£{p.revenue}</span>
        {showWA && (waSent[p.id]
          ? <span style={{ fontSize:11, color:C.green, fontWeight:600 }}>Sent ✓</span>
          : <button onClick={()=>onSendWA(p)} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:8, padding:"5px 11px", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:F }}>Send WhatsApp</button>
        )}
      </div>
    </div>
  );
}

// ── Login ─────────────────────────────────────────────────────────────
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
    <div style={{ minHeight:"100vh", background:C.navy, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:F, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:"-20%", right:"-10%", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle, rgba(8,145,178,.12) 0%, transparent 65%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"-10%", left:"-5%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle, rgba(8,145,178,.06) 0%, transparent 65%)", pointerEvents:"none" }} />
      <div style={{ width:"100%", maxWidth:420, padding:"0 24px", position:"relative", zIndex:1 }}>
        <div style={{ textAlign:"center", marginBottom:44 }}>
          <div style={{ fontSize:38, fontWeight:800, color:C.white, letterSpacing:-1.5 }}>
            <span style={{ color:C.tealLt }}>iryss</span>
          </div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,.3)", marginTop:8, letterSpacing:3, textTransform:"uppercase" }}>Patient Retention Platform</div>
        </div>

        <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:20, padding:"36px 32px", backdropFilter:"blur(20px)" }}>
          <div style={{ fontSize:21, fontWeight:700, color:C.white, marginBottom:4, letterSpacing:-0.5 }}>Welcome back</div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,.35)", marginBottom:28 }}>Sign in to your practice dashboard</div>

          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:11, fontWeight:600, color:"rgba(255,255,255,.4)", textTransform:"uppercase", letterSpacing:1.2, display:"block", marginBottom:8 }}>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder="you@yourpractice.com"
              style={{ width:"100%", background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.08)", borderRadius:10, padding:"12px 14px", fontSize:14, color:"#fff", fontFamily:F, outline:"none", boxSizing:"border-box", transition:"border .2s" }} />
          </div>
          <div style={{ marginBottom:24 }}>
            <label style={{ fontSize:11, fontWeight:600, color:"rgba(255,255,255,.4)", textTransform:"uppercase", letterSpacing:1.2, display:"block", marginBottom:8 }}>Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder="••••••••"
              style={{ width:"100%", background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.08)", borderRadius:10, padding:"12px 14px", fontSize:14, color:"#fff", fontFamily:F, outline:"none", boxSizing:"border-box" }} />
          </div>

          {error && <div style={{ background:"rgba(239,68,68,.08)", border:"1px solid rgba(239,68,68,.15)", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#FCA5A5", marginBottom:16 }}>{error}</div>}

          <button onClick={handleLogin} disabled={loading} style={{ width:"100%", background:loading?"rgba(8,145,178,.4)":"linear-gradient(135deg,#0891B2,#06B6D4)", border:"none", borderRadius:10, padding:"13px", fontSize:15, fontWeight:700, color:"#fff", cursor:loading?"default":"pointer", fontFamily:F, letterSpacing:-0.2, boxShadow:loading?"none":"0 4px 20px rgba(8,145,178,.35)" }}>
            {loading?"Signing in…":"Sign in →"}
          </button>

          <div style={{ textAlign:"center", marginTop:20, fontSize:12, color:"rgba(255,255,255,.2)" }}>
            Forgot your password? <span style={{ color:C.tealLt, cursor:"pointer" }}>Contact support</span>
          </div>
        </div>

        <div style={{ textAlign:"center", marginTop:28, fontSize:11, color:"rgba(255,255,255,.15)", letterSpacing:0.5 }}>
          GDPR compliant · EU data servers · Built in Belfast
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  if (!user) return <LoginScreen onLogin={setUser} />;
  return <Dashboard />;
}

function Dashboard() {
  const [nav, setNav]               = useState("dashboard");
  const [drill, setDrill]           = useState(null);
  const [filterRisk, setFilterRisk] = useState("all");
  const [selectedThread, setSelectedThread] = useState(null);
  const [sendMsg, setSendMsg]       = useState("");
  const [showSendWA, setShowSendWA] = useState(null);
  const [waMsg, setWaMsg]           = useState("");
  const [waSent, setWaSent]         = useState({});
  const msgEndRef = useRef(null);
  const [liveInbox, setLiveInbox] = useState([]);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch('https://iryss-backend-12fh.onrender.com/api/public/inbox');
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.messages && data.messages.length > 0) {
          const grouped = {};
          data.messages.forEach(m => {
            const name = m.patient_name;
            if (!grouped[name]) grouped[name] = { name, phone: m.patient_phone, messages: [] };
            grouped[name].messages.push(m);
          });
          const mapped = Object.values(grouped).map(c => ({
            id: c.name,
            patient: c.name,
            initials: c.name.split(' ').map(w=>w[0]).join('').slice(0,2),
            preview: c.messages[0]?.message_body || '',
            time: new Date(c.messages[0]?.sent_at).toLocaleTimeString('en-GB', {hour:'2-digit',minute:'2-digit'}),
            unread: c.messages.some(m=>m.direction==='inbound'),
            urgent: c.messages.some(m=>m.sentiment==='urgent'),
            thread: c.messages.reverse().map(m => ({
              from: m.direction === 'inbound' ? 'patient' : 'practice',
              text: m.message_body,
              time: new Date(m.sent_at).toLocaleTimeString('en-GB', {hour:'2-digit',minute:'2-digit'})
            }))
          }));
          setLiveInbox(mapped);
          setSelectedThread(prev =>
            prev ? (mapped.find(m => m.id === prev.id) ?? mapped[0]) : mapped[0]
          );
        }
      } catch(e) { console.log('Using demo inbox', e); }
    }
    fetchMessages();
    const interval = setInterval(fetchMessages, 15000);
    return () => clearInterval(interval);
  }, []);

  const highRisk      = PATIENTS.filter(p=>p.risk==="high");
  const medRisk       = PATIENTS.filter(p=>p.risk==="medium");
  const lowRisk       = PATIENTS.filter(p=>p.risk==="low");
  const recovered     = PATIENTS.filter(p=>p.status==="recovered"||p.status==="booked");
  const atRiskRevenue = PATIENTS.filter(p=>p.risk!=="low").reduce((a,p)=>a+p.revenue,0);
  const recoveredRev  = recovered.reduce((a,p)=>a+p.revenue,0);
  const unreadCount   = liveInbox.filter(i=>i.unread).length;
  const urgentCount   = liveInbox.filter(i=>i.urgent).length;
  const filteredPts   = filterRisk==="all"?PATIENTS:PATIENTS.filter(p=>p.risk===filterRisk);

  const waTemplates = {
    high:   `Hi {name} 👋\n\nWe've been thinking about you and just wanted to check in. It's been a while since your last visit — whenever you're ready, we'd love to welcome you back.\n\nJust reply here and we'll sort everything 😊\n\nBright Eyes Opticians`,
    medium: `Hi {name} 👋\n\nIt's the team at Bright Eyes! It's been a little while — we just wanted to make sure everything is still going well with your {product}.\n\nDo get in touch if you have any questions at all 😊`,
    low:    `Hi {name} 👋\n\nHope you're well! Just a quick friendly check-in from Bright Eyes. We're here whenever you need us 😊`,
  };

  function openSendWA(p) {
    setShowSendWA(p);
    setWaMsg(waTemplates[p.risk].replace("{name}",p.name.split(" ")[0]).replace("{product}",p.product));
  }
  function confirmSendWA(pid) {
    const patient = PATIENTS.find(p=>p.id===pid);
    if (patient) {
      fetch("https://iryss-backend-12fh.onrender.com/api/send-whatsapp", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ to: patient.phone, message: waMsg })
      }).then(r=>r.json()).then(d=>console.log("Sent:",d)).catch(e=>console.error("Error:",e));
    }
    setWaSent(prev=>({...prev,[pid]:true})); setShowSendWA(null); setWaMsg("");
  }
  function goNav(id) { setDrill(null); setNav(id); }

  // Polished stat card
  function SC({ label, value, sub, accent, onDrill }) {
    return (
      <div onClick={onDrill} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"22px 22px 18px", cursor:onDrill?"pointer":"default", transition:"all .2s", boxShadow:"0 1px 3px rgba(0,0,0,.04), 0 1px 2px rgba(0,0,0,.03)", position:"relative", overflow:"hidden" }}
        onMouseEnter={e=>{ if(onDrill){ e.currentTarget.style.boxShadow=`0 0 0 2px ${C.teal}, 0 8px 24px rgba(8,145,178,.12)`; e.currentTarget.style.transform="translateY(-1px)"; }}}
        onMouseLeave={e=>{ e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,.04), 0 1px 2px rgba(0,0,0,.03)"; e.currentTarget.style.transform="translateY(0)"; }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:accent, borderRadius:"16px 16px 0 0" }} />
        <div style={{ fontSize:28, fontWeight:800, color:C.navy, letterSpacing:-1, lineHeight:1, marginTop:4 }}>{value}</div>
        <div style={{ fontSize:12, color:C.slate, marginTop:6, fontWeight:500 }}>{label}</div>
        {sub && <div style={{ fontSize:11, color:C.teal, marginTop:5, fontWeight:600 }}>{sub}</div>}
        {onDrill && <div style={{ fontSize:10, color:C.slateLight, marginTop:8, display:"flex", alignItems:"center", gap:3 }}>View breakdown <span style={{ fontSize:12 }}>↗</span></div>}
      </div>
    );
  }

  const pageTitle = {
    dashboard:"dashboard", patients:"patients", inbox:"inbox",
    revenue:"revenue", reviews:"reviews", appointments:"appointments", receptionist:"receptionist"
  };

  const pageTitles = {
    dashboard:"Good morning, Bright Eyes 👋",
    patients:"At-Risk Patients",
    inbox:"WhatsApp Inbox",
    revenue:"Revenue Dashboard",
    reviews:"Google Reviews",
    appointments:"Today's Appointments",
    receptionist:"AI Receptionist",
  };

  return (
    <div style={{ display:"flex", height:"100vh", fontFamily:F, background:"#EEF2F7", color:C.navy, overflow:"hidden" }}>

      {/* ── Sidebar ── */}
      <div style={{ width:236, background:C.navy, display:"flex", flexDirection:"column", flexShrink:0, padding:"0 10px 16px", borderRight:"1px solid rgba(255,255,255,.04)" }}>
        <div style={{ padding:"24px 8px 20px", borderBottom:"1px solid rgba(255,255,255,.06)", marginBottom:10 }}>
          <div style={{ fontSize:24, fontWeight:800, color:C.white, letterSpacing:-1 }}><span style={{ color:C.tealLt }}>iryss</span></div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:6 }}><svg width="22" height="22" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="50" rx="42" ry="24" fill="none" stroke="#06B6D4" stroke-width="3"/><circle cx="50" cy="50" r="14" fill="none" stroke="#06B6D4" stroke-width="2.5"/><circle cx="50" cy="50" r="8" fill="none" stroke="#06B6D4" stroke-width="1.5" opacity="0.4"/><circle cx="50" cy="50" r="4" fill="#06B6D4"/><circle cx="53" cy="47" r="1.5" fill="white" opacity="0.9"/><line x1="34" y1="28" x2="32" y2="20" stroke="#06B6D4" stroke-width="1.5" stroke-linecap="round"/><line x1="42" y1="26" x2="41" y2="18" stroke="#06B6D4" stroke-width="1.5" stroke-linecap="round"/><line x1="50" y1="26" x2="50" y2="18" stroke="#06B6D4" stroke-width="1.5" stroke-linecap="round"/><line x1="58" y1="26" x2="59" y2="18" stroke="#06B6D4" stroke-width="1.5" stroke-linecap="round"/><line x1="66" y1="28" x2="68" y2="20" stroke="#06B6D4" stroke-width="1.5" stroke-linecap="round"/></svg><div style={{ fontSize:10, color:"rgba(255,255,255,.3)", letterSpacing:2, textTransform:"uppercase" }}>Bright Eyes Opticians</div></div>
        </div>

        <nav style={{ display:"flex", flexDirection:"column", gap:2, flex:1 }}>
          {[
            { id:"dashboard",    label:"Dashboard",        icon:"⬡"  },
            { id:"patients",     label:"At-Risk Patients", icon:"🎯", badge:highRisk.length },
            { id:"inbox",        label:"Inbox",            icon:"💬", badge:unreadCount },
            { id:"revenue",      label:"Revenue",          icon:"£"  },
            { id:"reviews",      label:"Google Reviews",   icon:"⭐" },
            { id:"appointments", label:"Appointments",     icon:"📅" },
            { id:"receptionist", label:"AI Receptionist",  icon:"🤖" },
          ].map(item=>(
            <button key={item.id} onClick={()=>goNav(item.id)} style={{
              display:"flex", alignItems:"center", gap:10, width:"100%", padding:"10px 12px",
              border:"none", background:nav===item.id?"rgba(8,145,178,.18)":"transparent",
              borderRadius:10, cursor:"pointer",
              color:nav===item.id?"#fff":"rgba(255,255,255,.45)",
              fontWeight:nav===item.id?700:400, fontSize:13.5, fontFamily:F, textAlign:"left",
              borderLeft:nav===item.id?`3px solid ${C.teal}`:"3px solid transparent",
              transition:"all .15s", letterSpacing:-0.1
            }}>
              <span style={{ fontSize:15, width:20, textAlign:"center", opacity:nav===item.id?1:0.7 }}>{item.icon}</span>
              <span style={{ flex:1 }}>{item.label}</span>
              {item.badge>0 && <span style={{ background:C.red, color:"#fff", borderRadius:20, fontSize:10, fontWeight:700, padding:"2px 7px", minWidth:20, textAlign:"center" }}>{item.badge}</span>}
            </button>
          ))}
        </nav>

        <div style={{ borderTop:"1px solid rgba(255,255,255,.06)", paddingTop:14, marginTop:8 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 12px" }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:C.green, boxShadow:"0 0 6px rgba(16,185,129,.6)" }} />
            <span style={{ fontSize:12, color:"rgba(255,255,255,.35)" }}>All systems live</span>
          </div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,.18)", padding:"2px 12px" }}>Next AI scoring: 02:00</div>
        </div>
      </div>

      {/* ── Main ── */}
      <div style={{ flex:1, overflow:"auto", display:"flex", flexDirection:"column" }}>

        {/* Topbar */}
        <div style={{ background:C.white, borderBottom:`1px solid ${C.border}`, padding:"14px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0, boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}>
          <div>
            <div style={{ fontSize:18, fontWeight:700, color:C.navy, letterSpacing:-0.4 }}>{pageTitles[nav]}</div>
            <div style={{ fontSize:12, color:C.slateLight, marginTop:2 }}>Tuesday, 10 March 2026</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {urgentCount>0&&(
              <div onClick={()=>goNav("inbox")} style={{ background:"rgba(239,68,68,.07)", border:"1px solid rgba(239,68,68,.18)", borderRadius:10, padding:"7px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:7 }}>
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
              {/* Hero insight strip */}
              <div style={{ background:`linear-gradient(135deg, ${C.navy} 0%, #0E2040 100%)`, borderRadius:16, padding:"20px 26px", marginBottom:22, display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 4px 20px rgba(8,15,30,.15)" }}>
                <div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,.35)", textTransform:"uppercase", letterSpacing:2, marginBottom:7 }}>Today's Summary</div>
                  <div style={{ fontSize:17, fontWeight:600, color:"#fff", lineHeight:1.5 }}>
                    You have <span style={{ color:"#FCA5A5", fontWeight:800 }}>£{atRiskRevenue.toLocaleString()}</span> at risk —
                    Iryss has re-engaged <span style={{ color:"#6EE7B7", fontWeight:800 }}>{recovered.length} patients</span> this month.
                  </div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0, marginLeft:28 }}>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,.25)", marginBottom:5, textTransform:"uppercase", letterSpacing:1 }}>Next AI run</div>
                  <div style={{ fontSize:13, fontWeight:600, color:C.tealLt, display:"flex", alignItems:"center", gap:6, justifyContent:"flex-end" }}>
                    <span style={{ width:7, height:7, borderRadius:"50%", background:C.tealLt, display:"inline-block", boxShadow:"0 0 8px rgba(6,182,212,.7)" }} />
                    Tonight 02:00
                  </div>
                </div>
              </div>

              {/* Urgent alerts */}
              {INBOX.filter(i=>i.urgent).map(alert=>(
                <div key={alert.id} onClick={()=>{ setSelectedThread(alert); goNav("inbox"); }}
                  style={{ background:"rgba(239,68,68,.05)", border:"1px solid rgba(239,68,68,.15)", borderRadius:14, padding:"14px 18px", marginBottom:18, display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}>
                  <span style={{ fontSize:20 }}>🚨</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, color:C.red, fontSize:14 }}>Urgent — {alert.patient}</div>
                    <div style={{ fontSize:13, color:C.slate, marginTop:2 }}>{alert.preview} — <span style={{ color:C.teal }}>View conversation →</span></div>
                  </div>
                  <div style={{ fontSize:11, color:C.slateLight }}>{alert.time}</div>
                </div>
              ))}

              {/* KPI cards */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:22 }}>
                <SC label="Patients at risk"   value={PATIENTS.filter(p=>p.risk!=="low").length} sub={`${highRisk.length} high · ${medRisk.length} medium`} accent={`linear-gradient(90deg,${C.red},#F97316)`}    onDrill={()=>setDrill("at-risk")} />
                <SC label="Revenue at risk"    value={`£${atRiskRevenue.toLocaleString()}`}       sub="This month"     accent={`linear-gradient(90deg,${C.amber},#EAB308)`}  onDrill={()=>setDrill("rev-risk")} />
                <SC label="Patients recovered" value={recovered.length}                           sub="This month"     accent={`linear-gradient(90deg,${C.green},#34D399)`}  onDrill={()=>setDrill("recovered")} />
                <SC label="Revenue recovered"  value={`£${recoveredRev.toLocaleString()}`}        sub="↑ This month"   accent={`linear-gradient(90deg,${C.teal},${C.tealLt})`} onDrill={()=>setDrill("rev-recovered")} />
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
                {/* High-risk patients */}
                <div style={{ background:C.white, borderRadius:16, padding:22, border:`1px solid ${C.border}`, boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
                    <div style={{ fontWeight:700, fontSize:15, letterSpacing:-0.3 }}>🎯 High-Risk Patients</div>
                    <button onClick={()=>goNav("patients")} style={{ background:"none", border:"none", color:C.teal, fontSize:12, cursor:"pointer", fontWeight:600, fontFamily:F }}>View all →</button>
                  </div>
                  {highRisk.map((p,i)=>(
                    <div key={p.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:i<highRisk.length-1?`1px solid ${C.border}`:"none" }}>
                      <Avatar initials={p.initials} bg={C.red} size={36} />
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:600, fontSize:13 }}>{p.name}</div>
                        <div style={{ fontSize:11, color:C.slate }}>{p.lastVisit} · {p.product}</div>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <Chip color={riskFg.high}>HIGH</Chip>
                        {!waSent[p.id]
                          ? <button onClick={()=>openSendWA(p)} style={{ background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:8, padding:"5px 11px", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:F, boxShadow:"0 2px 8px rgba(8,145,178,.3)" }}>Send WhatsApp</button>
                          : <span style={{ fontSize:11, color:C.green, fontWeight:600 }}>Sent ✓</span>
                        }
                      </div>
                    </div>
                  ))}
                </div>

                {/* Inbox preview */}
                <div style={{ background:C.white, borderRadius:16, padding:22, border:`1px solid ${C.border}`, boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
                    <div style={{ fontWeight:700, fontSize:15, letterSpacing:-0.3 }}>💬 Recent Inbox</div>
                    <button onClick={()=>goNav("inbox")} style={{ background:"none", border:"none", color:C.teal, fontSize:12, cursor:"pointer", fontWeight:600, fontFamily:F }}>View all →</button>
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
                        <div style={{ fontSize:10, color:C.slateLight }}>{m.time}</div>
                        {m.urgent&&<div style={{ background:"rgba(239,68,68,.1)", color:C.red, fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:20, marginTop:3 }}>Urgent</div>}
                        {m.unread&&!m.urgent&&<div style={{ background:`rgba(8,145,178,.1)`, color:C.teal, fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:20, marginTop:3 }}>New</div>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Appointments */}
                <div style={{ background:C.white, borderRadius:16, padding:22, border:`1px solid ${C.border}`, boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}>
                  <div style={{ fontWeight:700, fontSize:15, marginBottom:16, letterSpacing:-0.3 }}>📅 Today's Appointments</div>
                  {APPOINTMENTS.map((a,i)=>(
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"9px 0", borderBottom:i<APPOINTMENTS.length-1?`1px solid ${C.border}`:"none" }}>
                      <div style={{ width:44, textAlign:"center", flexShrink:0 }}>
                        <div style={{ fontSize:12, fontWeight:700, color:C.navy }}>{a.time}</div>
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:600 }}>{a.patient}</div>
                        <div style={{ fontSize:11, color:C.slate }}>{a.type} · {a.optician}</div>
                      </div>
                      <span style={{ fontSize:10, fontWeight:700, padding:"3px 9px", borderRadius:20, background:a.confirmed?"rgba(16,185,129,.1)":"rgba(245,158,11,.1)", color:a.confirmed?C.green:C.amber }}>
                        {a.confirmed?"Confirmed":"Pending"}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Google rating */}
                <div style={{ background:`linear-gradient(135deg,${C.navy} 0%,#0E2040 100%)`, borderRadius:16, padding:22, boxShadow:"0 4px 20px rgba(8,15,30,.15)" }}>
                  <div style={{ fontWeight:700, fontSize:15, color:C.white, marginBottom:18, letterSpacing:-0.3 }}>⭐ Google Reviews</div>
                  <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:18 }}>
                    <div>
                      <div style={{ fontSize:42, fontWeight:800, color:C.white, lineHeight:1, letterSpacing:-2 }}>4.9</div>
                      <div style={{ color:"#FBBC05", fontSize:16, marginTop:4, letterSpacing:2 }}>★★★★★</div>
                      <div style={{ fontSize:11, color:"rgba(255,255,255,.3)", marginTop:5 }}>147 total reviews</div>
                    </div>
                    <div style={{ marginLeft:"auto", textAlign:"right" }}>
                      <div style={{ fontSize:30, fontWeight:800, color:C.green, letterSpacing:-1 }}>+38</div>
                      <div style={{ fontSize:11, color:"rgba(255,255,255,.35)", marginTop:2 }}>this month</div>
                      <div style={{ fontSize:11, color:C.tealLt, fontWeight:600, marginTop:5 }}>via Iryss ✓</div>
                    </div>
                  </div>
                  <button onClick={()=>goNav("reviews")} style={{ width:"100%", background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", borderRadius:10, padding:"10px", color:"rgba(255,255,255,.8)", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:F, transition:"all .2s" }}>
                    View all reviews →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ═══ AT-RISK PATIENTS ═══ */}
          {nav==="patients"&&(
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:22 }}>
                <SC label="High risk"             value={highRisk.length}    accent={`linear-gradient(90deg,${C.red},#F97316)`}    onDrill={()=>setDrill("high-risk")} />
                <SC label="Medium risk"           value={medRisk.length}     accent={`linear-gradient(90deg,${C.amber},#EAB308)`}  onDrill={()=>setDrill("med-risk")} />
                <SC label="Total revenue at risk" value={`£${atRiskRevenue.toLocaleString()}`} accent={`linear-gradient(90deg,${C.teal},${C.tealLt})`} onDrill={()=>setDrill("rev-risk")} />
                <SC label="Patients recovered"    value={recovered.length}   sub="This month" accent={`linear-gradient(90deg,${C.green},#34D399)`} onDrill={()=>setDrill("recovered")} />
              </div>
              <div style={{ display:"flex", gap:8, marginBottom:18 }}>
                {["all","high","medium"].map(r=>(
                  <button key={r} onClick={()=>setFilterRisk(r)} style={{
                    padding:"7px 16px", borderRadius:20, cursor:"pointer", fontFamily:F,
                    background:filterRisk===r?C.navy:C.white, color:filterRisk===r?C.white:C.slate,
                    fontWeight:filterRisk===r?700:500, fontSize:13,
                    border:`1px solid ${filterRisk===r?C.navy:C.border}`,
                    boxShadow:filterRisk===r?"0 2px 8px rgba(8,15,30,.2)":"none", transition:"all .15s"
                  }}>
                    {r==="all"?"All patients":r.charAt(0).toUpperCase()+r.slice(1)+" risk"}
                  </button>
                ))}
              </div>
              <div style={{ background:C.white, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 130px 130px 120px 160px", gap:12, padding:"12px 20px", borderBottom:`1px solid ${C.border}`, background:"#FAFBFC" }}>
                  {["Patient","Last Visit","Product","Risk Score","Action"].map(h=>(
                    <div key={h} style={{ fontSize:10, fontWeight:700, color:C.slateLight, textTransform:"uppercase", letterSpacing:1 }}>{h}</div>
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
                      <Chip color={riskFg[p.risk]}>{riskLabel[p.risk]}</Chip>
                      <div style={{ fontSize:10, color:C.slateLight, marginTop:4 }}>Score: {p.riskScore}</div>
                    </div>
                    <div>
                      {waSent[p.id]
                        ? <span style={{ fontSize:12, color:C.green, fontWeight:600 }}>✓ Sent</span>
                        : <button onClick={()=>openSendWA(p)} style={{ background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:8, padding:"6px 13px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:F, boxShadow:"0 2px 8px rgba(8,145,178,.3)" }}>Send WhatsApp</button>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ INBOX ═══ */}
          {nav==="inbox"&&(
            <div style={{ display:"grid", gridTemplateColumns:"300px 1fr", gap:18, height:"calc(100vh - 160px)" }}>
              <div style={{ background:C.white, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden", display:"flex", flexDirection:"column", boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}>
                <div style={{ padding:"16px 16px 12px", borderBottom:`1px solid ${C.border}`, fontWeight:700, fontSize:14, display:"flex", alignItems:"center", gap:8 }}>
                  Conversations
                  <span style={{ background:C.red, color:"#fff", borderRadius:20, fontSize:10, fontWeight:700, padding:"2px 7px" }}>{unreadCount}</span>
                </div>
                <div style={{ overflow:"auto", flex:1 }}>
                  {liveInbox.map((m,i)=>(
                    <div key={m.id} onClick={()=>setSelectedThread(m)} style={{
                      display:"flex", gap:10, padding:"12px 16px", cursor:"pointer", alignItems:"flex-start",
                      background:selectedThread?.id===m.id?"rgba(8,145,178,.06)":m.urgent?"rgba(239,68,68,.03)":"transparent",
                      borderBottom:`1px solid ${C.border}`,
                      borderLeft:selectedThread?.id===m.id?`3px solid ${C.teal}`:"3px solid transparent",
                      transition:"background .15s"
                    }}>
                      <Avatar initials={m.initials} bg={getColor(i)} size={36} />
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                          <div style={{ fontWeight:m.unread?700:500, fontSize:13 }}>{m.patient}</div>
                          <div style={{ fontSize:10, color:C.slateLight, flexShrink:0 }}>{m.time}</div>
                        </div>
                        <div style={{ fontSize:11, color:C.slate, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginTop:2 }}>{m.preview}</div>
                        {m.urgent&&<span style={{ display:"inline-block", marginTop:4, background:"rgba(239,68,68,.1)", color:C.red, fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:20 }}>🚨 Urgent</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedThread?(
                <div style={{ background:C.white, borderRadius:16, border:`1px solid ${C.border}`, display:"flex", flexDirection:"column", overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}>
                  <div style={{ padding:"16px 20px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:12 }}>
                    <Avatar initials={selectedThread.initials} bg={getColor(liveInbox.indexOf(selectedThread))} size={38} />
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:15, letterSpacing:-0.3 }}>{selectedThread.patient}</div>
                      {selectedThread.urgent&&<span style={{ fontSize:11, color:C.red, fontWeight:600 }}>⚠ Urgent — requires human review</span>}
                    </div>
                  </div>
                  <div style={{ flex:1, overflow:"auto", padding:20, display:"flex", flexDirection:"column", gap:10, background:"#F7FAFC" }}>
                    {selectedThread.urgent&&(
                      <div style={{ background:"rgba(239,68,68,.06)", border:"1px solid rgba(239,68,68,.15)", borderRadius:12, padding:"10px 14px", display:"flex", gap:10, alignItems:"center" }}>
                        <span>🚨</span>
                        <div style={{ fontSize:12, color:C.red, fontWeight:600 }}>AI flagged this as urgent — patient may need a clinical callback today.</div>
                      </div>
                    )}
                    {selectedThread.thread.map((msg,i)=>(
                      <div key={i} style={{ display:"flex", justifyContent:msg.from==="practice"?"flex-end":"flex-start" }}>
                        <div style={{ maxWidth:"70%", background:msg.from==="practice"?`linear-gradient(135deg,${C.teal},${C.tealLt})`:C.white, color:msg.from==="practice"?"#fff":C.navy, borderRadius:msg.from==="practice"?"16px 16px 4px 16px":"16px 16px 16px 4px", padding:"10px 14px", fontSize:13, lineHeight:1.6, border:msg.from==="patient"?`1px solid ${C.border}`:"none", boxShadow:"0 2px 8px rgba(0,0,0,.06)", whiteSpace:"pre-wrap" }}>
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
                      style={{ flex:1, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", fontSize:13, fontFamily:F, outline:"none", background:C.offWhite }} />
                    <button onClick={()=>setSendMsg("")} style={{ background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:10, padding:"10px 18px", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:F, boxShadow:"0 2px 8px rgba(8,145,178,.3)" }}>Send</button>
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
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:22 }}>
                <SC label="Revenue at risk"       value={`£${atRiskRevenue.toLocaleString()}`}                        accent={`linear-gradient(90deg,${C.red},#F97316)`}    onDrill={()=>setDrill("rev-risk")} />
                <SC label="Recovered this month"  value={`£${recoveredRev.toLocaleString()}`} sub={`${recovered.length} patients`} accent={`linear-gradient(90deg,${C.green},#34D399)`}  onDrill={()=>setDrill("rev-recovered")} />
                <SC label="Recovered YTD"         value="£8,400"                              sub="Since April 2025"  accent={`linear-gradient(90deg,${C.teal},${C.tealLt})`} />
                <SC label="ROI on Iryss"          value="7.5×"                                sub="£220 plan"         accent={`linear-gradient(90deg,#8B5CF6,#A78BFA)`} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
                <div style={{ background:C.white, borderRadius:16, padding:22, border:`1px solid ${C.border}`, boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}>
                  <div style={{ fontWeight:700, fontSize:15, marginBottom:16, letterSpacing:-0.3 }}>Revenue by patient</div>
                  {PATIENTS.map((p,i)=>(
                    <div key={p.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 0", borderBottom:i<PATIENTS.length-1?`1px solid ${C.border}`:"none" }}>
                      <Avatar initials={p.initials} bg={p.risk==="high"?C.red:p.risk==="medium"?C.amber:C.green} size={30} />
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:600 }}>{p.name}</div>
                        <div style={{ fontSize:11, color:C.slate }}>{p.product}</div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:13, fontWeight:700, color:p.risk==="high"?C.red:p.risk==="medium"?C.amber:C.navy }}>£{p.revenue}</div>
                        <Chip color={riskFg[p.risk]}>{riskLabel[p.risk]}</Chip>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══ REVIEWS ═══ */}
          {nav==="reviews"&&(
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:22 }}>
                <SC label="Google rating"        value="4.9 ★" sub="All time"           accent={`linear-gradient(90deg,#FBBC05,#F59E0B)`} />
                <SC label="Total reviews"        value="147"   sub="+38 this month"     accent={`linear-gradient(90deg,${C.teal},${C.tealLt})`} onDrill={()=>setDrill("all-reviews")} />
                <SC label="Via Iryss this month" value="38"    sub="Fully automatic"    accent={`linear-gradient(90deg,${C.green},#34D399)`}  onDrill={()=>setDrill("iryss-reviews")} />
                <SC label="Review requests sent" value="52"    sub="73% response rate"  accent={`linear-gradient(90deg,${C.purple},#A78BFA)`} onDrill={()=>setDrill("review-requests")} />
              </div>
              <div style={{ background:C.white, borderRadius:16, padding:24, border:`1px solid ${C.border}`, marginBottom:18, boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}>
                <div style={{ fontWeight:700, fontSize:15, marginBottom:16, letterSpacing:-0.3 }}>How it works</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
                  {[
                    { step:"1", title:"Appointment logged",     desc:"Patient attends. Click 'Log appointment' to start the automation." },
                    { step:"2", title:"24hr WhatsApp check-in", desc:"Iryss sends a warm message asking how their visit went." },
                    { step:"3", title:"Review link sent",       desc:"If happy, a direct link to your Google Business profile is sent." },
                  ].map(s=>(
                    <div key={s.step} style={{ background:C.cream, borderRadius:12, padding:16, border:`1px solid ${C.border}` }}>
                      <div style={{ width:34, height:34, borderRadius:"50%", background:C.navy, color:C.white, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:14, marginBottom:10 }}>{s.step}</div>
                      <div style={{ fontWeight:700, fontSize:13, marginBottom:4 }}>{s.title}</div>
                      <div style={{ fontSize:12, color:C.slate, lineHeight:1.6 }}>{s.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background:C.white, borderRadius:16, padding:22, border:`1px solid ${C.border}`, boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}>
                <div style={{ fontWeight:700, fontSize:15, marginBottom:16, letterSpacing:-0.3 }}>Recent reviews via Iryss</div>
                {REVIEWS.map((r,i)=>(
                  <div key={i} style={{ padding:"14px 0", borderBottom:i<REVIEWS.length-1?`1px solid ${C.border}`:"none" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                      <div style={{ color:"#FBBC05", fontSize:13, letterSpacing:1 }}>{"★".repeat(r.stars)}</div>
                      <div style={{ fontWeight:600, fontSize:13 }}>{r.name}</div>
                      <div style={{ fontSize:11, color:C.slateLight, marginLeft:"auto" }}>{r.days}</div>
                      {r.via&&<span style={{ fontSize:10, color:C.teal, fontWeight:600, background:C.tealPale, padding:"2px 8px", borderRadius:20 }}>via Iryss ✓</span>}
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
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:22 }}>
                <SC label="Today's appointments" value={APPOINTMENTS.length}                          accent={`linear-gradient(90deg,${C.teal},${C.tealLt})`} onDrill={()=>setDrill("all-appts")} />
                <SC label="Confirmed"            value={APPOINTMENTS.filter(a=>a.confirmed).length}  accent={`linear-gradient(90deg,${C.green},#34D399)`}   onDrill={()=>setDrill("confirmed-appts")} />
                <SC label="Booked via Iryss"     value={APPOINTMENTS.filter(a=>a.viaIryss).length}  sub="WhatsApp bookings" accent={`linear-gradient(90deg,${C.purple},#A78BFA)`} onDrill={()=>setDrill("iryss-appts")} />
              </div>
              <div style={{ background:C.white, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}>
                <div style={{ display:"grid", gridTemplateColumns:"80px 1fr 180px 160px 120px", gap:12, padding:"12px 20px", borderBottom:`1px solid ${C.border}`, background:"#FAFBFC" }}>
                  {["Time","Patient","Type","Optician","Status"].map(h=>(
                    <div key={h} style={{ fontSize:10, fontWeight:700, color:C.slateLight, textTransform:"uppercase", letterSpacing:1 }}>{h}</div>
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
                    <span style={{ fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:20, background:a.confirmed?"rgba(16,185,129,.1)":"rgba(245,158,11,.1)", color:a.confirmed?C.green:C.amber }}>
                      {a.confirmed?"Confirmed":"Unconfirmed"}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:18, background:`linear-gradient(135deg,${C.navy} 0%,#0E2040 100%)`, borderRadius:16, padding:22, display:"flex", alignItems:"center", gap:16, boxShadow:"0 4px 20px rgba(8,15,30,.15)" }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:15, color:C.white, letterSpacing:-0.3 }}>Log an appointment</div>
                  <div style={{ fontSize:13, color:"rgba(255,255,255,.4)", marginTop:4 }}>After logging, Iryss sends a WhatsApp check-in after 24hrs and a Google review request if they're happy.</div>
                </div>
                <button style={{ background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:10, padding:"12px 24px", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:F, flexShrink:0, boxShadow:"0 4px 14px rgba(8,145,178,.4)" }}>+ Log appointment</button>
              </div>
            </div>
          )}

          {/* ═══ AI RECEPTIONIST ═══ */}
          {nav==="receptionist"&&(
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:22 }}>
                <SC label="Conversations handled" value="142" sub="This month"     accent={`linear-gradient(90deg,${C.teal},${C.tealLt})`} onDrill={()=>setDrill("conversations")} />
                <SC label="Avg response time"     value="<2s" sub="24/7 available" accent={`linear-gradient(90deg,${C.green},#34D399)`} />
                <SC label="Escalated to human"    value="3"   sub="This month"     accent={`linear-gradient(90deg,${C.amber},#EAB308)`} onDrill={()=>setDrill("escalated")} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
                <div style={{ background:C.navy, borderRadius:16, overflow:"hidden", boxShadow:"0 4px 20px rgba(8,15,30,.15)" }}>
                  <div style={{ background:"rgba(255,255,255,.04)", padding:"10px 16px", display:"flex", alignItems:"center", gap:8, borderBottom:"1px solid rgba(255,255,255,.05)" }}>
                    <div style={{ width:10, height:10, borderRadius:"50%", background:"#EF4444" }} />
                    <div style={{ width:10, height:10, borderRadius:"50%", background:"#F59E0B" }} />
                    <div style={{ width:10, height:10, borderRadius:"50%", background:"#10B981" }} />
                    <span style={{ fontSize:11, color:"rgba(255,255,255,.35)", marginLeft:6 }}>AI Receptionist · Live Conversation</span>
                    <span style={{ marginLeft:"auto", fontSize:10, color:"#6EE7B7", fontWeight:600, display:"flex", alignItems:"center", gap:4 }}>
                      <span style={{ width:6, height:6, borderRadius:"50%", background:"#6EE7B7", display:"inline-block", boxShadow:"0 0 6px rgba(110,231,183,.7)" }} />
                      Live
                    </span>
                  </div>
                  <div style={{ padding:20, display:"flex", flexDirection:"column", gap:10 }}>
                    {[
                      { from:"patient",  text:"Hi, do you do multifocal contact lenses? I've been struggling with reading glasses on top of my monthlies" },
                      { from:"practice", text:"Hi James! Yes we do 😊 Multifocal contact lenses are brilliant for exactly that situation. We fit daily and monthly multifocals including Acuvue Oasys and CooperVision Biofinity Multifocal.\n\nIt'd be worth a fitting appointment so we can find the right lens. Shall I check availability?" },
                      { from:"patient",  text:"Yes please! What's the earliest?" },
                      { from:"practice", text:"I have Thursday 20th at 11am or Friday 21st at 3:30pm — which suits you better? 😊" },
                    ].map((msg,i)=>(
                      <div key={i} style={{ display:"flex", justifyContent:msg.from==="practice"?"flex-end":"flex-start" }}>
                        <div style={{ maxWidth:"75%", padding:"10px 14px", borderRadius:msg.from==="practice"?"14px 14px 4px 14px":"14px 14px 14px 4px", background:msg.from==="practice"?"rgba(8,145,178,.2)":"rgba(255,255,255,.06)", border:`1px solid ${msg.from==="practice"?"rgba(8,145,178,.25)":"rgba(255,255,255,.07)"}`, fontSize:12, color:"rgba(255,255,255,.82)", lineHeight:1.55, whiteSpace:"pre-wrap" }}>
                          {msg.from==="practice"&&<div style={{ fontSize:9, color:C.tealLt, fontWeight:700, marginBottom:4, textTransform:"uppercase", letterSpacing:1 }}>Iryss AI</div>}
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                  <div style={{ background:C.white, borderRadius:16, padding:20, border:`1px solid ${C.border}`, boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}>
                    <div style={{ fontWeight:700, fontSize:14, marginBottom:12, letterSpacing:-0.3 }}>🎓 What the AI knows</div>
                    {["Glasses · frames · varifocals · progressives","Contact lenses (daily, monthly, multifocal, toric)","Eye conditions — dry eye, myopia, presbyopia","Appointment booking & availability","NHS vs private options & pricing","Children's eye health & myopia management","Opening hours, location, parking"].map((item,i,arr)=>(
                      <div key={i} style={{ display:"flex", gap:8, alignItems:"center", padding:"6px 0", borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none" }}>
                        <span style={{ color:C.green, fontSize:13, fontWeight:700 }}>✓</span>
                        <span style={{ fontSize:13, color:C.slate }}>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background:"rgba(239,68,68,.04)", borderRadius:16, padding:20, border:"1px solid rgba(239,68,68,.1)" }}>
                    <div style={{ fontWeight:700, fontSize:14, marginBottom:8, letterSpacing:-0.3 }}>🚨 Escalation triggers</div>
                    <div style={{ fontSize:13, color:C.slate, lineHeight:1.7 }}>When a patient mentions <strong>sudden vision loss</strong>, <strong>eye pain</strong>, <strong>flashes or floaters</strong> — Iryss immediately alerts your team and pauses the AI response.</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══ DRILLDOWN PANELS ═══ */}

      {drill==="at-risk"&&(
        <DrillPanel title="Patients at Risk" sub="March 2026 · high & medium risk" onClose={()=>setDrill(null)} onFullPage={()=>goNav("patients")}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
            {[{label:"High risk",value:highRisk.length,c:C.red},{label:"Medium risk",value:medRisk.length,c:C.amber}].map(s=>(
              <div key={s.label} style={{ background:C.cream, borderRadius:12, padding:"14px 16px", border:`1px solid ${C.border}`, textAlign:"center" }}>
                <div style={{ fontSize:26, fontWeight:800, color:s.c, letterSpacing:-1 }}>{s.value}</div>
                <div style={{ fontSize:11, color:C.slate, marginTop:3 }}>{s.label}</div>
              </div>
            ))}
          </div>
          {PATIENTS.filter(p=>p.risk!=="low").map((p,i,arr)=><PatientRow key={p.id} p={p} i={i} total={arr.length} showWA waSent={waSent} onSendWA={p=>{setDrill(null);openSendWA(p);}} />)}
        </DrillPanel>
      )}

      {drill==="high-risk"&&(
        <DrillPanel title="High Risk Patients" sub={`${highRisk.length} patients · Score 70–100`} onClose={()=>setDrill(null)} onFullPage={()=>goNav("patients")}>
          <div style={{ background:"rgba(239,68,68,.05)", border:"1px solid rgba(239,68,68,.12)", borderRadius:12, padding:"12px 16px", marginBottom:20 }}>
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

      {drill==="rev-risk"&&(
        <DrillPanel title="Revenue at Risk" sub="High + medium risk patients this month" onClose={()=>setDrill(null)} onFullPage={()=>goNav("revenue")}>
          <div style={{ background:"rgba(239,68,68,.05)", border:"1px solid rgba(239,68,68,.12)", borderRadius:12, padding:"14px 16px", marginBottom:20 }}>
            <div style={{ fontSize:11, color:C.slate, textTransform:"uppercase", letterSpacing:1.2, marginBottom:4 }}>Total at risk</div>
            <div style={{ fontSize:34, fontWeight:800, color:C.red, letterSpacing:-1 }}>£{atRiskRevenue.toLocaleString()}</div>
          </div>
          {PATIENTS.filter(p=>p.risk!=="low").sort((a,b)=>b.revenue-a.revenue).map((p,i,arr)=>(
            <div key={p.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none" }}>
              <Avatar initials={p.initials} bg={p.risk==="high"?C.red:C.amber} size={38} />
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:14 }}>{p.name}</div>
                <div style={{ fontSize:12, color:C.slate, marginTop:2 }}>{p.product} · {p.lastVisit}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:18, fontWeight:800, color:p.risk==="high"?C.red:C.amber, letterSpacing:-0.5 }}>£{p.revenue}</div>
                <Chip color={riskFg[p.risk]}>{riskLabel[p.risk]}</Chip>
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
          <div style={{ background:"rgba(16,185,129,.05)", border:"1px solid rgba(16,185,129,.12)", borderRadius:12, padding:"14px 16px", marginBottom:20 }}>
            <div style={{ fontSize:11, color:C.slate, textTransform:"uppercase", letterSpacing:1.2, marginBottom:4 }}>Recovered this month</div>
            <div style={{ fontSize:34, fontWeight:800, color:C.green, letterSpacing:-1 }}>{recovered.length} patients</div>
          </div>
          {recovered.map((p,i)=>(
            <div key={p.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 0", borderBottom:i<recovered.length-1?`1px solid ${C.border}`:"none" }}>
              <Avatar initials={p.initials} bg={C.green} size={38} />
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:14 }}>{p.name}</div>
                <div style={{ fontSize:12, color:C.slate, marginTop:2 }}>{p.product} · {p.lastVisit}</div>
                <div style={{ fontSize:11, color:C.green, marginTop:3, fontWeight:600 }}>{p.status==="booked"?"✓ Appointment booked via WhatsApp":"✓ Re-engaged and returned"}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:18, fontWeight:800, color:C.green, letterSpacing:-0.5 }}>£{p.revenue}</div>
                <div style={{ fontSize:11, color:C.slate }}>recovered</div>
              </div>
            </div>
          ))}
        </DrillPanel>
      )}

      {drill==="rev-recovered"&&(
        <DrillPanel title="Revenue Recovered" sub="This month via Iryss" onClose={()=>setDrill(null)} onFullPage={()=>goNav("revenue")}>
          <div style={{ background:"rgba(8,145,178,.05)", border:"1px solid rgba(8,145,178,.12)", borderRadius:12, padding:"14px 16px", marginBottom:20 }}>
            <div style={{ fontSize:11, color:C.slate, textTransform:"uppercase", letterSpacing:1.2, marginBottom:4 }}>Total recovered</div>
            <div style={{ fontSize:34, fontWeight:800, color:C.teal, letterSpacing:-1 }}>£{recoveredRev.toLocaleString()}</div>
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
              <div style={{ fontSize:18, fontWeight:800, color:C.teal, letterSpacing:-0.5 }}>£{p.revenue}</div>
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
                <div style={{ color:"#FBBC05", fontSize:13, letterSpacing:1 }}>{"★".repeat(r.stars)}</div>
                <div style={{ fontWeight:600, fontSize:13 }}>{r.name}</div>
                <div style={{ fontSize:11, color:C.slateLight, marginLeft:"auto" }}>{r.days}</div>
              </div>
              <div style={{ fontSize:13, color:C.slate, lineHeight:1.5, fontStyle:"italic" }}>"{r.text}"</div>
            </div>
          ))}
        </DrillPanel>
      )}

      {drill==="iryss-reviews"&&(
        <DrillPanel title="Reviews via Iryss" sub="38 reviews generated this month automatically" onClose={()=>setDrill(null)}>
          <div style={{ background:"rgba(16,185,129,.05)", border:"1px solid rgba(16,185,129,.12)", borderRadius:12, padding:"14px 16px", marginBottom:20 }}>
            <div style={{ fontSize:11, color:C.slate, textTransform:"uppercase", letterSpacing:1.2, marginBottom:4 }}>Generated via Iryss this month</div>
            <div style={{ fontSize:34, fontWeight:800, color:C.green, letterSpacing:-1 }}>38 reviews</div>
            <div style={{ fontSize:12, color:C.slate, marginTop:4 }}>From 52 requests · 73% response rate</div>
          </div>
          {REVIEWS.filter(r=>r.via).map((r,i,arr)=>(
            <div key={i} style={{ padding:"12px 0", borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                <div style={{ color:"#FBBC05", fontSize:13, letterSpacing:1 }}>{"★".repeat(r.stars)}</div>
                <div style={{ fontWeight:600, fontSize:13 }}>{r.name}</div>
                <span style={{ fontSize:10, color:C.teal, fontWeight:600, background:C.tealPale, padding:"2px 8px", borderRadius:20 }}>via Iryss ✓</span>
                <div style={{ fontSize:11, color:C.slateLight, marginLeft:"auto" }}>{r.days}</div>
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
                <div style={{ fontSize:22, fontWeight:800, color:s.c, letterSpacing:-0.5 }}>{s.value}</div>
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
              <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:20, background:i<3?"rgba(16,185,129,.1)":"rgba(245,158,11,.1)", color:i<3?C.green:C.amber }}>
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
              <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:20, background:a.confirmed?"rgba(16,185,129,.1)":"rgba(245,158,11,.1)", color:a.confirmed?C.green:C.amber }}>
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
              <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:20, background:"rgba(16,185,129,.1)", color:C.green }}>✓ Confirmed</span>
            </div>
          ))}
        </DrillPanel>
      )}

      {drill==="iryss-appts"&&(
        <DrillPanel title="Booked via Iryss WhatsApp" sub={`${APPOINTMENTS.filter(a=>a.viaIryss).length} appointments this month`} onClose={()=>setDrill(null)}>
          <div style={{ background:"rgba(139,92,246,.05)", border:"1px solid rgba(139,92,246,.12)", borderRadius:12, padding:"14px 16px", marginBottom:20 }}>
            <div style={{ fontSize:12, color:C.slate, lineHeight:1.6 }}>These appointments were booked through Iryss WhatsApp re-engagement — patients who would otherwise not have returned.</div>
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
        <DrillPanel title="Conversations Handled" sub="142 AI conversations this month" onClose={()=>setDrill(null)}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
            {[{label:"Booking enquiries",value:"61",c:C.teal},{label:"Product questions",value:"44",c:C.purple},{label:"Appointment changes",value:"24",c:C.amber},{label:"Escalated to human",value:"3",c:C.red}].map(s=>(
              <div key={s.label} style={{ background:C.cream, borderRadius:10, padding:"12px 14px", border:`1px solid ${C.border}`, textAlign:"center" }}>
                <div style={{ fontSize:22, fontWeight:800, color:s.c, letterSpacing:-0.5 }}>{s.value}</div>
                <div style={{ fontSize:11, color:C.slate, marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>
          {[
            { patient:"James Brew",     topic:"Multifocal contact lens enquiry → appointment booked", time:"Today 14:32",  resolved:true  },
            { patient:"Ciara Murphy",   topic:"Asked about eye test frequency for children",           time:"Today 11:00",  resolved:true  },
            { patient:"Sarah Flynn",    topic:"Appointment reminder confirmation",                     time:"Today 09:00",  resolved:true  },
            { patient:"Robert Hughes",  topic:"Query about varifocal adaptation period",               time:"Yesterday",    resolved:true  },
            { patient:"Emma Wilson",    topic:"Asked about contact lens trial process",                time:"Yesterday",    resolved:true  },
            { patient:"Margaret Flynn", topic:"Reported blurry vision — escalated to clinician",       time:"Today 09:18",  resolved:false },
          ].map((c,i,arr)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none" }}>
              <Avatar initials={c.patient.split(" ").map(w=>w[0]).join("").slice(0,2)} bg={c.resolved?C.teal:C.red} size={36} />
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:13 }}>{c.patient}</div>
                <div style={{ fontSize:12, color:C.slate, marginTop:2 }}>{c.topic}</div>
                <div style={{ fontSize:11, color:C.slateLight, marginTop:2 }}>{c.time}</div>
              </div>
              <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:20, background:c.resolved?"rgba(16,185,129,.1)":"rgba(239,68,68,.1)", color:c.resolved?C.green:C.red }}>
                {c.resolved?"Resolved":"Escalated"}
              </span>
            </div>
          ))}
        </DrillPanel>
      )}

      {drill==="escalated"&&(
        <DrillPanel title="Escalated to Human" sub="3 conversations this month" onClose={()=>setDrill(null)}>
          <div style={{ background:"rgba(245,158,11,.05)", border:"1px solid rgba(245,158,11,.15)", borderRadius:12, padding:"12px 16px", marginBottom:20 }}>
            <div style={{ fontSize:12, color:C.slate, lineHeight:1.6 }}>These conversations were flagged by the AI as requiring human clinical judgment and paused automatically.</div>
          </div>
          {[
            { patient:"Margaret Flynn", reason:"Reported blurry vision on left side",   time:"Today 09:18",  status:"Urgent"   },
            { patient:"Robert Cairns",  reason:"Mentioned eye pain after new glasses",  time:"8 Mar 14:32",  status:"Resolved" },
            { patient:"Ann Hughes",     reason:"Asked about symptoms of glaucoma",       time:"5 Mar 11:05",  status:"Resolved" },
          ].map((e,i,arr)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 0", borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none" }}>
              <Avatar initials={e.patient.split(" ").map(w=>w[0]).join("")} bg={i===0?C.red:C.slateLight} size={38} />
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:14 }}>{e.patient}</div>
                <div style={{ fontSize:12, color:C.slate, marginTop:2 }}>{e.reason}</div>
                <div style={{ fontSize:11, color:C.slateLight, marginTop:2 }}>{e.time}</div>
              </div>
              <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:20, background:i===0?"rgba(239,68,68,.1)":"rgba(16,185,129,.1)", color:i===0?C.red:C.green }}>
                {e.status}
              </span>
            </div>
          ))}
        </DrillPanel>
      )}

      {/* ── WhatsApp modal ── */}
      {showSendWA&&(
        <div style={{ position:"fixed", inset:0, background:"rgba(8,15,30,.8)", zIndex:950, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(4px)" }} onClick={()=>setShowSendWA(null)}>
          <div onClick={e=>e.stopPropagation()} style={{ background:C.white, borderRadius:20, padding:28, width:520, boxShadow:"0 40px 120px rgba(0,0,0,.4)", fontFamily:F }}>
            <div style={{ fontWeight:700, fontSize:17, marginBottom:4, letterSpacing:-0.4 }}>Send WhatsApp to {showSendWA.name}</div>
            <div style={{ fontSize:12, color:C.slate, marginBottom:16 }}>Risk: <span style={{ color:riskFg[showSendWA.risk], fontWeight:700 }}>{riskLabel[showSendWA.risk]}</span> · Last visit: {showSendWA.lastVisit}</div>
            <textarea value={waMsg} onChange={e=>setWaMsg(e.target.value)}
              style={{ width:"100%", height:180, border:`1px solid ${C.border}`, borderRadius:12, padding:14, fontSize:13, fontFamily:F, resize:"none", outline:"none", boxSizing:"border-box", lineHeight:1.65, color:C.navy }} />
            <div style={{ display:"flex", gap:10, marginTop:16 }}>
              <button onClick={()=>setShowSendWA(null)} style={{ flex:1, background:C.cream, border:`1px solid ${C.border}`, borderRadius:10, padding:12, fontWeight:600, fontSize:14, cursor:"pointer", fontFamily:F, color:C.navy }}>Cancel</button>
              <button onClick={()=>confirmSendWA(showSendWA.id)} style={{ flex:2, background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, border:"none", borderRadius:10, padding:12, fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:F, color:"#fff", boxShadow:"0 4px 14px rgba(8,145,178,.4)" }}>
                Send WhatsApp ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
