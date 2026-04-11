/* ═══════════════════════════════════════════════════════
   CHARACTER VISUAL DNA — single source of truth

   Locked physical descriptors for every named NPC and fighter.
   When generating images, voice, or prompts anywhere — REFERENCE
   this file. Do not free-form describe characters.

   Rule: if a character's look changes, it changes HERE, and
   nowhere else. Every prompt template consumes this data.

   Each entry intentionally omits emotional/situational notes —
   those belong in the prompt, not the DNA.
   ═══════════════════════════════════════════════════════ */

export interface CharacterDNA {
  id: string;
  canonicalName: string;
  species: "human" | "demagi" | "quarchon" | "neyon" | "voltari" | "construct" | "anomaly";
  /** Apparent age (may differ from chronological) */
  apparentAge: string;
  /** Skin tone hex (anchor only, AI tools interpret) */
  skinTone: string;
  /** Hair — color + style, one phrase */
  hair: string;
  /** Eye color + any unique detail (scar, implant, glow) */
  eyes: string;
  /** 2-3 locked facial descriptors */
  faceMarks: string[];
  /** Canonical outfit (locked — do not vary) */
  outfit: string;
  /** 3-color palette for character design consistency */
  paletteHex: [string, string, string];
  /** Posture/body language token */
  posture: string;
  /** Voice archetype (used in VO prompts) */
  voiceArchetype: string;
  /** Style locks — art tokens ALWAYS applied to this character */
  styleTokens: string[];
  /** One-line "do not" rules */
  neverDepict: string[];
}

