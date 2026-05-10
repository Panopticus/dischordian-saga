/**
 * ═══════════════════════════════════════════════════════
 * ANIMATED CUTSCENE REGISTRY
 *
 * Single source of truth for the five named cutscenes from
 * `docs/design/ANIMATED_CUTSCENES.md`. The Seedance v2 prompt
 * specs (shot count, runtime, motion notes) live in
 * `docs/production/CUTSCENE_SEEDANCE_PROMPTS.md` — keep
 * `shotCount` / `durationSec` here in lock-step with that doc.
 *
 * Asset layout (mirrored to S3 by upload-public-to-s3.ts):
 *   apps/client/public/videos/cutscenes/<id>/shot1.mp4
 *   apps/client/public/videos/cutscenes/<id>/shot1.webm
 *   apps/client/public/videos/cutscenes/<id>/poster.webp
 *
 * Until the producer team delivers the MP4s, components fall
 * back gracefully to the reduced-motion poster path. See each
 * scaffold under `apps/client/src/components/cutscenes/`.
 * ═══════════════════════════════════════════════════════
 */

export type CutsceneId =
  | "cutscene_awakening"
  | "cutscene_first_human_contact"
  | "cutscene_elara_memory_recovery"
  | "cutscene_breaking_point"
  | "cutscene_thought_virus_manifests"
  | "cutscene_prestige_reset";

export interface CutsceneDefinition {
  /** Stable string-literal id; matches the literal-id column in
   *  `apps/shared/_completeness/checks/cutsceneComponents.ts`. */
  id: CutsceneId;
  /** Human-readable title from ANIMATED_CUTSCENES.md. */
  title: string;
  /** Narrative flag that, when set true, fires this cutscene. */
  triggerFlag: string;
  /** Flags the cutscene is responsible for setting after `onComplete`.
   *  The parent (CutsceneRouter) writes these via `setNarrativeFlag()`. */
  setsFlags: ReadonlyArray<string>;
  /** Number of Seedance shots — must match CUTSCENE_SEEDANCE_PROMPTS.md. */
  shotCount: number;
  /** Total runtime in seconds — must match CUTSCENE_SEEDANCE_PROMPTS.md. */
  durationSec: number;
  /** Public path prefix; resolved through `assetUrl()` at runtime. */
  videoBasePath: string;
  /** React component name (for debug overlays + test fixtures). */
  componentName: string;
  /** Reduced-motion still (resolved through `assetUrl()`). */
  posterPath: string;
}

export const CUTSCENE_REGISTRY: Readonly<
  Record<CutsceneId, CutsceneDefinition>
> = {
  cutscene_awakening: {
    id: "cutscene_awakening",
    title: "Cutscene 1: Awakening",
    triggerFlag: "cutscene_awakening_triggered",
    setsFlags: ["cutscene_awakening_seen", "prelude_beat_0_complete"],
    shotCount: 3,
    durationSec: 45,
    videoBasePath: "/videos/cutscenes/awakening/",
    componentName: "AwakeningCutscene",
    posterPath: "/videos/cutscenes/awakening/poster.webp",
  },
  cutscene_first_human_contact: {
    id: "cutscene_first_human_contact",
    title: "Cutscene 2: First Human Contact",
    triggerFlag: "cutscene_first_human_contact_triggered",
    setsFlags: [
      "cutscene_first_human_contact_seen",
      "human_narrator_introduced",
    ],
    shotCount: 2,
    durationSec: 30,
    videoBasePath: "/videos/cutscenes/first_human_contact/",
    componentName: "FirstHumanContactCutscene",
    posterPath: "/videos/cutscenes/first_human_contact/poster.webp",
  },
  cutscene_elara_memory_recovery: {
    id: "cutscene_elara_memory_recovery",
    title: "Cutscene 3: Elara's Memory Recovery",
    triggerFlag: "cutscene_elara_memory_recovery_triggered",
    setsFlags: [
      "cutscene_elara_memory_recovery_seen",
      "elara_memory_recovered",
    ],
    shotCount: 4,
    durationSec: 60,
    videoBasePath: "/videos/cutscenes/elara_memory_recovery/",
    componentName: "ElaraMemoryRecoveryCutscene",
    posterPath: "/videos/cutscenes/elara_memory_recovery/poster.webp",
  },
  cutscene_breaking_point: {
    id: "cutscene_breaking_point",
    title: "Cutscene 4: The Breaking Point",
    triggerFlag: "cutscene_breaking_point_triggered",
    setsFlags: [
      "cutscene_breaking_point_seen",
      "act2_to_act3_transition_complete",
    ],
    shotCount: 5,
    durationSec: 45,
    videoBasePath: "/videos/cutscenes/breaking_point/",
    componentName: "BreakingPointCutscene",
    posterPath: "/videos/cutscenes/breaking_point/poster.webp",
  },
  cutscene_thought_virus_manifests: {
    id: "cutscene_thought_virus_manifests",
    title: "Cutscene 5: The Thought Virus Manifests",
    triggerFlag: "cutscene_thought_virus_manifests_triggered",
    setsFlags: [
      "cutscene_thought_virus_manifests_seen",
      "thought_virus_first_infection",
    ],
    shotCount: 2,
    durationSec: 30,
    videoBasePath: "/videos/cutscenes/thought_virus_manifests/",
    componentName: "ThoughtVirusManifestCutscene",
    posterPath: "/videos/cutscenes/thought_virus_manifests/poster.webp",
  },
  cutscene_prestige_reset: {
    id: "cutscene_prestige_reset",
    title: "Cutscene 6: The Reset",
    // Bible §6 (NANO_BANANA_VEO_FULL_PROMPT_BOOK.md line 1107) — 4
    // sequential POV shots (player → Elara → Human → Antiquarian)
    // + final freeze, ~50s total, no music. Fires when the player
    // confirms the prestige cycle ceremony.
    triggerFlag: "cutscene_prestige_reset_triggered",
    setsFlags: ["cutscene_prestige_reset_seen", "prestige_cinematic_played"],
    shotCount: 4,
    durationSec: 50,
    videoBasePath: "/videos/prestige/",
    componentName: "PrestigeResetCutscene",
    // The freeze frame from the final shot serves as the
    // reduced-motion poster; producer ships it as
    // the_reset_complete.mp4 but a frame extract works as a poster
    // until the .webp lands. Player gracefully degrades anyway.
    posterPath: "/videos/prestige/the_reset_complete.mp4",
  },
} as const;

export const CUTSCENE_IDS: ReadonlyArray<CutsceneId> = Object.keys(
  CUTSCENE_REGISTRY,
) as ReadonlyArray<CutsceneId>;

export function getCutscene(id: CutsceneId): CutsceneDefinition {
  return CUTSCENE_REGISTRY[id];
}
