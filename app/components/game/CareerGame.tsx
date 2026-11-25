"use client";
import { useState } from "react";
import { saveBadge } from "@/lib/badges";

type StrengthKey = "창의" | "소통" | "탐구" | "돌봄" | "도전" | "계획";

const strengths: Record<StrengthKey, { emoji: string; desc: string; jobs: string }> = {
  창의: { emoji: "🎨", desc: "상상력이 풍부하고 아이디어가 넘쳐요!", jobs: "디자이너, 작가, 예술가, 발명가" },
  소통: { emoji: "🗣️", desc: "다른 사람과 이야기하고 함께하는 걸 잘해요!", jobs: "선생님, 방송인, 상담사" },
  탐구: { emoji: "🔬", desc: "궁금한 것을 끝까지 알아내는 힘이 있어요!", jobs: "과학자, 의사, 연구원" },
  돌봄: { emoji: "💛", desc: "다른 사람을 배려하는 따뜻한 마음이 있어요!", jobs: "의사, 간호사, 사회복지사" },
  도전: { emoji: "🚀", desc: "새로운 것에 도전하는 용기가 있어요!", jobs: "운동선수, 창업가, 탐험가" },
  계획: { emoji: "📋", desc: "차근차근 계획하고 정리하는 걸 잘해요!", jobs: "건축가, 프로그래머, 경영인" },
};

const pairs: { a: { text: string; key: StrengthKey }; b: { text: string; key: StrengthKey } }[] = [
  { a: { text: "혼자 그림이나 만들기를 해요", key: "창의" }, b: { text: "친구들과 이야기하고 노는 게 좋아요", key: "소통" } },
  { a: { text: "새로운 걸 배우고 알아가는 게 재미있어요", key: "탐구" }, b: { text: "친구나 가족을 도와주는 게 좋아요", key: "돌봄" } },
  { a: { text: "어려운 도전을 해내면 뿌듯해요", key: "도전" }, b: { text: "계획을 세우고 차근차근 하는 게 좋아요", key: "계획" } },
  { a: { text: "상상하고 꾸미는 걸 좋아해요", key: "창의" }, b: { text: "무언가를 직접 해보고 경험하는 게 좋아요", key: "도전" } },
  { a: { text: "다른 사람의 마음을 잘 알아요", key: "돌봄" }, b: { text: "궁금한 걸 끝까지 파헤쳐요", key: "탐구" } },
  { a: { text: "발표하거나 사람들 앞에서 말하는 걸 좋아해요", key: "소통" }, b: { text: "조용히 혼자 집중하는 게 좋아요", key: "계획" } },
  { a: { text: "새로운 아이디어를 많이 생각해요", key: "창의" }, b: { text: "팀을 이끌거나 함께 협력해요", key: "소통" } },
  { a: { text: "책이나 자료를 찾아보는 걸 좋아해요", key: "탐구" }, b: { text: "어려운 상황에서도 포기하지 않아요", key: "도전" } },
  { a: { text: "다른 사람을 위로하고 돕는 게 보람있어요", key: "돌봄" }, b: { text: "일을 순서대로 정리하는 게 좋아요", key: "계획" } },
  { a: { text: "예쁘거나 멋진 걸 만들어요", key: "창의" }, b: { text: "새로운 것들을 발견하고 연구해요", key: "탐구" } },
];

