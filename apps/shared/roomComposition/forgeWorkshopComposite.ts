/* ═══════════════════════════════════════════════════════
   FORGE WORKSHOP — composite resolver (Phase J)

   24 base renders + 15 sprite overlays.

   Producer drop (2026-05-29) ships 24 full-render state bases
   (baseline + 23 axis variants — cycle, faction, morality, TV,
   act tier, season, forge-unlock progression) and 15 isolated
   object sprites used as hotspot-gating overlays for forge
   landmarks (central-forge, anvil, material-vault, schema-rack,
   recipe-archive, kiln, skill-totems, plus narrative items).

   pickBase priority follows the standard Phase J cascade:
   forge-unlock state → TV → act tier → morality → faction → cycle.
   ═══════════════════════════════════════════════════════ */

import {
  LIGHTING_FILTERS,
  deriveActTier,
  deriveCyclePhase,
  deriveIrlSeason,
  deriveTVInfection,
  factionHigh,
  moralityBand,
} from "./types";
import type { CompositeGameSlice, CompositeResult } from "./types";

export const FORGE_WORKSHOP_BASE_IDS = [
  "baseline",
  "act_tier_3",
  "act_tier_7",
  "battlepass_winter",
  "cycle_dawn",
  "cycle_dusk",
  "cycle_longnight",
  "cycle_midday",
  "cycle_nightwatch",
  "faction_authority",
  "faction_collectors",
  "faction_dreamer",
  "faction_insurgency",
  "faction_multi",
  "faction_panopticon",
  "faction_pureflame",
  "morality_dark",
  "tv_clean",
  "tv_corrupted",
  "tv_exposed",
  "tv_quarantined",
  "tv_spreading",
  "unlock_apprentice",
  "unlock_mastered",
] as const;

export const FORGE_WORKSHOP_SPRITE_IDS = [
  "apprentice_glyph_sigil",
  "bench_workstation",
  "central_forge_anvil",
  "crafting_journal_display",
  "creed_plaque",
  "hammer_rack_east",
  "kiln",
  "kyber_crystal_weapon_blank",
  "material_vault",
  "quench_tank_triptych",
  "recipe_archive_tool_wall",
  "schema_rack",
  "signature_card_shrine",
  "skill_totem_throne",
  "south_door_engineering",
] as const;

type ForgeBaseId = typeof FORGE_WORKSHOP_BASE_IDS[number];

function pickBase(g: CompositeGameSlice): ForgeBaseId {
  const f = g.narrativeFlags;
  const tier = deriveActTier(g);
  const cycle = deriveCyclePhase(g);
  const tv = deriveTVInfection(g, "forge_workshop");
  const morality = moralityBand(g.moralityScore);
  const season = deriveIrlSeason(g);

  // Forge-unlock progression wins — these are mastery-state renders.
  if (f.forge_master_unlocked) return "unlock_mastered";
  if (f.forge_apprentice_unlocked) return "unlock_apprentice";

  // TV-infection cascade (corrupted > spreading > quarantined > exposed).
  if (tv === "corrupted") return "tv_corrupted";
  if (tv === "spreading") return "tv_spreading";
  if (tv === "quarantined") return "tv_quarantined";
  if (tv === "exposed") return "tv_exposed";

  // Late-act endgame.
  if (tier >= 7) return "act_tier_7";
  if (tier >= 3) return "act_tier_3";

  // Morality.
  if (morality === "dark") return "morality_dark";

  // Faction-championed states (mutex).
  if (factionHigh(g, "authority")) return "faction_authority";
  if (factionHigh(g, "insurgency")) return "faction_insurgency";
  if (factionHigh(g, "dreamers")) return "faction_dreamer";
  if (factionHigh(g, "antiquarian")) return "faction_collectors";
  if (factionHigh(g, "pureflame")) return "faction_pureflame";
  if (factionHigh(g, "panopticon")) return "faction_panopticon";
  if (f.faction_multi_aligned) return "faction_multi";

  // Winter battlepass dressing.
  if (season === "winter" && f.battlepass_winter_active) return "battlepass_winter";

  // Cycle phase. The forge has explicit dawn/midday/dusk/nightwatch/longnight
  // bases — map balanced→midday so the room reads as warm-lit by default.
  if (cycle === "longNight") return "cycle_longnight";
  if (cycle === "dimming") return "cycle_dusk";
  if (cycle === "dawn") return "cycle_dawn";
  if (cycle === "balanced") return "cycle_midday";

  // TV clean is the explicit "everything's fine" state.
  if (tv === "clean" && f.tv_purge_witnessed) return "tv_clean";

  return "baseline";
}

function pickSprites(g: CompositeGameSlice, base: ForgeBaseId): string[] {
  const out: string[] = [];
  const f = g.narrativeFlags;
  const tier = deriveActTier(g);
  const cycle = deriveCyclePhase(g);
  const morality = moralityBand(g.moralityScore);

  // ── Always-on forge landmarks ──
  out.push("central_forge_anvil");
  out.push("material_vault");
  out.push("recipe_archive_tool_wall");
  out.push("schema_rack");
  out.push("hammer_rack_east");
  out.push("kiln");
  out.push("quench_tank_triptych");
  out.push("bench_workstation");
  out.push("skill_totem_throne");
  out.push("south_door_engineering");

  // ── Conditional overlays ──
  // The crafting journal sits on the bench when the player has logged
  // ≥1 craft; appears blank otherwise so still surface it baseline.
  out.push("crafting_journal_display");

  // The creed plaque appears once the player has read the forge creed
  // OR has championed Authority (the plaque is the Authority creed).
  if (f.forge_creed_read || factionHigh(g, "authority")) {
    out.push("creed_plaque");
  }

  // Apprentice sigil — surfaces once the player has begun an apprentice
  // arc OR the apprentice unlock is active.
  if (f.forge_apprentice_unlocked || f.forge_apprentice_arc_active) {
    out.push("apprentice_glyph_sigil");
  }

  // Signature card shrine — the cards on display in the throne alcove.
  // Appears once the player has signed any legendary commission.
  if (f.legendary_commission_signed || tier >= 4) {
    out.push("signature_card_shrine");
  }

  // Kyber blank — the weapon-in-progress on the anvil. Surfaces when
  // an active craft is mid-flight or a commission is open.
  if (f.forge_craft_in_progress || f.commission_in_progress) {
    out.push("kyber_crystal_weapon_blank");
  }

  // Cycle / morality dressing (decorative; doesn't gate hotspots but
  // keeps overlay density consistent across the cycle).
  void cycle;
  void morality;

  return out;
}

function pickFilter(base: ForgeBaseId): string | undefined {
  if (base === "cycle_dawn") return LIGHTING_FILTERS.cycle_dawn;
  if (base === "cycle_dusk") return LIGHTING_FILTERS.cycle_dimming;
  if (base === "cycle_longnight") return LIGHTING_FILTERS.cycle_long_night;
  if (base === "morality_dark") return LIGHTING_FILTERS.morality_dark;
  if (base === "tv_corrupted") return LIGHTING_FILTERS.tv_corrupted;
  if (base === "tv_quarantined") return LIGHTING_FILTERS.tv_quarantined;
  if (base === "act_tier_7") return LIGHTING_FILTERS.epoch_grand_edit;
  return undefined;
}

export function resolveForgeWorkshopComposite(g: CompositeGameSlice): CompositeResult {
  const base = pickBase(g);
  const sprites = pickSprites(g, base);
  const filter = pickFilter(base);
  return { base, sprites, baseLightingFilter: filter };
}
