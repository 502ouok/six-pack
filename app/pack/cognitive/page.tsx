import PackTabWrapper from "@/app/components/PackTabWrapper";
import { type PackConfig } from "@/app/components/PackAssessmentClient";
import CognitiveGame from "@/app/components/game/CognitiveGame";

const config: PackConfig = {
  packName: "인지",
  packEmoji: "🧠",
  packColor: "#A29BFE",
  packDesc: "집중 · 사고",
  gradientTo: "#6C5CE7",
  questions: [
    { id: 1, text: "수업 중 선생님 말씀에 집중할 수 있어요", emoji: "👂" },
    { id: 2, text: "숙제나 과제를 끝까지 다 해요", emoji: "📚" },
    { id: 3, text: "모르는 것이 있으면 스스로 찾아봐요", emoji: "🔍" },
    { id: 4, text: "공부할 때 딴생각을 많이 해요", emoji: "🌙", reverse: true },
    { id: 5, text: "새로운 걸 배우는 게 재미있어요", emoji: "🎉" },
    { id: 6, text: "계획을 세우고 지키려고 노력해요", emoji: "📋" },
  ],
  resultLevels: [
    { minScore: 66, label: "집중왕!", emoji: "🧠", sub: "집중력이 엄청나요", color: "#00B894", bg: "#F0FFF8" },
    { minScore: 46, label: "성장 중!", emoji: "📈", sub: "집중력이 조금씩 늘고 있어요", color: "#A29BFE", bg: "#F3F0FF" },
    { minScore: 0,  label: "함께 키워요!", emoji: "✏️", sub: "집중은 훈련으로 늘어요", color: "#FF6B6B", bg: "#FFF0F0" },
  ],
};

export default function CognitivePack() {
  return <PackTabWrapper config={config} game={<CognitiveGame />} />;
}
