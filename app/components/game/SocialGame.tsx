"use client";
import { useState } from "react";
import { saveBadge } from "@/lib/badges";

const scenarios = [
  {
    id: 1,
    situation: "점심시간에 새 친구가 혼자 앉아 있어요",
    emoji: "🍱",
    choices: [
      { text: "다가가서 같이 먹자고 말해요", result: "친구가 환하게 웃으며 고마워해요 😊 용기 있는 행동이에요!" },
      { text: "다른 친구들에게도 같이 먹자고 해요", result: "모두 함께 즐겁게 먹어요 🎉 모두를 챙기는 멋진 모습이에요!" },
      { text: "어떻게 할지 몰라서 그냥 앉아요", result: "용기 내기 어려울 때도 있어요. 다음에 조금씩 시도해봐요 💙" },
    ],
  },
  {
    id: 2,
    situation: "친한 친구가 슬퍼보여서 울고 있어요",
    emoji: "😢",
    choices: [
      { text: "왜 슬프냐고 물어봐요", result: "친구가 고민을 털어놓고 많이 가벼워졌어요 🌈 경청이 큰 힘이 돼요!" },
      { text: "조용히 옆에 앉아 있어줘요", result: "말 없이 함께해주는 것도 큰 위로예요 💛 함께 있어주는 것만으로도 충분해요!" },
      { text: "선생님께 알려드려요", result: "선생님의 도움이 친구에게 큰 힘이 됐어요 ✨ 도움을 요청하는 것도 현명해요!" },
    ],
  },
  {
    id: 3,
    situation: "모둠 활동에서 내 의견이 무시당했어요",
    emoji: "📋",
    choices: [
      { text: "차분하게 내 생각을 다시 말해요", result: "자신의 생각을 말하는 건 용기 있는 행동이에요 💪 목소리를 낸 게 대단해요!" },
      { text: "일단 따르고 나중에 이야기해요", result: "때로는 기다렸다가 말하는 것도 현명해요 🌟 상황을 잘 읽었어요!" },
      { text: "속상하지만 참고 넘어가요", result: "참는 것도 힘들어요. 다음에는 용기 내볼 수 있어요 🤗 감정을 느낀 게 중요해요!" },
    ],
  },
  {
    id: 4,
    situation: "규칙을 어기면 게임에서 이길 수 있어요",
    emoji: "🎮",
    choices: [
      { text: "규칙을 지키며 정정당당하게 해요", result: "정직하게 하는 게 진짜 멋진 거예요 🏆 그게 진짜 이기는 거예요!" },
      { text: "규칙을 어기지 않고 더 열심히 해요", result: "노력하는 모습이 정말 멋져요 💪 최선을 다하는 태도가 훌륭해요!" },
      { text: "어떻게 해야 할지 고민돼요", result: "고민한다는 건 양심이 있다는 뜻이에요 ✨ 옳고 그름을 생각하는 게 중요해요!" },
    ],
  },
  {
    id: 5,
    situation: "친구가 다른 친구의 비밀을 말해달라고 해요",
    emoji: "🤫",
    choices: [
      { text: "비밀은 지켜야 해서 말할 수 없다고 해요", result: "신뢰를 지키는 건 정말 중요해요 🌟 믿음직한 친구예요!" },
      { text: "비밀 말고 다른 이야기를 해요", result: "화제를 바꾸는 것도 좋은 방법이에요 😊 똑똑한 선택이에요!" },
      { text: "어떻게 해야 할지 어른에게 물어봐요", result: "어른에게 도움을 구하는 것도 현명해요 💙 판단이 어려울 땐 물어보는 게 맞아요!" },
    ],
  },
];

