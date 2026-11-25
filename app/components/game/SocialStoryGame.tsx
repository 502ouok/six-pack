"use client";
import { useState, useEffect, useRef } from "react";
import { saveBadge } from "@/lib/badges";
import { type SocialSkill, type ResponseRecord, saveSocialResponse } from "@/lib/gameResults";

type GameStage = "character-select" | "story-intro" | "scene" | "result";
type SkillScores = Record<SocialSkill, number>;

interface Character {
  id: string;
  name: string;
  trait: string;
  color: string;
  bg: string;
}

interface StoryChoice {
  text: string;
  feedback: string;
  skills: SocialSkill[];
}

interface StoryScene {
  id: number;
  title: string;
  bgGradient: string;
  groundColor: string;
  npcType: 1 | 2 | 3;
  npcSpeech: string;
  question: string;
  choices: StoryChoice[];
}

// ── SVG Characters ────────────────────────────────────────────────────────────

function PandaChar({ size = 100, animate = false }: { size?: number; animate?: boolean }) {
  return (
    <svg
      width={size}
      height={Math.round(size * 1.1)}
      viewBox="0 0 100 110"
      className={animate ? "animate-float" : ""}
    >
      <ellipse cx="50" cy="107" rx="28" ry="5" fill="rgba(0,0,0,0.13)" />
      {/* Body */}
      <ellipse cx="50" cy="78" rx="29" ry="27" fill="white" />
      <ellipse cx="50" cy="80" rx="17" ry="18" fill="#f5f5f5" />
      {/* Arms */}
      <ellipse cx="22" cy="76" rx="10" ry="14" fill="#2d2d2d" transform="rotate(18 22 76)" />
      <ellipse cx="78" cy="76" rx="10" ry="14" fill="#2d2d2d" transform="rotate(-18 78 76)" />
      {/* Legs */}
      <ellipse cx="38" cy="102" rx="11" ry="8" fill="#2d2d2d" />
      <ellipse cx="62" cy="102" rx="11" ry="8" fill="#2d2d2d" />
      {/* Head */}
      <circle cx="50" cy="40" r="30" fill="white" />
      {/* Ears */}
      <circle cx="22" cy="13" r="13" fill="#2d2d2d" />
      <circle cx="78" cy="13" r="13" fill="#2d2d2d" />
      <circle cx="22" cy="13" r="8" fill="#444" />
      <circle cx="78" cy="13" r="8" fill="#444" />
      {/* Eye patches */}
      <ellipse cx="36" cy="37" rx="12" ry="12" fill="#2d2d2d" />
      <ellipse cx="64" cy="37" rx="12" ry="12" fill="#2d2d2d" />
      {/* Eyes */}
      <circle cx="36" cy="37" r="8" fill="white" />
      <circle cx="64" cy="37" r="8" fill="white" />
      <circle cx="37" cy="37" r="5.5" fill="#111" />
      <circle cx="65" cy="37" r="5.5" fill="#111" />
      <circle cx="39.5" cy="34.5" r="2.3" fill="white" />
      <circle cx="67.5" cy="34.5" r="2.3" fill="white" />
      {/* Nose */}
      <ellipse cx="50" cy="47" rx="5.5" ry="3.5" fill="#999" />
      {/* Mouth */}
      <path d="M44,52 Q50,58 56,52" stroke="#bbb" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Blush */}
      <circle cx="26" cy="49" r="7" fill="#FFB7C5" opacity="0.45" />
      <circle cx="74" cy="49" r="7" fill="#FFB7C5" opacity="0.45" />
    </svg>
  );
}

