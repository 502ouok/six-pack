"use client";
import { useEffect, useState } from "react";
import { getBadges, type Badge } from "@/lib/badges";

export default function BadgesSection() {
  const [badges, setBadges] = useState<Badge[]>([]);

  useEffect(() => {
    setBadges(getBadges());
  }, []);

  if (badges.length === 0) {
    return (
      <section className="px-5 py-4">
        <h2 className="text-base font-black text-gray-600 mb-3">🏅 획득한 뱃지</h2>
        <div className="rounded-2xl p-5 text-center"
          style={{ background: "rgba(255,255,255,0.6)", border: "2px dashed #e5e7eb" }}>
          <div className="text-3xl mb-2">🔒</div>
          <p className="text-sm text-gray-400 font-bold">아직 뱃지가 없어요</p>
          <p className="text-xs text-gray-300 mt-1">팩 놀이를 완료하면 뱃지를 받아요!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-5 py-4">
      <h2 className="text-base font-black text-gray-600 mb-3">🏅 획득한 뱃지 {badges.length}개</h2>
      <div className="flex flex-wrap gap-2">
        {badges.map((b) => (
          <div key={b.id}
            className="flex items-center gap-2 px-3 py-2 rounded-2xl shadow-sm"
            style={{ background: "rgba(255,255,255,0.9)", border: "2px solid #F9CA2450" }}>
            <span className="text-2xl">{b.emoji}</span>
            <div>
              <p className="text-xs font-black text-gray-600">{b.label}</p>
              <p className="text-xs text-gray-300">{b.packName} 팩</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
