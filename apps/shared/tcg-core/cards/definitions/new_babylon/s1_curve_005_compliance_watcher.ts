/**
 * s1_curve_005 — Compliance Watcher
 *
 * Common unit · New Babylon faction · 1 cost · 2/1
 *
 * audit/09.F4 cost-curve cadence. New Babylon's 1-drop —
 * an audit-bot in pre-shift posture.
 *
 * 2/1 (=3) at cost 1 is on-curve (expected 3, tol ±25%).
 */
import type { CardDefinition } from "../../../index";
import { assetUrl } from "@shared/lib/assetUrl";

export const cardDef: CardDefinition = {
  id: "s1_curve_005_compliance_watcher" as CardDefinition["id"],
  name: "Compliance Watcher",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "common",
  cost: 1,
  baseStats: { power: 2, health: 1 },
  keywords: [],
  abilities: [],
  art: assetUrl("art/cards/new_babylon/compliance_watcher.webp"),
  flavorText:
    "Submit your form. The form is part of the form. Submit them both. In triplicate.",
  rulesVersion: "1.1.0",
  trial_categories: ["evidence"] as const,
  verdict_delta: 0,
};
