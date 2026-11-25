"use client";
import { useState, useEffect, useRef } from "react";
import { saveBadge } from "@/lib/badges";
import { type SocialSkill, type ResponseRecord, saveSocialResponse } from "@/lib/gameResults";

type GameStage = "intro" | "character-select" | "story-intro" | "scene" | "result";
type SkillScores = Record<SocialSkill, number>;

interface Character { id: string; name: string; trait: string; color: string; bg: string; }
interface StoryChoice { text: string; feedback: string; skills: SocialSkill[]; }
interface StoryScene {
  id: number; title: string; bgGradient: string; groundColor: string;
  npcType: 1 | 2; npcSpeech: string; question: string; choices: StoryChoice[];
}

// ── Storage ──────────────────────────────────────────────────────────────────
function saveResponse(record: ResponseRecord) {
  saveSocialResponse(record);
}
function generateId() { return `${Date.now()}-${Math.random().toString(36).slice(2,8)}`; }

// ── SVG: Panda (별 눈패치, 핑크 하트) ────────────────────────────────────────
function PandaSVG({ size = 100, animate = false }: { size?: number; animate?: boolean }) {
  const star = "0,-11 2.5,-3.4 10.5,-3.4 4.1,1.3 6.5,9 0,4.5 -6.5,9 -4.1,1.3 -10.5,-3.4 -2.5,-3.4";
  return (
    <svg width={size} height={Math.round(size*1.1)} viewBox="0 0 100 110" className={animate?"animate-float":""}>
      <ellipse cx="50" cy="107" rx="28" ry="5" fill="rgba(0,0,0,0.12)"/>
      <ellipse cx="50" cy="78" rx="28" ry="27" fill="white"/>
      <ellipse cx="50" cy="80" rx="17" ry="18" fill="#f5f5f5"/>
      {/* heart bib */}
      <path d="M42,67 C42,61 50,65 50,65 C50,65 58,61 58,67 C58,73 50,78 50,78 C50,78 42,73 42,67 Z" fill="#FF6EB4"/>
      <ellipse cx="23" cy="75" rx="9" ry="13" fill="#111" transform="rotate(18 23 75)"/>
      <ellipse cx="77" cy="75" rx="9" ry="13" fill="#111" transform="rotate(-18 77 75)"/>
      <ellipse cx="38" cy="102" rx="11" ry="8" fill="#111"/>
      <ellipse cx="62" cy="102" rx="11" ry="8" fill="#111"/>
      <circle cx="50" cy="40" r="30" fill="white"/>
      <circle cx="22" cy="13" r="13" fill="#111"/>
      <circle cx="78" cy="13" r="13" fill="#111"/>
      {/* star eye left */}
      <g transform="translate(33,38)"><polygon points={star} fill="#111"/><circle cx="1.5" cy="-2.5" r="2.5" fill="white" opacity="0.65"/></g>
      {/* round eye right */}
      <circle cx="67" cy="38" r="9" fill="white"/>
      <circle cx="68" cy="38" r="6" fill="#111"/>
      <circle cx="70" cy="36" r="2.2" fill="white"/>
      <ellipse cx="50" cy="49" rx="5" ry="3.5" fill="#999"/>
      <path d="M44,54 Q50,60 56,54" stroke="#bbb" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <circle cx="26" cy="49" r="7" fill="#FFB7C5" opacity="0.42"/>
      <circle cx="74" cy="49" r="7" fill="#FFB7C5" opacity="0.42"/>
    </svg>
  );
}

// ── SVG: Rabbit (빨간 안경) ────────────────────────────────────────────────
function RabbitSVG({ size = 100, animate = false }: { size?: number; animate?: boolean }) {
  return (
    <svg width={size} height={Math.round(size*1.15)} viewBox="0 0 100 115" className={animate?"animate-float-delay":""}>
      <ellipse cx="50" cy="112" rx="26" ry="5" fill="rgba(0,0,0,0.12)"/>
      <ellipse cx="50" cy="80" rx="26" ry="28" fill="#F5F0E8"/>
      <ellipse cx="50" cy="82" rx="15" ry="18" fill="#FFF5E8"/>
      <ellipse cx="25" cy="78" rx="8" ry="12" fill="#E8E0D0" transform="rotate(15 25 78)"/>
      <ellipse cx="75" cy="78" rx="8" ry="12" fill="#E8E0D0" transform="rotate(-15 75 78)"/>
      <ellipse cx="38" cy="105" rx="10" ry="8" fill="#E8E0D0"/>
      <ellipse cx="62" cy="105" rx="10" ry="8" fill="#E8E0D0"/>
      {/* long yellow ears */}
      <ellipse cx="31" cy="10" rx="10" ry="23" fill="#E8C85A" transform="rotate(-8 31 10)"/>
      <ellipse cx="69" cy="10" rx="10" ry="23" fill="#E8C85A" transform="rotate(8 69 10)"/>
      <ellipse cx="31" cy="11" rx="6" ry="17" fill="#D4A843" transform="rotate(-8 31 11)"/>
      <ellipse cx="69" cy="11" rx="6" ry="17" fill="#D4A843" transform="rotate(8 69 11)"/>
      <circle cx="50" cy="46" r="28" fill="#F5F0E8"/>
      <circle cx="38" cy="44" r="7" fill="white"/>
      <circle cx="62" cy="44" r="7" fill="white"/>
      <circle cx="39" cy="44" r="4.5" fill="#2d2d2d"/>
      <circle cx="63" cy="44" r="4.5" fill="#2d2d2d"/>
      <circle cx="40.5" cy="42.5" r="1.6" fill="white"/>
      <circle cx="64.5" cy="42.5" r="1.6" fill="white"/>
      {/* red glasses */}
      <circle cx="38" cy="44" r="10" fill="none" stroke="#E53E3E" strokeWidth="2.5"/>
      <circle cx="62" cy="44" r="10" fill="none" stroke="#E53E3E" strokeWidth="2.5"/>
      <line x1="48" y1="44" x2="52" y2="44" stroke="#E53E3E" strokeWidth="2.2"/>
      <line x1="12" y1="41" x2="28" y2="42" stroke="#E53E3E" strokeWidth="2"/>
      <line x1="72" y1="42" x2="88" y2="41" stroke="#E53E3E" strokeWidth="2"/>
      <ellipse cx="50" cy="53" rx="4" ry="3" fill="#FFB7C5"/>
      <path d="M45,57 Q50,62 55,57" stroke="#bbb" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <circle cx="26" cy="53" r="7" fill="#FFB7C5" opacity="0.42"/>
      <circle cx="74" cy="53" r="7" fill="#FFB7C5" opacity="0.42"/>
    </svg>
  );
}