function PuppyChar({ size = 100, animate = false }: { size?: number; animate?: boolean }) {
  return (
    <svg
      width={size}
      height={Math.round(size * 1.1)}
      viewBox="0 0 100 110"
      className={animate ? "animate-float-delay" : ""}
    >
      <ellipse cx="50" cy="107" rx="26" ry="5" fill="rgba(0,0,0,0.13)" />
      {/* Body */}
      <ellipse cx="50" cy="78" rx="26" ry="26" fill="#E8C85A" />
      <ellipse cx="50" cy="80" rx="15" ry="17" fill="#F5D98B" />
      {/* Tail */}
      <path d="M73,86 Q92,70 86,98" stroke="#C9A44A" strokeWidth="9" fill="none" strokeLinecap="round" />
      {/* Arms */}
      <ellipse cx="25" cy="76" rx="9" ry="13" fill="#C9A44A" transform="rotate(18 25 76)" />
      <ellipse cx="75" cy="76" rx="9" ry="13" fill="#C9A44A" transform="rotate(-18 75 76)" />
      {/* Legs */}
      <ellipse cx="38" cy="101" rx="10" ry="8" fill="#C9A44A" />
      <ellipse cx="62" cy="101" rx="10" ry="8" fill="#C9A44A" />
      {/* Head */}
      <circle cx="50" cy="40" r="27" fill="#E8C85A" />
      {/* Ears */}
      <ellipse cx="23" cy="32" rx="11" ry="20" fill="#C9A44A" transform="rotate(-18 23 32)" />
      <ellipse cx="77" cy="32" rx="11" ry="20" fill="#C9A44A" transform="rotate(18 77 32)" />
      {/* Eyes */}
      <circle cx="38" cy="39" r="9" fill="white" />
      <circle cx="62" cy="39" r="9" fill="white" />
      <circle cx="39" cy="39" r="6.5" fill="#222" />
      <circle cx="63" cy="39" r="6.5" fill="#222" />
      <circle cx="41" cy="36.5" r="2.3" fill="white" />
      <circle cx="65" cy="36.5" r="2.3" fill="white" />
      {/* Muzzle */}
      <ellipse cx="50" cy="51" rx="11" ry="8" fill="#F0D080" />
      {/* Nose */}
      <ellipse cx="50" cy="47" rx="5.5" ry="4" fill="#333" />
      {/* Mouth */}
      <path d="M44,54 Q50,60 56,54" stroke="#B08040" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Blush */}
      <circle cx="27" cy="50" r="7" fill="#FFB7C5" opacity="0.45" />
      <circle cx="73" cy="50" r="7" fill="#FFB7C5" opacity="0.45" />
    </svg>
  );
}

