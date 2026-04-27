/* ═══════════════════════════════════════════════════════
   AWAKENING CINEMATIC PROMPTS — Kling Omni

   Per-line cinematic video backdrops for the Awakening
   sequence. Each of Elara's VO lines (CRYO_OPEN →
   FIRST_STEPS) plays over a short looping Kling-generated
   clip. A Bioware-style dialog shell (portrait + typewriter
   + choices) is composited over the bottom third at runtime
   by CinematicDialogOverlay.

   GOLDEN RULES (reflected in every prompt/negativePrompt):
     - NEVER show the player character's face. No first-person
       POV shots, no selfie cam, no mirror reveal.
     - Camera lives in the environment. Over-shoulder or
       silhouette-from-behind if a human presence is
       unavoidable; otherwise pure architecture, instruments,
       frost, starfield, Elara's hologram, etc.
     - Visual aesthetic matches the existing Section F
       room-state renders in apps/shared/roomStateArtPrompts.ts
       — cyberpunk × steampunk sorcery, oil-blued steel,
       patinated brass, phosphor-lavender sigil glow.
     - Each clip is SHORT (6–10 s), designed to loop
       seamlessly under variable VO length.

   All ten beat clips have landed in
   s3://dgrsart/cdn/client-public/videos/awakening/{STEP_ID}.mp4
   and are wired below via videoFor(...). AwakeningPage's background
   layer (apps/client/src/pages/AwakeningPage.tsx:744–766) now plays
   each per-step loop instead of falling back to the still render.
   To replace a clip, drop the new MP4 into
   apps/client/public/videos/awakening/ and run pnpm assets:upload.
   ═══════════════════════════════════════════════════════ */

export type AwakeningStepId =
  | "CRYO_OPEN"
  | "ELARA_INTRO"
  | "SPECIES_QUESTION"
  | "CLASS_QUESTION"
  | "ALIGNMENT_QUESTION"
  | "ELEMENT_QUESTION_DEMAGI"
  | "ELEMENT_QUESTION_QUARCHON"
  | "NAME_INPUT"
  | "ATTRIBUTES"
  | "FIRST_STEPS";

export interface AwakeningCinematicPrompt {
  /** Matches the AwakeningStep enum (plus species branches). */
  id: AwakeningStepId;
  /** Target clip length in seconds. Authored short; looped under VO. */
  durationSec: number;
  /** One-line camera note so animators, QA, and prompt-tuning agree. */
  cameraNote: string;
  /** Full Kling Omni positive prompt. */
  prompt: string;
  /** Negative prompt — hard bans on first-person/player-face shots. */
  negativePrompt: string;
  /** Rendered CDN URL. Null until the pipeline produces it. */
  videoUrl: string | null;
}

/**
 * Shared anchor copied into every prompt's head. Matches the room-state
 * style bible so the cinematics composite onto the Section F renders
 * without an aesthetic seam.
 */
const AWAKENING_STYLE_ANCHOR =
  "Cinematic 16:9 video loop, 6–10 seconds, seamless loop. Aesthetic: " +
  "cyberpunk × steampunk sorcery — oil-blued steel, patinated brass, " +
  "deep oxblood accent lighting, warm-gold service lamps, " +
  "phosphor-lavender and phosphor-green sigil glows threaded through " +
  "riveted hull panels. Slow dust motes in volumetric light. Faint " +
  "film-grain sepia undertone. No visible player character, no text, " +
  "no HUD, no watermarks.";

/**
 * Shared negative-prompt fragment that bans the things we never want.
 * Composed with per-scene additions.
 */
const AWAKENING_NEGATIVE_BASE =
  "first person, first-person POV, selfie view, reflection of the " +
  "player, player face, protagonist face, close-up of a character's " +
  "face looking at the camera, mirror reveal, hand holding a weapon " +
  "in frame, HUD elements, UI, rendered text, subtitles, watermark, " +
  "logo, modern clothing, modern phone, real-world branding";

