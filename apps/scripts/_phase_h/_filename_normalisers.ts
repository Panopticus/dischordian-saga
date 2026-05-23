/* ═══════════════════════════════════════════════════════
   FILENAME NORMALISERS — shared across audit + ingest

   The producer ships art with several naming conventions. The
   matcher (apps/scripts/audit-cdn-zip-vs-gaps.ts) and the per-
   family ingest scripts (apps/scripts/_phase_h/ingest-*.ts) all
   need the same canonical transformation: producer-shipped relative
   path → manifest-canonical relative path + axis/value split.

   This module is the single source of truth for that mapping.
   Adding a new producer convention = adding one PRODUCER_CONVENTIONS
   row + (optionally) extending the state-token vocabularies.

   Canonical shape:
     {
       zipDir:           string  // e.g. "cryo_bay"            (underscored)
       axis:             string  // e.g. "tv" | "investigation"
       value:            string  // e.g. "spreading"           (snake_case)
       canonicalRelPath: string  // e.g. "art/rooms/cryo_bay/state_tv_spreading.png"
       variantKey:       string  // e.g. "tv_spreading"
       id:               string  // e.g. "cryo_bay:tv_spreading"
       kind:             "baseline" | "state_variant"
     }

   The compositeResolver (apps/shared/roomVariants/compositeResolver.ts)
   constrains axis-13 hookIds to a single underscore — so `axis_value`
   must always be the simple `<axis>_<value>` shape, not
   `<axis>_<value>_<extra>`. Normalisers enforce that by snake-case
   collapsing any compound value (e.g. `victim-identified` →
   `victim_identified` is one token, treated as `value`).
   ═══════════════════════════════════════════════════════ */

/** Single producer-known axis-9 (TV-infection) state values. */
export const TV_STATES = new Set([
  "clean",
  "exposed",
  "spreading",
  "corrupted",
  "quarantined",
]);

/** Single producer-known axis-11 (cycle-phase) state values. */
export const CYCLE_STATES = new Set([
  "dawn",
  "midday",
  "dusk",
  "nightwatch",
  "longnight",
]);

/** Single producer-known axis-12 (faction-livery) state values. */
export const FACTION_STATES = new Set([
  "none",
  "hierarchy",
  "dreamers",
  "pureflame",
  "insurgency",
  "panopticon",
  "collectors",
  "multi",
]);

/** Axis-13 storyteller-hook state tokens grouped by canonical axis.
 *  When a normaliser encounters a state token in one of these
 *  vocabularies, it emits the value into the canonical axis-13
 *  storyhook variantKey `<axis>_<value>` where `<axis>` is the
 *  KEY of the matched vocabulary (e.g. "investigation").
 *
 *  Add new tokens here when a producer ZIP introduces a new
 *  axis-13 vocabulary — the compositeResolver picks them up
 *  automatically via its catch-all axis-13 branch. */
export const AXIS13_VOCABULARIES: Record<string, ReadonlySet<string>> = {
  investigation: new Set([
    "initial",
    "investigating",
    "victim_identified",
    "case_open_later",
    "case_open",
    "evidence_found",
    "suspect_identified",
    "resolution",
  ]),
  donation: new Set([
    "initial",         // medical_bay starts here (pre-donation choice)
    "device_awakened",
    "donated",
    "refused",
  ]),
  morality: new Set(["light", "dark", "balanced", "shadow", "warm"]),
  trust: new Set(["lucid", "fragmented", "luminous", "broken", "elara_luminous"]),
  lore: new Set(["ark_origins", "necromancer_lineage", "antiquarian_purpose"]),
  season: new Set(["closing", "winter", "summer", "rebirth"]),
  battlepass: new Set(["winter", "spring", "summer", "autumn"]),
  governance: new Set(["quarantine", "open", "audit", "tribunal"]),
  companion: new Set(["trust", "bond", "betrayal"]),
  event: new Set(["necromancer", "vortex", "politician"]),
  act: new Set(["tier_1", "tier_2", "tier_3", "tier_4"]),
  epoch: new Set(["shadowtongue", "celebration"]),
  reveal: new Set(["initial", "partial", "full"]),
  human: new Set(["initial", "alive", "dead"]),
  hellbox: new Set(["initial", "active", "consumed"]),
  unlock: new Set(["crew", "system", "feature"]),
  irl: new Set(["live", "scheduled", "concluded"]),
  tournament: new Set(["registration", "live", "complete"]),
  system: new Set(["unlock_crew", "online", "offline"]),
};