export const CHARACTER_DNA: Record<string, CharacterDNA> = {
  elara: {
    id: "elara",
    canonicalName: "Elara",
    species: "construct",
    apparentAge: "late 20s",
    skinTone: "#b87d5c",
    hair: "dark hair, shoulder-length, slightly translucent edges",
    eyes: "cyan with internal data-flicker",
    faceMarks: ["faint circuitry tracery along jawline", "soft scan-line across cheek when stressed"],
    outfit: "navy-blue Ark uniform with chrome shoulder detail, collar open, crew ID at hip",
    paletteHex: ["#0a1430", "#33e2e6", "#b87d5c"],
    posture: "attentive, hands slightly open at sides, head tilted 5° when listening",
    voiceArchetype: "warm-professional, measured cadence, faint digital reverb in emotional moments",
    styleTokens: ["holographic", "translucent-edges", "cyan-rim-backlight", "cinematic", "afrofuturist"],
    neverDepict: ["angry expression", "physical contact with environment", "full opacity"],
  },

  the_human: {
    id: "the_human",
    canonicalName: "The Human",
    species: "human",
    apparentAge: "indeterminate (chronological: ~1,500 years)",
    skinTone: "#6a4a38",
    hair: "silver-grey, short, weathered",
    eyes: "hazel with gold flecks, deep crow's feet",
    faceMarks: ["thin vertical scar under left eye", "trimmed silver beard", "weathered skin"],
    outfit: "dark leather coat over grey linen shirt, worn belt, Ark insignia faded on lapel",
    paletteHex: ["#2a2420", "#a8956b", "#6a4a38"],
    posture: "patient, weight on back foot, hands clasped behind him when listening",
    voiceArchetype: "gravel-patient, slow cadence, never raises volume",
    styleTokens: ["flat", "practical-lighting", "clean-digital", "restrained-palette"],
    neverDepict: ["uniform", "weapon drawn", "youthful skin"],
  },

  the_antiquarian: {
    id: "the_antiquarian",
    canonicalName: "The Antiquarian",
    species: "anomaly",
    apparentAge: "timeless",
    skinTone: "#c9a980",
    hair: "long grey-white, tied back, wisps escape",
    eyes: "hidden behind brass multi-lens goggles; when revealed, golden irises",
    faceMarks: ["brass goggles (multiple stacked lenses)", "lined face", "ink-smudged fingers"],
    outfit: "layered brown robes over waistcoat, leather satchel of folios, chains of keys at waist",
    paletteHex: ["#1a1108", "#c9a980", "#6b4422"],
    posture: "leaning over open books, one finger perpetually pointing at text",
    voiceArchetype: "wry-scholarly, British-library inflection, slight amusement at everything",
    styleTokens: ["temporal-echo", "glass", "sepia-wash", "ethereal"],
    neverDepict: ["modern technology", "urgency", "both goggles raised"],
  },

  the_source: {
    id: "the_source",
    canonicalName: "The Source",
    species: "anomaly",
    apparentAge: "indeterminate",
    skinTone: "#9a3040",
    hair: "black, wild, static-fringed",
    eyes: "crimson, pupils like CRT scan-lines",
    faceMarks: ["viral-glitch artifacts cross face intermittently", "no clean skin (always static overlay)"],
    outfit: "tattered dark cloak, form dissolves into signal-static at edges",
    paletteHex: ["#0a0205", "#dc2626", "#ff6070"],
    posture: "never static — constant micro-motion, figure occasionally resolves then breaks",
    voiceArchetype: "layered-many-voices, whispered, viral static underneath, feminine lead voice",
    styleTokens: ["retro", "CRT-distortion", "viral-static", "possessed-system", "crimson-wash"],
    neverDepict: ["still image without distortion", "clean resolution", "sympathetic expression"],
  },

  adjudicator_locke: {
    id: "adjudicator_locke",
    canonicalName: "Adjudicator Locke",
    species: "human",
    apparentAge: "mid 40s",
    skinTone: "#8c5a3a",
    hair: "dark brown, pulled into tight knot, one silver streak",
    eyes: "brown right eye; left eye replaced by brass steampunk eye-patch with glowing amber lens",
    faceMarks: ["steampunk eye-patch LEFT side", "scar crossing upper cheek under patch", "thin-pressed lips"],
    outfit: "high-collared judicial coat (charcoal with amber piping), gloves, ledger chained to belt",
    paletteHex: ["#1c1510", "#b8860b", "#8c5a3a"],
    posture: "rigid, hands clasped at front, head slightly tilted to compensate for missing eye",
    voiceArchetype: "clipped-bureaucratic, measured, slight warmth when making exceptions to her own rules",
    styleTokens: ["flat", "steampunk_ledger", "industrial_accent", "amber-accent", "judicial-uniform"],
    neverDepict: ["two organic eyes", "male presenting", "casual wear", "without eye-patch"],
  },

  agent_zero: {
    id: "agent_zero",
    canonicalName: "Agent Zero",
    species: "human",
    apparentAge: "late 30s",
    skinTone: "#5a4030",
    hair: "close-cropped black",
    eyes: "dark brown, one subtle cybernetic tracking implant right eye",
    faceMarks: ["faint implant ring around right eye", "small scar at jawline", "perpetual 5 o'clock shadow"],
    outfit: "matte-black operations gear, no insignia, wrist comm, utility harness",
    paletteHex: ["#0a0a10", "#6a6a70", "#5a4030"],
    posture: "operator-ready, weight centered, scanning at all times",
    voiceArchetype: "low-controlled, short sentences, operator-brief cadence",
    styleTokens: ["flat", "comms_signal", "industrial_accent", "matte-black", "operator-aesthetic"],
    neverDepict: ["civilian clothing", "emotional expression", "weapon pointed at ally"],
  },

  shadow_tongue: {
    id: "shadow_tongue",
    canonicalName: "Shadow Tongue",
    species: "anomaly",
    apparentAge: "unknown",
    skinTone: "#221a2a",
    hair: "shifting — resembles shadow fabric rather than hair",
    eyes: "violet, slit-pupil, too-large",
    faceMarks: ["mouth opens too wide", "face rearranges subtly across frames", "second row of teeth visible when speaking"],
    outfit: "deep purple robes that seem to shift texture (silk→oil→shadow)",
    paletteHex: ["#08020a", "#7a3fb8", "#c084fc"],
    posture: "too-still, or all-motion — never in-between",
    voiceArchetype: "text-glitching, speech rearranges mid-sentence, whisper-to-scream range",
    styleTokens: ["retro", "possessed_system", "CRT-distortion", "violet-aurora", "reality-glitch"],
    neverDepict: ["consistent face across two panels", "stillness", "warm expression"],
  },

  collector_clone_007: {
    id: "collector_clone_007",
    canonicalName: "Collector Clone-007",
    species: "construct",
    apparentAge: "permanent 30s",
    skinTone: "#7a5a48",
    hair: "slicked-back black with silver temples",
    eyes: "one gold contact lens (right), one brown natural (left)",
    faceMarks: ["showman grin", "clone-serial tattoo on neck (007)", "gold tooth front-right"],
    outfit: "sequined black arena-emcee coat, gold trim, arena earpiece, holographic data-monocle",
    paletteHex: ["#0a0605", "#f5c842", "#7a5a48"],
    posture: "theatrical — arms wide, always mid-gesture, showman stance",
    voiceArchetype: "emcee-broadcast, performative, vowel-stretching showmanship",
    styleTokens: ["retro", "arena_broadcast", "spotlight-overhead", "singularity_core", "gameshow-aesthetic"],
    neverDepict: ["subdued expression", "casual wear", "both eyes same color"],
  },

  necromancer: {
    id: "necromancer",
    canonicalName: "The Necromancer",
    species: "anomaly",
    apparentAge: "gaunt-ageless",
    skinTone: "#c4c0b8 (ashen)",
    hair: "white, long, trails downward as if underwater",
    eyes: "milk-white, no pupils, occasionally showing faces of the dead through them",
    faceMarks: ["sunken cheeks", "death-mask porcelain stillness", "burial-ink sigils on forehead"],
    outfit: "tattered funeral-black robes layered over bone-white inner garments, brass incense chains",
    paletteHex: ["#08050a", "#c4c0b8", "#4a0a1a"],
    posture: "floating-low, feet not touching ground, arms extended as if receiving",
    voiceArchetype: "multi-voice-chorus (deceased speaking through), whispered lamentation underneath",
    styleTokens: ["retro", "resurrection_echo", "singularity_core", "funeral-aesthetic", "afterlife-palette"],
    neverDepict: ["smile", "full color vibrancy", "feet on ground", "sunlight"],
  },

  malkia_ukweli: {
    id: "malkia_ukweli",
    canonicalName: "Malkia Ukweli",
    species: "human",
    apparentAge: "late 20s",
    skinTone: "#7d4a2a",
    hair: "voluminous black natural hair, gold threaded strands",
    eyes: "dark brown with gold-flecked iris",
    faceMarks: ["high cheekbones", "gold accent makeup around eyes", "subtle scarification along temples"],
    outfit: "afrofuturist performance armor — deep burgundy with gold filigree, regal-warrior silhouette",
    paletteHex: ["#2a0510", "#d4af37", "#7d4a2a"],
    posture: "regal, shoulders back, chin lifted 10°, warrior-queen presence",
    voiceArchetype: "powerful-resonant, lower register, commanding",
    styleTokens: ["afrofuturist", "regal-warrior", "gold-accent", "neon-rim-backlight", "cinematic"],
    neverDepict: ["straight hair", "Western formal wear", "subservient posture"],
  },
};

