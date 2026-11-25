"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { saveBadge } from "@/lib/badges";
import { type SocialSkill, type ResponseRecord, saveSocialResponse } from "@/lib/gameResults";

type GameStage =
  | "warp-start" | "warp-traveling" | "video-playing" | "landing" | "dialogue"
  | "character-select" | "story-intro" | "scene" | "result";
type SkillScores = Record<SocialSkill, number>;

interface Character { id: string; name: string; trait: string; color: string; bg: string; }
interface StoryChoice { text: string; feedback: string; skills: SocialSkill[]; }
interface StoryScene {
  id: number; title: string; bgGradient: string; groundColor: string;
  npcType: 1 | 2; npcSpeech: string; question: string; choices: StoryChoice[];
}

function saveResponse(record: ResponseRecord) { saveSocialResponse(record); }
function generateId() { return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }

// ── SVG: Panda ───────────────────────────────────────────────────────────────
function PandaSVG({ size = 100, animate = false }: { size?: number; animate?: boolean }) {
  const star = "0,-11 2.5,-3.4 10.5,-3.4 4.1,1.3 6.5,9 0,4.5 -6.5,9 -4.1,1.3 -10.5,-3.4 -2.5,-3.4";
  return (
    <svg width={size} height={Math.round(size * 1.1)} viewBox="0 0 100 110" className={animate ? "animate-float" : ""}>
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

// ── SVG: Rabbit ───────────────────────────────────────────────────────────────
function RabbitSVG({ size = 100, animate = false }: { size?: number; animate?: boolean }) {
  return (
    <svg width={size} height={Math.round(size * 1.15)} viewBox="0 0 100 115" className={animate ? "animate-float-delay" : ""}>
      <ellipse cx="50" cy="112" rx="26" ry="5" fill="rgba(0,0,0,0.12)" />
      <ellipse cx="50" cy="80" rx="26" ry="28" fill="#F5F0E8" />
      <ellipse cx="50" cy="82" rx="15" ry="18" fill="#FFF5E8" />
      <ellipse cx="25" cy="78" rx="8" ry="12" fill="#E8E0D0" transform="rotate(15 25 78)" />
      <ellipse cx="75" cy="78" rx="8" ry="12" fill="#E8E0D0" transform="rotate(-15 75 78)" />
      <ellipse cx="38" cy="105" rx="10" ry="8" fill="#E8E0D0" />
      <ellipse cx="62" cy="105" rx="10" ry="8" fill="#E8E0D0" />
      <ellipse cx="31" cy="10" rx="10" ry="23" fill="#E8C85A" transform="rotate(-8 31 10)" />
      <ellipse cx="69" cy="10" rx="10" ry="23" fill="#E8C85A" transform="rotate(8 69 10)" />
      <ellipse cx="31" cy="11" rx="6" ry="17" fill="#D4A843" transform="rotate(-8 31 11)" />
      <ellipse cx="69" cy="11" rx="6" ry="17" fill="#D4A843" transform="rotate(8 69 11)" />
      <circle cx="50" cy="46" r="28" fill="#F5F0E8" />
      <circle cx="38" cy="44" r="7" fill="white" />
      <circle cx="62" cy="44" r="7" fill="white" />
      <circle cx="39" cy="44" r="4.5" fill="#2d2d2d" />
      <circle cx="63" cy="44" r="4.5" fill="#2d2d2d" />
      <circle cx="40.5" cy="42.5" r="1.6" fill="white" />
      <circle cx="64.5" cy="42.5" r="1.6" fill="white" />
      <circle cx="38" cy="44" r="10" fill="none" stroke="#E53E3E" strokeWidth="2.5" />
      <circle cx="62" cy="44" r="10" fill="none" stroke="#E53E3E" strokeWidth="2.5" />
      <line x1="48" y1="44" x2="52" y2="44" stroke="#E53E3E" strokeWidth="2.2" />
      <line x1="12" y1="41" x2="28" y2="42" stroke="#E53E3E" strokeWidth="2" />
      <line x1="72" y1="42" x2="88" y2="41" stroke="#E53E3E" strokeWidth="2" />
      <ellipse cx="50" cy="53" rx="4" ry="3" fill="#FFB7C5" />
      <path d="M45,57 Q50,62 55,57" stroke="#bbb" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="26" cy="53" r="7" fill="#FFB7C5" opacity="0.42" />
      <circle cx="74" cy="53" r="7" fill="#FFB7C5" opacity="0.42" />
    </svg>
  );
}

// ── SVG: Cat ──────────────────────────────────────────────────────────────────
function CatSVG({ size = 100, animate = false }: { size?: number; animate?: boolean }) {
  return (
    <svg width={size} height={Math.round(size * 1.1)} viewBox="0 0 100 110" className={animate ? "animate-float-slow" : ""}>
      <ellipse cx="50" cy="107" rx="26" ry="5" fill="rgba(0,0,0,0.12)" />
      <ellipse cx="50" cy="78" rx="26" ry="27" fill="#8B9099" />
      <ellipse cx="50" cy="80" rx="15" ry="17" fill="#A8B0B8" />
      <ellipse cx="24" cy="76" rx="8" ry="12" fill="#78808A" transform="rotate(18 24 76)" />
      <ellipse cx="76" cy="76" rx="8" ry="12" fill="#78808A" transform="rotate(-18 76 76)" />
      <ellipse cx="38" cy="102" rx="10" ry="8" fill="#78808A" />
      <ellipse cx="62" cy="102" rx="10" ry="8" fill="#78808A" />
      <circle cx="50" cy="40" r="29" fill="#8B9099" />
      <polygon points="18,22 28,3 40,22" fill="#8B9099" />
      <polygon points="60,22 72,3 82,22" fill="#8B9099" />
      <polygon points="22,20 28,8 36,20" fill="#E8A0A8" />
      <polygon points="64,20 72,8 78,20" fill="#E8A0A8" />
      <ellipse cx="36" cy="40" rx="11" ry="13" fill="#1A1A2E" />
      <ellipse cx="64" cy="40" rx="11" ry="13" fill="#1A1A2E" />
      <circle cx="39" cy="36" r="3" fill="white" opacity="0.65" />
      <circle cx="67" cy="36" r="3" fill="white" opacity="0.65" />
      <ellipse cx="50" cy="51" rx="4" ry="3" fill="#E8A0A8" />
      <path d="M45,55 Q50,60 55,55" stroke="#787080" strokeWidth="2" fill="none" strokeLinecap="round" />
      <line x1="12" y1="50" x2="38" y2="53" stroke="#aaa" strokeWidth="1" opacity="0.7" />
      <line x1="12" y1="55" x2="38" y2="55" stroke="#aaa" strokeWidth="1" opacity="0.7" />
      <line x1="62" y1="53" x2="88" y2="50" stroke="#aaa" strokeWidth="1" opacity="0.7" />
      <line x1="62" y1="55" x2="88" y2="55" stroke="#aaa" strokeWidth="1" opacity="0.7" />
    </svg>
  );
}

// ── SVG: Puppy ────────────────────────────────────────────────────────────────
function PuppySVG({ size = 100, animate = false }: { size?: number; animate?: boolean }) {
  return (
    <svg width={size} height={Math.round(size * 1.1)} viewBox="0 0 100 110" className={animate ? "animate-float-delay2" : ""}>
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
      <path d="M44,53 Q50,59 56,53" stroke="#A07840" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="27" cy="50" r="7" fill="#FFB7C5" opacity="0.42" />
      <circle cx="73" cy="50" r="7" fill="#FFB7C5" opacity="0.42" />
    </svg>
  );
}

// ── SVG: Pink Alien NPC ───────────────────────────────────────────────────────
function PinkAlienSVG({ size = 80, happy = false }: { size?: number; happy?: boolean }) {
  return (
    <svg width={size} height={Math.round(size * 1.3)} viewBox="0 0 80 104">
      <ellipse cx="40" cy="101" rx="20" ry="4" fill="rgba(0,0,0,0.12)" />
      <ellipse cx="40" cy="72" rx="22" ry="24" fill="#F472B6" />
      <ellipse cx="40" cy="74" rx="13" ry="15" fill="#FDE68A" opacity="0.9" />
      <ellipse cx="19" cy="70" rx="7" ry="11" fill="#EC4899" transform="rotate(15 19 70)" />
      <ellipse cx="61" cy="70" rx="7" ry="11" fill="#EC4899" transform="rotate(-15 61 70)" />
      <ellipse cx="32" cy="93" rx="8" ry="8" fill="#EC4899" />
      <ellipse cx="48" cy="93" rx="8" ry="8" fill="#EC4899" />
      <circle cx="40" cy="38" r="27" fill="#F472B6" />
      <line x1="30" y1="12" x2="22" y2="2" stroke="#EC4899" strokeWidth="3" strokeLinecap="round" />
      <circle cx="22" cy="2" r="4.5" fill="#F9A8D4" />
      <line x1="50" y1="12" x2="58" y2="2" stroke="#EC4899" strokeWidth="3" strokeLinecap="round" />
      <circle cx="58" cy="2" r="4.5" fill="#F9A8D4" />
      <ellipse cx="30" cy="36" rx="9" ry="10" fill="#1A1A2E" />
      <ellipse cx="50" cy="36" rx="9" ry="10" fill="#1A1A2E" />
      <circle cx="32" cy="33" r="3" fill="white" opacity="0.7" />
      <circle cx="52" cy="33" r="3" fill="white" opacity="0.7" />
      <ellipse cx="19" cy="43" rx="7" ry="5" fill="#FDE68A" opacity="0.8" />
      <ellipse cx="61" cy="43" rx="7" ry="5" fill="#FDE68A" opacity="0.8" />
      {happy ? (
        <path d="M33,48 Q40,55 47,48" stroke="#BE185D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      ) : (
        <>
          <path d="M33,51 Q40,47 47,51" stroke="#BE185D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M29,46 Q27,52 29,55" stroke="#93C5FD" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M51,46 Q53,52 51,55" stroke="#93C5FD" strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

// ── SVG: Green Mouse NPC ──────────────────────────────────────────────────────
function GreenMouseSVG({ size = 80, happy = false }: { size?: number; happy?: boolean }) {
  return (
    <svg width={size} height={Math.round(size * 1.3)} viewBox="0 0 80 104">
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
      <circle cx="33" cy="37" r="8" fill="white" />
      <circle cx="47" cy="37" r="8" fill="white" />
      <circle cx="34" cy="37" r="5.5" fill="#6B4226" />
      <circle cx="48" cy="37" r="5.5" fill="#6B4226" />
      <circle cx="35.5" cy="35" r="2" fill="white" />
      <circle cx="49.5" cy="35" r="2" fill="white" />
      <line x1="28" y1="31" x2="31" y2="28" stroke="#6B4226" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="33" y1="30" x2="33" y2="27" stroke="#6B4226" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="43" y1="30" x2="43" y2="27" stroke="#6B4226" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="48" y1="31" x2="45" y2="28" stroke="#6B4226" strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="40" cy="47" rx="4" ry="3" fill="#FFB7C5" />
      {happy ? (
        <path d="M34,51 Q40,57 46,51" stroke="#B09080" strokeWidth="2" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M34,54 Q40,50 46,54" stroke="#B09080" strokeWidth="2" fill="none" strokeLinecap="round" />
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

// ── Helpers ───────────────────────────────────────────────────────────────────
function Stars() {
  const pts: [number, number][] = [
    [8, 10], [22, 5], [35, 18], [48, 8], [60, 14], [75, 6], [88, 20],
    [14, 32], [70, 28], [82, 42], [5, 55], [45, 38], [90, 55],
    [28, 65], [60, 52], [78, 70], [15, 78], [42, 72], [55, 85], [90, 88],
  ];
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
      {pts.map(([x, y], i) => (
        <circle key={i} cx={`${x}%`} cy={`${y}%`} r={i % 4 === 0 ? 1.6 : i % 3 === 0 ? 1.2 : 0.8}
          fill="white" opacity={0.3 + (i % 6) * 0.1} />
      ))}
    </svg>
  );
}

function SpeechBubble({ text }: { text: string }) {
  return (
    <div style={{
      position: "relative", background: "rgba(255,255,255,0.95)", borderRadius: 14,
      padding: "8px 12px", fontSize: 11.5, color: "#333", maxWidth: 155,
      boxShadow: "0 4px 14px rgba(0,0,0,0.18)", lineHeight: 1.45, fontWeight: 600,
    }}>
      {text}
      <div style={{
        position: "absolute", bottom: -9, left: 18, width: 0, height: 0,
        borderLeft: "9px solid transparent", borderRight: "9px solid transparent",
        borderTop: "9px solid rgba(255,255,255,0.95)",
      }} />
    </div>
  );
}

function Hill({ cx, cy, rx, ry, fill }: { cx: number; cy: number; rx: number; ry: number; fill: string }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={fill} />;
}

// ── Star Field (deterministic, no hydration issues) ───────────────────────────
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
          position: "absolute",
          left: "50%", top: "50%",
          width: r.w,
          height: `${r.h}vh`,
          marginLeft: -r.w / 2,
          marginTop: 0,
          background: "linear-gradient(to bottom, transparent 0%, rgba(160,220,255,0.9) 50%, transparent 100%)",
          transformOrigin: "50% 0%",
          transform: `rotate(${r.angle}deg)`,
          animation: `sswarpRay 1.3s ${r.delay}s cubic-bezier(0.3,0,0.6,1) forwards`,
          opacity: 0,
        }} />
      ))}
      <div style={{
        position: "absolute",
        left: "50%", top: "50%",
        width: 280, height: 280,
        marginLeft: -140, marginTop: -140,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(140,210,255,0.5) 35%, transparent 70%)",
        animation: "sswarpCore 1.3s cubic-bezier(0.25,0,0.6,1) forwards",
      }} />
    </div>
  );
}

// ── All CSS keyframes (ss prefix to avoid conflicts) ─────────────────────────
function GameStyles() {
  return (
    <style>{`
      @keyframes sstwinkle {
        0%,100% { opacity:0.2; transform:scale(0.85); }
        50% { opacity:1; transform:scale(1.3); }
      }
      @keyframes sswarpRay {
        0% { opacity:0; transform:rotate(var(--dummy,0)) scaleY(0.05); }
        30% { opacity:0.9; }
        100% { opacity:0; transform:rotate(var(--dummy,0)) scaleY(1); }
      }
      @keyframes sswarpCore {
        0% { transform:scale(0.05); opacity:0; }
        50% { transform:scale(1); opacity:1; }
        100% { transform:scale(7); opacity:0; }
      }
      @keyframes sswarpFlash {
        0%,40% { opacity:0; }
        75% { opacity:1; }
        100% { opacity:1; }
      }
      @keyframes ssfadeOut {
        from { opacity:1; }
        to { opacity:0; }
      }
      @keyframes sslandShake {
        0%,100% { transform:translate(0,0) rotate(0deg); }
        8% { transform:translate(-12px,6px) rotate(-0.6deg); }
        18% { transform:translate(12px,-6px) rotate(0.6deg); }
        28% { transform:translate(-9px,9px) rotate(-0.4deg); }
        38% { transform:translate(9px,-9px) rotate(0.4deg); }
        48% { transform:translate(-5px,4px) rotate(-0.2deg); }
        58% { transform:translate(5px,-4px) rotate(0.2deg); }
        68% { transform:translate(-2px,2px); }
        80% { transform:translate(2px,-2px); }
      }
      @keyframes sscharSlideUp {
        from { transform:translateY(110px) scale(0.9); opacity:0; }
        to { transform:translateY(0) scale(1); opacity:1; }
      }
      @keyframes ssspeakBounce {
        0%,100% { transform:translateY(0); }
        50% { transform:translateY(-9px); }
      }
      @keyframes ssbubblePop {
        0% { transform:scale(0.5) translateY(10px); opacity:0; }
        65% { transform:scale(1.06) translateY(-2px); opacity:1; }
        100% { transform:scale(1) translateY(0); opacity:1; }
      }
      @keyframes ssglowPulse {
        0%,100% {
          box-shadow:0 0 25px rgba(100,180,255,0.5), 0 0 60px rgba(100,180,255,0.2),
                     inset 0 0 20px rgba(100,180,255,0.1);
        }
        50% {
          box-shadow:0 0 50px rgba(100,180,255,0.9), 0 0 120px rgba(100,180,255,0.5),
                     0 0 200px rgba(100,180,255,0.2), inset 0 0 40px rgba(100,180,255,0.2);
        }
      }
      @keyframes ssfadeIn {
        from { opacity:0; }
        to { opacity:1; }
      }
      @keyframes ssfadeInUp {
        from { opacity:0; transform:translateY(22px); }
        to { opacity:1; transform:translateY(0); }
      }
      @keyframes ssfloatTitle {
        0%,100% { transform:translateY(0); }
        50% { transform:translateY(-8px); }
      }
      @keyframes shipFloat { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-14px) rotate(2deg)} }
      @keyframes slideUp { from{transform:translateY(60px);opacity:0} to{transform:translateY(0);opacity:1} }
      @keyframes fadeInText { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
      .ship-float { animation: shipFloat 3s ease-in-out infinite; }
      .slide-up { animation: slideUp 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards; }
      .fade-text { animation: fadeInText 0.7s ease 0.4s both; }
    `}</style>
  );
}

// ── Small overlay button style ────────────────────────────────────────────────
const btnOverlay: React.CSSProperties = {
  padding: "6px 14px",
  borderRadius: 20,
  background: "rgba(255,255,255,0.14)",
  border: "1.5px solid rgba(255,255,255,0.35)",
  color: "white",
  fontSize: 11,
  fontWeight: 700,
  cursor: "pointer",
  backdropFilter: "blur(4px)",
};

// ── Game Data ─────────────────────────────────────────────────────────────────
const CHARACTERS: Character[] = [
  { id: "panda",  name: "판다",   trait: "용감한 탐험가",    color: "#FF6EB4", bg: "#FFF0F7" },
  { id: "rabbit", name: "토끼",   trait: "호기심 많은 과학자", color: "#E53E3E", bg: "#FFF5F5" },
  { id: "cat",    name: "고양이", trait: "차분한 관찰자",     color: "#6B7280", bg: "#F3F4F6" },
  { id: "puppy",  name: "강아지", trait: "따뜻한 도우미",     color: "#D97706", bg: "#FFFBEB" },
];

const DIALOGUE = [
  { charId: "panda",  line: "어? 여기는 어디지?" },
  { charId: "rabbit", line: "잠깐, 저기 또 다른 친구가 있어!" },
  { charId: "cat",    line: "너도 우리랑 같이 떨어진 거야?" },
  { charId: "puppy",  line: "우리랑 같이 이곳을 탐험하지 않을래?" },
];

const SCENES: StoryScene[] = [
  {
    id: 1, title: "1/6 · 첫 번째 만남 🪐",
    bgGradient: "linear-gradient(180deg,#0D0820 0%,#1A1340 55%,#2D1B69 100%)",
    groundColor: "#1a0a40", npcType: 1,
    npcSpeech: "흑흑... (울고 있어)",
    question: "🤔 작은 외계인이 나무 뒤에 숨어 울고 있어. 너라면 어떻게 할 것 같아?",
    choices: [
      { text: "🗣️ \"안녕? 무슨 일이야? 내가 도와줄 수 있어!\"", feedback: "외계인이 조심스럽게 고개를 들어. 말을 걸어줘서 고마워하는 것 같아 😊", skills: ["prosocial", "emotion"] },
      { text: "🤲 말없이 조용히 옆에 앉아서 같이 있어 준다", feedback: "외계인이 울음을 멈추고 살며시 너를 쳐다봐. 혼자가 아닌 느낌에 안심한 것 같아 🌸", skills: ["prosocial", "emotion"] },
      { text: "🤔 \"왜 울까?\" 혼자 이유를 생각해 본다", feedback: "외계인의 가방을 꽉 쥔 걸 보니 뭔가 소중한 걸 지키려는 것 같아 🧐", skills: ["perspective", "emotion"] },
    ],
  },
  {
    id: 2, title: "2/6 · 길을 찾아라 🗺️",
    bgGradient: "linear-gradient(180deg,#0C1A3B 0%,#1E3A6B 55%,#0A5C7F 100%)",
    groundColor: "#0a3b55", npcType: 2,
    npcSpeech: "?! ?? ?!... ☝️",
    question: "🗺️ 친구가 붙잡힌 곳을 찾아야 해! 외계인에게 길을 물어봤는데 말이 전혀 안 통해.",
    choices: [
      { text: "✏️ 땅에 그림을 그려서 설명한다", feedback: "외계인이 그림을 보고 눈을 반짝이며 방향을 가리켜! 🎨", skills: ["conflict", "perspective"] },
      { text: "👀 외계인의 표정과 몸짓을 열심히 살펴본다", feedback: "몸짓만으로도 많은 걸 말하고 있었구나 ✨", skills: ["emotion", "perspective"] },
      { text: "🤝 1장면 외계인을 데려와 도움을 받는다", feedback: "친절하게 대해줬더니 도움이 돌아왔어 💫", skills: ["prosocial", "conflict"] },
    ],
  },
  {
    id: 3, title: "3/6 · 같이 놀고 싶어 🎈",
    bgGradient: "linear-gradient(180deg,#0A3B2C 0%,#145236 55%,#2E7D32 100%)",
    groundColor: "#0d3a1e", npcType: 1,
    npcSpeech: "\"너는 우리랑 달라서 안 돼!\"",
    question: "😢 외계 아이들이 같이 놀기를 거부해. 어떻게 할까?",
    choices: [
      { text: "😄 \"나도 같이 하면 더 재밌을 거야! 한 번만 해보자!\"", feedback: "외계 아이들이 \"그래, 한 번 해봐\" 하고 자리를 내줘 🎉", skills: ["conflict", "prosocial"] },
      { text: "🤔 \"왜 나는 안 돼? 이유를 말해줄 수 있어?\"", feedback: "\"처음엔 꼭 인사를 먼저 해야 해\" 라고 알려줘 💡", skills: ["perspective", "emotion"] },
      { text: "🎈 혼자 옆에서 비슷한 놀이를 하다가 자연스럽게 어울린다", feedback: "외계 아이들이 먼저 말을 걸어와 🌈", skills: ["prosocial", "conflict"] },
    ],
  },
  {
    id: 4, title: "4/6 · 도움이 필요해요 💙",
    bgGradient: "linear-gradient(180deg,#2B0B0B 0%,#7B1818 55%,#C0392B 100%)",
    groundColor: "#4a0e0e", npcType: 1,
    npcSpeech: "도와줘! 엄마가 아파!",
    question: "💙 드디어 친구 근처야! 작은 외계인 아이가 엄마가 아프다고 외쳐. 어떻게 할까?",
    choices: [
      { text: "⚡ 얼른 친구를 구하고 바로 돌아와서 엄마를 도와준다", feedback: "친구도 구하고, 약속대로 돌아와서 엄마도 도와줬어 🏃", skills: ["conflict", "prosocial"] },
      { text: "🤙 \"10분 뒤에 꼭 돌아올게! 여기서 기다려!\"", feedback: "외계인 아이가 고개를 끄덕여 💪", skills: ["conflict", "prosocial"] },
      { text: "💙 \"많이 무서웠겠다. 엄마는 어디가 아파?\" 먼저 위로한다", feedback: "먼저 마음을 받아줘서 고마워했어 🌷", skills: ["emotion", "prosocial"] },
    ],
  },
  {
    id: 5, title: "5/6 · 대장과의 협상 👑",
    bgGradient: "linear-gradient(180deg,#0D0820 0%,#2D1B69 55%,#4A1870 100%)",
    groundColor: "#1e0a40", npcType: 1,
    npcSpeech: "\"비밀을 알려주면 친구를 돌려주겠다\"",
    question: "👑 외계인 대장이 조건을 걸었어. 어떻게 할까?",
    choices: [
      { text: "🙅 \"안 돼! 다른 방법은 없어?\"", feedback: "\"그렇다면 다른 거래를 생각해볼 수도 있겠지\" 🤝", skills: ["conflict", "perspective"] },
      { text: "🧐 \"왜 그 비밀이 필요해? 이유를 먼저 말해줘\"", feedback: "\"사실 우리 별이 위험해서...\" 라고 털어놔 💬", skills: ["perspective", "emotion"] },
      { text: "💡 \"내가 너희에게 도움이 될 다른 걸 줄 수 있어!\"", feedback: "눈을 빛내며 \"오! 그것도 나쁘지 않은데?\" ✨", skills: ["conflict", "prosocial"] },
    ],
  },
  {
    id: 6, title: "6/6 · 드디어 구출! 🎊",
    bgGradient: "linear-gradient(180deg,#1A0A30 0%,#3D1A5C 40%,#6B2FA0 100%)",
    groundColor: "#2d0a50", npcType: 2,
    npcSpeech: "\"빨리 출발하자!!\"",
    question: "🎊 친구를 구출했어! 그런데 돌아가는 방법을 두고 의견이 달라.",
    choices: [
      { text: "🏃 친구 말대로 빨리 출발한다", feedback: "친구가 환하게 웃어. 더 가까워진 것 같아 💕", skills: ["prosocial", "emotion"] },
      { text: "🗣️ \"외계 친구들에게 작별 인사하고 가고 싶어\" 솔직히 말한다", feedback: "친구가 \"그래\" 하며 같이 인사해줘 🌟", skills: ["perspective", "conflict"] },
      { text: "⏱️ \"5분 안에 인사하고 같이 출발하자!\"", feedback: "둘 다 웃으며 고개를 끄덕여 🎉", skills: ["conflict", "perspective"] },
    ],
  },
];

const SKILL_INFO: Record<SocialSkill, { label: string; color: string }> = {
  emotion:     { label: "감정 인식", color: "#FF9F43" },
  perspective: { label: "조망수용",  color: "#A29BFE" },
  prosocial:   { label: "친사회성", color: "#54A0FF" },
  conflict:    { label: "갈등 해결", color: "#00B894" },
};
const PROFILES: Record<SocialSkill, { type: string; emoji: string; desc: string }> = {
  emotion:     { type: "감정 탐정형",     emoji: "🔍", desc: "친구의 마음을 잘 읽어내는 타입이야!" },
  perspective: { type: "다리 놓기형",     emoji: "🌟", desc: "상대방 입장에서 생각하는 타입이야!" },
  prosocial:   { type: "씩씩한 도우미형", emoji: "💪", desc: "먼저 나서서 도와주는 용감한 타입이야!" },
  conflict:    { type: "문제 해결사형",   emoji: "🎯", desc: "어려운 상황을 슬기롭게 푸는 타입이야!" },
};
const MAX_SCORES: SkillScores = { emotion: 6, perspective: 5, prosocial: 6, conflict: 5 };
const SKILL_ORDER: SocialSkill[] = ["emotion", "perspective", "prosocial", "conflict"];

function renderChar(id: string, size: number, animate = false) {
  if (id === "panda")  return <PandaSVG size={size} animate={animate} />;
  if (id === "rabbit") return <RabbitSVG size={size} animate={animate} />;
  if (id === "cat")    return <CatSVG size={size} animate={animate} />;
  return <PuppySVG size={size} animate={animate} />;
}
function renderNPC(type: 1 | 2, size: number, happy: boolean) {
  if (type === 1) return <PinkAlienSVG size={size} happy={happy} />;
  return <GreenMouseSVG size={size} happy={happy} />;
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function SocialStoryGame() {
  const [stage, setStage]           = useState<GameStage>("warp-start");
  const [muted, setMuted]           = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [dialogueIdx, setDialogueIdx] = useState(0);
  const [landingPhase, setLandingPhase] = useState<"shake" | "settle">("shake");
  const [character, setCharacter]   = useState<Character | null>(null);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [chosenIdx, setChosenIdx]   = useState<number | null>(null);
  const [scores, setScores]         = useState<SkillScores>({ emotion: 0, perspective: 0, prosocial: 0, conflict: 0 });
  const [entered, setEntered]       = useState(false);
  const [npcHappy, setNpcHappy]     = useState(false);
  const [fading, setFading]         = useState(false);
  const sessionId  = useRef("");
  const sceneStart = useRef(0);
  const videoRef   = useRef<HTMLVideoElement>(null);

  // respect system preference
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduceMotion(true);
    }
  }, []);

  // warp-traveling: auto-advance to video after animation
  useEffect(() => {
    if (stage !== "warp-traveling") return;
    if (reduceMotion) { setStage("video-playing"); return; }
    const t = setTimeout(() => setStage("video-playing"), 1700);
    return () => clearTimeout(t);
  }, [stage, reduceMotion]);

  // video-playing: trigger play
  useEffect(() => {
    if (stage !== "video-playing") return;
    const v = videoRef.current;
    if (!v) { setStage("landing"); return; }
    v.muted = muted;
    v.play().catch(() => { setVideoError(true); setStage("landing"); });
  }, [stage]); // eslint-disable-line react-hooks/exhaustive-deps

  // landing: phase transitions
  useEffect(() => {
    if (stage !== "landing") return;
    setLandingPhase("shake");
    const t1 = setTimeout(() => setLandingPhase("settle"), 1300);
    const t2 = setTimeout(() => { setStage("dialogue"); setDialogueIdx(0); }, 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [stage]);

  // dialogue: auto-advance first 3 lines, hold on last
  useEffect(() => {
    if (stage !== "dialogue" || dialogueIdx >= DIALOGUE.length - 1) return;
    const t = setTimeout(() => setDialogueIdx(i => i + 1), 3200);
    return () => clearTimeout(t);
  }, [stage, dialogueIdx]);

  // scene entry animation
  useEffect(() => {
    if (stage !== "scene") return;
    setEntered(false); setNpcHappy(false);
    sceneStart.current = Date.now();
    const t = setTimeout(() => setEntered(true), 60);
    return () => clearTimeout(t);
  }, [stage, sceneIndex]);

  function skipToCharSelect() { setStage("character-select"); }

  function handleWarpStart() {
    if (reduceMotion) { setStage("video-playing"); }
    else { setStage("warp-traveling"); }
  }

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    if (videoRef.current) videoRef.current.muted = next;
  }

  function selectCharacter(c: Character) { setCharacter(c); setStage("story-intro"); }
  function startStory() { sessionId.current = generateId(); setStage("scene"); }

  function handleChoice(idx: number) {
    if (chosenIdx !== null) return;
    const scene = SCENES[sceneIndex];
    const choice = scene.choices[idx];
    const ms = Date.now() - sceneStart.current;
    setScores(prev => { const n = { ...prev }; choice.skills.forEach(s => { n[s] += 1; }); return n; });
    setNpcHappy(true); setChosenIdx(idx);
    saveResponse({
      sessionId: sessionId.current, characterId: character?.id ?? "",
      sceneId: scene.id, sceneTitle: scene.title,
      choiceIdx: idx, choiceText: choice.text,
      reactionTimeMs: ms, skillsAwarded: choice.skills,
      timestamp: new Date().toISOString(),
    });
  }

  function handleNext() {
    setFading(true);
    setTimeout(() => {
      if (sceneIndex + 1 < SCENES.length) { setSceneIndex(i => i + 1); setChosenIdx(null); }
      else { saveBadge({ id: "social-master", packName: "사회", label: "관계 고수", emoji: "🤝" }); setStage("result"); }
      setFading(false);
    }, 280);
  }

  function handleReset() {
    setStage("warp-start");
    setMuted(true); setVideoError(false); setDialogueIdx(0); setLandingPhase("shake");
    setCharacter(null); setSceneIndex(0); setChosenIdx(null);
    setScores({ emotion: 0, perspective: 0, prosocial: 0, conflict: 0 });
    setEntered(false); setNpcHappy(false); setFading(false);
  }

  function getDominant(): SocialSkill {
    return SKILL_ORDER.reduce((best, s) =>
      scores[s] / MAX_SCORES[s] > scores[best] / MAX_SCORES[best] ? s : best, SKILL_ORDER[0]);
  }

  // ── WARP START ──────────────────────────────────────────────────────────────
  if (stage === "warp-start") {
    return (
      <>
        <GameStyles />
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "radial-gradient(ellipse at 50% 60%, #0a0f2e 0%, #030818 60%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexDirection: "column", overflow: "hidden",
        }}>
          <StarField speed={1} />

          {/* Top controls */}
          <div style={{ position: "absolute", top: 14, left: 14, right: 14, display: "flex", justifyContent: "space-between", zIndex: 20 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={toggleMute} style={btnOverlay}>{muted ? "🔇" : "🔊"}</button>
              <button onClick={() => setReduceMotion(r => !r)} style={btnOverlay} title="움직임 줄이기">
                {reduceMotion ? "✦ 줄임" : "♿"}
              </button>
            </div>
            <button onClick={skipToCharSelect} style={btnOverlay}>건너뛰기 ▶</button>
          </div>

          {/* Center content */}
          <div style={{
            position: "relative", zIndex: 10, textAlign: "center",
            animation: "ssfadeInUp 1s ease both",
          }}>
            {/* Spaceship icon, floating */}
            <div style={{
              marginBottom: 20,
              animation: "ssfloatTitle 3s ease-in-out infinite",
              display: "inline-block",
            }}>
              <SpaceshipSVG size={160} />
            </div>

            <h2 style={{
              fontSize: 30, fontWeight: 900, color: "white",
              letterSpacing: "-0.03em", margin: "0 0 6px",
              textShadow: "0 0 40px rgba(100,180,255,0.8), 0 2px 20px rgba(0,0,0,0.5)",
            }}>
              우주 모험
            </h2>
            <p style={{ color: "#7DD3FC", fontSize: 13.5, margin: "0 0 36px" }}>
              낯선 별에서 친구들을 만나 함께 탐험해요
            </p>

            {/* Start button */}
            <button
              onClick={handleWarpStart}
              style={{
                padding: "16px 44px",
                borderRadius: 50,
                background: "linear-gradient(135deg, #1a3a8f 0%, #2563eb 50%, #60a5fa 100%)",
                border: "2px solid rgba(147,197,253,0.6)",
                color: "white",
                fontSize: 17, fontWeight: 900,
                cursor: "pointer",
                animation: "ssglowPulse 2.4s ease-in-out infinite",
                letterSpacing: "-0.01em",
                display: "block", margin: "0 auto",
              }}
            >
              ✨ 우주여행 시작하기
            </button>
            <p style={{ color: "#374151", fontSize: 11, marginTop: 14 }}>
              버튼을 누르면 우주 모험이 시작돼요
            </p>
          </div>

          {/* Peeking characters at bottom */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            display: "flex", justifyContent: "center", gap: 16, alignItems: "flex-end",
            animation: "ssfadeInUp 1.3s 0.6s ease both",
            opacity: 0,
          }}>
            {["panda", "rabbit", "cat", "puppy"].map((id, i) => (
              <div key={id} style={{
                opacity: 0.5 + i * 0.08,
                transform: `scale(0.55) translateY(${10 + i * 4}px)`,
              }}>
                {renderChar(id, 80)}
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  // ── WARP TRAVELING ──────────────────────────────────────────────────────────
  if (stage === "warp-traveling") {
    return (
      <>
        <GameStyles />
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "#030818", overflow: "hidden",
        }}>
          <StarField speed={8} />
          <WarpBurst />

          {/* White flash at the end */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 20,
            background: "white", opacity: 0,
            animation: "sswarpFlash 0.6s 1.1s ease-in forwards",
            pointerEvents: "none",
          }} />
        </div>
      </>
    );
  }

  // ── VIDEO PLAYING ───────────────────────────────────────────────────────────
  if (stage === "video-playing") {
    return (
      <>
        <GameStyles />
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "black", overflow: "hidden",
        }}>
          {!videoError ? (
            <video
              ref={videoRef}
              src="/videos/space-intro.mp4.mp4"
              playsInline
              muted={muted}
              onEnded={() => setStage("landing")}
              onError={() => { setVideoError(true); setStage("landing"); }}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            /* Fallback: skip straight through */
            <div style={{ display: "none" }} />
          )}

          {/* Fade from black at start */}
          <div style={{
            position: "absolute", inset: 0, background: "black",
            animation: "ssfadeOut 0.7s 0.1s ease forwards",
            pointerEvents: "none", zIndex: 5,
          }} />

          {/* Controls */}
          <div style={{ position: "absolute", top: 14, left: 14, right: 14, display: "flex", justifyContent: "space-between", zIndex: 10 }}>
            <button onClick={toggleMute} style={btnOverlay}>{muted ? "🔇" : "🔊"}</button>
            <button onClick={skipToCharSelect} style={btnOverlay}>건너뛰기 ▶</button>
          </div>
        </div>
      </>
    );
  }

  // ── LANDING ─────────────────────────────────────────────────────────────────
  if (stage === "landing") {
    return (
      <>
        <GameStyles />
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "#030818", overflow: "hidden",
          animation: landingPhase === "shake" && !reduceMotion
            ? "sslandShake 1.2s ease-in-out"
            : "none",
        }}>
          <StarField speed={1} />

          {/* Planet surface */}
          {landingPhase === "settle" && (
            <>
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: "42%",
                background: "linear-gradient(180deg, #1a0940 0%, #2D1B69 45%, #3c2080 100%)",
                borderRadius: "120% 120% 0 0 / 28% 28% 0 0",
                animation: "ssfadeIn 1.3s ease forwards",
              }} />
              {/* Atmospheric glow */}
              <div style={{
                position: "absolute", bottom: "38%", left: "50%",
                width: "85%", height: 70,
                transform: "translateX(-50%)",
                background: "radial-gradient(ellipse, rgba(100,60,220,0.45) 0%, transparent 70%)",
                animation: "ssfadeIn 1.5s 0.2s ease both",
                opacity: 0,
              }} />
            </>
          )}

          {/* Landing text */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column", gap: 14,
          }}>
            {landingPhase === "shake" ? (
              <>
                <div style={{ fontSize: 46 }}>💥</div>
                <p style={{
                  color: "white", fontSize: 17, fontWeight: 900,
                  textShadow: "0 0 24px rgba(255,120,80,0.9)",
                  letterSpacing: "-0.01em",
                }}>충돌! 비상착륙!</p>
              </>
            ) : (
              <div style={{ animation: "ssfadeInUp 0.9s 0.3s ease both", opacity: 0, textAlign: "center" }}>
                <div style={{ fontSize: 42, marginBottom: 10 }}>🛸</div>
                <p style={{ color: "#C4B5FD", fontSize: 15, fontWeight: 700 }}>
                  낯선 별에 착륙했어요...
                </p>
              </div>
            )}
          </div>

          <button onClick={skipToCharSelect} style={{ position: "absolute", top: 14, right: 14, zIndex: 20, ...btnOverlay }}>
            건너뛰기 ▶
          </button>
        </div>
      </>
    );
  }

  // ── DIALOGUE ─────────────────────────────────────────────────────────────────
  if (stage === "dialogue") {
    const isLast   = dialogueIdx >= DIALOGUE.length - 1;
    const speaker  = DIALOGUE[dialogueIdx];
    const charIds  = ["panda", "rabbit", "cat", "puppy"] as const;

    return (
      <>
        <GameStyles />
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "linear-gradient(180deg, #030818 0%, #0d0820 55%, #1a0a40 100%)",
          overflow: "hidden",
          animation: "ssfadeIn 0.9s ease",
        }}>
          <StarField speed={1} />

          {/* Planet surface */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "36%",
            background: "linear-gradient(180deg, #1a0940 0%, #2D1B69 50%, #3c2080 100%)",
            borderRadius: "100% 100% 0 0 / 18% 18% 0 0",
          }} />
          <div style={{
            position: "absolute", bottom: "32%", left: "50%",
            width: "95%", height: 55,
            transform: "translateX(-50%)",
            background: "radial-gradient(ellipse, rgba(100,60,220,0.4) 0%, transparent 70%)",
          }} />

          {/* Characters row */}
          <div style={{
            position: "absolute", bottom: 110, left: 0, right: 0,
            display: "flex", justifyContent: "center", gap: 10, alignItems: "flex-end",
            padding: "0 12px",
          }}>
            {charIds.map((id, i) => {
              const isSpeaker = speaker.charId === id;
              return (
                <div key={id} style={{
                  position: "relative",
                  display: "flex", flexDirection: "column", alignItems: "center",
                  transform: isSpeaker
                    ? "translateY(-14px) scale(1.14)"
                    : "translateY(0) scale(0.84)",
                  transition: "transform 0.45s cubic-bezier(0.34,1.56,0.64,1), filter 0.45s ease",
                  filter: isSpeaker
                    ? "drop-shadow(0 0 14px rgba(140,190,255,0.7))"
                    : "brightness(0.45)",
                  animation: isSpeaker
                    ? `ssspeakBounce 2s ease-in-out infinite, sscharSlideUp 0.65s ${i * 0.1}s cubic-bezier(0.34,1.56,0.64,1) both`
                    : `sscharSlideUp 0.65s ${i * 0.1}s cubic-bezier(0.34,1.56,0.64,1) both`,
                  zIndex: isSpeaker ? 10 : 5,
                }}>
                  {/* Speech bubble */}
                  {isSpeaker && (
                    <div style={{
                      position: "absolute",
                      bottom: 88,
                      left: "50%",
                      zIndex: 20,
                    }}>
                      <div style={{
                        animation: "ssbubblePop 0.35s ease-out forwards",
                        transformOrigin: "50% 100%",
                      }}>
                        <div style={{
                          background: "white",
                          borderRadius: 16,
                          padding: "9px 14px",
                          fontSize: 12.5,
                          fontWeight: 800,
                          color: "#1a1a2e",
                          boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
                          whiteSpace: "nowrap",
                          maxWidth: 190,
                          textAlign: "center",
                          lineHeight: 1.4,
                          transform: "translateX(-50%)",
                          position: "relative",
                        }}>
                          {speaker.line}
                          <div style={{
                            position: "absolute", bottom: -9, left: "50%",
                            transform: "translateX(-50%)",
                            width: 0, height: 0,
                            borderLeft: "9px solid transparent",
                            borderRight: "9px solid transparent",
                            borderTop: "9px solid white",
                          }} />
                        </div>
                      </div>
                    </div>
                  )}
                  {renderChar(id, 72)}
                </div>
              );
            })}
          </div>

          {/* Dialogue progress dots */}
          <div style={{
            position: "absolute", bottom: 88, left: 0, right: 0,
            display: "flex", justifyContent: "center", gap: 7,
          }}>
            {DIALOGUE.map((_, i) => (
              <div key={i} style={{
                width: i === dialogueIdx ? 22 : 7, height: 7,
                borderRadius: 4,
                background: i <= dialogueIdx ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.25)",
                transition: "all 0.35s ease",
              }} />
            ))}
          </div>

          {/* Action button */}
          <div style={{
            position: "absolute", bottom: 24, left: "50%",
            transform: "translateX(-50%)",
            animation: "ssfadeInUp 0.6s 0.5s ease both",
            opacity: 0,
          }}>
            {isLast ? (
              <button
                onClick={() => setStage("character-select")}
                style={{
                  padding: "14px 38px",
                  borderRadius: 50,
                  background: "linear-gradient(135deg, #1a3a8f, #7c3aed)",
                  border: "2px solid rgba(147,197,253,0.5)",
                  color: "white",
                  fontSize: 15, fontWeight: 900,
                  cursor: "pointer",
                  boxShadow: "0 0 35px rgba(120,80,255,0.5)",
                  whiteSpace: "nowrap",
                }}
              >
                같이 탐험하러 가자! 🚀
              </button>
            ) : (
              <button
                onClick={() => setDialogueIdx(i => i + 1)}
                style={{
                  padding: "11px 32px",
                  borderRadius: 50,
                  background: "rgba(255,255,255,0.12)",
                  border: "2px solid rgba(255,255,255,0.4)",
                  color: "white",
                  fontSize: 13.5, fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                계속 ▶
              </button>
            )}
          </div>

          {/* Skip */}
          <button onClick={skipToCharSelect} style={{ position: "absolute", top: 14, right: 14, zIndex: 30, ...btnOverlay }}>
            건너뛰기 ▶
          </button>
        </div>
      </>
    );
  }

  // ── CHARACTER SELECT ─────────────────────────────────────────────────────────
  if (stage === "character-select") {
    return (
      <div>
        <div className="rounded-3xl px-5 py-5 mb-5 text-center"
          style={{ background: "linear-gradient(135deg,#0D0820 0%,#2D1B69 100%)", position: "relative", overflow: "hidden" }}>
          <Stars />
          <div style={{ position: "relative", zIndex: 1 }}>
            <p className="text-xl font-black text-white mb-1">이제 시작해볼까? 🚀</p>
            <p style={{ color: "#C4B5FD", fontSize: 13 }}>함께 모험할 캐릭터를 골라봐!</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {CHARACTERS.map((c, i) => (
            <button key={c.id} onClick={() => selectCharacter(c)}
              className="rounded-3xl pt-4 pb-4 px-3 text-center shadow-sm transition-transform active:scale-95 hover:scale-105"
              style={{ background: c.bg, border: `3px solid ${c.color}50` }}>
              <div className="flex justify-center mb-1" style={{ animationDelay: `${i * 0.3}s` }}>
                {renderChar(c.id, 86, true)}
              </div>
              <p className="text-sm font-black mt-1" style={{ color: c.color }}>{c.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{c.trait}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── STORY INTRO ──────────────────────────────────────────────────────────────
  if (stage === "story-intro" && character) {
    return (
      <div>
        <div className="rounded-3xl px-6 py-6 mb-5 text-center"
          style={{ background: "linear-gradient(135deg,#0D0820 0%,#2D1B69 100%)", position: "relative", overflow: "hidden" }}>
          <Stars />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="flex justify-center mb-3">{renderChar(character.id, 110, true)}</div>
            <p className="text-xl font-black text-white">{character.name}</p>
            <p style={{ color: "#C4B5FD", fontSize: 12, marginTop: 4 }}>{character.trait}</p>
          </div>
        </div>
        <div className="rounded-3xl px-5 py-5 mb-5" style={{ background: "#F8F9FF", border: "2px solid #E0E7FF" }}>
          <p className="text-sm leading-relaxed text-gray-600">
            🚀 <span className="font-bold" style={{ color: character.color }}>{character.name}</span>은 우주를 탐험하다 갑자기 엔진이 고장났어!
          </p>
          <p className="text-sm leading-relaxed text-gray-600 mt-3">
            🪐 낯선 별에 불시착했는데, 친구 <span className="font-bold">다미</span>가 외계인에게 붙잡혀 버렸어!
          </p>
          <p className="text-sm leading-relaxed text-gray-600 mt-3">
            💫 다미를 구출하려면 이 별의 외계인들과 잘 지내야 해. 준비됐어?
          </p>
        </div>
        <button onClick={startStory} className="btn-main w-full py-4 rounded-2xl text-white font-black text-base"
          style={{ background: `linear-gradient(135deg,${character.color},#A29BFE)` }}>
          탐험 시작! 🚀
        </button>
      </div>
    );
  }

  // ── SCENE ────────────────────────────────────────────────────────────────────
  if (stage === "scene" && character) {
    const scene = SCENES[sceneIndex];
    return (
      <div style={{ opacity: fading ? 0 : 1, transition: "opacity 0.28s ease" }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ color: character.color, background: character.bg }}>{scene.title}</span>
        </div>
        <div className="rounded-3xl mb-4 overflow-hidden"
          style={{ background: scene.bgGradient, height: 220, position: "relative" }}>
          <Stars />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 60,
            background: scene.groundColor, borderRadius: "60% 60% 0 0 / 30% 30% 0 0",
          }} />
          <div style={{
            position: "absolute", bottom: 24, left: 16,
            transform: entered ? "translateX(0)" : "translateX(-130px)",
            transition: "transform 0.55s cubic-bezier(0.34,1.56,0.64,1)", zIndex: 2,
          }}>
            {renderChar(character.id, 82)}
          </div>
          <div style={{
            position: "absolute", bottom: 18, right: 12,
            transform: entered ? "translateX(0)" : "translateX(130px)",
            transition: "transform 0.55s cubic-bezier(0.34,1.56,0.64,1) 0.1s",
            zIndex: 2, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6,
          }}>
            {entered && <div className="animate-pop"><SpeechBubble text={scene.npcSpeech} /></div>}
            {renderNPC(scene.npcType, 70, npcHappy)}
          </div>
        </div>
        <div className="rounded-2xl px-4 py-3 mb-3" style={{ background: "#F8F9FF", border: "2px solid #E0E7FF" }}>
          <p className="text-sm text-gray-700 leading-relaxed font-semibold text-center">{scene.question}</p>
        </div>
        <div className="flex flex-col gap-2.5 mb-3">
          {scene.choices.map((choice, idx) => {
            const chosen   = chosenIdx === idx;
            const disabled = chosenIdx !== null;
            return (
              <button key={idx} onClick={() => handleChoice(idx)} disabled={disabled}
                className="rounded-2xl px-4 py-3.5 text-left text-sm font-semibold shadow-sm transition-all"
                style={{
                  background: chosen ? character.bg : "#fff",
                  border: chosen ? `2px solid ${character.color}` : "2px solid #E5EAF0",
                  color: chosen ? character.color : "#444",
                  opacity: disabled && !chosen ? 0.38 : 1,
                  transform: chosen ? "scale(1.01)" : "scale(1)",
                }}>
                {choice.text}
              </button>
            );
          })}
        </div>
        {chosenIdx !== null && (
          <div className="animate-pop">
            <div className="rounded-2xl px-4 py-3.5 mb-3"
              style={{ background: character.bg, border: `2px solid ${character.color}50` }}>
              <p className="text-sm text-gray-600 leading-relaxed">
                {SCENES[sceneIndex].choices[chosenIdx].feedback}
              </p>
            </div>
            <button onClick={handleNext} className="btn-main w-full py-4 rounded-2xl text-white font-black text-base"
              style={{ background: `linear-gradient(135deg,${character.color},#A29BFE)` }}>
              {sceneIndex + 1 < SCENES.length ? "계속하기 →" : "결과 보기! 🎊"}
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── RESULT ───────────────────────────────────────────────────────────────────
  if (stage === "result" && character) {
    const dominant = getDominant();
    const profile  = PROFILES[dominant];
    return (
      <div>
        <div className="rounded-3xl px-6 py-6 mb-4 text-center animate-pop"
          style={{ background: "linear-gradient(135deg,#0D0820 0%,#2D1B69 100%)", position: "relative", overflow: "hidden" }}>
          <Stars />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="text-5xl mb-2">{profile.emoji}</div>
            <p className="text-xl font-black text-white">{profile.type}</p>
            <p style={{ color: "#C4B5FD", fontSize: 13, marginTop: 4 }}>{profile.desc}</p>
          </div>
        </div>
        <div className="rounded-3xl px-5 py-5 mb-4" style={{ background: "#F8F9FF", border: "2px solid #E0E7FF" }}>
          <p className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wide">사회성 프로필</p>
          {SKILL_ORDER.map(skill => {
            const info = SKILL_INFO[skill];
            const pct  = Math.round((scores[skill] / MAX_SCORES[skill]) * 100);
            return (
              <div key={skill} className="mb-4">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold" style={{ color: info.color }}>{info.label}</span>
                  <span className="text-xs font-bold" style={{ color: info.color }}>{pct}%</span>
                </div>
                <div className="h-3.5 rounded-full overflow-hidden" style={{ background: "#E5EAF0" }}>
                  <div className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: info.color, transition: "width 0.9s cubic-bezier(0.34,1.56,0.64,1)" }} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="rounded-3xl px-5 py-4 mb-4 text-center"
          style={{ background: "#F0F8FF", border: "2px solid #54A0FF30" }}>
          <div className="text-4xl mb-1">🏅</div>
          <p className="text-base font-black text-blue-400">관계 고수 뱃지 획득!</p>
          <p className="text-xs text-gray-400 mt-1">우주 모험을 무사히 완수했어요</p>
        </div>
        <button onClick={handleReset}
          className="w-full py-4 rounded-2xl font-black text-base transition-transform active:scale-95 hover:scale-105"
          style={{ background: "#EEF5FF", color: "#54A0FF", border: "2px solid #54A0FF30" }}>
          다시 하기 🔄
        </button>
      </div>
    );
  }

  return null;
}
