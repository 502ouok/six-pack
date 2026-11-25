export type SocialSkill = "emotion" | "perspective" | "prosocial" | "conflict";

export interface ResponseRecord {
  sessionId: string;
  characterId: string;
  sceneId: number;
  sceneTitle: string;
  choiceIdx: number;
  choiceText: string;
  reactionTimeMs: number;
  skillsAwarded: SocialSkill[];
  timestamp: string;
}

const KEY = "gf_social_responses";

export function getSocialResponses(): ResponseRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as ResponseRecord[];
  } catch {
    return [];
  }
}

export function saveSocialResponse(record: ResponseRecord): void {
  if (typeof window === "undefined") return;
  try {
    const all = getSocialResponses();
    all.push(record);
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch { /* silent */ }
}

export function clearSocialResponses(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
