/* ═══════════════════════════════════════════════════════
   EARNED LOADOUTS — cyberpunk × steampunk sorcery rewards

   New operatives spawn bare-handed (see apps/server/routers/
   citizen.ts). Every piece of gear is granted through an
   in-world choice. The Med Bay "unkempt device" DNA offer is
   the first source; more sources are added room-by-room as
   encounters wire through apps/server/routers/medbay.ts and
   the Ark event handler.

   Style constraint: every item name + flavor carries the
   cyberpunk × steampunk sorcery fusion (brass + chrome +
   arcane sigil; fiber-optic ley lines; clockwork prophecy).
   No generic kits. Each reward is keyed to who the
   operative is — class × species at minimum, optionally
   refined by element.
   ═══════════════════════════════════════════════════════ */

export type ClassKey = "engineer" | "oracle" | "assassin" | "soldier" | "spy";
export type SpeciesKey = "demagi" | "quarchon" | "neyon";
export type ElementKey =
  | "earth"
  | "fire"
  | "water"
  | "air"
  | "space"
  | "time"
  | "probability"
  | "reality";

/** Equipment slot on the citizenCharacters.gear JSON blob. */
export type Slot = "weapon" | "secondary" | "consumable" | "accessory";

/** Aesthetic tag — every reward must carry one. */
export type StyleTag =
  | "chrome-arcane"
  | "clockwork-prophecy"
  | "aether-circuit"
  | "brass-oracular"
  | "neon-divination"
  | "obsidian-ritual"
  | "voltaic-runic";

export interface RewardItem {
  id: string;
  name: string;
  slot: Slot;
  style: StyleTag;
  flavor: string;
  /** Optional VO line ID keyed into elaraVoManifest / humanVoManifest. */
  voIntroLineId?: string;
  /** Optional element affinity — when present, roller prefers matches. */
  preferredElements?: readonly ElementKey[];
}

/** Where a reward was earned. Grows as more encounters are wired. */
export type RewardSource = "medbay_dna_device";

/**
 * Pool keyed by source → class → species. Element is a soft filter at
 * roll time (see rollEarnedReward). Keep each cell to 1–3 items; the
 * point is specificity, not variety.
 */
export const EARNED_REWARDS: Record<
  RewardSource,
  Record<ClassKey, Partial<Record<SpeciesKey, readonly RewardItem[]>>>
