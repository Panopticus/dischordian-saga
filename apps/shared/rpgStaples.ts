/* ═══════════════════════════════════════════════════════
   RPG STAPLES — the four-pillar presence contract

   The audit flagged the RPG staples as "missing": inventory
   with no management, "crafting is 5 recipes", no vendor
   economy, no overworld traversal. Each claim was stale —
   InventoryPage + AdventureInventoryDrawer, ~49 crafting
   recipes, the cosmetic/soul-stone shops, and the Ark
   fast-travel + room-unlock manifest all ship.

   What did NOT exist was a single enforced contract that the
   four pillars are present, substantive, and — for traversal
   — wired to the spine the rest of this work built. This
   module is that contract. Overworld traversal is explicitly
   the room-unlock manifest + the spine doorways (W0), so the
   "linear room-unlock chain" the audit named is now the
   spine-driven, gated graph.

   The parity gate
   (apps/shared/_completeness/checks/rpgStaplesCoverage.ts)
   is HARD PARITY: every pillar's anchor modules exist, and
   crafting clears a real recipe floor (the stale "5 recipes"
   claim becomes an enforced minimum).

   Pure module. No React.
   ═══════════════════════════════════════════════════════ */

export interface RpgStaple {
  /** Stable id, snake_case. */
  id: string;
  /** Player-facing pillar name. */
  pillar: string;
  /** Shipped modules that implement the pillar (all must exist). */
  anchorModules: readonly string[];
  /** What the pillar provides. */
  note: string;
}

export const RPG_STAPLES: readonly RpgStaple[] = [
  {
    id: "inventory_management",
    pillar: "Inventory & management",
    anchorModules: [
      "apps/client/src/pages/InventoryPage.tsx",
      "apps/client/src/components/AdventureInventoryDrawer.tsx",
    ],
    note: "Full inventory page + the in-adventure quick drawer.",
  },
  {
    id: "crafting",
    pillar: "Crafting",
    anchorModules: [
      "apps/client/src/data/craftingData.ts",
      "apps/shared/craftingBalance.ts",
      "apps/server/routers/crafting.ts",
    ],
    note: "Materials, skills, and a substantive recipe book (not 5).",
  },
  {
    id: "vendor_economy",
    pillar: "Vendor economy",
    anchorModules: [
      "apps/shared/cosmeticShop.ts",
      "apps/client/src/pages/StorePage.tsx",
      "apps/client/src/features/soulStones/soulStoneStore.ts",
    ],
    note: "Cosmetic shop + store page + the Soul-Stone sink.",
  },
  {
    id: "overworld_traversal",
    pillar: "Overworld traversal",
    anchorModules: [
      "apps/shared/roomGating/roomUnlockManifest.ts",
      "apps/client/src/components/ArkFastTravelModal.tsx",
      "apps/shared/spineDoorways.ts",
    ],
    note:
      "The room-unlock manifest + fast-travel + the spine doorways " +
      "(W0) — traversal is the spine-driven room graph, not a chain.",
  },
] as const;

/** Minimum recipe count — the stale "5 recipes" claim, now a floor. */
export const CRAFTING_RECIPE_FLOOR = 12;

export function getRpgStaplesCoverage(): { declared: number } {
  return { declared: RPG_STAPLES.length };
}
