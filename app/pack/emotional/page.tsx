import PackTabWrapper from "@/app/components/PackTabWrapper";
import { type PackConfig } from "@/app/components/PackAssessmentClient";
import EmotionalGame from "@/app/components/game/EmotionalGame";

const config: PackConfig = {
  packName: "정서",
  packEmoji: "🌈",
  packColor: "#FF9F43",
  packDesc: "감정 · 마음",
  gradientTo: "#FFCC02",
  questions: [
    { id: 1, text: "화가 나거나 속상할 때 어떻게 하면 좋을지 알아요", emoji: "🤬" },
    { id: 2, text: "슬프거나 힘들 때 도움을 요청할 수 있어요", emoji: "🙋" },
    { id: 3, text: "내 기분이 어떤지 잘 알아요", emoji: "🪞" },
    { id: 4, text: "작은 일에 쉽게 짜증이 나요", emoji: "😤", reverse: true },
    { id: 5, text: "걱정이 너무 많아서 힘든 날이 있어요", emoji: "😰", reverse: true },
    { id: 6, text: "나는 소중한 사람이라고 생각해요", emoji: "💛" },
  ],
  resultLevels: [
    { minScore: 66, label: "감정왕!", emoji: "🌈", sub: "감정을 정말 잘 다루고 있어요", color: "#00B894", bg: "#F0FFF8" },
    { minScore: 46, label: "성장 중!", emoji: "💛", sub: "감정이 조금씩 성숙해지고 있어요", color: "#FF9F43", bg: "#FFF8EE" },
    { minScore: 0,  label: "함께 키워요!", emoji: "🤗", sub: "감정은 연습으로 늘어나요", color: "#FF6B6B", bg: "#FFF0F0" },
  ],
};

export default function EmotionalPack() {
  return <PackTabWrapper config={config} game={<EmotionalGame />} />;
}
