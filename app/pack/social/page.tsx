import PackTabWrapper from "@/app/components/PackTabWrapper";
import { type PackConfig } from "@/app/components/PackAssessmentClient";
import SocialStoryGame from "@/app/components/game/SocialStoryGame";

const config: PackConfig = {
  packName: "사회",
  packEmoji: "🤝",
  packColor: "#54A0FF",
  packDesc: "친구 · 관계",
  gradientTo: "#74B9FF",
  questions: [
    { id: 1, text: "친구와 의견이 다를 때 잘 이야기해요", emoji: "🗣️" },
    { id: 2, text: "새로운 친구를 사귀는 게 어렵지 않아요", emoji: "👋" },
    { id: 3, text: "친구가 힘들 때 도와줄 수 있어요", emoji: "🫂" },
    { id: 4, text: "혼자서만 있고 싶어요", emoji: "🙈", reverse: true },
    { id: 5, text: "모둠 활동에서 내 역할을 잘 해요", emoji: "🎯" },
    { id: 6, text: "친구에게 나쁜 말을 해요", emoji: "😬", reverse: true },
  ],
  resultLevels: [
    { minScore: 66, label: "관계왕!", emoji: "🏅", sub: "친구들과 너무 잘 지내고 있어요", color: "#00B894", bg: "#F0FFF8" },
    { minScore: 46, label: "성장 중!", emoji: "🌱", sub: "더 친해질 수 있어요", color: "#54A0FF", bg: "#EEF5FF" },
    { minScore: 0,  label: "함께 연습해요!", emoji: "💙", sub: "관계는 연습으로 좋아져요", color: "#FF6B6B", bg: "#FFF0F0" },
  ],
};

export default function SocialPack() {
  return <PackTabWrapper config={config} game={<SocialStoryGame />} />;
}
