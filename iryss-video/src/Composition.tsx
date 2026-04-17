/**
 * IRYSS — 90-second pitch video
 * 1920×1080 @ 30fps · total 2700 frames
 *
 * Scene layout (30fps):
 *   Scene 1  · 0–8s     (0–240)     Hook
 *   Scene 2  · 8–20s    (240–600)   Problem
 *   Scene 3  · 20–35s   (600–1050)  Solution (Practice Score ring)
 *   Scene 4  · 35–55s   (1050–1650) Features carousel (4×5s)
 *   Scene 5  · 55–70s   (1650–2100) ROI maths
 *   Scene 6  · 70–85s   (2100–2550) Who it's for
 *   Scene 7  · 85–90s   (2550–2700) Close + CTA
 */

import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

// ─── Brand palette ────────────────────────────────────────────────────
const C = {
  navy: "#0C1220",
  navyLt: "#1A2541",
  teal: "#0891B2",
  tealLt: "#06B6D4",
  tealSky: "#22D3EE",
  green: "#10B981",
  red: "#EF4444",
  amber: "#F59E0B",
  purple: "#8B5CF6",
  purpleLt: "#A78BFA",
  text: "#0F172A",
  muted: "#64748B",
  mutedLt: "#94A3B8",
  bg: "#F8FAFB",
  white: "#FFFFFF",
};

const FONT_FAMILY =
  "'Plus Jakarta Sans', -apple-system, 'Segoe UI', system-ui, sans-serif";

// ─── Helpers ──────────────────────────────────────────────────────────
const fadeIn = (frame: number, start = 0, duration = 15) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

