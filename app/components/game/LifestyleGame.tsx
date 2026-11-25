"use client";
import { useState, useEffect } from "react";
import { saveBadge } from "@/lib/badges";

const habits = [
  { id: "sleep", emoji: "🌙", text: "어젯밤 10시 전에 잠들었나요?" },
  { id: "meal", emoji: "🍳", text: "오늘 아침을 먹었나요?" },
  { id: "water", emoji: "💧", text: "오늘 물을 여러 번 마셨나요?" },
  { id: "move", emoji: "🤸", text: "앉아서 공부하다 중간에 일어나 움직였나요?" },
  { id: "screen", emoji: "📱", text: "오늘 화면 보는 시간을 줄이려고 노력했나요?" },
];

const HABIT_KEY = "gf_lifestyle_habits";

const plantStages = [
  { emoji: "🌰", label: "씨앗" },
  { emoji: "🌱", label: "싹" },
  { emoji: "🌿", label: "새싹" },
  { emoji: "🌳", label: "나무" },
  { emoji: "🌸", label: "꽃나무" },
];

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function loadToday(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const all = JSON.parse(localStorage.getItem(HABIT_KEY) ?? "{}") as Record<string, string[]>;
    return all[getTodayKey()] ?? [];
  } catch {
    return [];
  }
}

function saveToday(ids: string[]) {
  try {
    const all = JSON.parse(localStorage.getItem(HABIT_KEY) ?? "{}") as Record<string, string[]>;
    all[getTodayKey()] = ids;
    localStorage.setItem(HABIT_KEY, JSON.stringify(all));
  } catch {/* */}
}

export default function LifestyleGame() {
  const [checked, setChecked] = useState<string[]>(() => loadToday());

  useEffect(() => {
    saveToday(checked);
    if (checked.length >= 5) {
      saveBadge({ id: "lifestyle-planter", packName: "생활", label: "생활 정원사", emoji: "🌸" });
    }
  }, [checked]);

  function toggle(id: string) {
    setChecked((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  const count = checked.length;
  const plant = plantStages[Math.min(count, plantStages.length - 1)];

  return (
    <main className="min-h-screen flex flex-col px-5 py-6"
      style={{ background: "linear-gradient(180deg,#FFF0F8 0%,#FFF8EE 100%)" }}>

      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-black text-pink-400">오늘의 생활 돌봄</span>
        <span className="text-sm font-black text-gray-400">{count}/{habits.length}</span>
      </div>

      <div className="flex flex-col items-center mb-6 py-4 rounded-3xl"
        style={{ background: "rgba(255,255,255,0.7)", border: "2px solid #FD79A820" }}>
        <div className="text-7xl mb-2 animate-float-slow">{plant.emoji}</div>
        <p className="text-sm font-black text-pink-400">{plant.label}</p>
        <p className="text-xs text-gray-400 mt-1">
          {count === 0 && "오늘 습관을 체크하면 식물이 자라요!"}
          {count >= 1 && count < 3 && "조금씩 자라고 있어요 🌿"}
          {count >= 3 && count < 5 && "많이 자랐어요! 조금만 더!"}
          {count >= 5 && "오늘 완벽한 하루예요! 🌸"}
        </p>
        <div className="flex gap-1 mt-3">
          {habits.map((_, i) => (
            <div key={i} className="w-6 h-2 rounded-full transition-all duration-300"
              style={{ background: i < count ? "#FD79A8" : "#e5e7eb" }} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {habits.map((h) => {
          const isChecked = checked.includes(h.id);
          return (
            <button key={h.id} onClick={() => toggle(h.id)}
              className="flex items-center gap-4 rounded-3xl p-4 text-left transition-all duration-300 btn-main"
              style={
                isChecked
                  ? { background: "linear-gradient(135deg,#FD79A8,#E84393)", boxShadow: "0 6px 20px #FD79A844" }
                  : { background: "rgba(255,255,255,0.8)", border: "2px solid #FD79A830" }
              }>
              <span className="text-3xl">{h.emoji}</span>
              <span className={`text-sm font-black flex-1 leading-relaxed ${isChecked ? "text-white" : "text-gray-700"}`}>
                {h.text}
              </span>
              <span className="text-xl">{isChecked ? "✅" : "⬜"}</span>
            </button>
          );
        })}
      </div>

      {count >= 5 && (
        <div className="animate-pop mt-4 rounded-3xl p-5 text-center shadow-sm"
          style={{ background: "linear-gradient(135deg,#FD79A8,#E84393)" }}>
          <p className="text-xl font-black text-white mb-1">🌸 꽃나무 완성!</p>
          <p className="text-sm text-white/80">생활 정원사 뱃지를 획득했어요!</p>
        </div>
      )}

      <p className="text-center text-xs text-gray-300 font-bold mt-6">
        매일 조금씩 좋은 습관이 쌓여요 🌱
      </p>
    </main>
  );
}