// ── SVG: Cat (큰 아몬드 눈) ───────────────────────────────────────────────
function CatSVG({ size = 100, animate = false }: { size?: number; animate?: boolean }) {
  return (
    <svg width={size} height={Math.round(size*1.1)} viewBox="0 0 100 110" className={animate?"animate-float-slow":""}>
      <ellipse cx="50" cy="107" rx="26" ry="5" fill="rgba(0,0,0,0.12)"/>
      <ellipse cx="50" cy="78" rx="26" ry="27" fill="#8B9099"/>
      <ellipse cx="50" cy="80" rx="15" ry="17" fill="#A8B0B8"/>
      <ellipse cx="24" cy="76" rx="8" ry="12" fill="#78808A" transform="rotate(18 24 76)"/>
      <ellipse cx="76" cy="76" rx="8" ry="12" fill="#78808A" transform="rotate(-18 76 76)"/>
      <ellipse cx="38" cy="102" rx="10" ry="8" fill="#78808A"/>
      <ellipse cx="62" cy="102" rx="10" ry="8" fill="#78808A"/>
      <circle cx="50" cy="40" r="29" fill="#8B9099"/>
      {/* pointy ears */}
      <polygon points="18,22 28,3 40,22" fill="#8B9099"/>
      <polygon points="60,22 72,3 82,22" fill="#8B9099"/>
      <polygon points="22,20 28,8 36,20" fill="#E8A0A8"/>
      <polygon points="64,20 72,8 78,20" fill="#E8A0A8"/>
      {/* large almond dark eyes */}
      <ellipse cx="36" cy="40" rx="11" ry="13" fill="#1A1A2E"/>
      <ellipse cx="64" cy="40" rx="11" ry="13" fill="#1A1A2E"/>
      <circle cx="39" cy="36" r="3" fill="white" opacity="0.65"/>
      <circle cx="67" cy="36" r="3" fill="white" opacity="0.65"/>
      <ellipse cx="50" cy="51" rx="4" ry="3" fill="#E8A0A8"/>
      <path d="M45,55 Q50,60 55,55" stroke="#787080" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <line x1="12" y1="50" x2="38" y2="53" stroke="#aaa" strokeWidth="1" opacity="0.7"/>
      <line x1="12" y1="55" x2="38" y2="55" stroke="#aaa" strokeWidth="1" opacity="0.7"/>
      <line x1="62" y1="53" x2="88" y2="50" stroke="#aaa" strokeWidth="1" opacity="0.7"/>
      <line x1="62" y1="55" x2="88" y2="55" stroke="#aaa" strokeWidth="1" opacity="0.7"/>
    </svg>
  );
}

// ── SVG: Puppy (굵은 눈썹) ───────────────────────────────────────────────
function PuppySVG({ size = 100, animate = false }: { size?: number; animate?: boolean }) {
  return (
    <svg width={size} height={Math.round(size*1.1)} viewBox="0 0 100 110" className={animate?"animate-float-delay2":""}>
      <ellipse cx="50" cy="107" rx="26" ry="5" fill="rgba(0,0,0,0.12)"/>
      <ellipse cx="50" cy="78" rx="26" ry="27" fill="#E8C88A"/>
      <ellipse cx="50" cy="80" rx="14" ry="16" fill="#F0D8A8"/>
      <circle cx="50" cy="74" r="2.5" fill="#C4A060"/><circle cx="50" cy="82" r="2.5" fill="#C4A060"/>
      <ellipse cx="24" cy="76" rx="8" ry="12" fill="#D4A843" transform="rotate(18 24 76)"/>
      <ellipse cx="76" cy="76" rx="8" ry="12" fill="#D4A843" transform="rotate(-18 76 76)"/>
      <ellipse cx="38" cy="102" rx="10" ry="8" fill="#D4A843"/>
      <ellipse cx="62" cy="102" rx="10" ry="8" fill="#D4A843"/>
      <circle cx="50" cy="40" r="28" fill="#E8C88A"/>
      {/* floppy ears */}
      <ellipse cx="22" cy="46" rx="12" ry="20" fill="#C4A060" transform="rotate(-8 22 46)"/>
      <ellipse cx="78" cy="46" rx="12" ry="20" fill="#C4A060" transform="rotate(8 78 46)"/>
      <ellipse cx="22" cy="47" rx="7" ry="15" fill="#B08840" transform="rotate(-8 22 47)"/>
      <ellipse cx="78" cy="47" rx="7" ry="15" fill="#B08840" transform="rotate(8 78 47)"/>
      <circle cx="38" cy="39" r="8" fill="white"/>
      <circle cx="62" cy="39" r="8" fill="white"/>
      <circle cx="39" cy="39" r="5.5" fill="#333"/>
      <circle cx="63" cy="39" r="5.5" fill="#333"/>
      <circle cx="41" cy="37" r="2" fill="white"/>
      <circle cx="65" cy="37" r="2" fill="white"/>
      {/* strong eyebrows */}
      <path d="M31,31 Q38,27 45,30" stroke="#A07840" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M55,30 Q62,27 69,31" stroke="#A07840" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <ellipse cx="50" cy="50" rx="11" ry="8" fill="#F0D8A8"/>
      <ellipse cx="50" cy="47" rx="5" ry="3.5" fill="#333"/>
      <path d="M44,53 Q50,59 56,53" stroke="#A07840" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <circle cx="27" cy="50" r="7" fill="#FFB7C5" opacity="0.42"/>
      <circle cx="73" cy="50" r="7" fill="#FFB7C5" opacity="0.42"/>
    </svg>
  );
}

