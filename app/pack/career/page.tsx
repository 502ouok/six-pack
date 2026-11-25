import PackTabWrapper from "@/app/components/PackTabWrapper";
import { type PackConfig } from "@/app/components/PackAssessmentClient";
import CareerGame from "@/app/components/game/CareerGame";

const config: PackConfig = {
  packName: "진로",
  packEmoji: "⭐",
  packColor: "#F9CA24",
  packDesc: "꿈 · 강점",
  gradientTo: "#FDCB6E",
  questions: [
    { id: 1, text: "내가 잘하는 것이 뭔지 알아요", emoji: "🌟" },
    { id: 2, text: "커서 되고 싶은 것이 있어요", emoji: "🚀" },
    { id: 3, text: "새로운 것에 도전하는 게 재미있어요", emoji: "🎯" },
    { id: 4, text: "어려운 일이 생기면 쉽게 포기해요", emoji: "😮", reverse: true },
    { id: 5, text: "내가 열심히 하면 더 잘할 수 있다고 믿어요", emoji: "💪" },
    { id: 6, text: "내가 좋아하는 활동이 있어요", emoji: "💛" },
  ],
  resultLevels: [
    { minScore: 66, label: "꿈나무!", emoji: "⭐", sub: "꿈을 향해 달려가고 있어요", color: "#00B894", bg: "#F0FFF8" },
    { minScore: 46, label: "성장 중!", emoji: "🌱", sub: "꿈이 조금씩 선명해지고 있어요", color: "#F9CA24", bg: "#FFFBEE" },
    { minScore: 0,  label: "함께 찾아봐요!", emoji: "🔭", sub: "꿈은 탐험하며 찾는 거예요", color: "#FF6B6B", bg: "#FFF0F0" },
  ],
};

export default function CareerPack() {
  return <PackTabWrapper config={config} game={<CareerGame />} />;
}