function AlienNPC1({ size = 80, happy = false }: { size?: number; happy?: boolean }) {
  return (
    <svg width={size} height={Math.round(size * 1.25)} viewBox="0 0 80 100">
      <ellipse cx="40" cy="97" rx="20" ry="4" fill="rgba(0,0,0,0.12)" />
      {/* Tentacles */}
      <path d="M20,80 Q10,92 15,98" stroke="#7C3AED" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M32,84 Q28,95 32,99" stroke="#7C3AED" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M48,84 Q52,95 48,99" stroke="#7C3AED" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M60,80 Q70,92 65,98" stroke="#7C3AED" strokeWidth="6" fill="none" strokeLinecap="round" />
      {/* Body */}
      <ellipse cx="40" cy="65" rx="22" ry="20" fill="#A78BFA" />
      <ellipse cx="40" cy="65" rx="12" ry="13" fill="#C4B5FD" opacity="0.5" />
      {/* Head */}
      <circle cx="40" cy="37" r="26" fill="#A78BFA" />
      {/* Antennae */}
      <line x1="30" y1="12" x2="23" y2="2" stroke="#7C3AED" strokeWidth="3" />
      <circle cx="23" cy="2" r="4" fill="#DDD6FE" />
      <line x1="50" y1="12" x2="57" y2="2" stroke="#7C3AED" strokeWidth="3" />
      <circle cx="57" cy="2" r="4" fill="#DDD6FE" />
      {/* Eyes */}
      <circle cx="30" cy="34" r="10" fill="white" />
      <circle cx="50" cy="34" r="10" fill="white" />
      <circle cx="31" cy="34" r="7" fill="#2D1B69" />
      <circle cx="51" cy="34" r="7" fill="#2D1B69" />
      <circle cx="33" cy="31.5" r="2.5" fill="white" />
      <circle cx="53" cy="31.5" r="2.5" fill="white" />
      {/* Tears (only when sad) */}
      {!happy && (
        <>
          <ellipse cx="29" cy="46" rx="2" ry="4" fill="#93C5FD" opacity="0.9" />
          <ellipse cx="50" cy="46" rx="2" ry="4" fill="#93C5FD" opacity="0.9" />
        </>
      )}
      {/* Mouth */}
      {happy ? (
        <path d="M33,47 Q40,54 47,47" stroke="#6D28D9" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M33,51 Q40,47 47,51" stroke="#6D28D9" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
}

function AlienNPC2({ size = 80, happy = false }: { size?: number; happy?: boolean }) {
  return (
    <svg width={size} height={Math.round(size * 1.25)} viewBox="0 0 80 100">
      <ellipse cx="40" cy="97" rx="20" ry="4" fill="rgba(0,0,0,0.12)" />
      {/* Body */}
      <ellipse cx="40" cy="68" rx="20" ry="22" fill="#38BDF8" />
      <ellipse cx="40" cy="68" rx="11" ry="14" fill="#BAE6FD" opacity="0.6" />
      {/* Arms */}
      <ellipse cx="20" cy="65" rx="8" ry="12" fill="#0EA5E9" transform="rotate(10 20 65)" />
      <ellipse cx="60" cy="65" rx="8" ry="12" fill="#0EA5E9" transform="rotate(-10 60 65)" />
      {/* Legs */}
      <ellipse cx="32" cy="88" rx="8" ry="8" fill="#0EA5E9" />
      <ellipse cx="48" cy="88" rx="8" ry="8" fill="#0EA5E9" />
      {/* Head */}
      <ellipse cx="40" cy="36" rx="23" ry="28" fill="#38BDF8" />
      {/* Visor */}
      <ellipse cx="40" cy="34" rx="17" ry="21" fill="#BAE6FD" opacity="0.5" />
      {/* Eyes */}
      <circle cx="30" cy="30" r="8.5" fill="white" />
      <circle cx="50" cy="30" r="8.5" fill="white" />
      <circle cx="31" cy="30" r="6" fill="#0369A1" />
      <circle cx="51" cy="30" r="6" fill="#0369A1" />
      <circle cx="33" cy="27.5" r="2" fill="white" />
      <circle cx="53" cy="27.5" r="2" fill="white" />
      {/* Mouth */}
      {happy ? (
        <path d="M32,43 Q40,50 48,43" stroke="#0284C7" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M32,46 Q40,43 48,46" stroke="#0284C7" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
}

function AlienNPC3({ size = 90, happy = false }: { size?: number; happy?: boolean }) {
  return (
    <svg width={size} height={Math.round(size * 1.2)} viewBox="0 0 90 108">
      <ellipse cx="45" cy="105" rx="25" ry="5" fill="rgba(0,0,0,0.12)" />
      {/* Crown */}
      <path d="M20,22 L28,9 L40,17 L45,5 L50,17 L62,9 L70,22 Z" fill="#F59E0B" />
      <circle cx="45" cy="5" r="4" fill="#FDE68A" />
      <circle cx="28" cy="9" r="3" fill="#FDE68A" />
      <circle cx="62" cy="9" r="3" fill="#FDE68A" />
      {/* Body */}
      <ellipse cx="45" cy="78" rx="24" ry="24" fill="#F97316" />
      <ellipse cx="45" cy="78" rx="14" ry="17" fill="#FCD34D" opacity="0.5" />
      {/* Arms */}
      <ellipse cx="21" cy="73" rx="11" ry="10" fill="#EA580C" transform="rotate(20 21 73)" />
      <ellipse cx="69" cy="73" rx="11" ry="10" fill="#EA580C" transform="rotate(-20 69 73)" />
      {/* Legs */}
      <ellipse cx="36" cy="99" rx="9" ry="8" fill="#EA580C" />
      <ellipse cx="54" cy="99" rx="9" ry="8" fill="#EA580C" />
      {/* Head */}
      <circle cx="45" cy="44" r="27" fill="#F97316" />
      {/* Eyes */}
      <circle cx="34" cy="40" r="10" fill="white" />
      <circle cx="56" cy="40" r="10" fill="white" />
      <circle cx="35" cy="40" r="7" fill="#7C2D12" />
      <circle cx="57" cy="40" r="7" fill="#7C2D12" />
      <circle cx="37" cy="37.5" r="2.5" fill="white" />
      <circle cx="59" cy="37.5" r="2.5" fill="white" />
      {/* Eyebrows */}
      <path d="M28,32 Q34,29 40,31" stroke="#C2410C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M50,31 Q56,29 62,32" stroke="#C2410C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Nose */}
      <ellipse cx="45" cy="50" rx="5" ry="3.5" fill="#C2410C" />
      {/* Mouth */}
      {happy ? (
        <path d="M37,57 Q45,64 53,57" stroke="#9A3412" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M37,60 Q45,56 53,60" stroke="#9A3412" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
}

function SpeechBubble({ text, side = "right" }: { text: string; side?: "left" | "right" }) {
  return (
    <div
      style={{
        position: "relative",
        background: "rgba(255,255,255,0.95)",
        borderRadius: 14,
        padding: "8px 12px",
        fontSize: 12,
        color: "#333",
        maxWidth: 160,
        boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
        lineHeight: 1.45,
        fontWeight: 600,
        backdropFilter: "blur(4px)",
      }}
    >
      {text}
      <div
        style={{
          position: "absolute",
          bottom: -9,
          [side === "right" ? "left" : "right"]: 18,
          width: 0,
          height: 0,
          borderLeft: "9px solid transparent",
          borderRight: "9px solid transparent",
          borderTop: "9px solid rgba(255,255,255,0.95)",
        }}
      />
    </div>
  );
}

function Stars() {
  const pts = [
    [8, 10], [22, 5], [35, 18], [48, 8], [60, 14], [75, 6], [88, 20],
    [14, 32], [70, 28], [82, 42], [5, 55], [45, 38], [90, 55],
    [28, 65], [60, 52], [78, 70], [15, 78], [42, 72],
  ] as [number, number][];
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
      {pts.map(([x, y], i) => (
        <circle
          key={i}
          cx={`${x}%`}
          cy={`${y}%`}
          r={i % 4 === 0 ? 1.6 : i % 3 === 0 ? 1.2 : 0.8}
          fill="white"
          opacity={0.3 + (i % 6) * 0.1}
        />
      ))}
    </svg>
  );
}

// ── Constants ─────────────────────────────────────────────────────────────────

const CHARACTERS: Character[] = [
  { id: "panda", name: "뽀코", trait: "용감한 탐험가 🐼", color: "#54A0FF", bg: "#EEF5FF" },
  { id: "puppy", name: "뭉치", trait: "따뜻한 치료사 🐾", color: "#FF9F43", bg: "#FFF8EE" },
];

const SCENES: StoryScene[] = [
  {
    id: 1,
    title: "1/6 · 첫 번째 만남 🪐",
    bgGradient: "linear-gradient(180deg, #0D0820 0%, #1A1340 55%, #2D1B69 100%)",
    groundColor: "#1a0a40",
    npcType: 1,
    npcSpeech: "흑흑... (울고 있어)",
    question: "🤔 작은 외계인이 나무 뒤에 숨어 울고 있어. 너라면 어떻게 할 것 같아?",
    choices: [
      {
        text: "🗣️ \"안녕? 무슨 일이야? 내가 도와줄 수 있어!\"",
        feedback: "외계인이 조심스럽게 고개를 들어. 말을 걸어줘서 고마워하는 것 같아 😊",
        skills: ["prosocial", "emotion"],
      },
      {
        text: "🤲 말없이 조용히 옆에 앉아서 같이 있어 준다",
        feedback: "외계인이 울음을 멈추고 살며시 너를 쳐다봐. 혼자가 아닌 느낌에 안심한 것 같아 🌸",
        skills: ["prosocial", "emotion"],
      },
      {
        text: "🤔 \"왜 울까?\" 혼자 이유를 생각해 본다",
        feedback: "외계인의 가방을 꽉 쥔 걸 보니 뭔가 소중한 걸 지키려는 것 같아. 잘 살펴봤어 🧐",
        skills: ["perspective", "emotion"],
      },
    ],
  },
  {
    id: 2,
    title: "2/6 · 길을 찾아라 🗺️",
    bgGradient: "linear-gradient(180deg, #0C1A3B 0%, #1E3A6B 50%, #0A5C7F 100%)",
    groundColor: "#0a3b55",
    npcType: 2,
    npcSpeech: "?! ?? ?!... ☝️",
    question: "🗺️ 친구가 붙잡힌 곳을 찾아야 해! 외계인에게 길을 물어봤는데 말이 전혀 안 통해.",
    choices: [
      {
        text: "✏️ 땅에 그림을 그려서 설명한다",
        feedback: "외계인이 그림을 보고 눈을 반짝이며 방향을 가리켜! 그림으로도 충분히 통했어 🎨",
        skills: ["conflict", "perspective"],
      },
      {
        text: "👀 외계인의 표정과 몸짓을 열심히 살펴본다",
        feedback: "외계인이 손짓으로 이쪽저쪽을 가리키고 있었어! 몸짓만으로도 많은 걸 말하고 있었구나 ✨",
        skills: ["emotion", "perspective"],
      },
      {
        text: "🤝 1장면에서 만난 외계인을 데려와 도움을 받는다",
        feedback: "울던 외계인이 기꺼이 통역해줘! 친절하게 대해줬더니 도움이 돌아왔어 💫",
        skills: ["prosocial", "conflict"],
      },
    ],
  },
  {
    id: 3,
    title: "3/6 · 같이 놀고 싶어 🎈",
    bgGradient: "linear-gradient(180deg, #0A3B2C 0%, #145236 50%, #2E7D32 100%)",
    groundColor: "#0d3a1e",
    npcType: 1,
    npcSpeech: "\"너는 우리랑 달라서 안 돼!\"",
    question: "😢 외계 아이들이 신나게 놀고 있어. 같이 놀고 싶어서 다가갔더니 거부당했어. 어떻게 할까?",
    choices: [
      {
        text: "😄 \"나도 같이 하면 더 재밌을 거야! 한 번만 해보자!\"",
        feedback: "외계 아이들이 잠깐 고민하다가 \"그래, 한 번 해봐\" 하고 자리를 내줘 🎉",
        skills: ["conflict", "prosocial"],
      },
      {
        text: "🤔 \"왜 나는 안 돼? 이유를 말해줄 수 있어?\"",
        feedback: "아이들이 \"우리 별에선 처음엔 꼭 인사를 먼저 해야 해\" 라고 알려줘. 이유가 있었구나! 💡",
        skills: ["perspective", "emotion"],
      },
      {
        text: "🎈 혼자 옆에서 비슷한 놀이를 하다가 자연스럽게 어울린다",
        feedback: "외계 아이들이 \"같이 하면 더 재밌겠다!\" 하고 먼저 말을 걸어와 🌈",
        skills: ["prosocial", "conflict"],
      },
    ],
  },
  {
    id: 4,
    title: "4/6 · 도움이 필요해요 💙",
    bgGradient: "linear-gradient(180deg, #2B0B0B 0%, #7B1818 50%, #C0392B 100%)",
    groundColor: "#4a0e0e",
    npcType: 1,
    npcSpeech: "도와줘! 엄마가 아파!",
    question: "💙 드디어 친구가 있는 곳 근처야! 그때 작은 외계인 아이가 엄마가 아프다고 외쳐. 어떻게 할까?",
    choices: [
      {
        text: "⚡ 얼른 친구를 구하고 바로 돌아와서 엄마를 도와준다",
        feedback: "친구도 구하고, 약속대로 돌아와서 엄마도 도와줬어. 두 가지를 모두 해냈어! 🏃",
        skills: ["conflict", "prosocial"],
      },
      {
        text: "🤙 \"지금은 급하지만 10분 뒤에 꼭 돌아올게! 여기서 기다려!\"",
        feedback: "외계인 아이가 고개를 끄덕여. 약속을 꼭 지켜야겠다고 다짐했어 💪",
        skills: ["conflict", "prosocial"],
      },
      {
        text: "💙 \"많이 무서웠겠다. 엄마는 어디가 아파?\" 먼저 위로한다",
        feedback: "외계인 아이가 눈물을 닦고 차분하게 설명해. 먼저 마음을 받아줘서 고마워했어 🌷",
        skills: ["emotion", "prosocial"],
      },
    ],
  },
  {
    id: 5,
    title: "5/6 · 대장과의 협상 👑",
    bgGradient: "linear-gradient(180deg, #0D0820 0%, #2D1B69 50%, #4A1870 100%)",
    groundColor: "#1e0a40",
    npcType: 3,
    npcSpeech: "\"비밀을 알려주면 친구를 돌려주겠다\"",
    question: "👑 외계인 대장이 나타났어! 조건을 걸어왔는데... 어떻게 할까?",
    choices: [
      {
        text: "🙅 \"안 돼! 비밀은 못 알려줘. 다른 방법은 없어?\"",
        feedback: "대장이 잠시 생각하더니 \"그렇다면... 다른 거래를 생각해볼 수도 있겠지\" 라고 해 🤝",
        skills: ["conflict", "perspective"],
      },
      {
        text: "🧐 \"왜 그 비밀이 필요해? 이유를 먼저 말해줘\"",
        feedback: "대장이 \"사실 우리 별이 위험해서...\" 라고 털어놔. 이유를 알고 나니 더 잘 이해할 수 있어 💬",
        skills: ["perspective", "emotion"],
      },
      {
        text: "💡 \"대신 내가 너희에게 도움이 될 다른 걸 줄 수 있어!\"",
        feedback: "대장이 눈을 빛내며 \"오! 그것도 나쁘지 않은데?\" 라고 해. 새로운 방법을 찾았어 ✨",
        skills: ["conflict", "prosocial"],
      },
    ],
  },
  {
    id: 6,
    title: "6/6 · 드디어 구출! 🎊",
    bgGradient: "linear-gradient(180deg, #1A0A30 0%, #3D1A5C 40%, #6B2FA0 70%, #9B59B6 100%)",
    groundColor: "#2d0a50",
    npcType: 2,
    npcSpeech: "\"빨리 출발하자!!\"",
    question: "🎊 친구를 구출했어! 그런데 돌아가는 방법을 두고 의견이 달라. 어떻게 할까?",
    choices: [
      {
        text: "🏃 친구 말대로 빨리 출발한다. 친구 걱정이 중요하니까",
        feedback: "친구가 \"고마워!\" 라며 환하게 웃어. 오늘 모험 덕분에 더 가까워진 것 같아 💕",
        skills: ["prosocial", "emotion"],
      },
      {
        text: "🗣️ \"잠깐만, 외계 친구들에게 작별 인사하고 가고 싶어\" 솔직히 말한다",
        feedback: "친구가 \"그래, 그게 맞겠다\" 하며 같이 인사해줘. 솔직하게 말했더니 이해해줬어 🌟",
        skills: ["perspective", "conflict"],
      },
      {
        text: "⏱️ \"5분 안에 인사하고 같이 출발하자!\" 고 제안한다",
        feedback: "둘 다 웃으며 고개를 끄덕여. 서로가 원하는 걸 모두 해결했어! 🎉",
        skills: ["conflict", "perspective"],
      },
    ],
  },
];

const SKILL_INFO: Record<SocialSkill, { label: string; color: string; bg: string }> = {
  emotion:     { label: "감정 인식",  color: "#FF9F43", bg: "#FFF3E0" },
  perspective: { label: "조망수용",   color: "#A29BFE", bg: "#F0EFFF" },
  prosocial:   { label: "친사회성",   color: "#54A0FF", bg: "#EEF5FF" },
  conflict:    { label: "갈등 해결",  color: "#00B894", bg: "#F0FFF8" },
};

const PROFILES: Record<SocialSkill, { type: string; emoji: string; desc: string }> = {
  emotion:     { type: "감정 탐정형",     emoji: "🔍", desc: "친구의 마음을 잘 읽어내는 타입이야!" },
  perspective: { type: "다리 놓기형",     emoji: "🌟", desc: "상대방 입장에서 생각하는 타입이야!" },
  prosocial:   { type: "씩씩한 도우미형", emoji: "💪", desc: "먼저 나서서 도와주는 용감한 타입이야!" },
  conflict:    { type: "문제 해결사형",   emoji: "🎯", desc: "어려운 상황을 슬기롭게 푸는 타입이야!" },
};

const MAX_SCORES: SkillScores = { emotion: 6, perspective: 5, prosocial: 6, conflict: 5 };
const SKILL_ORDER: SocialSkill[] = ["emotion", "perspective", "prosocial", "conflict"];

function generateSessionId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function SocialStoryGame() {
  const [stage, setStage] = useState<GameStage>("character-select");
  const [character, setCharacter] = useState<Character | null>(null);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [chosenIdx, setChosenIdx] = useState<number | null>(null);
  const [scores, setScores] = useState<SkillScores>({ emotion: 0, perspective: 0, prosocial: 0, conflict: 0 });
  const [entered, setEntered] = useState(false);
  const [npcHappy, setNpcHappy] = useState(false);
  const [fading, setFading] = useState(false);

  const sessionId = useRef<string>("");
  const sceneStartTime = useRef<number>(0);

  useEffect(() => {
    if (stage !== "scene") return;
    setEntered(false);
    setNpcHappy(false);
    sceneStartTime.current = Date.now();
    const t = setTimeout(() => setEntered(true), 60);
    return () => clearTimeout(t);
  }, [stage, sceneIndex]);

  function handleSelectCharacter(c: Character) {
    setCharacter(c);
    setStage("story-intro");
  }

  function handleStartStory() {
    sessionId.current = generateSessionId();
    setStage("scene");
  }

  function handleChoice(idx: number) {
    if (chosenIdx !== null) return;
    const scene = SCENES[sceneIndex];
    const choice = scene.choices[idx];
    const reactionMs = Date.now() - sceneStartTime.current;

    setScores((prev) => {
      const next = { ...prev };
      choice.skills.forEach((s) => { next[s] += 1; });
      return next;
    });
    setNpcHappy(true);
    setChosenIdx(idx);

    const record: ResponseRecord = {
      sessionId: sessionId.current,
      characterId: character?.id ?? "unknown",
      sceneId: scene.id,
      sceneTitle: scene.title,
      choiceIdx: idx,
      choiceText: choice.text,
      reactionTimeMs: reactionMs,
      skillsAwarded: choice.skills,
      timestamp: new Date().toISOString(),
    };
    saveSocialResponse(record);
  }

  function handleNext() {
    setFading(true);
    setTimeout(() => {
      if (sceneIndex + 1 < SCENES.length) {
        setSceneIndex((i) => i + 1);
        setChosenIdx(null);
      } else {
        saveBadge({ id: "social-master", packName: "사회", label: "관계 고수", emoji: "🤝" });
        setStage("result");
      }
      setFading(false);
    }, 280);
  }

  function handleReset() {
    setStage("character-select");
    setCharacter(null);
    setSceneIndex(0);
    setChosenIdx(null);
    setScores({ emotion: 0, perspective: 0, prosocial: 0, conflict: 0 });
    setEntered(false);
    setNpcHappy(false);
    setFading(false);
  }

  function getDominantSkill(): SocialSkill {
    return SKILL_ORDER.reduce((best, skill) =>
      scores[skill] / MAX_SCORES[skill] > scores[best] / MAX_SCORES[best] ? skill : best
    , SKILL_ORDER[0]);
  }

  function renderNPC(npcType: 1 | 2 | 3, size: number) {
    if (npcType === 1) return <AlienNPC1 size={size} happy={npcHappy} />;
    if (npcType === 2) return <AlienNPC2 size={size} happy={npcHappy} />;
    return <AlienNPC3 size={size} happy={npcHappy} />;
  }

  // ── Character Select ────────────────────────────────────────────────────────
  if (stage === "character-select") {
    return (
      <div>
        <div
          className="rounded-3xl px-6 py-5 mb-5 text-center"
          style={{
            background: "linear-gradient(135deg, #0D0820 0%, #2D1B69 100%)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Stars />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="text-3xl mb-1">🪐</div>
            <p className="text-lg font-black text-white">우주 친구 구출 대작전</p>
            <p className="text-xs mt-1" style={{ color: "#C4B5FD" }}>함께 모험할 캐릭터를 골라봐!</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {CHARACTERS.map((c, i) => (
            <button
              key={c.id}
              onClick={() => handleSelectCharacter(c)}
              className="rounded-3xl pt-5 pb-4 px-4 text-center shadow-sm transition-transform active:scale-95 hover:scale-105"
              style={{ background: c.bg, border: `3px solid ${c.color}50` }}
            >
              <div className="flex justify-center mb-1">
                {c.id === "panda"
                  ? <PandaChar size={90} animate={i % 2 === 0} />
                  : <PuppyChar size={90} animate={i % 2 === 1} />
                }
              </div>
              <p className="text-base font-black mt-1" style={{ color: c.color }}>{c.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{c.trait}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Story Intro ─────────────────────────────────────────────────────────────
  if (stage === "story-intro" && character) {
    return (
      <div>
        <div
          className="rounded-3xl px-6 py-6 mb-5 text-center"
          style={{
            background: "linear-gradient(135deg, #0D0820 0%, #2D1B69 100%)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Stars />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="flex justify-center mb-3">
              {character.id === "panda"
                ? <PandaChar size={110} animate />
                : <PuppyChar size={110} animate />
              }
            </div>
            <p className="text-xl font-black text-white">{character.name}</p>
            <p className="text-xs mt-1" style={{ color: "#C4B5FD" }}>{character.trait}</p>
          </div>
        </div>
        <div
          className="rounded-3xl px-5 py-5 mb-5"
          style={{ background: "#F8F9FF", border: "2px solid #E0E7FF" }}
        >
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
        <button
          onClick={handleStartStory}
          className="btn-main w-full py-4 rounded-2xl text-white font-black text-base"
          style={{ background: `linear-gradient(135deg, ${character.color}, #A29BFE)` }}
        >
          탐험 시작! 🚀
        </button>
      </div>
    );
  }

  // ── Scene ───────────────────────────────────────────────────────────────────
  if (stage === "scene" && character) {
    const scene = SCENES[sceneIndex];
    const npcSize = 72;
    const playerSize = 82;

    return (
      <div style={{ opacity: fading ? 0 : 1, transition: "opacity 0.28s ease" }}>
        {/* Title badge */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ color: character.color, background: character.bg }}
          >
            {scene.title}
          </span>
        </div>

        {/* Scene background */}
        <div
          className="rounded-3xl mb-4 overflow-hidden"
          style={{
            background: scene.bgGradient,
            height: 220,
            position: "relative",
          }}
        >
          <Stars />

          {/* Ground */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 60,
              background: scene.groundColor,
              borderRadius: "60% 60% 0 0 / 30% 30% 0 0",
            }}
          />

          {/* Player character (left) */}
          <div
            style={{
              position: "absolute",
              bottom: 24,
              left: 16,
              transform: entered ? "translateX(0)" : "translateX(-130px)",
              transition: "transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)",
              zIndex: 2,
            }}
          >
            {character.id === "panda"
              ? <PandaChar size={playerSize} />
              : <PuppyChar size={playerSize} />
            }
          </div>

          {/* NPC + speech bubble (right) */}
          <div
            style={{
              position: "absolute",
              bottom: 20,
              right: 12,
              transform: entered ? "translateX(0)" : "translateX(130px)",
              transition: "transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s",
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 6,
            }}
          >
            {entered && (
              <div className="animate-pop">
                <SpeechBubble text={scene.npcSpeech} side="right" />
              </div>
            )}
            {renderNPC(scene.npcType, npcSize)}
          </div>
        </div>

        {/* Question */}
        <div
          className="rounded-2xl px-4 py-3 mb-3"
          style={{ background: "#F8F9FF", border: "2px solid #E0E7FF" }}
        >
          <p className="text-sm text-gray-700 leading-relaxed font-semibold text-center">
            {scene.question}
          </p>
        </div>

        {/* Choices */}
        <div className="flex flex-col gap-2.5 mb-3">
          {scene.choices.map((choice, idx) => {
            const isChosen = chosenIdx === idx;
            const isDisabled = chosenIdx !== null;
            return (
              <button
                key={idx}
                onClick={() => handleChoice(idx)}
                disabled={isDisabled}
                className="rounded-2xl px-4 py-3.5 text-left text-sm font-semibold shadow-sm transition-all"
                style={{
                  background: isChosen ? character.bg : "#fff",
                  border: isChosen ? `2px solid ${character.color}` : "2px solid #E5EAF0",
                  color: isChosen ? character.color : "#444",
                  opacity: isDisabled && !isChosen ? 0.38 : 1,
                  transform: isChosen ? "scale(1.01)" : "scale(1)",
                }}
              >
                {choice.text}
              </button>
            );
          })}
        </div>

        {/* Feedback + continue */}
        {chosenIdx !== null && (
          <div className="animate-pop">
            <div
              className="rounded-2xl px-4 py-3.5 mb-3"
              style={{ background: character.bg, border: `2px solid ${character.color}50` }}
            >
              <p className="text-sm text-gray-600 leading-relaxed">
                {scene.choices[chosenIdx].feedback}
              </p>
            </div>
            <button
              onClick={handleNext}
              className="btn-main w-full py-4 rounded-2xl text-white font-black text-base"
              style={{ background: `linear-gradient(135deg, ${character.color}, #A29BFE)` }}
            >
              {sceneIndex + 1 < SCENES.length ? "계속하기 →" : "결과 보기! 🎊"}
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Result ──────────────────────────────────────────────────────────────────
  if (stage === "result" && character) {
    const dominant = getDominantSkill();
    const profile = PROFILES[dominant];

    return (
      <div>
        {/* Type card */}
        <div
          className="rounded-3xl px-6 py-6 mb-4 text-center animate-pop"
          style={{
            background: "linear-gradient(135deg, #0D0820 0%, #2D1B69 100%)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Stars />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="text-5xl mb-2">{profile.emoji}</div>
            <p className="text-xl font-black text-white">{profile.type}</p>
            <p className="text-sm mt-1" style={{ color: "#C4B5FD" }}>{profile.desc}</p>
          </div>
        </div>

        {/* Domain bars */}
        <div
          className="rounded-3xl px-5 py-5 mb-4"
          style={{ background: "#F8F9FF", border: "2px solid #E0E7FF" }}
        >
          <p className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wide">사회성 프로필</p>
          {SKILL_ORDER.map((skill) => {
            const info = SKILL_INFO[skill];
            const pct = Math.round((scores[skill] / MAX_SCORES[skill]) * 100);
            return (
              <div key={skill} className="mb-4">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold" style={{ color: info.color }}>{info.label}</span>
                  <span className="text-xs font-bold" style={{ color: info.color }}>{pct}%</span>
                </div>
                <div className="h-3.5 rounded-full overflow-hidden" style={{ background: "#E5EAF0" }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, ${info.color}, ${info.color}cc)`,
                      transition: "width 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Badge */}
        <div
          className="rounded-3xl px-5 py-4 mb-4 text-center"
          style={{ background: "#F0F8FF", border: "2px solid #54A0FF30" }}
        >
          <div className="text-4xl mb-1">🏅</div>
          <p className="text-base font-black text-blue-400">관계 고수 뱃지 획득!</p>
          <p className="text-xs text-gray-400 mt-1">우주 모험을 무사히 완수했어요</p>
        </div>

        <button
          onClick={handleReset}
          className="w-full py-4 rounded-2xl font-black text-base transition-transform active:scale-95 hover:scale-105"
          style={{ background: "#EEF5FF", color: "#54A0FF", border: "2px solid #54A0FF30" }}
        >
          다시 하기 🔄
        </button>
      </div>
    );
  }

  return null;
}