// ── SVG: Pink Alien NPC (더듬이, 노란 볼) ───────────────────────────────
function PinkAlienSVG({ size = 80, happy = false }: { size?: number; happy?: boolean }) {
  return (
    <svg width={size} height={Math.round(size*1.3)} viewBox="0 0 80 104">
      <ellipse cx="40" cy="101" rx="20" ry="4" fill="rgba(0,0,0,0.12)"/>
      <ellipse cx="40" cy="72" rx="22" ry="24" fill="#F472B6"/>
      <ellipse cx="40" cy="74" rx="13" ry="15" fill="#FDE68A" opacity="0.9"/>
      <ellipse cx="19" cy="70" rx="7" ry="11" fill="#EC4899" transform="rotate(15 19 70)"/>
      <ellipse cx="61" cy="70" rx="7" ry="11" fill="#EC4899" transform="rotate(-15 61 70)"/>
      <ellipse cx="32" cy="93" rx="8" ry="8" fill="#EC4899"/>
      <ellipse cx="48" cy="93" rx="8" ry="8" fill="#EC4899"/>
      <circle cx="40" cy="38" r="27" fill="#F472B6"/>
      <line x1="30" y1="12" x2="22" y2="2" stroke="#EC4899" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="22" cy="2" r="4.5" fill="#F9A8D4"/>
      <line x1="50" y1="12" x2="58" y2="2" stroke="#EC4899" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="58" cy="2" r="4.5" fill="#F9A8D4"/>
      <ellipse cx="30" cy="36" rx="9" ry="10" fill="#1A1A2E"/>
      <ellipse cx="50" cy="36" rx="9" ry="10" fill="#1A1A2E"/>
      <circle cx="32" cy="33" r="3" fill="white" opacity="0.7"/>
      <circle cx="52" cy="33" r="3" fill="white" opacity="0.7"/>
      <ellipse cx="19" cy="43" rx="7" ry="5" fill="#FDE68A" opacity="0.8"/>
      <ellipse cx="61" cy="43" rx="7" ry="5" fill="#FDE68A" opacity="0.8"/>
      {happy ? (
        <path d="M33,48 Q40,55 47,48" stroke="#BE185D" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      ) : (
        <>
          <path d="M33,51 Q40,47 47,51" stroke="#BE185D" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M29,46 Q27,52 29,55" stroke="#93C5FD" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M51,46 Q53,52 51,55" stroke="#93C5FD" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </>
      )}
    </svg>
  );
}

// ── SVG: Green Mouse NPC (초록 모자, 갈색 눈) ───────────────────────────
function GreenMouseSVG({ size = 80, happy = false }: { size?: number; happy?: boolean }) {
  return (
    <svg width={size} height={Math.round(size*1.3)} viewBox="0 0 80 104">
      <ellipse cx="40" cy="101" rx="20" ry="4" fill="rgba(0,0,0,0.12)"/>
      <ellipse cx="40" cy="74" rx="20" ry="23" fill="#F0F0E0"/>
      <ellipse cx="40" cy="58" rx="18" ry="8" fill="#2D9E6B"/>
      <ellipse cx="20" cy="72" rx="7" ry="10" fill="#D8D8C8" transform="rotate(15 20 72)"/>
      <ellipse cx="60" cy="72" rx="7" ry="10" fill="#D8D8C8" transform="rotate(-15 60 72)"/>
      <path d="M60,85 Q76,74 72,96" stroke="#A09080" strokeWidth="6" fill="none" strokeLinecap="round"/>
      <ellipse cx="32" cy="94" rx="8" ry="8" fill="#D8D8C8"/>
      <ellipse cx="48" cy="94" rx="8" ry="8" fill="#D8D8C8"/>
      <circle cx="40" cy="38" r="26" fill="#F0F0E0"/>
      {/* green pointy hat */}
      <ellipse cx="40" cy="17" rx="23" ry="8" fill="#2D9E6B"/>
      <polygon points="22,17 40,-5 58,17" fill="#248A5A"/>
      <ellipse cx="40" cy="17" rx="23" ry="8" fill="#2D9E6B"/>
      {/* mouse ears */}
      <circle cx="22" cy="24" r="12" fill="#E0D0C0"/>
      <circle cx="58" cy="24" r="12" fill="#E0D0C0"/>
      <circle cx="22" cy="24" r="7" fill="#D4B8A8"/>
      <circle cx="58" cy="24" r="7" fill="#D4B8A8"/>
      <circle cx="33" cy="37" r="8" fill="white"/>
      <circle cx="47" cy="37" r="8" fill="white"/>
      <circle cx="34" cy="37" r="5.5" fill="#6B4226"/>
      <circle cx="48" cy="37" r="5.5" fill="#6B4226"/>
      <circle cx="35.5" cy="35" r="2" fill="white"/>
      <circle cx="49.5" cy="35" r="2" fill="white"/>
      {/* lashes */}
      <line x1="28" y1="31" x2="31" y2="28" stroke="#6B4226" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="33" y1="30" x2="33" y2="27" stroke="#6B4226" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="43" y1="30" x2="43" y2="27" stroke="#6B4226" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="48" y1="31" x2="45" y2="28" stroke="#6B4226" strokeWidth="1.5" strokeLinecap="round"/>
      <ellipse cx="40" cy="47" rx="4" ry="3" fill="#FFB7C5"/>
      {happy ? (
        <path d="M34,51 Q40,57 46,51" stroke="#B09080" strokeWidth="2" fill="none" strokeLinecap="round"/>
      ) : (
        <path d="M34,54 Q40,50 46,54" stroke="#B09080" strokeWidth="2" fill="none" strokeLinecap="round"/>
      )}
    </svg>
  );
}

