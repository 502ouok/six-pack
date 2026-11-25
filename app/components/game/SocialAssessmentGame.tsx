"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { saveBadge } from "@/lib/badges";
import { saveSocialResponse } from "@/lib/gameResults";

// ── Types ─────────────────────────────────────────────────────────────────────
type GameStage =
  | "warp-start" | "warp-traveling" | "video-playing" | "landing" | "dialogue"
  | "m1-scene" | "m1-q1" | "m1-q2" | "m1-q3"
  | "m2-scene" | "m2-q1" | "m2-q2" | "m2-q3"
  | "m3-scene" | "m3-q1" | "m3-q2" | "m3-outcome"
  | "result-child" | "result-detail";

interface AssessmentData {
  m1q1: string; m1q2: string[]; m1q3: string;
  m2q1: string; m2q2: string; m2q3: string;
  m3q1: string; m3q2: string;
  times: Record<string, number>;
}

// ── SVG: Panda ────────────────────────────────────────────────────────────────
function PandaSVG({ size = 100, animate = false }: { size?: number; animate?: boolean }) {
  const star = "0,-11 2.5,-3.4 10.5,-3.4 4.1,1.3 6.5,9 0,4.5 -6.5,9 -4.1,1.3 -10.5,-3.4 -2.5,-3.4";
  return (
    <svg width={size} height={Math.round(size * 1.1)} viewBox="0 0 100 110" style={animate ? { animation: "ssfloatTitle 3s ease-in-out infinite" } : undefined}>
      <ellipse cx="50" cy="107" rx="28" ry="5" fill="rgba(0,0,0,0.12)" />
      <ellipse cx="50" cy="78" rx="28" ry="27" fill="white" />
      <ellipse cx="50" cy="80" rx="17" ry="18" fill="#f5f5f5" />
      <path d="M42,67 C42,61 50,65 50,65 C50,65 58,61 58,67 C58,73 50,78 50,78 C50,78 42,73 42,67 Z" fill="#FF6EB4" />
      <ellipse cx="23" cy="75" rx="9" ry="13" fill="#111" transform="rotate(18 23 75)" />
      <ellipse cx="77" cy="75" rx="9" ry="13" fill="#111" transform="rotate(-18 77 75)" />
      <ellipse cx="38" cy="102" rx="11" ry="8" fill="#111" />
      <ellipse cx="62" cy="102" rx="11" ry="8" fill="#111" />
      <circle cx="50" cy="40" r="30" fill="white" />
      <circle cx="22" cy="13" r="13" fill="#111" />
      <circle cx="78" cy="13" r="13" fill="#111" />
      <g transform="translate(33,38)"><polygon points={star} fill="#111" /><circle cx="1.5" cy="-2.5" r="2.5" fill="white" opacity="0.65" /></g>
      <circle cx="67" cy="38" r="9" fill="white" />
      <circle cx="68" cy="38" r="6" fill="#111" />
      <circle cx="70" cy="36" r="2.2" fill="white" />
      <ellipse cx="50" cy="49" rx="5" ry="3.5" fill="#999" />
      <path d="M44,54 Q50,60 56,54" stroke="#bbb" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="26" cy="49" r="7" fill="#FFB7C5" opacity="0.42" />
      <circle cx="74" cy="49" r="7" fill="#FFB7C5" opacity="0.42" />
    </svg>
  );
}

// ── SVG: Puppy ────────────────────────────────────────────────────────────────
function PuppySVG({ size = 100, celebrating = false }: { size?: number; celebrating?: boolean }) {
  return (
    <svg width={size} height={Math.round(size * 1.1)} viewBox="0 0 100 110"
      style={celebrating ? { animation: "sscelebrate 0.5s ease-in-out infinite alternate" } : undefined}>
      <ellipse cx="50" cy="107" rx="26" ry="5" fill="rgba(0,0,0,0.12)" />
      <ellipse cx="50" cy="78" rx="26" ry="27" fill="#E8C88A" />
      <ellipse cx="50" cy="80" rx="14" ry="16" fill="#F0D8A8" />
      <circle cx="50" cy="74" r="2.5" fill="#C4A060" /><circle cx="50" cy="82" r="2.5" fill="#C4A060" />
      <ellipse cx="24" cy="76" rx="8" ry="12" fill="#D4A843" transform="rotate(18 24 76)" />
      <ellipse cx="76" cy="76" rx="8" ry="12" fill="#D4A843" transform="rotate(-18 76 76)" />
      <ellipse cx="38" cy="102" rx="10" ry="8" fill="#D4A843" />
      <ellipse cx="62" cy="102" rx="10" ry="8" fill="#D4A843" />
      <circle cx="50" cy="40" r="28" fill="#E8C88A" />
      <ellipse cx="22" cy="46" rx="12" ry="20" fill="#C4A060" transform="rotate(-8 22 46)" />
      <ellipse cx="78" cy="46" rx="12" ry="20" fill="#C4A060" transform="rotate(8 78 46)" />
      <ellipse cx="22" cy="47" rx="7" ry="15" fill="#B08840" transform="rotate(-8 22 47)" />
      <ellipse cx="78" cy="47" rx="7" ry="15" fill="#B08840" transform="rotate(8 78 47)" />
      <circle cx="38" cy="39" r="8" fill="white" />
      <circle cx="62" cy="39" r="8" fill="white" />
      <circle cx="39" cy="39" r="5.5" fill="#333" />
      <circle cx="63" cy="39" r="5.5" fill="#333" />
      <circle cx="41" cy="37" r="2" fill="white" />
      <circle cx="65" cy="37" r="2" fill="white" />
      <path d="M31,31 Q38,27 45,30" stroke="#A07840" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M55,30 Q62,27 69,31" stroke="#A07840" strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="50" cy="50" rx="11" ry="8" fill="#F0D8A8" />
      <ellipse cx="50" cy="47" rx="5" ry="3.5" fill="#333" />
      {celebrating ? (
        <>
          <path d="M42,55 Q50,63 58,55" stroke="#A07840" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M25,70 Q15,55 20,45" stroke="#E8C88A" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M75,70 Q85,55 80,45" stroke="#E8C88A" strokeWidth="8" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <path d="M44,53 Q50,59 56,53" stroke="#A07840" strokeWidth="2" fill="none" strokeLinecap="round" />
      )}
      <circle cx="27" cy="50" r="7" fill="#FFB7C5" opacity="0.42" />
      <circle cx="73" cy="50" r="7" fill="#FFB7C5" opacity="0.42" />
    </svg>
  );
}

// ── SVG: GreenMouse ───────────────────────────────────────────────────────────
function GreenMouseSVG({ size = 80, expression = "default" }: { size?: number; expression?: "default" | "excited" | "fake-happy" }) {
  const isFakeHappy = expression === "fake-happy";
  const isExcited = expression === "excited";
  return (
    <svg
      width={size} height={Math.round(size * 1.3)} viewBox="0 0 80 104"
      style={isFakeHappy ? { transform: "translateY(3px) rotate(1.5deg)", transition: "transform 1s ease" } : undefined}
    >
      <ellipse cx="40" cy="101" rx="20" ry="4" fill="rgba(0,0,0,0.12)" />
      <ellipse cx="40" cy="74" rx="20" ry="23" fill="#F0F0E0" />
      <ellipse cx="40" cy="58" rx="18" ry="8" fill="#2D9E6B" />
      <ellipse cx="20" cy="72" rx="7" ry="10" fill="#D8D8C8" transform="rotate(15 20 72)" />
      <ellipse cx="60" cy="72" rx="7" ry="10" fill="#D8D8C8" transform="rotate(-15 60 72)" />
      <path d="M60,85 Q76,74 72,96" stroke="#A09080" strokeWidth="6" fill="none" strokeLinecap="round" />
      <ellipse cx="32" cy="94" rx="8" ry="8" fill="#D8D8C8" />
      <ellipse cx="48" cy="94" rx="8" ry="8" fill="#D8D8C8" />
      <circle cx="40" cy="38" r="26" fill="#F0F0E0" />
      <ellipse cx="40" cy="17" rx="23" ry="8" fill="#2D9E6B" />
      <polygon points="22,17 40,-5 58,17" fill="#248A5A" />
      <ellipse cx="40" cy="17" rx="23" ry="8" fill="#2D9E6B" />
      <circle cx="22" cy="24" r="12" fill="#E0D0C0" />
      <circle cx="58" cy="24" r="12" fill="#E0D0C0" />
      <circle cx="22" cy="24" r="7" fill="#D4B8A8" />
      <circle cx="58" cy="24" r="7" fill="#D4B8A8" />
      {/* Eyes */}
      <circle cx="33" cy="37" r="8" fill="white" />
      <circle cx="47" cy="37" r="8" fill="white" />
      <circle cx="34" cy={isFakeHappy ? 39 : 37} r="5.5" fill="#6B4226" />
      <circle cx="48" cy={isFakeHappy ? 39 : 37} r="5.5" fill="#6B4226" />
      <circle cx="35.5" cy="35" r="2" fill="white" />
      <circle cx="49.5" cy="35" r="2" fill="white" />
      {/* Eyelid overlay for fake-happy */}
      {isFakeHappy && (
        <>
          <rect x="25" y="29" width="18" height="8" rx="4" fill="#F0F0E0" opacity="0.75" />
          <rect x="39" y="29" width="18" height="8" rx="4" fill="#F0F0E0" opacity="0.75" />
          <path d="M28,29 Q32,27 36,30" stroke="#8B6B4A" strokeWidth="1.5" fill="none" />
          <path d="M42,29 Q46,27 50,30" stroke="#8B6B4A" strokeWidth="1.5" fill="none" />
        </>
      )}
      {/* Brows */}
      <line x1="28" y1="31" x2="31" y2="28" stroke="#6B4226" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="33" y1="30" x2="33" y2="27" stroke="#6B4226" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="43" y1="30" x2="43" y2="27" stroke="#6B4226" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="48" y1="31" x2="45" y2="28" stroke="#6B4226" strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="40" cy="47" rx="4" ry="3" fill="#FFB7C5" />
      {/* Mouth */}
      {isFakeHappy ? (
        <path d="M36,52 Q40,56 44,52" stroke="#B09080" strokeWidth="2" fill="none" strokeLinecap="round" />
      ) : isExcited ? (
        <path d="M32,51 Q40,59 48,51" stroke="#B09080" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M34,54 Q40,50 46,54" stroke="#B09080" strokeWidth="2" fill="none" strokeLinecap="round" />
      )}
      {/* Excited sparkles */}
      {isExcited && (
        <>
          <circle cx="14" cy="20" r="3" fill="#FFD700" opacity="0.8" />
          <circle cx="66" cy="18" r="2.5" fill="#FFD700" opacity="0.8" />
          <circle cx="10" cy="35" r="2" fill="#FFD700" opacity="0.6" />
        </>
      )}
    </svg>
  );
}

