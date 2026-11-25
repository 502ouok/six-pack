"use client";
import { useState, useEffect, useCallback } from "react";
import { saveBadge } from "@/lib/badges";

const PAIRS = ["🐶", "🐱", "🦊", "🐸", "🦋", "🌟"];

function createCards() {
  const all = [...PAIRS, ...PAIRS].map((emoji, i) => ({
    id: i,
    emoji,
    isFlipped: false,
    isMatched: false,
  }));
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all;
}

type Card = { id: number; emoji: string; isFlipped: boolean; isMatched: boolean };

export default function CognitiveGame() {
  const [cards, setCards] = useState<Card[]>(createCards);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [done, setDone] = useState(false);
  const [startTime] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (done) return;
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(id);
  }, [done, startTime]);

  const checkMatch = useCallback((sel: number[], current: Card[]) => {
    const [a, b] = sel;
    if (current[a].emoji === current[b].emoji) {
      const next = current.map((c, i) =>
        i === a || i === b ? { ...c, isMatched: true, isFlipped: true } : c
      );
      setCards(next);
      setSelected([]);
      setLocked(false);
      if (next.every((c) => c.isMatched)) {
        saveBadge({ id: "cognitive-focus", packName: "인지", label: "집중왕", emoji: "🧩" });
        setDone(true);
      }
    } else {
      setTimeout(() => {
        setCards((prev) =>
          prev.map((c, i) => (i === a || i === b) && !c.isMatched ? { ...c, isFlipped: false } : c)
        );
        setSelected([]);
        setLocked(false);
      }, 700);
    }
  }, []);

  function handleFlip(i: number) {
    if (locked || cards[i].isFlipped || cards[i].isMatched) return;
    const next = cards.map((c, idx) => idx === i ? { ...c, isFlipped: true } : c);
    setCards(next);
    const newSel = [...selected, i];
    setSelected(newSel);
    if (newSel.length === 2) {
      setMoves((m) => m + 1);
      setLocked(true);
      checkMatch(newSel, next);
    }
  }

  function restart() {
    setCards(createCards());
    setSelected([]);
    setMoves(0);
    setLocked(false);
    setDone(false);
  }

  const score = Math.max(0, 100 - (moves - PAIRS.length) * 5);

  if (done) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center"
        style={{ background: "linear-gradient(180deg,#F3F0FF 0%,#EEF5FF 100%)" }}>
        <div className="text-7xl mb-4 animate-float-slow">🧩</div>
        <h2 className="text-3xl font-black text-gray-700 mb-2">모두 찾았어요!</h2>
        <p className="text-gray-400 text-sm mb-6">집중력이 대단해요!</p>
        <div className="rounded-3xl px-8 py-6 mb-4 shadow-sm w-full max-w-xs"
          style={{ background: "#F3F0FF", border: "3px solid #A29BFE50" }}>
          <p className="text-5xl font-black text-purple-400 mb-1">{score}점</p>
          <p className="text-sm text-gray-400">{moves}번 만에 / {elapsed}초</p>
          <div className="mt-3">
            <div className="text-5xl">🏅</div>
            <p className="text-lg font-black text-purple-400 mt-1">집중왕 뱃지 획득!</p>
          </div>
        </div>
        <button onClick={restart}
          className="btn-main w-full max-w-xs py-4 rounded-2xl font-black text-white text-lg"
          style={{ background: "linear-gradient(135deg,#A29BFE,#6C5CE7)", boxShadow: "0 6px 20px #A29BFE44" }}>
          🧠 다시 하기
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col px-4 py-6"
      style={{ background: "linear-gradient(180deg,#F3F0FF 0%,#EEF5FF 100%)" }}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-black text-purple-400">🧠 기억력 카드</span>
        <div className="flex gap-3 text-sm font-black text-gray-400">
          <span>이동 {moves}회</span>
          <span>{elapsed}초</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto w-full">
        {cards.map((card, i) => (
          <button key={card.id} onClick={() => handleFlip(i)}
            className="aspect-square rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 btn-main"
            style={
              card.isFlipped || card.isMatched
                ? { background: card.isMatched ? "linear-gradient(135deg,#A29BFE,#6C5CE7)" : "white",
                    border: "2px solid #A29BFE",
                    boxShadow: card.isMatched ? "0 4px 15px #A29BFE44" : "none",
                    transform: "rotateY(0deg)" }
                : { background: "linear-gradient(135deg,#A29BFE20,#6C5CE720)",
                    border: "2px solid #A29BFE40",
                    transform: "rotateY(180deg)" }
            }>
            {(card.isFlipped || card.isMatched) ? card.emoji : "❓"}
          </button>
        ))}
      </div>

      <p className="text-center text-sm text-gray-400 font-bold mt-6">카드를 눌러서 짝을 찾아봐요!</p>
    </main>
  );
}