// ── SVG: Spaceship ───────────────────────────────────────────────────────────
function SpaceshipSVG({ size = 130 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round(size*0.68)} viewBox="0 0 130 88">
      <ellipse cx="65" cy="82" rx="28" ry="8" fill="#7DD3FC" opacity="0.3"/>
      <ellipse cx="65" cy="66" rx="55" ry="16" fill="#0EA5E9"/>
      <ellipse cx="65" cy="62" rx="55" ry="16" fill="#38BDF8"/>
      <ellipse cx="65" cy="44" rx="30" ry="24" fill="#7DD3FC"/>
      <ellipse cx="65" cy="42" rx="26" ry="20" fill="#BAE6FD" opacity="0.9"/>
      {/* characters in dome */}
      <circle cx="56" cy="42" r="5" fill="#FF6EB4" opacity="0.8"/>
      <circle cx="66" cy="40" r="5" fill="#F5F0E8" opacity="0.8"/>
      <circle cx="75" cy="43" r="4" fill="#8B9099" opacity="0.7"/>
      <ellipse cx="32" cy="62" rx="11" ry="8" fill="#BAE6FD" opacity="0.75"/>
      <ellipse cx="65" cy="66" rx="11" ry="8" fill="#BAE6FD" opacity="0.75"/>
      <ellipse cx="98" cy="62" rx="11" ry="8" fill="#BAE6FD" opacity="0.75"/>
      <ellipse cx="65" cy="76" rx="47" ry="8" fill="#0284C7"/>
      <line x1="30" y1="78" x2="20" y2="88" stroke="#0284C7" strokeWidth="4" strokeLinecap="round"/>
      <line x1="100" y1="78" x2="110" y2="88" stroke="#0284C7" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function Stars() {
  const pts: [number, number][] = [
    [8,10],[22,5],[35,18],[48,8],[60,14],[75,6],[88,20],
    [14,32],[70,28],[82,42],[5,55],[45,38],[90,55],
    [28,65],[60,52],[78,70],[15,78],[42,72],[55,85],[90,88],
  ];
  return (
    <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }}>
      {pts.map(([x,y],i) => (
        <circle key={i} cx={`${x}%`} cy={`${y}%`} r={i%4===0?1.6:i%3===0?1.2:0.8}
          fill="white" opacity={0.3+(i%6)*0.1}/>
      ))}
    </svg>
  );
}

function SpeechBubble({ text }: { text: string }) {
  return (
    <div style={{
      position:"relative", background:"rgba(255,255,255,0.95)", borderRadius:14,
      padding:"8px 12px", fontSize:11.5, color:"#333", maxWidth:155,
      boxShadow:"0 4px 14px rgba(0,0,0,0.18)", lineHeight:1.45, fontWeight:600,
    }}>
      {text}
      <div style={{
        position:"absolute", bottom:-9, left:18, width:0, height:0,
        borderLeft:"9px solid transparent", borderRight:"9px solid transparent",
        borderTop:"9px solid rgba(255,255,255,0.95)",
      }}/>
    </div>
  );
}

function Hill({ cx, cy, rx, ry, fill }: { cx:number; cy:number; rx:number; ry:number; fill:string }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={fill}/>;
}

// ── Game Data ─────────────────────────────────────────────────────────────────
const CHARACTERS: Character[] = [
  { id:"panda",  name:"판다",  trait:"용감한 탐험가",   color:"#FF6EB4", bg:"#FFF0F7" },
  { id:"rabbit", name:"토끼",  trait:"호기심 많은 과학자",color:"#E53E3E", bg:"#FFF5F5" },
  { id:"cat",    name:"고양이", trait:"차분한 관찰자",   color:"#6B7280", bg:"#F3F4F6" },
  { id:"puppy",  name:"강아지", trait:"따뜻한 도우미",   color:"#D97706", bg:"#FFFBEB" },
];

const INTRO_SCENES = [
  { id:0, duration:3800, bg:"linear-gradient(180deg,#87CEEB 0%,#B8E8F0 55%,#90EE90 72%,#5A9E5A 100%)",
    subtitle:"어느 날, 우주 친구들이 모였어요." },
  { id:1, duration:3500, bg:"linear-gradient(180deg,#FFD580 0%,#FFA040 50%,#D4824A 100%)",
    subtitle:"\"우주로 떠나보자!\" 우주선에 올라탔어요 🚀" },
  { id:2, duration:4000, bg:"linear-gradient(180deg,#0D0820 0%,#1A1340 55%,#2D1B69 100%)",
    subtitle:"머나먼 별을 향해 출발했어요! ✨" },
  { id:3, duration:3500, bg:"linear-gradient(180deg,#2D1B69 0%,#4A1870 55%,#6B2FA0 100%)",
    subtitle:"낯선 별에 도착했어요. 무슨 일이 기다릴까요?" },
  { id:4, duration:3500, bg:"linear-gradient(180deg,#D4A470 0%,#C8914A 45%,#A07048 100%)",
    subtitle:"새로운 친구들을 사귀러 가볼까요?" },
];

