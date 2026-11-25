"use client";
import { useState } from "react";
import PackAssessmentClient, { type PackConfig } from "@/app/components/PackAssessmentClient";

interface Props {
  config: PackConfig;
  game: React.ReactNode;
}

export default function PackTabWrapper({ config, game }: Props) {
  const [tab, setTab] = useState<"assess" | "game">("assess");
  const { packColor } = config;

  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 z-50 flex shadow-sm"
        style={{ background: "rgba(255,255,255,0.93)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
      >
        <button
          onClick={() => setTab("assess")}
          className="flex-1 py-3.5 text-sm font-black transition-all"
          style={
            tab === "assess"
              ? { borderBottom: `3px solid ${packColor}`, color: packColor }
              : { borderBottom: "3px solid transparent", color: "#9ca3af" }
          }
        >
          📊 측정하기
        </button>
        <button
          onClick={() => setTab("game")}
          className="flex-1 py-3.5 text-sm font-black transition-all"
          style={
            tab === "game"
              ? { borderBottom: `3px solid ${packColor}`, color: packColor }
              : { borderBottom: "3px solid transparent", color: "#9ca3af" }
          }
        >
          🎮 놀이하기
        </button>
      </div>

      <div className="pt-14">
        {tab === "assess" ? <PackAssessmentClient config={config} /> : game}
      </div>
    </>
  );
}
