/**
 * Declared-but-unbuilt subsystem parity check.
 *
 * Three large designs are documented in `docs/design/` or `docs/production/`
 * but have effectively zero runtime in `apps/`:
 *
 *   - Soul Stones / Divine Light (docs/design/SOUL_STONES_SYSTEM.md) —
 *     dual-path corruption/purification economy with Demon-Pet summoning
 *     and Divine-Light investments. Casino-game files mention a derived
 *     "soulStones" reward token, but the dual-path system is absent.
 *   - Pet/Specimen Breeding (docs/archive/2026-05-08-superseded/BREEDING_SYSTEM_ART_PROMPTS.md)
 *     — pet pairing, lineage, and offspring generation. No DB table, no
 *     router, no engine surface.
 *   - Living Character Sheet (docs/production/LIVING_CHARACTER_SHEET_ART_BRIEF.md)
 *     — animated character sheet that updates with player choices and
 *     morality state. No component or store.
 *
 * For each, this check declares the runtime artifacts that must exist
 * to consider the design shipped. Each artifact is a strict, machine-
 * verifiable presence test — not a vibe check.
 *
 * Hard parity. The whole point is that "doc shipped, code didn't" is a
 * tracked state.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT, walkSourceFiles } from "../scanner";
import type { RawParityCount } from "../types";

interface DeclaredArtifact {
  /** Subsystem name, prefix on the missing line. */
  subsystem: "soul_stones" | "pet_breeding" | "living_character_sheet";
  /** Artifact id, surfaced in missing notes. */
  id: string;
  /** Human description of what should exist. */
  description: string;
  /** Predicate. */
  present: () => boolean;
}

const SCHEMA_PATH = path.join(REPO_ROOT, "apps/db/schema.ts");
const SERVER_DIR = path.join(REPO_ROOT, "apps/server");
const CLIENT_DIR = path.join(REPO_ROOT, "apps/client/src");
const SHARED_DIR = path.join(REPO_ROOT, "apps/shared");

function schemaSrc(): string {
  return fs.existsSync(SCHEMA_PATH) ? fs.readFileSync(SCHEMA_PATH, "utf-8") : "";
}

function anyMatch(dir: string, re: RegExp): boolean {
  return walkSourceFiles(dir).some((f) =>
    re.test(fs.readFileSync(f, "utf-8")),
  );
}

