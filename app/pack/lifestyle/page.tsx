import PackTabWrapper from "@/app/components/PackTabWrapper";
import { type PackConfig } from "@/app/components/PackAssessmentClient";
import LifestyleGame from "@/app/components/game/LifestyleGame";

const config: PackConfig = {
  packName: "생활",
  packEmoji: "🌙",
  packColor: "#FD79A8",
  packDesc: "수면 · 식습관",
  gradientTo: "#E84393",
  questions: [
    { id: 1, text: "매일 정해진 시간에 자고 일어나요", emoji: "⏰" },
    { id: 2, text: "아침밥을 거의 매일 먹어요", emoji: "🍚" },
    { id: 3, text: "채소와 과일을 자주 먹어요", emoji: "🥦" },
    { id: 4, text: "스마트폰을 하루 2시간 이하로 써요", emoji: "📱" },
    { id: 5, text: "늦게까지 유튜브나 게임을 해요", emoji: "🎮", reverse: true },
    { id: 6, text: "손을 자주 씻고 양치를 잘 해요", emoji: "🦷" },
  ],
  resultLevels: [
    { minScore: 66, label: "생활왕!", emoji: "🌟", sub: "건강한 생활을 하고 있어요", color: "#00B894", bg: "#F0FFF8" },
    { minScore: 46, label: "성장 중!", emoji: "🌱", sub: "조금씩 더 규칙적으로!", color: "#FD79A8", bg: "#FFF0F8" },
    { minScore: 0,  label: "함께 만들어요!", emoji: "🌙", sub: "좋은 습관은 만들 수 있어요", color: "#FF6B6B", bg: "#FFF0F0" },
  ],
};

export default function LifestylePack() {
  return <PackTabWrapper config={config} game={<LifestyleGame />} />;
}
