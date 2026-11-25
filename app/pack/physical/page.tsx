import PackTabWrapper from "@/app/components/PackTabWrapper";
import { type PackConfig } from "@/app/components/PackAssessmentClient";
import PhysicalGame from "@/app/components/game/PhysicalGame";

const config: PackConfig = {
  packName: "신체",
  packEmoji: "💪",
  packColor: "#FF6B6B",
  packDesc: "체력 · 운동",
  gradientTo: "#FF8E53",
  questions: [
    { id: 1, text: "나는 매일 30분 이상 달리기, 수영, 자전거 등 몸을 움직여요", emoji: "🏃" },
    { id: 2, text: "운동장에서 친구들과 신나게 뛰어 놀아요", emoji: "⚽" },
    { id: 3, text: "팔굽혀펴기를 5개 이상 할 수 있어요", emoji: "💪" },
    { id: 4, text: "한 발로 10초 이상 서 있을 수 있어요", emoji: "🦵" },
    { id: 5, text: "하루 종일 앉아서만 보내는 날이 많아요", emoji: "🛋️", reverse: true },
    { id: 6, text: "계단보다 엘리베이터를 더 자주 타요", emoji: "🛗", reverse: true },
  ],
  resultLevels: [
    { minScore: 66, label: "운동왕!", emoji: "🏆", sub: "대단해요! 신체 팩이 꽉 찼어요", color: "#00B894", bg: "#F0FFF8" },
    { minScore: 46, label: "성장 중!", emoji: "🌱", sub: "조금만 더 노력하면 완성!", color: "#FF9F43", bg: "#FFF8EE" },
    { minScore: 0,  label: "도전 시작!", emoji: "🎯", sub: "지금부터 키워나가 봐요", color: "#FF6B6B", bg: "#FFF0F0" },
  ],
};

export default function PhysicalPack() {
  return <PackTabWrapper config={config} game={<PhysicalGame />} />;
}
