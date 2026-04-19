/**
 * IRYSS — 90-second pitch video · v3 (cinematic)
 * 1920×1080 @ 30fps · 2700 frames total
 *
 * Upgrades from v2:
 *  · Scene 1  ambient orbs + radial gradient + word-by-word hook reveal
 *  · Scene 2  animated patient table — rows fade & slide off to visualise 25% loss
 *  · Scene 3  Practice Score rendered in a mock dashboard window with live KPIs
 *  · Scene 4  four richly animated product demos
 *              – WhatsApp inbox with typing indicator → message → reply
 *              – Revenue Leakage card with bar animations + count-ups
 *              – Myopia axial-length chart drawing dot-by-dot with trend line
 *              – Scribe waveform → processing dots → clinical note cascading in
 *  · Scene 5  £20,000 counter roll + stat cards popping in
 *  · Scene 6  CRM partner chips with rolling stagger + subtle map background
 *  · Scene 7  cinematic logo reveal + URL typewriter
 *  · Scene transitions via opacity gating for buttery crossfades
 */

import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  random,
  Easing,
} from "remotion";

// ═══════════════════════════════════════════════════════════════════════
// Palette
// ═══════════════════════════════════════════════════════════════════════
const C = {
  navy: "#0C1220",
  navyLt: "#1A2541",
  navyMid: "#14203A",
  teal: "#0891B2",
  tealLt: "#06B6D4",
  tealSky: "#22D3EE",
  green: "#10B981",
  greenLt: "#34D399",
  red: "#EF4444",
  redLt: "#F87171",
  amber: "#F59E0B",
  amberLt: "#FBBF24",
  purple: "#8B5CF6",
  purpleLt: "#A78BFA",
  pink: "#EC4899",
  orange: "#F97316",
  text: "#0F172A",
  muted: "#64748B",
  mutedLt: "#94A3B8",
  border: "#E2E8F0",
  bg: "#F8FAFB",
  bgCool: "#EFF6FF",
  white: "#FFFFFF",
};

const FONT = "'Plus Jakarta Sans', -apple-system, 'Segoe UI', system-ui, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, 'SF Mono', monospace";

// ═══════════════════════════════════════════════════════════════════════
// Easings + helpers
// ═══════════════════════════════════════════════════════════════════════
const easeOutExpo = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOutCubic = Easing.bezier(0.65, 0, 0.35, 1);

const fadeIn = (f: number, s = 0, d = 18) =>
  interpolate(f, [s, s + d], [0, 1], { easing: easeOutExpo, extrapolateRight: "clamp", extrapolateLeft: "clamp" });

const fadeOut = (f: number, s: number, d = 15) =>
  interpolate(f, [s, s + d], [1, 0], { easing: easeInOutCubic, extrapolateRight: "clamp", extrapolateLeft: "clamp" });

const slideUp = (f: number, s = 0, d = 22, from = 40) =>
  interpolate(f, [s, s + d], [from, 0], { easing: easeOutExpo, extrapolateRight: "clamp", extrapolateLeft: "clamp" });

