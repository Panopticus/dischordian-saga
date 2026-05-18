/* ═══════════════════════════════════════════════════════
   QUESTLINE REGISTRY — the canonical completion ledger

   Before this, the only aggregation of questlines was a
   PARTIAL 11-entry array inside questlineAll.test.ts, while
   23 questline modules existed on disk. "Which questlines
   are complete / playable" was unknown and untracked.

   This is the single canonical list. The parity gate
   (apps/shared/_completeness/checks/questlineRegistryCoverage.ts)
   is HARD PARITY: every apps/shared/questline*.ts module MUST
   be registered here with a status. You cannot add a questline
   module without recording its completion status — the
   "untracked" failure is eliminated structurally.

   `status` is classified from objective module evidence, not
   lore judgement:
     - shipped  : exports a PotentialQuestline AND is covered by
                  questlineAll.test.ts's ALL_QUESTLINES aggregate.
     - authored : authored content + completion flags present,
                  not yet in the aggregate-coverage test.
     - support  : a resolution/lookup table feeding another
                  questline, not a standalone playable line.

   Pure module. No React.
   ═══════════════════════════════════════════════════════ */

export type QuestlineStatus = "shipped" | "authored" | "support";

export interface QuestlineRegistryEntry {
  /** Module basename under apps/shared (no extension). */
  module: string;
  /** Human-readable questline title. */
  title: string;
  status: QuestlineStatus;
}

export const QUESTLINE_REGISTRY: readonly QuestlineRegistryEntry[] = [
  { module: "questlineClassAssassin", title: "Class — Assassin", status: "shipped" },
  { module: "questlineClassEngineer", title: "Class — Engineer", status: "shipped" },
  { module: "questlineClassOracle", title: "Class — Oracle", status: "shipped" },
  { module: "questlineClassSoldier", title: "Class — Soldier", status: "shipped" },
  { module: "questlineClassSpy", title: "Class — Spy", status: "shipped" },
  { module: "questlineElements", title: "Elements — Fire / Earth / Time / Reality", status: "shipped" },
  { module: "questlineDemagiGardensChildren", title: "DeMagi — Garden's Children", status: "shipped" },
  { module: "questlineQuarchonFirstPattern", title: "Quarchon — First Pattern", status: "shipped" },
  { module: "questlineClones", title: "Clones", status: "authored" },
  { module: "questlineHumans", title: "Humans", status: "authored" },
  { module: "questlineInsurgency", title: "Insurgency", status: "authored" },
  { module: "questlineNewBabylon", title: "New Babylon", status: "authored" },
  { module: "questlineSyndicate", title: "Syndicate", status: "authored" },
  { module: "questlineThaloria", title: "Thaloria", status: "authored" },
  { module: "questlineVoltari", title: "Voltari", status: "authored" },
  { module: "questlineDemagiCh1", title: "DeMagi — Chapter 1", status: "authored" },
  { module: "questlineDemagiCh2", title: "DeMagi — Chapter 2", status: "authored" },
  { module: "questlineDemagiCh3", title: "DeMagi — Chapter 3", status: "authored" },
  { module: "questlineDemagiCh4", title: "DeMagi — Chapter 4", status: "authored" },
  { module: "questlineQuarchonCh1", title: "Quarchon — Chapter 1", status: "authored" },
  { module: "questlineQuarchonCh2", title: "Quarchon — Chapter 2", status: "authored" },
  { module: "questlineQuarchonCh3", title: "Quarchon — Chapter 3", status: "authored" },
  { module: "questlineElementResolutions", title: "DeMagi Ch4 — Element Resolutions (support)", status: "support" },
] as const;

export function getQuestlineRegistryCoverage(): {
  declared: number;
  shipped: number;
  authored: number;
  support: number;
} {
  return {
    declared: QUESTLINE_REGISTRY.length,
    shipped: QUESTLINE_REGISTRY.filter((q) => q.status === "shipped").length,
    authored: QUESTLINE_REGISTRY.filter((q) => q.status === "authored").length,
    support: QUESTLINE_REGISTRY.filter((q) => q.status === "support").length,
  };
}
