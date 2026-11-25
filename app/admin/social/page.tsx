"use client";
import React, { useState, useEffect } from "react";
import { getSocialResponses, clearSocialResponses, type ResponseRecord } from "@/lib/gameResults";

function downloadCSV(records: ResponseRecord[]) {
  const headers = [
    "sessionId", "characterId", "sceneId", "sceneTitle",
    "choiceIdx", "choiceText", "reactionTimeMs", "skillsAwarded", "timestamp",
  ];
  const rows = records.map((r) => [
    r.sessionId,
    r.characterId,
    r.sceneId,
    `"${r.sceneTitle}"`,
    r.choiceIdx,
    `"${r.choiceText.replace(/"/g, '""')}"`,
    r.reactionTimeMs,
    r.skillsAwarded.join("+"),
    r.timestamp,
  ]);
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `social_responses_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function SocialAdminPage() {
  const [records, setRecords] = useState<ResponseRecord[]>([]);

  useEffect(() => {
    setRecords(getSocialResponses());
  }, []);

  function handleClear() {
    if (!confirm("모든 응답 데이터를 삭제할까요?")) return;
    clearSocialResponses();
    setRecords([]);
  }

  const sessions = [...new Set(records.map((r) => r.sessionId))];

  return (
    <div style={{ minHeight: "100vh", background: "#F8F9FF", padding: "24px 16px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: "#54A0FF", margin: 0 }}>
            🛸 사회성 게임 응답 데이터
          </h1>
          <p style={{ fontSize: 13, color: "#888", marginTop: 4 }}>
            총 {records.length}개 응답 · {sessions.length}개 세션
          </p>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          <button
            onClick={() => downloadCSV(records)}
            disabled={records.length === 0}
            style={{
              padding: "10px 20px",
              background: records.length === 0 ? "#ccc" : "#54A0FF",
              color: "white",
              border: "none",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 13,
              cursor: records.length === 0 ? "not-allowed" : "pointer",
            }}
          >
            📥 CSV 다운로드
          </button>
          <button
            onClick={() => setRecords(getSocialResponses())}
            style={{
              padding: "10px 20px",
              background: "#EEF5FF",
              color: "#54A0FF",
              border: "2px solid #54A0FF30",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            🔄 새로고침
          </button>
          <button
            onClick={handleClear}
            disabled={records.length === 0}
            style={{
              padding: "10px 20px",
              background: records.length === 0 ? "#ccc" : "#FFF0F0",
              color: records.length === 0 ? "#aaa" : "#FF6B6B",
              border: "2px solid #FF6B6B30",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 13,
              cursor: records.length === 0 ? "not-allowed" : "pointer",
            }}
          >
            🗑️ 전체 삭제
          </button>
        </div>

        {records.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              background: "white",
              borderRadius: 20,
              border: "2px solid #E0E7FF",
              color: "#aaa",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
            <p style={{ fontWeight: 700, fontSize: 15 }}>아직 응답 데이터가 없어요</p>
            <p style={{ fontSize: 13, marginTop: 4 }}>사회 팩 게임을 플레이하면 여기에 데이터가 쌓여요</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                background: "white",
                borderRadius: 16,
                overflow: "hidden",
                fontSize: 12,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <thead>
                <tr style={{ background: "#54A0FF", color: "white" }}>
                  <th style={th}>세션ID</th>
                  <th style={th}>캐릭터</th>
                  <th style={th}>장면</th>
                  <th style={th}>선택지</th>
                  <th style={th}>반응시간(ms)</th>
                  <th style={th}>도메인</th>
                  <th style={th}>시각</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => (
                  <tr
                    key={i}
                    style={{ background: i % 2 === 0 ? "#F8F9FF" : "white" }}
                  >
                    <td style={td}>
                      <span style={{ fontFamily: "monospace", fontSize: 10, color: "#888" }}>
                        {r.sessionId.slice(-8)}
                      </span>
                    </td>
                    <td style={td}>
                      <span style={{ fontWeight: 700, color: r.characterId === "panda" ? "#54A0FF" : "#FF9F43" }}>
                        {r.characterId === "panda" ? "🐼 뽀코" : "🐾 뭉치"}
                      </span>
                    </td>
                    <td style={td}>{r.sceneId}</td>
                    <td style={{ ...td, maxWidth: 220 }}>
                      <span style={{ color: "#555" }}>[{r.choiceIdx + 1}] </span>
                      {r.choiceText.slice(0, 40)}{r.choiceText.length > 40 ? "…" : ""}
                    </td>
                    <td style={{ ...td, textAlign: "right" }}>
                      <span
                        style={{
                          fontWeight: 700,
                          color: r.reactionTimeMs < 5000 ? "#00B894" : r.reactionTimeMs < 15000 ? "#FF9F43" : "#FF6B6B",
                        }}
                      >
                        {(r.reactionTimeMs / 1000).toFixed(1)}s
                      </span>
                    </td>
                    <td style={td}>
                      {r.skillsAwarded.map((s) => (
                        <span
                          key={s}
                          style={{
                            display: "inline-block",
                            padding: "2px 7px",
                            borderRadius: 8,
                            fontSize: 10,
                            fontWeight: 700,
                            marginRight: 3,
                            background:
                              s === "emotion" ? "#FFF3E0" :
                              s === "perspective" ? "#F0EFFF" :
                              s === "prosocial" ? "#EEF5FF" : "#F0FFF8",
                            color:
                              s === "emotion" ? "#FF9F43" :
                              s === "perspective" ? "#A29BFE" :
                              s === "prosocial" ? "#54A0FF" : "#00B894",
                          }}
                        >
                          {s === "emotion" ? "감정" : s === "perspective" ? "조망" : s === "prosocial" ? "친사회" : "갈등"}
                        </span>
                      ))}
                    </td>
                    <td style={{ ...td, color: "#aaa", fontSize: 11 }}>
                      {new Date(r.timestamp).toLocaleString("ko-KR", {
                        month: "2-digit", day: "2-digit",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Summary by session */}
        {sessions.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 900, color: "#333", marginBottom: 12 }}>
              세션별 요약
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {sessions.map((sid) => {
                const sessionRecs = records.filter((r) => r.sessionId === sid);
                const charId = sessionRecs[0]?.characterId;
                const scores: Record<string, number> = { emotion: 0, perspective: 0, prosocial: 0, conflict: 0 };
                sessionRecs.forEach((r) => r.skillsAwarded.forEach((s) => { scores[s] = (scores[s] ?? 0) + 1; }));
                const avgMs = sessionRecs.reduce((s, r) => s + r.reactionTimeMs, 0) / sessionRecs.length;
                return (
                  <div
                    key={sid}
                    style={{
                      background: "white",
                      borderRadius: 14,
                      padding: "12px 16px",
                      border: "2px solid #E0E7FF",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <span style={{ fontWeight: 700, color: "#54A0FF", fontSize: 13 }}>
                      {charId === "panda" ? "🐼 뽀코" : "🐾 뭉치"}
                    </span>
                    <span style={{ fontSize: 11, color: "#aaa", fontFamily: "monospace" }}>{sid.slice(-8)}</span>
                    <span style={{ fontSize: 12, color: "#555" }}>{sessionRecs.length}장면</span>
                    <span style={{ fontSize: 12, color: "#FF9F43" }}>감정 {scores.emotion ?? 0}pt</span>
                    <span style={{ fontSize: 12, color: "#A29BFE" }}>조망 {scores.perspective ?? 0}pt</span>
                    <span style={{ fontSize: 12, color: "#54A0FF" }}>친사회 {scores.prosocial ?? 0}pt</span>
                    <span style={{ fontSize: 12, color: "#00B894" }}>갈등 {scores.conflict ?? 0}pt</span>
                    <span style={{ fontSize: 11, color: "#888", marginLeft: "auto" }}>
                      평균 반응 {(avgMs / 1000).toFixed(1)}s
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const th: React.CSSProperties = {
  padding: "10px 12px",
  textAlign: "left",
  fontWeight: 700,
  fontSize: 11,
  whiteSpace: "nowrap",
};

const td: React.CSSProperties = {
  padding: "9px 12px",
  borderBottom: "1px solid #F0F0F0",
  verticalAlign: "middle",
};
