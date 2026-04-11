/* ═══════════════════════════════════════════════════════
   THE PALIMPSEST — Signal / Noise Dual Meter

   "The Palimpsest" is a 13-episode in-universe reality show
   that runs parallel to the main Dischordian Saga. The Host
   — a Meme in a Game Master mask — broadcasts weekly to
   the Ark. Contestants answer Loredex questions, debate
   factions, and often die on-screen. The Inventor hacks
   the broadcast from somewhere outside time, escalating
   each episode until Episode 12.

   WHAT THE METER TRACKS:
   The Palimpsest is a two-bar scoreboard of TRUTH vs.
   CORRUPTION across the entire Dischordian Saga. It lives
   alongside the Necromancer Cycle (death/life) and the
   Humanity/Machine morality axis as a third global meter.

     • SIGNAL (gold ink): the community remembers what
       really happened. Correct quiz answers, solved
       research puzzles, crafted truths, dialog choices
       that admit the truth, Signal Beacons rated "Truth,"
       catching the Meme's disguise.

     • NOISE (red ink): the Shadow Tongue wins an edit.
       Wrong quiz answers, failed puzzles, craft failures,
       agreeing with General Alaric, ignoring Signal
       Beacons, losing an episode.

   When Signal dominates, corrupted Loredex entries auto-
   repair at a trickle rate. When Noise dominates, the
   Shadow Tongue marks entries as "Edited" and the Host's
   mask slips on broadcast.

   Players see this meter as a two-column illuminated
   manuscript on the Governance Hub — not numbers.
   ═══════════════════════════════════════════════════════ */

/* ─── STATE ─── */

export interface PalimpsestState {
  /** "Gold ink" — truth, remembering, integrity. */
  signal: number;
  /** "Red ink" — corruption, editing, forgetting. */
  noise: number;
  /** Last time passive decay was applied. */
  lastDecayAt: string;
  /** Current broadcast episode (1..13). */
  currentEpisode: number;
  /** Whether the Host's mask has visibly slipped this episode. */
  hostMaskSlipped: boolean;
  /** History of episode outcomes. */
  history: EpisodeRecord[];
}

export interface EpisodeRecord {
  episodeNumber: number;
  winner: "signal" | "noise" | "draw";
  casualties: string[];
  signalGained: number;
  noiseGained: number;
  inventorHackLanded: boolean;
  completedAt: string;
}

/* ─── TUNING CONSTANTS ─── */

/** Rough cap the meters animate toward — not enforced; passive decay assumes this scale. */
export const PALIMPSEST_SOFT_MAX = 1000;

/** Tiny passive Signal decay applied per day, per C.2 of the design proposal. */
export const PASSIVE_SIGNAL_DECAY_PER_DAY = 1;

/** Noise never passively decays — it has to be actively overwritten by Signal. */
export const PASSIVE_NOISE_DECAY_PER_DAY = 0;

/** Difference above which Noise visibly corrupts Loredex entries. */
export const NOISE_CORRUPTION_THRESHOLD = 100;

/** Difference above which Signal auto-repairs corrupted entries. */
export const SIGNAL_REPAIR_THRESHOLD = 150;

/** Difference above which the Host's mask slips on broadcast. */
export const MASK_SLIP_THRESHOLD = 250;

/* ─── DELTA TABLE (per design proposal, Appendix C.2) ─── */

/**
 * Canonical Signal / Noise deltas. All Palimpsest-affecting events
 * should reference this table so balance is centrally tunable.
 */
