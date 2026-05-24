/**
 * Sprite reachability audit — Phase J.
 *
 * For each sprite emitted by each room resolver, determine whether some
 * combination of CURRENTLY-WIRED game-state inputs (flags with real
 * setters in the codebase, plus the state scalars elaraTrust /
 * moralityScore / factionReputation / now / irlSeason) can make it
 * appear on-screen.
 *
 * Approach: enumerate a probe set covering every wired input, run every
 * combination through each resolver, union the emitted sprite ids,
 * compare to the full catalog.
 */

import { resolveBridgeComposite } from "../shared/roomComposition/bridgeComposite";
import { resolveCryoBayComposite } from "../shared/roomComposition/cryoBayComposite";
import { resolveMedicalBayComposite } from "../shared/roomComposition/medicalBayComposite";
import { resolveEngineeringComposite } from "../shared/roomComposition/engineeringComposite";
import { COMPOSITE_ASSET_CATALOG } from "../shared/roomComposition";
import type { CompositeGameSlice } from "../shared/roomComposition";

// All narrative flags that have at least one setter in the codebase.
// From /tmp/flag_audit.txt grep results.
const WIRED_FLAGS = [
  "bridge_war_table_online",
  "chess_mastered",
  "cryo_case_marked_open",
  "cryo_mystery_first_clue_found",
  "cryo_mystery_victim_identified",
  "donated_dna_sample",
  "engineering_research_bench_online",
  "engineering_signal_booster_built",
  "fast_travel_unlocked",
  "medbay_device_awakened",
  "refused_dna_sample",
  "shadow_tongue_evidence",
  "trade_empire_unlocked",
  "unlock_hellbox",
  // Bridged via derive functions:
  "act_1_complete", "act_2_complete", "act_3_complete", "act_4_complete",
  "act_5_complete", "act_6_complete", "act_7_complete",
  "tv_phase_0", "tv_phase_1", "tv_phase_2", "tv_phase_3", "tv_phase_4",
  "room_bridge_tv_quarantined",
  "room_cryo_bay_tv_quarantined",
  "room_medical_bay_tv_quarantined",
  "room_engineering_tv_quarantined",
  // Faction champion flags (written by factionStandingService):
  "faction:championed:new_babylon",
  "faction:championed:hierarchy",
  "faction:championed:insurgency",
  "faction:championed:dreamers_children",
  "faction:championed:architect_remnants",
];

const STATE_PROBES: CompositeGameSlice[] = [
  // Baseline
  { narrativeFlags: {} },
  // Trust bands
  { narrativeFlags: {}, elaraTrust: 10 },
  { narrativeFlags: {}, elaraTrust: 50 },
  { narrativeFlags: {}, elaraTrust: 90 },
  // Morality bands
  { narrativeFlags: {}, moralityScore: -50 },
  { narrativeFlags: {}, moralityScore: 50 },
  // Faction reputation (numeric channel — empire/insurgency/independent/pirate)
  { narrativeFlags: {}, factionReputation: { empire: 90 } },
  { narrativeFlags: {}, factionReputation: { insurgency: 90 } },
  { narrativeFlags: {}, factionReputation: { hierarchy: 90 } },
  { narrativeFlags: {}, factionReputation: { dreamers_children: 90 } },
  { narrativeFlags: {}, factionReputation: { architect_remnants: 90 } },
  // IRL seasons (auto-derived in the hook from wall-clock)
  { narrativeFlags: {}, irlSeason: "spring" },
  { narrativeFlags: {}, irlSeason: "summer" },
  { narrativeFlags: {}, irlSeason: "autumn" },
  { narrativeFlags: {}, irlSeason: "winter" },
  // Wall-clock cycle phases
  { narrativeFlags: {}, now: new Date("2026-05-24T07:00:00") },  // dawn
  { narrativeFlags: {}, now: new Date("2026-05-24T12:00:00") },  // midday
  { narrativeFlags: {}, now: new Date("2026-05-24T19:00:00") },  // dusk
  { narrativeFlags: {}, now: new Date("2026-05-24T02:00:00") },  // nightwatch
];

// Build flag-by-flag probes (each wired flag set in isolation, AND all together).
for (const f of WIRED_FLAGS) {
  STATE_PROBES.push({ narrativeFlags: { [f]: true } });
}
const allOn: Record<string, boolean> = {};
for (const f of WIRED_FLAGS) allOn[f] = true;
STATE_PROBES.push({ narrativeFlags: allOn });

