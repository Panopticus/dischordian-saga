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
  | "cutscene_prestige_reset"
  // Human-reveal variant cutscenes — the producer 2026-05-10 drop
  // ships 4 single-shot MP4s gated by player path. They fire
  // LATER than `cutscene_first_human_contact` (Act 6+ when the
  // path has settled), one at a time based on which gating flag
  // is set. The Act-6+ trigger (which one) lives in
  // useHumanRevealTrigger; the variant resolver lives in
  // apps/shared/humanRevealVariants.ts.
  | "cutscene_human_reveal_convergence"
  | "cutscene_human_reveal_fragment"
  | "cutscene_human_reveal_full"
  | "cutscene_human_reveal_ghost";

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
  /** Public path prefix; resolved through `assetUrl()` at runtime.
   *  Default URL convention: `${videoBasePath}shot${index}.mp4`
   *  for index 1..shotCount. */
  videoBasePath: string;
  /** Optional override for non-default shot filenames. When set,
   *  the player uses `${videoBasePath}${shotFilenames[index-1]}`
   *  instead of the `shot<N>.mp4` convention. Length must match
   *  shotCount. Used when producer files don't conform to the
   *  numbered-shot pattern (e.g. human-reveal variants ship as
   *  `human_reveal_to_<branch>.mp4`; awakening producer files
   *  ship as content-named slugs that need an explicit ordering
   *  decision before renaming). */
  shotFilenames?: ReadonlyArray<string>;
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
    // Producer 2026-05-10 drop revised the awakening from the
    // original pod-opening sequence (ANIMATED_CUTSCENES.md §1)
    // to a thematic cold-open. Lore-confirmed ordering
    // (NARRATIVE_ARCHITECTURE.md identity chain + LORE_BIBLE.md
    // verbatim "I've watched 93,847 sunrises" line):
    //   shot 1: origin (Vox neural-nanobot consciousness transfer)
    //   shot 2: mission (Ark Council mandate handed to player)
    //   shot 3: aftermath (Elara's 256-year solitude reveal)
    shotFilenames: [
      "first_clone_born.mp4",
      "the_mandate.mp4",
      "93847_sunrises.mp4",
    ],
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
  cutscene_human_reveal_convergence: {
    id: "cutscene_human_reveal_convergence",
    title: "Cutscene 7: Human Reveal — Convergence",
    triggerFlag: "cutscene_human_reveal_convergence_triggered",
    setsFlags: [
      "cutscene_human_reveal_convergence_seen",
      "human_reveal_branch_resolved",
    ],
    shotCount: 1,
    durationSec: 18,
    videoBasePath: "/videos/human_reveal/",
    shotFilenames: ["human_reveal_to_convergence.mp4"],
    componentName: "HumanRevealConvergenceCutscene",
    posterPath: "/videos/human_reveal/human_reveal_to_convergence.mp4",
  },
  cutscene_human_reveal_fragment: {
    id: "cutscene_human_reveal_fragment",
    title: "Cutscene 8: Human Reveal — Fragment",
    triggerFlag: "cutscene_human_reveal_fragment_triggered",
    setsFlags: [
      "cutscene_human_reveal_fragment_seen",
      "human_reveal_branch_resolved",
    ],
    shotCount: 1,
    durationSec: 18,
    videoBasePath: "/videos/human_reveal/",
    shotFilenames: ["human_reveal_to_fragment.mp4"],
    componentName: "HumanRevealFragmentCutscene",
    posterPath: "/videos/human_reveal/human_reveal_to_fragment.mp4",
  },
  cutscene_human_reveal_full: {
    id: "cutscene_human_reveal_full",
    title: "Cutscene 9: Human Reveal — Full",
    triggerFlag: "cutscene_human_reveal_full_triggered",
    setsFlags: [
      "cutscene_human_reveal_full_seen",
      "human_reveal_branch_resolved",
    ],
    shotCount: 1,
    durationSec: 18,
    videoBasePath: "/videos/human_reveal/",
    shotFilenames: ["human_reveal_to_full.mp4"],
    componentName: "HumanRevealFullCutscene",
    posterPath: "/videos/human_reveal/human_reveal_to_full.mp4",
  },
  cutscene_human_reveal_ghost: {
    id: "cutscene_human_reveal_ghost",
    title: "Cutscene 10: Human Reveal — Ghost",
    triggerFlag: "cutscene_human_reveal_ghost_triggered",
    setsFlags: [
      "cutscene_human_reveal_ghost_seen",
      "human_reveal_branch_resolved",
    ],
    shotCount: 1,
    durationSec: 18,
    videoBasePath: "/videos/human_reveal/",
    shotFilenames: ["human_reveal_to_ghost.mp4"],
    componentName: "HumanRevealGhostCutscene",
    posterPath: "/videos/human_reveal/human_reveal_to_ghost.mp4",
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
