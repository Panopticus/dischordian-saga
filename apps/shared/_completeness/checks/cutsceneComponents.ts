/**
 * Animated Cutscene component parity check.
 *
 * `docs/design/ANIMATED_CUTSCENES.md` enumerates five named cutscenes
 * (Awakening, First Human Contact, Elara's Memory Recovery, The Breaking
 * Point, The Thought Virus Manifests). The shipped runtime has a generic
 * `CutsceneOverlay` and a `GuildCutscenePlayer`, but no per-cutscene
 * component or registry entry that would let the engine fire the named
 * scene at the right narrative beat.
 *
 * Each cutscene needs evidence in `apps/client/src/`: either
 *   (a) a component file matching one of the candidate name patterns, or
 *   (b) a string-literal id reference in a cutscene registry / dispatcher.
 *
 * Hard parity. Cutscenes ship in lock-step with their narrative beats —
 * a cutscene declared in the doc but not wired to a beat is a missing
 * scene every player misses.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT, walkSourceFiles } from "../scanner";
import type { RawParityCount } from "../types";

interface DeclaredCutscene {
  /** Stable id used in ANIMATED_CUTSCENES.md and any registry. */
  id: string;
  /** The numbered title from the doc. */
  title: string;
  /** Component-name patterns we accept as evidence. Order doesn't matter; any match counts. */
  componentNames: ReadonlyArray<string>;
  /** String-literal ids we accept (e.g. registry key / flag value). */
  literalIds: ReadonlyArray<string>;
  /** What the doc says fires this cutscene; surfaced in missing notes. */
  beat: string;
}

const CLIENT_DIR = path.join(REPO_ROOT, "apps/client/src");

const DECLARED_CUTSCENES: ReadonlyArray<DeclaredCutscene> = [
  {
    id: "awakening",
    title: "Cutscene 1: Awakening",
    componentNames: ["AwakeningCutscene", "CutsceneAwakening"],
    literalIds: ["cutscene_awakening", "awakening_cutscene"],
    beat:
      "fires when the player first emerges from the cryo bay (Prelude beat 0)",
  },
  {
    id: "first_human_contact",
    title: "Cutscene 2: First Human Contact",
    componentNames: ["FirstHumanContactCutscene", "CutsceneFirstHumanContact"],
    literalIds: ["cutscene_first_human_contact", "first_human_contact_cutscene"],
    beat:
      "fires when the Human narrator first joins the Yin/Yang dialog (NARRATIVE_ARCHITECTURE.md §1.4 beat 3)",
  },
  {
    id: "elara_memory_recovery",
    title: "Cutscene 3: Elara's Memory Recovery",
    componentNames: ["ElaraMemoryRecoveryCutscene", "ElaraMemoryCutscene"],
    literalIds: ["cutscene_elara_memory_recovery", "elara_memory_recovery"],
    beat:
      "fires on the first Elara trust-100 milestone after Memorial Corridor unlock",
  },
  {
    id: "breaking_point",
    title: "Cutscene 4: The Breaking Point",
    componentNames: ["BreakingPointCutscene", "CutsceneBreakingPoint"],
    literalIds: ["cutscene_breaking_point", "breaking_point_cutscene"],
    beat:
      "fires at the Act 2 → Act 3 transition (highest-tension morality choice)",
  },
  {
    id: "thought_virus_manifests",
    title: "Cutscene 5: The Thought Virus Manifests",
    componentNames: ["ThoughtVirusManifestCutscene", "ThoughtVirusCutscene"],
    literalIds: [
      "cutscene_thought_virus_manifests",
      "thought_virus_manifests",
    ],
    beat:
      "fires the first time the Thought Virus infects an NPC (Act 4+ trigger)",
  },
];

export function checkCutsceneComponents(): RawParityCount {
  const clientFiles = walkSourceFiles(CLIENT_DIR);
  const allClientSrc = clientFiles
    .map((f) => fs.readFileSync(f, "utf-8"))
    .join("\n");

  const missing: string[] = [];
  for (const cs of DECLARED_CUTSCENES) {
    const found =
      cs.componentNames.some((name) =>
        new RegExp(String.raw`\b` + name + String.raw`\b`).test(allClientSrc),
      ) ||
      cs.literalIds.some((lit) =>
        new RegExp(
          String.raw`["']` + lit.replace(/_/g, "_") + String.raw`["']`,
        ).test(allClientSrc),
      );

    if (!found) {
      missing.push(
        `${cs.title}: no component matching {${cs.componentNames.join(", ")}} ` +
          `nor literal id matching {${cs.literalIds.join(", ")}} — ` +
          `${cs.beat}`,
      );
    }
  }

  return {
    declared: DECLARED_CUTSCENES.length,
    implemented: DECLARED_CUTSCENES.length - missing.length,
    missing,
  };
}