/** Combined value-to-axis lookup. When a state token is unique
 *  across vocabularies, this resolves it to its canonical axis.
 *  Tokens that overlap across vocabularies (e.g. "initial") are
 *  RESOLVED PER-ZIP via the normaliser's `defaultAxis13` field. */
const VALUE_TO_AXIS_LOOKUP: Map<string, string[]> = (() => {
  const out = new Map<string, string[]>();
  for (const [axis, vocab] of Object.entries(AXIS13_VOCABULARIES)) {
    for (const v of vocab) {
      const existing = out.get(v) ?? [];
      existing.push(axis);
      out.set(v, existing);
    }
  }
  return out;
})();

export interface ParsedFilename {
  /** Canonical room slug (underscored, no hyphens). */
  zipDir: string;
  /** Canonical axis (e.g. "tv", "cycle", "faction", "investigation"). */
  axis: string;
  /** Canonical value within axis (snake_case). */
  value: string;
  /** Manifest-canonical relative path. */
  canonicalRelPath: string;
  /** Producer variantKey `<axis>_<value>` (baseline → `"baseline"`). */
  variantKey: string;
  /** Synthetic id `<zipDir>:<variantKey>`. */
  id: string;
  /** Whether this is the baseline image or a state-variant overlay. */
  kind: "baseline" | "state_variant";
}

export interface ProducerNamingConvention {
  /** Stable id for the convention (used by the ingest manifest header). */
  readonly id: string;
  /** Human-readable label. */
  readonly label: string;
  /** ZIP-key prefixes that route through this convention. Match by
   *  startsWith — order matters when patterns overlap. */
  readonly zipKeys: readonly string[];
  /** Per-zipDir axis-13 hints for this pack. A single producer pack
   *  can ship state variants for multiple rooms whose arcs belong to
   *  different axis-13 vocabularies — e.g. `dischordian_room_state_art.zip`
   *  carries cryo_bay (investigation arc) AND medical_bay (donation
   *  arc). The classifier uses this map first when disambiguating an
   *  ambiguous state token. */
  readonly axis13HintByZipDir?: Readonly<Record<string, string>>;
  /** Fallback when neither the per-zipDir hint nor the unique-vocab
   *  lookup resolves the axis. Unused when the token is uniquely
   *  identified. */
  readonly defaultAxis13?: string;
  /** Parse a single entry from this ZIP into a canonical record.
   *  Return null for entries that aren't room art (UI atlases, source
   *  PSDs, README, etc.). */
  readonly parse: (relInsideZip: string, ctx: ParseContext) => ParsedFilename | null;
}

export interface ParseContext {
  /** All vocabularies, for re-use by custom parsers. */
  readonly vocabularies: typeof AXIS13_VOCABULARIES;
  /** Reverse lookup. */
  readonly valueToAxis: Map<string, string[]>;
  /** Producer-pack default axis when the value is ambiguous. */
  readonly defaultAxis13?: string;
  /** Per-zipDir axis-13 hint, copied from the convention. */
  readonly axis13HintByZipDir?: Readonly<Record<string, string>>;
}

/** Strip a leading `art/rooms/` prefix or generic top-level dir
 *  so we can normalise just the room-relative tail. */
