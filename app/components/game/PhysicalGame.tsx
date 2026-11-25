"use client";
import { useState, useEffect } from "react";
import { saveBadge } from "@/lib/badges";

const challenges = [
  { id: "stairs", emoji: "🏃", text: "계단을 10번 이상 올라갔나요?" },
  { id: "run", emoji: "⚽", text: "10분 이상 뛰거나 뛰어놀았나요?" },
  { id: "stretch", emoji: "🤸", text: "스트레칭이나 체조를 했나요?" },
  { id: "ride", emoji: "🚲", text: "자전거, 킥보드, 또는 줄넘기를 했나요?" },
  { id: "dance", emoji: "💃", text: "춤을 추거나 몸을 신나게 움직였나요?" },
];

const STAMP_KEY = "gf_physical_stamps";

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function loadToday(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const all = JSON.parse(localStorage.getItem(STAMP_KEY) ?? "{}") as Record<string, string[]>;
    return all[getTodayKey()] ?? [];
  } catch {
    return [];
  }
}

function saveToday(ids: string[]) {
  try {
    const all = JSON.parse(localStorage.getItem(STAMP_KEY) ?? "{}") as Record<string, string[]>;
    all[getTodayKey()] = ids;
    localStorage.setItem(STAMP_KEY, JSON.stringify(all));
  } catch {/* */}
}

function getStreak(): number {
  try {
    const all = JSON.parse(localStorage.getItem(STAMP_KEY) ?? "{}") as Record<string, string[]>;
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      if (all[key] && all[key].length >= 3) streak++;
      else break;
    }
    return streak;
  } catch {
    return 0;
  }
}

export default function PhysicalGame() {
  const [checked, setChecked] = useState<string[]>(() => loadToday());
  const [stamped, setStamped] = useState<string[]>([]);
  const streak = getStreak();

  useEffect(() => {
    saveToday(checked);
    if (checked.length >= 5) {
      saveBadge({ id: "physical-king", packName: "신체", label: "운동왕", emoji: "🏆" });
    }
  }, [checked]);

  function toggle(id: string) {
    if (checked.includes(id)) {
      setChecked((prev) => prev.filter((c) => c !== id));
    } else {
      setChecked((prev) => [...prev, id]);
      setStamped((prev) => [...prev, id]);
      setTimeout(() => setStamped((prev) => prev.filter((s) => s !== id)), 600);
    }
  }

  const allDone = checked.length >= challenges.length;

  return (
    <main className="min-h-screen flex flex-col px-5 py-6"
      style={{ background: "linear-gradient(180deg,#FFF0F0 0%,#FFF8EE 100%)" }}>

      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-black text-red-400">오늘의 신체 도전</span>
        <span className="text-sm font-black text-gray-400">
          🔥 {streak}일 연속
        </span>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div className="h-3 rounded-full transition-all duration-500"
            style={{ width: `${(checked.length / challenges.length) * 100}%`,
              background: "linear-gradient(90deg,#FF6B6B,#FF8E53)" }} />
        </div>
        <span className="text-sm font-black text-red-400 whitespace-nowrap">{checked.length}/{challenges.length}</span>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        {challenges.map((c) => {
          const isChecked = checked.includes(c.id);
          const isStamping = stamped.includes(c.id);
          return (
            <button key={c.id} onClick={() => toggle(c.id)}
              className="flex items-center gap-4 rounded-3xl p-4 text-left transition-all duration-300 btn-main relative overflow-hidden"
              style={
                isChecked
                  ? { background: "linear-gradient(135deg,#FF6B6B,#FF8E53)", boxShadow: "0 6px 20px #FF6B6B44" }
                  : { background: "rgba(255,255,255,0.8)", border: "2px solid #FF6B6B30" }
              }>
              <span className="text-3xl">{c.emoji}</span>
              <span className={`text-sm font-black flex-1 leading-relaxed ${isChecked ? "text-white" : "text-gray-700"}`}>
                {c.text}
              </span>
              <span className={`text-2xl transition-all duration-300 ${isStamping ? "animate-pop scale-150" : ""}`}>
                {isChecked ? "✅" : "⬜"}
              </span>
            </button>
          );
        })}
      </div>

      {allDone && (
        <div className="animate-pop rounded-3xl p-6 text-center shadow-sm"
          style={{ background: "linear-gradient(135deg,#FF6B6B,#FF8E53)" }}>
          <div className="text-5xl mb-2 animate-float-slow">🏆</div>
          <p className="text-xl font-black text-white mb-1">오늘 모두 완료!</p>
          <p className="text-sm text-white/80">운동왕 뱃지를 획득했어요! 대단해요 💪</p>
        </div>
      )}

      {streak >= 7 && (
        <div className="mt-3 rounded-3xl p-4 text-center"
          style={{ background: "rgba(255,255,255,0.8)", border: "2px solid #FF6B6B30" }}>
          <p className="text-sm font-black text-red-400">🔥 7일 연속 달성! 진짜 운동왕이에요!</p>
        </div>
      )}

      <p className="text-center text-xs text-gray-300 font-bold mt-6">
        오늘 한 활동을 체크해봐요! 내일도 도전할 수 있어요 💪
      </p>
    </main>
  );
}
