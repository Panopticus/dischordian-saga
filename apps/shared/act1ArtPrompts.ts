/* ═══════════════════════════════════════════════════════
   ACT 1 ART PROMPTS — canonical prompt catalog

   Nano Banana 2 prompts for the Act 1 asset delivery queue
   per docs/production/ACT_1_SHIP_READY_BIBLE.md §22.

   This module defines the canonical, canonical-id-keyed prompt
   set. apps/scripts/generate-act1-art-csv.ts consumes it to
   emit production-queue CSVs.

   Style anchor (Act 1 Bible §0.3): every prompt inherits the
   warm-gold / institutional-steel / film-grain biographical
   aesthetic. The shared anchor ships as ACT1_GLOBAL_STYLE_ANCHOR
   below so per-prompt entries can compose rather than re-quote.

   Categories:
     - opponent_portrait   (§2.2-2.13, 12 prompts)
     - battlefield         (§22.1, 10 prompts — future chunk)
     - card_art            (§22.3, 14 prompts — future chunk)

   This first chunk ships the 12 opponent portraits.
   ═══════════════════════════════════════════════════════ */

export type Act1ArtCategory =
  | "opponent_portrait"
  | "battlefield"
  | "card_art"
  | "slideshow_frame";

export type Priority = "P0" | "P1" | "P2";

export interface Act1ArtPrompt {
  /** Canonical asset id matching §22 manifest. */
  assetId: string;
  /** Human-readable display label. */
  name: string;
  /** Asset category. */
  category: Act1ArtCategory;
  /** Which Cycle / §X.Y this asset belongs to. */
  cycle: "A" | "B" | "C" | "finale" | "trial";
  /** Act 1 Bible section anchoring the canonical spec. */
  bibleSection: string;
  /** The Nano Banana 2 prompt text (without the global style anchor). */
  prompt: string;
  /** Target resolution, following §22 manifests. */
  resolution: string;
  /** Delivery priority. */
  priority: Priority;
  /** Optional dependencies (e.g., "global_style_anchor", "continuity_ref_B3"). */
  dependencies?: readonly string[];
}

/**
 * Act 1 Global Style Anchor — per §0.3. Producers must prepend
 * this to every prompt's `prompt` field before submission to
 * Nano Banana 2. The CSV generator composes it automatically.
 */
export const ACT1_GLOBAL_STYLE_ANCHOR =
  "Hyper-realistic cinematic composition with a strong biographical quality — every frame should feel like it's been pulled from a recovered personal archive. Palette: warmer and more nostalgic than the Prelude's cold cyan; dominant warm gold #fbbf24, institutional steel grey, deep wood panelling, faint film-grain sepia undertone. Subjects rendered with the specificity of photographic portraiture. Film grain. Anamorphic lens flares where warm light meets composition edges. 1920×1080 / 16:9 / 4K. No rendered text unless explicitly flagged.";

/* ─── CYCLE A opponent portraits (§§2.2–2.4) ─── */

const CYCLE_A_PORTRAITS: readonly Act1ArtPrompt[] = [
  {
    assetId: "portrait_minnie_meme",
    name: "Minnie the Meme",
    category: "opponent_portrait",
    cycle: "A",
    bibleSection: "§2.2",
    resolution: "1536x2048",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Seven-year-old girl in three-quarter profile, seated at a Celebration schoolyard card table, holding one card face-down in her right hand. She wears a black plastic headband with two round felt-covered Minnie Mouse ears — Disney-theme-park-souvenir style, worn earnestly not ironically. Warm gold Celebration afternoon lighting, ~2:00 PM sun-angle, faint parade-float bokeh in background. Expression: earnest, attentive, the specific attention of a child who is absolutely certain she is about to see something. She is a cosmic Archon in a child's body — her voice is ancient, viral, amused, but her face is a seven-year-old's face; production must render only the seven-year-old. Short dark-brown hair under the headband. Plain pastel sundress. Bare knees, small scuff on the left knee. The ears are the visual signifier of her Archon-of-the-Meme identity: a corporate-nostalgic artifact worn as crown jewelry.",
  },
  {
    assetId: "portrait_corey_collector",
    name: "Corey the Collector",
    category: "opponent_portrait",
    cycle: "A",
    bibleSection: "§2.3",
    resolution: "1536x2048",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Seven-year-old boy in three-quarter profile, seated at the same Celebration schoolyard card table, holding an amber glass jar in both hands at chest height. The jar contains approximately a dozen small translucent coins with faint, out-of-focus imagery visible on their faces. His expression is grateful — he is thanking the person across the table for playing. Warm 4:30 PM gold lighting (later, lower angle than the Minnie portrait), longer shadows, Day 20 Celebration parade banners in background (different palette than Day 10). Short brown hair, round face, small hands carefully cradling the jar. Plain earth-tone sweater. The jar catches the warm light deliberately — the amber-coin glow is the portrait's visual hinge. He is an Archon of the Collector; render as the seven-year-old only.",
  },
  {
    assetId: "portrait_kanshi_sha_watcher",
    name: "Kanshi Sha the Watcher",
    category: "opponent_portrait",
    cycle: "A",
    bibleSection: "§2.4",
    resolution: "1536x2048",
    priority: "P0",
    dependencies: ["global_style_anchor"],
    prompt:
      "Seven-year-old girl in three-quarter profile, seated on the graduation-pavilion stage at Celebration, wearing a half-finished white Ocularum mask. The mask covers the upper-left quadrant of her face — forehead and left eye — in smooth matte bone-white with no visible seams; the right half of her face (right cheek, right eye, mouth, chin) is the child's own, visible and unmasked. Expression: calm, attentive, non-blinking in the way the cosmic Watcher canonically does not blink. Long straight dark-brown hair, neatly combed. Formal pale-grey graduation robe over a white shift. Low-angle evening 6:30 PM sun through the pavilion pillars, warm-gold rim-lit, parents and Mascoteers visible as soft-focus silhouettes at the frame edges (Day 28 is the only Cycle A battle with witnesses). The mask catches the warm light as a single flat white surface against the warm-gold environment.",
  },
];

/** Full Act 1 art prompt catalog (built up over subsequent chunks). */
export const ACT1_ART_PROMPTS: readonly Act1ArtPrompt[] = [
  ...CYCLE_A_PORTRAITS,
];

/** Look up a single prompt by asset id. */
export function getAct1ArtPrompt(assetId: string): Act1ArtPrompt | undefined {
  return ACT1_ART_PROMPTS.find((p) => p.assetId === assetId);
}

/** Return every prompt in a category. */
export function getAct1ArtPromptsByCategory(
  category: Act1ArtCategory,
): readonly Act1ArtPrompt[] {
  return ACT1_ART_PROMPTS.filter((p) => p.category === category);
}