const fadeOut = (frame: number, start: number, duration = 15) =>
  interpolate(frame, [start, start + duration], [1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

const slideUp = (frame: number, start = 0, duration = 18) =>
  interpolate(frame, [start, start + duration], [30, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

// ─── Reusable bits ────────────────────────────────────────────────────
const IryssLogo: React.FC<{ size?: number }> = ({ size = 90 }) => (
  <div
    style={{
      display: "flex",
      alignItems: "baseline",
      fontFamily: FONT_FAMILY,
      fontWeight: 800,
      letterSpacing: -3,
      fontSize: size,
    }}
  >
    <span style={{ color: C.white }}>iry</span>
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

// ─────────────────────────────────────────────────────────────────────
// SCENE 1 · HOOK  (0–240)
// ─────────────────────────────────────────────────────────────────────
const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 14 } });
  const line1Opacity = fadeIn(frame, 50, 18);
  const line1Y = slideUp(frame, 50, 20);
  const line2Opacity = fadeIn(frame, 110, 18);
  const line2Y = slideUp(frame, 110, 20);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg,${C.navy} 0%,${C.navyLt} 100%)`,
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT_FAMILY,
      }}
    >
      {/* ambient orb */}
      <div
        style={{
          position: "absolute",
          top: -200,
          right: -200,
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle,rgba(34,211,238,.2),transparent 60%)`,
          filter: "blur(80px)",
        }}
      />
      <div
        style={{
          transform: `scale(${logoScale})`,
          opacity: fadeIn(frame, 0, 20),
          marginBottom: 40,
        }}
      >
        <IryssLogo size={100} />
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "rgba(255,255,255,.5)",
            textAlign: "center",
            marginTop: 6,
          }}
        >
          PATIENT RETENTION
        </div>
      </div>

      <div
        style={{
          opacity: line1Opacity,
          transform: `translateY(${line1Y}px)`,
          fontSize: 70,
          fontWeight: 800,
          color: C.white,
          letterSpacing: -2,
          textAlign: "center",
          lineHeight: 1.1,
        }}
      >
        Specsavers has 500 marketers.
      </div>

      <div
        style={{
          opacity: line2Opacity,
          transform: `translateY(${line2Y}px)`,
          fontSize: 70,
          fontWeight: 800,
          letterSpacing: -2,
          textAlign: "center",
          marginTop: 20,
          color: C.white,
        }}
      >
        You now have{" "}
        <span
          style={{
            background: `linear-gradient(135deg,${C.teal},${C.tealSky})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          one
        </span>
        .
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────
// SCENE 2 · PROBLEM  (240–600 = 0–360 local)
// ─────────────────────────────────────────────────────────────────────
const SceneProblem: React.FC = () => {
  const frame = useCurrentFrame();
  const statCount = interpolate(frame, [10, 70], [0, 25], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const painPoints = [
    "Paper recalls die.",
    "SMS gets ignored.",
    "Your CRM can't act on data.",
  ];

  return (
    <AbsoluteFill
      style={{
        background: C.white,
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT_FAMILY,
        padding: 80,
      }}
    >
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: C.red,
          opacity: fadeIn(frame, 0, 20),
          marginBottom: 30,
        }}
      >
        ● The problem
      </div>

      <div
        style={{
          fontSize: 280,
          fontWeight: 800,
          letterSpacing: -14,
          background: `linear-gradient(135deg,${C.red},${C.amber})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          lineHeight: 1,
          opacity: fadeIn(frame, 0, 20),
        }}
      >
        {Math.round(statCount)}%
      </div>

      <div
        style={{
          fontSize: 40,
          fontWeight: 700,
          color: C.text,
          textAlign: "center",
          letterSpacing: -1,
          marginTop: 10,
          opacity: fadeIn(frame, 70, 20),
        }}
      >
        of patients independents should retain — are lost.
      </div>

      <div style={{ display: "flex", gap: 40, marginTop: 80 }}>
        {painPoints.map((p, i) => (
          <div
            key={i}
            style={{
              fontSize: 22,
              color: C.muted,
              fontWeight: 600,
              padding: "14px 28px",
              border: `1px solid #E2E8F0`,
              borderRadius: 12,
              opacity: fadeIn(frame, 130 + i * 30, 20),
              transform: `translateY(${slideUp(frame, 130 + i * 30, 20)}px)`,
            }}
          >
            {p}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────
// SCENE 3 · SOLUTION — Practice Score ring  (600–1050 = 0–450 local)
// ─────────────────────────────────────────────────────────────────────
const SceneSolution: React.FC = () => {
  const frame = useCurrentFrame();
  const circumference = 2 * Math.PI * 140;
  const ringProgress = interpolate(
    frame,
    [40, 140],
    [circumference, circumference * 0.13],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );
  const scoreCount = interpolate(frame, [40, 140], [0, 87], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg,${C.navy},${C.navyLt})`,
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT_FAMILY,
      }}
    >
      <div
        style={{
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: C.tealSky,
          marginBottom: 20,
          opacity: fadeIn(frame, 0, 20),
        }}
      >
        Introducing Iryss
      </div>

      <div
        style={{
          fontSize: 68,
          fontWeight: 800,
          color: C.white,
          letterSpacing: -2,
          textAlign: "center",
          lineHeight: 1.1,
          maxWidth: 1100,
          opacity: fadeIn(frame, 15, 20),
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
          AI growth layer
        </span>{" "}
        for independent opticians.
      </div>

      <div
        style={{
          marginTop: 70,
          position: "relative",
          width: 320,
          height: 320,
          opacity: fadeIn(frame, 35, 20),
        }}
      >
        <svg
          width={320}
          height={320}
          viewBox="0 0 320 320"
          style={{ transform: "rotate(-90deg)" }}
        >
          <circle
            cx="160"
            cy="160"
            r="140"
            fill="none"
            stroke="rgba(255,255,255,.08)"
            strokeWidth="16"
          />
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
            style={{ filter: `drop-shadow(0 0 12px ${C.green}88)` }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 3,
              color: "rgba(255,255,255,.5)",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Practice Score
          </div>
          <div
            style={{
              fontSize: 120,
              fontWeight: 800,
              color: C.white,
              letterSpacing: -5,
              lineHeight: 1,
            }}
          >
            {Math.round(scoreCount)}
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: C.green,
              letterSpacing: 2,
              marginTop: 6,
            }}
          >
            GREAT
          </div>
        </div>
      </div>

      <div
        style={{
          fontSize: 22,
          color: "rgba(255,255,255,.6)",
          marginTop: 40,
          fontWeight: 500,
          opacity: fadeIn(frame, 150, 20),
          textAlign: "center",
        }}
      >
        One number that tells you how your practice is really doing — every morning.
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────
// SCENE 4 · FEATURES CAROUSEL — 4 sub-scenes × 150 frames each
// ─────────────────────────────────────────────────────────────────────
const FeatureCard: React.FC<{
  tag: string;
  title: string;
  body: string;
  accent: string;
  icon: string;
  localFrame: number;
}> = ({ tag, title, body, accent, icon, localFrame }) => {
  const opacity = fadeIn(localFrame, 0, 18);
  const y = slideUp(localFrame, 0, 22);
  const out = fadeOut(localFrame, 130, 20);

  return (
    <AbsoluteFill
      style={{
        background: C.white,
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT_FAMILY,
        opacity: opacity * out,
        transform: `translateY(${y}px)`,
        padding: 80,
      }}
    >
      <div
        style={{
          background: C.white,
          borderRadius: 24,
          padding: "50px 60px",
          border: `1px solid #E2E8F0`,
          boxShadow: "0 40px 100px rgba(0,0,0,.08)",
          maxWidth: 1100,
          width: "100%",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: accent,
            color: C.white,
            fontSize: 36,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            boxShadow: `0 12px 40px ${accent}55`,
          }}
        >
          {icon}
        </div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: accent,
            marginBottom: 10,
          }}
        >
          {tag}
        </div>
        <div
          style={{
            fontSize: 60,
            fontWeight: 800,
            color: C.text,
            letterSpacing: -2,
            lineHeight: 1.1,
            marginBottom: 16,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 22,
            color: C.muted,
            fontWeight: 500,
            lineHeight: 1.5,
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          {body}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const FeatureSequence: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const features = [
    {
      tag: "Feature 1",
      title: "WhatsApp-native patient inbox",
      body: "Two-way WhatsApp conversations, sentiment detection, auto-prioritisation — 98% open rates.",
      accent: C.teal,
      icon: "💬",
    },
    {
      tag: "Feature 2",
      title: "Where you're losing money",
      body: "A live breakdown of revenue walking out the door. One click launches a personalised WhatsApp campaign.",
      accent: C.red,
      icon: "£",
    },
    {
      tag: "Feature 3",
      title: "Myopia Clinic, built-in",
      body: "Axial-length progression tracking, treatment plans, parent WhatsApp, AI recommendations — all in one place.",
      accent: "#EC4899",
      icon: "◎",
    },
    {
      tag: "Feature 4 · BETA",
      title: "AI Scribe writes the record",
      body: "Dictate the exam. Iryss writes the clinical note, referral letter and GOS claim. Saves 11 minutes per patient.",
      accent: C.purple,
      icon: "🎤",
    },
  ];
  const f = features[index];
  return <FeatureCard {...f} localFrame={frame} />;
};

const SceneFeatures: React.FC = () => (
  <>
    <Sequence from={0} durationInFrames={150}>
      <FeatureSequence index={0} />
    </Sequence>
    <Sequence from={150} durationInFrames={150}>
      <FeatureSequence index={1} />
    </Sequence>
    <Sequence from={300} durationInFrames={150}>
      <FeatureSequence index={2} />
    </Sequence>
    <Sequence from={450} durationInFrames={150}>
      <FeatureSequence index={3} />
    </Sequence>
  </>
);

// ─────────────────────────────────────────────────────────────────────
// SCENE 5 · ROI (1650–2100 = 0–450 local)
// ─────────────────────────────────────────────────────────────────────
const SceneROI: React.FC = () => {
  const frame = useCurrentFrame();
  const money = interpolate(frame, [40, 150], [0, 20000], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg,${C.navy},${C.navyLt})`,
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT_FAMILY,
        padding: 80,
      }}
    >
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: "rgba(255,255,255,.5)",
          opacity: fadeIn(frame, 0, 18),
          marginBottom: 30,
        }}
      >
        The maths
      </div>

      <div
        style={{
          fontSize: 48,
          fontWeight: 700,
          color: C.white,
          textAlign: "center",
          letterSpacing: -1,
          maxWidth: 1400,
          lineHeight: 1.2,
          opacity: fadeIn(frame, 10, 18),
          marginBottom: 40,
        }}
      >
        Save just 2 patients a month.
      </div>

      <div
        style={{
          fontSize: 200,
          fontWeight: 800,
          letterSpacing: -8,
          background: `linear-gradient(135deg,${C.green},#34D399)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          lineHeight: 1,
          opacity: fadeIn(frame, 30, 18),
        }}
      >
        £{Math.round(money).toLocaleString()}
      </div>
      <div
        style={{
          fontSize: 22,
          color: "rgba(255,255,255,.55)",
          fontWeight: 500,
          marginTop: 4,
          opacity: fadeIn(frame, 30, 18),
        }}
      >
        recovered in your first year
      </div>

      <div
        style={{
          display: "flex",
          gap: 60,
          marginTop: 80,
          opacity: fadeIn(frame, 180, 20),
        }}
      >
        {[
          { k: "Cost of Iryss", v: "£2,400" },
          { k: "ROI", v: "8×" },
          { k: "Payback", v: "< 6 weeks" },
        ].map((m) => (
          <div key={m.k} style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "rgba(255,255,255,.5)",
                letterSpacing: 3,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              {m.k}
            </div>
            <div
              style={{
                fontSize: 48,
                fontWeight: 800,
                color: C.tealSky,
                letterSpacing: -1,
              }}
            >
              {m.v}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────
// SCENE 6 · WHO IT'S FOR (2100–2550 = 0–450 local)
// ─────────────────────────────────────────────────────────────────────
const SceneWhoFor: React.FC = () => {
  const frame = useCurrentFrame();
  const crms = ["Optix", "Ocuco", "Optisoft", "Acuitas", "XEYEX"];

  return (
    <AbsoluteFill
      style={{
        background: C.white,
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT_FAMILY,
        padding: 80,
      }}
    >
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: C.teal,
          opacity: fadeIn(frame, 0, 18),
          marginBottom: 24,
        }}
      >
        Built for
      </div>

      <div
        style={{
          fontSize: 72,
          fontWeight: 800,
          color: C.text,
          textAlign: "center",
          letterSpacing: -2,
          lineHeight: 1.1,
          maxWidth: 1400,
          opacity: fadeIn(frame, 10, 18),
        }}
      >
        Independent UK &amp; Irish{" "}
        <span
          style={{
            background: `linear-gradient(135deg,${C.teal},${C.tealSky})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          opticians
        </span>
        .
      </div>

      <div
        style={{
          fontSize: 28,
          color: C.muted,
          marginTop: 30,
          fontWeight: 500,
          textAlign: "center",
          maxWidth: 1000,
          opacity: fadeIn(frame, 80, 18),
        }}
      >
        Sits alongside your existing CRM — no migration, no retraining, live in under a week.
      </div>

      <div
        style={{
          display: "flex",
          gap: 28,
          marginTop: 60,
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
          opacity: fadeIn(frame, 140, 20),
        }}
      >
        {crms.map((c) => (
          <div
            key={c}
            style={{
              background: "#F8FAFB",
              border: "1px solid #E2E8F0",
              borderRadius: 14,
              padding: "16px 30px",
              fontSize: 22,
              fontWeight: 700,
              color: C.text,
              letterSpacing: -0.5,
            }}
          >
            {c}
          </div>
        ))}
        <div style={{ fontSize: 22, color: C.mutedLt, fontWeight: 500 }}>
          + more
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────
// SCENE 7 · CLOSE (2550–2700 = 0–150 local)
// ─────────────────────────────────────────────────────────────────────
const SceneClose: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logoScale = spring({ frame, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg,${C.navy},${C.navyLt})`,
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT_FAMILY,
      }}
    >
      <div style={{ transform: `scale(${logoScale})`, marginBottom: 30 }}>
        <IryssLogo size={140} />
      </div>

      <div
        style={{
          fontSize: 42,
          fontWeight: 700,
          color: C.white,
          letterSpacing: -1,
          textAlign: "center",
          opacity: fadeIn(frame, 20, 18),
          marginBottom: 8,
        }}
      >
        Book a demo.
      </div>

      <div
        style={{
          fontSize: 34,
          fontWeight: 600,
          color: C.tealSky,
          letterSpacing: -0.5,
          opacity: fadeIn(frame, 40, 18),
        }}
      >
        theiryss.com
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────
// ROOT COMPOSITION
// ─────────────────────────────────────────────────────────────────────
export const IryssPitch: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: C.navy }}>
      <Sequence from={0} durationInFrames={240}>
        <SceneHook />
      </Sequence>
      <Sequence from={240} durationInFrames={360}>
        <SceneProblem />
      </Sequence>
      <Sequence from={600} durationInFrames={450}>
        <SceneSolution />
      </Sequence>
      <Sequence from={1050} durationInFrames={600}>
        <SceneFeatures />
      </Sequence>
      <Sequence from={1650} durationInFrames={450}>
        <SceneROI />
      </Sequence>
      <Sequence from={2100} durationInFrames={450}>
        <SceneWhoFor />
      </Sequence>
      <Sequence from={2550} durationInFrames={150}>
        <SceneClose />
      </Sequence>
    </AbsoluteFill>
  );
};