const SCENES: StoryScene[] = [
  {
    id:1, title:"1/6 · 첫 번째 만남 🪐",
    bgGradient:"linear-gradient(180deg,#0D0820 0%,#1A1340 55%,#2D1B69 100%)",
    groundColor:"#1a0a40", npcType:1,
    npcSpeech:"흑흑... (울고 있어)",
    question:"🤔 작은 외계인이 나무 뒤에 숨어 울고 있어. 너라면 어떻게 할 것 같아?",
    choices:[
      { text:"🗣️ \"안녕? 무슨 일이야? 내가 도와줄 수 있어!\"",
        feedback:"외계인이 조심스럽게 고개를 들어. 말을 걸어줘서 고마워하는 것 같아 😊",
        skills:["prosocial","emotion"] },
      { text:"🤲 말없이 조용히 옆에 앉아서 같이 있어 준다",
        feedback:"외계인이 울음을 멈추고 살며시 너를 쳐다봐. 혼자가 아닌 느낌에 안심한 것 같아 🌸",
        skills:["prosocial","emotion"] },
      { text:"🤔 \"왜 울까?\" 혼자 이유를 생각해 본다",
        feedback:"외계인의 가방을 꽉 쥔 걸 보니 뭔가 소중한 걸 지키려는 것 같아 🧐",
        skills:["perspective","emotion"] },
    ],
  },
  {
    id:2, title:"2/6 · 길을 찾아라 🗺️",
    bgGradient:"linear-gradient(180deg,#0C1A3B 0%,#1E3A6B 55%,#0A5C7F 100%)",
    groundColor:"#0a3b55", npcType:2,
    npcSpeech:"?! ?? ?!... ☝️",
    question:"🗺️ 친구가 붙잡힌 곳을 찾아야 해! 외계인에게 길을 물어봤는데 말이 전혀 안 통해.",
    choices:[
      { text:"✏️ 땅에 그림을 그려서 설명한다",
        feedback:"외계인이 그림을 보고 눈을 반짝이며 방향을 가리켜! 🎨",
        skills:["conflict","perspective"] },
      { text:"👀 외계인의 표정과 몸짓을 열심히 살펴본다",
        feedback:"몸짓만으로도 많은 걸 말하고 있었구나 ✨",
        skills:["emotion","perspective"] },
      { text:"🤝 1장면 외계인을 데려와 도움을 받는다",
        feedback:"친절하게 대해줬더니 도움이 돌아왔어 💫",
        skills:["prosocial","conflict"] },
    ],
  },
  {
    id:3, title:"3/6 · 같이 놀고 싶어 🎈",
    bgGradient:"linear-gradient(180deg,#0A3B2C 0%,#145236 55%,#2E7D32 100%)",
    groundColor:"#0d3a1e", npcType:1,
    npcSpeech:"\"너는 우리랑 달라서 안 돼!\"",
    question:"😢 외계 아이들이 같이 놀기를 거부해. 어떻게 할까?",
    choices:[
      { text:"😄 \"나도 같이 하면 더 재밌을 거야! 한 번만 해보자!\"",
        feedback:"외계 아이들이 \"그래, 한 번 해봐\" 하고 자리를 내줘 🎉",
        skills:["conflict","prosocial"] },
      { text:"🤔 \"왜 나는 안 돼? 이유를 말해줄 수 있어?\"",
        feedback:"\"처음엔 꼭 인사를 먼저 해야 해\" 라고 알려줘 💡",
        skills:["perspective","emotion"] },
      { text:"🎈 혼자 옆에서 비슷한 놀이를 하다가 자연스럽게 어울린다",
        feedback:"외계 아이들이 먼저 말을 걸어와 🌈",
        skills:["prosocial","conflict"] },
    ],
  },
  {
    id:4, title:"4/6 · 도움이 필요해요 💙",
    bgGradient:"linear-gradient(180deg,#2B0B0B 0%,#7B1818 55%,#C0392B 100%)",
    groundColor:"#4a0e0e", npcType:1,
    npcSpeech:"도와줘! 엄마가 아파!",
    question:"💙 드디어 친구 근처야! 작은 외계인 아이가 엄마가 아프다고 외쳐. 어떻게 할까?",
    choices:[
      { text:"⚡ 얼른 친구를 구하고 바로 돌아와서 엄마를 도와준다",
        feedback:"친구도 구하고, 약속대로 돌아와서 엄마도 도와줬어 🏃",
        skills:["conflict","prosocial"] },
      { text:"🤙 \"10분 뒤에 꼭 돌아올게! 여기서 기다려!\"",
        feedback:"외계인 아이가 고개를 끄덕여 💪",
        skills:["conflict","prosocial"] },
      { text:"💙 \"많이 무서웠겠다. 엄마는 어디가 아파?\" 먼저 위로한다",
        feedback:"먼저 마음을 받아줘서 고마워했어 🌷",
        skills:["emotion","prosocial"] },
    ],
  },
  {
    id:5, title:"5/6 · 대장과의 협상 👑",
    bgGradient:"linear-gradient(180deg,#0D0820 0%,#2D1B69 55%,#4A1870 100%)",
    groundColor:"#1e0a40", npcType:1,
    npcSpeech:"\"비밀을 알려주면 친구를 돌려주겠다\"",
    question:"👑 외계인 대장이 조건을 걸었어. 어떻게 할까?",
    choices:[
      { text:"🙅 \"안 돼! 다른 방법은 없어?\"",
        feedback:"\"그렇다면 다른 거래를 생각해볼 수도 있겠지\" 🤝",
        skills:["conflict","perspective"] },
      { text:"🧐 \"왜 그 비밀이 필요해? 이유를 먼저 말해줘\"",
        feedback:"\"사실 우리 별이 위험해서...\" 라고 털어놔 💬",
        skills:["perspective","emotion"] },
      { text:"💡 \"내가 너희에게 도움이 될 다른 걸 줄 수 있어!\"",
        feedback:"눈을 빛내며 \"오! 그것도 나쁘지 않은데?\" ✨",
        skills:["conflict","prosocial"] },
    ],
  },
  {
    id:6, title:"6/6 · 드디어 구출! 🎊",
    bgGradient:"linear-gradient(180deg,#1A0A30 0%,#3D1A5C 40%,#6B2FA0 100%)",
    groundColor:"#2d0a50", npcType:2,
    npcSpeech:"\"빨리 출발하자!!\"",
    question:"🎊 친구를 구출했어! 그런데 돌아가는 방법을 두고 의견이 달라.",
    choices:[
      { text:"🏃 친구 말대로 빨리 출발한다",
        feedback:"친구가 환하게 웃어. 더 가까워진 것 같아 💕",
        skills:["prosocial","emotion"] },
      { text:"🗣️ \"외계 친구들에게 작별 인사하고 가고 싶어\" 솔직히 말한다",
        feedback:"친구가 \"그래\" 하며 같이 인사해줘 🌟",
        skills:["perspective","conflict"] },
      { text:"⏱️ \"5분 안에 인사하고 같이 출발하자!\"",
        feedback:"둘 다 웃으며 고개를 끄덕여 🎉",
        skills:["conflict","perspective"] },
    ],
  },
];

const SKILL_INFO: Record<SocialSkill,{label:string;color:string}> = {
  emotion:     {label:"감정 인식",color:"#FF9F43"},
  perspective: {label:"조망수용",color:"#A29BFE"},
  prosocial:   {label:"친사회성",color:"#54A0FF"},
  conflict:    {label:"갈등 해결",color:"#00B894"},
};
const PROFILES: Record<SocialSkill,{type:string;emoji:string;desc:string}> = {
  emotion:     {type:"감정 탐정형",    emoji:"🔍",desc:"친구의 마음을 잘 읽어내는 타입이야!"},
  perspective: {type:"다리 놓기형",    emoji:"🌟",desc:"상대방 입장에서 생각하는 타입이야!"},
  prosocial:   {type:"씩씩한 도우미형",emoji:"💪",desc:"먼저 나서서 도와주는 용감한 타입이야!"},
  conflict:    {type:"문제 해결사형",  emoji:"🎯",desc:"어려운 상황을 슬기롭게 푸는 타입이야!"},
};
const MAX_SCORES: SkillScores = {emotion:6,perspective:5,prosocial:6,conflict:5};
const SKILL_ORDER: SocialSkill[] = ["emotion","perspective","prosocial","conflict"];

