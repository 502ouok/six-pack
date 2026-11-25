"use client";
import { useState } from "react";
import { saveBadge } from "@/lib/badges";

const scenarios = [
  { id: 1, situation: "친구가 내가 오래 그린 그림을 실수로 망쳤어요", emoji: "🎨" },
  { id: 2, situation: "발표를 열심히 했는데 아무도 칭찬을 안 해줬어요", emoji: "📣" },
  { id: 3, situation: "내가 좋아하는 친구가 다른 친구와 더 많이 놀아요", emoji: "👭" },
  { id: 4, situation: "시험에서 기대했던 것보다 좋은 점수를 받았어요", emoji: "📝" },
  { id: 5, situation: "선생님한테 오해를 받아서 혼이 났어요", emoji: "😮" },
];

const emotions = [
  { id: "화남", emoji: "😤", label: "화남", feedback: "화가 났군요! 억울하거나 화나는 감정도 모두 괜찮아요 🌟" },
  { id: "슬픔", emoji: "😢", label: "슬픔", feedback: "슬픈 마음이 들었군요. 그 감정을 알아채는 게 정말 용감한 거예요 💙" },
  { id: "무서움", emoji: "😨", label: "무서움", feedback: "무섭거나 불안한 느낌이었군요. 그런 기분이 들 수 있어요 🤗" },
  { id: "기쁨", emoji: "😊", label: "기쁨", feedback: "기쁘고 행복한 느낌이 들었군요. 좋은 감정도 소중히 느껴봐요 ✨" },
  { id: "당황", emoji: "😳", label: "당황", feedback: "당황스러운 기분이었군요. 어떻게 해야 할지 몰라도 괜찮아요 💛" },
  { id: "짜증", emoji: "😒", label: "짜증", feedback: "짜증이 났군요! 그 기분도 충분히 이해해요 🌈" },
];

export default function EmotionalGame() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [done, setDone] = useState(false);

  const scenario = scenarios[current];
  const chosenEmotion = emotions.find((e) => e.id === selected);

  function handleSelect(id: string) {
    if (showFeedback) return;
    setSelected(id);
    setShowFeedback(true);
  }

  function handleNext() {
    if (current + 1 >= scenarios.length) {
      saveBadge({ id: "emotional-detective", packName: "정서", label: "감정 탐정", emoji: "🔍" });
      setDone(true);
    } else {
      setCurrent(current + 1);
      setSelected(null);
      setShowFeedback(false);
    }
  }

  if (done) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center"
        style={{ background: "linear-gradient(180deg,#FFF8EE 0%,#FFF0F0 100%)" }}>
        <div className="text-7xl mb-4 animate-float-slow">🔍</div>
        <h2 className="text-3xl font-black text-gray-700 mb-2">감정 탐정 완료!</h2>
        <p className="text-gray-400 text-sm mb-6">내 감정을 알아채는 연습, 정말 잘 했어요!</p>
        <div className="rounded-3xl px-8 py-6 mb-8 shadow-sm"
          style={{ background: "#FFF8EE", border: "3px solid #FF9F4350" }}>
          <div className="text-5xl mb-2">🏅</div>
          <p className="text-xl font-black text-orange-400">감정 탐정 뱃지 획득!</p>
          <p className="text-sm text-gray-400 mt-1">감정을 이름 붙여봤어요</p>
        </div>
        <button onClick={() => { setCurrent(0); setSelected(null); setShowFeedback(false); setDone(false); }}
          className="btn-main w-full max-w-xs py-4 rounded-2xl font-black text-white text-lg"
          style={{ background: "linear-gradient(135deg,#FF9F43,#FFCC02)", boxShadow: "0 6px 20px #FF9F4344" }}>
          🌈 한 번 더 하기
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col px-5 py-6"
      style={{ background: "linear-gradient(180deg,#FFF8EE 0%,#FFF0F0 100%)" }}>

      <div className="flex items-center justify-between mb-5">
        <div className="text-sm font-black text-gray-400">감정 탐정</div>
        <span className="text-sm font-black text-gray-400">{current + 1} / {scenarios.length}</span>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-2 mb-6 overflow-hidden">
        <div className="h-2 rounded-full transition-all duration-500"
          style={{ width: `${((current) / scenarios.length) * 100}%`, background: "linear-gradient(90deg,#FF9F43,#FFCC02)" }} />
      </div>

      <div className="rounded-3xl p-6 mb-5 shadow-sm text-center"
        style={{ background: "rgba(255,255,255,0.8)", border: "2px solid #FF9F4330" }}>
        <div className="text-5xl mb-3 animate-float-slow">{scenario.emoji}</div>
        <p className="text-xs font-bold text-orange-300 mb-2 uppercase tracking-widest">이런 상황이라면?</p>
        <p className="text-lg font-black text-gray-700 leading-relaxed">{scenario.situation}</p>
      </div>

      {!showFeedback ? (
        <>
          <p className="text-center text-sm font-bold text-gray-400 mb-4">어떤 기분이 들 것 같나요?</p>
          <div className="grid grid-cols-3 gap-3">
            {emotions.map((e) => (
              <button key={e.id} onClick={() => handleSelect(e.id)}
                className="flex flex-col items-center py-4 rounded-2xl transition-all duration-200 btn-main"
                style={{ background: "rgba(255,255,255,0.8)", border: "2px solid #FF9F4330" }}>
                <span className="text-3xl mb-1">{e.emoji}</span>
                <span className="text-xs font-black text-gray-500">{e.label}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="animate-pop">
          <div className="rounded-3xl p-6 mb-5 shadow-sm text-center"
            style={{ background: "rgba(255,255,255,0.9)", border: "3px solid #FF9F43" }}>
            <div className="text-4xl mb-2">{chosenEmotion?.emoji}</div>
            <p className="text-base font-black text-orange-400 mb-2">{chosenEmotion?.id}</p>
            <p className="text-sm text-gray-600 leading-relaxed">{chosenEmotion?.feedback}</p>
          </div>
          <button onClick={handleNext}
            className="btn-main w-full py-4 rounded-2xl font-black text-lg text-white"
            style={{ background: "linear-gradient(135deg,#FF9F43,#FFCC02)", boxShadow: "0 6px 20px #FF9F4344" }}>
            {current + 1 >= scenarios.length ? "완료 ✓" : "다음 →"}
          </button>
        </div>
      )}
    </main>
  );
}