/**
 * CDN base for the awakening cinematic deliveries. Mirrors
 * apps/client/src/lib/assetUrl.ts; duplicated here because shared/
 * cannot import from client/. The bucket is public-read for these
 * paths via the standard cdn/client-public/ prefix.
 */
const AWAKENING_CDN_BASE =
  "https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public";

const videoFor = (step: AwakeningStepId): string =>
  `${AWAKENING_CDN_BASE}/videos/awakening/${step}.mp4`;

export const AWAKENING_CINEMATIC_PROMPTS: Readonly<
  Record<AwakeningStepId, AwakeningCinematicPrompt>
> = {
  CRYO_OPEN: {
    id: "CRYO_OPEN",
    durationSec: 8,
    cameraNote:
      "Frost crystals on the pod's inner glass, extreme close-up — camera pulls back into the cryo bay's cold blue gloom. No occupant visible.",
    prompt:
      AWAKENING_STYLE_ANCHOR +
      " Extreme close-up on the inside of a cryogenic pod's frosted glass. Frost crystals bloom and retreat in time with slow breath-pulses of warm-gold light bleeding through from the chamber beyond. The camera slowly pulls back, revealing the pod's brass rim, a bead of condensation rolling down the oil-blued steel housing, and — through the wider frame — the Cryo Bay of an Inception Ark: rows of sealed pods receding into cold indigo haze, service lamps breathing. No figure inside the pod. Mood: the breath returning to a body, captured in architecture.",
    negativePrompt:
      AWAKENING_NEGATIVE_BASE +
      ", any human figure inside the pod, any face behind the glass",
    videoUrl: videoFor("CRYO_OPEN"),
  },

  ELARA_INTRO: {
    id: "ELARA_INTRO",
    durationSec: 10,
    cameraNote:
      "Elara's holographic avatar materializes over the Cryo Bay floor — phosphor-lavender particle bloom, slow orbital camera, no observer.",
    prompt:
      AWAKENING_STYLE_ANCHOR +
      " A holographic avatar materializes in mid-air above the Cryo Bay floor — a composite of phosphor-cyan particles, floating braided hair rendered in light, a faint shimmer of a feminine silhouette never fully resolved. Around her, fiber-optic ley-lines in the floor plates pulse in cadence with her breath. Camera makes a slow 180° arc around her at waist height, revealing the rows of sealed pods behind her going out of focus in depth-of-field. Dust motes catch the warm-gold service lamps. Mood: an intelligence introducing itself to a room she has watched for centuries.",
    negativePrompt:
      AWAKENING_NEGATIVE_BASE +
      ", fully solid human Elara, realistic skin, any second figure in frame",
    videoUrl: videoFor("ELARA_INTRO"),
  },

  SPECIES_QUESTION: {
    id: "SPECIES_QUESTION",
    durationSec: 9,
    cameraNote:
      "Holographic DNA helix over a medical console; helix forks into an arcane-flame strand and a crystalline data-lattice strand.",
    prompt:
      AWAKENING_STYLE_ANCHOR +
      " Slow dolly around a floating holographic DNA double-helix hovering above a brass-and-oil-blued-steel medical console. The helix glitches, then splits: one strand turns into a flowing arcane flame etched with glyphs (phosphor-lavender, warm ember), the other into a crystalline data-lattice of probability traces (phosphor-green, cold). Both strands rotate around an empty center where the player's reading would go. The camera never includes the player; the operator's hands and body are off-frame. Background: smoked-glass panels, banks of vials, patinated brass fittings catching warm-gold light. Mood: a diagnostic engine asking the question you don't want to answer.",
    negativePrompt:
      AWAKENING_NEGATIVE_BASE +
      ", human body near the console, lab technician visible",
    videoUrl: videoFor("SPECIES_QUESTION"),
  },

  CLASS_QUESTION: {
    id: "CLASS_QUESTION",
    durationSec: 9,
    cameraNote:
      "Five holographic skill-matrix glyphs rotate around an empty center. Camera slow-orbit at waist height — no player in frame.",
    prompt:
      AWAKENING_STYLE_ANCHOR +
      " Five holographic glyphs rotate slowly in a ring above a dark plate-metal floor, each a class sigil: a wrench braided with fiber-optic ley-lines (Engineer), a white-light eye ringed by phosphor-green probability dots (Oracle), a hair-thin serrated blade wreathed in violet venom-smoke (Assassin), a plasma bayonet wrapped in oxblood banner cloth (Soldier), a keyhole of shifting redacted glyphs (Spy). The camera orbits the ring at waist height. The ring's center is empty — the operator is implied, never shown. Service lamps breathe warm-gold. Mood: aptitudes waiting for a hand to reach in.",
    negativePrompt:
      AWAKENING_NEGATIVE_BASE +
      ", a hand reaching into frame from camera-right, any chosen class figure",
    videoUrl: videoFor("CLASS_QUESTION"),
  },

  ALIGNMENT_QUESTION: {
    id: "ALIGNMENT_QUESTION",
    durationSec: 10,
    cameraNote:
      "Split cinematic diptych — Panopticon lens array on one side, a Dreamer's impossible storm on the other. Camera gently dollies down the divide.",
    prompt:
      AWAKENING_STYLE_ANCHOR +
      " Symbolic split-screen with a soft seam of phosphor light down the middle. LEFT: the Architect's Panopticon — a vast brass-and-steel lens array facing forward, thousands of smaller iris apertures opening and closing in quiet perfect synchrony, cold institutional geometry, oxblood shadow. RIGHT: the Dreamer's chaos — a weather system inside a room, free-floating glyphs drifting like migrating birds, a chandelier of broken clock faces revolving at impossible angles, warm gold threading through phosphor-lavender sparks. The camera slowly dollies down the seam; it never chooses a side. Mood: two philosophies waiting to be answered to.",
    negativePrompt:
      AWAKENING_NEGATIVE_BASE +
      ", any figure taking sides, explicit good/evil iconography, real-world religious imagery",
    videoUrl: videoFor("ALIGNMENT_QUESTION"),
  },

  ELEMENT_QUESTION_DEMAGI: {
    id: "ELEMENT_QUESTION_DEMAGI",
    durationSec: 8,
    cameraNote:
      "Ring of five arcane elemental sigils carved in brass, each breathing its element. Camera orbits at knee height, no operator.",
    prompt:
      AWAKENING_STYLE_ANCHOR +
      " A ring of five carved brass sigils set into the floor plates of a small sanctum, each sigil breathing its elemental signature: fire sigil hosts a low arcane flame licking warm-gold, water sigil holds a slowly-revolving sphere of suspended liquid, earth sigil cracks and reforms a lattice of crystal, air sigil spins a dust devil of phosphor-lavender motes, shadow sigil eats the light around it into a velvet absence. The camera orbits the ring at knee height. Ley-lines spoke inward from the sigils to an empty center. No figure in frame. Mood: DeMagi blood listening for its own resonance.",
    negativePrompt:
      AWAKENING_NEGATIVE_BASE +
      ", figure kneeling inside the ring, hand hovering over a sigil",
    videoUrl: videoFor("ELEMENT_QUESTION_DEMAGI"),
  },

  ELEMENT_QUESTION_QUARCHON: {
    id: "ELEMENT_QUESTION_QUARCHON",
    durationSec: 8,
    cameraNote:
      "Five dimension-gates stacked like suspended holograms. Camera glides between them in a long lateral dolly.",
    prompt:
      AWAKENING_STYLE_ANCHOR +
      " Five suspended holographic dimension-gates float in a vaulted steel-and-brass chamber: a slow-rotating void horizon (space), a lattice of clockwork gears frozen and unfrozen in turn (time), an infinity-mirror of probability branches (probability), a plane of mathematical glyphs folding in on themselves (logic), and a luminous weave of data-threads patterning into language (data). The camera glides between them in a long lateral dolly, each gate exhaling a faint tone of phosphor-green. No operator in frame. Mood: a Quarchon's cognition running through its available reality-handles.",
    negativePrompt:
      AWAKENING_NEGATIVE_BASE +
      ", humanoid robot in frame, obvious sci-fi cliché android",
    videoUrl: videoFor("ELEMENT_QUESTION_QUARCHON"),
  },

  NAME_INPUT: {
    id: "NAME_INPUT",
    durationSec: 7,
    cameraNote:
      "Macro shot on a serial-number brass dogtag rotating slowly over a data-slate; the engraved number flickers and starts erasing itself one glyph at a time.",
    prompt:
      AWAKENING_STYLE_ANCHOR +
      " Macro shot of a brass crew-dogtag suspended above a powered data-slate on a warm-gold-lit console. The tag rotates very slowly; stamped into it is a long serial number. Under the tag, the data-slate's holographic cursor blinks. As the camera pushes in, the serial number's glyphs flicker and begin to dissolve into phosphor-lavender motes one at a time, leaving a clean empty space where a name will be written. Soft dust in the service-lamp beam. Mood: the ritual of being addressed by something that matters.",
    negativePrompt:
      AWAKENING_NEGATIVE_BASE +
      ", any fingers interacting with the tag, a person's profile behind the tag",
    videoUrl: videoFor("NAME_INPUT"),
  },

  ATTRIBUTES: {
    id: "ATTRIBUTES",
    durationSec: 8,
    cameraNote:
      "Three neon diagnostic pillars (ATK/DEF/VIT) rising from the floor plates, calibrating with quiet authority. Camera floats between them.",
    prompt:
      AWAKENING_STYLE_ANCHOR +
      " Three tall diagnostic pillars of phosphor-cyan data rise from the brass floor plates of a Med Bay annex, each labeled in engraved brass at its base with an abstract glyph for ATTACK, DEFENSE, and VITALITY. Inside each pillar, a column of calibration bars fills and empties rhythmically, settling into balanced readings. Ley-lines beneath the plates pulse between the three pillars, sharing power. The camera drifts through the pillars at chest height — no operator visible. Mood: a neural interface handshaking with a nervous system it has never met before.",
    negativePrompt:
      AWAKENING_NEGATIVE_BASE +
      ", figure standing between the pillars, arms extended cruciform",
    videoUrl: videoFor("ATTRIBUTES"),
  },

  FIRST_STEPS: {
    id: "FIRST_STEPS",
    durationSec: 10,
    cameraNote:
      "Long corridor of the Ark stretching away from the Cryo Bay door — door's phosphor seal flips red→amber→green; camera holds the threshold, never steps through.",
    prompt:
      AWAKENING_STYLE_ANCHOR +
      " A long corridor of the Inception Ark seen from the threshold of the Cryo Bay: vaulted hull-rib ceiling in oil-blued steel, warm-gold service lamps receding into depth, brass signage placards, distant phosphor-lavender sigils etched into the floor. The reinforced bulkhead door in the foreground cycles its seal-status indicator from red to amber to green. Service lamps further down the hall flicker on one section at a time as though inviting passage. The camera holds on the threshold — it never steps through. Dust in the beams, a single drifting leaf of paper. Mood: the first step is yours to take.",
    negativePrompt:
      AWAKENING_NEGATIVE_BASE +
      ", player walking down the corridor, footprints on the floor, companion silhouette",
    videoUrl: videoFor("FIRST_STEPS"),
  },
};

/** Helper — returns the cinematic for a given awakening step and species branch. */
export function getAwakeningCinematic(
  stepId: string,
  species?: string,
): AwakeningCinematicPrompt | null {
  if (stepId === "ELEMENT_QUESTION") {
    return species === "quarchon"
      ? AWAKENING_CINEMATIC_PROMPTS.ELEMENT_QUESTION_QUARCHON
      : AWAKENING_CINEMATIC_PROMPTS.ELEMENT_QUESTION_DEMAGI;
  }
  return (AWAKENING_CINEMATIC_PROMPTS as Record<string, AwakeningCinematicPrompt>)[stepId] || null;
}
