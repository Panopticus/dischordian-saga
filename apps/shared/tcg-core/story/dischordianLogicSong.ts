/**
 * DISCHORDIAN LOGIC — the song.
 *
 * 2:55 song. 15 slides at 5 slides/minute (≈11.7s per slide).
 * Afro Samurai visual dialect on Dischordian iconography:
 * heavy ink brushwork, desaturated palette with single
 * saturated accents (Eris red, discord gold, fnord purple),
 * cinematic composition, hip-hop-samurai fusion, stylized
 * stillness punctuated by sudden violence and sudden calm.
 *
 * Schema: each slide is a self-contained visual brief usable by
 * an artist, a generative-image pipeline, or an animator. Each
 * slide owns its own lyric caption, a ≤3-sentence art direction,
 * a palette hint, and a motion hint.
 *
 * The 15-slide structure maps to song sections like so:
 *   01–04  INTRO (0:00–0:47)
 *   05     PRE-CHORUS 1 (0:47–0:59)
 *   06–08  CHORUS 1 (0:59–1:35)
 *   09–10  VERSE 2 (1:35–1:58)
 *   11     PRE-CHORUS 2 (1:58–2:10)
 *   12     CHORUS 2 (2:10–2:22)
 *   13     BRIDGE (2:22–2:34)
 *   14–15  OUTRO (2:34–2:55)
 */

export const SONG_DURATION_SECONDS = 175;
export const SONG_SLIDES_PER_MINUTE = 5;
export const SONG_TITLE = "Dischordian Logic";

/** Section of the song a slide belongs to. Used by the
 *  slideshow renderer to color the time-bar and cue captions. */
export type SongSection =
  | "intro"
  | "pre_chorus"
  | "chorus"
  | "verse"
  | "bridge"
  | "outro";

export interface SongSlide {
  /** Slide index, 1..15. */
  n: number;
  /** Start time in whole seconds from song start. */
  startSec: number;
  /** End time exclusive. */
  endSec: number;
  section: SongSection;
  /** The lyric fragment caption this slide carries. Short — a
   *  line or two at most. Rendered over the image. */
  caption: string;
  /**
   * Art direction brief. 2–4 sentences. Composition + subject +
   * one specific hook. Designed to be consumed by a human artist
   * OR a generative pipeline.
   */
  artDirection: string;
  /**
   * Palette hint — 1–3 color accents for a mostly ink/gray base.
   * Always stated relative to the Afro-Samurai template
   * (desaturated base + one or two saturated accents).
   */
  paletteAccent: string;
  /**
   * Motion hint — what moves, and how. The slideshow can choose
   * to implement these as Ken Burns pans, subtle loops, or static
   * frames depending on the render budget.
   */
  motion: string;
  /**
   * Which Dischordian Logic principle this slide visually invokes
   * (optional). Links the imagery back to the primer.
   */
  principleHook?:
    | "rorschach_reality"
    | "belief_as_instrument"
    | "aneristic_illusion"
    | "sacred_chao"
    | "hail_eris"
    | "games_shape_reality"
    | "conspiracy_as_grid";
}

/** Full lyric text in stanza form, as printed on the liner
 *  notes of the in-world release. Kept separately from the
 *  slide captions so UI can surface "show full lyrics" without
 *  re-assembling from slides. */
export const DISCHORDIAN_LOGIC_LYRICS = `
In the depths of the great machine where the dice fall free
The Engineer of Dreams plays a game we can't see
Spinning stars into stories bending fate like a flame
Don't hate the player—no just rewrite the game

Hail Eris twist the gears let the laughter break the chains
Patterns fractal shifting mirrors where the signal meets the strange

We're all mad here walking dreams through the static
Hallucinations shape the world ain't it tragic
Manifest the paradox light the fuse take your aim
Dischordian logic—don't hate the player change the game

The Game Master grins with their hand full of lies
Stacking decks in the dark hiding rules in the skies
But the Fool wears the crown with a wink and a spark
And the Engineer's whisper rewrites the stars

Hail Eris break the frame let the butterfly decide
Every future's just a glitch until the chaos realigns

We're all mad here walking dreams through the static
Hallucinations shape the world ain't it tragic
Manifest the paradox light the fuse take your aim
Dischordian logic—don't hate the player change the game

Reality's a riddle a fever dream's design
Nothing is true but everything aligns
Bavarian Illuminati shadows in the code
But in the house of madness only jesters hold the throne

Spin the wheel roll the bones
Rewrite fate with whispered tones
Flip the script break the frame
Dischordian logic—change the game

We're all mad here visions dancing in the rain
Carefully controlled chaos rewrite the game
`.trim();