// ── SVG: Spaceship ────────────────────────────────────────────────────────────
function SpaceshipSVG({ size = 130 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 0.68)} viewBox="0 0 130 88">
      <ellipse cx="65" cy="82" rx="28" ry="8" fill="#7DD3FC" opacity="0.3" />
      <ellipse cx="65" cy="66" rx="55" ry="16" fill="#0EA5E9" />
      <ellipse cx="65" cy="62" rx="55" ry="16" fill="#38BDF8" />
      <ellipse cx="65" cy="44" rx="30" ry="24" fill="#7DD3FC" />
      <ellipse cx="65" cy="42" rx="26" ry="20" fill="#BAE6FD" opacity="0.9" />
      <circle cx="56" cy="42" r="5" fill="#FF6EB4" opacity="0.8" />
      <circle cx="66" cy="40" r="5" fill="#F5F0E8" opacity="0.8" />
      <circle cx="75" cy="43" r="4" fill="#8B9099" opacity="0.7" />
      <ellipse cx="32" cy="62" rx="11" ry="8" fill="#BAE6FD" opacity="0.75" />
      <ellipse cx="65" cy="66" rx="11" ry="8" fill="#BAE6FD" opacity="0.75" />
      <ellipse cx="98" cy="62" rx="11" ry="8" fill="#BAE6FD" opacity="0.75" />
      <ellipse cx="65" cy="76" rx="47" ry="8" fill="#0284C7" />
      <line x1="30" y1="78" x2="20" y2="88" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" />
      <line x1="100" y1="78" x2="110" y2="88" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