export const PALIMPSEST_DELTAS = {
  // ── Signal sources ──
  quizCorrect: { signal: 1, noise: 0 },
  researchPuzzleSolved: { signal: 5, noise: 0 },
  epicCraftSuccess: { signal: 2, noise: 0 },
  legendaryCraftSuccess: { signal: 5, noise: 0 },
  episodeWon: { signal: 50, noise: 0 },
  signalBeaconLeft: { signal: 10, noise: 0 },
  truthDialogChoice: { signal: 1, noise: 0 },
  catchingMemeDisguise: { signal: 25, noise: 0 },
  loredexVotePreserve: { signal: 3, noise: 0 },

  // ── Noise sources ──
  quizWrong: { signal: 0, noise: 1 },
  researchPuzzleFailed: { signal: 0, noise: 2 },
  craftFailure: { signal: 0, noise: 1 },
  episodeLost: { signal: 0, noise: 25 },
  signalBeaconIgnored: { signal: 0, noise: 5 },
  agreeingWithAlaric: { signal: 0, noise: 10 },
  lieDialogChoice: { signal: 0, noise: 1 },
  loredexVoteSacrifice: { signal: 0, noise: 3 },

  // ── Meta events ──
  inventorHackLanded: { signal: 10, noise: 0 }, // The Inventor is on your side.
  inventorHackBlocked: { signal: 0, noise: 10 }, // The Host blocked it.
  hostMaskSlipped: { signal: 20, noise: 0 }, // Seeing through the mask IS a truth event.
  showCasualty: { signal: 0, noise: 15 }, // A contestant dies on air.
} as const;

export type PalimpsestDeltaKey = keyof typeof PALIMPSEST_DELTAS;

/* ─── POETIC DESCRIPTORS (the player never sees numbers) ─── */

export function getSignalDescription(signal: number): string {
  if (signal < 50) return "The manuscript is mostly blank. One or two pages gleam.";
  if (signal < 150) return "Gold ink spreads across the left margin.";
  if (signal < 300) return "Whole chapters hold their shape. The truth is legible.";
  if (signal < 500) return "The Chronicle remembers itself clearly.";
  if (signal < 800) return "Even the footnotes glow. Nothing has been forgotten.";
  return "The Palimpsest is radiant. Every name holds.";
}

export function getNoiseDescription(noise: number): string {
  if (noise < 50) return "A few smudges. The Shadow Tongue hasn't tried hard.";
  if (noise < 150) return "Red crosshatch creeps along the right margin.";
  if (noise < 300) return "Whole paragraphs have been overwritten in someone else's hand.";
  if (noise < 500) return "The manuscript is bleeding. Half the entries are wrong.";
  if (noise < 800) return "You cannot tell what the original said. Only what the editor left.";
  return "The Palimpsest is unreadable. The Shadow Tongue has won this page.";
}

export function getBalanceDescription(state: PalimpsestState): string {
  const diff = state.signal - state.noise;
  if (diff > SIGNAL_REPAIR_THRESHOLD) {
    return "The Chronicle rewrites itself faster than it can be edited. Corrupted entries are repairing.";
  }
  if (diff > 0) return "Truth is ahead of the edit, but only just.";
  if (diff > -NOISE_CORRUPTION_THRESHOLD) return "The Shadow Tongue and the truth are locked in a draw.";
  if (diff > -MASK_SLIP_THRESHOLD) {
    return "Entries are being corrupted. The Host grins a little too wide.";
  }
  return "The Host's face is slipping. Something else is underneath.";
}

/* ─── DERIVED STATE ─── */

export type PalimpsestPhase =
  | "radiant"        // Signal far ahead — auto-repair active
  | "truthful"       // Signal ahead
  | "balanced"       // ~equal
  | "corrupted"      // Noise ahead — entries being edited
  | "overwritten";   // Noise far ahead — mask slip, full corruption

export function getPhase(state: PalimpsestState): PalimpsestPhase {
  const diff = state.signal - state.noise;
  if (diff >= SIGNAL_REPAIR_THRESHOLD) return "radiant";
  if (diff > 0) return "truthful";
  if (diff >= -NOISE_CORRUPTION_THRESHOLD) return "balanced";
  if (diff >= -MASK_SLIP_THRESHOLD) return "corrupted";
  return "overwritten";
}

export function shouldCorruptLoredex(state: PalimpsestState): boolean {
  const phase = getPhase(state);
  return phase === "corrupted" || phase === "overwritten";
}

export function shouldRepairLoredex(state: PalimpsestState): boolean {
  return getPhase(state) === "radiant";
}