function stripRootPrefix(rel: string): string {
  return rel
    .replace(/^art\/rooms\//, "")
    .replace(/^rooms\//, "")
    .replace(/^deliverables\/rooms\//, "");
}

/** Hyphen → underscore in the room-slug part of a producer
 *  filename. Idempotent; leaves already-underscored slugs alone. */
function hyphenToUnderscore(slug: string): string {
  return slug.replace(/-/g, "_");
}

/** Canonical baseline emitter — used by every convention's
 *  baseline branch so the shape stays in lockstep. */
function emitBaseline(zipDir: string): ParsedFilename {
  return {
    zipDir,
    axis: "baseline",
    value: "",
    canonicalRelPath: `art/rooms/${zipDir}/baseline.png`,
    variantKey: "baseline",
    id: `${zipDir}:baseline`,
    kind: "baseline",
  };
}

/** Canonical state-variant emitter. */
function emitStateVariant(zipDir: string, axis: string, value: string): ParsedFilename {
  return {
    zipDir,
    axis,
    value,
    canonicalRelPath: `art/rooms/${zipDir}/state_${axis}_${value}.png`,
    variantKey: `${axis}_${value}`,
    id: `${zipDir}:${axis}_${value}`,
    kind: "state_variant",
  };
}

/** Classify a state token (lowercased, snake_cased) into a canonical
 *  axis. Returns null when the token doesn't match any known
 *  vocabulary — caller can choose to route to a manual-triage CSV.
 *  Disambiguation priority for ambiguous tokens:
 *    1. Per-zipDir hint from the pack convention.
 *    2. Pack-level defaultAxis13 (if the candidate set contains it).
 *    3. Alphabetically-first axis (deterministic fallback). */
export function classifyStateToken(
  token: string,
  ctx: { defaultAxis13?: string; zipDir?: string; axis13HintByZipDir?: Readonly<Record<string, string>> },
): { axis: string; value: string } | null {
  const v = token.toLowerCase().replace(/-/g, "_");
  if (TV_STATES.has(v)) return { axis: "tv", value: v };
  if (CYCLE_STATES.has(v)) return { axis: "cycle", value: v };
  if (FACTION_STATES.has(v)) return { axis: "faction", value: v };

  const axisCandidates = VALUE_TO_AXIS_LOOKUP.get(v);
  if (axisCandidates && axisCandidates.length === 1) {
    return { axis: axisCandidates[0], value: v };
  }
  if (axisCandidates && axisCandidates.length > 1) {
    // 1. Per-zipDir hint
    const roomHint = ctx.zipDir && ctx.axis13HintByZipDir?.[ctx.zipDir];
    if (roomHint && axisCandidates.includes(roomHint)) {
      return { axis: roomHint, value: v };
    }
    // 2. Pack-level default
    if (ctx.defaultAxis13 && axisCandidates.includes(ctx.defaultAxis13)) {
      return { axis: ctx.defaultAxis13, value: v };
    }
    // 3. Deterministic alphabetical fallback
    return { axis: [...axisCandidates].sort()[0], value: v };
  }
  return null;
}

/* ═══════════════════════════════════════════════════════
   Convention registry. Add new packs here. Each `parse`
   returns the canonical ParsedFilename or null for entries
   that aren't room art at all.
   ═══════════════════════════════════════════════════════ */

/** Convention A — Phase-H canonical (rooms_complete_library +
 *  final_22_rooms + NEW_ROOMS_82). Producer ships
 *  `art/rooms/<zipDir>/baseline.png` and
 *  `art/rooms/<zipDir>/state_<axis>_<value>.png` already in the
 *  canonical shape. Just a passthrough normaliser. */
const CONVENTION_PHASE_H_CANONICAL: ProducerNamingConvention = {
  id: "phase_h_canonical",
  label: "Phase-H canonical (art/rooms/<zipDir>/<filename>)",
  zipKeys: [
    "AAA Final/rooms_complete_library.zip",
    "AAA Final/final_22_rooms.zip",
    "AAA Final/NEW_ROOMS_82.zip",
  ],
  parse(rel) {
    const stripped = stripRootPrefix(rel);
    const parts = stripped.split("/").filter(p => p);
    if (parts.length < 2) return null;
    // <zipDir>/<filename>
    const zipDir = hyphenToUnderscore(parts.slice(0, -1).join("/"));
    const file = parts[parts.length - 1];
    const stem = file.replace(/\.(png|webp|jpg|jpeg)$/i, "");
    if (stem === "baseline") return emitBaseline(zipDir);
    // state_<axis>_<value>
    const m = stem.match(/^state_([a-z0-9]+)_(.+)$/);
    if (!m) return null;
    return emitStateVariant(zipDir, m[1], m[2].toLowerCase().replace(/-/g, "_"));
  },
};

/** Convention B — Flat hyphenated (dischordian_room_state_art.zip).
 *  Producer ships `<room-with-hyphens>_<state>.png` at the ZIP
 *  root. Classify the state token against the vocabulary tables
 *  to determine axis. The pack mixes multiple axis-13 arcs in a
 *  single ZIP — cryo_bay (investigation) and medical_bay
 *  (donation) — so per-zipDir axis hints disambiguate ambiguous
 *  state tokens like "initial". */
const CONVENTION_FLAT_HYPHEN: ProducerNamingConvention = {
  id: "flat_hyphen",
  label: "Flat hyphenated (cryo-bay_initial.png)",
  zipKeys: [
    "AAA Final/dischordian_room_state_art.zip",
    "AAA Final/dischordian_room_state_art (2).zip",
  ],
  axis13HintByZipDir: {
    cryo_bay: "investigation",
    medical_bay: "donation",
  },
  defaultAxis13: "investigation",
  parse(rel, ctx) {
    // Reject paths with directories — this convention is flat only.
    if (rel.includes("/")) return null;
    const file = rel;
    const stem = file.replace(/\.(png|webp|jpg|jpeg)$/i, "");
    // Split on FIRST `_` because the room slug uses hyphens
    // (cryo-bay) and the state is a single token (initial), so
    // the first `_` separates them. For compound states like
    // "victim-identified", the hyphen→underscore step at the end
    // collapses both into `victim_identified` as one value token.
    const firstUnderscore = stem.indexOf("_");
    if (firstUnderscore < 0) return null;
    const slugHyphen = stem.slice(0, firstUnderscore);
    const stateRaw = stem.slice(firstUnderscore + 1);
    const zipDir = hyphenToUnderscore(slugHyphen);
    if (stateRaw === "baseline" || stateRaw === "") return emitBaseline(zipDir);
    const stateToken = stateRaw.toLowerCase().replace(/-/g, "_");
    const classified = classifyStateToken(stateToken, { ...ctx, zipDir });
    if (!classified) return null; // unknown vocabulary — fall through
    return emitStateVariant(zipDir, classified.axis, classified.value);
  },
};

/** Convention C — Two-level flat (prelude_rooms_missing_9.zip and
 *  similar). Producer ships `<room>/<file>.png`. Same as canonical
 *  Phase-H but without the `art/rooms/` wrapper. */
const CONVENTION_TWO_LEVEL_FLAT: ProducerNamingConvention = {
  id: "two_level_flat",
  label: "Two-level flat (<room>/<file>.png)",
  zipKeys: [
    "AAA Final/prelude_rooms_missing_9.zip",
    "AAA Final/inception_ark_room_tiers.zip",
    "AAA Final/deliverables_room_rewrites.zip",
  ],
  parse(rel, ctx) {
    return CONVENTION_PHASE_H_CANONICAL.parse(rel, ctx);
  },
};

/** Ordered convention registry. The matcher walks this list and
 *  takes the first match (zipKey startsWith). Unknown ZIPs fall
 *  through to a permissive default that emits content-class
 *  summaries only — no canonical paths. */
export const PRODUCER_CONVENTIONS: readonly ProducerNamingConvention[] = [
  CONVENTION_PHASE_H_CANONICAL,
  CONVENTION_FLAT_HYPHEN,
  CONVENTION_TWO_LEVEL_FLAT,
];

/** Look up the convention for a given ZIP key. Returns null when
 *  no convention is registered — caller falls back to content-class
 *  summary only. */
export function getConventionForZip(zipKey: string): ProducerNamingConvention | null {
  for (const conv of PRODUCER_CONVENTIONS) {
    for (const prefix of conv.zipKeys) {
      if (zipKey === prefix || zipKey.endsWith(prefix)) return conv;
    }
  }
  return null;
}

/** Parse a single ZIP-entry path through the right convention. Returns
 *  null when the entry isn't room art (UI atlases, source PSDs,
 *  README, unmatched filename pattern, etc.). */
export function parseProducerFilename(
  zipKey: string,
  entryRelPath: string,
): ParsedFilename | null {
  const convention = getConventionForZip(zipKey);
  if (!convention) return null;
  const ctx: ParseContext = {
    vocabularies: AXIS13_VOCABULARIES,
    valueToAxis: VALUE_TO_AXIS_LOOKUP,
    defaultAxis13: convention.defaultAxis13,
    axis13HintByZipDir: convention.axis13HintByZipDir,
  };
  return convention.parse(entryRelPath, ctx);
}