// ── Star Field ────────────────────────────────────────────────────────────────
function StarField({ speed = 1 }: { speed?: number }) {
  const stars = useMemo(() => Array.from({ length: 220 }, (_, i) => ({
    x: (i * 137.508) % 100,
    y: (i * 97.339) % 100,
    size: 0.6 + (i % 5) * 0.28,
    delay: (i % 13) * 0.38,
    dur: (1.8 + (i % 7) * 0.5) / speed,
  })), [speed]);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {stars.map((s, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size,
          borderRadius: "50%", background: "white",
          animation: `sstwinkle ${s.dur}s ${s.delay}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
}

// ── Warp Burst ────────────────────────────────────────────────────────────────
function WarpBurst() {
  const rays = useMemo(() => Array.from({ length: 30 }, (_, i) => ({
    angle: i * 12,
    h: 44 + (i % 7) * 7,
    w: 1 + (i % 3) * 0.7,
    delay: (i % 8) * 0.045,
  })), []);
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 5 }}>
      {rays.map((r, i) => (
        <div key={i} style={{
          position: "absolute", left: "50%", top: "50%",
          width: r.w, height: `${r.h}vh`,
          marginLeft: -r.w / 2, marginTop: 0,
          background: "linear-gradient(to bottom, transparent 0%, rgba(160,220,255,0.9) 50%, transparent 100%)",
          transformOrigin: "50% 0%",
          transform: `rotate(${r.angle}deg)`,
          animation: `sswarpRay 1.3s ${r.delay}s cubic-bezier(0.3,0,0.6,1) forwards`,
          opacity: 0,
        }} />
      ))}
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        width: 280, height: 280, marginLeft: -140, marginTop: -140,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(140,210,255,0.5) 35%, transparent 70%)",
        animation: "sswarpCore 1.3s cubic-bezier(0.25,0,0.6,1) forwards",
      }} />
    </div>
  );
}

// ── Speech Bubble ─────────────────────────────────────────────────────────────
function SpeechBubble({ text, fromBottom = true }: { text: string; fromBottom?: boolean }) {
  return (
    <div style={{
      position: "relative", background: "rgba(255,255,255,0.97)", borderRadius: 14,
      padding: "8px 12px", fontSize: 11.5, color: "#333", maxWidth: 160,
      boxShadow: "0 4px 14px rgba(0,0,0,0.22)", lineHeight: 1.45, fontWeight: 600,
      animation: "ssbubblePop 0.35s ease-out forwards",
    }}>
      {text}
      {fromBottom && (
        <div style={{
          position: "absolute", bottom: -9, left: 18, width: 0, height: 0,
          borderLeft: "9px solid transparent", borderRight: "9px solid transparent",
          borderTop: "9px solid rgba(255,255,255,0.97)",
        }} />
      )}
    </div>
  );
}

// ── CSS Keyframes ─────────────────────────────────────────────────────────────
function GameStyles() {
  return (
    <style>{`
      @keyframes sstwinkle { 0%,100%{opacity:0.2;transform:scale(0.85)} 50%{opacity:1;transform:scale(1.3)} }
      @keyframes sswarpRay { 0%{opacity:0;transform:rotate(var(--dummy,0)) scaleY(0.05)} 30%{opacity:0.9} 100%{opacity:0;transform:rotate(var(--dummy,0)) scaleY(1)} }
      @keyframes sswarpCore { 0%{transform:scale(0.05);opacity:0} 50%{transform:scale(1);opacity:1} 100%{transform:scale(7);opacity:0} }
      @keyframes sswarpFlash { 0%,40%{opacity:0} 75%{opacity:1} 100%{opacity:1} }
      @keyframes ssfadeOut { from{opacity:1} to{opacity:0} }
      @keyframes sslandShake {
        0%,100%{transform:translate(0,0) rotate(0deg)}
        8%{transform:translate(-12px,6px) rotate(-0.6deg)}
        18%{transform:translate(12px,-6px) rotate(0.6deg)}
        28%{transform:translate(-9px,9px) rotate(-0.4deg)}
        38%{transform:translate(9px,-9px) rotate(0.4deg)}
        48%{transform:translate(-5px,4px) rotate(-0.2deg)}
        58%{transform:translate(5px,-4px) rotate(0.2deg)}
        68%{transform:translate(-2px,2px)} 80%{transform:translate(2px,-2px)}
      }
      @keyframes sscharSlideUp { from{transform:translateY(110px) scale(0.9);opacity:0} to{transform:translateY(0) scale(1);opacity:1} }
      @keyframes ssspeakBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
      @keyframes ssbubblePop { 0%{transform:scale(0.5) translateY(10px);opacity:0} 65%{transform:scale(1.06) translateY(-2px);opacity:1} 100%{transform:scale(1) translateY(0);opacity:1} }
      @keyframes ssglowPulse {
        0%,100%{box-shadow:0 0 25px rgba(100,180,255,0.5),0 0 60px rgba(100,180,255,0.2),inset 0 0 20px rgba(100,180,255,0.1)}
        50%{box-shadow:0 0 50px rgba(100,180,255,0.9),0 0 120px rgba(100,180,255,0.5),0 0 200px rgba(100,180,255,0.2),inset 0 0 40px rgba(100,180,255,0.2)}
      }
      @keyframes ssfadeIn { from{opacity:0} to{opacity:1} }
      @keyframes ssfadeInUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
      @keyframes ssfloatTitle { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      @keyframes ssshipFloat { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-14px) rotate(2deg)} }
      @keyframes sscelebrate { 0%{transform:translateY(0) rotate(-3deg)} 100%{transform:translateY(-8px) rotate(3deg)} }
      @keyframes ssslowClap { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
      @keyframes ssblockAppear { from{transform:scaleX(0) translateY(-10px);opacity:0} to{transform:scaleX(1) translateY(0);opacity:1} }
      @keyframes ssblockFall0 { to{transform:translate(-80px,100px) rotate(-40deg);opacity:0} }
      @keyframes ssblockFall1 { to{transform:translate(60px,80px) rotate(30deg);opacity:0} }
      @keyframes ssblockFall2 { to{transform:translate(-40px,120px) rotate(-60deg);opacity:0} }
      @keyframes ssblockFall3 { to{transform:translate(100px,60px) rotate(50deg);opacity:0} }
      @keyframes ssblockFall4 { to{transform:translate(-60px,90px) rotate(-30deg);opacity:0} }
      @keyframes ssdogBump { 0%{transform:translateX(0)} 50%{transform:translateX(-18px)} 100%{transform:translateX(0)} }
      @keyframes ssslideInLeft { from{transform:translateX(-120px);opacity:0} to{transform:translateX(0);opacity:1} }
      @keyframes ssslideInRight { from{transform:translateX(120px);opacity:0} to{transform:translateX(0);opacity:1} }
      @keyframes ssslideOutLeft { from{transform:translateX(0);opacity:1} to{transform:translateX(-120px);opacity:0} }
      @keyframes ssslideOutRight { from{transform:translateX(0);opacity:1} to{transform:translateX(120px);opacity:0} }
      @keyframes sskeyMove { 0%{opacity:1} 100%{opacity:1} }
    `}</style>
  );
}

const btnOverlay: React.CSSProperties = {
  padding: "6px 14px", borderRadius: 20,
  background: "rgba(255,255,255,0.14)", border: "1.5px solid rgba(255,255,255,0.35)",
  color: "white", fontSize: 11, fontWeight: 700, cursor: "pointer",
};

const SPACE_BG = "linear-gradient(180deg, #0d1130 0%, #1a1f4a 70%, #0a0d1e 100%)";

const DIALOGUE = [
  { charId: "panda",  line: "어? 여기는 어디지?" },
  { charId: "rabbit", line: "잠깐! 우리 말고 다른 친구도 있잖아!" },
  { charId: "cat",    line: "너도 이곳에 도착했구나!" },
  { charId: "puppy",  line: "우리랑 같이 탐험하지 않을래?" },
];

const BLOCKS = [
  { color: "#FF6B6B" }, { color: "#FF9F43" }, { color: "#F9CA24" },
  { color: "#6BCB77" }, { color: "#54A0FF" },
];

function renderChar(id: string, size: number) {
  if (id === "panda")  return <PandaSVG size={size} />;
  if (id === "puppy")  return <PuppySVG size={size} />;
  return <PandaSVG size={size} />;
}

// ── Shared fullscreen wrapper ─────────────────────────────────────────────────
function FullScreen({ bg, children, className }: { bg?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className} style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: bg ?? SPACE_BG, overflow: "hidden",
    }}>
      {children}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function SocialAssessmentGame() {
  const [stage, setStage]           = useState<GameStage>("warp-start");
  const [muted, setMuted]           = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [dialogueIdx, setDialogueIdx] = useState(0);
  const [landingPhase, setLandingPhase] = useState<"shake" | "settle">("shake");

  // Assessment data
  const [data, setData] = useState<AssessmentData>({
    m1q1: "", m1q2: [], m1q3: "",
    m2q1: "", m2q2: "", m2q3: "",
    m3q1: "", m3q2: "",
    times: {},
  });
  const [selectedOpt, setSelectedOpt] = useState<string>("");

  // Scene phases
  const [m1Phase, setM1Phase] = useState(0);
  const [m2Phase, setM2Phase] = useState(0);
  const [m3Phase, setM3Phase] = useState(0);
  const [keyPos, setKeyPos]   = useState<"panda" | "red-closed" | "blue-closed">("panda");
  const [m2Selection, setM2Selection] = useState("");

  const sceneTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const qStartTime  = useRef(Date.now());
  const videoRef    = useRef<HTMLVideoElement>(null);
  const sessionId   = useRef(`sag-${Date.now()}`);

  function clearSceneTimers() {
    sceneTimers.current.forEach(clearTimeout);
    sceneTimers.current = [];
  }

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduceMotion(true);
    }
  }, []);

  // warp-traveling auto-advance
  useEffect(() => {
    if (stage !== "warp-traveling") return;
    if (reduceMotion) { setStage("video-playing"); return; }
    const t = setTimeout(() => setStage("video-playing"), 1700);
    return () => clearTimeout(t);
  }, [stage, reduceMotion]);

  // video-playing
  useEffect(() => {
    if (stage !== "video-playing") return;
    const v = videoRef.current;
    if (!v) { setStage("landing"); return; }
    v.muted = muted;
    v.play().catch(() => { setVideoError(true); setStage("landing"); });
  }, [stage]); // eslint-disable-line react-hooks/exhaustive-deps

  // landing
  useEffect(() => {
    if (stage !== "landing") return;
    setLandingPhase("shake");
    const t1 = setTimeout(() => setLandingPhase("settle"), 1300);
    const t2 = setTimeout(() => { setStage("dialogue"); setDialogueIdx(0); }, 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [stage]);

  // dialogue auto-advance
  useEffect(() => {
    if (stage !== "dialogue" || dialogueIdx >= DIALOGUE.length - 1) return;
    const t = setTimeout(() => setDialogueIdx(i => i + 1), 3200);
    return () => clearTimeout(t);
  }, [stage, dialogueIdx]);

  // m1 scene phase chain
  useEffect(() => {
    if (stage !== "m1-scene") return;
    setM1Phase(0);
    clearSceneTimers();
    const chain: [number, number][] = [[1,1500],[2,3500],[3,5500],[4,8000],[5,10000]];
    chain.forEach(([ph, ms]) => {
      const t = setTimeout(() => setM1Phase(ph), ms);
      sceneTimers.current.push(t);
    });
    return clearSceneTimers;
  }, [stage]);

  // m2 scene phase chain
  useEffect(() => {
    if (stage !== "m2-scene") return;
    setM2Phase(0); setKeyPos("panda");
    clearSceneTimers();
    const pushTimer = (fn: () => void, ms: number) => {
      const t = setTimeout(fn, ms);
      sceneTimers.current.push(t);
    };
    pushTimer(() => setM2Phase(1), 1500);
    pushTimer(() => { setM2Phase(2); setKeyPos("red-closed"); }, 3500);
    pushTimer(() => setM2Phase(3), 5000);
    pushTimer(() => setM2Phase(4), 6500);
    pushTimer(() => { setM2Phase(5); setKeyPos("blue-closed"); }, 8500);
    pushTimer(() => setM2Phase(6), 10500);
    pushTimer(() => setM2Phase(7), 12000);
    return clearSceneTimers;
  }, [stage]);

  // m3 scene phase chain
  useEffect(() => {
    if (stage !== "m3-scene") return;
    setM3Phase(0);
    clearSceneTimers();
    const pushTimer = (fn: () => void, ms: number) => {
      const t = setTimeout(fn, ms);
      sceneTimers.current.push(t);
    };
    pushTimer(() => setM3Phase(1), 1000);
    pushTimer(() => setM3Phase(2), 3500);
    pushTimer(() => setM3Phase(3), 5000);
    pushTimer(() => setM3Phase(4), 6500);
    pushTimer(() => setM3Phase(5), 8500);
    return clearSceneTimers;
  }, [stage]);

  // reset qStartTime on question entry
  useEffect(() => {
    const questionStages: GameStage[] = ["m1-q1","m1-q2","m1-q3","m2-q1","m2-q2","m2-q3","m3-q1","m3-q2"];
    if (questionStages.includes(stage)) {
      qStartTime.current = Date.now();
      setSelectedOpt("");
    }
  }, [stage]);

  // m3-outcome: auto-advance to result-child after 2.5s
  useEffect(() => {
    if (stage !== "m3-outcome") return;
    const t = setTimeout(() => setStage("result-child"), 2500);
    return () => clearTimeout(t);
  }, [stage]);

  // result-child: save badge on mount
  useEffect(() => {
    if (stage !== "result-child") return;
    saveBadge({ id: "social-master", packName: "사회", label: "관계 고수", emoji: "🤝" });
  }, [stage]);

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    if (videoRef.current) videoRef.current.muted = next;
  }

  function skipToM1() { clearSceneTimers(); setStage("m1-scene"); }

  function recordAndAdvance(key: keyof AssessmentData, value: string | string[], next: GameStage, autoMs?: number) {
    const ms = Date.now() - qStartTime.current;
    setData(d => ({
      ...d,
      [key]: value,
      times: { ...d.times, [key]: ms },
    }));
    // save to gameResults store
    saveSocialResponse({
      sessionId: sessionId.current,
      characterId: "assessment",
      sceneId: parseInt(key.replace(/\D/g, "")) || 0,
      sceneTitle: key,
      choiceIdx: 0,
      choiceText: Array.isArray(value) ? value.join(",") : value,
      reactionTimeMs: ms,
      skillsAwarded: [],
      timestamp: new Date().toISOString(),
    });
    if (autoMs !== undefined) {
      setTimeout(() => setStage(next), autoMs);
    } else {
      setStage(next);
    }
  }

  function handleReset() {
    clearSceneTimers();
    setStage("warp-start");
    setMuted(true); setVideoError(false); setDialogueIdx(0); setLandingPhase("shake");
    setData({ m1q1:"", m1q2:[], m1q3:"", m2q1:"", m2q2:"", m2q3:"", m3q1:"", m3q2:"", times:{} });
    setSelectedOpt(""); setM1Phase(0); setM2Phase(0); setM3Phase(0);
    setKeyPos("panda"); setM2Selection("");
  }

  // ── WARP START ───────────────────────────────────────────────────────────────
  if (stage === "warp-start") return (
    <>
      <GameStyles />
      <FullScreen bg="radial-gradient(ellipse at 50% 60%, #0a0f2e 0%, #030818 60%)">
        <StarField speed={1} />
        <div style={{ position: "absolute", top: 14, left: 14, right: 14, display: "flex", justifyContent: "space-between", zIndex: 20 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={toggleMute} style={btnOverlay}>{muted ? "🔇" : "🔊"}</button>
            <button onClick={() => setReduceMotion(r => !r)} style={btnOverlay}>{reduceMotion ? "✦ 줄임" : "♿"}</button>
          </div>
          <button onClick={skipToM1} style={btnOverlay}>건너뛰기 ▶</button>
        </div>
        <div style={{ position: "relative", zIndex: 10, textAlign: "center", animation: "ssfadeInUp 1s ease both", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
          <div style={{ marginBottom: 20, animation: "ssfloatTitle 3s ease-in-out infinite", display: "inline-block" }}>
            <SpaceshipSVG size={160} />
          </div>
          <h2 style={{ fontSize: 30, fontWeight: 900, color: "white", letterSpacing: "-0.03em", margin: "0 0 6px", textShadow: "0 0 40px rgba(100,180,255,0.8)" }}>
            우주 탐험 미션
          </h2>
          <p style={{ color: "#7DD3FC", fontSize: 13.5, margin: "0 0 36px" }}>
            세 가지 미션을 통해 친구와 함께하는 방법을 알아봐요
          </p>
          <button onClick={() => reduceMotion ? setStage("video-playing") : setStage("warp-traveling")}
            style={{ padding: "16px 44px", borderRadius: 50, background: "linear-gradient(135deg, #1a3a8f 0%, #2563eb 50%, #60a5fa 100%)", border: "2px solid rgba(147,197,253,0.6)", color: "white", fontSize: 17, fontWeight: 900, cursor: "pointer", animation: "ssglowPulse 2.4s ease-in-out infinite", letterSpacing: "-0.01em" }}>
            ✨ 탐험 시작하기
          </button>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 16, alignItems: "flex-end", animation: "ssfadeInUp 1.3s 0.6s ease both", opacity: 0 }}>
          {["panda", "puppy"].map((id, i) => (
            <div key={id} style={{ opacity: 0.5 + i * 0.1, transform: `scale(0.55) translateY(${10 + i * 4}px)` }}>
              {renderChar(id, 80)}
            </div>
          ))}
        </div>
      </FullScreen>
    </>
  );

  // ── WARP TRAVELING ───────────────────────────────────────────────────────────
  if (stage === "warp-traveling") return (
    <>
      <GameStyles />
      <FullScreen bg="#030818">
        <StarField speed={8} />
        <WarpBurst />
        <div style={{ position: "absolute", inset: 0, zIndex: 20, background: "white", opacity: 0, animation: "sswarpFlash 0.6s 1.1s ease-in forwards", pointerEvents: "none" }} />
      </FullScreen>
    </>
  );

  // ── VIDEO PLAYING ────────────────────────────────────────────────────────────
  if (stage === "video-playing") return (
    <>
      <GameStyles />
      <FullScreen bg="black">
        {!videoError && (
          <video ref={videoRef} src="/videos/space-intro.mp4.mp4" playsInline muted={muted}
            onEnded={() => setStage("landing")} onError={() => { setVideoError(true); setStage("landing"); }}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "black", animation: "ssfadeOut 0.7s 0.1s ease forwards", pointerEvents: "none", zIndex: 5 }} />
        <div style={{ position: "absolute", top: 14, left: 14, right: 14, display: "flex", justifyContent: "space-between", zIndex: 10 }}>
          <button onClick={toggleMute} style={btnOverlay}>{muted ? "🔇" : "🔊"}</button>
          <button onClick={skipToM1} style={btnOverlay}>건너뛰기 ▶</button>
        </div>
      </FullScreen>
    </>
  );

  // ── LANDING ──────────────────────────────────────────────────────────────────
  if (stage === "landing") return (
    <>
      <GameStyles />
      <FullScreen bg="#030818" className={landingPhase === "shake" && !reduceMotion ? "landing-shake" : ""}>
        <style>{`.landing-shake{animation:sslandShake 1.2s ease-in-out}`}</style>
        <StarField speed={1} />
        {landingPhase === "settle" && (
          <>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "42%", background: "linear-gradient(180deg,#1a0940 0%,#2D1B69 45%,#3c2080 100%)", borderRadius: "120% 120% 0 0 / 28% 28% 0 0", animation: "ssfadeIn 1.3s ease forwards" }} />
            <div style={{ position: "absolute", bottom: "38%", left: "50%", width: "85%", height: 70, transform: "translateX(-50%)", background: "radial-gradient(ellipse,rgba(100,60,220,0.45) 0%,transparent 70%)", animation: "ssfadeIn 1.5s 0.2s ease both", opacity: 0 }} />
          </>
        )}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 14 }}>
          {landingPhase === "shake" ? (
            <>
              <div style={{ fontSize: 46 }}>💥</div>
              <p style={{ color: "white", fontSize: 17, fontWeight: 900, textShadow: "0 0 24px rgba(255,120,80,0.9)" }}>충돌! 비상착륙!</p>
            </>
          ) : (
            <div style={{ animation: "ssfadeInUp 0.9s 0.3s ease both", opacity: 0, textAlign: "center" }}>
              <div style={{ fontSize: 42, marginBottom: 10 }}>🛸</div>
              <p style={{ color: "#C4B5FD", fontSize: 15, fontWeight: 700 }}>낯선 별에 착륙했어요...</p>
            </div>
          )}
        </div>
        <button onClick={skipToM1} style={{ position: "absolute", top: 14, right: 14, zIndex: 20, ...btnOverlay }}>건너뛰기 ▶</button>
      </FullScreen>
    </>
  );

  // ── DIALOGUE ─────────────────────────────────────────────────────────────────
  if (stage === "dialogue") {
    const isLast  = dialogueIdx >= DIALOGUE.length - 1;
    const speaker = DIALOGUE[dialogueIdx];
    const charIds = ["panda", "rabbit", "cat", "puppy"] as const;
    return (
      <>
        <GameStyles />
        <FullScreen bg="linear-gradient(180deg,#030818 0%,#0d0820 55%,#1a0a40 100%)">
          <StarField speed={1} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "36%", background: "linear-gradient(180deg,#1a0940 0%,#2D1B69 50%,#3c2080 100%)", borderRadius: "100% 100% 0 0 / 18% 18% 0 0" }} />
          <div style={{ position: "absolute", bottom: 110, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 10, alignItems: "flex-end", padding: "0 12px" }}>
            {charIds.map((id, i) => {
              const isSpeaker = speaker.charId === id;
              return (
                <div key={id} style={{
                  position: "relative", display: "flex", flexDirection: "column", alignItems: "center",
                  transform: isSpeaker ? "translateY(-14px) scale(1.14)" : "translateY(0) scale(0.84)",
                  transition: "transform 0.45s cubic-bezier(0.34,1.56,0.64,1), filter 0.45s ease",
                  filter: isSpeaker ? "drop-shadow(0 0 14px rgba(140,190,255,0.7))" : "brightness(0.45)",
                  animation: `sscharSlideUp 0.65s ${i * 0.1}s cubic-bezier(0.34,1.56,0.64,1) both`,
                  zIndex: isSpeaker ? 10 : 5,
                }}>
                  {isSpeaker && (
                    <div style={{ position: "absolute", bottom: 88, left: "50%", zIndex: 20 }}>
                      <div style={{ animation: "ssbubblePop 0.35s ease-out forwards", transformOrigin: "50% 100%" }}>
                        <div style={{ background: "white", borderRadius: 16, padding: "9px 14px", fontSize: 12.5, fontWeight: 800, color: "#1a1a2e", boxShadow: "0 4px 24px rgba(0,0,0,0.5)", whiteSpace: "nowrap", maxWidth: 190, textAlign: "center", lineHeight: 1.4, transform: "translateX(-50%)", position: "relative" }}>
                          {speaker.line}
                          <div style={{ position: "absolute", bottom: -9, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "9px solid transparent", borderRight: "9px solid transparent", borderTop: "9px solid white" }} />
                        </div>
                      </div>
                    </div>
                  )}
                  {id === "panda" ? <PandaSVG size={72} /> : id === "puppy" ? <PuppySVG size={72} /> : <PandaSVG size={72} />}
                </div>
              );
            })}
          </div>
          <div style={{ position: "absolute", bottom: 88, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 7 }}>
            {DIALOGUE.map((_, i) => (
              <div key={i} style={{ width: i === dialogueIdx ? 22 : 7, height: 7, borderRadius: 4, background: i <= dialogueIdx ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.25)", transition: "all 0.35s ease" }} />
            ))}
          </div>
          <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", animation: "ssfadeInUp 0.6s 0.5s ease both", opacity: 0 }}>
            {isLast ? (
              <button onClick={() => setStage("m1-scene")} style={{ padding: "14px 38px", borderRadius: 50, background: "linear-gradient(135deg,#1a3a8f,#7c3aed)", border: "2px solid rgba(147,197,253,0.5)", color: "white", fontSize: 15, fontWeight: 900, cursor: "pointer", boxShadow: "0 0 35px rgba(120,80,255,0.5)", whiteSpace: "nowrap" }}>
                좋아, 같이 가자! 🚀
              </button>
            ) : (
              <button onClick={() => setDialogueIdx(i => i + 1)} style={{ padding: "11px 32px", borderRadius: 50, background: "rgba(255,255,255,0.12)", border: "2px solid rgba(255,255,255,0.4)", color: "white", fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>
                계속 ▶
              </button>
            )}
          </div>
          <button onClick={skipToM1} style={{ position: "absolute", top: 14, right: 14, zIndex: 30, ...btnOverlay }}>건너뛰기 ▶</button>
        </FullScreen>
      </>
    );
  }

  // ── M1 SCENE ─────────────────────────────────────────────────────────────────
  if (stage === "m1-scene") {
    const mouseExpr: "default" | "excited" | "fake-happy" = m1Phase >= 3 ? "fake-happy" : m1Phase === 1 ? "excited" : "default";
    return (
      <>
        <GameStyles />
        <FullScreen bg={SPACE_BG}>
          <StarField speed={1} />
          {/* Mission label */}
          <div style={{ position: "absolute", top: 16, left: 16, zIndex: 20 }}>
            <span style={{ background: "rgba(255,255,255,0.15)", color: "white", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>미션 1 — 복잡한 마음</span>
          </div>
          {/* Floor */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "30%", background: "linear-gradient(0deg,#0a0d1e,#1a1540)" }} />
          {/* Lottery box center */}
          <div style={{ position: "absolute", left: "50%", bottom: "32%", transform: "translateX(-50%)", fontSize: 36, zIndex: 5 }}>
            🎲
          </div>
          {/* GreenMouse left */}
          <div style={{ position: "absolute", left: "12%", bottom: "29%", zIndex: 6 }}>
            {m1Phase >= 1 && (
              <div style={{ position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)", marginBottom: 6, zIndex: 20 }}>
                {m1Phase === 1 && <SpeechBubble text="나 이번에는 꼭 조종사가 되고 싶어!" />}
                {m1Phase === 3 && <SpeechBubble text="축하해! 정말 잘됐다." />}
              </div>
            )}
            <GreenMouseSVG size={90} expression={mouseExpr} />
          </div>
          {/* Puppy right */}
          <div style={{ position: "absolute", right: "12%", bottom: "29%", zIndex: 6 }}>
            {m1Phase === 2 && (
              <div style={{ position: "absolute", bottom: "100%", right: 0, marginBottom: 6, zIndex: 20 }}>
                <SpeechBubble text="우와! 내가 조종사야!" />
              </div>
            )}
            <PuppySVG size={90} celebrating={m1Phase === 2} />
          </div>
          {/* Phase 4: description overlay */}
          {m1Phase === 4 && (
            <div style={{ position: "absolute", bottom: "62%", left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.65)", borderRadius: 12, padding: "10px 18px", color: "#FDE68A", fontSize: 13, fontWeight: 700, textAlign: "center", whiteSpace: "nowrap", zIndex: 30, animation: "ssfadeInUp 0.5s ease" }}>
              초록 친구의 모습을 잘 살펴보세요...
            </div>
          )}
          {/* Phase 5: advance button */}
          {m1Phase >= 5 && (
            <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", textAlign: "center", zIndex: 30 }}>
              <p style={{ color: "white", fontSize: 13, marginBottom: 10 }}>장면이 끝났어요. 질문에 답해볼까?</p>
              <button onClick={() => setStage("m1-q1")} style={{ padding: "12px 28px", borderRadius: 24, background: "linear-gradient(135deg,#1a3a8f,#7c3aed)", color: "white", fontSize: 14, fontWeight: 800, cursor: "pointer", border: "none" }}>
                질문 보기 ▶
              </button>
            </div>
          )}
          <button onClick={() => setStage("m1-q1")} style={{ position: "absolute", top: 14, right: 14, zIndex: 30, ...btnOverlay }}>건너뛰기 ▶</button>
        </FullScreen>
      </>
    );
  }

  // ── M1 Q1 ─────────────────────────────────────────────────────────────────────
  if (stage === "m1-q1") {
    const opts = [
      { k: "A", text: "강아지가 조종사가 되어 기쁘기만 해." },
      { k: "B", text: "강아지를 축하하지만, 자신이 조종사가 못 돼서 아쉬울 수도 있어." },
      { k: "C", text: "강아지에게 화가 많이 난 것 같아." },
      { k: "D", text: "아무렇지도 않은 것 같아." },
    ];
    return (
      <>
        <GameStyles />
        <FullScreen bg={SPACE_BG}>
          <StarField speed={1} />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 20px 24px", zIndex: 10 }}>
            <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 16, padding: "12px 18px", marginBottom: 18, textAlign: "center", maxWidth: 320 }}>
              <p style={{ color: "#FDE68A", fontSize: 11, fontWeight: 700, marginBottom: 6 }}>미션 1 · 질문 1 / 3</p>
              <p style={{ color: "white", fontSize: 15, fontWeight: 800, lineHeight: 1.5 }}>초록 친구는 지금 어떤 마음일까?</p>
            </div>
            <div style={{ marginBottom: 16 }}><GreenMouseSVG size={90} expression="fake-happy" /></div>
            <div style={{ width: "100%", maxWidth: 340, display: "flex", flexDirection: "column", gap: 10 }}>
              {opts.map(o => (
                <button key={o.k} onClick={() => {
                  setSelectedOpt(o.k);
                  recordAndAdvance("m1q1", o.k, "m1-q2");
                }}
                  style={{ padding: "13px 18px", borderRadius: 14, background: selectedOpt === o.k ? "rgba(99,179,237,0.3)" : "rgba(255,255,255,0.1)", border: selectedOpt === o.k ? "2px solid #7DD3FC" : "1.5px solid rgba(255,255,255,0.3)", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left", lineHeight: 1.4 }}>
                  <span style={{ fontWeight: 800, marginRight: 6 }}>{o.k}.</span>{o.text}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => setStage("m1-q2")} style={{ position: "absolute", top: 14, right: 14, zIndex: 30, ...btnOverlay }}>건너뛰기 ▶</button>
        </FullScreen>
      </>
    );
  }

  // ── M1 Q2 ─────────────────────────────────────────────────────────────────────
  if (stage === "m1-q2") {
    const selectedCues = data.m1q2;
    const toggleCue = (cue: string) => {
      setData(d => ({
        ...d,
        m1q2: d.m1q2.includes(cue) ? d.m1q2.filter(c => c !== cue) : [...d.m1q2, cue],
      }));
    };
    const cueLabels: Record<string, string> = {
      "eyes": "눈/시선", "mouth": "입 표정", "hands": "손/팔", "posture": "자세/어깨", "timing": "박수 타이밍",
    };
    return (
      <>
        <GameStyles />
        <FullScreen bg={SPACE_BG}>
          <StarField speed={1} />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px 16px 24px", zIndex: 10 }}>
            <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 16, padding: "10px 16px", marginBottom: 14, textAlign: "center", maxWidth: 320 }}>
              <p style={{ color: "#FDE68A", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>미션 1 · 질문 2 / 3</p>
              <p style={{ color: "white", fontSize: 14, fontWeight: 800, lineHeight: 1.5 }}>어떤 모습을 보고 그렇게 생각했어?<br /><span style={{ fontSize: 11, fontWeight: 500 }}>눌러서 고를 수 있어요 (여러 개 OK)</span></p>
            </div>
            {/* Character with clickable overlay */}
            <div style={{ position: "relative", marginBottom: 10 }}>
              <GreenMouseSVG size={160} expression="fake-happy" />
              {/* Clickable SVG overlays in viewbox 80x104 scaled to size=160 (scale=2) */}
              <svg style={{ position: "absolute", inset: 0, width: 160, height: Math.round(160 * 1.3), cursor: "pointer" }} viewBox="0 0 80 104">
                {/* Eyes */}
                <rect x="22" y="28" width="36" height="18" rx="8"
                  fill={selectedCues.includes("eyes") ? "rgba(100,200,255,0.4)" : "rgba(100,200,255,0.05)"}
                  stroke={selectedCues.includes("eyes") ? "#7DD3FC" : "transparent"} strokeWidth="1.5"
                  onClick={() => toggleCue("eyes")} />
                {/* Mouth */}
                <rect x="27" y="47" width="26" height="12" rx="6"
                  fill={selectedCues.includes("mouth") ? "rgba(100,200,255,0.4)" : "rgba(100,200,255,0.05)"}
                  stroke={selectedCues.includes("mouth") ? "#7DD3FC" : "transparent"} strokeWidth="1.5"
                  onClick={() => toggleCue("mouth")} />
                {/* Hands left */}
                <rect x="8" y="58" width="16" height="18" rx="6"
                  fill={selectedCues.includes("hands") ? "rgba(100,200,255,0.4)" : "rgba(100,200,255,0.05)"}
                  stroke={selectedCues.includes("hands") ? "#7DD3FC" : "transparent"} strokeWidth="1.5"
                  onClick={() => toggleCue("hands")} />
                {/* Hands right */}
                <rect x="56" y="58" width="16" height="18" rx="6"
                  fill={selectedCues.includes("hands") ? "rgba(100,200,255,0.4)" : "rgba(100,200,255,0.05)"}
                  stroke={selectedCues.includes("hands") ? "#7DD3FC" : "transparent"} strokeWidth="1.5"
                  onClick={() => toggleCue("hands")} />
                {/* Posture */}
                <rect x="15" y="50" width="50" height="14" rx="6"
                  fill={selectedCues.includes("posture") ? "rgba(100,200,255,0.4)" : "rgba(100,200,255,0.05)"}
                  stroke={selectedCues.includes("posture") ? "#7DD3FC" : "transparent"} strokeWidth="1.5"
                  onClick={() => toggleCue("posture")} />
              </svg>
            </div>
            {/* Timing button */}
            <button onClick={() => toggleCue("timing")}
              style={{ padding: "8px 16px", borderRadius: 20, background: selectedCues.includes("timing") ? "rgba(100,200,255,0.3)" : "rgba(255,255,255,0.1)", border: selectedCues.includes("timing") ? "2px solid #7DD3FC" : "1.5px solid rgba(255,255,255,0.3)", color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer", marginBottom: 10 }}>
              박수 타이밍 (박수가 느렸어)
            </button>
            {/* Selected cue tags */}
            {selectedCues.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginBottom: 12 }}>
                {selectedCues.map(c => (
                  <span key={c} style={{ background: "#7DD3FC", color: "#1a1f4a", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>
                    {cueLabels[c] ?? c}
                  </span>
                ))}
              </div>
            )}
            <button
              disabled={selectedCues.length < 1}
              onClick={() => {
                const ms = Date.now() - qStartTime.current;
                setData(d => ({ ...d, times: { ...d.times, m1q2: ms } }));
                setStage("m1-q3");
              }}
              style={{ padding: "13px 32px", borderRadius: 24, background: selectedCues.length >= 1 ? "linear-gradient(135deg,#1a3a8f,#7c3aed)" : "rgba(255,255,255,0.1)", color: "white", fontSize: 14, fontWeight: 800, cursor: selectedCues.length >= 1 ? "pointer" : "default", border: "none", opacity: selectedCues.length >= 1 ? 1 : 0.4 }}>
              다음 ▶
            </button>
          </div>
          <button onClick={() => setStage("m1-q3")} style={{ position: "absolute", top: 14, right: 14, zIndex: 30, ...btnOverlay }}>건너뛰기 ▶</button>
        </FullScreen>
      </>
    );
  }

  // ── M1 Q3 ─────────────────────────────────────────────────────────────────────
  if (stage === "m1-q3") {
    const opts = [
      { k: "A", text: "다음에는 너도 조종사가 될 수 있을 거야." },
      { k: "B", text: "너도 조종사가 되고 싶었지? 많이 아쉽겠다." },
      { k: "C", text: "강아지가 뽑혔으니까 이제 신경 쓰지 마." },
      { k: "D", text: "아무 말도 하지 않는다." },
    ];
    return (
      <>
        <GameStyles />
        <FullScreen bg={SPACE_BG}>
          <StarField speed={1} />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 20px 24px", zIndex: 10 }}>
            <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 16, padding: "12px 18px", marginBottom: 16, textAlign: "center", maxWidth: 320 }}>
              <p style={{ color: "#FDE68A", fontSize: 11, fontWeight: 700, marginBottom: 6 }}>미션 1 · 질문 3 / 3</p>
              <p style={{ color: "white", fontSize: 15, fontWeight: 800, lineHeight: 1.5 }}>초록 친구에게 어떤 말을 해주고 싶어?</p>
            </div>
            <div style={{ marginBottom: 16 }}><GreenMouseSVG size={80} expression="fake-happy" /></div>
            {selectedOpt && (
              <div style={{ marginBottom: 12, background: "rgba(255,255,255,0.15)", borderRadius: 14, padding: "8px 14px", maxWidth: 280, animation: "ssbubblePop 0.35s ease" }}>
                <p style={{ color: "white", fontSize: 12 }}>💬 "{opts.find(o => o.k === selectedOpt)?.text}"</p>
              </div>
            )}
            <div style={{ width: "100%", maxWidth: 340, display: "flex", flexDirection: "column", gap: 10 }}>
              {opts.map(o => (
                <button key={o.k}
                  onClick={() => {
                    setSelectedOpt(o.k);
                    recordAndAdvance("m1q3", o.k, "m2-scene", 1500);
                  }}
                  style={{ padding: "13px 18px", borderRadius: 14, background: selectedOpt === o.k ? "rgba(99,179,237,0.3)" : "rgba(255,255,255,0.1)", border: selectedOpt === o.k ? "2px solid #7DD3FC" : "1.5px solid rgba(255,255,255,0.3)", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left", lineHeight: 1.4 }}>
                  <span style={{ fontWeight: 800, marginRight: 6 }}>{o.k}.</span>{o.text}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => setStage("m2-scene")} style={{ position: "absolute", top: 14, right: 14, zIndex: 30, ...btnOverlay }}>건너뛰기 ▶</button>
        </FullScreen>
      </>
    );
  }

  // ── M2 SCENE ─────────────────────────────────────────────────────────────────
  if (stage === "m2-scene") {
    const keyStyle: React.CSSProperties = {
      position: "absolute",
      fontSize: 28,
      transition: "left 0.8s ease, bottom 0.8s ease",
      zIndex: 10,
      left: keyPos === "panda" ? "18%" : keyPos === "red-closed" ? "20%" : "68%",
      bottom: keyPos === "panda" ? "48%" : "29%",
    };
    return (
      <>
        <GameStyles />
        <FullScreen bg={SPACE_BG}>
          <StarField speed={1} />
          <div style={{ position: "absolute", top: 16, left: 16, zIndex: 20 }}>
            <span style={{ background: "rgba(255,255,255,0.15)", color: "white", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>미션 2 — 사라진 열쇠</span>
          </div>
          {/* Floor */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "30%", background: "linear-gradient(0deg,#0a0d1e,#1a1540)" }} />
          {/* Red box */}
          <div style={{ position: "absolute", left: "15%", bottom: "30%", width: "18%", height: "22%", background: "#EF4444", border: "3px solid #DC2626", borderRadius: 8, zIndex: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 24 }}>🔴</span>
          </div>
          {/* Blue box */}
          <div style={{ position: "absolute", left: "65%", bottom: "30%", width: "18%", height: "22%", background: "#3B82F6", border: "3px solid #2563EB", borderRadius: 8, zIndex: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 24 }}>🔵</span>
          </div>
          {/* Key */}
          <div style={keyStyle}>🔑</div>
          {/* Panda (phases 0-2) */}
          {m2Phase <= 2 && (
            <div style={{ position: "absolute", left: "10%", bottom: "28%", zIndex: 6, animation: m2Phase === 0 ? "ssslideInLeft 0.6s ease" : undefined }}>
              {m2Phase === 1 && (
                <div style={{ position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-10%)", marginBottom: 6, zIndex: 20 }}>
                  <SpeechBubble text="나중에 출발할 때 쓰려고 열쇠를 여기에 넣어둘게!" />
                </div>
              )}
              <PandaSVG size={80} />
            </div>
          )}
          {/* Panda returns (phase 6+) */}
          {m2Phase >= 6 && (
            <div style={{ position: "absolute", left: "10%", bottom: "28%", zIndex: 6, animation: "ssslideInLeft 0.6s ease" }}>
              {m2Phase === 6 && (
                <div style={{ position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-10%)", marginBottom: 6, zIndex: 20 }}>
                  <SpeechBubble text="이제 출발해야겠다! 열쇠를 찾아볼까?" />
                </div>
              )}
              <PandaSVG size={80} />
            </div>
          )}
          {/* Dog (phases 3-5) */}
          {m2Phase >= 3 && m2Phase <= 5 && (
            <div style={{ position: "absolute", right: "10%", bottom: "28%", zIndex: 6, animation: "ssslideInRight 0.6s ease" }}>
              {m2Phase === 4 && (
                <div style={{ position: "absolute", bottom: "100%", right: 0, marginBottom: 6, zIndex: 20 }}>
                  <SpeechBubble text="여기에 열쇠가 있었네. 파란 상자에 옮겨둘게." />
                </div>
              )}
              <PuppySVG size={80} />
            </div>
          )}
          {/* Phase subtitles */}
          {m2Phase === 2 && (
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", color: "#C4B5FD", fontSize: 13, fontWeight: 700 }}>
              판다가 나갔어요
            </div>
          )}
          {m2Phase >= 7 && (
            <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", textAlign: "center", zIndex: 30 }}>
              <p style={{ color: "white", fontSize: 13, marginBottom: 10 }}>장면이 끝났어요. 질문에 답해볼까?</p>
              <button onClick={() => setStage("m2-q1")} style={{ padding: "12px 28px", borderRadius: 24, background: "linear-gradient(135deg,#1a3a8f,#7c3aed)", color: "white", fontSize: 14, fontWeight: 800, cursor: "pointer", border: "none" }}>
                질문 보기 ▶
              </button>
            </div>
          )}
          <button onClick={() => setStage("m2-q1")} style={{ position: "absolute", top: 14, right: 14, zIndex: 30, ...btnOverlay }}>건너뛰기 ▶</button>
        </FullScreen>
      </>
    );
  }

  // ── M2 Q1 ─────────────────────────────────────────────────────────────────────
  if (stage === "m2-q1") {
    return (
      <>
        <GameStyles />
        <FullScreen bg={SPACE_BG}>
          <StarField speed={1} />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", zIndex: 10 }}>
            <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 16, padding: "12px 18px", marginBottom: 20, textAlign: "center", maxWidth: 320 }}>
              <p style={{ color: "#FDE68A", fontSize: 11, fontWeight: 700, marginBottom: 6 }}>미션 2 · 질문 1 / 3</p>
              <p style={{ color: "white", fontSize: 15, fontWeight: 800, lineHeight: 1.5 }}>판다는 어느 상자를 먼저 열어볼까?</p>
            </div>
            <div style={{ marginBottom: 16 }}><PandaSVG size={70} /></div>
            <div style={{ display: "flex", gap: 24 }}>
              {["red", "blue"].map(color => (
                <button key={color} onClick={() => {
                  setM2Selection(color);
                  recordAndAdvance("m2q1", color, "m2-q2", 1000);
                }}
                  style={{ width: 100, height: 100, borderRadius: 12, background: color === "red" ? "#EF4444" : "#3B82F6", border: m2Selection === color ? "4px solid white" : "3px solid transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, transform: m2Selection === color ? "scale(1.1)" : "scale(1)", transition: "all 0.2s" }}>
                  {color === "red" ? "🔴" : "🔵"}
                </button>
              ))}
            </div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 14 }}>상자를 눌러보세요</p>
          </div>
          <button onClick={() => setStage("m2-q2")} style={{ position: "absolute", top: 14, right: 14, zIndex: 30, ...btnOverlay }}>건너뛰기 ▶</button>
        </FullScreen>
      </>
    );
  }

  // ── M2 Q2 ─────────────────────────────────────────────────────────────────────
  if (stage === "m2-q2") {
    return (
      <>
        <GameStyles />
        <FullScreen bg={SPACE_BG}>
          <StarField speed={1} />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", zIndex: 10 }}>
            <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 16, padding: "12px 18px", marginBottom: 20, textAlign: "center", maxWidth: 320 }}>
              <p style={{ color: "#FDE68A", fontSize: 11, fontWeight: 700, marginBottom: 6 }}>미션 2 · 질문 2 / 3</p>
              <p style={{ color: "white", fontSize: 15, fontWeight: 800, lineHeight: 1.5 }}>열쇠는 실제로 어디에 있을까?</p>
            </div>
            <div style={{ marginBottom: 16 }}>🔑</div>
            <div style={{ display: "flex", gap: 24 }}>
              {["red", "blue"].map(color => (
                <button key={color} onClick={() => {
                  setM2Selection(color);
                  recordAndAdvance("m2q2", color, "m2-q3");
                }}
                  style={{ width: 100, height: 100, borderRadius: 12, background: color === "red" ? "#EF4444" : "#3B82F6", border: m2Selection === color ? "4px solid white" : "3px solid transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, transform: m2Selection === color ? "scale(1.1)" : "scale(1)", transition: "all 0.2s" }}>
                  {color === "red" ? "🔴" : "🔵"}
                </button>
              ))}
            </div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 14 }}>강아지가 열쇠를 옮긴 걸 기억해봐요</p>
          </div>
          <button onClick={() => setStage("m2-q3")} style={{ position: "absolute", top: 14, right: 14, zIndex: 30, ...btnOverlay }}>건너뛰기 ▶</button>
        </FullScreen>
      </>
    );
  }

  // ── M2 Q3 ─────────────────────────────────────────────────────────────────────
  if (stage === "m2-q3") {
    const opts = [
      { k: "A", text: "강아지가 열쇠를 옮긴 것을 보지 못했기 때문에." },
      { k: "B", text: "판다가 상자의 색깔을 잘 모르기 때문에." },
      { k: "C", text: "강아지가 어디에 열쇠를 넣었는지 알려주었기 때문에." },
    ];
    return (
      <>
        <GameStyles />
        <FullScreen bg={SPACE_BG}>
          <StarField speed={1} />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", zIndex: 10 }}>
            <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 16, padding: "12px 18px", marginBottom: 16, textAlign: "center", maxWidth: 320 }}>
              <p style={{ color: "#FDE68A", fontSize: 11, fontWeight: 700, marginBottom: 6 }}>미션 2 · 질문 3 / 3</p>
              <p style={{ color: "white", fontSize: 15, fontWeight: 800, lineHeight: 1.5 }}>판다는 왜 그 상자를 먼저 열어볼까?</p>
            </div>
            <div style={{ marginBottom: 12 }}><PandaSVG size={70} /></div>
            <div style={{ width: "100%", maxWidth: 340, display: "flex", flexDirection: "column", gap: 10 }}>
              {opts.map(o => (
                <button key={o.k} onClick={() => {
                  setSelectedOpt(o.k);
                  recordAndAdvance("m2q3", o.k, "m3-scene", 1500);
                }}
                  style={{ padding: "13px 18px", borderRadius: 14, background: selectedOpt === o.k ? "rgba(99,179,237,0.3)" : "rgba(255,255,255,0.1)", border: selectedOpt === o.k ? "2px solid #7DD3FC" : "1.5px solid rgba(255,255,255,0.3)", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left", lineHeight: 1.4 }}>
                  <span style={{ fontWeight: 800, marginRight: 6 }}>{o.k}.</span>{o.text}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => setStage("m3-scene")} style={{ position: "absolute", top: 14, right: 14, zIndex: 30, ...btnOverlay }}>건너뛰기 ▶</button>
        </FullScreen>
      </>
    );
  }

  // ── M3 SCENE ─────────────────────────────────────────────────────────────────
  if (stage === "m3-scene") {
    const dogIn = m3Phase >= 3;
    const dogBumped = m3Phase >= 4;
    return (
      <>
        <GameStyles />
        <FullScreen bg="linear-gradient(180deg,#1a1a2e 0%,#16213e 60%,#0f3460 100%)">
          <StarField speed={1} />
          <div style={{ position: "absolute", top: 16, left: 16, zIndex: 20 }}>
            <span style={{ background: "rgba(255,255,255,0.15)", color: "white", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>미션 3 — 무너진 모형</span>
          </div>
          {/* Floor */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "30%", background: "linear-gradient(0deg,#0f1326,#1a2040)" }} />
          {/* Phase 0 description */}
          {m3Phase === 0 && (
            <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%,-50%)", color: "#C4B5FD", fontSize: 13, fontWeight: 700, textAlign: "center" }}>
              우주기지에서 우주선 모형을 만들고 있어요...
            </div>
          )}
          {/* Block tower */}
          {m3Phase >= 1 && m3Phase < 4 && (
            <div style={{ position: "absolute", left: "50%", bottom: "30%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center" }}>
              {BLOCKS.map((b, i) => (
                <div key={i} style={{ width: 70, height: 24, borderRadius: 4, margin: "2px auto", background: b.color, animation: `ssblockAppear 0.3s ${i * 0.4}s both` }} />
              ))}
            </div>
          )}
          {/* Phase 2 complete */}
          {m3Phase === 2 && (
            <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", color: "#F9CA24", fontSize: 14, fontWeight: 800, whiteSpace: "nowrap", animation: "ssfadeInUp 0.4s ease" }}>
              완성이다! 🎉
            </div>
          )}
          {/* Fallen blocks */}
          {m3Phase >= 4 && (
            <div style={{ position: "absolute", left: "50%", bottom: "30%", transform: "translateX(-50%)" }}>
              {BLOCKS.map((b, i) => (
                <div key={i} style={{ width: 70, height: 24, borderRadius: 4, margin: "2px auto", background: b.color, animation: `ssblockFall${i} 0.6s forwards` }} />
              ))}
            </div>
          )}
          {/* Dog */}
          {dogIn && (
            <div style={{ position: "absolute", right: "10%", bottom: "28%", zIndex: 6, animation: dogBumped ? "ssdogBump 0.4s ease" : "ssslideInRight 0.6s ease" }}>
              {dogBumped && (
                <div style={{ position: "absolute", bottom: "100%", right: 0, marginBottom: 6, zIndex: 20 }}>
                  <SpeechBubble text="어?" />
                </div>
              )}
              <PuppySVG size={80} />
            </div>
          )}
          {m3Phase >= 5 && (
            <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", textAlign: "center", zIndex: 30 }}>
              <p style={{ color: "white", fontSize: 13, marginBottom: 10 }}>장면이 끝났어요. 질문에 답해볼까?</p>
              <button onClick={() => setStage("m3-q1")} style={{ padding: "12px 28px", borderRadius: 24, background: "linear-gradient(135deg,#1a3a8f,#7c3aed)", color: "white", fontSize: 14, fontWeight: 800, cursor: "pointer", border: "none" }}>
                질문 보기 ▶
              </button>
            </div>
          )}
          <button onClick={() => setStage("m3-q1")} style={{ position: "absolute", top: 14, right: 14, zIndex: 30, ...btnOverlay }}>건너뛰기 ▶</button>
        </FullScreen>
      </>
    );
  }

  // ── M3 Q1 ─────────────────────────────────────────────────────────────────────
  if (stage === "m3-q1") {
    const opts = [
      { k: "A", text: "내가 만든 것을 망가뜨리려고 일부러 그랬어." },
      { k: "B", text: "지나가다가 실수로 부딪혔을 수도 있어." },
      { k: "C", text: "아직 왜 그랬는지 잘 모르겠어." },
      { k: "D", text: "나와 장난치려고 했을 수도 있어." },
    ];
    return (
      <>
        <GameStyles />
        <FullScreen bg={SPACE_BG}>
          <StarField speed={1} />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", zIndex: 10 }}>
            <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 16, padding: "12px 18px", marginBottom: 16, textAlign: "center", maxWidth: 320 }}>
              <p style={{ color: "#FDE68A", fontSize: 11, fontWeight: 700, marginBottom: 6 }}>미션 3 · 질문 1 / 2</p>
              <p style={{ color: "white", fontSize: 15, fontWeight: 800, lineHeight: 1.5 }}>강아지는 왜 부딪혔을까?</p>
            </div>
            <div style={{ marginBottom: 12 }}><PuppySVG size={70} /></div>
            <div style={{ width: "100%", maxWidth: 340, display: "flex", flexDirection: "column", gap: 10 }}>
              {opts.map(o => (
                <button key={o.k} onClick={() => {
                  setSelectedOpt(o.k);
                  recordAndAdvance("m3q1", o.k, "m3-q2");
                }}
                  style={{ padding: "13px 18px", borderRadius: 14, background: selectedOpt === o.k ? "rgba(99,179,237,0.3)" : "rgba(255,255,255,0.1)", border: selectedOpt === o.k ? "2px solid #7DD3FC" : "1.5px solid rgba(255,255,255,0.3)", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left", lineHeight: 1.4 }}>
                  <span style={{ fontWeight: 800, marginRight: 6 }}>{o.k}.</span>{o.text}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => setStage("m3-q2")} style={{ position: "absolute", top: 14, right: 14, zIndex: 30, ...btnOverlay }}>건너뛰기 ▶</button>
        </FullScreen>
      </>
    );
  }

  // ── M3 Q2 ─────────────────────────────────────────────────────────────────────
  if (stage === "m3-q2") {
    const opts = [
      { k: "A", text: '"무슨 일이야? 왜 부딪혔어?"' },
      { k: "B", text: '"너 때문에 다 망했잖아!"' },
      { k: "C", text: '"속상한데, 같이 다시 만들어 줄래?"' },
      { k: "D", text: "아무 말 없이 다른 곳으로 이동한다." },
      { k: "E", text: "강아지가 만든 것도 무너뜨린다." },
    ];
    return (
      <>
        <GameStyles />
        <FullScreen bg={SPACE_BG}>
          <StarField speed={1} />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", zIndex: 10 }}>
            <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 16, padding: "12px 18px", marginBottom: 14, textAlign: "center", maxWidth: 320 }}>
              <p style={{ color: "#FDE68A", fontSize: 11, fontWeight: 700, marginBottom: 6 }}>미션 3 · 질문 2 / 2</p>
              <p style={{ color: "white", fontSize: 15, fontWeight: 800, lineHeight: 1.5 }}>네가 이런 상황이라면 어떻게 할래?</p>
            </div>
            {selectedOpt && (
              <div style={{ marginBottom: 10, background: "rgba(255,255,255,0.15)", borderRadius: 14, padding: "8px 14px", maxWidth: 280, animation: "ssbubblePop 0.35s ease" }}>
                <p style={{ color: "white", fontSize: 12 }}>💬 {opts.find(o => o.k === selectedOpt)?.text}</p>
              </div>
            )}
            <div style={{ width: "100%", maxWidth: 340, display: "flex", flexDirection: "column", gap: 9 }}>
              {opts.map(o => (
                <button key={o.k} onClick={() => {
                  setSelectedOpt(o.k);
                  recordAndAdvance("m3q2", o.k, "m3-outcome", 1000);
                }}
                  style={{ padding: "12px 18px", borderRadius: 14, background: selectedOpt === o.k ? "rgba(99,179,237,0.3)" : "rgba(255,255,255,0.1)", border: selectedOpt === o.k ? "2px solid #7DD3FC" : "1.5px solid rgba(255,255,255,0.3)", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left", lineHeight: 1.4 }}>
                  <span style={{ fontWeight: 800, marginRight: 6 }}>{o.k}.</span>{o.text}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => setStage("m3-outcome")} style={{ position: "absolute", top: 14, right: 14, zIndex: 30, ...btnOverlay }}>건너뛰기 ▶</button>
        </FullScreen>
      </>
    );
  }

  // ── M3 OUTCOME ───────────────────────────────────────────────────────────────
  if (stage === "m3-outcome") {
    const q2 = data.m3q2 || selectedOpt;
    const outcomes: Record<string, { emoji: string; desc: string; dogMood?: string }> = {
      A: { emoji: "😊", desc: '강아지가 "어, 미안해! 내가 실수한 것 같아..." 라고 했어요.', dogMood: "apologetic" },
      B: { emoji: "😟", desc: "강아지가 움츠러들어요.", dogMood: "sad" },
      C: { emoji: "🧱", desc: "강아지가 블록을 주워 같이 쌓아줘요 🧱", dogMood: "happy" },
      D: { emoji: "🚶", desc: "조용히 자리를 옮겨요.", dogMood: "neutral" },
      E: { emoji: "⚠️", desc: "⚠️ 상황이 더 복잡해졌어요.", dogMood: "scared" },
    };
    const outcome = outcomes[q2] ?? outcomes["B"];
    return (
      <>
        <GameStyles />
        <FullScreen bg="linear-gradient(180deg,#1a1a2e 0%,#16213e 60%,#0f3460 100%)">
          <StarField speed={1} />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24, zIndex: 10, animation: "ssfadeInUp 0.6s ease" }}>
            <div style={{ fontSize: 48 }}>{outcome.emoji}</div>
            <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 16, padding: "14px 20px", maxWidth: 300, textAlign: "center" }}>
              <p style={{ color: "white", fontSize: 14, fontWeight: 700, lineHeight: 1.6 }}>{outcome.desc}</p>
            </div>
            <div style={{ display: "flex", gap: 20, alignItems: "flex-end" }}>
              <PandaSVG size={80} />
              <PuppySVG size={80} celebrating={q2 === "C"} />
            </div>
          </div>
        </FullScreen>
      </>
    );
  }

  // ── RESULT CHILD ─────────────────────────────────────────────────────────────
  if (stage === "result-child") {
    return (
      <>
        <GameStyles />
        <FullScreen bg="radial-gradient(ellipse at 50% 40%, #0a1a4a 0%, #030818 70%)">
          <StarField speed={1} />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: 28, zIndex: 10, animation: "ssfadeInUp 0.8s ease", textAlign: "center" }}>
            <div style={{ fontSize: 64, animation: "sscelebrate 0.5s ease-in-out infinite alternate" }}>🏆</div>
            <h2 style={{ color: "white", fontSize: 26, fontWeight: 900, margin: 0, letterSpacing: "-0.02em", textShadow: "0 0 40px rgba(100,180,255,0.8)" }}>
              우주 탐험 완료!
            </h2>
            <p style={{ color: "#7DD3FC", fontSize: 14, margin: 0 }}>세 가지 미션을 모두 해냈어요!</p>
            <div style={{ display: "flex", gap: 16 }}>
              {["M1 🌟", "M2 🌟", "M3 🌟"].map((label, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.1)", border: "2px solid rgba(255,255,255,0.3)", borderRadius: 12, padding: "10px 14px", color: "white", fontSize: 13, fontWeight: 700 }}>
                  {label}
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 16, padding: "12px 18px", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 24 }}>🤝</span>
              <div style={{ textAlign: "left" }}>
                <p style={{ color: "#FDE68A", fontSize: 13, fontWeight: 800, margin: 0 }}>관계 고수 뱃지 획득!</p>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, margin: 0 }}>사회 팩 완료</p>
              </div>
            </div>
            <button onClick={() => setStage("result-detail")} style={{ padding: "10px 22px", borderRadius: 20, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.3)", color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 700, cursor: "pointer", marginTop: 8 }}>
              결과 확인하기 (발표용)
            </button>
          </div>
        </FullScreen>
      </>
    );
  }

  // ── RESULT DETAIL ────────────────────────────────────────────────────────────
  if (stage === "result-detail") {
    const d = data;
    type InterpTag = { label: string; color: string; bg: string };
    function tag(label: string, type: "good" | "ok" | "warn"): InterpTag {
      return type === "good"
        ? { label, color: "#16a34a", bg: "#dcfce7" }
        : type === "ok"
        ? { label, color: "#d97706", bg: "#fef3c7" }
        : { label, color: "#dc2626", bg: "#fee2e2" };
    }
    const m1q1Interp = d.m1q1 === "B" ? tag("✅ 복합정서 이해", "good") : d.m1q1 === "C" ? tag("⚠️ 적대적 귀인", "warn") : tag("△ 단순 이해", "ok");
    const m1q3Interp = d.m1q3 === "B" ? tag("✅ 감정 공감", "good") : d.m1q3 === "A" ? tag("△ 위로", "ok") : tag("⚠️ 회피/무시", "warn");
    const m2q1Interp = d.m2q1 === "red" ? tag("✅ 판다 믿음 이해", "good") : tag("⚠️ 자기중심적 반응", "warn");
    const m2q2Interp = d.m2q2 === "blue" ? tag("✅ 정확", "good") : tag("△ 부정확", "ok");
    const m2q3Interp = d.m2q3 === "A" ? tag("✅ 이해", "good") : tag("⚠️ 불이해", "warn");
    const m3q1Interp = d.m3q1 === "A" ? tag("⚠️ 적대적 귀인", "warn") : d.m3q1 === "B" || d.m3q1 === "C" ? tag("✅ 중립/불확실", "good") : tag("△ 장난", "ok");
    const m3q2Interp = d.m3q2 === "A" || d.m3q2 === "C" ? tag("✅ 친사회적", "good") : d.m3q2 === "B" ? tag("△ 단호", "ok") : d.m3q2 === "D" ? tag("△ 회피", "ok") : tag("⚠️ 보복", "warn");

    function InterpBadge({ t }: { t: InterpTag }) {
      return <span style={{ background: t.bg, color: t.color, fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10, whiteSpace: "nowrap" }}>{t.label}</span>;
    }
    function TimeMs({ ms }: { ms: number | undefined }) {
      return <span style={{ color: "#6b7280", fontSize: 11 }}>{ms !== undefined ? `${ms}ms` : "—"}</span>;
    }

    return (
      <>
        <GameStyles />
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "white", overflowY: "auto", padding: "20px 16px 48px", fontFamily: "system-ui, sans-serif" }}>
          <div style={{ maxWidth: 480, margin: "0 auto" }}>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: "#1a1a2e", marginBottom: 4 }}>우주 탐험 미션 — 발표용 결과</h1>
            <p style={{ color: "#6b7280", fontSize: 12, marginBottom: 24 }}>Social Cognition Assessment — Prototype</p>

            {/* Mission 1 */}
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
              <h2 style={{ fontSize: 14, fontWeight: 800, color: "#1a1a2e", marginBottom: 10 }}>미션 1 — 웃고 있지만 속상한 친구</h2>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <tbody>
                  <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "6px 4px", color: "#374151", fontWeight: 600, width: "40%" }}>복합정서 이해 (Q1)</td>
                    <td style={{ padding: "6px 4px" }}><span style={{ fontWeight: 700 }}>{d.m1q1 || "—"}</span></td>
                    <td style={{ padding: "6px 4px" }}><InterpBadge t={m1q1Interp} /></td>
                    <td style={{ padding: "6px 4px" }}><TimeMs ms={d.times.m1q1} /></td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "6px 4px", color: "#374151", fontWeight: 600 }}>비언어적 단서 (Q2)</td>
                    <td colSpan={2} style={{ padding: "6px 4px" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {d.m1q2.length > 0 ? d.m1q2.map(c => (
                          <span key={c} style={{ background: "#dbeafe", color: "#1d4ed8", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10 }}>{c}</span>
                        )) : <span style={{ color: "#9ca3af" }}>선택 없음</span>}
                      </div>
                    </td>
                    <td style={{ padding: "6px 4px" }}><TimeMs ms={d.times.m1q2} /></td>
                  </tr>
                  <tr>
                    <td style={{ padding: "6px 4px", color: "#374151", fontWeight: 600 }}>공감 반응 (Q3)</td>
                    <td style={{ padding: "6px 4px" }}><span style={{ fontWeight: 700 }}>{d.m1q3 || "—"}</span></td>
                    <td style={{ padding: "6px 4px" }}><InterpBadge t={m1q3Interp} /></td>
                    <td style={{ padding: "6px 4px" }}><TimeMs ms={d.times.m1q3} /></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mission 2 */}
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
              <h2 style={{ fontSize: 14, fontWeight: 800, color: "#1a1a2e", marginBottom: 10 }}>미션 2 — 사라진 우주 열쇠</h2>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <tbody>
                  <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "6px 4px", color: "#374151", fontWeight: 600, width: "40%" }}>조망수용/틀린믿음 (Q1)</td>
                    <td style={{ padding: "6px 4px" }}><span style={{ fontWeight: 700 }}>{d.m2q1 === "red" ? "🔴 빨간" : d.m2q1 === "blue" ? "🔵 파란" : "—"}</span></td>
                    <td style={{ padding: "6px 4px" }}><InterpBadge t={m2q1Interp} /></td>
                    <td style={{ padding: "6px 4px" }}><TimeMs ms={d.times.m2q1} /></td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "6px 4px", color: "#374151", fontWeight: 600 }}>실제 위치 파악 (Q2)</td>
                    <td style={{ padding: "6px 4px" }}><span style={{ fontWeight: 700 }}>{d.m2q2 === "red" ? "🔴 빨간" : d.m2q2 === "blue" ? "🔵 파란" : "—"}</span></td>
                    <td style={{ padding: "6px 4px" }}><InterpBadge t={m2q2Interp} /></td>
                    <td style={{ padding: "6px 4px" }}><TimeMs ms={d.times.m2q2} /></td>
                  </tr>
                  <tr>
                    <td style={{ padding: "6px 4px", color: "#374151", fontWeight: 600 }}>틀린믿음 이해 (Q3)</td>
                    <td style={{ padding: "6px 4px" }}><span style={{ fontWeight: 700 }}>{d.m2q3 || "—"}</span></td>
                    <td style={{ padding: "6px 4px" }}><InterpBadge t={m2q3Interp} /></td>
                    <td style={{ padding: "6px 4px" }}><TimeMs ms={d.times.m2q3} /></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mission 3 */}
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
              <h2 style={{ fontSize: 14, fontWeight: 800, color: "#1a1a2e", marginBottom: 10 }}>미션 3 — 무너진 우주선 모형</h2>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <tbody>
                  <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "6px 4px", color: "#374151", fontWeight: 600, width: "40%" }}>귀인 유형 (Q1)</td>
                    <td style={{ padding: "6px 4px" }}><span style={{ fontWeight: 700 }}>{d.m3q1 || "—"}</span></td>
                    <td style={{ padding: "6px 4px" }}><InterpBadge t={m3q1Interp} /></td>
                    <td style={{ padding: "6px 4px" }}><TimeMs ms={d.times.m3q1} /></td>
                  </tr>
                  <tr>
                    <td style={{ padding: "6px 4px", color: "#374151", fontWeight: 600 }}>대응 행동 (Q2)</td>
                    <td style={{ padding: "6px 4px" }}><span style={{ fontWeight: 700 }}>{d.m3q2 || "—"}</span></td>
                    <td style={{ padding: "6px 4px" }}><InterpBadge t={m3q2Interp} /></td>
                    <td style={{ padding: "6px 4px" }}><TimeMs ms={d.times.m3q2} /></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Disclaimer */}
            <div style={{ background: "#fef9c3", border: "1px solid #fde047", borderRadius: 10, padding: "10px 14px", marginBottom: 20 }}>
              <p style={{ color: "#713f12", fontSize: 11, fontWeight: 600, margin: 0, lineHeight: 1.6 }}>
                ⚠️ 발표용 프로토타입으로, 실제 검사 활용을 위해 신뢰도 및 타당도 검증이 필요합니다.
              </p>
            </div>

            <button onClick={handleReset} style={{ width: "100%", padding: "14px", borderRadius: 12, background: "linear-gradient(135deg,#1a3a8f,#7c3aed)", color: "white", fontSize: 15, fontWeight: 800, cursor: "pointer", border: "none" }}>
              처음으로 돌아가기 🔄
            </button>
          </div>
        </div>
      </>
    );
  }

  return null;
}