export default function CareerGame() {
  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState<Partial<Record<StrengthKey, number>>>({});
  const [selected, setSelected] = useState<"a" | "b" | null>(null);
  const [done, setDone] = useState(false);

  function handleSelect(side: "a" | "b") {
    if (selected) return;
    setSelected(side);
    const key = pairs[current][side].key;
    setScores((prev) => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }));
  }

  function handleNext() {
    if (current + 1 >= pairs.length) {
      saveBadge({ id: "career-discovery", packName: "진로", label: "강점 발견자", emoji: "⭐" });
      setDone(true);
    } else {
      setCurrent(current + 1);
      setSelected(null);
    }
  }

  if (done) {
    const sorted = (Object.entries(scores) as [StrengthKey, number][])
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    return (
      <main className="min-h-screen flex flex-col px-5 py-6"
        style={{ background: "linear-gradient(180deg,#FFFBEE 0%,#FFF8EE 100%)" }}>
        <h2 className="text-2xl font-black text-gray-700 text-center mb-2">내 강점 TOP 3!</h2>
        <p className="text-center text-sm text-gray-400 mb-6">이런 분야에서 빛날 수 있어요 ✨</p>

        <div className="flex flex-col gap-4 mb-8">
          {sorted.map(([key], rank) => {
            const s = strengths[key];
            const medals = ["🥇", "🥈", "🥉"];
            return (
              <div key={key} className="rounded-3xl p-5 shadow-sm"
                style={{ background: "rgba(255,255,255,0.9)", border: "3px solid #F9CA2450" }}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{medals[rank]}</span>
                  <span className="text-3xl">{s.emoji}</span>
                  <span className="text-xl font-black text-gray-700">{key}</span>
                </div>
                <p className="text-sm font-bold text-gray-500 mb-1">{s.desc}</p>
                <p className="text-xs text-gray-300">관련 직업: {s.jobs}</p>
              </div>
            );
          })}
        </div>

        <div className="rounded-3xl px-6 py-4 text-center mb-6"
          style={{ background: "linear-gradient(135deg,#F9CA24,#FFDD59)" }}>
          <div className="text-4xl mb-1">🏅</div>
          <p className="text-lg font-black text-white">강점 발견자 뱃지 획득!</p>
        </div>

        <button onClick={() => { setCurrent(0); setScores({}); setSelected(null); setDone(false); }}
          className="btn-main w-full py-4 rounded-2xl font-black text-white text-lg"
          style={{ background: "linear-gradient(135deg,#F9CA24,#FFDD59)", boxShadow: "0 6px 20px #F9CA2444" }}>
          ⭐ 다시 발견하기
        </button>
      </main>
    );
  }

  const pair = pairs[current];

  return (
    <main className="min-h-screen flex flex-col px-5 py-6"
      style={{ background: "linear-gradient(180deg,#FFFBEE 0%,#FFF8EE 100%)" }}>

      <div className="flex items-center justify-between mb-5">
        <span className="text-sm font-black text-yellow-500">내 강점 발견하기</span>
        <span className="text-sm font-black text-gray-400">{current + 1} / {pairs.length}</span>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-2 mb-6 overflow-hidden">
        <div className="h-2 rounded-full transition-all duration-500"
          style={{ width: `${(current / pairs.length) * 100}%`, background: "linear-gradient(90deg,#F9CA24,#FFDD59)" }} />
      </div>

      <p className="text-center text-base font-black text-gray-600 mb-5">어느 쪽이 더 나에게 가깝나요?</p>

      <div className="flex flex-col gap-4 flex-1">
        {(["a", "b"] as const).map((side) => (
          <button key={side} onClick={() => handleSelect(side)}
            className="flex-1 rounded-3xl p-6 flex flex-col items-center justify-center text-center transition-all duration-200 btn-main min-h-[120px]"
            style={
              selected === side
                ? { background: "linear-gradient(135deg,#F9CA24,#FFDD59)", boxShadow: "0 8px 25px #F9CA2444", border: "3px solid #F9CA24" }
                : selected !== null
                  ? { background: "rgba(255,255,255,0.4)", border: "2px solid #e5e7eb", color: "#9ca3af" }
                  : { background: "rgba(255,255,255,0.8)", border: "2px solid #F9CA2430" }
            }>
            <span className={`text-sm font-black leading-relaxed ${selected === side ? "text-white" : "text-gray-700"}`}>
              {pair[side].text}
            </span>
          </button>
        ))}
      </div>

      {selected && (
        <button onClick={handleNext}
          className="btn-main w-full py-4 rounded-2xl font-black text-lg text-white mt-5"
          style={{ background: "linear-gradient(135deg,#F9CA24,#FFDD59)", boxShadow: "0 6px 20px #F9CA2444" }}>
          {current + 1 >= pairs.length ? "결과 보기 ✨" : "다음 →"}
        </button>
      )}
    </main>
  );
}
