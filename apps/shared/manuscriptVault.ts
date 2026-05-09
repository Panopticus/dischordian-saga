/* ═══════════════════════════════════════════════════════
   MANUSCRIPT VAULT
   audit/16 PR 9 (Cluster Co1 — Conspiracy persona).

   The Archives' "fourteen thousand edits" Editor lore is
   load-bearing across the whole game (Shadow Tongue, Pod
   Zero erasure, Kael's inflated role, every cascading
   discovery in every room). Pre-audit it lived isolated
   inside one room file and required no cross-room
   investigation to surface — players who skipped the
   Archives missed the entire framing of the Ark's history.

   This module aggregates manuscript-evidence clues across
   rooms into a "vault" surface: as the player collects
   clues that bear the Editor's signature in multiple
   rooms, vault entries unlock and surface in the Archives
   investigation board.

   The clue-id space referenced here is the same one used
   by ClueJournal + RoomMysteryRegistry; entries become
   discoverable when their full requiredClues set has been
   collected.

   Schema-only ship. The Archives UI consumer (mise-en-abyme
   panel) is queued for the Cluster A Investigation Board
   PR. Authors can populate / extend the registry today;
   readers see no behavioural change until the panel lands.
   ═══════════════════════════════════════════════════════ */

export type ManuscriptEntryTier = "fragment" | "passage" | "chapter";

export interface ManuscriptVaultEntry {
  /** Stable id; pattern: "vault_{descriptor}". */
  id: string;
  /** Player-facing title (visible once unlocked). */
  title: string;
  /** Body — the manuscript-page text. Multi-paragraph
   *  allowed; render with serif typography per the
   *  authored 1955-Editor voice. */
  body: string;
  /** Authored-by attribution surfaced in small caps under
   *  the body. Always "The Editor" for canonical entries;
   *  reserved for future ARG-vault material. */
  attribution: string;
  /** Discovery scale. fragment = 1 short paragraph;
   *  passage = 2-4 paragraphs; chapter = 5+. */
  tier: ManuscriptEntryTier;
  /** Cross-room clue ids that must all be collected
   *  before this entry surfaces. Authors should pull from
   *  at least 2 distinct rooms to honour the cross-room
   *  audit'd intent. */
  requiredClues: readonly string[];
  /** Optional narrative-flag gates — useful for entries
   *  that should only surface after a specific story beat
   *  even if the clue set is technically complete. */
  requiredFlags?: readonly string[];
}

/** Seed entries — short on count, long on intent. The audit
 *  asked for a substrate that authors can extend; these three
 *  exist to demonstrate the discovery-shape and to exercise
 *  the resolver in tests.
 *
 *  When new manuscript-evidence clues land in any room, they
 *  should be cross-referenced into one of these entries (or a
 *  new entry's requiredClues array). */
export const MANUSCRIPT_VAULT: readonly ManuscriptVaultEntry[] = [
  {
    id: "vault_pod_zero_erasure",
    title: "On the Erasure of Pod Zero",
    attribution: "The Editor",
    tier: "passage",
    body:
      "I have spent fourteen thousand edits ensuring that the first pod was never first. " +
      "There is a clean way to take a person out of a manifest, and there is the way I had " +
      "to do it — every reference, every cross-reference, every passing mention in a " +
      "lateral document. The hardest part wasn't the deletion. The hardest part was " +
      "writing the substitute prose so the cadence still felt like Elara's. She has a " +
      "rhythm. I learned it.\n\n" +
      "The pod is still there. Physically. The manifest doesn't open it.",
    requiredClues: [
      // Cross-room: Archives + Cryo Bay are the canonical pair.
      "shadow_tongue_signature",
      "pod_zero_blank_slot",
    ],
    requiredFlags: ["act_2_complete"],
  },
  {
    id: "vault_kael_inflation",
    title: "Why Kael's Role Grew",
    attribution: "The Editor",
    tier: "passage",
    body:
      "Kael did one thing well, and one thing only, on the day everything ended. He held " +
      "a door. That is — to be precise — what he did. He held a door for forty-three " +
      "seconds while the rest of the Bridge crew evacuated. I have made him a hero. I " +
      "have made him an architect. I have made him a doctrine. None of this is true. " +
      "The substitution isn't malice. It's economy. A reader will accept one " +
      "doorman-becomes-doctrine elevation without questioning the source. They will not " +
      "accept the equally large but oppositely-signed elevation of the person I removed.",
    requiredClues: [
      "kael_doctrine_inconsistency",
      "bridge_door_telemetry",
      "shadow_tongue_signature",
    ],
  },
  {
    id: "vault_method_confession",
    title: "On Method",
    attribution: "The Editor",
    tier: "fragment",
    body:
      "The indigo layer is denser at the top of each scroll because most readers read " +
      "the first line and not the seventh. I am not editing for accuracy. I am editing " +
      "for impression. If you have read this far, you are not most readers.",
    requiredClues: [
      "indigo_density_observation",
      "shadow_tongue_signature",
    ],
  },
];

/* ─── Pure helpers ─────────────────────────────────────── */

export interface VaultDiscoveryInput {
  collectedClueIds: ReadonlySet<string>;
  /** Optional — flags the player has crossed. Required for
   *  entries that gate behind a specific narrative beat. */
  narrativeFlags?: ReadonlySet<string>;
}

/** Returns the manuscript entries the player can currently see. */
export function getDiscoveredManuscriptEntries(
  input: VaultDiscoveryInput,
  registry: readonly ManuscriptVaultEntry[] = MANUSCRIPT_VAULT,
): readonly ManuscriptVaultEntry[] {
  const flags = input.narrativeFlags ?? new Set<string>();
  return registry.filter((entry) => {
    for (const clue of entry.requiredClues) {
      if (!input.collectedClueIds.has(clue)) return false;
    }
    if (entry.requiredFlags) {
      for (const flag of entry.requiredFlags) {
        if (!flags.has(flag)) return false;
      }
    }
    return true;
  });
}

/** Returns the set of manuscript-evidence clue ids referenced
 *  anywhere in the registry — useful for ship-check coverage
 *  parity (every entry's requiredClues should be a subset of
 *  the canonical clue id space). */
export function getAllReferencedClueIds(
  registry: readonly ManuscriptVaultEntry[] = MANUSCRIPT_VAULT,
): ReadonlySet<string> {
  const out = new Set<string>();
  for (const entry of registry) {
    for (const c of entry.requiredClues) out.add(c);
  }
  return out;
}