const ARTIFACTS: ReadonlyArray<DeclaredArtifact> = [
  // ─── Soul Stones (docs/design/SOUL_STONES_SYSTEM.md) ──────────
  {
    subsystem: "soul_stones",
    id: "schema:soul_stones_table",
    description:
      "schema table or column tracking per-player Soul Stone counts by state (red / violet / gold) — see SOUL_STONES_SYSTEM.md §1.1",
    present: () =>
      /\bsoulStones\b\s*=\s*mysqlTable|\bsoulStones\s*:\s*mysqlTable|\bsoul_stones\s*=\s*mysqlTable|redSoulStones|violetSoulStones|goldSoulStones/.test(
        schemaSrc(),
      ),
  },
  {
    subsystem: "soul_stones",
    id: "shared:purification_module",
    description:
      "shared module implementing the purify / corrupt choice (apps/shared/soulStones.ts or similar with `purifySoulStone` / `corruptSoulStone`)",
    present: () =>
      anyMatch(
        SHARED_DIR,
        /\bpurifySoulStone\b|\bcorruptSoulStone\b|\bpurify_stone\b|\bcorrupt_stone\b/,
      ),
  },
  {
    subsystem: "soul_stones",
    id: "server:soul_stones_router",
    description:
      "tRPC router exposing soulStones procedures (collect / purify / corrupt / summon)",
    present: () =>
      anyMatch(
        SERVER_DIR,
        /\bsoulStones\s*[:=]\s*router|\bsoulStonesRouter\b|\.soulStones\.collect|\.soulStones\.purify/,
      ),
  },
  {
    subsystem: "soul_stones",
    id: "client:soul_stones_ui",
    description:
      "client component rendering the corrupt/purify choice (SoulStoneChoice / PurifyStoneDialog / SoulStonesPanel)",
    present: () =>
      anyMatch(
        CLIENT_DIR,
        /\bSoulStoneChoice\b|\bSoulStonesPanel\b|\bPurifyStoneDialog\b|\bCorruptStoneDialog\b/,
      ),
  },
  {
    subsystem: "soul_stones",
    id: "design:demon_pet_summoning",
    description:
      "Demon-Pet summoning surface tied to red Soul Stones (per §1.3 Path A)",
    present: () =>
      anyMatch(
        SHARED_DIR,
        /\bsummonDemonPet\b|\bdemon_pet_summon\b|\bdemonPetSummoning\b/,
      ),
  },

  // ─── Pet/Specimen Breeding (docs/archive/2026-05-08-superseded/BREEDING_SYSTEM_ART_PROMPTS.md) ──
  {
    subsystem: "pet_breeding",
    id: "schema:breeding_pairs",
    description:
      "schema table tracking breeding pairs and offspring (petBreeding / breedingPair / specimenBreeding)",
    present: () =>
      /\bpetBreedingPairs\s*=\s*mysqlTable|\bpetBreeding\s*=\s*mysqlTable|\bbreedingPair\s*=\s*mysqlTable|\bspecimenBreeding\s*=\s*mysqlTable/.test(
        schemaSrc(),
      ),
  },
  {
    subsystem: "pet_breeding",
    id: "shared:breeding_logic",
    description:
      "shared module computing offspring stats from a pair (apps/shared/petBreeding.ts with `breedPets` or similar)",
    present: () =>
      anyMatch(SHARED_DIR, /\bbreedPets\b|\bcomputeOffspring\b|\bpetBreeding\b/),
  },
  {
    subsystem: "pet_breeding",
    id: "server:breeding_router",
    description:
      "tRPC router exposing breeding procedures (start / complete / cancel)",
    present: () =>
      anyMatch(
        SERVER_DIR,
        /\bpetBreedingRouter\b|\bbreedingRouter\b|\bpetBreeding\s*[:=]\s*router|\.petBreeding\.start/,
      ),
  },
  {
    subsystem: "pet_breeding",
    id: "client:breeding_ui",
    description:
      "client component rendering the breeding pair selector (BreedingPanel / PetBreedingDialog)",
    present: () =>
      anyMatch(
        CLIENT_DIR,
        /\bBreedingPanel\b|\bPetBreedingDialog\b|\bBreedingPairPicker\b/,
      ),
  },

  // ─── Living Character Sheet (docs/production/LIVING_CHARACTER_SHEET_ART_BRIEF.md) ──
  {
    subsystem: "living_character_sheet",
    id: "shared:living_sheet_module",
    description:
      "shared module computing the live character-sheet view (apps/shared/livingCharacterSheet.ts)",
    present: () =>
      anyMatch(SHARED_DIR, /\blivingCharacterSheet\b|\bLivingCharacterSheet\b/),
  },
  {
    subsystem: "living_character_sheet",
    id: "client:living_sheet_component",
    description:
      "client component rendering the animated sheet (LivingCharacterSheet / LivingCharSheet)",
    present: () =>
      anyMatch(
        CLIENT_DIR,
        /\bLivingCharacterSheet\b|\bLivingCharSheet\b/,
      ),
  },
];

export function checkDeclaredSubsystemRuntime(): RawParityCount {
  const missing: string[] = [];
  for (const a of ARTIFACTS) {
    if (!a.present()) {
      missing.push(`${a.subsystem}/${a.id}: ${a.description}`);
    }
  }
  return {
    declared: ARTIFACTS.length,
    implemented: ARTIFACTS.length - missing.length,
    missing,
  };
}