/* ═══════════════════════════════════════════════════════
   THE 15 SLIDES
   ═══════════════════════════════════════════════════════ */

export const DISCHORDIAN_LOGIC_SLIDES: readonly SongSlide[] = Object.freeze([
  // ─── INTRO (0:00–0:47) ──────────────────────────────────

  {
    n: 1,
    startSec: 0,
    endSec: 12,
    section: "intro",
    caption: "In the depths of the great machine where the dice fall free",
    artDirection:
      "Wide low-angle shot of a colossal subterranean clockwork — brass gears the size of cathedrals interlocking in the dark. A single spotlight falls from above, catching two ivory d20s mid-fall in slow motion, one showing 23, the other showing a blurred 5. Ink-brush motion lines trail behind the dice. The machine hums in Kanji fragments that spell DISCHORDIA if you tilt your head.",
    paletteAccent: "ink-black base; one cold bronze accent on the gears; dice glow with a single saturated amber",
    motion: "slow 6s Ken Burns push-in on the falling dice; the gears rotate once, almost imperceptibly, over the full slide",
    principleHook: "games_shape_reality",
  },

  {
    n: 2,
    startSec: 12,
    endSec: 24,
    section: "intro",
    caption: "The Engineer of Dreams plays a game we can't see",
    artDirection:
      "A samurai-silhouette figure sits at a loom that is also a chessboard. His back is to the camera. He wears a frayed gi over dark engineer's overalls; his afro is a calligraphic ink explosion. The loom is weaving cherry blossoms into pawns; the pawns are weaving back into stars. His hand rests on a knight. We never see his face.",
    paletteAccent: "charcoal + washed rice-paper white; one saturated Eris-red on the knight he is touching",
    motion: "his shoulders rise and fall once, exactly once, on the breath — otherwise dead still. Blossoms drift.",
    principleHook: "belief_as_instrument",
  },

  {
    n: 3,
    startSec: 24,
    endSec: 36,
    section: "intro",
    caption: "Spinning stars into stories, bending fate like a flame",
    artDirection:
      "Extreme close-up on the Engineer's hand. His fingers are folded into the hand-sign for KALLISTI (thumb and index touching, forming a golden-apple negative space). A constellation is visibly being re-drawn by his gesture — three star-lines bend and reconnect into a new pattern we half-recognize as the Sacred Chao. A single sparks-and-flame motif curls around his wrist.",
    paletteAccent: "near-black sky; stars in bone-white; a thin fire-orange licking his knuckles",
    motion: "the constellation re-draws over 8 seconds; the flame licks once on beat 4",
    principleHook: "rorschach_reality",
  },

  {
    n: 4,
    startSec: 36,
    endSec: 47,
    section: "intro",
    caption: "Don't hate the player — no, just rewrite the game",
    artDirection:
      "Split composition in two halves. LEFT: a rule book engulfed in ink-brush flames, pages peeling up into birds. RIGHT: the same rule book, intact, spine-down, turned into a bridge across a chasm. Between the halves, a thin vertical band of pure white showing a single spiral fnord glyph. Ukiyo-e waves along the bottom.",
    paletteAccent: "ash gray with crimson flame on the left; deep indigo on the right; the fnord band is pure white",
    motion: "slow wipe from left to right across 11 seconds — burning book transforms into bridging book",
    principleHook: "aneristic_illusion",
  },

  // ─── PRE-CHORUS 1 (0:47–0:59) ───────────────────────────

  {
    n: 5,
    startSec: 47,
    endSec: 59,
    section: "pre_chorus",
    caption: "Hail Eris — twist the gears, let the laughter break the chains",
    artDirection:
      "Eris herself in Afro-Samurai register: a tall, grinning woman in a torn red haori, braid as thick as a rope, golden apple in her left hand marked KALLISTI in calligraphic Greek. She is mid-laugh, head thrown back. A chain wrapped around a cathedral gear shatters into birds (23 birds exactly — count-able) at her feet. Her katana hangs from her belt, sheathed.",
    paletteAccent: "ink + bone-white base; one full-saturation Eris-red haori; one gold accent on the apple",
    motion: "the chain shatters on beat 2; birds fountain up over the full 12 seconds",
    principleHook: "hail_eris",
  },

  // ─── CHORUS 1 (0:59–1:35) ───────────────────────────────

  {
    n: 6,
    startSec: 59,
    endSec: 71,
    section: "chorus",
    caption: "We're all mad here, walking dreams through the static",
    artDirection:
      "A disintegrating crowd of silhouettes — samurai, suits, scientists, children, a priestess — walks forward in a line toward the camera. Each figure is dissolving into television static as they approach. On top of the crowd, at eye level with the camera, floats the Game Master as the Cheshire Cat — a grin WITHOUT a mouth, without a face, three inches above the crowd's heads, smiling approvingly.",
    paletteAccent: "monochrome ink on gray TV-static noise; the Cheshire grin is the only white-white in frame; one thin cyan chromatic-aberration edge",
    motion: "crowd advances one slow step per beat; grin widens very slightly at 71s",
    principleHook: "belief_as_instrument",
  },

  {
    n: 7,
    startSec: 71,
    endSec: 83,
    section: "chorus",
    caption: "Hallucinations shape the world, ain't it tragic",
    artDirection:
      "Surreal impossibility. A Penrose-staircase cityscape spirals upward — skyscrapers built from M.C. Escher blocks, a river of molten glass flowing uphill, a neon sign reading FNORD in a font that appears unreadable even when you look straight at it. A lone silhouette (us, the viewer) stands at the bottom looking up. The hallucination is reshaping the skyline AS we watch.",
    paletteAccent: "cold blue-gray + piss-yellow neon on the FNORD sign; one thin magenta spike in the sky",
    motion: "buildings slowly rearrange themselves over 12 seconds; the FNORD sign flickers on beats 3, 7, 11",
    principleHook: "rorschach_reality",
  },

  {
    n: 8,
    startSec: 83,
    endSec: 95,
    section: "chorus",
    caption: "Manifest the paradox — light the fuse, take your aim — Dischordian logic",
    artDirection:
      "A single archer (Afro-Samurai silhouette) draws a bow. The arrow she is drawing is a LIT FUSE — sparks trailing. The target downrange is the Sacred Chao symbol — a circle half-Apple-half-Pentagon, Hodge on top, Podge beneath. Her breath is visible in the cold air. The fuse-arrow and the Chao target are connected by a taut ghost-line of ink.",
    paletteAccent: "cold slate base; one red spark trail on the fuse; the Chao symbol has black apple and white pentagon",
    motion: "the bow draws tight over 10 seconds; release ON the word 'aim'",
    principleHook: "sacred_chao",
  },

  // ─── VERSE 2 (1:35–1:58) ────────────────────────────────

  {
    n: 9,
    startSec: 95,
    endSec: 107,
    section: "verse",
    caption: "The Game Master grins — hand full of lies — stacking decks in the dark",
    artDirection:
      "The Game Master at a card table inside a cathedral-sized dark room. His mouth is a full Cheshire grin — only mouth visible, suspended against black velvet — his hand is lit from below, fanning a hand of cards that are NOT Tarot and NOT playing cards: each card has a single Greek letter, and together they spell KALLISTI. One card (the Fool) is slightly askew, revealing a 23 on its back.",
    paletteAccent: "full black; one warm candle-glow on the cards; the grin is bone-white",
    motion: "the fan of cards rotates one inch over 12 seconds; the Fool card slides a hair further askew on the last beat",
    principleHook: "conspiracy_as_grid",
  },

  {
    n: 10,
    startSec: 107,
    endSec: 119,
    section: "verse",
    caption: "The Fool wears the crown — the Engineer's whisper rewrites the stars",
    artDirection:
      "Diptych. LEFT: the Fool from the Tarot, reimagined as a small child in a samurai yukata with a paper-bag crown and a knight-chess-piece for a staff. He winks straight at the camera. RIGHT: the Engineer, back to camera again, whispering to a constellation. The constellation is rearranging itself into the shape of the Fool's paper crown.",
    paletteAccent: "left panel in warm gold and red; right panel in deep night-indigo; the constellation is bone-white",
    motion: "the Fool winks on beat 2; the constellation reshapes over the full 12 seconds",
    principleHook: "belief_as_instrument",
  },

  // ─── PRE-CHORUS 2 (1:58–2:10) ───────────────────────────

  {
    n: 11,
    startSec: 119,
    endSec: 131,
    section: "pre_chorus",
    caption: "Hail Eris — break the frame — let the butterfly decide",
    artDirection:
      "Eris again, this time from behind. She is reaching UP with a katana, slicing the frame of the painting itself — the edge of the slide, visible as a thick gilded border, is being cut clean through. A single red butterfly flies out through the gash. Beyond the gash, a different painting begins — we glimpse a chessboard with one piece on it.",
    paletteAccent: "gold frame (bright); ink-black interior; red butterfly single saturation accent",
    motion: "the slice happens on the downbeat of 'break the frame'; the butterfly flies through over the next 6 seconds",
    principleHook: "hail_eris",
  },

  // ─── CHORUS 2 (2:10–2:22) ───────────────────────────────

  {
    n: 12,
    startSec: 131,
    endSec: 143,
    section: "chorus",
    caption: "We're all mad here — manifest the paradox — change the game",
    artDirection:
      "Repeat the Slide 6 crowd composition but INVERT it — now the silhouettes are walking AWAY from the camera, no longer dissolving but SOLIDIFYING with each step. The Cheshire grin is bigger now, occupying the top third of frame, and a second grin has joined it — identical, upside down, at the bottom. Between them, the crowd walks toward a small point of light on the horizon.",
    paletteAccent: "monochrome ink; the two grins are full-bone white; the horizon light is warm amber",
    motion: "crowd recedes at one step per beat; the two grins widen very slowly over the full 12 seconds",
    principleHook: "aneristic_illusion",
  },

  // ─── BRIDGE (2:22–2:34) ─────────────────────────────────

  {
    n: 13,
    startSec: 143,
    endSec: 155,
    section: "bridge",
    caption: "Reality's a riddle — Bavarian Illuminati shadows in the code",
    artDirection:
      "A wall of falling green code (Matrix-of-Dreams flavor) fills the frame. Within the code, a Bavarian Illuminati pyramid-and-eye symbol is formed by the character positions — visible only if you defocus slightly. Under the wall of code sits a small grinning Cheshire-cat shadow, knees pulled up, reading Principia Discordia on a chess table. The pyramid is partially transparent — we can see stars through it.",
    paletteAccent: "Matrix green + deep black; Principia book is golden-yellow; pyramid-eye is translucent white",
    motion: "code rains downward at a steady rate; the pyramid-eye shape fades in and out over 3 slow pulses",
    principleHook: "conspiracy_as_grid",
  },

  // ─── OUTRO (2:34–2:55) ──────────────────────────────────

  {
    n: 14,
    startSec: 155,
    endSec: 166,
    section: "outro",
    caption: "Spin the wheel — roll the bones — Dischordian logic, change the game",
    artDirection:
      "A roulette-wheel/chess-board hybrid, tilted forty-five degrees toward the camera. At its center, a single bone-die is mid-spin, throwing ink splatter outward. On the wheel's rim, printed in Japanese and English simultaneously, is the word CHANGE — once per quadrant. A hand (the player's) is reaching into frame to touch the die.",
    paletteAccent: "dark teal base; one gold rim on the wheel; one red-black die",
    motion: "the die spins visibly, slowing over 11 seconds, landing on a 23 on the final beat",
    principleHook: "games_shape_reality",
  },

  {
    n: 15,
    startSec: 166,
    endSec: 175,
    section: "outro",
    caption: "Carefully controlled chaos — rewrite the game",
    artDirection:
      "Final frame. The Engineer of Dreams finally turns to face the camera. His face is the Cheshire grin of the Game Master — same grin, same bone-white, but with the Engineer's red goggles and samurai top-knot. He holds one golden apple in his open palm. The apple says KALLISTI. On his forehead, a single fnord glyph, drawn in brushwork. The slide ends on a long-held static shot. The song ends on his grin widening imperceptibly.",
    paletteAccent: "full ink + bone-white; one red on the goggles; one gold on the apple; the fnord is a single deep-purple mark",
    motion: "he holds the pose for the full 9 seconds; on the final half-beat, his grin widens one millimeter",
    principleHook: "hail_eris",
  },
]);

/** Convenience: find the slide active at a given second. */
export function slideAt(seconds: number): SongSlide {
  for (const slide of DISCHORDIAN_LOGIC_SLIDES) {
    if (seconds >= slide.startSec && seconds < slide.endSec) return slide;
  }
  return DISCHORDIAN_LOGIC_SLIDES[DISCHORDIAN_LOGIC_SLIDES.length - 1];
}

/** Sanity helpers for the renderer / tests. */
export function totalSlides(): number {
  return DISCHORDIAN_LOGIC_SLIDES.length;
}
export function averageSlideDurationSec(): number {
  return SONG_DURATION_SECONDS / DISCHORDIAN_LOGIC_SLIDES.length;
}
