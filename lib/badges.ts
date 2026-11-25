export type Badge = {
  id: string;
  packName: string;
  label: string;
  emoji: string;
  earnedAt: string;
};

const KEY = "gf_badges";

export function getBadges(): Badge[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as Badge[];
  } catch {
    return [];
  }
}

export function hasBadge(id: string): boolean {
  return getBadges().some((b) => b.id === id);
}

export function saveBadge(badge: Omit<Badge, "earnedAt">): void {
  if (hasBadge(badge.id)) return;
  const all = getBadges();
  all.push({ ...badge, earnedAt: new Date().toISOString() });
  localStorage.setItem(KEY, JSON.stringify(all));
}