export default function SocialGame() {
  const [current, setCurrent] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const scenario = scenarios[current];

  function handleChoice(i: number) {
    if (chosen !== null) return;
    setChosen(i);
  }

  function handleNext() {
    if (current + 1 >= scenarios.length) {
      saveBadge({ id: "social-master", packName: "사회", label: "관계 고수", emoji: "🤝" });
      setDone(true);
    } else {
      setCurrent(current + 1);
      setChosen(null);
    }
  }

  if (done) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center"
        style={{ background: "linear-gradient(180deg,#EEF5FF 0%,#F3F0FF 100%)" }}>
        <div className="text-7xl mb-4 animate-float-slow">🤝</div>
        <h2 className="text-3xl font-black text-gray-700 mb-2">관계 고수 완료!</h2>
        <p className="text-gray-400 text-sm mb-6">다양한 상황에서 나만의 선택을 해봤어요!</p>
        <div className="rounded-3xl px-8 py-6 mb-8 shadow-sm"
          style={{ background: "#EEF5FF", border: "3px solid #54A0FF50" }}>
          <div className="text-5xl mb-2">🏅</div>
          <p className="text-xl font-black text-blue-400">관계 고수 뱃지 획득!</p>
          <p className="text-sm text-gray-400 mt-1">사회적 상황을 탐색해봤어요</p>
        </div>
        <button onClick={() => { setCurrent(0); setChosen(null); setDone(false); }}
          className="btn-main w-full max-w-xs py-4 rounded-2xl font-black text-white text-lg"
          style={{ background: "linear-gradient(135deg,#54A0FF,#74B9FF)", boxShadow: "0 6px 20px #54A0FF44" }}>
          🤝 한 번 더 하기
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col px-5 py-6"
      style={{ background: "linear-gradient(180deg,#EEF5FF 0%,#F3F0FF 100%)" }}>

      <div className="flex items-center justify-between mb-5">
        <div className="text-sm font-black text-blue-400">어떻게 할까요?</div>
        <span className="text-sm font-black text-gray-400">{current + 1} / {scenarios.length}</span>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-2 mb-6 overflow-hidden">
        <div className="h-2 rounded-full transition-all duration-500"
          style={{ width: `${(current / scenarios.length) * 100}%`, background: "linear-gradient(90deg,#54A0FF,#74B9FF)" }} />
      </div>

      <div className="rounded-3xl p-6 mb-5 shadow-sm text-center"
        style={{ background: "rgba(255,255,255,0.8)", border: "2px solid #54A0FF30" }}>
        <div className="text-5xl mb-3 animate-float-slow">{scenario.emoji}</div>
        <p className="text-xs font-bold text-blue-300 mb-2 uppercase tracking-widest">이런 상황이라면?</p>
        <p className="text-lg font-black text-gray-700 leading-relaxed">{scenario.situation}</p>
      </div>

      <div className="flex flex-col gap-3 mb-4">
        {scenario.choices.map((choice, i) => (
          <button key={i} onClick={() => handleChoice(i)}
            className="rounded-2xl p-4 text-left transition-all duration-200 btn-main"
            style={
              chosen === i
                ? { background: "linear-gradient(135deg,#54A0FF,#74B9FF)", border: "3px solid #54A0FF", color: "white" }
                : chosen !== null && chosen !== i
                  ? { background: "rgba(255,255,255,0.5)", border: "2px solid #e5e7eb", color: "#9ca3af" }
                  : { background: "rgba(255,255,255,0.8)", border: "2px solid #54A0FF30", color: "#374151" }
            }>
            <span className="text-sm font-black leading-relaxed">{choice.text}</span>
          </button>
        ))}
      </div>

      {chosen !== null && (
        <div className="animate-pop">
          <div className="rounded-3xl p-5 mb-4 shadow-sm"
            style={{ background: "rgba(255,255,255,0.9)", border: "3px solid #54A0FF" }}>
            <p className="text-sm font-bold text-blue-500 leading-relaxed text-center">
              {scenario.choices[chosen].result}
            </p>
          </div>
          <button onClick={handleNext}
            className="btn-main w-full py-4 rounded-2xl font-black text-lg text-white"
            style={{ background: "linear-gradient(135deg,#54A0FF,#74B9FF)", boxShadow: "0 6px 20px #54A0FF44" }}>
            {current + 1 >= scenarios.length ? "완료 ✓" : "다음 →"}
          </button>
        </div>
      )}
    </main>
  );
}
