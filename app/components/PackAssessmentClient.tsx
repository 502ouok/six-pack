"use client";
import { useState } from "react";
import Link from "next/link";

export type Question = {
  id: number;
  text: string;
  emoji: string;
  reverse?: boolean;
};

export type ResultLevel = {
  minScore: number;
  label: string;
  emoji: string;
  sub: string;
  color: string;
  bg: string;
};

export type PackConfig = {
  packName: string;
  packEmoji: string;
  packColor: string;
  packDesc: string;
  gradientTo: string;
  questions: Question[];
  resultLevels: ResultLevel[];
};

const scale = [
  { value: 1, emoji: "😭", label: "전혀요", color: "#FF6B6B", bg: "#FFF0F0", selectedBg: "linear-gradient(135deg,#FF6B6B,#FF8E53)" },
  { value: 2, emoji: "😟", label: "별로요", color: "#FF9F43", bg: "#FFF8EE", selectedBg: "linear-gradient(135deg,#FF9F43,#FFCC02)" },
  { value: 3, emoji: "😐", label: "보통요", color: "#54A0FF", bg: "#EEF5FF", selectedBg: "linear-gradient(135deg,#54A0FF,#74B9FF)" },
  { value: 4, emoji: "😊", label: "그래요", color: "#A29BFE", bg: "#F3F0FF", selectedBg: "linear-gradient(135deg,#A29BFE,#6C5CE7)" },
  { value: 5, emoji: "🤩", label: "완전요!", color: "#00B894", bg: "#F0FFF8", selectedBg: "linear-gradient(135deg,#00B894,#55EFC4)" },
];

function calcScore(ans: number[], questions: Question[]) {
  const total = ans.reduce((sum, val, i) => {
    const raw = questions[i].reverse ? 6 - val : val;
    return sum + raw;
  }, 0);
  return Math.round(((total - questions.length) / (questions.length * 4)) * 100);
}

