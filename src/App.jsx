import { useState, useRef, useEffect } from "react";

// ── Google Font import via style injection ───────────────────────────
const fontStyle = document.createElement('style');
fontStyle.textContent = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');`;
document.head.appendChild(fontStyle);

const pulseStyle = document.createElement('style');
pulseStyle.textContent = `
  @keyframes pulseDot { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.4);opacity:.7} }
  @keyframes pulseRing { 0%{box-shadow:0 0 0 0 rgba(239,68,68,.55)} 70%{box-shadow:0 0 0 7px rgba(239,68,68,0)} 100%{box-shadow:0 0 0 0 rgba(239,68,68,0)} }
`;
document.head.appendChild(pulseStyle);

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
  { id:"P-001", name:"Louise Everton",  initials:"LE",  phone:"+447827322027", lastVisit:"6 months ago",  product:"Acuvue Oasys Astigmatism", age:33, risk:"low",    riskScore:28, revenue:280, status:"checkin"   },
  { id:"P-002", name:"Tom Bradley",     initials:"TB",  phone:"+447827001002", lastVisit:"9 months ago",  product:"Monthly Contact Lenses",    risk:"medium", riskScore:61, revenue:185, status:"sent"      },
  { id:"P-003", name:"Margaret Flynn",  initials:"MF",  phone:"+447827001003", lastVisit:"11 months ago", product:"Glasses + Contact Lenses",  risk:"high",   riskScore:88, revenue:410, status:"alert"     },
  { id:"P-004", name:"Ciara Murphy",    initials:"CM",  phone:"+447827001004", lastVisit:"4 months ago",  product:"Glasses",                   risk:"low",    riskScore:24, revenue:240, status:"checkin"   },
  { id:"P-005", name:"Jim Bru",         initials:"JB",  phone:"+447803003472", lastVisit:"8 months ago",  product:"No current spectacles or CL", age:44, risk:"medium", riskScore:61, revenue:150, status:"sent"      },
  { id:"P-006", name:"Sarah Flynn",     initials:"SF",  phone:"+447827001006", lastVisit:"3 months ago",  product:"Varifocals",                risk:"low",    riskScore:18, revenue:380, status:"booked"    },
  { id:"P-007", name:"Shona Kay",       initials:"SK",  phone:"+447711552094", lastVisit:"13 months ago", product:"Varifocals + Acuvue Oasys Max", age:62, risk:"high",   riskScore:82, revenue:420, status:"pending"   },
  { id:"P-008", name:"Jess Brown",       initials:"JB2", phone:"+447572043380", lastVisit:"5 months ago",  product:"Monthly CL + Glasses",      risk:"low",    riskScore:31, revenue:220, status:"recovered" },
];


const REVIEWS = [
  { name:"Sarah M.",    stars:5, text:"Got a lovely WhatsApp the day after my appointment — such a personal touch. Couldn't not leave a review!", days:"1 day ago",   via:true  },
  { name:"Claire D.",   stars:5, text:"They followed up after my kids' appointment to check we were happy. Brilliant practice.",                  days:"3 days ago",  via:true  },
  { name:"Tom B.",      stars:5, text:"New glasses are perfect. The WhatsApp check-in was a really nice touch — felt genuinely cared for.",       days:"1 week ago",  via:true  },
  { name:"Patricia R.", stars:5, text:"Fantastic service from start to finish. Was surprised to get a message checking in afterwards!",            days:"2 weeks ago", via:false },
];

const REVIEW_REQUESTS = [
  { patient:"Emma Wilson",    date:"18 Mar", trigger:"Appointment confirmed", status:"left",    phone:"+447827001010" },
  { patient:"Tom Bradley",    date:"18 Mar", trigger:"Positive reply",        status:"pending", phone:"+447827001002" },
  { patient:"Priya Sharma",   date:"17 Mar", trigger:"Appointment confirmed", status:"left",    phone:"+447827001011" },
  { patient:"Jim Bru",     date:"15 Mar", trigger:"Positive reply",        status:"pending", phone:"+447803003472" },
  { patient:"Sarah Flynn",    date:"14 Mar", trigger:"Appointment confirmed", status:"none",    phone:"+447827001006" },
  { patient:"Ciara Murphy",   date:"12 Mar", trigger:"Positive reply",        status:"left",    phone:"+447827001004" },
  { patient:"Louise Everton", date:"10 Mar", trigger:"Appointment confirmed", status:"none",    phone:"+447827322027" },
  { patient:"Margaret Flynn", date:"8 Mar",  trigger:"Positive reply",        status:"pending", phone:"+447827001003" },
];

const STAR_BREAKDOWN = [
  { stars:5, count:132 }, { stars:4, count:10 }, { stars:3, count:3 }, { stars:2, count:1 }, { stars:1, count:1 },
];
const REVIEW_THEMES = [
  { label:"Friendly staff",       pct:78 },
  { label:"Professional advice",  pct:65 },
  { label:"Quick service",        pct:59 },
  { label:"Good value",           pct:43 },
];

const APPOINTMENTS = [
  { patient:"Emma Wilson",    type:"Eye Test",              time:"09:00", optician:"Dr. Patel", confirmed:true,  viaIryss:false, revenue:45,  phone:"+447827001010" },
  { patient:"Tom Bradley",    type:"Contact Lens Fitting",  time:"10:30", optician:"Dr. Chen",  confirmed:true,  viaIryss:true,  revenue:120, phone:"+447827001002" },
  { patient:"Priya Sharma",   type:"Glasses Collection",    time:"11:15", optician:"Dr. Patel", confirmed:true,  viaIryss:false, revenue:340, phone:"+447827001011" },
  { patient:"Jim Bru",     type:"Multifocal CL Trial",   time:"15:30", optician:"Dr. Chen",  confirmed:true,  viaIryss:true,  revenue:85,  phone:"+447803003472" },
  { patient:"Carol Mitchell", type:"Follow-Up",             time:"17:00", optician:"Dr. Patel", confirmed:false, viaIryss:false, revenue:30,  phone:"+447827001012" },
];