export function shouldHostMaskSlip(state: PalimpsestState): boolean {
  return getPhase(state) === "overwritten";
}

/* ─── PURE REDUCERS ─── */

/** Apply a canonical delta by key. Pure, returns a new state. */
export function applyPalimpsestDelta(
  state: PalimpsestState,
  key: PalimpsestDeltaKey,
  multiplier: number = 1,
): PalimpsestState {
  const delta = PALIMPSEST_DELTAS[key];
  return {
    ...state,
    signal: Math.max(0, state.signal + delta.signal * multiplier),
    noise: Math.max(0, state.noise + delta.noise * multiplier),
  };
}

/** Apply a raw delta. For tests and cross-system handlers. */
export function applyRawDelta(
  state: PalimpsestState,
  signalDelta: number,
  noiseDelta: number,
): PalimpsestState {
  return {
    ...state,
    signal: Math.max(0, state.signal + signalDelta),
    noise: Math.max(0, state.noise + noiseDelta),
  };
}

/** Apply passive decay. Should be called on login / daily tick. */
export function applyPassiveDecay(
  state: PalimpsestState,
  nowMs: number = Date.now(),
): PalimpsestState {
  const last = Date.parse(state.lastDecayAt);
  if (Number.isNaN(last)) return { ...state, lastDecayAt: new Date(nowMs).toISOString() };
  const daysElapsed = Math.floor((nowMs - last) / (24 * 60 * 60 * 1000));
  if (daysElapsed <= 0) return state;
  return {
    ...state,
    signal: Math.max(0, state.signal - PASSIVE_SIGNAL_DECAY_PER_DAY * daysElapsed),
    noise: Math.max(0, state.noise - PASSIVE_NOISE_DECAY_PER_DAY * daysElapsed),
    lastDecayAt: new Date(nowMs).toISOString(),
  };
}

/** Record an episode outcome into history and advance currentEpisode. */
export function recordEpisode(
  state: PalimpsestState,
  record: Omit<EpisodeRecord, "completedAt"> & { completedAt?: string },
): PalimpsestState {
  const next = {
    ...record,
    completedAt: record.completedAt ?? new Date().toISOString(),
  };
  return {
    ...state,
    history: [...state.history, next],
    currentEpisode: Math.min(13, state.currentEpisode + 1),
    // Episode outcomes flip mask slip back off at the start of the next broadcast.
    hostMaskSlipped: false,
  };
}

/* ─── DEFAULT STATE ─── */

export const DEFAULT_PALIMPSEST_STATE: PalimpsestState = {
  signal: 0,
  noise: 0,
  lastDecayAt: new Date(0).toISOString(),
  currentEpisode: 1,
  hostMaskSlipped: false,
  history: [],
};

/* ─── LOREDEX CORRUPTION MARKERS ─── */

/**
 * The Shadow Tongue's edits are cosmetic until the player looks
 * at a specific Loredex entry. These helpers decide which entries
 * appear "edited" when Noise dominates.
 */
export interface LoredexCorruptionMark {
  entryId: string;
  /** 0-1 strength of the edit. */
  severity: number;
  /** The ghost of the real text, if the player still has high enough Signal. */
  originalGlimpse?: string;
}

/** Deterministic pseudo-random marker selection based on entry ID + noise level. */
export function shouldMarkEntryCorrupted(
  entryId: string,
  state: PalimpsestState,
): boolean {
  if (!shouldCorruptLoredex(state)) return false;
  // Cheap deterministic hash — same entry corrupts consistently for same noise band.
  let h = 0;
  for (let i = 0; i < entryId.length; i++) h = (h * 31 + entryId.charCodeAt(i)) | 0;
  const band = Math.floor(state.noise / 50);
  return Math.abs((h + band) % 10) < Math.min(7, Math.floor((state.noise - state.signal) / 40));
}

export function getEntryCorruptionSeverity(
  entryId: string,
  state: PalimpsestState,
): number {
  if (!shouldMarkEntryCorrupted(entryId, state)) return 0;
  const diff = Math.max(0, state.noise - state.signal);
  return Math.min(1, diff / 500);
}