// Add combo probes covering the load-bearing investigation cascades:
STATE_PROBES.push({
  narrativeFlags: { cryo_mystery_first_clue_found: true, cryo_mystery_victim_identified: true },
});
STATE_PROBES.push({
  narrativeFlags: {
    cryo_mystery_first_clue_found: true,
    cryo_mystery_victim_identified: true,
    cryo_case_marked_open: true,
  },
});
STATE_PROBES.push({
  narrativeFlags: { medbay_device_awakened: true, donated_dna_sample: true },
});
STATE_PROBES.push({
  narrativeFlags: { medbay_device_awakened: true, refused_dna_sample: true },
});
STATE_PROBES.push({
  narrativeFlags: { engineering_signal_booster_built: true, engineering_research_bench_online: true },
});

const RESOLVERS = {
  bridge: resolveBridgeComposite,
  "cryo-bay": resolveCryoBayComposite,
  "medical-bay": resolveMedicalBayComposite,
  engineering: resolveEngineeringComposite,
} as const;

// (appended) Combo probes — cycle phases × activated tier, morality × activated.
const ACTIVATION_COMBOS: Array<{ label: string; flags: Record<string, boolean> }> = [
  { label: "bridge", flags: { fast_travel_unlocked: true } },
  { label: "engineering", flags: { engineering_signal_booster_built: true } },
];
const CYCLE_DATES = [
  new Date("2026-05-24T07:00:00"),
  new Date("2026-05-24T19:00:00"),
  new Date("2026-05-24T02:00:00"),
];
for (const combo of ACTIVATION_COMBOS) {
  for (const d of CYCLE_DATES) {
    STATE_PROBES.push({ narrativeFlags: combo.flags, now: d });
  }
  STATE_PROBES.push({ narrativeFlags: combo.flags, moralityScore: -50 });
  STATE_PROBES.push({ narrativeFlags: combo.flags, moralityScore: 50 });
  for (const t of [10, 50, 90]) {
    STATE_PROBES.push({ narrativeFlags: combo.flags, elaraTrust: t });
  }
  for (const facKey of [
    "empire", "new_babylon", "insurgency", "hierarchy",
    "dreamers_children", "architect_remnants",
  ]) {
    STATE_PROBES.push({ narrativeFlags: combo.flags, factionReputation: { [facKey]: 90 } });
  }
}

// Max-reach probe — every wired flag on, every scalar at extreme.
const allWiredOn: Record<string, boolean> = {};
for (const f of WIRED_FLAGS) allWiredOn[f] = true;
STATE_PROBES.push({
  narrativeFlags: allWiredOn,
  elaraTrust: 90,
  factionReputation: {
    empire: 90, insurgency: 90, hierarchy: 90,
    dreamers_children: 90, architect_remnants: 90,
  },
  irlSeason: "spring",
  now: new Date("2026-05-24T19:00:00"),
});

console.log("ROOM | TOTAL SPRITES | REACHABLE | DARK | DARK SPRITE IDS");
console.log("------|---------------|-----------|------|-----------------");

let grandTotal = 0;
let grandReachable = 0;
let grandDarkBases = 0;
let grandTotalBases = 0;

for (const [roomId, resolver] of Object.entries(RESOLVERS)) {
  const catalog = COMPOSITE_ASSET_CATALOG[roomId as keyof typeof COMPOSITE_ASSET_CATALOG];
  const reachableSprites = new Set<string>();
  const reachableBases = new Set<string>();
  for (const probe of STATE_PROBES) {
    const c = resolver(probe);
    reachableBases.add(c.base);
    for (const s of c.sprites) reachableSprites.add(s);
  }
  const darkSprites = catalog.sprites.filter((s) => !reachableSprites.has(s));
  const darkBases = catalog.bases.filter((b) => !reachableBases.has(b));
  grandTotal += catalog.sprites.length;
  grandReachable += reachableSprites.size;
  grandTotalBases += catalog.bases.length;
  grandDarkBases += darkBases.length;
  console.log(
    `${roomId} sprites | ${catalog.sprites.length} | ${reachableSprites.size} | ${darkSprites.length} | ${darkSprites.length > 0 ? darkSprites.join("\n  ") : "—"}`,
  );
  console.log(
    `${roomId} bases   | ${catalog.bases.length} | ${reachableBases.size} | ${darkBases.length} | ${darkBases.length > 0 ? darkBases.join(", ") : "—"}`,
  );
}

console.log("------|---------------|-----------|------");
console.log(`TOTAL sprites | ${grandTotal} | ${grandReachable} | ${grandTotal - grandReachable}`);
console.log(`TOTAL bases   | ${grandTotalBases} | ${grandTotalBases - grandDarkBases} | ${grandDarkBases}`);