const UPCOMING_WEEK = [
  { day:"Monday",    date:"23 March", appts:[
    { patient:"Sarah Flynn",    type:"Eye Test",             time:"09:30", optician:"Dr. Patel", confirmed:true,  revenue:45  },
    { patient:"Robert Hughes",  type:"Contact Lens Check",   time:"11:00", optician:"Dr. Chen",  confirmed:false, revenue:65  },
    { patient:"Ann Hughes",     type:"Varifocal Dispense",   time:"14:30", optician:"Dr. Patel", confirmed:true,  revenue:380 },
  ]},
  { day:"Tuesday",   date:"24 March", appts:[
    { patient:"Ciara Murphy",   type:"Eye Test",             time:"10:00", optician:"Dr. Chen",  confirmed:true,  revenue:45  },
    { patient:"Brian Walsh",    type:"Contact Lens Fitting", time:"14:00", optician:"Dr. Patel", confirmed:false, revenue:120 },
  ]},
  { day:"Wednesday", date:"25 March", appts:[
    { patient:"Louise Everton", type:"Contact Lens Check",   time:"09:00", optician:"Dr. Chen",  confirmed:true,  revenue:65  },
    { patient:"Shona Kay",  type:"Eye Test",             time:"11:30", optician:"Dr. Patel", confirmed:false, revenue:45  },
    { patient:"Mark Graham",    type:"Glasses Collection",   time:"15:00", optician:"Dr. Chen",  confirmed:true,  revenue:280 },
  ]},
  { day:"Thursday",  date:"26 March", appts:[
    { patient:"Tom Bradley",    type:"CL Annual Review",     time:"10:30", optician:"Dr. Patel", confirmed:true,  revenue:85  },
    { patient:"Jess Brown",     type:"Eye Test",             time:"13:00", optician:"Dr. Chen",  confirmed:false, revenue:45  },
  ]},
  { day:"Friday",    date:"27 March", appts:[
    { patient:"Jim Bru",     type:"Multifocal CL Review", time:"09:00", optician:"Dr. Patel", confirmed:true,  revenue:80  },
    { patient:"Patricia Ross",  type:"Varifocal Dispense",   time:"11:00", optician:"Dr. Chen",  confirmed:false, revenue:340 },
    { patient:"David Kelly",    type:"Eye Test",             time:"14:30", optician:"Dr. Patel", confirmed:true,  revenue:45  },
  ]},
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
  const [patientTimeline, setPatientTimeline] = useState(null);
  const [prevNav, setPrevNav] = useState("dashboard");
  const [recallTab, setRecallTab] = useState("eye-test");
  const [autoSend, setAutoSend] = useState(false);
  const [confirmSent, setConfirmSent] = useState({});
  const [reminder48Active, setReminder48Active] = useState(false);
  const [reminder2hActive, setReminder2hActive] = useState(false);
  const [digestEnabled, setDigestEnabled]       = useState(true);
  const [digestTime, setDigestTime]             = useState("8:00am");
  const [showBellDropdown, setShowBellDropdown] = useState(false);
  const [toastMsg, setToastMsg]                 = useState(null);
  const [settingsSaved, setSettingsSaved]       = useState(false);
  const [practiceDetails, setPracticeDetails]   = useState({ name:"Bright Eyes Opticians", email:"louiev@hotmail.co.uk", whatsapp:"+447827322027", google:"" });
  const [autoRecall, setAutoRecall]             = useState(false);
  const [autoReorder, setAutoReorder]           = useState(false);
  const [autoReview, setAutoReview]             = useState(true);
  const [reviewTab, setReviewTab]               = useState("reviews");
  const [reviewSent, setReviewSent]             = useState({});
  const [showImport, setShowImport]             = useState(false);
  const [importStep, setImportStep]             = useState(1);
  const [importDrag, setImportDrag]             = useState(false);
  const [importData, setImportData]             = useState(null);
  const [importProgress, setImportProgress]     = useState(0);
  const [importCounters, setImportCounters]     = useState({ scanned:0, atRisk:0, recalls:0, gap:0 });
  const importFileRef = useRef(null);
  const [revenueTab, setRevenueTab]             = useState("overview");
  const [planSent, setPlanSent]                 = useState({});
  const [intelSent, setIntelSent]               = useState({});

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedThread]);

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
          const mapped = Object.values(grouped).map(c => {
            const sorted = [...c.messages].sort((a, b) => new Date(a.sent_at) - new Date(b.sent_at));
            const latest = sorted[sorted.length - 1];
            const latestInbound = [...sorted].reverse().find(m => m.direction === 'inbound');
            const sentiment = latestInbound?.sentiment || null;
            return {
              id: c.name,
              patient: c.name,
              phone: c.phone,
              initials: c.name.split(' ').map(w=>w[0]).join('').slice(0,2),
              preview: latest?.message_body || '',
              time: new Date(latest?.sent_at).toLocaleTimeString('en-GB', {hour:'2-digit',minute:'2-digit'}),
              unread: latest?.direction === 'inbound',
              urgent: latest?.direction === 'inbound' && (sentiment === 'urgent' || sentiment === 'negative'),
              sentiment,
              thread: sorted.map(m => ({
                from: m.direction === 'inbound' ? 'patient' : 'practice',
                text: m.message_body,
                time: new Date(m.sent_at).toLocaleTimeString('en-GB', {hour:'2-digit',minute:'2-digit'}),
                sent_at: m.sent_at
              }))
            };
          });
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

  function parseMonthsAgo(str) { const m=str.match(/(\d+)\s+month/); return m?parseInt(m[1]):0; }
  function openRecallWA(p) { setShowSendWA(p); setWaMsg(`Hi ${p.name.split(' ')[0]}, it's been 2 years since your last eye test at Bright Eyes — we'd love to see you again. Would you like to book in? 😊\n\nBright Eyes Opticians`); }
  function openReorderWA(p) { setShowSendWA(p); setWaMsg(`Hi ${p.name.split(' ')[0]}, your contact lens supply might be running low — would you like to reorder? We can get them sorted quickly for you 😊\n\nBright Eyes Opticians`); }
  function openReviewWA(name, phone) {
    const firstName = name.split(' ')[0];
    const googleLink = practiceDetails.google || 'https://g.page/brighteyesopticians';
    const resolvedPhone = phone || PATIENTS.find(p=>p.name===name)?.phone || '';
    setShowSendWA({ id:`review-${name}`, name, risk:'low', lastVisit:'Recent', phone:resolvedPhone });
    setWaMsg(`Hi ${firstName}, thank you so much for visiting Bright Eyes Opticians — we hope you had a great experience! If you have a moment, we'd really appreciate it if you could leave us a Google review 😊\n\n${googleLink}`);
  }

  const highRisk      = PATIENTS.filter(p=>p.risk==="high");
  const medRisk       = PATIENTS.filter(p=>p.risk==="medium");
  const lowRisk       = PATIENTS.filter(p=>p.risk==="low");
  const recovered     = PATIENTS.filter(p=>p.status==="recovered"||p.status==="booked");
  const atRiskRevenue = PATIENTS.filter(p=>p.risk!=="low").reduce((a,p)=>a+p.revenue,0);
  const recoveredRev  = recovered.reduce((a,p)=>a+p.revenue,0);
  const unreadCount     = liveInbox.filter(i=>i.unread).length;
  const urgentMessages  = liveInbox.filter(i=>i.unread && (i.sentiment==='urgent'||i.sentiment==='negative'));
  const urgentCount     = urgentMessages.length;
  const filteredPts   = filterRisk==="all"?PATIENTS:PATIENTS.filter(p=>p.risk===filterRisk);
  const noShowRisk     = APPOINTMENTS.filter(a=>!a.confirmed);
  const recallPatients = PATIENTS.filter(p=>parseMonthsAgo(p.lastVisit)>=8).sort((a,b)=>parseMonthsAgo(b.lastVisit)-parseMonthsAgo(a.lastVisit));
  const overdueRecall  = recallPatients.filter(p=>parseMonthsAgo(p.lastVisit)>=24);
  const reorderPatients = PATIENTS.filter(p=>/contact|lens|cl|oasys/i.test(p.product)&&parseMonthsAgo(p.lastVisit)>=3).sort((a,b)=>parseMonthsAgo(b.lastVisit)-parseMonthsAgo(a.lastVisit));
  const recallRevenue  = recallPatients.reduce((a,p)=>a+p.revenue,0);

  // Compliance
  const recallContacted = recallPatients.filter(p=>waSent[p.id]).length;
  const complianceRate  = recallPatients.length>0 ? Math.round(((recallContacted+1)/recallPatients.length)*100) : 100;

  // Lens plan patients
  const lensPatients = PATIENTS.filter(p=>/contact|lens|cl|oasys|acuvue|dailies|proclear/i.test(p.product));
  const lensUpliftTotal = lensPatients.reduce((a,p)=>a+Math.round(p.revenue*0.2),0);

  // Competitor intelligence
  const COMPETITOR_KW = ["specsavers","vision express","boots","optical express","asda","tesco","cheaper","went elsewhere","another optician","different optician","vision direct","glasses direct"];
  const competitorMentions = liveInbox.flatMap(conv=>
    conv.thread.filter(m=>m.from==='patient'&&COMPETITOR_KW.some(kw=>m.text.toLowerCase().includes(kw)))
      .map(m=>({ patient:conv.patient, phone:conv.phone, convId:conv.id, text:m.text, time:m.time,
        keyword:COMPETITOR_KW.find(kw=>m.text.toLowerCase().includes(kw)) }))
  );

  const waTemplates = {
    high:   `Hi {name} 👋\n\nWe've been thinking about you and just wanted to check in. It's been a while since your last visit — whenever you're ready, we'd love to welcome you back.\n\nJust reply here and we'll sort everything 😊\n\nBright Eyes Opticians`,
    medium: `Hi {name} 👋\n\nIt's the team at Bright Eyes! It's been a little while — we just wanted to make sure everything is still going well with your {product}.\n\nDo get in touch if you have any questions at all 😊`,
    low:    `Hi {name} 👋\n\nHope you're well! Just a quick friendly check-in from Bright Eyes. We're here whenever you need us 😊`,
  };

  function openSendWA(p) {
    setShowSendWA(p);
    setWaMsg(waTemplates[p.risk].replace("{name}",p.name.split(" ")[0]).replace("{product}",p.product));
  }
  async function confirmSendWA(pid) {
    const patient = PATIENTS.find(p=>p.id===pid);
    const phone = patient?.phone || showSendWA?.phone;
    const name = patient?.name || showSendWA?.name || "patient";
    if (!phone) { setShowSendWA(null); return; }
    setShowSendWA(null); setWaMsg("");
    try {
      const res = await fetch("https://iryss-backend-12fh.onrender.com/api/send-whatsapp", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ to: phone, message: waMsg })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(`Failed to send to ${name}: ${data.error || res.statusText}`);
        return;
      }
      if (patient) setWaSent(prev=>({...prev,[pid]:true}));
      else if (typeof pid==='string'&&pid.startsWith('review-')) setReviewSent(prev=>({...prev,[pid]:true}));
      else setConfirmSent(prev=>({...prev,[pid]:true}));
    } catch(e) {
      alert(`Failed to send to ${name}: ${e.message}`);
    }
  }
  function openConfirmationWA(a, idx) {
    const firstName = a.patient.split(' ')[0];
    setShowSendWA({ id:`appt-${idx}`, name:a.patient, risk:'low', lastVisit:'Today', phone:a.phone||'' });
    setWaMsg(`Hi ${firstName}, just a reminder that you have an appointment at Bright Eyes Opticians tomorrow. Please reply YES to confirm or call us to rearrange 😊`);
  }
  function goNav(id) { setDrill(null); setNav(id); }
  function openTimeline(p) {
    const match = PATIENTS.find(pt => pt.name === (p.name || p.patient));
    setPrevNav(nav);
    setPatientTimeline(match || p);
  }

  async function sendInboxReply() {
    if (!sendMsg.trim() || !selectedThread?.phone) return;
    const msg = sendMsg.trim();
    setSendMsg("");
    const now = new Date().toLocaleTimeString('en-GB', {hour:'2-digit', minute:'2-digit'});
    setSelectedThread(prev => ({...prev, thread: [...prev.thread, {from:"practice", text:msg, time:now}]}));
    try {
      const res = await fetch("https://iryss-backend-12fh.onrender.com/api/send-whatsapp", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ to: selectedThread.phone, message: msg })
      });
      if (!res.ok) {
        const data = await res.json();
        alert(`Failed to send: ${data.error || res.statusText}`);
      }
    } catch(e) {
      alert(`Failed to send: ${e.message}`);
    }
  }

  // Polished stat card
  function SC({ label, value, sub, accent, onDrill, trend, trendUp }) {
    return (
      <div onClick={onDrill} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"22px 22px 20px 26px", cursor:onDrill?"pointer":"default", transition:"all .2s", boxShadow:"0 2px 12px rgba(0,0,0,.06), 0 1px 4px rgba(0,0,0,.04)", position:"relative", overflow:"hidden" }}
        onMouseEnter={e=>{ if(onDrill){ e.currentTarget.style.boxShadow=`0 0 0 2px ${C.teal}, 0 12px 28px rgba(8,145,178,.14)`; e.currentTarget.style.transform="translateY(-2px)"; }}}
        onMouseLeave={e=>{ e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,.06), 0 1px 4px rgba(0,0,0,.04)"; e.currentTarget.style.transform="translateY(0)"; }}>
        <div style={{ position:"absolute", top:0, left:0, bottom:0, width:4, background:accent, borderRadius:"16px 0 0 16px" }} />
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:2 }}>
          <div style={{ fontSize:32, fontWeight:800, color:C.navy, letterSpacing:-1.5, lineHeight:1 }}>{value}</div>
          {trend && <span style={{ fontSize:11, fontWeight:700, color:trendUp?C.green:C.red, background:trendUp?"rgba(16,185,129,.1)":"rgba(239,68,68,.1)", padding:"3px 9px", borderRadius:20, flexShrink:0, marginTop:2 }}>{trendUp?"↑":"↓"} {trend}</span>}
        </div>
        <div style={{ fontSize:12, color:C.slate, marginTop:8, fontWeight:500, letterSpacing:0.1 }}>{label}</div>
        {sub && <div style={{ fontSize:11, color:C.teal, marginTop:5, fontWeight:600 }}>{sub}</div>}
        {onDrill && <div style={{ fontSize:10, color:C.slateLight, marginTop:10, display:"flex", alignItems:"center", gap:3 }}>View breakdown <span style={{ fontSize:11 }}>↗</span></div>}
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
    recalls:"Recall & Reorder Automation",
    inbox:"WhatsApp Inbox",
    revenue:"Revenue Dashboard",
    reviews:"Google Reviews",
    appointments:"Today's Appointments",
    receptionist:"AI Receptionist",
    settings:"Settings",
    intelligence:"Competitor Intelligence",
  };

  function showToast(msg) { setToastMsg(msg); setTimeout(()=>setToastMsg(null), 3500); }

  function generateComplianceReport(compRate, recallPts, contactedPts) {
    const status = compRate>=80?"Compliant":compRate>=60?"Review Required":"Action Required";
    const color  = compRate>=80?"#10B981":compRate>=60?"#F59E0B":"#EF4444";
    const today  = new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"});
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Recall Compliance Report — ${practiceDetails.name}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Helvetica Neue',Arial,sans-serif;color:#080F1E;background:#fff;padding:48px}
.header{display:flex;align-items:center;justify-content:space-between;border-bottom:3px solid #0891B2;padding-bottom:20px;margin-bottom:36px}
.logo{font-size:26px;font-weight:800;color:#0891B2;letter-spacing:-1px}.practice{font-size:14px;color:#64748B;margin-top:4px}
.date{font-size:13px;color:#94A3B8;text-align:right}.section{margin-bottom:32px}.section h2{font-size:15px;font-weight:700;color:#080F1E;letter-spacing:.5px;text-transform:uppercase;margin-bottom:16px;padding-bottom:8px;border-bottom:1px solid #E8EEF4}
.hero{background:#F0F4F8;border-radius:12px;padding:28px;text-align:center;margin-bottom:28px}.hero-rate{font-size:64px;font-weight:800;color:${color};letter-spacing:-3px;line-height:1}
.hero-label{font-size:15px;color:#64748B;margin-top:8px}.status-badge{display:inline-block;background:${compRate>=80?"rgba(16,185,129,.15)":compRate>=60?"rgba(245,158,11,.15)":"rgba(239,68,68,.15)"};color:${color};font-weight:700;font-size:14px;padding:6px 20px;border-radius:30px;margin-top:12px}
.stats{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:24px}.stat{background:#F8FBFD;border:1px solid #E8EEF4;border-radius:10px;padding:18px;text-align:center}
.stat-value{font-size:28px;font-weight:800;color:#080F1E;letter-spacing:-1px}.stat-label{font-size:12px;color:#94A3B8;margin-top:4px}
table{width:100%;border-collapse:collapse}th{font-size:11px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:1px;padding:10px 12px;background:#F8FBFD;text-align:left}
td{font-size:13px;padding:10px 12px;border-bottom:1px solid #E8EEF4}.summary{background:#F0F4F8;border-radius:10px;padding:20px;font-size:14px;color:#080F1E;line-height:1.7}
.footer{margin-top:48px;padding-top:16px;border-top:1px solid #E8EEF4;font-size:11px;color:#94A3B8;display:flex;justify-content:space-between}
@media print{body{padding:24px}.no-print{display:none}}</style></head>
<body>
<div class="header"><div><div class="logo">iryss</div><div class="practice">${practiceDetails.name}</div></div><div class="date"><div style="font-weight:700">Recall Compliance Report</div><div>${today}</div></div></div>
<div class="section"><div class="hero"><div class="hero-rate">${compRate}%</div><div class="hero-label">Overall Recall Compliance Rate</div><div class="status-badge">${status}</div></div>
<div class="stats"><div class="stat"><div class="stat-value">${recallPts.length}</div><div class="stat-label">Patients Due Recall</div></div><div class="stat"><div class="stat-value">${contactedPts}</div><div class="stat-label">Contacted</div></div><div class="stat"><div class="stat-value">${recallPts.length-contactedPts}</div><div class="stat-label">Not Yet Contacted</div></div></div></div>
<div class="section"><h2>Recall Breakdown by Overdue Period</h2><table><tr><th>Overdue Period</th><th>Count</th><th>% of Due Patients</th><th>Status</th></tr>
${[{label:"30–90 days",min:0,max:3},{label:"90–180 days",min:3,max:6},{label:"180 days – 1 year",min:6,max:12},{label:"Over 1 year",min:12,max:999}].map(b=>{const n=recallPts.filter(p=>{const m=parseInt((p.lastVisit||"").match(/(\d+)/)?.[1]||0);return m>b.min&&m<=b.max;}).length;return`<tr><td>${b.label}</td><td>${n}</td><td>${recallPts.length>0?Math.round((n/recallPts.length)*100):0}%</td><td><span style="color:${b.min>=12?"#EF4444":b.min>=6?"#F59E0B":"#64748B"}">${b.min>=12?"Action Required":b.min>=6?"Follow Up":"Monitor"}</span></td></tr>`;}).join("")}
</table></div>
<div class="section"><h2>Summary Statement</h2><div class="summary">This practice maintains a <strong>${compRate}% recall compliance rate</strong> in line with GOC recommendations. ${compRate>=80?"The practice is meeting its obligations for patient recall and is considered compliant.":compRate>=60?"The practice is approaching compliance. Immediate action is recommended to contact remaining patients.":"Immediate action is required. The practice should prioritise contacting overdue patients to meet GOC standards."}</div></div>
<div class="footer"><span>Generated by Iryss — ${practiceDetails.name}</span><span>${today}</span></div>
<script>window.onload=()=>window.print();</script></body></html>`;
    const w = window.open('','_blank','width=900,height=700');
    w.document.write(html);
    w.document.close();
  }

  function parseCSVMonthsAgo(dateStr) {
    if (!dateStr) return 99;
    const d = new Date(dateStr);
    if (isNaN(d)) return 99;
    const now = new Date();
    return Math.floor((now - d) / (1000 * 60 * 60 * 24 * 30.44));
  }

  function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/["\s]/g,''));
    const nameKey    = headers.findIndex(h => h.includes('name'));
    const phoneKey   = headers.findIndex(h => h.includes('phone') || h.includes('mobile') || h.includes('tel'));
    const visitKey   = headers.findIndex(h => h.includes('visit') || h.includes('date') || h.includes('last'));
    const productKey = headers.findIndex(h => h.includes('product') || h.includes('lens') || h.includes('spec') || h.includes('type'));
    return lines.slice(1).map((line, i) => {
      const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g,''));
      const months = parseCSVMonthsAgo(cols[visitKey]);
      const risk = months >= 18 ? 'high' : months >= 12 ? 'medium' : 'low';
      const riskScore = Math.min(99, Math.round((months / 30) * 100));
      const revenue = Math.round(150 + Math.random() * 280);
      return {
        id: `csv-${i}`,
        name:      cols[nameKey]    || `Patient ${i+1}`,
        phone:     cols[phoneKey]   || '',
        lastVisit: months === 99 ? 'Unknown' : `${months} months ago`,
        product:   cols[productKey] || 'Glasses',
        risk, riskScore, revenue,
        initials:  (cols[nameKey]||`P${i+1}`).split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase(),
      };
    }).filter(r => r.name && r.name !== 'Patient 1' || lines.length > 2);
  }

  function runImportAnalysis(rows) {
    setImportStep(2);
    setImportProgress(0);
    setImportCounters({ scanned:0, atRisk:0, recalls:0, gap:0 });
    const totalScanned = rows.length;
    const atRisk = rows.filter(r=>r.risk!=='low').length;
    const recalls = rows.filter(r=>parseCSVMonthsAgo(null)>=18||r.risk==='high'||r.risk==='medium').length;
    const gap = rows.reduce((a,r)=>a+(r.risk!=='low'?r.revenue:0), 0);
    let elapsed = 0;
    const tick = setInterval(() => {
      elapsed += 80;
      const pct = Math.min(100, Math.round((elapsed / 3000) * 100));
      setImportProgress(pct);
      setImportCounters({
        scanned: Math.round((pct/100) * totalScanned),
        atRisk:  Math.round((pct/100) * atRisk),
        recalls: Math.round((pct/100) * recalls),
        gap:     Math.round((pct/100) * gap),
      });
      if (pct >= 100) { clearInterval(tick); setImportStep(3); }
    }, 80);
  }

  function handleImportFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      const rows = parseCSV(e.target.result);
      setImportData(rows);
      runImportAnalysis(rows);
    };
    reader.readAsText(file);
  }

  function useDemoImport() {
    const rows = PATIENTS.map(p => ({
      ...p,
      lastVisit: p.lastVisit,
    }));
    setImportData(rows);
    runImportAnalysis(rows);
  }

  function resetImport() { setImportStep(1); setImportData(null); setImportProgress(0); setImportCounters({ scanned:0, atRisk:0, recalls:0, gap:0 }); }

  return (
    <div onClick={()=>setShowBellDropdown(false)} style={{ display:"flex", height:"100vh", fontFamily:F, background:"#EEF2F7", color:C.navy, overflow:"hidden" }}>

      {/* ── Sidebar ── */}
      <div style={{ width:236, background:C.navy, display:"flex", flexDirection:"column", flexShrink:0, padding:"0 12px 20px", borderRight:"1px solid rgba(255,255,255,.05)" }}>
        <div style={{ padding:"10px 0 18px", borderBottom:"1px solid rgba(255,255,255,.07)", marginBottom:14 }}>
          <img src="/iryss-logo.svg" alt="Iryss" style={{ height:"96px", objectFit:"contain" }} />
          <div style={{ fontSize:11, color:"rgba(255,255,255,.28)", letterSpacing:1.5, textTransform:"uppercase", marginTop:10, fontWeight:600 }}>Bright Eyes Opticians</div>
        </div>

        <nav style={{ display:"flex", flexDirection:"column", gap:1, flex:1 }}>
          {[
            { id:"dashboard",    label:"Dashboard",        icon:"◈"  },
            { id:"patients",     label:"At-Risk Patients", icon:"◎", badge:highRisk.length },
            { id:"recalls",      label:"Recalls",          icon:"◷", badge:recallPatients.length, warnDot:complianceRate<80&&recallPatients.length>0 },
            { id:"inbox",        label:"Inbox",            icon:"◻", badge:unreadCount, urgentDot:urgentCount>0, urgentBadge:urgentCount },
            { id:"revenue",      label:"Revenue",          icon:"◇"  },
            { id:"intelligence", label:"Intelligence",     icon:"🎯", badge:competitorMentions.length>0?competitorMentions.length:0 },
            { id:"reviews",      label:"Google Reviews",   icon:"◆" },
          ].map(item=>(
            <button key={item.id} onClick={()=>goNav(item.id)} style={{
              display:"flex", alignItems:"center", gap:11, width:"100%", padding:"11px 12px",
              border:"none", background:nav===item.id?"rgba(8,145,178,.2)":"transparent",
              borderRadius:10, cursor:"pointer",
              color:nav===item.id?"#fff":"rgba(255,255,255,.42)",
              fontWeight:nav===item.id?700:400, fontSize:13.5, fontFamily:F, textAlign:"left",
              borderLeft:nav===item.id?`3px solid ${C.teal}`:"3px solid transparent",
              transition:"all .15s", letterSpacing:-0.1
            }}
              onMouseEnter={e=>{ if(nav!==item.id){ e.currentTarget.style.background="rgba(255,255,255,.05)"; e.currentTarget.style.color="rgba(255,255,255,.75)"; }}}
              onMouseLeave={e=>{ if(nav!==item.id){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="rgba(255,255,255,.42)"; }}}>
              <span style={{ fontSize:14, width:18, textAlign:"center", opacity:nav===item.id?1:0.65 }}>{item.icon}</span>
              <span style={{ flex:1 }}>{item.label}</span>
              {item.warnDot   && <span style={{ width:8, height:8, borderRadius:"50%", background:C.amber, flexShrink:0, display:"inline-block" }} />}
              {item.urgentDot && <span style={{ width:8, height:8, borderRadius:"50%", background:C.red, flexShrink:0, display:"inline-block", animation:"pulseDot 1.5s ease-in-out infinite, pulseRing 1.5s ease-in-out infinite" }} />}
              {item.urgentBadge>0
                ? <span style={{ background:C.red, color:"#fff", borderRadius:20, fontSize:10, fontWeight:700, padding:"2px 7px", minWidth:20, textAlign:"center", animation:"pulseRing 1.5s ease-in-out infinite" }}>{item.urgentBadge}</span>
                : item.badge>0 && <span style={{ background:"rgba(239,68,68,.7)", color:"#fff", borderRadius:20, fontSize:10, fontWeight:700, padding:"2px 7px", minWidth:20, textAlign:"center" }}>{item.badge}</span>
              }
            </button>
          ))}
          <div style={{ height:1, background:"rgba(255,255,255,.06)", margin:"10px 4px" }} />
          {[
            { id:"appointments", label:"Appointments",     icon:"▦" },
            { id:"receptionist", label:"AI Receptionist",  icon:"⬡" },
          ].map(item=>(
            <button key={item.id} onClick={()=>goNav(item.id)} style={{
              display:"flex", alignItems:"center", gap:11, width:"100%", padding:"11px 12px",
              border:"none", background:nav===item.id?"rgba(8,145,178,.2)":"transparent",
              borderRadius:10, cursor:"pointer",
              color:nav===item.id?"#fff":"rgba(255,255,255,.42)",
              fontWeight:nav===item.id?700:400, fontSize:13.5, fontFamily:F, textAlign:"left",
              borderLeft:nav===item.id?`3px solid ${C.teal}`:"3px solid transparent",
              transition:"all .15s", letterSpacing:-0.1
            }}
              onMouseEnter={e=>{ if(nav!==item.id){ e.currentTarget.style.background="rgba(255,255,255,.05)"; e.currentTarget.style.color="rgba(255,255,255,.75)"; }}}
              onMouseLeave={e=>{ if(nav!==item.id){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="rgba(255,255,255,.42)"; }}}>
              <span style={{ fontSize:14, width:18, textAlign:"center", opacity:nav===item.id?1:0.65 }}>{item.icon}</span>
              <span style={{ flex:1 }}>{item.label}</span>
            </button>
          ))}
          <div style={{ marginTop:"auto" }}>
            <div style={{ height:1, background:"rgba(255,255,255,.06)", margin:"10px 4px" }} />
            <button onClick={()=>goNav("settings")} style={{
              display:"flex", alignItems:"center", gap:11, width:"100%", padding:"11px 12px",
              border:"none", background:nav==="settings"?"rgba(8,145,178,.2)":"transparent",
              borderRadius:10, cursor:"pointer",
              color:nav==="settings"?"#fff":"rgba(255,255,255,.42)",
              fontWeight:nav==="settings"?700:400, fontSize:13.5, fontFamily:F, textAlign:"left",
              borderLeft:nav==="settings"?`3px solid ${C.teal}`:"3px solid transparent",
              transition:"all .15s", letterSpacing:-0.1
            }}
              onMouseEnter={e=>{ if(nav!=="settings"){ e.currentTarget.style.background="rgba(255,255,255,.05)"; e.currentTarget.style.color="rgba(255,255,255,.75)"; }}}
              onMouseLeave={e=>{ if(nav!=="settings"){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="rgba(255,255,255,.42)"; }}}>
              <span style={{ fontSize:14, width:18, textAlign:"center", opacity:nav==="settings"?1:0.65 }}>⚙</span>
              <span style={{ flex:1 }}>Settings</span>
            </button>
          </div>
        </nav>

        <div style={{ borderTop:"1px solid rgba(255,255,255,.07)", paddingTop:16, marginTop:8 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 10px", background:"rgba(16,185,129,.08)", borderRadius:8, marginBottom:6 }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:C.green, boxShadow:"0 0 8px rgba(16,185,129,.7)", flexShrink:0 }} />
            <span style={{ fontSize:12, color:"rgba(255,255,255,.5)", fontWeight:500 }}>All systems live</span>
          </div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,.2)", padding:"2px 10px" }}>Next AI scoring: 02:00</div>
        </div>
      </div>

      {/* ── Main ── */}
      <div style={{ flex:1, overflow:"auto", display:"flex", flexDirection:"column" }}>

        {/* Topbar */}
        <div style={{ background:C.white, borderBottom:`1px solid ${C.border}`, padding:"16px 32px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0, boxShadow:"0 1px 4px rgba(0,0,0,.05)" }}>
          <div>
            <div style={{ fontSize:22, fontWeight:800, color:C.navy, letterSpacing:-0.6 }}>{patientTimeline ? (patientTimeline.name||patientTimeline.patient||"Patient") : pageTitles[nav]}</div>
            <div style={{ fontSize:12, color:C.slateLight, marginTop:3, fontWeight:500 }}>
              {new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <button onClick={e=>{ e.stopPropagation(); setShowImport(true); resetImport(); }} style={{ display:"flex", alignItems:"center", gap:7, background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:10, padding:"9px 16px", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:F, boxShadow:"0 2px 10px rgba(8,145,178,.3)", flexShrink:0 }}>
              <span style={{ fontSize:15 }}>⬆</span> Import Patients
            </button>
            {urgentCount>0&&(
              <div onClick={()=>goNav("inbox")} style={{ background:"rgba(239,68,68,.07)", border:"1px solid rgba(239,68,68,.18)", borderRadius:10, padding:"8px 16px", cursor:"pointer", display:"flex", alignItems:"center", gap:7, transition:"background .15s" }}>
                <span style={{ fontSize:14 }}>🚨</span>
                <span style={{ fontSize:12, fontWeight:700, color:C.red }}>{urgentCount} urgent alert{urgentCount>1?"s":""}</span>
              </div>
            )}
            <div style={{ position:"relative" }}>
              <div onClick={()=>setShowBellDropdown(v=>!v)} style={{ position:"relative", cursor:"pointer", width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", background:showBellDropdown?C.offWhite:C.offWhite, borderRadius:10, border:`1px solid ${showBellDropdown?C.teal:C.border}`, transition:"border .15s" }}>
                <span style={{ fontSize:17 }}>🔔</span>
                {unreadCount>0&&<span style={{ position:"absolute", top:-4, right:-4, background:C.red, color:"#fff", borderRadius:20, fontSize:9, fontWeight:800, padding:"2px 5px", minWidth:16, textAlign:"center", lineHeight:1.4 }}>{unreadCount}</span>}
              </div>
              {showBellDropdown&&(()=>{
                const notifs = [
                  ...urgentMessages.map(m=>({ type:"urgent", icon:"🚨", label:`${m.patient} sent an urgent message`, time:m.time, action:()=>{ setSelectedThread(m); goNav("inbox"); setShowBellDropdown(false); } })),
                  ...liveInbox.filter(m=>m.unread&&m.sentiment==='negative'&&!urgentMessages.find(u=>u.id===m.id)).map(m=>({ type:"warning", icon:"⚠️", label:`${m.patient} needs attention`, time:m.time, action:()=>{ setSelectedThread(m); goNav("inbox"); setShowBellDropdown(false); } })),
                  { type:"automation", icon:"✅", label:"Recall reminder sent to overdue patients", time:"02:00", action:null },
                  { type:"automation", icon:"⭐", label:"7 Google review requests sent overnight", time:"01:45", action:null },
                  { type:"automation", icon:"📅", label:"Appointment confirmations sent for today", time:"07:00", action:null },
                ].slice(0,5);
                return (
                  <div onClick={e=>e.stopPropagation()} style={{ position:"absolute", top:44, right:0, width:340, background:C.white, border:`1px solid ${C.border}`, borderRadius:14, boxShadow:"0 12px 40px rgba(0,0,0,.15)", zIndex:800, overflow:"hidden" }}>
                    <div style={{ padding:"14px 16px 10px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div style={{ fontWeight:700, fontSize:14, color:C.navy }}>Notifications</div>
                      <button onClick={()=>setShowBellDropdown(false)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:18, color:C.slateLight, lineHeight:1 }}>×</button>
                    </div>
                    {notifs.length===0?(
                      <div style={{ padding:"28px 16px", textAlign:"center", color:C.slate, fontSize:13 }}>No new notifications</div>
                    ):(
                      notifs.map((n,i)=>(
                        <div key={i} onClick={n.action||undefined} style={{ display:"flex", gap:10, padding:"12px 16px", borderBottom:i<notifs.length-1?`1px solid ${C.border}`:"none", cursor:n.action?"pointer":"default", background:"transparent", transition:"background .12s" }}
                          onMouseEnter={e=>{ if(n.action) e.currentTarget.style.background="rgba(8,145,178,.04)"; }}
                          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                          <span style={{ fontSize:16, flexShrink:0 }}>{n.icon}</span>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:13, color:n.type==="urgent"?C.red:n.type==="warning"?C.amber:C.navy, fontWeight:n.type==="automation"?400:600, lineHeight:1.4 }}>{n.label}</div>
                            <div style={{ fontSize:11, color:C.slateLight, marginTop:3 }}>{n.time}</div>
                          </div>
                          {n.action&&<span style={{ fontSize:11, color:C.teal, fontWeight:600, alignSelf:"center", flexShrink:0 }}>View →</span>}
                        </div>
                      ))
                    )}
                    <div style={{ padding:"10px 16px", borderTop:`1px solid ${C.border}` }}>
                      <button onClick={()=>{ goNav("inbox"); setShowBellDropdown(false); }} style={{ width:"100%", background:"none", border:`1px solid ${C.border}`, borderRadius:8, padding:"8px", fontSize:12, fontWeight:600, color:C.slate, cursor:"pointer", fontFamily:F }}>View all in Inbox →</button>
                    </div>
                  </div>
                );
              })()}
            </div>
            <div onClick={()=>goNav("settings")} style={{ cursor:"pointer" }}>
              <Avatar initials="BE" bg={C.teal} size={36} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflow:"auto", padding:32, background:"linear-gradient(160deg,#F0F4F8 0%,#F8FBFD 100%)" }}>

          {patientTimeline ? (()=>{
            const pt = patientTimeline;
            const name = pt.name||pt.patient||'';
            const initials = pt.initials||name.split(' ').map(w=>w[0]).join('').slice(0,2);
            const inboxEntry = liveInbox.find(m=>m.patient===name);
            const phone = pt.phone||inboxEntry?.phone||'';
            const thread = inboxEntry?.thread||[];
            const prevLabel = ({dashboard:"Dashboard",patients:"Patients",inbox:"Inbox",revenue:"Revenue",reviews:"Reviews",appointments:"Appointments",receptionist:"AI Receptionist"})[prevNav]||"Back";
            const events = [];
            if (pt.product||pt.lastVisit||pt.riskScore!==undefined) {
              events.push({ type:'profile', icon:'👤', label:'Patient record', detail:[pt.product, pt.lastVisit?`Last visit: ${pt.lastVisit}`:null, pt.revenue?`Revenue: £${pt.revenue}`:null].filter(Boolean).join(' · '), riskScore:pt.riskScore });
            }
            thread.forEach(msg=>events.push({type:'message',...msg}));
            return (
              <div>
                <button onClick={()=>setPatientTimeline(null)} style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:8, padding:"7px 14px", fontSize:13, color:C.slate, cursor:"pointer", fontFamily:F, fontWeight:600, display:"inline-flex", alignItems:"center", gap:6, marginBottom:24 }}>← {prevLabel}</button>
                <div style={{ background:C.white, borderRadius:16, padding:"24px 28px", marginBottom:28, display:"flex", alignItems:"center", gap:20, border:`1px solid ${C.border}`, boxShadow:"0 2px 12px rgba(0,0,0,.06)" }}>
                  <Avatar initials={initials} bg={pt.risk==="high"?C.red:pt.risk==="medium"?C.amber:C.teal} size={56} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:22, fontWeight:800, color:C.navy, letterSpacing:-0.6 }}>{name}</div>
                    <div style={{ fontSize:13, color:C.slate, marginTop:4, display:"flex", gap:10 }}>
                      {phone&&<span>{phone}</span>}
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:10 }}>
                      {pt.risk&&<Chip color={riskFg[pt.risk]}>{riskLabel[pt.risk]} risk</Chip>}
                      {pt.riskScore!==undefined&&<span style={{ fontSize:11, color:C.slateLight }}>Score: {pt.riskScore}/100</span>}
                      {pt.revenue&&<span style={{ fontSize:11, color:C.slateLight }}>· £{pt.revenue} revenue value</span>}
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:10, alignItems:"center", flexShrink:0 }}>
                    {reviewSent[`review-${pt.name||pt.patient}`]
                      ? <span style={{ fontSize:12, color:C.green, fontWeight:600 }}>Review request sent ✓</span>
                      : <button onClick={()=>openReviewWA(pt.name||pt.patient||'', pt.phone||'')} style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 18px", fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:F, color:C.slate }}>⭐ Review request</button>
                    }
                    {pt.id&&(waSent[pt.id]
                      ?<span style={{ fontSize:13, color:C.green, fontWeight:600 }}>✓ WhatsApp sent</span>
                      :<button onClick={()=>openSendWA(pt)} style={{ background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:10, padding:"11px 22px", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:F, boxShadow:"0 4px 14px rgba(8,145,178,.3)" }}>Send WhatsApp</button>
                    )}
                  </div>
                </div>
                <div style={{ maxWidth:760, margin:"0 auto", position:"relative" }}>
                  <div style={{ position:"absolute", left:"50%", top:0, bottom:0, width:2, background:C.border, transform:"translateX(-1px)", zIndex:0 }} />
                  {events.map((ev,i)=>{
                    const prevEv = events[i-1];
                    const evDate = ev.sent_at?new Date(ev.sent_at):null;
                    const prevDate = prevEv?.sent_at?new Date(prevEv.sent_at):null;
                    const showDateSep = ev.type==='message'&&evDate&&(!prevDate||evDate.toDateString()!==prevDate.toDateString());
                    const tod=new Date(), yes=new Date(); yes.setDate(yes.getDate()-1);
                    const dateLabel = evDate?(evDate.toDateString()===tod.toDateString()?"Today":evDate.toDateString()===yes.toDateString()?"Yesterday":evDate.toLocaleDateString("en-GB",{day:"numeric",month:"long"})):null;
                    if (ev.type==='profile') return (
                      <div key={i} style={{ display:"flex", justifyContent:"center", marginBottom:28, position:"relative", zIndex:1 }}>
                        <div style={{ background:C.white, borderRadius:14, padding:"18px 24px", border:`1px solid ${C.border}`, boxShadow:"0 2px 10px rgba(0,0,0,.06)", maxWidth:"55%", textAlign:"center" }}>
                          <div style={{ fontSize:24, marginBottom:8 }}>{ev.icon}</div>
                          <div style={{ fontWeight:700, fontSize:14, color:C.navy, marginBottom:6 }}>{ev.label}</div>
                          <div style={{ fontSize:12, color:C.slate, lineHeight:1.7 }}>{ev.detail}</div>
                          {ev.riskScore!==undefined&&(
                            <div style={{ marginTop:12 }}>
                              <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:C.slateLight, marginBottom:4 }}><span>Risk score</span><span>{ev.riskScore}/100</span></div>
                              <div style={{ height:5, borderRadius:4, background:C.border }}><div style={{ width:`${ev.riskScore}%`, height:"100%", background:ev.riskScore>=70?C.red:ev.riskScore>=40?C.amber:C.green, borderRadius:4 }} /></div>
                            </div>
                          )}
                        </div>
                        <div style={{ position:"absolute", left:"calc(50% - 8px)", top:"50%", transform:"translateY(-50%)", width:16, height:16, borderRadius:"50%", background:C.navy, border:"3px solid #fff", boxShadow:`0 0 0 2px ${C.border}`, zIndex:2 }} />
                      </div>
                    );
                    if (ev.type==='message') {
                      const isRight = ev.from==='practice';
                      return (
                        <div key={i}>
                          {showDateSep&&<div style={{ display:"flex", justifyContent:"center", margin:"8px 0 16px", position:"relative", zIndex:1 }}><span style={{ fontSize:11, color:C.slate, background:C.border, borderRadius:20, padding:"3px 14px", fontWeight:500 }}>{dateLabel}</span></div>}
                          <div style={{ display:"flex", justifyContent:isRight?"flex-end":"flex-start", marginBottom:10, position:"relative", zIndex:1 }}>
                            <div style={{ maxWidth:"43%", background:isRight?`linear-gradient(135deg,${C.teal},${C.tealLt})`:C.white, color:isRight?"#fff":C.navy, borderRadius:isRight?"16px 16px 4px 16px":"16px 16px 16px 4px", padding:"12px 16px", fontSize:13, lineHeight:1.6, border:!isRight?`1px solid ${C.border}`:"none", boxShadow:"0 2px 10px rgba(0,0,0,.08)", whiteSpace:"pre-wrap" }}>
                              {isRight&&<div style={{ fontSize:9, opacity:0.7, marginBottom:4, textTransform:"uppercase", letterSpacing:1 }}>Bright Eyes · Iryss AI</div>}
                              {ev.text}
                              <div style={{ fontSize:10, opacity:0.55, textAlign:"right", marginTop:6 }}>{ev.time}{isRight?" ✓✓":""}</div>
                            </div>
                            <div style={{ position:"absolute", left:"calc(50% - 6px)", top:14, width:12, height:12, borderRadius:"50%", background:isRight?C.teal:C.white, border:`2px solid ${isRight?C.teal:C.border}`, zIndex:2 }} />
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                  {events.length<=1&&thread.length===0&&(
                    <div style={{ textAlign:"center", padding:"48px 0", color:C.slate, fontSize:14, position:"relative", zIndex:1 }}>
                      <div style={{ fontSize:36, marginBottom:12 }}>💬</div>No WhatsApp conversation yet for this patient.
                    </div>
                  )}
                </div>
              </div>
            );
          })() : (<>

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

              {/* Urgent alerts — live from inbox */}
              {urgentMessages.length>0&&(
                <div style={{ marginBottom:18 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                    <span style={{ width:8, height:8, borderRadius:"50%", background:C.red, display:"inline-block", animation:"pulseDot 1.5s ease-in-out infinite, pulseRing 1.5s ease-in-out infinite", flexShrink:0 }} />
                    <span style={{ fontSize:11, fontWeight:700, color:C.red, textTransform:"uppercase", letterSpacing:1.2 }}>
                      {urgentMessages.length} urgent message{urgentMessages.length>1?"s":""} need attention
                    </span>
                    <button onClick={()=>setDrill("urgent-messages")} style={{ marginLeft:"auto", background:"none", border:`1px solid rgba(239,68,68,.3)`, borderRadius:8, padding:"4px 12px", fontSize:11, fontWeight:700, color:C.red, cursor:"pointer", fontFamily:F }}>
                      View all →
                    </button>
                  </div>
                  {urgentMessages.map((alert,idx)=>(
                    <div key={alert.id} onClick={()=>{ setSelectedThread(alert); goNav("inbox"); }}
                      style={{ background:alert.sentiment==='urgent'?"rgba(239,68,68,.05)":"rgba(245,158,11,.05)", border:`1px solid ${alert.sentiment==='urgent'?"rgba(239,68,68,.18)":"rgba(245,158,11,.2)"}`, borderRadius:14, padding:"13px 18px", marginBottom:idx<urgentMessages.length-1?10:0, display:"flex", alignItems:"center", gap:12, cursor:"pointer", transition:"background .15s", borderLeft:`4px solid ${alert.sentiment==='urgent'?C.red:C.amber}` }}
                      onMouseEnter={e=>e.currentTarget.style.background=alert.sentiment==='urgent'?"rgba(239,68,68,.09)":"rgba(245,158,11,.09)"}
                      onMouseLeave={e=>e.currentTarget.style.background=alert.sentiment==='urgent'?"rgba(239,68,68,.05)":"rgba(245,158,11,.05)"}>
                      <span style={{ fontSize:18, flexShrink:0 }}>{alert.sentiment==='urgent'?'🚨':'⚠️'}</span>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:700, color:alert.sentiment==='urgent'?C.red:C.amber, fontSize:13, display:"flex", alignItems:"center", gap:6 }}>
                          {alert.sentiment==='urgent'?"Urgent":"Needs attention"} — {alert.patient}
                          <span style={{ width:6, height:6, borderRadius:"50%", background:alert.sentiment==='urgent'?C.red:C.amber, display:"inline-block", animation:"pulseDot 1.5s ease-in-out infinite" }} />
                        </div>
                        <div style={{ fontSize:12, color:C.slate, marginTop:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{alert.preview}</div>
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4, flexShrink:0 }}>
                        <div style={{ fontSize:10, color:C.slateLight }}>{alert.time}</div>
                        <span style={{ fontSize:11, color:C.teal, fontWeight:600 }}>Reply now →</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* KPI cards */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:26 }}>
                <SC label="Patients at risk"   value={PATIENTS.filter(p=>p.risk!=="low").length} sub={`${highRisk.length} high · ${medRisk.length} medium`} accent={`linear-gradient(90deg,${C.red},#F97316)`}    onDrill={()=>setDrill("at-risk")}      trend="2 new" trendUp={false} />
                <SC label="Revenue at risk"    value={`£${atRiskRevenue.toLocaleString()}`}       sub="This month"     accent={`linear-gradient(90deg,${C.amber},#EAB308)`}  onDrill={()=>setDrill("rev-risk")}    trend="8%" trendUp={false} />
                <SC label="Patients recovered" value={recovered.length}                           sub="This month"     accent={`linear-gradient(90deg,${C.green},#34D399)`}  onDrill={()=>setDrill("recovered")}   trend="33%" trendUp={true} />
                <SC label="Revenue recovered"  value={`£${recoveredRev.toLocaleString()}`}        sub="This month"     accent={`linear-gradient(90deg,${C.teal},${C.tealLt})`} onDrill={()=>setDrill("rev-recovered")} trend="12%" trendUp={true} />
              </div>

              {/* 3 new alert cards */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:26 }}>
                {/* Competitor Alert */}
                <div style={{ background:C.white, borderRadius:16, padding:20, border:`1px solid ${C.border}`, boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                    <div style={{ fontWeight:700, fontSize:14, letterSpacing:-0.3 }}>🎯 Competitor Alert</div>
                    {competitorMentions.length>0 && <span style={{ background:C.red, color:"#fff", borderRadius:20, padding:"2px 9px", fontSize:11, fontWeight:700 }}>{competitorMentions.length}</span>}
                  </div>
                  {competitorMentions.length===0
                    ? <div style={{ fontSize:12, color:C.slate }}>No competitor mentions detected in recent messages.</div>
                    : <>
                        <div style={{ fontSize:12, color:C.slate, marginBottom:8 }}>Patients mentioned competitors recently</div>
                        <div style={{ fontSize:12, color:C.navy, fontWeight:600, marginBottom:10 }}>
                          Last: "{competitorMentions[competitorMentions.length-1].keyword}" — {competitorMentions[competitorMentions.length-1].patient}
                        </div>
                      </>
                  }
                  <button onClick={()=>goNav("intelligence")} style={{ background:"none", border:"none", color:C.teal, fontSize:12, cursor:"pointer", fontWeight:600, fontFamily:F, padding:0 }}>View Intelligence →</button>
                </div>

                {/* Compliance Score */}
                <div style={{ background:C.white, borderRadius:16, padding:20, border:`1px solid ${C.border}`, boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}>
                  <div style={{ fontWeight:700, fontSize:14, letterSpacing:-0.3, marginBottom:12 }}>📋 Recall Compliance</div>
                  <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:10 }}>
                    <div style={{ fontSize:36, fontWeight:800, color:complianceRate>=80?C.green:complianceRate>=60?C.amber:C.red, letterSpacing:-1 }}>{complianceRate}%</div>
                    <div>
                      <div style={{ fontSize:12, fontWeight:700, color:complianceRate>=80?C.green:complianceRate>=60?C.amber:C.red }}>
                        {complianceRate>=80?"Compliant":complianceRate>=60?"Review Required":"Action Required"}
                      </div>
                      <div style={{ fontSize:11, color:C.slate }}>GOC compliance target: 80%</div>
                    </div>
                  </div>
                  <button onClick={()=>{goNav("recalls");setRecallTab("compliance");}} style={{ background:"none", border:"none", color:C.teal, fontSize:12, cursor:"pointer", fontWeight:600, fontFamily:F, padding:0 }}>View Report →</button>
                </div>

                {/* Lens Plan Conversion */}
                <div style={{ background:C.white, borderRadius:16, padding:20, border:`1px solid ${C.border}`, boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}>
                  <div style={{ fontWeight:700, fontSize:14, letterSpacing:-0.3, marginBottom:12 }}>👁 Lens Plan Conversion</div>
                  <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:10 }}>
                    <div style={{ fontSize:36, fontWeight:800, color:C.teal, letterSpacing:-1 }}>{Object.keys(planSent).length}</div>
                    <div>
                      <div style={{ fontSize:12, fontWeight:700, color:C.navy }}>Patients nudged</div>
                      <div style={{ fontSize:11, color:C.slate }}>Potential uplift: <span style={{ color:C.green, fontWeight:700 }}>£{lensUpliftTotal.toLocaleString()}</span></div>
                    </div>
                  </div>
                  <button onClick={()=>{goNav("revenue");setRevenueTab("lens");}} style={{ background:"none", border:"none", color:C.teal, fontSize:12, cursor:"pointer", fontWeight:600, fontFamily:F, padding:0 }}>View Lens Plans →</button>
                </div>
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
                        <div onClick={e=>{e.stopPropagation();openTimeline(p);}} style={{ fontWeight:600, fontSize:13, cursor:"pointer", color:C.navy }} onMouseEnter={e=>e.target.style.color=C.teal} onMouseLeave={e=>e.target.style.color=C.navy}>{p.name}</div>
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
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
                    <div style={{ fontWeight:700, fontSize:15, color:C.white, letterSpacing:-0.3 }}>⭐ Google Reviews</div>
                    <span onClick={()=>{ setReviewTab("requests"); goNav("reviews"); }} style={{ background:"rgba(245,158,11,.18)", color:C.amber, fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20, cursor:"pointer", border:"1px solid rgba(245,158,11,.3)" }}>
                      3 requests pending
                    </span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:14 }}>
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
                  <div style={{ height:1, background:"rgba(255,255,255,.07)", marginBottom:14 }} />
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
                    {[{label:"Requests sent",value:"52",sub:"This month"},{label:"Conversion rate",value:"73%",sub:"Reviews received"}].map(s=>(
                      <div key={s.label} style={{ background:"rgba(255,255,255,.04)", borderRadius:8, padding:"8px 12px" }}>
                        <div style={{ fontSize:16, fontWeight:800, color:C.white, letterSpacing:-0.5 }}>{s.value}</div>
                        <div style={{ fontSize:10, color:"rgba(255,255,255,.35)", marginTop:2 }}>{s.label}</div>
                      </div>
                    ))}
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
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:26 }}>
                <SC label="High risk"             value={highRisk.length}    accent={`linear-gradient(90deg,${C.red},#F97316)`}    onDrill={()=>setDrill("high-risk")} trend="1 new" trendUp={false} />
                <SC label="Medium risk"           value={medRisk.length}     accent={`linear-gradient(90deg,${C.amber},#EAB308)`}  onDrill={()=>setDrill("med-risk")} />
                <SC label="Total revenue at risk" value={`£${atRiskRevenue.toLocaleString()}`} accent={`linear-gradient(90deg,${C.teal},${C.tealLt})`} onDrill={()=>setDrill("rev-risk")} trend="8%" trendUp={false} />
                <SC label="Patients recovered"    value={recovered.length}   sub="This month" accent={`linear-gradient(90deg,${C.green},#34D399)`} onDrill={()=>setDrill("recovered")} trend="33%" trendUp={true} />
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
                <div style={{ display:"grid", gridTemplateColumns:"1fr 110px 130px 100px 120px 150px", gap:12, padding:"12px 20px", borderBottom:`1px solid ${C.border}`, background:"#FAFBFC" }}>
                  {["Patient","Last Visit","Product","Risk Score","Sentiment","Action"].map(h=>(
                    <div key={h} style={{ fontSize:10, fontWeight:700, color:C.slateLight, textTransform:"uppercase", letterSpacing:1 }}>{h}</div>
                  ))}
                </div>
                {filteredPts.map((p,i)=>{
                  const inboxEntry = liveInbox.find(m=>m.patient===p.name);
                  const sent = inboxEntry?.sentiment;
                  return (
                  <div key={p.id} style={{ display:"grid", gridTemplateColumns:"1fr 110px 130px 100px 120px 150px", gap:12, padding:"15px 20px", borderBottom:i<filteredPts.length-1?`1px solid ${C.border}`:"none", alignItems:"center", background:i%2===0?C.white:"#FAFBFD", transition:"background .12s" }}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(8,145,178,.04)"}
                    onMouseLeave={e=>e.currentTarget.style.background=i%2===0?C.white:"#FAFBFD"}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <Avatar initials={p.initials} bg={p.risk==="high"?C.red:p.risk==="medium"?C.amber:C.green} size={32} />
                      <div>
                        <div onClick={()=>openTimeline(p)} style={{ fontWeight:600, fontSize:13, cursor:"pointer", color:C.navy }} onMouseEnter={e=>e.target.style.color=C.teal} onMouseLeave={e=>e.target.style.color=C.navy}>{p.name}</div>
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
                      {sent==='urgent'  && <span style={{ fontSize:11, fontWeight:700, color:C.red,   background:"rgba(239,68,68,.1)",   padding:"3px 9px", borderRadius:20, display:"inline-flex", alignItems:"center", gap:4, animation:"pulseDot 1.5s ease-in-out infinite" }}>🚨 Urgent</span>}
                      {sent==='negative'&& <span style={{ fontSize:11, fontWeight:700, color:C.amber, background:"rgba(245,158,11,.1)", padding:"3px 9px", borderRadius:20, display:"inline-flex", alignItems:"center", gap:4 }}>⚠️ Concerned</span>}
                      {sent==='positive'&& <span style={{ fontSize:11, fontWeight:700, color:C.green, background:"rgba(16,185,129,.1)", padding:"3px 9px", borderRadius:20, display:"inline-flex", alignItems:"center", gap:4 }}>😊 Positive</span>}
                      {sent==='neutral' && <span style={{ fontSize:11, fontWeight:600, color:C.slate, background:"rgba(100,116,139,.1)", padding:"3px 9px", borderRadius:20 }}>Neutral</span>}
                      {!sent           && <span style={{ fontSize:11, color:C.slateLight }}>No messages</span>}
                    </div>
                    <div>
                      {waSent[p.id]
                        ? <span style={{ fontSize:12, color:C.green, fontWeight:600 }}>✓ Sent</span>
                        : <button onClick={()=>openSendWA(p)} style={{ background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:8, padding:"6px 13px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:F, boxShadow:"0 2px 8px rgba(8,145,178,.3)" }}>Send WhatsApp</button>
                      }
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══ RECALLS ═══ */}
          {nav==="recalls"&&(
            <div>
              {/* Auto-send toggle + status */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24, background:C.white, borderRadius:14, padding:"16px 22px", border:`1px solid ${C.border}`, boxShadow:"0 2px 8px rgba(0,0,0,.05)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  {autoSend
                    ? <span style={{ background:"rgba(16,185,129,.12)", color:C.green, fontWeight:700, fontSize:12, padding:"5px 14px", borderRadius:20, display:"flex", alignItems:"center", gap:6 }}><span style={{ width:7, height:7, borderRadius:"50%", background:C.green, display:"inline-block", boxShadow:"0 0 6px rgba(16,185,129,.6)" }} />Automation Active</span>
                    : <span style={{ background:"rgba(100,116,139,.1)", color:C.slate, fontWeight:600, fontSize:12, padding:"5px 14px", borderRadius:20 }}>Manual Mode</span>
                  }
                  <span style={{ fontSize:13, color:C.slate }}>Auto-send recalls to patients when they become due</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:13, fontWeight:600, color:C.navy }}>Auto-send recalls</span>
                  <div onClick={()=>setAutoSend(v=>!v)} style={{ width:44, height:24, borderRadius:12, background:autoSend?C.teal:C.border, cursor:"pointer", position:"relative", transition:"background .2s", flexShrink:0 }}>
                    <div style={{ position:"absolute", top:3, left:autoSend?22:3, width:18, height:18, borderRadius:"50%", background:"#fff", boxShadow:"0 1px 4px rgba(0,0,0,.2)", transition:"left .2s" }} />
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display:"flex", gap:8, marginBottom:22 }}>
                {[{id:"eye-test",label:"👁 Eye Test Recalls"},{id:"lens-reorder",label:"◉ Lens Reorders"},{id:"compliance",label:"📋 Compliance"}].map(t=>(
                  <button key={t.id} onClick={()=>setRecallTab(t.id)} style={{ padding:"9px 20px", borderRadius:10, cursor:"pointer", fontFamily:F, fontSize:13, fontWeight:recallTab===t.id?700:500, background:recallTab===t.id?C.navy:C.white, color:recallTab===t.id?"#fff":C.slate, border:`1px solid ${recallTab===t.id?C.navy:C.border}`, transition:"all .15s" }}>{t.label}</button>
                ))}
              </div>

              {/* ── Eye Test Recalls tab ── */}
              {recallTab==="eye-test"&&(
                <div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
                    <SC label="Due for recall" value={recallPatients.length} accent={`linear-gradient(90deg,${C.teal},${C.tealLt})`} sub="8+ months since visit" />
                    <SC label="Overdue" value={overdueRecall.length} accent={`linear-gradient(90deg,${C.red},#F97316)`} sub="24+ months" trend={overdueRecall.length>0?"Action needed":null} trendUp={false} />
                    <SC label="Sending this week" value={Math.min(recallPatients.length,3)} accent={`linear-gradient(90deg,${C.amber},#EAB308)`} sub="Scheduled" />
                    <SC label="Est. revenue if all return" value={`£${recallRevenue.toLocaleString()}`} accent={`linear-gradient(90deg,${C.green},#34D399)`} sub={`${recallPatients.length} patients`} />
                  </div>
                  <div style={{ background:C.white, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,.06)" }}>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 120px 130px 130px 100px 160px", gap:12, padding:"12px 20px", borderBottom:`1px solid ${C.border}`, background:"#FAFBFC" }}>
                      {["Patient","Last Visit","Due Date","Status","Risk Score","Action"].map(h=>(
                        <div key={h} style={{ fontSize:10, fontWeight:700, color:C.slateLight, textTransform:"uppercase", letterSpacing:1 }}>{h}</div>
                      ))}
                    </div>
                    {recallPatients.map((p,i)=>{
                      const months = parseMonthsAgo(p.lastVisit);
                      const monthsUntilDue = 24-months;
                      const overdue = monthsUntilDue<0;
                      const dueSoon = !overdue&&monthsUntilDue<=6;
                      const dueDate = new Date(); dueDate.setMonth(dueDate.getMonth()+monthsUntilDue);
                      const dueDateStr = dueDate.toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});
                      const statusLabel = overdue?`${Math.abs(monthsUntilDue)} months overdue`:dueSoon?`Due in ${monthsUntilDue} months`:`Due in ${monthsUntilDue} months`;
                      const statusColor = overdue?C.red:dueSoon?C.amber:C.slate;
                      const statusBg = overdue?"rgba(239,68,68,.08)":dueSoon?"rgba(245,158,11,.08)":"transparent";
                      return (
                        <div key={p.id} style={{ display:"grid", gridTemplateColumns:"1fr 120px 130px 130px 100px 160px", gap:12, padding:"15px 20px", borderBottom:i<recallPatients.length-1?`1px solid ${C.border}`:"none", alignItems:"center", background:i%2===0?C.white:"#FAFBFD", transition:"background .12s" }}
                          onMouseEnter={e=>e.currentTarget.style.background="rgba(8,145,178,.04)"}
                          onMouseLeave={e=>e.currentTarget.style.background=i%2===0?C.white:"#FAFBFD"}>
                          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                            <Avatar initials={p.initials} bg={p.risk==="high"?C.red:p.risk==="medium"?C.amber:C.green} size={32} />
                            <div>
                              <div onClick={()=>openTimeline(p)} style={{ fontWeight:600, fontSize:13, cursor:"pointer", color:C.navy }} onMouseEnter={e=>e.target.style.color=C.teal} onMouseLeave={e=>e.target.style.color=C.navy}>{p.name}</div>
                              <div style={{ fontSize:11, color:C.slate }}>{p.product}</div>
                            </div>
                          </div>
                          <div style={{ fontSize:13, color:C.slate }}>{p.lastVisit}</div>
                          <div style={{ fontSize:12, color:C.navy }}>{dueDateStr}</div>
                          <div style={{ fontSize:11, fontWeight:700, color:statusColor, background:statusBg, padding:"4px 10px", borderRadius:20, display:"inline-block" }}>{statusLabel}</div>
                          <div>
                            <Chip color={riskFg[p.risk]}>{riskLabel[p.risk]}</Chip>
                            <div style={{ fontSize:10, color:C.slateLight, marginTop:3 }}>{p.riskScore}/100</div>
                          </div>
                          <div>
                            {waSent[p.id]
                              ?<span style={{ fontSize:12, color:C.green, fontWeight:600 }}>✓ Sent</span>
                              :<button onClick={()=>openRecallWA(p)} style={{ background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:8, padding:"7px 13px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:F, boxShadow:"0 2px 8px rgba(8,145,178,.25)" }}>Send Recall WhatsApp</button>
                            }
                          </div>
                        </div>
                      );
                    })}
                    {recallPatients.length===0&&<div style={{ padding:40, textAlign:"center", color:C.slate, fontSize:14 }}>No patients currently due for recall.</div>}
                  </div>
                </div>
              )}

              {/* ── Lens Reorders tab ── */}
              {recallTab==="lens-reorder"&&(
                <div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
                    <SC label="Likely due reorder" value={reorderPatients.length} accent={`linear-gradient(90deg,${C.teal},${C.tealLt})`} sub="Monthly CL patients" />
                    <SC label="3+ months overdue" value={reorderPatients.filter(p=>parseMonthsAgo(p.lastVisit)>=6).length} accent={`linear-gradient(90deg,${C.red},#F97316)`} sub="Long overdue" />
                    <SC label="Avg months lapsed" value={Math.round(reorderPatients.reduce((a,p)=>a+parseMonthsAgo(p.lastVisit),0)/(reorderPatients.length||1))} accent={`linear-gradient(90deg,${C.amber},#EAB308)`} sub="Since last visit" />
                    <SC label="Est. reorder revenue" value={`£${reorderPatients.reduce((a,p)=>a+Math.round(p.revenue*0.4),0).toLocaleString()}`} accent={`linear-gradient(90deg,${C.green},#34D399)`} sub="If all reorder" />
                  </div>
                  <div style={{ background:C.white, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,.06)" }}>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 130px 160px 100px 160px", gap:12, padding:"12px 20px", borderBottom:`1px solid ${C.border}`, background:"#FAFBFC" }}>
                      {["Patient","Last Visit","Lens Product","Risk","Action"].map(h=>(
                        <div key={h} style={{ fontSize:10, fontWeight:700, color:C.slateLight, textTransform:"uppercase", letterSpacing:1 }}>{h}</div>
                      ))}
                    </div>
                    {reorderPatients.map((p,i)=>{
                      const months = parseMonthsAgo(p.lastVisit);
                      const urgent = months>=6;
                      return (
                        <div key={p.id} style={{ display:"grid", gridTemplateColumns:"1fr 130px 160px 100px 160px", gap:12, padding:"15px 20px", borderBottom:i<reorderPatients.length-1?`1px solid ${C.border}`:"none", alignItems:"center", background:i%2===0?C.white:"#FAFBFD", transition:"background .12s" }}
                          onMouseEnter={e=>e.currentTarget.style.background="rgba(8,145,178,.04)"}
                          onMouseLeave={e=>e.currentTarget.style.background=i%2===0?C.white:"#FAFBFD"}>
                          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                            <Avatar initials={p.initials} bg={urgent?C.red:C.teal} size={32} />
                            <div>
                              <div onClick={()=>openTimeline(p)} style={{ fontWeight:600, fontSize:13, cursor:"pointer", color:C.navy }} onMouseEnter={e=>e.target.style.color=C.teal} onMouseLeave={e=>e.target.style.color=C.navy}>{p.name}</div>
                              <div style={{ fontSize:11, color:C.slate }}>{p.phone}</div>
                            </div>
                          </div>
                          <div style={{ fontSize:13, color:urgent?C.red:C.slate, fontWeight:urgent?600:400 }}>{p.lastVisit}</div>
                          <div style={{ fontSize:12, color:C.navy }}>{p.product}</div>
                          <Chip color={riskFg[p.risk]}>{riskLabel[p.risk]}</Chip>
                          <div>
                            {waSent[p.id]
                              ?<span style={{ fontSize:12, color:C.green, fontWeight:600 }}>✓ Sent</span>
                              :<button onClick={()=>openReorderWA(p)} style={{ background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:8, padding:"7px 13px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:F, boxShadow:"0 2px 8px rgba(8,145,178,.25)" }}>Send Reorder WhatsApp</button>
                            }
                          </div>
                        </div>
                      );
                    })}
                    {reorderPatients.length===0&&<div style={{ padding:40, textAlign:"center", color:C.slate, fontSize:14 }}>No patients currently due for lens reorder.</div>}
                  </div>
                </div>
              )}

              {/* ── Compliance tab ── */}
              {recallTab==="compliance"&&(()=>{
                const totalPts     = recallPatients.length;
                const contactedPts = recallPatients.filter(p=>waSent[p.id]).length;
                const compRate     = complianceRate;
                const statusColor  = compRate>=80?C.green:compRate>=60?C.amber:C.red;
                const statusLabel  = compRate>=80?"Compliant":compRate>=60?"Review Required":"Action Required";
                const timeline     = [
                  { month:"Oct 2025", rate:72, contacted:5,  total:8  },
                  { month:"Nov 2025", rate:78, contacted:7,  total:10 },
                  { month:"Dec 2025", rate:65, contacted:6,  total:11 },
                  { month:"Jan 2026", rate:80, contacted:8,  total:10 },
                  { month:"Feb 2026", rate:85, contacted:9,  total:11 },
                  { month:"Mar 2026", rate:compRate, contacted:contactedPts, total:totalPts },
                ];
                const maxTimeRate = 100;
                return (
                  <div>
                    {/* KPI row */}
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:22 }}>
                      <SC label="Compliance rate"    value={`${compRate}%`}   accent={`linear-gradient(90deg,${statusColor},${compRate>=80?"#34D399":compRate>=60?"#EAB308":"#F97316"})`} />
                      <SC label="Patients contacted" value={contactedPts}     accent={`linear-gradient(90deg,${C.teal},${C.tealLt})`} sub={`of ${totalPts} recall patients`} />
                      <SC label="GOC target"         value="80%"              accent={`linear-gradient(90deg,${C.navy},#1E3A5F)`} sub="Minimum acceptable rate" />
                      <SC label="Status"             value={statusLabel}      accent={`linear-gradient(90deg,${statusColor},${statusColor}88)`} sub={compRate>=80?"On track":"Needs attention"} />
                    </div>

                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18, marginBottom:22 }}>
                      {/* Circular compliance indicator */}
                      <div style={{ background:C.white, borderRadius:16, padding:28, border:`1px solid ${C.border}`, boxShadow:"0 1px 3px rgba(0,0,0,.04)", display:"flex", alignItems:"center", gap:24 }}>
                        {(()=>{
                          const r = 52; const circ = 2*Math.PI*r;
                          const dash = (compRate/100)*circ;
                          return (
                            <svg width={130} height={130} style={{ flexShrink:0 }}>
                              <circle cx={65} cy={65} r={r} fill="none" stroke={C.border} strokeWidth={10} />
                              <circle cx={65} cy={65} r={r} fill="none" stroke={statusColor} strokeWidth={10}
                                strokeDasharray={`${dash} ${circ-dash}`} strokeDashoffset={circ*0.25}
                                strokeLinecap="round" style={{ transition:"stroke-dasharray .6s ease" }} />
                              <text x={65} y={62} textAnchor="middle" dominantBaseline="middle" fill={statusColor} fontSize={22} fontWeight={800} fontFamily="DM Sans,sans-serif">{compRate}%</text>
                              <text x={65} y={80} textAnchor="middle" dominantBaseline="middle" fill={C.slate} fontSize={11} fontFamily="DM Sans,sans-serif">compliance</text>
                            </svg>
                          );
                        })()}
                        <div>
                          <div style={{ fontWeight:700, fontSize:16, color:C.navy, letterSpacing:-0.4, marginBottom:6 }}>GOC Compliance Status</div>
                          <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:`${statusColor}18`, color:statusColor, fontWeight:700, fontSize:13, padding:"5px 14px", borderRadius:20, marginBottom:10 }}>
                            <span style={{ width:7, height:7, borderRadius:"50%", background:statusColor, display:"inline-block" }} />
                            {statusLabel}
                          </div>
                          <div style={{ fontSize:12, color:C.slate, lineHeight:1.6 }}>
                            {contactedPts} of {totalPts} recall patients contacted.{compRate<80&&<><br/><span style={{ color:C.amber, fontWeight:600 }}>Contact {Math.max(0,Math.ceil(totalPts*0.8)-contactedPts)} more to reach target.</span></>}
                          </div>
                        </div>
                      </div>

                      {/* Compliance timeline chart */}
                      <div style={{ background:C.white, borderRadius:16, padding:22, border:`1px solid ${C.border}`, boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}>
                        <div style={{ fontWeight:700, fontSize:15, marginBottom:16, letterSpacing:-0.3 }}>Compliance Over Time</div>
                        {timeline.map((row,i)=>{
                          const barColor = row.rate>=80?C.green:row.rate>=60?C.amber:C.red;
                          const isNow = i===timeline.length-1;
                          return (
                            <div key={row.month} style={{ marginBottom:10 }}>
                              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                                <span style={{ fontSize:11, color:isNow?C.navy:C.slate, fontWeight:isNow?700:400 }}>{row.month}{isNow?" (now)":""}</span>
                                <span style={{ fontSize:11, fontWeight:700, color:barColor }}>{row.rate}%</span>
                              </div>
                              <div style={{ height:7, background:C.border, borderRadius:4, overflow:"hidden" }}>
                                <div style={{ width:`${(row.rate/maxTimeRate)*100}%`, height:"100%", background:barColor, borderRadius:4, opacity:isNow?1:0.65 }} />
                              </div>
                            </div>
                          );
                        })}
                        <div style={{ marginTop:10, height:1, background:C.border }} />
                        <div style={{ marginTop:8, display:"flex", alignItems:"center", gap:6 }}>
                          <div style={{ height:2, width:20, background:C.red, borderRadius:2 }} />
                          <span style={{ fontSize:11, color:C.slate }}>GOC minimum (80%)</span>
                        </div>
                      </div>
                    </div>

                    {/* Summary table */}
                    <div style={{ background:C.white, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,.06)", marginBottom:18 }}>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 120px 100px 120px 160px", gap:12, padding:"12px 20px", borderBottom:`1px solid ${C.border}`, background:"#FAFBFC" }}>
                        {["Patient","Last Visit","Risk","Status","Action"].map(h=>(
                          <div key={h} style={{ fontSize:10, fontWeight:700, color:C.slateLight, textTransform:"uppercase", letterSpacing:1 }}>{h}</div>
                        ))}
                      </div>
                      {recallPatients.map((p,i)=>(
                        <div key={p.id} style={{ display:"grid", gridTemplateColumns:"1fr 120px 100px 120px 160px", gap:12, padding:"13px 20px", borderBottom:i<recallPatients.length-1?`1px solid ${C.border}`:"none", alignItems:"center", background:i%2===0?C.white:"#FAFBFD" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                            <Avatar initials={p.initials} bg={waSent[p.id]?C.green:C.amber} size={30} />
                            <div style={{ fontWeight:600, fontSize:13 }}>{p.name}</div>
                          </div>
                          <div style={{ fontSize:12, color:C.slate }}>{p.lastVisit}</div>
                          <Chip color={riskFg[p.risk]}>{riskLabel[p.risk]}</Chip>
                          <div>
                            {waSent[p.id]
                              ? <span style={{ fontSize:12, color:C.green, fontWeight:600 }}>✓ Contacted</span>
                              : <span style={{ fontSize:12, color:C.amber, fontWeight:600 }}>⚠ Not contacted</span>
                            }
                          </div>
                          <div style={{ fontSize:11, color:C.slate }}>{waSent[p.id]?"Recall WhatsApp sent":"Recall pending"}</div>
                        </div>
                      ))}
                      {recallPatients.length===0&&<div style={{ padding:40, textAlign:"center", color:C.slate, fontSize:14 }}>No recall patients found.</div>}
                    </div>

                    {/* Generate report button */}
                    <div style={{ display:"flex", justifyContent:"flex-end" }}>
                      <button onClick={()=>generateComplianceReport(compRate, recallPatients, recallPatients.filter(p=>waSent[p.id]))}
                        style={{ background:`linear-gradient(135deg,${C.navy},#1E3A5F)`, color:"#fff", border:"none", borderRadius:12, padding:"12px 24px", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:F, boxShadow:"0 4px 16px rgba(8,15,30,.2)", letterSpacing:-0.2, display:"flex", alignItems:"center", gap:8 }}>
                        🖨 Generate Compliance Report
                      </button>
                    </div>
                  </div>
                );
              })()}
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
                      background:selectedThread?.id===m.id?"rgba(8,145,178,.06)":m.sentiment==='urgent'?"rgba(239,68,68,.03)":m.sentiment==='negative'?"rgba(245,158,11,.03)":"transparent",
                      borderBottom:`1px solid ${C.border}`,
                      borderLeft:selectedThread?.id===m.id?`3px solid ${C.teal}`:m.sentiment==='urgent'?`3px solid ${C.red}`:m.sentiment==='negative'?`3px solid ${C.amber}`:m.sentiment==='positive'?`3px solid ${C.green}`:"3px solid transparent",
                      transition:"background .15s"
                    }}>
                      <Avatar initials={m.initials} bg={getColor(i)} size={36} />
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                          <div onClick={e=>{e.stopPropagation();openTimeline(m);}} style={{ fontWeight:m.unread?700:500, fontSize:13, cursor:"pointer", display:"inline" }} onMouseEnter={e=>e.target.style.color=C.teal} onMouseLeave={e=>e.target.style.color=""}>{m.patient}</div>
                          <div style={{ fontSize:10, color:C.slateLight, flexShrink:0 }}>{m.time}</div>
                        </div>
                        <div style={{ fontSize:11, color:C.slate, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginTop:2 }}>{m.preview}</div>
                        {m.sentiment==='urgent'&&<span style={{ display:"inline-block", marginTop:4, background:"rgba(239,68,68,.1)", color:C.red, fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:20, animation:"pulseDot 1.5s ease-in-out infinite" }}>🚨 Urgent</span>}
                        {m.sentiment==='negative'&&<span style={{ display:"inline-block", marginTop:4, background:"rgba(245,158,11,.1)", color:C.amber, fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:20 }}>⚠️ Concerned</span>}
                        {m.sentiment==='positive'&&<span style={{ display:"inline-block", marginTop:4, background:"rgba(16,185,129,.1)", color:C.green, fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:20 }}>😊 Positive</span>}
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
                      <div onClick={()=>openTimeline(selectedThread)} style={{ fontWeight:700, fontSize:15, letterSpacing:-0.3, cursor:"pointer" }} onMouseEnter={e=>e.target.style.color=C.teal} onMouseLeave={e=>e.target.style.color=""}>{selectedThread.patient}</div>
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
                    {selectedThread.thread.reduce((acc, msg, i, arr) => {
                      const msgDate = msg.sent_at ? new Date(msg.sent_at) : null;
                      const prevDate = i > 0 && arr[i-1].sent_at ? new Date(arr[i-1].sent_at) : null;
                      const showSeparator = msgDate && (!prevDate || msgDate.toDateString() !== prevDate.toDateString());
                      if (showSeparator) {
                        const today = new Date();
                        const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1);
                        let label = msgDate.toDateString()===today.toDateString() ? "Today" : msgDate.toDateString()===yesterday.toDateString() ? "Yesterday" : msgDate.toLocaleDateString("en-GB",{day:"numeric",month:"long"});
                        acc.push(<div key={"sep-"+i} style={{ textAlign:"center", margin:"12px 0" }}><span style={{ fontSize:11, color:C.slate, background:C.border, borderRadius:10, padding:"3px 12px" }}>{label}</span></div>);
                      }
                      acc.push(
                        <div key={i} style={{ display:"flex", justifyContent:msg.from==="practice"?"flex-end":"flex-start" }}>
                          <div style={{ maxWidth:"70%", background:msg.from==="practice"?`linear-gradient(135deg,${C.teal},${C.tealLt})`:C.white, color:msg.from==="practice"?"#fff":C.navy, borderRadius:msg.from==="practice"?"16px 16px 4px 16px":"16px 16px 16px 4px", padding:"10px 14px", fontSize:13, lineHeight:1.6, border:msg.from==="patient"?`1px solid ${C.border}`:"none", boxShadow:"0 2px 8px rgba(0,0,0,.06)", whiteSpace:"pre-wrap" }}>
                            {msg.from==="practice"&&<div style={{ fontSize:9, opacity:0.7, marginBottom:4, textTransform:"uppercase", letterSpacing:1 }}>Bright Eyes · Iryss AI</div>}
                            {msg.text}
                            <div style={{ fontSize:10, opacity:0.55, textAlign:"right", marginTop:4 }}>{msg.time}{msg.from==="practice"?" ✓✓":""}</div>
                          </div>
                        </div>
                      );
                      return acc;
                    }, [])}
                    <div ref={msgEndRef} />
                  </div>
                  <div style={{ padding:16, borderTop:`1px solid ${C.border}`, display:"flex", gap:10, alignItems:"center" }}>
                    <input value={sendMsg} onChange={e=>setSendMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendInboxReply()} placeholder="Type a reply…"
                      style={{ flex:1, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", fontSize:13, fontFamily:F, outline:"none", background:C.offWhite }} />
                    <button onClick={sendInboxReply} style={{ background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:10, padding:"10px 18px", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:F, boxShadow:"0 2px 8px rgba(8,145,178,.3)" }}>Send</button>
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
              {/* Tab bar */}
              <div style={{ display:"flex", gap:4, marginBottom:24, background:C.bg, borderRadius:12, padding:4, width:"fit-content", border:`1px solid ${C.border}` }}>
                {[["overview","Overview"],["lens","Lens Plans"]].map(([id,label])=>(
                  <button key={id} onClick={()=>setRevenueTab(id)} style={{ padding:"8px 20px", borderRadius:9, border:"none", fontFamily:F, fontWeight:600, fontSize:13, cursor:"pointer", transition:"all .15s",
                    background:revenueTab===id?C.white:"transparent", color:revenueTab===id?C.navy:C.slate,
                    boxShadow:revenueTab===id?"0 1px 4px rgba(0,0,0,.08)":"none" }}>{label}</button>
                ))}
              </div>

              {revenueTab==="lens"&&(()=>{
                const maxLensRev = Math.max(...lensPatients.map(p=>p.revenue), 1);
                return (
                  <div>
                    {/* Uplift banner */}
                    <div style={{ background:`linear-gradient(135deg,${C.teal} 0%,${C.tealLt} 100%)`, borderRadius:16, padding:"18px 24px", marginBottom:22, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div>
                        <div style={{ fontWeight:800, fontSize:16, color:"#fff", letterSpacing:-0.4 }}>👁 Contact Lens Plan Opportunity</div>
                        <div style={{ fontSize:13, color:"rgba(255,255,255,.75)", marginTop:4 }}>
                          {lensPatients.length} patients eligible · upgrade each to a monthly plan and recover an estimated
                          <span style={{ fontWeight:800, color:"#fff" }}> £{lensUpliftTotal.toLocaleString()}</span> annual uplift
                        </div>
                      </div>
                      <div style={{ fontSize:32, fontWeight:900, color:"#fff", letterSpacing:-1 }}>£{lensUpliftTotal.toLocaleString()}</div>
                    </div>

                    {/* KPI row */}
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:22 }}>
                      <SC label="Eligible patients"  value={lensPatients.length}                                    accent={`linear-gradient(90deg,${C.teal},${C.tealLt})`} />
                      <SC label="Nudges sent"        value={Object.keys(planSent).length}                           accent={`linear-gradient(90deg,${C.green},#34D399)`} />
                      <SC label="Potential uplift"   value={`£${lensUpliftTotal.toLocaleString()}`}                 accent={`linear-gradient(90deg,${C.amber},#EAB308)`} />
                      <SC label="Avg uplift / pt"    value={lensPatients.length>0?`£${Math.round(lensUpliftTotal/lensPatients.length)}`:"—"} accent={`linear-gradient(90deg,#8B5CF6,#A78BFA)`} />
                    </div>

                    {/* Table */}
                    <div style={{ background:C.white, borderRadius:16, padding:22, border:`1px solid ${C.border}`, boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}>
                      <div style={{ fontWeight:700, fontSize:15, marginBottom:16, letterSpacing:-0.3 }}>Contact Lens Patients — Plan Eligibility</div>
                      {lensPatients.length===0
                        ? <div style={{ color:C.slate, fontSize:13 }}>No contact lens patients found in current data.</div>
                        : lensPatients.map((p,i)=>{
                            const uplift = Math.round(p.revenue*0.2);
                            const barPct = Math.round((p.revenue/maxLensRev)*100);
                            return (
                              <div key={p.id} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 0", borderBottom:i<lensPatients.length-1?`1px solid ${C.border}`:"none" }}>
                                <Avatar initials={p.initials} bg={C.teal} size={36} />
                                <div style={{ flex:1, minWidth:0 }}>
                                  <div style={{ fontWeight:600, fontSize:13, color:C.navy }}>{p.name}</div>
                                  <div style={{ fontSize:11, color:C.slate, marginTop:2 }}>{p.product} · {p.lastVisit}</div>
                                  <div style={{ height:6, background:C.border, borderRadius:3, marginTop:6, overflow:"hidden", maxWidth:200 }}>
                                    <div style={{ width:`${barPct}%`, height:"100%", background:C.teal, borderRadius:3 }} />
                                  </div>
                                </div>
                                <div style={{ textAlign:"right", flexShrink:0, marginRight:8 }}>
                                  <div style={{ fontSize:12, color:C.slate }}>Current spend</div>
                                  <div style={{ fontSize:15, fontWeight:800, color:C.navy }}>£{p.revenue}</div>
                                  <div style={{ fontSize:11, color:C.green, fontWeight:600 }}>+£{uplift}/yr plan</div>
                                </div>
                                {planSent[p.id]
                                  ? <span style={{ fontSize:12, color:C.green, fontWeight:600, minWidth:80, textAlign:"center" }}>Sent ✓</span>
                                  : <button onClick={()=>{
                                      const msg=`Hi ${p.name.split(" ")[0]}, it's Bright Eyes Opticians 👋 We'd love to help you get the most from your contact lenses. Did you know our monthly lens plan could save you money and make re-orders effortless? Reply YES and we'll get the details over to you!`;
                                      openSendWA({...p, waMsg:msg});
                                      setPlanSent(s=>({...s,[p.id]:true}));
                                    }} style={{ background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:9, padding:"7px 14px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:F, boxShadow:"0 2px 8px rgba(8,145,178,.3)", minWidth:80 }}>Suggest Plan</button>
                                }
                              </div>
                            );
                          })
                      }
                    </div>
                  </div>
                );
              })()}

              {revenueTab==="overview"&&<div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:26 }}>
                <SC label="Revenue at risk"       value={`£${atRiskRevenue.toLocaleString()}`}                        accent={`linear-gradient(90deg,${C.red},#F97316)`}    onDrill={()=>setDrill("rev-risk")}      trend="8%" trendUp={false} />
                <SC label="Recovered this month"  value={`£${recoveredRev.toLocaleString()}`} sub={`${recovered.length} patients`} accent={`linear-gradient(90deg,${C.green},#34D399)`}  onDrill={()=>setDrill("rev-recovered")} trend="12%" trendUp={true} />
                <SC label="Recovered YTD"         value="£8,400"                              sub="Since April 2025"  accent={`linear-gradient(90deg,${C.teal},${C.tealLt})`} />
                <SC label="ROI on Iryss"          value="7.5×"                                sub="£220 plan"         accent={`linear-gradient(90deg,#8B5CF6,#A78BFA)`} />
              </div>
              {(()=>{
                const totalRev   = PATIENTS.reduce((a,p)=>a+p.revenue, 0);
                const highRev    = PATIENTS.filter(p=>p.risk==="high").reduce((a,p)=>a+p.revenue, 0);
                const medRev     = PATIENTS.filter(p=>p.risk==="medium").reduce((a,p)=>a+p.revenue, 0);
                const lowRev     = PATIENTS.filter(p=>p.risk==="low").reduce((a,p)=>a+p.revenue, 0);
                const maxRev     = Math.max(...PATIENTS.map(p=>p.revenue));
                const sortedPts  = [...PATIENTS].sort((a,b)=>b.revenue-a.revenue);
                const topOppty   = [...PATIENTS].filter(p=>p.risk==="high").sort((a,b)=>b.revenue-a.revenue)[0];
                return (
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
                    {/* Left — revenue table */}
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

                    {/* Right — three stacked cards */}
                    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>

                      {/* 1 — Revenue bar chart */}
                      <div style={{ background:C.white, borderRadius:16, padding:22, border:`1px solid ${C.border}`, boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}>
                        <div style={{ fontWeight:700, fontSize:15, marginBottom:16, letterSpacing:-0.3 }}>Revenue by Patient</div>
                        {sortedPts.map(p=>{
                          const barColor = p.risk==="high"?C.red:p.risk==="medium"?C.amber:C.green;
                          const barPct   = Math.round((p.revenue/maxRev)*100);
                          return (
                            <div key={p.id} style={{ marginBottom:10 }}>
                              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                                <span style={{ fontSize:12, fontWeight:600, color:C.navy }}>{p.name}</span>
                                <span style={{ fontSize:12, fontWeight:700, color:barColor }}>£{p.revenue}</span>
                              </div>
                              <div style={{ height:9, background:C.border, borderRadius:5, overflow:"hidden" }}>
                                <div style={{ width:`${barPct}%`, height:"100%", background:barColor, borderRadius:5, transition:"width .5s ease" }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* 2 — Revenue at risk summary */}
                      <div style={{ background:C.white, borderRadius:16, padding:22, border:`1px solid ${C.border}`, boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}>
                        <div style={{ fontWeight:700, fontSize:15, marginBottom:16, letterSpacing:-0.3 }}>Revenue at Risk Summary</div>
                        {[
                          { label:"High risk",   value:highRev, color:C.red,   bg:"rgba(239,68,68,.08)"   },
                          { label:"Medium risk", value:medRev,  color:C.amber, bg:"rgba(245,158,11,.08)"  },
                          { label:"Low risk",    value:lowRev,  color:C.green, bg:"rgba(16,185,129,.08)"  },
                        ].map(row=>(
                          <div key={row.label} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                            <div style={{ width:10, height:10, borderRadius:"50%", background:row.color, flexShrink:0 }} />
                            <div style={{ flex:1 }}>
                              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                                <span style={{ fontSize:13, fontWeight:600, color:C.navy }}>{row.label}</span>
                                <span style={{ fontSize:13, fontWeight:800, color:row.color }}>£{row.value.toLocaleString()}</span>
                              </div>
                              <div style={{ height:7, background:C.border, borderRadius:4, overflow:"hidden" }}>
                                <div style={{ width:`${Math.round((row.value/totalRev)*100)}%`, height:"100%", background:row.color, borderRadius:4 }} />
                              </div>
                              <div style={{ fontSize:10, color:C.slateLight, marginTop:3 }}>{Math.round((row.value/totalRev)*100)}% of total £{totalRev.toLocaleString()}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* 3 — Top opportunity */}
                      {topOppty&&(
                        <div style={{ background:`linear-gradient(135deg,${C.navy} 0%,#0E2040 100%)`, borderRadius:16, padding:22, boxShadow:"0 4px 20px rgba(8,15,30,.15)" }}>
                          <div style={{ fontWeight:700, fontSize:15, color:C.white, marginBottom:16, letterSpacing:-0.3 }}>⚡ Biggest Recovery Opportunity</div>
                          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
                            <Avatar initials={topOppty.initials} bg={C.red} size={46} />
                            <div style={{ flex:1 }}>
                              <div style={{ fontWeight:800, fontSize:16, color:C.white, letterSpacing:-0.4 }}>{topOppty.name}</div>
                              <div style={{ fontSize:12, color:"rgba(255,255,255,.45)", marginTop:3 }}>{topOppty.product}</div>
                              <div style={{ display:"flex", gap:8, marginTop:6, alignItems:"center" }}>
                                <span style={{ fontSize:11, color:"#FCA5A5", fontWeight:700, background:"rgba(239,68,68,.2)", padding:"2px 9px", borderRadius:20 }}>HIGH RISK</span>
                                <span style={{ fontSize:11, color:"rgba(255,255,255,.4)" }}>Score: {topOppty.riskScore}/100</span>
                              </div>
                            </div>
                            <div style={{ textAlign:"right", flexShrink:0 }}>
                              <div style={{ fontSize:28, fontWeight:800, color:C.tealLt, letterSpacing:-1 }}>£{topOppty.revenue}</div>
                              <div style={{ fontSize:11, color:"rgba(255,255,255,.35)", marginTop:2 }}>revenue value</div>
                            </div>
                          </div>
                          {waSent[topOppty.id]
                            ? <div style={{ textAlign:"center", fontSize:13, color:C.green, fontWeight:600 }}>✓ WhatsApp sent</div>
                            : <button onClick={()=>openSendWA(topOppty)} style={{ width:"100%", background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:12, padding:"12px", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:F, boxShadow:"0 4px 16px rgba(8,145,178,.4)", letterSpacing:-0.2 }}>
                                Send WhatsApp Now →
                              </button>
                          }
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>}
            </div>
          )}

          {/* ═══ REVIEWS ═══ */}
          {nav==="reviews"&&(
            <div>
              {/* Automation banner */}
              <div style={{ background:C.white, borderRadius:14, padding:"16px 22px", border:`1px solid ${C.border}`, boxShadow:"0 2px 8px rgba(0,0,0,.05)", marginBottom:22, display:"flex", alignItems:"center", gap:20 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:14, color:C.navy, marginBottom:3, display:"flex", alignItems:"center", gap:10 }}>
                    ⭐ Review Request Automation
                    {autoReview
                      ? <span style={{ background:"rgba(16,185,129,.12)", color:C.green, fontWeight:700, fontSize:11, padding:"3px 10px", borderRadius:20, display:"flex", alignItems:"center", gap:5 }}><span style={{ width:6, height:6, borderRadius:"50%", background:C.green, display:"inline-block", boxShadow:"0 0 6px rgba(16,185,129,.6)" }} />Active</span>
                      : <span style={{ background:"rgba(100,116,139,.1)", color:C.slateLight, fontWeight:600, fontSize:11, padding:"3px 10px", borderRadius:20 }}>Off</span>
                    }
                  </div>
                  <div style={{ fontSize:12, color:C.slate }}>Iryss automatically sends a review request when a patient replies positively or books an appointment.</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:13, fontWeight:600, color:C.navy, whiteSpace:"nowrap" }}>Auto-send review requests</span>
                  <div onClick={()=>setAutoReview(v=>!v)} style={{ width:44, height:24, borderRadius:12, background:autoReview?C.teal:C.border, cursor:"pointer", position:"relative", transition:"background .2s", flexShrink:0 }}>
                    <div style={{ position:"absolute", top:3, left:autoReview?22:3, width:18, height:18, borderRadius:"50%", background:"#fff", boxShadow:"0 1px 4px rgba(0,0,0,.2)", transition:"left .2s" }} />
                  </div>
                </div>
              </div>

              {/* KPI cards — 6 total */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:14, marginBottom:22 }}>
                <SC label="Google rating"             value="4.9 ★" sub="All time"           accent={`linear-gradient(90deg,#FBBC05,#F59E0B)`} />
                <SC label="Total reviews"             value="147"   sub="+38 this month"     accent={`linear-gradient(90deg,${C.teal},${C.tealLt})`} onDrill={()=>setDrill("all-reviews")} />
                <SC label="Via Iryss this month"      value="38"    sub="Fully automatic"    accent={`linear-gradient(90deg,${C.green},#34D399)`}  onDrill={()=>setDrill("iryss-reviews")} />
                <SC label="Requests sent this month"  value="52"    sub="73% open rate"      accent={`linear-gradient(90deg,${C.purple},#A78BFA)`} onDrill={()=>setDrill("review-requests")} />
                <SC label="Pending responses"         value={REVIEW_REQUESTS.filter(r=>r.status!=="left").length} sub="Awaiting review" accent={`linear-gradient(90deg,${C.amber},#EAB308)`} trend="3 pending" trendUp={false} />
                <SC label="Conversion rate"           value="73%"   sub="Reviews / requests" accent={`linear-gradient(90deg,${C.green},#34D399)`} trend="↑ 5%" trendUp={true} />
              </div>

              {/* Tabs */}
              <div style={{ display:"flex", gap:8, marginBottom:18 }}>
                {[{id:"reviews",label:"⭐ Recent Reviews"},{id:"requests",label:"📨 Review Requests"}].map(t=>(
                  <button key={t.id} onClick={()=>setReviewTab(t.id)} style={{ padding:"9px 20px", borderRadius:10, cursor:"pointer", fontFamily:F, fontSize:13, fontWeight:reviewTab===t.id?700:500, background:reviewTab===t.id?C.navy:C.white, color:reviewTab===t.id?"#fff":C.slate, border:`1px solid ${reviewTab===t.id?C.navy:C.border}`, transition:"all .15s" }}>{t.label}</button>
                ))}
              </div>

              {reviewTab==="reviews"&&(
                <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:18 }}>
                  <div>
                    {/* Reviews list */}
                    <div style={{ background:C.white, borderRadius:16, padding:22, border:`1px solid ${C.border}`, marginBottom:18, boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}>
                      <div style={{ fontWeight:700, fontSize:15, marginBottom:16, letterSpacing:-0.3 }}>Recent reviews via Iryss</div>
                      {REVIEWS.map((r,i)=>(
                        <div key={i} style={{ padding:"14px 0", borderBottom:i<REVIEWS.length-1?`1px solid ${C.border}`:"none" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                            <div style={{ color:"#FBBC05", fontSize:13, letterSpacing:1 }}>{"★".repeat(r.stars)}</div>
                            <div style={{ fontWeight:600, fontSize:13 }}>{r.name}</div>
                            <div style={{ fontSize:11, color:C.slateLight, marginLeft:"auto" }}>{r.days}</div>
                            {r.via&&<span style={{ fontSize:10, color:C.teal, fontWeight:600, background:C.tealPale, padding:"2px 8px", borderRadius:20 }}>via Iryss ✓</span>}
                            {reviewSent[`review-${r.name}`]
                              ? <span style={{ fontSize:10, color:C.green, fontWeight:700 }}>Request sent ✓</span>
                              : <button onClick={()=>openReviewWA(r.name,'')} style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:8, padding:"4px 10px", fontSize:11, fontWeight:600, color:C.slate, cursor:"pointer", fontFamily:F }}>Send request</button>
                            }
                          </div>
                          <div style={{ fontSize:13, color:C.slate, lineHeight:1.6, fontStyle:"italic" }}>"{r.text}"</div>
                        </div>
                      ))}
                    </div>

                    {/* How it works */}
                    <div style={{ background:C.white, borderRadius:16, padding:22, border:`1px solid ${C.border}`, boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}>
                      <div style={{ fontWeight:700, fontSize:15, marginBottom:14, letterSpacing:-0.3 }}>How it works</div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
                        {[
                          { step:"1", title:"Appointment logged",     desc:"Patient attends. Click 'Log appointment' to start the automation." },
                          { step:"2", title:"24hr WhatsApp check-in", desc:"Iryss sends a warm message asking how their visit went." },
                          { step:"3", title:"Review link sent",       desc:"If happy, a direct link to your Google Business profile is sent." },
                        ].map(s=>(
                          <div key={s.step} style={{ background:C.cream, borderRadius:12, padding:14, border:`1px solid ${C.border}` }}>
                            <div style={{ width:30, height:30, borderRadius:"50%", background:C.navy, color:C.white, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:13, marginBottom:8 }}>{s.step}</div>
                            <div style={{ fontWeight:700, fontSize:13, marginBottom:4 }}>{s.title}</div>
                            <div style={{ fontSize:12, color:C.slate, lineHeight:1.6 }}>{s.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right column: charts */}
                  <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
                    {/* Star rating breakdown */}
                    <div style={{ background:C.white, borderRadius:16, padding:22, border:`1px solid ${C.border}`, boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}>
                      <div style={{ fontWeight:700, fontSize:15, marginBottom:16, letterSpacing:-0.3 }}>★ Rating Breakdown</div>
                      {STAR_BREAKDOWN.map(row=>(
                        <div key={row.stars} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                          <div style={{ fontSize:12, fontWeight:700, color:"#FBBC05", width:18, textAlign:"right", flexShrink:0 }}>{row.stars}</div>
                          <div style={{ fontSize:11, color:"#FBBC05", flexShrink:0 }}>★</div>
                          <div style={{ flex:1, height:8, background:C.border, borderRadius:4, overflow:"hidden" }}>
                            <div style={{ width:`${(row.count/147)*100}%`, height:"100%", background:`linear-gradient(90deg,#FBBC05,#F59E0B)`, borderRadius:4, transition:"width .6s" }} />
                          </div>
                          <div style={{ fontSize:11, color:C.slate, width:28, textAlign:"right", flexShrink:0 }}>{row.count}</div>
                        </div>
                      ))}
                    </div>

                    {/* Top review themes */}
                    <div style={{ background:C.white, borderRadius:16, padding:22, border:`1px solid ${C.border}`, boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}>
                      <div style={{ fontWeight:700, fontSize:15, marginBottom:4, letterSpacing:-0.3 }}>💬 Top Review Themes</div>
                      <div style={{ fontSize:12, color:C.slate, marginBottom:16 }}>What patients mention most</div>
                      {REVIEW_THEMES.map((t,i)=>(
                        <div key={i} style={{ marginBottom:14 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                            <span style={{ fontSize:13, fontWeight:600, color:C.navy }}>{t.label}</span>
                            <span style={{ fontSize:12, fontWeight:700, color:C.teal }}>{t.pct}%</span>
                          </div>
                          <div style={{ height:8, background:C.border, borderRadius:4, overflow:"hidden" }}>
                            <div style={{ width:`${t.pct}%`, height:"100%", background:`linear-gradient(90deg,${C.teal},${C.tealLt})`, borderRadius:4, transition:"width .6s" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {reviewTab==="requests"&&(
                <div style={{ background:C.white, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,.06)" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 100px 180px 160px 140px", gap:12, padding:"12px 20px", borderBottom:`1px solid ${C.border}`, background:"#FAFBFC" }}>
                    {["Patient","Date Sent","Trigger","Status","Action"].map(h=>(
                      <div key={h} style={{ fontSize:10, fontWeight:700, color:C.slateLight, textTransform:"uppercase", letterSpacing:1 }}>{h}</div>
                    ))}
                  </div>
                  {REVIEW_REQUESTS.map((req,i)=>{
                    const key = `review-${req.patient}`;
                    const resent = reviewSent[key];
                    return (
                      <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 100px 180px 160px 140px", gap:12, padding:"14px 20px", borderBottom:i<REVIEW_REQUESTS.length-1?`1px solid ${C.border}`:"none", alignItems:"center", background:i%2===0?C.white:"#FAFBFD", transition:"background .12s" }}
                        onMouseEnter={e=>e.currentTarget.style.background="rgba(8,145,178,.04)"}
                        onMouseLeave={e=>e.currentTarget.style.background=i%2===0?C.white:"#FAFBFD"}>
                        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                          <Avatar initials={req.patient.split(' ').map(w=>w[0]).join('').slice(0,2)} bg={getColor(i)} size={30} />
                          <span style={{ fontWeight:600, fontSize:13, color:C.navy }}>{req.patient}</span>
                        </div>
                        <div style={{ fontSize:12, color:C.slate }}>{req.date}</div>
                        <div style={{ fontSize:12, color:C.navy }}>{req.trigger}</div>
                        <div>
                          {req.status==="left"
                            ? <span style={{ fontSize:11, fontWeight:700, color:C.green,  background:"rgba(16,185,129,.1)", padding:"3px 10px", borderRadius:20 }}>Review left ✓</span>
                            : req.status==="pending"
                            ? <span style={{ fontSize:11, fontWeight:700, color:C.amber,  background:"rgba(245,158,11,.1)", padding:"3px 10px", borderRadius:20 }}>Pending</span>
                            : <span style={{ fontSize:11, fontWeight:600, color:C.slateLight, background:"rgba(100,116,139,.1)", padding:"3px 10px", borderRadius:20 }}>No response</span>
                          }
                        </div>
                        <div>
                          {req.status==="left"
                            ? <span style={{ fontSize:12, color:C.slateLight }}>—</span>
                            : resent
                            ? <span style={{ fontSize:12, color:C.green, fontWeight:600 }}>Resent ✓</span>
                            : <button onClick={()=>openReviewWA(req.patient, req.phone)} style={{ background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:8, padding:"6px 12px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:F, boxShadow:"0 2px 8px rgba(8,145,178,.25)" }}>Resend</button>
                          }
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ═══ APPOINTMENTS ═══ */}
          {nav==="appointments"&&(
            <div>
              {/* Automation banner */}
              <div style={{ background:C.white, borderRadius:14, padding:"16px 22px", border:`1px solid ${C.border}`, boxShadow:"0 2px 8px rgba(0,0,0,.05)", marginBottom:22, display:"flex", alignItems:"center", gap:24 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:14, color:C.navy, marginBottom:3 }}>⚡ Appointment Confirmation Automation</div>
                  <div style={{ fontSize:12, color:C.slate }}>Iryss automatically sends confirmation reminders via WhatsApp to reduce no-shows.</div>
                </div>
                <div style={{ display:"flex", gap:20, alignItems:"center" }}>
                  {[{label:"Auto-send 48hr reminders", active:reminder48Active, toggle:()=>setReminder48Active(v=>!v)},{label:"Auto-send 2hr reminders", active:reminder2hActive, toggle:()=>setReminder2hActive(v=>!v)}].map(({label,active,toggle})=>(
                    <div key={label} style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:12, color:C.slate, fontWeight:500, whiteSpace:"nowrap" }}>{label}</span>
                      {active
                        ?<span style={{ fontSize:11, fontWeight:700, color:C.green, background:"rgba(16,185,129,.12)", padding:"3px 10px", borderRadius:20 }}>Active</span>
                        :<span style={{ fontSize:11, fontWeight:600, color:C.slateLight, background:"rgba(100,116,139,.08)", padding:"3px 10px", borderRadius:20 }}>Off</span>
                      }
                      <div onClick={toggle} style={{ width:40, height:22, borderRadius:11, background:active?C.teal:C.border, cursor:"pointer", position:"relative", transition:"background .2s", flexShrink:0 }}>
                        <div style={{ position:"absolute", top:3, left:active?20:3, width:16, height:16, borderRadius:"50%", background:"#fff", boxShadow:"0 1px 3px rgba(0,0,0,.2)", transition:"left .2s" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* KPI cards */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:14, marginBottom:22 }}>
                <SC label="Today's appointments" value={APPOINTMENTS.length}                         accent={`linear-gradient(90deg,${C.teal},${C.tealLt})`}   onDrill={()=>setDrill("all-appts")} />
                <SC label="Confirmed"            value={APPOINTMENTS.filter(a=>a.confirmed).length}  accent={`linear-gradient(90deg,${C.green},#34D399)`}      onDrill={()=>setDrill("confirmed-appts")} />
                <SC label="Booked via Iryss"     value={APPOINTMENTS.filter(a=>a.viaIryss).length}   accent={`linear-gradient(90deg,${C.purple},#A78BFA)`}     onDrill={()=>setDrill("iryss-appts")} sub="WhatsApp bookings" />
                <SC label="Confirmations sent"   value={Object.keys(confirmSent).length}             accent={`linear-gradient(90deg,${C.amber},#EAB308)`}      sub="Today" />
                <SC label="No-show risk"         value={noShowRisk.length}                           accent={`linear-gradient(90deg,${C.red},#F97316)`}        onDrill={()=>setDrill("no-show-risk")} trend={noShowRisk.length>0?"Unconfirmed":null} trendUp={false} />
              </div>

              {/* Today's schedule table */}
              <div style={{ background:C.white, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,.06)", marginBottom:22 }}>
                <div style={{ padding:"14px 20px", borderBottom:`1px solid ${C.border}`, fontWeight:700, fontSize:15, letterSpacing:-0.3 }}>Today's Schedule</div>
                <div style={{ display:"grid", gridTemplateColumns:"80px 1fr 160px 140px 160px 160px", gap:12, padding:"12px 20px", borderBottom:`1px solid ${C.border}`, background:"#FAFBFC" }}>
                  {["Time","Patient","Type","Optician","Confirmation Status","Action"].map(h=>(
                    <div key={h} style={{ fontSize:10, fontWeight:700, color:C.slateLight, textTransform:"uppercase", letterSpacing:1 }}>{h}</div>
                  ))}
                </div>
                {APPOINTMENTS.map((a,i)=>{
                  const sent = confirmSent[`appt-${i}`];
                  const confStatus = a.confirmed ? "confirmed" : sent ? "reminder-sent" : "not-contacted";
                  return (
                    <div key={i} style={{ display:"grid", gridTemplateColumns:"80px 1fr 160px 140px 160px 160px", gap:12, padding:"15px 20px", borderBottom:i<APPOINTMENTS.length-1?`1px solid ${C.border}`:"none", alignItems:"center", background:i%2===0?C.white:"#FAFBFD", transition:"background .12s" }}
                      onMouseEnter={e=>e.currentTarget.style.background="rgba(8,145,178,.04)"}
                      onMouseLeave={e=>e.currentTarget.style.background=i%2===0?C.white:"#FAFBFD"}>
                      <div style={{ fontWeight:700, fontSize:14 }}>{a.time}</div>
                      <div>
                        <div style={{ fontWeight:600, fontSize:13 }}>{a.patient}</div>
                        {a.viaIryss&&<span style={{ fontSize:10, color:C.teal, fontWeight:600, background:C.tealPale, padding:"1px 7px", borderRadius:20 }}>via Iryss</span>}
                      </div>
                      <div style={{ fontSize:13, color:C.slate }}>{a.type}</div>
                      <div style={{ fontSize:13 }}>{a.optician}</div>
                      <span style={{ fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:20, display:"inline-block",
                        background:confStatus==="confirmed"?"rgba(16,185,129,.1)":confStatus==="reminder-sent"?"rgba(245,158,11,.1)":"rgba(100,116,139,.08)",
                        color:confStatus==="confirmed"?C.green:confStatus==="reminder-sent"?C.amber:C.slateLight }}>
                        {confStatus==="confirmed"?"Confirmed ✓":confStatus==="reminder-sent"?"Reminder Sent":"Not Contacted"}
                      </span>
                      <div>
                        {a.confirmed||sent
                          ? <span style={{ fontSize:11, color:C.slateLight }}>—</span>
                          : <button onClick={()=>openConfirmationWA(a,i)} style={{ background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:8, padding:"6px 13px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:F, boxShadow:"0 2px 8px rgba(8,145,178,.25)" }}>Send Confirmation</button>
                        }
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Upcoming This Week */}
              <div style={{ background:C.white, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,.06)", marginBottom:22 }}>
                <div style={{ padding:"14px 20px", borderBottom:`1px solid ${C.border}`, fontWeight:700, fontSize:15, letterSpacing:-0.3 }}>📅 Upcoming This Week</div>
                {UPCOMING_WEEK.map((dayGroup,di)=>(
                  <div key={di}>
                    <div style={{ padding:"10px 20px", background:"#F7FAFC", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{ fontWeight:700, fontSize:13, color:C.navy }}>{dayGroup.day}</div>
                      <div style={{ fontSize:12, color:C.slateLight }}>{dayGroup.date}</div>
                      <span style={{ marginLeft:"auto", fontSize:11, color:C.slate }}>{dayGroup.appts.length} appointments · £{dayGroup.appts.reduce((a,x)=>a+x.revenue,0)} est. revenue</span>
                    </div>
                    {dayGroup.appts.map((a,i)=>(
                      <div key={i} style={{ display:"flex", alignItems:"center", gap:16, padding:"12px 20px", borderBottom:i<dayGroup.appts.length-1?`1px solid ${C.border}`:"none", background:i%2===0?C.white:"#FAFBFD" }}>
                        <div style={{ fontWeight:700, fontSize:13, width:46, flexShrink:0 }}>{a.time}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:600, fontSize:13 }}>{a.patient}</div>
                          <div style={{ fontSize:11, color:C.slate }}>{a.type} · {a.optician}</div>
                        </div>
                        <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:20, background:a.confirmed?"rgba(16,185,129,.1)":"rgba(245,158,11,.1)", color:a.confirmed?C.green:C.amber }}>
                          {a.confirmed?"Confirmed ✓":"Unconfirmed"}
                        </span>
                        <span style={{ fontSize:12, fontWeight:600, color:C.navy }}>£{a.revenue}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Revenue protected stat */}
              <div style={{ background:`linear-gradient(135deg,${C.navy} 0%,#0E2040 100%)`, borderRadius:16, padding:"18px 24px", marginBottom:18, display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 4px 20px rgba(8,15,30,.15)" }}>
                <div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,.35)", textTransform:"uppercase", letterSpacing:1.5, marginBottom:6 }}>This month</div>
                  <div style={{ fontSize:15, fontWeight:600, color:"#fff" }}>Estimated revenue protected by confirmations: <span style={{ color:"#6EE7B7", fontWeight:800 }}>£{APPOINTMENTS.filter(a=>a.confirmed).reduce((s,a)=>s+a.revenue,0).toLocaleString()}</span></div>
                </div>
                <button style={{ background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:10, padding:"11px 22px", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:F, flexShrink:0, boxShadow:"0 4px 14px rgba(8,145,178,.4)" }}>+ Log appointment</button>
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
          {/* ═══ SETTINGS ═══ */}
          {nav==="settings"&&(
            <div style={{ maxWidth:780 }}>

              {/* ── Practice Details ── */}
              <div style={{ background:C.white, borderRadius:16, border:`1px solid ${C.border}`, padding:"24px 28px", marginBottom:22, boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}>
                <div style={{ fontWeight:700, fontSize:16, color:C.navy, marginBottom:4, letterSpacing:-0.4 }}>🏥 Practice Details</div>
                <div style={{ fontSize:13, color:C.slate, marginBottom:20 }}>Your practice information used across all Iryss automations.</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 }}>
                  {[
                    { label:"Practice name",             key:"name",    placeholder:"Bright Eyes Opticians" },
                    { label:"Email address",             key:"email",   placeholder:"you@yourpractice.com"  },
                    { label:"WhatsApp number",           key:"whatsapp",placeholder:"+447827322027"         },
                    { label:"Google Business profile",   key:"google",  placeholder:"https://g.page/..."   },
                  ].map(f=>(
                    <div key={f.key}>
                      <label style={{ fontSize:11, fontWeight:700, color:C.slateLight, textTransform:"uppercase", letterSpacing:1.1, display:"block", marginBottom:6 }}>{f.label}</label>
                      <input value={practiceDetails[f.key]} onChange={e=>setPracticeDetails(prev=>({...prev,[f.key]:e.target.value}))}
                        placeholder={f.placeholder}
                        style={{ width:"100%", border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", fontSize:13, fontFamily:F, outline:"none", boxSizing:"border-box", color:C.navy, background:C.offWhite, transition:"border .15s" }}
                        onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.border} />
                    </div>
                  ))}
                </div>
                <button onClick={()=>{ setSettingsSaved(true); showToast("Practice details saved ✓"); setTimeout(()=>setSettingsSaved(false),2500); }}
                  style={{ background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:10, padding:"10px 22px", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:F, boxShadow:"0 2px 8px rgba(8,145,178,.3)", display:"flex", alignItems:"center", gap:8 }}>
                  {settingsSaved ? "✓ Saved!" : "Save Changes"}
                </button>
              </div>

              {/* ── Notifications ── */}
              <div style={{ background:C.white, borderRadius:16, border:`1px solid ${C.border}`, padding:"24px 28px", marginBottom:22, boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}>
                <div style={{ fontWeight:700, fontSize:16, color:C.navy, marginBottom:4, letterSpacing:-0.4 }}>🔔 Notifications</div>
                <div style={{ fontSize:13, color:C.slate, marginBottom:20 }}>Configure how and when you hear from Iryss.</div>

                {/* Daily Digest card */}
                <div style={{ border:`1px solid ${C.border}`, borderRadius:14, overflow:"hidden" }}>
                  <div style={{ padding:"16px 20px", background:"#FAFBFC", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:`1px solid ${C.border}` }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:14, color:C.navy, display:"flex", alignItems:"center", gap:10 }}>
                        Daily Digest Email
                        {digestEnabled
                          ? <span style={{ background:"rgba(16,185,129,.12)", color:C.green, fontWeight:700, fontSize:11, padding:"3px 10px", borderRadius:20, display:"flex", alignItems:"center", gap:5 }}><span style={{ width:6, height:6, borderRadius:"50%", background:C.green, display:"inline-block", boxShadow:"0 0 6px rgba(16,185,129,.6)" }} />Active</span>
                          : <span style={{ background:"rgba(100,116,139,.1)", color:C.slate, fontWeight:600, fontSize:11, padding:"3px 10px", borderRadius:20 }}>Off</span>
                        }
                      </div>
                      <div style={{ fontSize:12, color:C.slate, marginTop:3 }}>A morning summary of everything that happened overnight — sent to {practiceDetails.email}</div>
                    </div>
                    <div onClick={()=>setDigestEnabled(v=>!v)} style={{ width:44, height:24, borderRadius:12, background:digestEnabled?C.teal:C.border, cursor:"pointer", position:"relative", transition:"background .2s", flexShrink:0, marginLeft:16 }}>
                      <div style={{ position:"absolute", top:3, left:digestEnabled?22:3, width:18, height:18, borderRadius:"50%", background:"#fff", boxShadow:"0 1px 4px rgba(0,0,0,.2)", transition:"left .2s" }} />
                    </div>
                  </div>

                  <div style={{ padding:"16px 20px", display:"flex", alignItems:"center", gap:12, borderBottom:`1px solid ${C.border}` }}>
                    <span style={{ fontSize:13, fontWeight:600, color:C.navy }}>Send at:</span>
                    <select value={digestTime} onChange={e=>setDigestTime(e.target.value)}
                      style={{ border:`1px solid ${C.border}`, borderRadius:8, padding:"6px 12px", fontSize:13, fontFamily:F, color:C.navy, background:C.white, outline:"none", cursor:"pointer" }}>
                      {["7:00am","8:00am","9:00am"].map(t=><option key={t} value={t}>{t}</option>)}
                    </select>
                    <span style={{ fontSize:12, color:C.slateLight }}>every weekday morning</span>
                    <button onClick={()=>showToast(`Test digest sent to ${practiceDetails.email} ✓`)}
                      style={{ marginLeft:"auto", background:"none", border:`1px solid ${C.border}`, borderRadius:8, padding:"7px 14px", fontSize:12, fontWeight:700, color:C.slate, cursor:"pointer", fontFamily:F, transition:"all .15s" }}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor=C.teal;e.currentTarget.style.color=C.teal;}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.slate;}}>
                      Send Test Digest Now
                    </button>
                  </div>

                  {/* Digest preview */}
                  <div style={{ padding:"20px" }}>
                    <div style={{ fontSize:11, fontWeight:700, color:C.slateLight, textTransform:"uppercase", letterSpacing:1, marginBottom:12 }}>Preview</div>
                    <div style={{ border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden", fontFamily:"Georgia, serif" }}>
                      <div style={{ background:C.navy, padding:"18px 22px" }}>
                        <div style={{ fontSize:13, fontWeight:700, color:C.tealLt, letterSpacing:2, textTransform:"uppercase", marginBottom:4 }}>Iryss Daily Digest</div>
                        <div style={{ fontSize:18, fontWeight:700, color:"#fff" }}>Good morning, Bright Eyes 👋</div>
                        <div style={{ fontSize:12, color:"rgba(255,255,255,.45)", marginTop:4 }}>{new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"})}</div>
                      </div>
                      <div style={{ padding:"18px 22px", background:C.offWhite }}>
                        <div style={{ fontSize:13, color:C.slate, marginBottom:16, fontFamily:F }}>Here is your Iryss summary for today:</div>
                        {[
                          { icon:"🚨", label:"Overnight replies needing attention", value:urgentMessages.length, detail:urgentMessages.map(m=>m.patient).join(", ")||"None", color:urgentMessages.length>0?C.red:C.green },
                          { icon:"◷",  label:"Patients due for recall this week",  value:recallPatients.length, detail:`${recallPatients.length} patient${recallPatients.length!==1?"s":""} overdue or due soon`, color:C.amber },
                          { icon:"📅", label:"Unconfirmed appointments today",     value:noShowRisk.length, detail:`£${noShowRisk.reduce((a,p)=>a+p.revenue,0)} revenue at risk`, color:noShowRisk.length>0?C.red:C.green },
                          { icon:"🤖", label:"AI conversations handled overnight", value:12, detail:"All resolved automatically", color:C.teal },
                        ].map((row,i,arr)=>(
                          <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"10px 0", borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none", fontFamily:F }}>
                            <span style={{ fontSize:16, flexShrink:0 }}>{row.icon}</span>
                            <div style={{ flex:1 }}>
                              <div style={{ fontSize:13, color:C.navy, fontWeight:600 }}>{row.label}</div>
                              <div style={{ fontSize:12, color:C.slate, marginTop:2 }}>{row.detail}</div>
                            </div>
                            <div style={{ fontSize:20, fontWeight:800, color:row.color, letterSpacing:-1 }}>{row.value}</div>
                          </div>
                        ))}
                        <button style={{ width:"100%", marginTop:18, background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:10, padding:"11px", fontWeight:700, fontSize:13, cursor:"default", fontFamily:F }}>
                          View Dashboard →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Automation ── */}
              <div style={{ background:C.white, borderRadius:16, border:`1px solid ${C.border}`, padding:"24px 28px", boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}>
                <div style={{ fontWeight:700, fontSize:16, color:C.navy, marginBottom:4, letterSpacing:-0.4 }}>⚡ Automation</div>
                <div style={{ fontSize:13, color:C.slate, marginBottom:20 }}>Control which automations run automatically. All changes take effect immediately.</div>
                {[
                  { label:"Auto-send recall messages",                 sub:"Sends to patients 8+ months since last visit",    active:autoRecall,        toggle:()=>setAutoRecall(v=>!v)        },
                  { label:"Auto-send reorder reminders",               sub:"Sends to contact lens patients every 3 months",   active:autoReorder,       toggle:()=>setAutoReorder(v=>!v)       },
                  { label:"Auto-send appointment confirmations (48hr)", sub:"WhatsApp reminder 48 hours before appointment",   active:reminder48Active,  toggle:()=>setReminder48Active(v=>!v)  },
                  { label:"Auto-send appointment confirmations (2hr)",  sub:"Final reminder 2 hours before appointment",       active:reminder2hActive,  toggle:()=>setReminder2hActive(v=>!v)  },
                  { label:"Auto-send Google review requests",           sub:"Sent 24 hours after each appointment",            active:autoReview,        toggle:()=>setAutoReview(v=>!v)        },
                ].map((item,i,arr)=>(
                  <div key={item.label} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 0", borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none" }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:600, fontSize:14, color:C.navy, display:"flex", alignItems:"center", gap:8 }}>
                        {item.label}
                        {item.active
                          ? <span style={{ background:"rgba(16,185,129,.12)", color:C.green, fontWeight:700, fontSize:10, padding:"2px 9px", borderRadius:20 }}>Active</span>
                          : <span style={{ background:"rgba(100,116,139,.1)", color:C.slateLight, fontWeight:600, fontSize:10, padding:"2px 9px", borderRadius:20 }}>Off</span>
                        }
                      </div>
                      <div style={{ fontSize:12, color:C.slate, marginTop:2 }}>{item.sub}</div>
                    </div>
                    <div onClick={item.toggle} style={{ width:44, height:24, borderRadius:12, background:item.active?C.teal:C.border, cursor:"pointer", position:"relative", transition:"background .2s", flexShrink:0 }}>
                      <div style={{ position:"absolute", top:3, left:item.active?22:3, width:18, height:18, borderRadius:"50%", background:"#fff", boxShadow:"0 1px 4px rgba(0,0,0,.2)", transition:"left .2s" }} />
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ═══ INTELLIGENCE ═══ */}
          {nav==="intelligence"&&(()=>{
            const COMP_COLORS = { specsavers:"#7C3AED", "vision express":"#2563EB", boots:"#059669", "optical express":"#DC2626", asda:"#D97706", tesco:"#0891B2", cheaper:"#64748B", "went elsewhere":"#64748B", "another optician":"#64748B", "different optician":"#64748B", "vision direct":"#9333EA", "glasses direct":"#9333EA" };
            const competitorCounts = COMPETITOR_KW.map(kw=>({
              kw, label:kw.charAt(0).toUpperCase()+kw.slice(1),
              count:competitorMentions.filter(m=>m.keyword===kw).length,
              color:COMP_COLORS[kw]||C.slate
            })).filter(c=>c.count>0).sort((a,b)=>b.count-a.count);
            const maxCount = Math.max(...competitorCounts.map(c=>c.count), 1);
            const lostRevEst = competitorMentions.length * 320;
            return (
              <div>
                {/* KPI row */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
                  <SC label="Competitor mentions"  value={competitorMentions.length}                    accent={`linear-gradient(90deg,${C.red},#F97316)`}    sub="Live from inbox" trend={competitorMentions.length>0?"Action needed":null} trendUp={false} />
                  <SC label="Patients at risk"     value={new Set(competitorMentions.map(m=>m.patient)).size} accent={`linear-gradient(90deg,${C.amber},#EAB308)`} sub="Mentioned a competitor" />
                  <SC label="Est. revenue at risk" value={`£${lostRevEst.toLocaleString()}`}            accent={`linear-gradient(90deg,${C.red},#F97316)`}    sub="Based on avg £320/patient" />
                  <SC label="Competitors tracked"  value={COMPETITOR_KW.length}                         accent={`linear-gradient(90deg,${C.navy},#1E3A5F)`}   sub="Keywords monitored" />
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18, marginBottom:22 }}>
                  {/* Mentions table */}
                  <div style={{ background:C.white, borderRadius:16, padding:22, border:`1px solid ${C.border}`, boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}>
                    <div style={{ fontWeight:700, fontSize:15, marginBottom:16, letterSpacing:-0.3 }}>Competitor Mentions</div>
                    {competitorMentions.length===0
                      ? <div style={{ padding:"32px 0", textAlign:"center", color:C.slate, fontSize:14 }}>No competitor mentions detected yet. Iryss is actively monitoring your inbox.</div>
                      : competitorMentions.map((m,i)=>(
                          <div key={i} style={{ padding:"12px 0", borderBottom:i<competitorMentions.length-1?`1px solid ${C.border}`:"none" }}>
                            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
                              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                                <Avatar initials={m.patient.split(" ").map(w=>w[0]).join("").slice(0,2)} bg={C.red} size={28} />
                                <div>
                                  <div style={{ fontWeight:600, fontSize:13, color:C.navy }}>{m.patient}</div>
                                  <div style={{ fontSize:10, color:C.slate }}>{m.time}</div>
                                </div>
                              </div>
                              <span style={{ background:`${COMP_COLORS[m.keyword]||C.slate}20`, color:COMP_COLORS[m.keyword]||C.slate, fontSize:11, fontWeight:700, padding:"2px 9px", borderRadius:20 }}>{m.keyword}</span>
                            </div>
                            <div style={{ fontSize:12, color:C.slate, fontStyle:"italic", marginBottom:8, lineHeight:1.5 }}>
                              "{m.text.length>120?m.text.slice(0,120)+"…":m.text}"
                            </div>
                            {intelSent[`${m.patient}-${i}`]
                              ? <span style={{ fontSize:12, color:C.green, fontWeight:600 }}>✓ Win-back sent</span>
                              : <button onClick={()=>{
                                  const msg=`Hi ${m.patient.split(" ")[0]}, thank you for being a patient at Bright Eyes 👓 We noticed you may be considering your options — we'd love to keep you with us. As a loyalty thank you, we'd like to offer you a complimentary frame styling session and 10% off your next purchase. Just reply YES to claim it!`;
                                  openSendWA({...PATIENTS.find(p=>p.name===m.patient)||{id:`intel-${i}`,name:m.patient,phone:m.phone}, waMsg:msg});
                                  setIntelSent(s=>({...s,[`${m.patient}-${i}`]:true}));
                                }} style={{ background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:8, padding:"6px 13px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:F, boxShadow:"0 2px 8px rgba(8,145,178,.3)" }}>
                                  Win Back →
                                </button>
                            }
                          </div>
                        ))
                    }
                  </div>

                  {/* Right column */}
                  <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
                    {/* Competitor breakdown bar chart */}
                    <div style={{ background:C.white, borderRadius:16, padding:22, border:`1px solid ${C.border}`, boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}>
                      <div style={{ fontWeight:700, fontSize:15, marginBottom:16, letterSpacing:-0.3 }}>Competitor Breakdown</div>
                      {competitorCounts.length===0
                        ? <div style={{ color:C.slate, fontSize:13 }}>No mentions yet.</div>
                        : competitorCounts.map(c=>(
                            <div key={c.kw} style={{ marginBottom:10 }}>
                              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                                <span style={{ fontSize:12, fontWeight:600, color:C.navy }}>{c.label}</span>
                                <span style={{ fontSize:12, fontWeight:700, color:c.color }}>{c.count} mention{c.count!==1?"s":""}</span>
                              </div>
                              <div style={{ height:8, background:C.border, borderRadius:4, overflow:"hidden" }}>
                                <div style={{ width:`${Math.round((c.count/maxCount)*100)}%`, height:"100%", background:c.color, borderRadius:4 }} />
                              </div>
                            </div>
                          ))
                      }
                      {competitorCounts.length===0&&<div style={{ color:C.slate, fontSize:12, marginTop:4 }}>Iryss is scanning all incoming messages for competitor keywords.</div>}
                    </div>

                    {/* Lost revenue recovery card */}
                    <div style={{ background:`linear-gradient(135deg,${C.navy} 0%,#0E2040 100%)`, borderRadius:16, padding:22, boxShadow:"0 4px 20px rgba(8,15,30,.15)" }}>
                      <div style={{ fontWeight:700, fontSize:15, color:C.white, marginBottom:12, letterSpacing:-0.3 }}>💰 Recovery Opportunity</div>
                      <div style={{ fontSize:32, fontWeight:900, color:C.tealLt, letterSpacing:-1, marginBottom:4 }}>£{lostRevEst.toLocaleString()}</div>
                      <div style={{ fontSize:12, color:"rgba(255,255,255,.5)", marginBottom:16 }}>estimated revenue at risk from competitor mentions</div>
                      <div style={{ fontSize:13, color:"rgba(255,255,255,.7)", lineHeight:1.6, marginBottom:16 }}>
                        Each win-back WhatsApp takes 30 seconds. Recovering just half these patients would add <span style={{ color:C.tealLt, fontWeight:700 }}>£{Math.round(lostRevEst*0.5).toLocaleString()}</span> back to your practice.
                      </div>
                      <button onClick={()=>{}} style={{ width:"100%", background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:10, padding:"11px", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:F, boxShadow:"0 4px 16px rgba(8,145,178,.4)", opacity:competitorMentions.length===0?0.5:1 }}>
                        {competitorMentions.length===0?"No mentions to action":"Send All Win-Back Messages →"}
                      </button>
                    </div>

                    {/* Why patients leave */}
                    <div style={{ background:C.white, borderRadius:16, padding:22, border:`1px solid ${C.border}`, boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}>
                      <div style={{ fontWeight:700, fontSize:15, marginBottom:14, letterSpacing:-0.3 }}>Why Patients Leave</div>
                      {[
                        { reason:"Price / cheaper elsewhere", pct:38, color:C.red },
                        { reason:"Location / convenience",    pct:27, color:C.amber },
                        { reason:"Waiting times",             pct:18, color:C.teal },
                        { reason:"Service experience",        pct:10, color:"#8B5CF6" },
                        { reason:"Other",                     pct:7,  color:C.slate },
                      ].map(r=>(
                        <div key={r.reason} style={{ marginBottom:10 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                            <span style={{ fontSize:12, color:C.navy }}>{r.reason}</span>
                            <span style={{ fontSize:12, fontWeight:700, color:r.color }}>{r.pct}%</span>
                          </div>
                          <div style={{ height:6, background:C.border, borderRadius:3, overflow:"hidden" }}>
                            <div style={{ width:`${r.pct}%`, height:"100%", background:r.color, borderRadius:3 }} />
                          </div>
                        </div>
                      ))}
                      <div style={{ fontSize:11, color:C.slate, marginTop:10 }}>Source: Optical sector retention study 2024</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          </>)}
        </div>
      </div>

      {/* ═══ CSV IMPORT MODAL ═══ */}
      {showImport&&(
        <div onClick={()=>{ if(importStep!==2){ setShowImport(false); } }} style={{ position:"fixed", inset:0, background:"rgba(8,15,30,.8)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(6px)", fontFamily:F }}>
          <div onClick={e=>e.stopPropagation()} style={{ width:"100%", maxWidth:820, maxHeight:"92vh", background:C.white, borderRadius:24, boxShadow:"0 40px 100px rgba(0,0,0,.35)", overflow:"auto", display:"flex", flexDirection:"column" }}>

            {/* Modal header */}
            <div style={{ padding:"28px 32px 20px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
              <div>
                <div style={{ fontSize:20, fontWeight:800, color:C.navy, letterSpacing:-0.6 }}>Revenue Gap Analysis</div>
                <div style={{ fontSize:13, color:C.slate, marginTop:3 }}>Upload your patient list to discover hidden revenue opportunities</div>
              </div>
              {importStep!==2&&<button onClick={()=>setShowImport(false)} style={{ background:"none", border:"none", fontSize:24, cursor:"pointer", color:C.slateLight, lineHeight:1, padding:4 }}>×</button>}
            </div>

            {/* Progress steps */}
            <div style={{ padding:"20px 32px 0", flexShrink:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:0, marginBottom:24 }}>
                {[{n:1,label:"Upload List"},{n:2,label:"Analyse"},{n:3,label:"Your Results"}].map((s,i,arr)=>(
                  <div key={s.n} style={{ display:"flex", alignItems:"center", flex:1 }}>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                      <div style={{ width:32, height:32, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:13, background:importStep>s.n?C.green:importStep===s.n?C.teal:C.border, color:importStep>=s.n?"#fff":C.slateLight, transition:"all .4s" }}>
                        {importStep>s.n ? "✓" : s.n}
                      </div>
                      <div style={{ fontSize:11, fontWeight:importStep===s.n?700:500, color:importStep===s.n?C.teal:importStep>s.n?C.green:C.slateLight, whiteSpace:"nowrap" }}>{s.label}</div>
                    </div>
                    {i<arr.length-1&&<div style={{ flex:1, height:2, background:importStep>s.n?C.green:C.border, margin:"0 8px 18px", transition:"background .4s" }} />}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 1 — Upload */}
            {importStep===1&&(
              <div style={{ padding:"0 32px 32px", flex:1 }}>
                <input ref={importFileRef} type="file" accept=".csv" style={{ display:"none" }} onChange={e=>handleImportFile(e.target.files[0])} />

                {/* Drop zone */}
                <div
                  onClick={()=>importFileRef.current?.click()}
                  onDragOver={e=>{ e.preventDefault(); setImportDrag(true); }}
                  onDragLeave={()=>setImportDrag(false)}
                  onDrop={e=>{ e.preventDefault(); setImportDrag(false); handleImportFile(e.dataTransfer.files[0]); }}
                  style={{ border:`2px dashed ${importDrag?C.teal:C.border}`, borderRadius:16, padding:"52px 32px", textAlign:"center", cursor:"pointer", background:importDrag?"rgba(8,145,178,.04)":C.offWhite, transition:"all .2s", marginBottom:20 }}>
                  <div style={{ fontSize:40, marginBottom:14 }}>📂</div>
                  <div style={{ fontSize:17, fontWeight:700, color:C.navy, marginBottom:6 }}>Drop your patient list CSV here</div>
                  <div style={{ fontSize:13, color:C.slate, marginBottom:16 }}>or <span style={{ color:C.teal, fontWeight:600, textDecoration:"underline" }}>click to browse</span></div>
                  <div style={{ fontSize:12, color:C.slateLight, background:C.white, border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 16px", display:"inline-block" }}>
                    We accept: <strong>Name</strong>, <strong>Phone</strong>, <strong>Last Visit Date</strong>, <strong>Product Type</strong>, <strong>Email</strong>
                  </div>
                </div>

                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
                  <div style={{ display:"flex", gap:16, alignItems:"center" }}>
                    <a href="#" onClick={e=>{ e.preventDefault();
                      const csv = "Name,Phone,Last Visit Date,Product Type,Email\nJohn Smith,+447700000001,2023-06-15,Varifocals,john@email.com\nSue Jones,+447700000002,2024-01-20,Contact Lenses,sue@email.com\n";
                      const blob = new Blob([csv], {type:"text/csv"});
                      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "iryss-patient-template.csv"; a.click();
                    }} style={{ fontSize:13, color:C.teal, fontWeight:600, textDecoration:"none" }}>⬇ Download sample CSV template</a>
                    <span style={{ fontSize:13, color:C.slateLight }}>|</span>
                    <span style={{ fontSize:13, color:C.slate }}>🔒 Your data is encrypted and never shared</span>
                  </div>
                  <button onClick={useDemoImport} style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:10, padding:"9px 18px", fontSize:13, fontWeight:700, color:C.slate, cursor:"pointer", fontFamily:F, transition:"all .15s" }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=C.teal;e.currentTarget.style.color=C.teal;}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.slate;}}>
                    Try with demo data →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 — Analysing */}
            {importStep===2&&(
              <div style={{ padding:"20px 32px 40px", flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                <div style={{ fontSize:36, marginBottom:16 }}>🔍</div>
                <div style={{ fontSize:20, fontWeight:800, color:C.navy, marginBottom:6, letterSpacing:-0.5 }}>Analysing your patient list…</div>
                <div style={{ fontSize:13, color:C.slate, marginBottom:28 }}>This takes just a few seconds</div>
                <div style={{ width:"100%", maxWidth:440, height:8, background:C.border, borderRadius:4, overflow:"hidden", marginBottom:32 }}>
                  <div style={{ width:`${importProgress}%`, height:"100%", background:`linear-gradient(90deg,${C.teal},${C.tealLt})`, borderRadius:4, transition:"width .1s linear" }} />
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:14, width:"100%", maxWidth:560 }}>
                  {[
                    { label:"Patients scanned",       value:importCounters.scanned, color:C.teal   },
                    { label:"At-risk identified",      value:importCounters.atRisk,  color:C.red    },
                    { label:"Recalls due",             value:importCounters.recalls, color:C.amber  },
                    { label:"Revenue gap",             value:`£${importCounters.gap.toLocaleString()}`, color:C.green },
                  ].map(c=>(
                    <div key={c.label} style={{ background:C.offWhite, borderRadius:12, padding:"14px 12px", textAlign:"center", border:`1px solid ${C.border}` }}>
                      <div style={{ fontSize:20, fontWeight:800, color:c.color, letterSpacing:-0.5, marginBottom:4 }}>{c.value}</div>
                      <div style={{ fontSize:10, color:C.slate, fontWeight:500, lineHeight:1.3 }}>{c.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3 — Results */}
            {importStep===3&&(()=>{
              const rows = importData || [];
              const atRiskRows  = rows.filter(r=>r.risk!=='low');
              const highRows    = rows.filter(r=>r.risk==='high');
              const lensRows    = rows.filter(r=>/contact|lens|cl|oasys/i.test(r.product));
              const gapTotal    = atRiskRows.reduce((a,r)=>a+r.revenue, 0);
              const monthlyGrowth = Math.round(gapTotal * 0.07);
              const top10 = [...atRiskRows].sort((a,b)=>b.riskScore-a.riskScore).slice(0,10);
              return (
                <div style={{ padding:"0 32px 32px", flex:1 }}>
                  {/* Hero */}
                  <div style={{ background:`linear-gradient(135deg,${C.navy} 0%,#0E2040 100%)`, borderRadius:16, padding:"28px 32px", marginBottom:22, textAlign:"center" }}>
                    <div style={{ fontSize:12, color:"rgba(255,255,255,.4)", textTransform:"uppercase", letterSpacing:2, marginBottom:8 }}>Revenue sitting in your patient list</div>
                    <div style={{ fontSize:52, fontWeight:800, color:C.tealLt, letterSpacing:-2, lineHeight:1, marginBottom:8 }}>£{gapTotal.toLocaleString()}</div>
                    <div style={{ fontSize:14, color:"rgba(255,255,255,.55)" }}>from {atRiskRows.length} patients who haven't returned</div>
                  </div>

                  {/* 4 result cards */}
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:22 }}>
                    {[
                      { icon:"⚠️",  label:"Overdue for recall",         value:highRows.length,   sub:`${rows.length} total scanned`,       color:C.red   },
                      { icon:"◉",   label:"Lens reorders due",           value:lensRows.length,  sub:"Contact lens patients",               color:C.teal  },
                      { icon:"🎯",  label:"High dropout risk",           value:highRows.length,  sub:"18+ months since last visit",          color:C.amber },
                      { icon:"💰",  label:"Monthly revenue recoverable", value:`£${Math.round(gapTotal/12).toLocaleString()}`, sub:"Est. monthly if re-engaged", color:C.green },
                    ].map(c=>(
                      <div key={c.label} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 16px", boxShadow:"0 2px 8px rgba(0,0,0,.05)" }}>
                        <div style={{ fontSize:22, marginBottom:8 }}>{c.icon}</div>
                        <div style={{ fontSize:24, fontWeight:800, color:c.color, letterSpacing:-1, marginBottom:4 }}>{c.value}</div>
                        <div style={{ fontSize:11, fontWeight:600, color:C.navy, marginBottom:2 }}>{c.label}</div>
                        <div style={{ fontSize:11, color:C.slateLight }}>{c.sub}</div>
                      </div>
                    ))}
                  </div>

                  {/* Top 10 table */}
                  {top10.length>0&&(
                    <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.border}`, overflow:"hidden", marginBottom:22, boxShadow:"0 2px 8px rgba(0,0,0,.05)" }}>
                      <div style={{ padding:"14px 20px", borderBottom:`1px solid ${C.border}`, fontWeight:700, fontSize:14, color:C.navy }}>
                        Top {top10.length} at-risk patients
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 120px 160px 90px 90px", gap:12, padding:"10px 20px", background:"#FAFBFC", borderBottom:`1px solid ${C.border}` }}>
                        {["Name","Last Visit","Product","Risk","Est. Value"].map(h=>(
                          <div key={h} style={{ fontSize:10, fontWeight:700, color:C.slateLight, textTransform:"uppercase", letterSpacing:1 }}>{h}</div>
                        ))}
                      </div>
                      {top10.map((p,i)=>(
                        <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 120px 160px 90px 90px", gap:12, padding:"12px 20px", borderBottom:i<top10.length-1?`1px solid ${C.border}`:"none", alignItems:"center", background:i%2===0?C.white:"#FAFBFD" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                            <Avatar initials={p.initials} bg={p.risk==="high"?C.red:p.risk==="medium"?C.amber:C.green} size={28} />
                            <span style={{ fontWeight:600, fontSize:13 }}>{p.name}</span>
                          </div>
                          <div style={{ fontSize:12, color:C.slate }}>{p.lastVisit}</div>
                          <div style={{ fontSize:12, color:C.navy, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.product}</div>
                          <Chip color={riskFg[p.risk]}>{riskLabel[p.risk]}</Chip>
                          <div style={{ fontWeight:700, fontSize:13, color:C.navy }}>£{p.revenue}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Urgency */}
                  <div style={{ background:"rgba(245,158,11,.06)", border:"1px solid rgba(245,158,11,.2)", borderRadius:12, padding:"12px 18px", marginBottom:20, display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontSize:16 }}>⏳</span>
                    <div style={{ fontSize:13, color:C.amber, fontWeight:600 }}>
                      Based on industry averages, this revenue gap grows by approximately <strong>£{monthlyGrowth.toLocaleString()}</strong> every month you wait.
                    </div>
                  </div>

                  {/* CTAs */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                    <button style={{ background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:12, padding:"16px 24px", fontWeight:800, fontSize:15, cursor:"pointer", fontFamily:F, boxShadow:"0 4px 20px rgba(8,145,178,.35)", letterSpacing:-0.3 }}>
                      Start Free Trial — Recover This Revenue →
                    </button>
                    <button onClick={()=>showToast("PDF export coming soon — we'll email it to you ✓")} style={{ background:C.white, color:C.navy, border:`2px solid ${C.border}`, borderRadius:12, padding:"16px 24px", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:F, letterSpacing:-0.3 }}>
                      ⬇ Export This Report as PDF
                    </button>
                  </div>

                  <div style={{ textAlign:"center", marginTop:14 }}>
                    <button onClick={resetImport} style={{ background:"none", border:"none", fontSize:12, color:C.slateLight, cursor:"pointer", fontFamily:F }}>← Upload a different file</button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ═══ TOAST ═══ */}
      {toastMsg&&(
        <div style={{ position:"fixed", bottom:32, left:"50%", transform:"translateX(-50%)", background:C.navy, color:"#fff", borderRadius:12, padding:"13px 22px", fontSize:14, fontWeight:600, fontFamily:F, zIndex:9999, boxShadow:"0 8px 32px rgba(0,0,0,.25)", display:"flex", alignItems:"center", gap:10, whiteSpace:"nowrap", animation:"fadeIn .25s ease" }}>
          <span style={{ color:C.green, fontSize:16 }}>✓</span>
          {toastMsg}
        </div>
      )}

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

      {drill==="urgent-messages"&&(
        <DrillPanel title="Urgent Messages" sub={`${urgentMessages.length} conversation${urgentMessages.length!==1?"s":""} need your attention`} onClose={()=>setDrill(null)} onFullPage={()=>{ setDrill(null); goNav("inbox"); }}>
          {urgentMessages.length===0?(
            <div style={{ textAlign:"center", padding:"48px 0", color:C.slate, fontSize:14 }}>
              <div style={{ fontSize:36, marginBottom:12 }}>✅</div>
              No urgent messages right now — all clear!
            </div>
          ):(
            <>
              <div style={{ background:"rgba(239,68,68,.05)", border:"1px solid rgba(239,68,68,.12)", borderRadius:12, padding:"14px 16px", marginBottom:20, display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ width:10, height:10, borderRadius:"50%", background:C.red, display:"inline-block", flexShrink:0, animation:"pulseDot 1.5s ease-in-out infinite, pulseRing 1.5s ease-in-out infinite" }} />
                <div style={{ fontSize:13, color:C.red, fontWeight:600 }}>These patients have sent inbound messages with urgent or negative sentiment that have not yet been replied to.</div>
              </div>
              {[...urgentMessages].sort((a,b)=>new Date(b.thread.slice(-1)[0]?.sent_at||0)-new Date(a.thread.slice(-1)[0]?.sent_at||0)).map((m,i,arr)=>{
                const lastMsg = m.thread.filter(t=>t.from==='patient').slice(-1)[0];
                return (
                  <div key={m.id} style={{ padding:"14px 0", borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
                      <Avatar initials={m.initials} bg={m.sentiment==='urgent'?C.red:C.amber} size={38} />
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:700, fontSize:14, color:C.navy, display:"flex", alignItems:"center", gap:8 }}>
                          {m.patient}
                          {m.sentiment==='urgent'
                            ? <span style={{ fontSize:10, fontWeight:700, color:C.red, background:"rgba(239,68,68,.1)", padding:"2px 8px", borderRadius:20, animation:"pulseDot 1.5s ease-in-out infinite" }}>🚨 Urgent</span>
                            : <span style={{ fontSize:10, fontWeight:700, color:C.amber, background:"rgba(245,158,11,.1)", padding:"2px 8px", borderRadius:20 }}>⚠️ Concerned</span>
                          }
                        </div>
                        <div style={{ fontSize:11, color:C.slateLight, marginTop:2 }}>{m.time}</div>
                      </div>
                      <button onClick={()=>{ setSelectedThread(m); setDrill(null); goNav("inbox"); }} style={{ background:`linear-gradient(135deg,${C.teal},${C.tealLt})`, color:"#fff", border:"none", borderRadius:10, padding:"8px 16px", fontWeight:700, fontSize:12, cursor:"pointer", fontFamily:F, boxShadow:"0 2px 8px rgba(8,145,178,.3)", flexShrink:0 }}>
                        Reply Now →
                      </button>
                    </div>
                    {lastMsg&&(
                      <div style={{ background:"#F7FAFC", border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", fontSize:13, color:C.navy, lineHeight:1.6, marginLeft:50, borderLeft:`3px solid ${m.sentiment==='urgent'?C.red:C.amber}` }}>
                        "{lastMsg.text}"
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
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

      {drill==="no-show-risk"&&(
        <DrillPanel title="No-Show Risk" sub={`${noShowRisk.length} unconfirmed appointment${noShowRisk.length!==1?"s":""} in next 24 hours`} onClose={()=>setDrill(null)}>
          <div style={{ background:"rgba(239,68,68,.05)", border:"1px solid rgba(239,68,68,.12)", borderRadius:12, padding:"14px 16px", marginBottom:20 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:C.red, marginBottom:4 }}>Estimated revenue at risk</div>
                <div style={{ fontSize:26, fontWeight:800, color:C.red, letterSpacing:-1 }}>£{noShowRisk.reduce((a,p)=>a+p.revenue,0)}</div>
              </div>
              <div style={{ fontSize:28 }}>⚠️</div>
            </div>
            <div style={{ fontSize:12, color:C.slate, marginTop:8, lineHeight:1.6 }}>Send confirmation messages now to reduce no-show likelihood. Practices using Iryss reminders see up to 40% fewer no-shows.</div>
          </div>
          {noShowRisk.map((a,i,arr)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none" }}>
              <div style={{ width:46, textAlign:"center", background:"rgba(239,68,68,.08)", borderRadius:8, padding:"6px 0", flexShrink:0 }}>
                <div style={{ fontSize:13, fontWeight:800, color:C.red }}>{a.time}</div>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:14 }}>{a.patient}</div>
                <div style={{ fontSize:12, color:C.slate }}>{a.type} · {a.optician}</div>
                <div style={{ fontSize:11, color:C.slate, marginTop:2 }}>Revenue at risk: <span style={{ color:C.red, fontWeight:700 }}>£{a.revenue}</span></div>
              </div>
              <button onClick={()=>openConfirmationWA(a,`risk-${i}`)} style={{ fontSize:12, fontWeight:700, padding:"7px 14px", borderRadius:10, border:"none", background:confirmSent[`appt-risk-${i}`]?"rgba(16,185,129,.1)":"rgba(37,211,102,.1)", color:confirmSent[`appt-risk-${i}`]?C.green:"#16a34a", cursor:"pointer" }}>
                {confirmSent[`appt-risk-${i}`]?"✓ Sent":"Send reminder"}
              </button>
            </div>
          ))}
          {noShowRisk.length===0&&(
            <div style={{ textAlign:"center", padding:"32px 0", color:C.slate, fontSize:14 }}>All appointments confirmed — no risk today 🎉</div>
          )}
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
            { patient:"Jim Bru",     topic:"Multifocal contact lens enquiry → appointment booked", time:"Today 14:32",  resolved:true  },
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