// ═══════════════════════════════════════════════════════════════════════
// Ambient visuals (dark scenes)
// ═══════════════════════════════════════════════════════════════════════
const Orb: React.FC<{ x: number; y: number; size: number; color: string; alpha?: number; delay?: number }> = ({ x, y, size, color, alpha = 0.25, delay = 0 }) => {
  const frame = useCurrentFrame();
  const drift = Math.sin((frame + delay) / 60) * 20;
  const pulse = 0.9 + 0.1 * Math.sin((frame + delay) / 40);
  return (
    <div
      style={{
        position: "absolute",
        top: y + drift,
        left: x,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, rgba(0,0,0,0) 60%)`,
        opacity: alpha,
        filter: "blur(60px)",
        transform: `scale(${pulse})`,
        pointerEvents: "none",
      }}
    />
  );
};

const Particles: React.FC<{ count?: number; color?: string; seed?: string }> = ({ count = 40, color = "rgba(255,255,255,.25)", seed = "p" }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const baseX = random(`${seed}-x-${i}`) * width;
        const baseY = random(`${seed}-y-${i}`) * height;
        const speed = 0.3 + random(`${seed}-s-${i}`) * 0.8;
        const size = 2 + random(`${seed}-sz-${i}`) * 3;
        const dy = -((frame * speed) % (height + 200)) + 100;
        const alpha = 0.4 + Math.sin((frame + i * 10) / 30) * 0.3;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: baseX,
              top: baseY + dy,
              width: size,
              height: size,
              borderRadius: "50%",
              background: color,
              opacity: Math.max(0, alpha),
              pointerEvents: "none",
            }}
          />
        );
      })}
    </>
  );
};

const GridBackground: React.FC<{ opacity?: number; color?: string }> = ({ opacity = 0.04, color = "#fff" }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
      backgroundSize: "56px 56px",
      opacity,
      pointerEvents: "none",
    }}
  />
);

// ═══════════════════════════════════════════════════════════════════════
// Logo
// ═══════════════════════════════════════════════════════════════════════
const IryssLogo: React.FC<{ size?: number; color?: string }> = ({ size = 90, color = "#fff" }) => (
  <div style={{ display: "flex", alignItems: "baseline", fontFamily: FONT, fontWeight: 800, letterSpacing: -3, fontSize: size }}>
    <span style={{ color }}>iry</span>
    <span
      style={{
        background: `linear-gradient(135deg,${C.teal},${C.tealLt},${C.tealSky})`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      ss
    </span>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════
// App frame (browser/laptop chrome around dashboard mock)
// ═══════════════════════════════════════════════════════════════════════
const AppFrame: React.FC<{ children: React.ReactNode; width?: number; height?: number; shadow?: boolean }> = ({
  children,
  width = 1200,
  height = 700,
  shadow = true,
}) => (
  <div
    style={{
      width,
      height,
      background: C.white,
      borderRadius: 16,
      overflow: "hidden",
      boxShadow: shadow ? "0 40px 120px rgba(0,0,0,.35), 0 0 0 1px rgba(255,255,255,.05)" : undefined,
      display: "flex",
      flexDirection: "column",
    }}
  >
    <div style={{ height: 36, background: "#F1F5F9", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: 7, padding: "0 14px" }}>
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57" }} />
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FEBC2E" }} />
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28C840" }} />
      <div style={{ flex: 1, textAlign: "center", fontSize: 11, color: C.mutedLt, fontFamily: MONO, letterSpacing: 0.3 }}>app.theiryss.com</div>
    </div>
    <div style={{ flex: 1, background: C.bg, overflow: "hidden" }}>{children}</div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════
// Sparkline
// ═══════════════════════════════════════════════════════════════════════
const Spark: React.FC<{ data: number[]; color: string; width?: number; height?: number; progress?: number }> = ({ data, color, width = 100, height = 30, progress = 1 }) => {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const pts = data.map((v, i) => [i * step, height - ((v - min) / range) * height] as const);
  const trimCount = Math.max(2, Math.floor(pts.length * Math.min(1, Math.max(0, progress))));
  const shown = pts.slice(0, trimCount);
  const line = shown.map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const last = shown[shown.length - 1];
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <path d={`${line} L${last[0]} ${height} L0 ${height} Z`} fill={color} opacity={0.15} />
      <path d={line} fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r={3} fill={color} />
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// Count-up helper
// ═══════════════════════════════════════════════════════════════════════
const useCount = (from: number, to: number, startFrame = 0, duration = 60) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [startFrame, startFrame + duration], [0, 1], { easing: easeOutExpo, extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  return from + (to - from) * p;
};

// ═══════════════════════════════════════════════════════════════════════
// SCENE 1 — HOOK  (0–240)
// ═══════════════════════════════════════════════════════════════════════
const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 12, mass: 0.8 } });
  const logoGlow = 0.4 + Math.sin(frame / 25) * 0.25;

  const line1Chars = "Specsavers has 500 marketers.".split("");
  const line2Chars = "You now have one.".split("");

  const sceneOpacity = fadeOut(frame, 220, 20);

  return (
    <AbsoluteFill style={{ background: `linear-gradient(135deg,${C.navy} 0%,${C.navyLt} 50%,#1E2C4F 100%)`, fontFamily: FONT, opacity: sceneOpacity }}>
      <GridBackground />
      <Orb x={-200} y={-150} size={900} color={C.teal} alpha={0.22} delay={0} />
      <Orb x={1400} y={700} size={700} color={C.tealSky} alpha={0.18} delay={40} />
      <Orb x={800} y={-200} size={500} color={C.purple} alpha={0.12} delay={80} />
      <Particles count={35} color="rgba(34,211,238,.4)" seed="hook" />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div
          style={{
            transform: `scale(${logoScale})`,
            opacity: fadeIn(frame, 0, 20),
            marginBottom: 50,
            filter: `drop-shadow(0 0 ${30 * logoGlow}px rgba(34,211,238,${0.5 * logoGlow}))`,
          }}
        >
          <IryssLogo size={110} />
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "rgba(255,255,255,.55)",
              textAlign: "center",
              marginTop: 10,
            }}
          >
            PATIENT RETENTION
          </div>
        </div>

        {/* Line 1 — word-by-word reveal */}
        <div
          style={{
            fontSize: 78,
            fontWeight: 800,
            color: C.white,
            letterSpacing: -2.5,
            textAlign: "center",
            lineHeight: 1.1,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 1400,
          }}
        >
          {line1Chars.map((ch, i) => {
            const start = 50 + i * 1.8;
            return (
              <span
                key={i}
                style={{
                  opacity: fadeIn(frame, start, 10),
                  display: "inline-block",
                  transform: `translateY(${slideUp(frame, start, 14, 12)}px)`,
                  whiteSpace: ch === " " ? "pre" : "normal",
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>

        {/* Line 2 — with accent on "one" */}
        <div
          style={{
            fontSize: 78,
            fontWeight: 800,
            letterSpacing: -2.5,
            color: C.white,
            textAlign: "center",
            lineHeight: 1.1,
            marginTop: 24,
            display: "flex",
            justifyContent: "center",
          }}
        >
          {line2Chars.map((ch, i) => {
            const start = 130 + i * 1.8;
            const isOne = i >= line2Chars.length - 4 && i < line2Chars.length - 1;
            return (
              <span
                key={i}
                style={{
                  opacity: fadeIn(frame, start, 10),
                  display: "inline-block",
                  transform: `translateY(${slideUp(frame, start, 14, 12)}px)`,
                  whiteSpace: ch === " " ? "pre" : "normal",
                  background: isOne ? `linear-gradient(135deg,${C.teal},${C.tealSky})` : "transparent",
                  WebkitBackgroundClip: isOne ? "text" : "unset",
                  WebkitTextFillColor: isOne ? "transparent" : undefined,
                  backgroundClip: isOne ? "text" : "unset",
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// SCENE 2 — PROBLEM (0–360 local)
// Animated patient table where 25% of rows fade to grey + slide off.
// ═══════════════════════════════════════════════════════════════════════
const SceneProblem: React.FC = () => {
  const frame = useCurrentFrame();
  const sceneOpacity = interpolate(frame, [0, 18, 340, 360], [0, 1, 1, 0], { easing: easeInOutCubic });

  const painPoints = ["Paper recalls go unread.", "SMS gets ignored.", "Patients drift to the chains."];

  const patients = [
    { name: "Louise Everton", lastVisit: "6 mo", cat: "Contact Lens", lost: true },
    { name: "Tom Bradley", lastVisit: "9 mo", cat: "General", lost: false },
    { name: "Sophia Patel", lastVisit: "14 mo", cat: "Varifocal", lost: true },
    { name: "Ethan Kumar", lastVisit: "3 mo", cat: "Myopia", lost: false },
    { name: "Mia Davies", lastVisit: "11 mo", cat: "Contact Lens", lost: false },
    { name: "Jack Morgan", lastVisit: "22 mo", cat: "General", lost: true },
    { name: "Ruby Fisher", lastVisit: "5 mo", cat: "Varifocal", lost: false },
    { name: "Alfie Bennett", lastVisit: "18 mo", cat: "Contact Lens", lost: true },
  ];

  return (
    <AbsoluteFill style={{ background: C.white, fontFamily: FONT, opacity: sceneOpacity }}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 60, flexDirection: "column" }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: C.red,
            opacity: fadeIn(frame, 0, 18),
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: C.red,
              boxShadow: `0 0 12px ${C.red}99`,
              animation: "pulse 1.5s infinite",
            }}
          />
          The problem
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 60, marginBottom: 40 }}>
          <div
            style={{
              fontSize: 220,
              fontWeight: 800,
              letterSpacing: -12,
              background: `linear-gradient(135deg,${C.red},${C.amber})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1,
              opacity: fadeIn(frame, 10, 24),
            }}
          >
            {Math.round(interpolate(frame, [15, 80], [0, 25], { easing: easeOutExpo, extrapolateRight: "clamp", extrapolateLeft: "clamp" }))}%
          </div>

          <div style={{ opacity: fadeIn(frame, 80, 22), maxWidth: 480 }}>
            <div style={{ fontSize: 30, fontWeight: 700, color: C.text, letterSpacing: -0.8, lineHeight: 1.25, marginBottom: 16 }}>
              of patients independents <em style={{ color: C.red, fontStyle: "normal" }}>should</em> retain — are lost.
            </div>
            <div style={{ fontSize: 16, color: C.muted, fontWeight: 500, lineHeight: 1.6 }}>
              Around 1 in every 4 patients walks out of the door each year. Most never come back.
            </div>
          </div>
        </div>

        {/* Animated patient table */}
        <div
          style={{
            width: 900,
            background: C.white,
            borderRadius: 16,
            border: `1px solid ${C.border}`,
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,.08)",
            opacity: fadeIn(frame, 100, 22),
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 140px", padding: "12px 22px", borderBottom: `1px solid ${C.border}`, background: C.bg, fontSize: 11, fontWeight: 700, color: C.mutedLt, textTransform: "uppercase", letterSpacing: 1 }}>
            <div>Patient</div>
            <div>Category</div>
            <div>Last visit</div>
            <div style={{ textAlign: "right" }}>Status</div>
          </div>
          {patients.map((p, i) => {
            const lossStart = 150 + i * 12;
            const lossProgress = p.lost ? fadeIn(frame, lossStart, 40) : 0;
            const textAlpha = p.lost ? 1 - lossProgress * 0.7 : 1;
            const offset = p.lost ? lossProgress * 180 : 0;
            return (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1.2fr 1fr 140px",
                  padding: "14px 22px",
                  borderBottom: i < patients.length - 1 ? `1px solid #F1F5F9` : "none",
                  alignItems: "center",
                  background: C.white,
                  transform: `translateX(${offset}px)`,
                  opacity: fadeIn(frame, 108 + i * 6, 14),
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: p.lost ? "#CBD5E1" : C.teal,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 700,
                      opacity: textAlpha,
                    }}
                  >
                    {p.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: p.lost ? C.mutedLt : C.text, opacity: textAlpha, textDecoration: p.lost && lossProgress > 0.5 ? "line-through" : "none" }}>{p.name}</div>
                </div>
                <div style={{ fontSize: 12, color: p.lost ? C.mutedLt : C.muted, opacity: textAlpha }}>{p.cat}</div>
                <div style={{ fontSize: 12, color: p.lost ? C.mutedLt : C.muted, fontFamily: MONO, opacity: textAlpha }}>{p.lastVisit}</div>
                <div style={{ textAlign: "right" }}>
                  {p.lost ? (
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: `rgba(239,68,68,${0.1 + lossProgress * 0.15})`, color: C.red, letterSpacing: 0.3, opacity: fadeIn(frame, lossStart - 4, 12) }}>
                      ● LOST
                    </span>
                  ) : (
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "rgba(16,185,129,.1)", color: C.green, letterSpacing: 0.3, opacity: textAlpha }}>ACTIVE</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pain chips */}
        <div style={{ display: "flex", gap: 18, marginTop: 30 }}>
          {painPoints.map((p, i) => (
            <div
              key={i}
              style={{
                fontSize: 18,
                color: C.muted,
                fontWeight: 600,
                padding: "12px 24px",
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                background: C.white,
                opacity: fadeIn(frame, 260 + i * 15, 18),
                transform: `translateY(${slideUp(frame, 260 + i * 15, 22)}px)`,
              }}
            >
              {p}
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// SCENE 3 — SOLUTION (Practice Score in dashboard context)  (0–450 local)
// ═══════════════════════════════════════════════════════════════════════
const SceneSolution: React.FC = () => {
  const frame = useCurrentFrame();
  const sceneOpacity = interpolate(frame, [0, 18, 430, 450], [0, 1, 1, 0], { easing: easeInOutCubic });

  const circumference = 2 * Math.PI * 140;
  const ringProgress = interpolate(frame, [60, 180], [circumference, circumference * 0.13], { easing: easeOutExpo, extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const score = Math.round(interpolate(frame, [60, 180], [0, 87], { easing: easeOutExpo, extrapolateRight: "clamp", extrapolateLeft: "clamp" }));

  return (
    <AbsoluteFill style={{ background: `linear-gradient(135deg,${C.navy} 0%,${C.navyLt} 100%)`, fontFamily: FONT, opacity: sceneOpacity }}>
      <GridBackground opacity={0.06} />
      <Orb x={-100} y={-200} size={800} color={C.teal} alpha={0.2} delay={0} />
      <Orb x={1500} y={600} size={700} color={C.green} alpha={0.15} delay={60} />
      <Particles count={30} color="rgba(34,211,238,.3)" seed="sol" />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: C.tealSky,
            marginBottom: 18,
            opacity: fadeIn(frame, 0, 18),
          }}
        >
          Introducing Iryss
        </div>

        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: C.white,
            letterSpacing: -2.5,
            textAlign: "center",
            lineHeight: 1.05,
            maxWidth: 1300,
            opacity: fadeIn(frame, 15, 22),
            marginBottom: 45,
          }}
        >
          The{" "}
          <span
            style={{
              background: `linear-gradient(135deg,${C.teal},${C.tealSky})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            growth engine
          </span>{" "}
          for independent opticians.
        </div>

        {/* Mock dashboard window */}
        <div style={{ opacity: fadeIn(frame, 45, 24), transform: `translateY(${slideUp(frame, 45, 30, 40)}px) scale(${interpolate(frame, [45, 90], [0.96, 1], { easing: easeOutExpo, extrapolateRight: "clamp", extrapolateLeft: "clamp" })})` }}>
          <AppFrame width={1400} height={520}>
            <div style={{ padding: "32px 40px", height: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: C.text, letterSpacing: -0.5 }}>Good morning, Bright Eyes</div>
                  <div style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>Tuesday 19 April</div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ padding: "8px 18px", border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 12, fontWeight: 600, color: C.muted }}>Export</div>
                  <div style={{ padding: "8px 18px", background: `linear-gradient(135deg,${C.teal},${C.tealLt})`, color: "#fff", borderRadius: 10, fontSize: 12, fontWeight: 700 }}>+ New Campaign</div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "190px repeat(3,1fr)", gap: 14 }}>
                {/* Score ring */}
                <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 18px 16px", display: "flex", flexDirection: "column", alignItems: "center", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: `linear-gradient(180deg,${C.teal},${C.tealSky})` }} />
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: C.mutedLt, textTransform: "uppercase", alignSelf: "flex-start", marginBottom: 10, display: "flex", justifyContent: "space-between", width: "100%" }}>
                    <span>Practice Score</span>
                    <span style={{ background: "rgba(16,185,129,.12)", color: C.green, padding: "2px 7px", borderRadius: 5, fontSize: 8.5 }}>GREAT</span>
                  </div>
                  <div style={{ position: "relative", width: 130, height: 130 }}>
                    <svg width={130} height={130} viewBox="0 0 320 320" style={{ transform: "rotate(-90deg)" }}>
                      <circle cx="160" cy="160" r="140" fill="none" stroke="#F1F5F9" strokeWidth="16" />
                      <circle
                        cx="160"
                        cy="160"
                        r="140"
                        fill="none"
                        stroke={C.green}
                        strokeWidth="16"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={ringProgress}
                        style={{ filter: `drop-shadow(0 0 10px ${C.green}88)` }}
                      />
                    </svg>
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ fontSize: 44, fontWeight: 800, color: C.text, letterSpacing: -2, fontVariantNumeric: "tabular-nums" }}>{score}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: C.muted, textAlign: "center", fontWeight: 500, marginTop: 12 }}>On top of retention</div>
                </div>

                {/* KPI cards */}
                {[
                  { label: "Patients at Risk", value: "23", sub: "£3,890 walking out", color: C.red, spark: [8, 9, 11, 10, 13, 14, 12, 15, 14, 16, 17, 20, 22, 21, 23], delay: 100 },
                  { label: "Patients Recovered", value: "25", sub: "this month · WhatsApp", color: C.green, spark: [1, 3, 5, 7, 10, 12, 14, 16, 17, 19, 20, 22, 24, 24, 25], delay: 120 },
                  { label: "Recall Compliance", value: "82%", sub: "GOC target 80%", color: C.teal, spark: [55, 58, 60, 62, 64, 67, 70, 72, 74, 76, 78, 80, 81, 82, 82], delay: 140 },
                ].map((kpi, i) => {
                  const progress = fadeIn(frame, kpi.delay, 24);
                  const count = useCount(0, parseFloat(kpi.value.replace(/[^0-9.]/g, "")), kpi.delay, 40);
                  const display = kpi.value.includes("%") ? `${Math.round(count)}%` : Math.round(count).toString();
                  return (
                    <div key={i} style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 18px", position: "relative", overflow: "hidden", opacity: progress }}>
                      <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: kpi.color }} />
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: C.mutedLt, textTransform: "uppercase" }}>{kpi.label}</div>
                        <Spark data={kpi.spark} color={kpi.color} width={60} height={18} progress={fadeIn(frame, kpi.delay + 10, 40)} />
                      </div>
                      <div style={{ fontSize: 30, fontWeight: 800, color: C.text, lineHeight: 1, letterSpacing: -0.8, marginBottom: 8, fontVariantNumeric: "tabular-nums" }}>{display}</div>
                      <div style={{ fontSize: 10.5, color: C.muted, fontWeight: 500 }}>{kpi.sub}</div>
                    </div>
                  );
                })}
              </div>

              {/* Priority stripe */}
              <div
                style={{
                  marginTop: 14,
                  padding: "12px 18px",
                  border: `1px solid ${C.border}`,
                  borderRadius: 12,
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  fontSize: 12,
                  opacity: fadeIn(frame, 180, 24),
                }}
              >
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: C.mutedLt }}>Today's priority</div>
                <div style={{ display: "flex", alignItems: "center", gap: 14, color: C.text, fontWeight: 600 }}>
                  <span><span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: C.red, marginRight: 6 }} />3 urgent WhatsApps</span>
                  <span style={{ color: "#CBD5E1" }}>·</span>
                  <span><span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: C.amber, marginRight: 6 }} />5 recalls due</span>
                  <span style={{ color: "#CBD5E1" }}>·</span>
                  <span><span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: C.teal, marginRight: 6 }} />3 GOS claims</span>
                </div>
                <div style={{ flex: 1 }} />
                <span style={{ color: C.teal, fontWeight: 700 }}>Open Today's Tasks →</span>
              </div>
            </div>
          </AppFrame>
        </div>

        <div
          style={{
            fontSize: 18,
            color: "rgba(255,255,255,.65)",
            marginTop: 26,
            fontWeight: 500,
            opacity: fadeIn(frame, 230, 22),
            textAlign: "center",
          }}
        >
          One number, every morning — exactly how your practice is doing.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// SCENE 4 — FEATURES (4 sub-scenes of 150 frames each)
// ═══════════════════════════════════════════════════════════════════════

// Feature 1 — WhatsApp inbox with typing → message → reply
const FeatWhatsApp: React.FC = () => {
  const frame = useCurrentFrame();
  const sceneOpacity = interpolate(frame, [0, 18, 130, 150], [0, 1, 1, 0], { easing: easeInOutCubic });

  const messages = [
    { side: "practice", text: "Hi Louise, it's been 24 months since your last eye test — would you like to book in? 😊", time: "09:14", delay: 12 },
    { side: "patient", text: "Oh yes! Been meaning to rebook. Do you have anything Friday?", time: "09:15", delay: 45 },
    { side: "practice", text: "Friday 14:30 works ✓ Booked in — see you then.", time: "09:15", delay: 78 },
    { side: "patient", text: "Perfect, thank you!", time: "09:16", delay: 105 },
  ];
  const typingVisible = frame >= 35 && frame < 48;

  return (
    <AbsoluteFill style={{ background: `linear-gradient(135deg,${C.navy} 0%,${C.navyLt} 100%)`, fontFamily: FONT, opacity: sceneOpacity }}>
      <Orb x={1400} y={-100} size={600} color={C.teal} alpha={0.2} />
      <Orb x={-200} y={700} size={500} color={C.tealSky} alpha={0.15} delay={40} />

      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 70, padding: 80 }}>
        {/* Left copy */}
        <div style={{ flex: "0 0 540px", opacity: fadeIn(frame, 0, 22) }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.tealSky, marginBottom: 14 }}>01 · Feature</div>
          <div style={{ fontSize: 56, fontWeight: 800, color: "#fff", letterSpacing: -1.8, lineHeight: 1.05, marginBottom: 18 }}>
            WhatsApp-native patient inbox
          </div>
          <div style={{ fontSize: 20, color: "rgba(255,255,255,.65)", fontWeight: 500, lineHeight: 1.5, marginBottom: 28 }}>
            Two-way conversations with sentiment detection and auto-prioritisation. Patients actually read and reply.
          </div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {[
              { label: "Open rate", value: "98%", color: C.green },
              { label: "Reply rate", value: "47%", color: C.teal },
              { label: "vs SMS", value: "5×", color: C.tealSky },
            ].map((s, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 10, padding: "10px 16px", opacity: fadeIn(frame, 20 + i * 10, 18) }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: "rgba(255,255,255,.5)", textTransform: "uppercase" }}>{s.label}</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: s.color, letterSpacing: -0.8, marginTop: 2 }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right WhatsApp mock */}
        <div
          style={{
            width: 440,
            height: 700,
            background: "#0B141A",
            borderRadius: 34,
            border: "10px solid #1B2A32",
            boxShadow: "0 40px 120px rgba(0,0,0,.5)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            opacity: fadeIn(frame, 0, 20),
            transform: `translateY(${slideUp(frame, 0, 26, 40)}px)`,
          }}
        >
          <div style={{ background: "#202C33", padding: "16px 18px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #2A3942" }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: C.teal, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13 }}>LE</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#E9EDEF" }}>Louise Everton</div>
              <div style={{ fontSize: 11, color: "#8696A0" }}>online</div>
            </div>
          </div>
          <div style={{ flex: 1, padding: "18px 14px", display: "flex", flexDirection: "column", gap: 10, background: "#0B141A", backgroundImage: "radial-gradient(rgba(255,255,255,.02) 1px, transparent 1px)", backgroundSize: "20px 20px" }}>
            {messages.map((m, i) => {
              const visible = frame >= m.delay;
              if (!visible) return null;
              const isPractice = m.side === "practice";
              const opacity = fadeIn(frame, m.delay, 8);
              const trans = slideUp(frame, m.delay, 12, 14);
              return (
                <div
                  key={i}
                  style={{
                    alignSelf: isPractice ? "flex-end" : "flex-start",
                    maxWidth: "85%",
                    background: isPractice ? "#005C4B" : "#202C33",
                    color: "#E9EDEF",
                    padding: "8px 11px",
                    borderRadius: 8,
                    fontSize: 13.5,
                    lineHeight: 1.35,
                    opacity,
                    transform: `translateY(${trans}px)`,
                    position: "relative",
                  }}
                >
                  <div>{m.text}</div>
                  <div style={{ fontSize: 10, color: "rgba(233,237,239,.55)", textAlign: "right", marginTop: 2 }}>{m.time} ✓✓</div>
                </div>
              );
            })}
            {typingVisible && (
              <div style={{ alignSelf: "flex-start", background: "#202C33", borderRadius: 8, padding: "10px 14px", display: "flex", gap: 4 }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#8696A0",
                      opacity: 0.4 + 0.5 * Math.abs(Math.sin((frame + i * 4) / 5)),
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          {/* sentiment chip */}
          {frame > 90 && (
            <div style={{ padding: "10px 14px", background: "#111A20", borderTop: "1px solid #1F2A30", opacity: fadeIn(frame, 90, 14) }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: C.green, background: "rgba(16,185,129,.1)", padding: "4px 10px", borderRadius: 20 }}>
                ● Positive · Booking confirmed
              </div>
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Feature 2 — Revenue Leakage card
const FeatLeakage: React.FC = () => {
  const frame = useCurrentFrame();
  const sceneOpacity = interpolate(frame, [0, 18, 130, 150], [0, 1, 1, 0], { easing: easeInOutCubic });

  const total = Math.round(useCount(0, 7850, 15, 60));

  const rows = [
    { key: "cl", label: "Contact lens defection", count: 39, amt: 3284, color: C.red, delay: 25 },
    { key: "risk", label: "At-risk patients not chased", count: 23, amt: 2100, color: C.amber, delay: 40 },
    { key: "show", label: "No-shows not followed up", count: 7, amt: 980, color: C.orange, delay: 55 },
    { key: "myo", label: "Myopia reviews overdue", count: 5, amt: 640, color: C.pink, delay: 70 },
    { key: "comp", label: "Competitor-mention patients", count: 3, amt: 846, color: C.purple, delay: 85 },
  ];
  const fullTotal = rows.reduce((a, r) => a + r.amt, 0);

  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: FONT, opacity: sceneOpacity }}>
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 70, padding: 80 }}>
        <div style={{ flex: "0 0 480px", opacity: fadeIn(frame, 0, 22) }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.red, marginBottom: 14 }}>02 · Feature</div>
          <div style={{ fontSize: 56, fontWeight: 800, color: C.text, letterSpacing: -1.8, lineHeight: 1.05, marginBottom: 18 }}>
            See where money is walking out the door.
          </div>
          <div style={{ fontSize: 20, color: C.muted, fontWeight: 500, lineHeight: 1.5 }}>
            A live breakdown of revenue slipping away — with one click to launch a personalised WhatsApp campaign to that exact list.
          </div>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg,#FFFFFF 0%,#FEF9F8 100%)",
            border: "1px solid #FECACA",
            borderRadius: 18,
            padding: "26px 32px",
            width: 720,
            boxShadow: "0 30px 80px rgba(239,68,68,.12)",
            opacity: fadeIn(frame, 10, 22),
            transform: `translateY(${slideUp(frame, 10, 28, 30)}px)`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.red, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.red, boxShadow: `0 0 10px ${C.red}88` }} />
                Where you're losing money
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.text, letterSpacing: -0.5, fontVariantNumeric: "tabular-nums" }}>
                <span style={{ color: C.red }}>£{total.toLocaleString()}</span>{" "}
                <span style={{ fontWeight: 500, color: C.muted, fontSize: 15 }}>at risk this month</span>
              </div>
            </div>
            <div style={{ padding: "10px 18px", background: `linear-gradient(135deg,${C.teal},${C.tealLt})`, color: "#fff", borderRadius: 10, fontSize: 12, fontWeight: 700, boxShadow: "0 4px 14px rgba(8,145,178,.25)" }}>Action biggest leak →</div>
          </div>

          {/* Stacked bar */}
          <div style={{ display: "flex", height: 10, borderRadius: 5, overflow: "hidden", marginBottom: 18, background: "#F1F5F9" }}>
            {rows.map((r) => {
              const pct = (r.amt / fullTotal) * 100;
              const show = fadeIn(frame, r.delay - 5, 20);
              return <div key={r.key} style={{ width: `${pct * show}%`, background: r.color, transition: "width .2s" }} />;
            })}
          </div>

          <div>
            {rows.map((r, i) => {
              const progress = fadeIn(frame, r.delay, 22);
              const countVal = Math.round(useCount(0, r.amt, r.delay, 30));
              return (
                <div
                  key={r.key}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 130px 1fr auto",
                    gap: 14,
                    alignItems: "center",
                    padding: "10px 0",
                    borderTop: i > 0 ? "1px solid rgba(226,232,240,.6)" : "none",
                    opacity: progress,
                    transform: `translateX(${interpolate(progress, [0, 1], [-10, 0])}px)`,
                  }}
                >
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: r.color }} />
                  <div style={{ fontSize: 16, fontWeight: 800, color: C.red, letterSpacing: -0.3, fontVariantNumeric: "tabular-nums" }}>£{countVal.toLocaleString()}</div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: C.text }}>{r.label}</div>
                    <div style={{ fontSize: 11.5, color: C.muted, marginTop: 1 }}>{r.count} patient{r.count !== 1 ? "s" : ""}</div>
                  </div>
                  <div style={{ padding: "6px 12px", fontSize: 11, fontWeight: 700, color: r.color, border: `1px solid ${r.color}40`, borderRadius: 8 }}>Send →</div>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Feature 3 — Myopia axial length chart
const FeatMyopia: React.FC = () => {
  const frame = useCurrentFrame();
  const sceneOpacity = interpolate(frame, [0, 18, 130, 150], [0, 1, 1, 0], { easing: easeInOutCubic });

  // Simulated AL progression for 3 patients over 12 months
  const kids = [
    { name: "Oliver Chen · Age 9", color: C.green, values: [24.2, 24.25, 24.3, 24.33, 24.35, 24.38, 24.4, 24.42, 24.43, 24.45, 24.47, 24.48], status: "Responding · 0.06 mm/yr" },
    { name: "Amelia Brown · Age 12", color: C.red, values: [25.4, 25.48, 25.57, 25.66, 25.75, 25.83, 25.92, 26.0, 26.08, 26.17, 26.25, 26.32], status: "Progressing · consider switch" },
  ];

  return (
    <AbsoluteFill style={{ background: C.white, fontFamily: FONT, opacity: sceneOpacity }}>
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 70, padding: 80 }}>
        <div style={{ flex: "0 0 480px", opacity: fadeIn(frame, 0, 22) }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.pink, marginBottom: 14 }}>03 · Feature</div>
          <div style={{ fontSize: 56, fontWeight: 800, color: C.text, letterSpacing: -1.8, lineHeight: 1.05, marginBottom: 18 }}>
            A full myopia clinic — built in.
          </div>
          <div style={{ fontSize: 20, color: C.muted, fontWeight: 500, lineHeight: 1.5 }}>
            Axial-length progression tracking, treatment plans, parent WhatsApp, built-in clinical recommendations — all in one place.
          </div>
        </div>

        <div style={{ width: 720, background: C.white, border: `1px solid ${C.border}`, borderRadius: 18, padding: "26px 32px", boxShadow: "0 30px 80px rgba(236,72,153,.1)", opacity: fadeIn(frame, 10, 22), transform: `translateY(${slideUp(frame, 10, 28, 30)}px)` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.pink, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 4 }}>Axial-length progression</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>12-month tracking · {kids.length} active patients</div>
            </div>
            <div style={{ fontSize: 11, color: C.muted }}>Target &lt;0.10 mm/yr</div>
          </div>

          {/* Chart */}
          <div style={{ position: "relative", height: 260, background: C.bg, borderRadius: 12, border: `1px solid ${C.border}`, padding: 16, marginBottom: 14 }}>
            {/* Y-axis labels */}
            <div style={{ position: "absolute", top: 16, bottom: 16, left: 8, display: "flex", flexDirection: "column", justifyContent: "space-between", fontSize: 9, color: C.mutedLt, fontFamily: MONO }}>
              <span>26.5</span>
              <span>25.5</span>
              <span>24.5</span>
            </div>
            {/* threshold line */}
            <div style={{ position: "absolute", left: 40, right: 20, top: 80, height: 1, borderTop: `1.5px dashed ${C.mutedLt}`, opacity: 0.5 }} />
            <div style={{ position: "absolute", left: 40, top: 84, fontSize: 9, color: C.mutedLt, fontFamily: MONO }}>threshold · consider switch</div>

            {/* lines */}
            <svg width="100%" height="100%" style={{ overflow: "visible", position: "absolute", left: 40, top: 16, width: "calc(100% - 60px)", height: "calc(100% - 32px)" }}>
              {kids.map((k, ki) => {
                const minY = 24.2;
                const maxY = 26.4;
                const step = 100 / (k.values.length - 1);
                const pts = k.values.map((v, i) => {
                  const x = i * step;
                  const yPct = ((v - minY) / (maxY - minY));
                  return [x, (1 - yPct) * 100] as const;
                });
                const drawStart = 25 + ki * 15;
                const drawProgress = fadeIn(frame, drawStart, 70);
                const visibleCount = Math.max(1, Math.floor(pts.length * drawProgress));
                const shown = pts.slice(0, visibleCount);
                const line = shown.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]}% ${p[1]}%`).join(" ");
                return (
                  <g key={ki}>
                    <path d={line} fill="none" stroke={k.color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 4px ${k.color}60)` }} />
                    {shown.map((p, i) => (
                      <circle key={i} cx={`${p[0]}%`} cy={`${p[1]}%`} r={3.5} fill={k.color} />
                    ))}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Legend + status */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {kids.map((k, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", background: C.bg, borderRadius: 8, opacity: fadeIn(frame, 90 + i * 8, 18) }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: k.color, flexShrink: 0 }} />
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text, flex: 1 }}>{k.name}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: k.color }}>{k.status}</div>
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Feature 4 — Scribe waveform
const FeatScribe: React.FC = () => {
  const frame = useCurrentFrame();
  const sceneOpacity = interpolate(frame, [0, 18, 130, 150], [0, 1, 1, 0], { easing: easeInOutCubic });

  return (
    <AbsoluteFill style={{ background: `linear-gradient(135deg,${C.navy} 0%,${C.navyLt} 100%)`, fontFamily: FONT, opacity: sceneOpacity }}>
      <Orb x={1300} y={-100} size={650} color={C.purple} alpha={0.22} />
      <Orb x={-150} y={600} size={500} color={C.purpleLt} alpha={0.15} delay={30} />

      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 60, padding: 80 }}>
        <div style={{ flex: "0 0 480px", opacity: fadeIn(frame, 0, 22) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.purpleLt }}>04 · Feature</div>
            <span style={{ fontSize: 10, fontWeight: 800, background: "linear-gradient(135deg,#8B5CF6,#A78BFA)", color: "#fff", padding: "3px 8px", borderRadius: 6, letterSpacing: 0.5 }}>BETA</span>
          </div>
          <div style={{ fontSize: 56, fontWeight: 800, color: "#fff", letterSpacing: -1.8, lineHeight: 1.05, marginBottom: 18 }}>
            Dictate the exam. Iryss writes the record.
          </div>
          <div style={{ fontSize: 20, color: "rgba(255,255,255,.65)", fontWeight: 500, lineHeight: 1.5 }}>
            The clinical note, the referral letter, and the GOS claim — drafted in seconds, pushed straight to your practice.
          </div>
          <div style={{ display: "inline-block", marginTop: 28, padding: "12px 22px", background: "rgba(139,92,246,.12)", border: "1px solid rgba(139,92,246,.35)", borderRadius: 12, opacity: fadeIn(frame, 40, 22) }}>
            <span style={{ fontSize: 14, color: C.purpleLt, fontWeight: 600 }}>Saves</span>{" "}
            <span style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: -0.8 }}>11 min</span>{" "}
            <span style={{ fontSize: 14, color: C.purpleLt, fontWeight: 600 }}>per patient</span>
          </div>
        </div>

        {/* Device mock showing waveform + structured output */}
        <div style={{ width: 720, opacity: fadeIn(frame, 10, 22), transform: `translateY(${slideUp(frame, 10, 28, 30)}px)` }}>
          {/* Waveform */}
          <div style={{ background: "#0E1629", border: "1px solid rgba(255,255,255,.08)", borderRadius: 18, padding: "22px 26px", marginBottom: 16, position: "relative", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: C.red, boxShadow: `0 0 10px ${C.red}99` }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>Listening · patient Louise Everton</span>
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", fontFamily: MONO }}>00:00:{Math.min(46, Math.floor(frame / 3)).toString().padStart(2, "0")}</div>
            </div>
            <div style={{ display: "flex", gap: 3, alignItems: "center", height: 60 }}>
              {Array.from({ length: 72 }).map((_, i) => {
                const baseH = 6 + Math.abs(Math.sin(i * 0.7)) * 22;
                const pulse = Math.abs(Math.sin((frame + i * 2) / 4)) * 18;
                return (
                  <div
                    key={i}
                    style={{
                      width: 4,
                      height: baseH + pulse,
                      background: `linear-gradient(180deg,${C.purple},${C.purpleLt})`,
                      borderRadius: 2,
                      opacity: fadeIn(frame, 5 + i * 0.3, 10),
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Clinical note card */}
          <div style={{ background: C.white, borderRadius: 16, padding: "22px 26px", boxShadow: "0 30px 80px rgba(0,0,0,.25)", opacity: fadeIn(frame, 55, 22) }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.text, letterSpacing: -0.2 }}>Clinical Record · Structured</div>
              <span style={{ fontSize: 10, fontWeight: 700, color: C.green, background: "rgba(16,185,129,.1)", padding: "3px 9px", borderRadius: 20 }}>✓ READY TO REVIEW</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
              {[
                { l: "VA Right", v: "6/6" },
                { l: "VA Left", v: "6/6" },
                { l: "IOP R / L", v: "14 / 13 mmHg" },
                { l: "C:D ratio", v: "0.3 / 0.3" },
              ].map((f, i) => (
                <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 11px", opacity: fadeIn(frame, 65 + i * 4, 16) }}>
                  <div style={{ fontSize: 9.5, fontWeight: 700, color: C.mutedLt, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2 }}>{f.l}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.text, fontFamily: MONO }}>{f.v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1, padding: "8px 12px", background: `linear-gradient(135deg,${C.teal},${C.tealLt})`, color: "#fff", borderRadius: 8, fontSize: 11.5, fontWeight: 700, textAlign: "center", opacity: fadeIn(frame, 90, 18) }}>Push to CRM →</div>
              <div style={{ flex: 1, padding: "8px 12px", border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, fontSize: 11.5, fontWeight: 700, textAlign: "center", opacity: fadeIn(frame, 90, 18) }}>GOS 1 ✓ Valid</div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SceneFeatures: React.FC = () => (
  <>
    <Sequence from={0} durationInFrames={150}><FeatWhatsApp /></Sequence>
    <Sequence from={150} durationInFrames={150}><FeatLeakage /></Sequence>
    <Sequence from={300} durationInFrames={150}><FeatMyopia /></Sequence>
    <Sequence from={450} durationInFrames={150}><FeatScribe /></Sequence>
  </>
);

// ═══════════════════════════════════════════════════════════════════════
// SCENE 5 — THE MATHS  (0–450 local)
// ═══════════════════════════════════════════════════════════════════════
const SceneROI: React.FC = () => {
  const frame = useCurrentFrame();
  const sceneOpacity = interpolate(frame, [0, 18, 430, 450], [0, 1, 1, 0], { easing: easeInOutCubic });
  const money = Math.round(useCount(0, 20000, 40, 110));
  const formatted = money.toLocaleString();

  return (
    <AbsoluteFill style={{ background: `linear-gradient(135deg,${C.navy} 0%,${C.navyLt} 100%)`, fontFamily: FONT, opacity: sceneOpacity }}>
      <GridBackground opacity={0.05} />
      <Orb x={-200} y={600} size={800} color={C.green} alpha={0.18} />
      <Orb x={1500} y={-100} size={700} color={C.teal} alpha={0.2} delay={50} />
      <Particles count={50} color="rgba(16,185,129,.4)" seed="roi" />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 80, flexDirection: "column" }}>
        <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: "rgba(255,255,255,.5)", opacity: fadeIn(frame, 0, 18), marginBottom: 26 }}>The maths</div>

        <div style={{ fontSize: 42, fontWeight: 700, color: "#fff", textAlign: "center", letterSpacing: -1, maxWidth: 1400, lineHeight: 1.3, opacity: fadeIn(frame, 12, 22), marginBottom: 40 }}>
          Save just <b style={{ color: C.tealSky }}>two patients a month</b>.
        </div>

        <div
          style={{
            fontSize: 220,
            fontWeight: 800,
            letterSpacing: -10,
            background: `linear-gradient(135deg,${C.green},${C.greenLt})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: 1,
            opacity: fadeIn(frame, 35, 22),
            textShadow: "0 0 30px rgba(16,185,129,.3)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          £{formatted}
        </div>
        <div style={{ fontSize: 22, color: "rgba(255,255,255,.55)", fontWeight: 500, marginTop: 4, opacity: fadeIn(frame, 35, 18) }}>recovered in your first year</div>

        <div style={{ display: "flex", gap: 70, marginTop: 80 }}>
          {[
            { k: "Cost of Iryss", v: "£2,400", color: "#fff" },
            { k: "ROI multiple", v: "8×", color: C.tealSky },
            { k: "Payback", v: "< 6 weeks", color: C.green },
          ].map((m, i) => (
            <div
              key={m.k}
              style={{
                textAlign: "center",
                opacity: fadeIn(frame, 180 + i * 15, 22),
                transform: `translateY(${slideUp(frame, 180 + i * 15, 24, 20)}px)`,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,.5)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>{m.k}</div>
              <div style={{ fontSize: 56, fontWeight: 800, color: m.color, letterSpacing: -1.5, fontVariantNumeric: "tabular-nums" }}>{m.v}</div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// SCENE 6 — WHO IT'S FOR  (0–450 local)
// ═══════════════════════════════════════════════════════════════════════
const SceneWhoFor: React.FC = () => {
  const frame = useCurrentFrame();
  const sceneOpacity = interpolate(frame, [0, 18, 430, 450], [0, 1, 1, 0], { easing: easeInOutCubic });
  const crms = ["Optix", "Ocuco", "Optisoft", "Acuitas", "XEYEX"];

  return (
    <AbsoluteFill style={{ background: C.white, fontFamily: FONT, opacity: sceneOpacity }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 40%, ${C.bgCool} 0%, ${C.white} 60%)`,
          pointerEvents: "none",
        }}
      />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 80, flexDirection: "column" }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.teal, opacity: fadeIn(frame, 0, 18), marginBottom: 22 }}>Built for</div>

        <div style={{ fontSize: 76, fontWeight: 800, color: C.text, textAlign: "center", letterSpacing: -2.5, lineHeight: 1.05, maxWidth: 1500, opacity: fadeIn(frame, 10, 22) }}>
          Independent UK &amp; Irish{" "}
          <span style={{ background: `linear-gradient(135deg,${C.teal},${C.tealSky})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            opticians
          </span>
          .
        </div>

        <div style={{ fontSize: 26, color: C.muted, marginTop: 24, fontWeight: 500, textAlign: "center", maxWidth: 1100, opacity: fadeIn(frame, 70, 22) }}>
          Works alongside whatever you already use — no migration, no retraining, live in under a week.
        </div>

        {/* CRM chips */}
        <div style={{ display: "flex", gap: 20, marginTop: 60, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
          {crms.map((c, i) => (
            <div
              key={c}
              style={{
                background: C.white,
                border: `1px solid ${C.border}`,
                borderRadius: 14,
                padding: "18px 32px",
                fontSize: 22,
                fontWeight: 700,
                color: C.text,
                letterSpacing: -0.5,
                boxShadow: "0 8px 24px rgba(0,0,0,.06)",
                opacity: fadeIn(frame, 120 + i * 12, 20),
                transform: `translateY(${slideUp(frame, 120 + i * 12, 22, 30)}px)`,
              }}
            >
              {c}
            </div>
          ))}
          <div style={{ fontSize: 20, color: C.mutedLt, fontWeight: 500, opacity: fadeIn(frame, 120 + crms.length * 12, 20) }}>+ more</div>
        </div>

        {/* Checkmarks row */}
        <div style={{ display: "flex", gap: 40, marginTop: 70, opacity: fadeIn(frame, 220, 22) }}>
          {["No migration", "No retraining", "Live in < 1 week"].map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 16, color: C.text, fontWeight: 600 }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg,${C.green},${C.greenLt})`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, boxShadow: `0 4px 12px ${C.green}40` }}>
                ✓
              </div>
              {t}
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// SCENE 7 — CLOSE  (0–150 local)
// ═══════════════════════════════════════════════════════════════════════
const SceneClose: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logoScale = spring({ frame, fps, config: { damping: 12 } });

  // URL typewriter
  const url = "theiryss.com";
  const urlChars = Math.floor(interpolate(frame, [45, 90], [0, url.length], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }));

  return (
    <AbsoluteFill style={{ background: `linear-gradient(135deg,${C.navy} 0%,${C.navyLt} 50%,#1E2C4F 100%)`, fontFamily: FONT }}>
      <Orb x={-200} y={-200} size={900} color={C.teal} alpha={0.25} />
      <Orb x={1400} y={800} size={700} color={C.tealSky} alpha={0.2} delay={40} />
      <Particles count={40} color="rgba(34,211,238,.4)" seed="close" />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ transform: `scale(${logoScale})`, marginBottom: 36, filter: `drop-shadow(0 0 40px rgba(34,211,238,.5))` }}>
          <IryssLogo size={160} />
        </div>

        <div style={{ fontSize: 44, fontWeight: 700, color: "#fff", letterSpacing: -1, textAlign: "center", opacity: fadeIn(frame, 15, 18), marginBottom: 14 }}>
          Book a demo.
        </div>

        <div style={{ fontSize: 38, fontWeight: 700, letterSpacing: -0.5, fontFamily: MONO, opacity: fadeIn(frame, 35, 14), display: "flex", alignItems: "center" }}>
          <span
            style={{
              background: `linear-gradient(135deg,${C.teal},${C.tealSky})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {url.slice(0, urlChars)}
          </span>
          {urlChars < url.length && frame > 45 && (
            <span style={{ display: "inline-block", width: 4, height: 36, background: C.tealSky, marginLeft: 4, opacity: frame % 20 < 10 ? 1 : 0 }} />
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════
export const IryssPitch: React.FC = () => (
  <AbsoluteFill style={{ background: C.navy }}>
    <Sequence from={0} durationInFrames={240}><SceneHook /></Sequence>
    <Sequence from={240} durationInFrames={360}><SceneProblem /></Sequence>
    <Sequence from={600} durationInFrames={450}><SceneSolution /></Sequence>
    <Sequence from={1050} durationInFrames={600}><SceneFeatures /></Sequence>
    <Sequence from={1650} durationInFrames={450}><SceneROI /></Sequence>
    <Sequence from={2100} durationInFrames={450}><SceneWhoFor /></Sequence>
    <Sequence from={2550} durationInFrames={150}><SceneClose /></Sequence>
  </AbsoluteFill>
);