/* ─── HELPERS ─── */

export function getCharacterDNA(id: string): CharacterDNA | undefined {
  return CHARACTER_DNA[id];
}

export function getAllCharacters(): CharacterDNA[] {
  return Object.values(CHARACTER_DNA);
}

/**
 * Format a character's DNA as a prompt snippet.
 * Use this anywhere you're generating images or video.
 */
export function formatDnaForPrompt(id: string): string {
  const dna = CHARACTER_DNA[id];
  if (!dna) return "";
  return [
    `${dna.canonicalName}:`,
    `Species: ${dna.species}, age ${dna.apparentAge}.`,
    `Skin: ${dna.skinTone}. Hair: ${dna.hair}. Eyes: ${dna.eyes}.`,
    `Face: ${dna.faceMarks.join("; ")}.`,
    `Outfit: ${dna.outfit}.`,
    `Posture: ${dna.posture}.`,
    `Palette: ${dna.paletteHex.join(" / ")}.`,
    `Style: ${dna.styleTokens.join(", ")}.`,
    `NEVER: ${dna.neverDepict.join(", ")}.`,
  ].join(" ");
}

/**
 * Format a character's voice DNA for VO prompts.
 */
export function formatVoiceForPrompt(id: string): string {
  const dna = CHARACTER_DNA[id];
  if (!dna) return "";
  return `${dna.canonicalName} — ${dna.voiceArchetype}.`;
}
