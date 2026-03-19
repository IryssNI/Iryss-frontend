import { useState } from "react";

export default function LoginScreen({ onLogin }) {
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
            {loading ? "Signing in…" : "Sign in →"}
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