export default function PackAssessmentClient({ config }: { config: PackConfig }) {
  const { packName, packEmoji, packColor, packDesc, gradientTo, questions, resultLevels } = config;
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const q = questions[current];
  const progress = Math.round((current / questions.length) * 100);

  function handleNext() {
    if (selected === null) return;
    const newAnswers = [...answers, selected];
    if (current + 1 >= questions.length) {
      setAnswers(newAnswers);
      setDone(true);
    } else {
      setAnswers(newAnswers);
      setCurrent(current + 1);
      setSelected(null);
    }
  }

  /* ─── 결과 화면 ─── */
  if (done) {
    const score = calcScore(answers, questions);
    const level = [...resultLevels].sort((a, b) => b.minScore - a.minScore).find((l) => score >= l.minScore) ?? resultLevels[resultLevels.length - 1];

    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
        style={{ background: "linear-gradient(180deg,#E3F4FF 0%,#FFF9F0 100%)" }}
      >
        <span className="fixed top-8 left-6 text-3xl opacity-30 animate-float pointer-events-none">⭐</span>
        <span className="fixed top-20 right-8 text-2xl opacity-30 animate-float-delay pointer-events-none">💫</span>

        <div className="w-full max-w-sm text-center">
          <div className="text-7xl mb-3 animate-float-slow">{level.emoji}</div>
          <h2 className="text-3xl font-black text-gray-700 mb-1">{packName} 팩 완료!</h2>
          <p className="text-gray-400 text-sm mb-8">솔직하게 답해줘서 고마워요 🙏</p>

          <div
            className="rounded-3xl p-8 mb-4 shadow-sm"
            style={{ background: level.bg, border: `3px solid ${level.color}50` }}
          >
            <div className="relative inline-block mb-2">
              <p className="text-7xl font-black" style={{ color: level.color }}>{score}</p>
              <span className="absolute -top-1 -right-6 text-2xl font-black text-gray-400">점</span>
            </div>
            <p className="text-xl font-black mt-2" style={{ color: level.color }}>{level.label}</p>
            <p className="text-sm text-gray-400 mt-1">{level.sub}</p>
          </div>

          <div className="rounded-2xl p-4 mb-6" style={{ background: "rgba(255,255,255,0.7)" }}>
            <div className="flex justify-between text-xs text-gray-400 mb-2 font-bold">
              <span>0점</span><span>{packName} 팩</span><span>100점</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
              <div
                className="h-4 rounded-full transition-all duration-1000"
                style={{ width: `${score}%`, background: `linear-gradient(90deg, ${level.color}, ${level.color}99)` }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="btn-main font-black text-lg py-4 rounded-2xl text-white text-center"
              style={{ background: `linear-gradient(135deg,${packColor},${gradientTo})`, boxShadow: `0 6px 20px ${packColor}44` }}
            >
              {packEmoji} 홈으로 돌아가기
            </Link>
            <Link
              href="/dashboard"
              className="btn-main font-bold text-base py-3 rounded-2xl text-center"
              style={{ background: "rgba(255,255,255,0.7)", border: "2px solid #e5e7eb", color: "#6b7280" }}
            >
              📊 대시보드 보기
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* ─── 질문 화면 ─── */
  return (
    <main
      className="min-h-screen flex flex-col px-5 py-8"
      style={{ background: "linear-gradient(180deg,#E3F4FF 0%,#FFF9F0 100%)" }}
    >
      <div className="flex items-center justify-between mb-5">
        <Link href="/" className="flex items-center gap-1 text-sm font-bold text-gray-400 hover:text-gray-600 transition">
          ← 뒤로
        </Link>
        <span className="text-sm font-black text-gray-400">{current + 1} / {questions.length}</span>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm"
          style={{ background: packColor + "20", border: `2px solid ${packColor}40` }}
        >
          {packEmoji}
        </div>
        <div>
          <h1 className="text-lg font-black text-gray-700">{packName} 팩</h1>
          <p className="text-xs text-gray-400 font-bold">{packDesc}</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.max(progress, 4)}%`, background: `linear-gradient(90deg, ${packColor}, ${gradientTo})` }}
          />
        </div>
        <p className="text-xs text-gray-300 mt-1 text-right font-bold">{progress}%</p>
      </div>

      <div
        className="rounded-3xl p-6 mb-6 shadow-sm text-center"
        style={{ background: "rgba(255,255,255,0.75)", border: "2px solid rgba(255,255,255,0.9)" }}
      >
        <div className="text-5xl mb-4 animate-float-slow">{q.emoji}</div>
        <p className="text-lg font-black text-gray-700 leading-relaxed">{q.text}</p>
      </div>

      <div className="flex gap-2 mb-6">
        {scale.map((s) => {
          const isSelected = selected === s.value;
          return (
            <button
              key={s.value}
              onClick={() => setSelected(s.value)}
              className="flex-1 flex flex-col items-center py-4 rounded-2xl transition-all duration-200"
              style={{
                background: isSelected ? s.selectedBg : s.bg,
                border: isSelected ? `3px solid ${s.color}` : `2px solid ${s.color}30`,
                transform: isSelected ? "scale(1.1) translateY(-4px)" : "scale(1)",
                boxShadow: isSelected ? `0 8px 20px ${s.color}44` : "none",
              }}
            >
              <span className="transition-all duration-200" style={{ fontSize: isSelected ? "2.2rem" : "1.8rem" }}>
                {s.emoji}
              </span>
              <span className="text-xs font-black mt-1 transition-all" style={{ color: isSelected ? "#fff" : s.color }}>
                {s.label}
              </span>
            </button>
          );
        })}
      </div>

      <button
        onClick={handleNext}
        disabled={selected === null}
        className="btn-main w-full py-4 rounded-2xl font-black text-lg text-white transition-all"
        style={
          selected !== null
            ? { background: `linear-gradient(135deg,${packColor},${gradientTo})`, boxShadow: `0 6px 20px ${packColor}44` }
            : { background: "#e5e7eb", color: "#9ca3af", cursor: "not-allowed" }
        }
      >
        {selected === null
          ? "위에서 골라봐요 👆"
          : current + 1 === questions.length
          ? "완료 ✓"
          : "다음 →"}
      </button>
    </main>
  );
}
