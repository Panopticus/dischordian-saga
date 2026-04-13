/* Shadow Tongue Dictionary — all UI/Loredex corruption entries */
export const SHADOW_TONGUE_UI_EDITS: Record<string, string> = {
  "Dream Tokens": "Dream Takens", "Armory": "Memory", "Elara": "Senator",
  "Archives": "Revisions", "Engineering": "Unmaking", "Bridge": "Throne",
  "The Remnant": "The Remainders", "The Witnesses": "The Accused",
  "Liberation": "Disruption", "The Insurgency": "The Incident",
};

export interface ShadowTongueLoredexEdit {
  entry: string; field: string; corrupted: string; original: string;
}
export const SHADOW_TONGUE_LOREDEX_EDITS: ShadowTongueLoredexEdit[] = [
  { entry: "entity_engineer", field: "status", corrupted: "Convicted — Executed", original: "Martyr — Executed" },
  { entry: "entity_oracle", field: "status", corrupted: "Patient — Institutional Care", original: "Prisoner — The Panopticon" },
  { entry: "entity_iron_lion", field: "affiliation", corrupted: "Terrorist Organization", original: "The Insurgency" },
  { entry: "entity_programmer", field: "lastKnownWords", corrupted: "[REDACTED BY AUTHORITY PROTOCOL]", original: "[determined by INS-V5 vote]" },
];

/** Shadow Tongue power level effects. */
export const SHADOW_TONGUE_POWER_TIERS = [
  { min: 0, max: 20, name: "Passive", uiCorruptionRate: 0.01, loredexEditDuration: null },
  { min: 21, max: 40, name: "Active", uiCorruptionRate: 0.03, loredexEditDuration: "24h" },
  { min: 41, max: 60, name: "Dominant", uiCorruptionRate: 0.07, loredexEditDuration: "7d" },
  { min: 61, max: 80, name: "Overwhelming", uiCorruptionRate: 0.15, loredexEditDuration: "permanent_until_restored" },
  { min: 81, max: 100, name: "THE GRAND EDIT", uiCorruptionRate: 0.25, loredexEditDuration: "permanent_until_restored" },
] as const;
