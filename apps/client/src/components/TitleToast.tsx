/* ═══════════════════════════════════════════════════════
   TITLE TOAST — Surfaces newly-granted titles via sonner.
   Tier 1 / 2B / 4 / 5 / 7 grant paths can call showTitleToast()
   directly with the array of newly-earned title keys.
   ═══════════════════════════════════════════════════════ */
import { toast } from "sonner";
import { getTitleDef } from "@shared/titles/titleDefinitions";

export function showTitleEarnedToast(titleKey: string): void {
  const def = getTitleDef(titleKey);
  if (!def) return;
  const rarityColor =
    def.rarity === "mythic" ? "#f472b6" :
    def.rarity === "legendary" ? "#fbbf24" :
    def.rarity === "epic" ? "#a855f7" :
    def.rarity === "rare" ? "#38bdf8" :
    "#94a3b8";
  toast(`Title Earned: ${def.name}`, {
    description: def.flavorText ?? def.description,
    duration: 5000,
    icon: "🏆",
    className: "title-toast",
    style: {
      borderColor: rarityColor,
      borderWidth: "1px",
      borderStyle: "solid",
    },
  });
}

export function showTitleEarnedToasts(titleKeys: readonly string[]): void {
  if (titleKeys.length === 0) return;
  // Stagger so multiple grants don't overlap.
  for (let i = 0; i < titleKeys.length; i++) {
    setTimeout(() => showTitleEarnedToast(titleKeys[i]), i * 600);
  }
}