> = {
  medbay_dna_device: {
    engineer: {
      demagi: [
        {
          id: "brass-sigil-arc-welder",
          name: "Brass-Sigil Arc Welder",
          slot: "weapon",
          style: "voltaic-runic",
          flavor:
            "A copper-veined welder that writes enchanted seams. The flame is lavender where the runes bite.",
          preferredElements: ["earth", "fire"],
        },
      ],
      quarchon: [
        {
          id: "clockwork-repair-swarm",
          name: "Clockwork Repair Swarm",
          slot: "secondary",
          style: "clockwork-prophecy",
          flavor:
            "Six brass beetles with crystal abdomens. Each carries a fragment of probability — they mend what was most likely whole.",
          preferredElements: ["probability", "reality"],
        },
      ],
      neyon: [
        {
          id: "aether-loom-gauntlet",
          name: "Aether-Loom Gauntlet",
          slot: "weapon",
          style: "aether-circuit",
          flavor:
            "Fiber-optic tendons braided through a leather gauntlet. It threads matter the way a loom threads silk.",
        },
      ],
    },
    oracle: {
      demagi: [
        {
          id: "geomantic-tap-relay",
          name: "Geomantic Tap Relay",
          slot: "weapon",
          style: "brass-oracular",
          flavor:
            "A brass divining rod strung with fiber-optic ley lines. The rod points; the cable whispers the odds.",
          preferredElements: ["earth", "water"],
        },
      ],
      quarchon: [
        {
          id: "probability-cant-slate",
          name: "Probability-Cant Slate",
          slot: "accessory",
          style: "neon-divination",
          flavor:
            "A black-glass slate scored with glowing probability cant. It pre-computes the next ten seconds and bills you for the overdraft.",
          preferredElements: ["probability", "time", "space"],
        },
      ],
      neyon: [
        {
          id: "chrome-augur-lens",
          name: "Chrome Augur Lens",
          slot: "accessory",
          style: "chrome-arcane",
          flavor:
            "A monocle plated in chrome and inscribed with the Augur's Cant. Wearers see the next branch before it blooms.",
        },
      ],
    },
    assassin: {
      demagi: [
        {
          id: "obsidian-rite-blade",
          name: "Obsidian Rite Blade",
          slot: "weapon",
          style: "obsidian-ritual",
          flavor:
            "A volcanic-glass shortsword with a brass hilt. Cuts that draw blood also draw a sigil — the sigil does the rest.",
          preferredElements: ["fire", "earth"],
        },
      ],
      quarchon: [
        {
          id: "phase-cut-stiletto",
          name: "Phase-Cut Stiletto",
          slot: "weapon",
          style: "aether-circuit",
          flavor:
            "A needle of etched brass that slips a half-second ahead of its wielder. You stab the future; the present catches up.",
          preferredElements: ["time", "space"],
        },
      ],
      neyon: [
        {
          id: "chrome-silencer-ampoule",
          name: "Chrome Silencer Ampoule",
          slot: "consumable",
          style: "chrome-arcane",
          flavor:
            "A brass ampoule of mirrored oil. A drop on a blade binds the sound of the kill to the air between atoms.",
        },
      ],
    },
    soldier: {
      demagi: [
        {
          id: "iron-rite-bulwark",
          name: "Iron-Rite Bulwark",
          slot: "secondary",
          style: "obsidian-ritual",
          flavor:
            "A kite shield of cold iron, stamped with a ward that remembers every blow it has turned. It gets heavier the longer you hold it.",
          preferredElements: ["earth", "reality"],
        },
      ],
      quarchon: [
        {
          id: "clockwork-line-carbine",
          name: "Clockwork Line Carbine",
          slot: "weapon",
          style: "clockwork-prophecy",
          flavor:
            "A gas-brass carbine that winds itself between shots. Reloads on the downbeat of the operator's heart.",
          preferredElements: ["time", "probability"],
        },
      ],
      neyon: [
        {
          id: "voltaic-aegis-harness",
          name: "Voltaic Aegis Harness",
          slot: "secondary",
          style: "voltaic-runic",
          flavor:
            "A leather harness threaded with Tesla coils and a ring of hammered silver runes. Grounds a hit into a hymn.",
        },
      ],
    },
    spy: {
      demagi: [
        {
          id: "whispering-ledger",
          name: "Whispering Ledger",
          slot: "accessory",
          style: "brass-oracular",
          flavor:
            "A pocket codex bound in oxblood and brass. Pages fill themselves with rumors the bearer is close enough to hear.",
          preferredElements: ["air", "water"],
        },
      ],
      quarchon: [
        {
          id: "mirror-cant-dossier",
          name: "Mirror-Cant Dossier",
          slot: "accessory",
          style: "neon-divination",
          flavor:
            "A folio that rewrites itself in whichever tongue the reader least suspects. Exposes a lie by showing you the sentence you wanted.",
          preferredElements: ["reality", "probability"],
        },
      ],
      neyon: [
        {
          id: "chrome-veilcloak",
          name: "Chrome Veilcloak",
          slot: "secondary",
          style: "chrome-arcane",
          flavor:
            "A hooded half-cloak stitched with mirror-scale. Against bright metal you are a reflection; against dark stone you are a rumor.",
        },
      ],
    },
  },
};

/**
 * Roll a reward for a given (source, class, species) tuple. If the
 * pool has an element-affinity match, prefer those; otherwise uniform
 * among the full pool. Deterministic when `rng` is provided.
 */
export function rollEarnedReward(
  source: RewardSource,
  classKey: ClassKey,
  speciesKey: SpeciesKey,
  elementKey: ElementKey | null,
  rng: () => number = Math.random,
): RewardItem | null {
  const pool = EARNED_REWARDS[source]?.[classKey]?.[speciesKey];
  if (!pool || pool.length === 0) return null;
  const matchPool = elementKey
    ? pool.filter((item) => item.preferredElements?.includes(elementKey))
    : [];
  const chosen = matchPool.length > 0 ? matchPool : pool;
  const idx = Math.floor(rng() * chosen.length) % chosen.length;
  return chosen[idx] ?? null;
}