// ── Character render helpers ──────────────────────────────────────────────────
function renderChar(id:string, size:number, animate=false) {
  if (id==="panda")  return <PandaSVG size={size} animate={animate}/>;
  if (id==="rabbit") return <RabbitSVG size={size} animate={animate}/>;
  if (id==="cat")    return <CatSVG size={size} animate={animate}/>;
  return <PuppySVG size={size} animate={animate}/>;
}
function renderNPC(type:1|2, size:number, happy:boolean) {
  if (type===1) return <PinkAlienSVG size={size} happy={happy}/>;
  return <GreenMouseSVG size={size} happy={happy}/>;
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function SocialStoryGame() {
  const [stage, setStage]             = useState<GameStage>("intro");
  const [introScene, setIntroScene]   = useState(0);
  const [introVisible, setIntroVisible] = useState(true);
  const [character, setCharacter]     = useState<Character|null>(null);
  const [sceneIndex, setSceneIndex]   = useState(0);
  const [chosenIdx, setChosenIdx]     = useState<number|null>(null);
  const [scores, setScores]           = useState<SkillScores>({emotion:0,perspective:0,prosocial:0,conflict:0});
  const [entered, setEntered]         = useState(false);
  const [npcHappy, setNpcHappy]       = useState(false);
  const [fading, setFading]           = useState(false);
  const sessionId = useRef("");
  const sceneStart = useRef(0);

  // intro auto-advance
  useEffect(() => {
    if (stage !== "intro") return;
    if (introScene >= INTRO_SCENES.length) { setStage("character-select"); return; }
    const dur = INTRO_SCENES[introScene].duration;
    const t = setTimeout(() => {
      setIntroVisible(false);
      setTimeout(() => { setIntroScene(i=>i+1); setIntroVisible(true); }, 350);
    }, dur - 350);
    return () => clearTimeout(t);
  }, [stage, introScene]);

  // scene entry animation
  useEffect(() => {
    if (stage !== "scene") return;
    setEntered(false); setNpcHappy(false);
    sceneStart.current = Date.now();
    const t = setTimeout(() => setEntered(true), 60);
    return () => clearTimeout(t);
  }, [stage, sceneIndex]);

  function skipIntro() { setStage("character-select"); }

  function selectCharacter(c: Character) {
    setCharacter(c); setStage("story-intro");
  }

  function startStory() {
    sessionId.current = generateId(); setStage("scene");
  }

  function handleChoice(idx: number) {
    if (chosenIdx !== null) return;
    const scene = SCENES[sceneIndex];
    const choice = scene.choices[idx];
    const ms = Date.now() - sceneStart.current;
    setScores(prev => { const n={...prev}; choice.skills.forEach(s=>{n[s]+=1;}); return n; });
    setNpcHappy(true); setChosenIdx(idx);
    saveResponse({
      sessionId:sessionId.current, characterId:character?.id??"",
      sceneId:scene.id, sceneTitle:scene.title,
      choiceIdx:idx, choiceText:choice.text,
      reactionTimeMs:ms, skillsAwarded:choice.skills,
      timestamp:new Date().toISOString(),
    });
  }

  function handleNext() {
    setFading(true);
    setTimeout(() => {
      if (sceneIndex+1 < SCENES.length) { setSceneIndex(i=>i+1); setChosenIdx(null); }
      else { saveBadge({id:"social-master",packName:"사회",label:"관계 고수",emoji:"🤝"}); setStage("result"); }
      setFading(false);
    }, 280);
  }

  function handleReset() {
    setStage("intro"); setIntroScene(0); setIntroVisible(true);
    setCharacter(null); setSceneIndex(0); setChosenIdx(null);
    setScores({emotion:0,perspective:0,prosocial:0,conflict:0});
    setEntered(false); setNpcHappy(false); setFading(false);
  }

  function getDominant(): SocialSkill {
    return SKILL_ORDER.reduce((best,s) =>
      scores[s]/MAX_SCORES[s] > scores[best]/MAX_SCORES[best] ? s : best, SKILL_ORDER[0]);
  }

  // ── INTRO ─────────────────────────────────────────────────────────────────
  if (stage === "intro") {
    const sc = INTRO_SCENES[Math.min(introScene, INTRO_SCENES.length-1)];
    const isSpace = introScene >= 2;
    return (
      <div style={{ position:"relative" }}>
        <style>{`
          @keyframes shipFloat { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-14px) rotate(2deg)} }
          @keyframes slideUp { from{transform:translateY(60px);opacity:0} to{transform:translateY(0);opacity:1} }
          @keyframes fadeInText { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
          .ship-float { animation: shipFloat 3s ease-in-out infinite; }
          .slide-up { animation: slideUp 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards; }
          .fade-text { animation: fadeInText 0.7s ease 0.4s both; }
        `}</style>

        {/* Scene container */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            height:340, position:"relative",
            background:sc.bg,
            opacity:introVisible?1:0,
            transition:"opacity 0.35s ease",
          }}
        >
          {isSpace && <Stars/>}

          {/* Scene 0: characters on alien planet */}
          {introScene===0 && (
            <>
              <svg style={{position:"absolute",bottom:0,left:0,width:"100%",height:"45%"}}>
                <Hill cx={20} cy={110} rx={80} ry={60} fill="#3D9142"/>
                <Hill cx={120} cy={120} rx={100} ry={70} fill="#E8C040"/>
                <Hill cx={260} cy={115} rx={90} ry={65} fill="#E06060"/>
                <Hill cx={380} cy={110} rx={80} ry={60} fill="#6BB56B"/>
                <ellipse cx="50%" cy="100%" rx="55%" ry="40" fill="#5A9E5A"/>
              </svg>
              <div style={{position:"absolute",bottom:60,left:0,right:0,display:"flex",justifyContent:"center",gap:8,alignItems:"flex-end"}}>
                <div className="slide-up" style={{animationDelay:"0s"}}><PandaSVG size={80}/></div>
                <div className="slide-up" style={{animationDelay:"0.2s"}}><RabbitSVG size={76}/></div>
                <div className="slide-up" style={{animationDelay:"0.35s"}}><CatSVG size={72}/></div>
                <div className="slide-up" style={{animationDelay:"0.5s"}}><PuppySVG size={70}/></div>
              </div>
            </>
          )}

          {/* Scene 1: spaceship on sandy planet */}
          {introScene===1 && (
            <>
              <svg style={{position:"absolute",bottom:0,left:0,width:"100%",height:"38%"}}>
                <ellipse cx="50%" cy="100%" rx="60%" ry="50" fill="#C8914A"/>
              </svg>
              <div style={{position:"absolute",bottom:55,left:20}} className="slide-up">
                <SpaceshipSVG size={150}/>
              </div>
              <div style={{position:"absolute",bottom:62,right:40,animationDelay:"0.3s"}} className="slide-up">
                <PandaSVG size={88}/>
              </div>
            </>
          )}

          {/* Scene 2: space travel */}
          {introScene===2 && (
            <>
              {/* speed lines */}
              {[20,35,50,65,80].map((y,i) => (
                <div key={i} style={{
                  position:"absolute",top:`${y}%`,left:0,right:0,height:1,
                  background:"rgba(255,255,255,0.15)",
                }}/>
              ))}
              <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-55%)"}}
                   className="ship-float">
                <SpaceshipSVG size={180}/>
              </div>
            </>
          )}

          {/* Scene 3: alien planet arrival */}
          {introScene===3 && (
            <>
              {/* alien planet surface */}
              <svg style={{position:"absolute",bottom:0,left:0,width:"100%",height:"45%"}}>
                <ellipse cx="50%" cy="100%" rx="55%" ry="50" fill="#3D1060"/>
                <ellipse cx="30%" cy="80%" rx="25%" ry="20" fill="#5B1A90"/>
                <ellipse cx="75%" cy="75%" rx="20%" ry="18" fill="#4A1070"/>
              </svg>
              <div style={{position:"absolute",top:"30%",left:"50%",transform:"translate(-50%,-50%)"}}
                   className="ship-float">
                <SpaceshipSVG size={140}/>
              </div>
              <div style={{position:"absolute",bottom:55,right:30}} className="slide-up">
                <PinkAlienSVG size={80} happy={false}/>
              </div>
            </>
          )}

          {/* Scene 4: friends gathered, ready */}
          {introScene===4 && (
            <>
              <svg style={{position:"absolute",bottom:0,left:0,width:"100%",height:"38%"}}>
                <ellipse cx="50%" cy="100%" rx="55%" ry="45" fill="#8B6040"/>
              </svg>
              <div style={{position:"absolute",bottom:55,left:0,right:0,display:"flex",justifyContent:"center",gap:4,alignItems:"flex-end"}}>
                <div className="slide-up" style={{animationDelay:"0s"}}><PinkAlienSVG size={68}/></div>
                <div className="slide-up" style={{animationDelay:"0.15s"}}><GreenMouseSVG size={68}/></div>
                <div className="slide-up" style={{animationDelay:"0.3s"}}><PandaSVG size={92}/></div>
                <div className="slide-up" style={{animationDelay:"0.45s"}}><RabbitSVG size={72}/></div>
                <div className="slide-up" style={{animationDelay:"0.6s"}}><CatSVG size={68}/></div>
              </div>
            </>
          )}

          {/* Subtitle */}
          <div
            className="fade-text"
            style={{
              position:"absolute",bottom:12,left:0,right:0,
              textAlign:"center",
              background:"rgba(0,0,0,0.42)",
              padding:"9px 16px",
              color:"white",
              fontSize:13.5,
              fontWeight:700,
              letterSpacing:"-0.01em",
            }}
          >
            {sc.subtitle}
          </div>

          {/* Skip button */}
          <button
            onClick={skipIntro}
            style={{
              position:"absolute",top:12,right:12,
              background:"rgba(255,255,255,0.22)",
              border:"1.5px solid rgba(255,255,255,0.4)",
              color:"white",
              borderRadius:20,
              padding:"5px 14px",
              fontSize:11,
              fontWeight:700,
              cursor:"pointer",
            }}
          >
            건너뛰기 ▶
          </button>

          {/* Scene dots */}
          <div style={{position:"absolute",bottom:52,left:0,right:0,display:"flex",justifyContent:"center",gap:6}}>
            {INTRO_SCENES.map((_,i) => (
              <div key={i} style={{
                width:i===introScene?20:7, height:7, borderRadius:4,
                background:i===introScene?"white":"rgba(255,255,255,0.4)",
                transition:"all 0.3s ease",
              }}/>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── CHARACTER SELECT ───────────────────────────────────────────────────────
  if (stage === "character-select") {
    return (
      <div>
        <div className="rounded-3xl px-5 py-5 mb-5 text-center"
          style={{background:"linear-gradient(135deg,#0D0820 0%,#2D1B69 100%)",position:"relative",overflow:"hidden"}}>
          <Stars/>
          <div style={{position:"relative",zIndex:1}}>
            <p className="text-xl font-black text-white mb-1">이제 시작해볼까? 🚀</p>
            <p style={{color:"#C4B5FD",fontSize:13}}>함께 모험할 캐릭터를 골라봐!</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {CHARACTERS.map((c,i) => (
            <button key={c.id} onClick={()=>selectCharacter(c)}
              className="rounded-3xl pt-4 pb-4 px-3 text-center shadow-sm transition-transform active:scale-95 hover:scale-105"
              style={{background:c.bg, border:`3px solid ${c.color}50`}}>
              <div className="flex justify-center mb-1" style={{animationDelay:`${i*0.3}s`}}>
                {renderChar(c.id, 86, true)}
              </div>
              <p className="text-sm font-black mt-1" style={{color:c.color}}>{c.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{c.trait}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── STORY INTRO ────────────────────────────────────────────────────────────
  if (stage === "story-intro" && character) {
    return (
      <div>
        <div className="rounded-3xl px-6 py-6 mb-5 text-center"
          style={{background:"linear-gradient(135deg,#0D0820 0%,#2D1B69 100%)",position:"relative",overflow:"hidden"}}>
          <Stars/>
          <div style={{position:"relative",zIndex:1}}>
            <div className="flex justify-center mb-3">{renderChar(character.id,110,true)}</div>
            <p className="text-xl font-black text-white">{character.name}</p>
            <p style={{color:"#C4B5FD",fontSize:12,marginTop:4}}>{character.trait}</p>
          </div>
        </div>
        <div className="rounded-3xl px-5 py-5 mb-5"
          style={{background:"#F8F9FF",border:"2px solid #E0E7FF"}}>
          <p className="text-sm leading-relaxed text-gray-600">
            🚀 <span className="font-bold" style={{color:character.color}}>{character.name}</span>은 우주를 탐험하다 갑자기 엔진이 고장났어!
          </p>
          <p className="text-sm leading-relaxed text-gray-600 mt-3">
            🪐 낯선 별에 불시착했는데, 친구 <span className="font-bold">다미</span>가 외계인에게 붙잡혀 버렸어!
          </p>
          <p className="text-sm leading-relaxed text-gray-600 mt-3">
            💫 다미를 구출하려면 이 별의 외계인들과 잘 지내야 해. 준비됐어?
          </p>
        </div>
        <button onClick={startStory} className="btn-main w-full py-4 rounded-2xl text-white font-black text-base"
          style={{background:`linear-gradient(135deg,${character.color},#A29BFE)`}}>
          탐험 시작! 🚀
        </button>
      </div>
    );
  }

  // ── SCENE ──────────────────────────────────────────────────────────────────
  if (stage === "scene" && character) {
    const scene = SCENES[sceneIndex];
    return (
      <div style={{opacity:fading?0:1,transition:"opacity 0.28s ease"}}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold px-3 py-1 rounded-full"
            style={{color:character.color,background:character.bg}}>{scene.title}</span>
        </div>
        {/* Scene background */}
        <div className="rounded-3xl mb-4 overflow-hidden"
          style={{background:scene.bgGradient,height:220,position:"relative"}}>
          <Stars/>
          <div style={{position:"absolute",bottom:0,left:0,right:0,height:60,
            background:scene.groundColor,borderRadius:"60% 60% 0 0 / 30% 30% 0 0"}}/>
          {/* Player */}
          <div style={{position:"absolute",bottom:24,left:16,
            transform:entered?"translateX(0)":"translateX(-130px)",
            transition:"transform 0.55s cubic-bezier(0.34,1.56,0.64,1)",zIndex:2}}>
            {renderChar(character.id,82)}
          </div>
          {/* NPC + bubble */}
          <div style={{position:"absolute",bottom:18,right:12,
            transform:entered?"translateX(0)":"translateX(130px)",
            transition:"transform 0.55s cubic-bezier(0.34,1.56,0.64,1) 0.1s",
            zIndex:2,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
            {entered && <div className="animate-pop"><SpeechBubble text={scene.npcSpeech}/></div>}
            {renderNPC(scene.npcType,70,npcHappy)}
          </div>
        </div>
        {/* Question */}
        <div className="rounded-2xl px-4 py-3 mb-3"
          style={{background:"#F8F9FF",border:"2px solid #E0E7FF"}}>
          <p className="text-sm text-gray-700 leading-relaxed font-semibold text-center">{scene.question}</p>
        </div>
        {/* Choices */}
        <div className="flex flex-col gap-2.5 mb-3">
          {scene.choices.map((choice,idx) => {
            const chosen = chosenIdx===idx;
            const disabled = chosenIdx!==null;
            return (
              <button key={idx} onClick={()=>handleChoice(idx)} disabled={disabled}
                className="rounded-2xl px-4 py-3.5 text-left text-sm font-semibold shadow-sm transition-all"
                style={{
                  background:chosen?character.bg:"#fff",
                  border:chosen?`2px solid ${character.color}`:"2px solid #E5EAF0",
                  color:chosen?character.color:"#444",
                  opacity:disabled&&!chosen?0.38:1,
                  transform:chosen?"scale(1.01)":"scale(1)",
                }}>
                {choice.text}
              </button>
            );
          })}
        </div>
        {chosenIdx!==null && (
          <div className="animate-pop">
            <div className="rounded-2xl px-4 py-3.5 mb-3"
              style={{background:character.bg,border:`2px solid ${character.color}50`}}>
              <p className="text-sm text-gray-600 leading-relaxed">{SCENES[sceneIndex].choices[chosenIdx].feedback}</p>
            </div>
            <button onClick={handleNext} className="btn-main w-full py-4 rounded-2xl text-white font-black text-base"
              style={{background:`linear-gradient(135deg,${character.color},#A29BFE)`}}>
              {sceneIndex+1<SCENES.length?"계속하기 →":"결과 보기! 🎊"}
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── RESULT ─────────────────────────────────────────────────────────────────
  if (stage === "result" && character) {
    const dominant = getDominant();
    const profile = PROFILES[dominant];
    return (
      <div>
        <div className="rounded-3xl px-6 py-6 mb-4 text-center animate-pop"
          style={{background:"linear-gradient(135deg,#0D0820 0%,#2D1B69 100%)",position:"relative",overflow:"hidden"}}>
          <Stars/>
          <div style={{position:"relative",zIndex:1}}>
            <div className="text-5xl mb-2">{profile.emoji}</div>
            <p className="text-xl font-black text-white">{profile.type}</p>
            <p style={{color:"#C4B5FD",fontSize:13,marginTop:4}}>{profile.desc}</p>
          </div>
        </div>
        <div className="rounded-3xl px-5 py-5 mb-4" style={{background:"#F8F9FF",border:"2px solid #E0E7FF"}}>
          <p className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wide">사회성 프로필</p>
          {SKILL_ORDER.map(skill => {
            const info = SKILL_INFO[skill];
            const pct = Math.round((scores[skill]/MAX_SCORES[skill])*100);
            return (
              <div key={skill} className="mb-4">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold" style={{color:info.color}}>{info.label}</span>
                  <span className="text-xs font-bold" style={{color:info.color}}>{pct}%</span>
                </div>
                <div className="h-3.5 rounded-full overflow-hidden" style={{background:"#E5EAF0"}}>
                  <div className="h-full rounded-full"
                    style={{width:`${pct}%`,background:info.color,transition:"width 0.9s cubic-bezier(0.34,1.56,0.64,1)"}}/>
                </div>
              </div>
            );
          })}
        </div>
        <div className="rounded-3xl px-5 py-4 mb-4 text-center"
          style={{background:"#F0F8FF",border:"2px solid #54A0FF30"}}>
          <div className="text-4xl mb-1">🏅</div>
          <p className="text-base font-black text-blue-400">관계 고수 뱃지 획득!</p>
          <p className="text-xs text-gray-400 mt-1">우주 모험을 무사히 완수했어요</p>
        </div>
        <button onClick={handleReset}
          className="w-full py-4 rounded-2xl font-black text-base transition-transform active:scale-95 hover:scale-105"
          style={{background:"#EEF5FF",color:"#54A0FF",border:"2px solid #54A0FF30"}}>
          다시 하기 🔄
        </button>
      </div>
    );
  }

  return null;
}
