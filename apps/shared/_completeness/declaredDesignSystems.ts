/**
 * Declared design-system registry.
 *
 * Past audits (docs/design/INCOMPLETE_DESIGNS_AUDIT_2026-05-08.md,
 * docs/narrative-audit/DOC2..DOC5) keep finding the same failure
 * mode: a system is documented and partially built, but no path
 * through the running app reaches it — schema columns with no
 * consumers, tRPC procedures with no client call sites, NPCs with
 * no dialog trigger, design docs with zero runtime hits.
 *
 * The existing ship:check rows catch *internal* parity (union variant
 * has a switch case, schema column has a type). They mostly do not
 * catch the full reachability chain:
 *
 *   Declaration → Server runtime → Client API binding → UI component
 *                                                      → Discovery surface
 *
 * The reason past audits stayed manual: design docs are not grep-able
 * by name. There is no symbol called "Soul Stones" or "Trade Empire
 * Coda Loop" in the source. The fix is this registry: each design
 * documents itself with the runtime symbols it expects to produce.
 * The {@link checkDeclaredSubsystemRuntime} check then verifies each
 * expected symbol exists somewhere under `apps/`.
 *
 * **Owner workflow.** When a design doc lands in `docs/design/` or
 * `docs/production/`, also add an entry here naming the runtime
 * symbols the design promises. The ratchet records the current
 * implementation gap; it can only shrink. Transitioning a system
 * from `status: "tracked"` to `status: "shipped"` is gated on every
 * expected symbol being present — i.e. the design is unambiguously
 * runtime-reachable, not just documented.
 *
 * **Anti-duplication.** Several designs already have dedicated
 * parity checks elsewhere in the registry — e.g. Global Light/Dark
 * meter has `narrative.global_alignment_meter`, Governance Hub has
 * `server.governance_router_present`, the five named cutscenes have
 * `narrative.cutscene_components`. Those checks stay where they are
 * and are NOT duplicated here. This file is for the designs that
 * have NO dedicated check (where "is there any runtime at all?" is
 * itself the question).
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT, walkSourceFiles } from "./scanner";

/**
 * One row in the declared-design registry.
 */
export interface DeclaredDesignSystem {
  /** Stable id used in `missing` lines as the per-symbol prefix. */
  id: string;
  /** Repo-relative path to the design document (or the primary one
   *  if the design spans several). Surfaced in missing notes. */
  docPath: string;
  /** Runtime artifacts the design promises. */
  expectedRuntimeSymbols: ReadonlyArray<ExpectedSymbol>;
  /** "tracked" = design is logged, runtime may be partial.
   *  "shipped" = every expected symbol must be present (the
   *  check fails on any missing symbol). Transitioning from
   *  tracked → shipped is the manual ratcheting step. */
  status: "tracked" | "shipped";
  /** Short note surfaced in `--explain` output. */
  note?: string;
}

/**
 * One promised runtime artifact. The kind picks the scan strategy
 * (a regex over the right source set); the needle is the literal
 * the scan looks for.
 */
export interface ExpectedSymbol {
  kind:
    /** A `<name>` mysqlTable declaration in apps/db/schema.ts. */
    | "schema_table"
    /** A column literal `<name>:` inside apps/db/schema.ts. */
    | "schema_column"
    /** A bare identifier (function / const / type / class) somewhere
     *  under apps/shared/ — the catch-all for "the engine knows about
     *  this." */
    | "shared_export"
    /** A `<router>.<procedure>` server-side definition. The needle is
     *  the procedure id; the kind verifies it's exposed somewhere
     *  under apps/server/. Use {@link trpc_router_mount} when the
     *  procedure name is too generic (`start`, `list`, `complete`)
     *  to grep cleanly. */
    | "trpc_procedure"
    /** A `<name>Router` import + mount in apps/server/routers.ts.
     *  Use when the router is the meaningful unit (the procedures are
     *  generic by name). The needle is the bare router name with no
     *  `Router` suffix — e.g. `"petBreeding"`. */
    | "trpc_router_mount"
    /** A React component name (function / class) under apps/client/src.
     *  The needle is the component identifier. */
    | "client_component"
    /** A wouter `<Route path="<needle>">` mount in apps/client/src/App.tsx. */
    | "route_path"
    /** A literal CutsceneId reference (string literal) anywhere in
     *  apps/client/src or apps/shared outside cutsceneRegistry.ts. */
    | "cutscene_id";
  /** The literal to search for (component name, route path,
   *  procedure id, table name, etc.). */
  needle: string;
  /** What this artifact is, surfaced in the missing line so the
   *  diagnostic points at what to build. */
  description: string;
}

const SCHEMA_PATH = path.join(REPO_ROOT, "apps/db/schema.ts");
const SERVER_DIR = path.join(REPO_ROOT, "apps/server");
const CLIENT_DIR = path.join(REPO_ROOT, "apps/client/src");
const SHARED_DIR = path.join(REPO_ROOT, "apps/shared");
const APP_TSX = path.join(REPO_ROOT, "apps/client/src/App.tsx");
const CUTSCENE_REGISTRY_PATH = path.join(
  REPO_ROOT,
  "apps/shared/cutsceneRegistry.ts",
);

function readIfExists(absPath: string): string {
  return fs.existsSync(absPath) ? fs.readFileSync(absPath, "utf-8") : "";
}

function anyMatch(dir: string, re: RegExp): boolean {
  return walkSourceFiles(dir).some((f) =>
    re.test(fs.readFileSync(f, "utf-8")),
  );
}

/**
 * Files inside the gate's own machinery — registry, checks, tests —
 * cannot count as evidence that a symbol exists. Otherwise this very
 * file would satisfy every `shared_export` symbol it declares.
 */
function isGateOwnedFile(absPath: string): boolean {
  return absPath.includes(
    path.sep + "_completeness" + path.sep,
  );
}

function anyMatchExcludingGate(dir: string, re: RegExp): boolean {
  return walkSourceFiles(dir).some((f) => {
    if (isGateOwnedFile(f)) return false;
    return re.test(fs.readFileSync(f, "utf-8"));
  });
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Resolve one ExpectedSymbol to present/absent. Side-effect free.
 */
export function symbolIsPresent(sym: ExpectedSymbol): boolean {
  switch (sym.kind) {
    case "schema_table": {
      const src = readIfExists(SCHEMA_PATH);
      const re = new RegExp(
        String.raw`\b` +
          escapeRegex(sym.needle) +
          String.raw`\s*=\s*mysqlTable\s*\(`,
      );
      return re.test(src);
    }
    case "schema_column": {
      const src = readIfExists(SCHEMA_PATH);
      // Column literal: `<name>: <type>(...)` (drizzle pattern).
      const re = new RegExp(
        String.raw`\b` +
          escapeRegex(sym.needle) +
          String.raw`\s*:\s*[a-zA-Z]+\s*\(`,
      );
      return re.test(src);
    }
    case "shared_export": {
      // Bare identifier match anywhere under apps/shared (any usage
      // counts — definition, import, or call). Gate-owned files are
      // excluded so the registry can't satisfy its own claims.
      const re = new RegExp(String.raw`\b` + escapeRegex(sym.needle) + String.raw`\b`);
      return anyMatchExcludingGate(SHARED_DIR, re);
    }
    case "trpc_procedure": {
      // Server-side procedure definition: `<name>: publicProcedure` or
      // `<name>: protectedProcedure` etc.
      const re = new RegExp(
        String.raw`\b` +
          escapeRegex(sym.needle) +
          String.raw`\s*:\s*(?:public|protected|admin|moderator|authed)?Procedure\b`,
      );
      return anyMatchExcludingGate(SERVER_DIR, re);
    }
    case "trpc_router_mount": {
      // Router is mounted in the root composer (routers.ts). Check
      // both the import declaration AND the mount entry — either alone
      // could be stale.
      const rootRouterPath = path.join(REPO_ROOT, "apps/server/routers.ts");
      const src = readIfExists(rootRouterPath);
      const importRe = new RegExp(
        String.raw`\bimport\s*\{[^}]*\b` +
          escapeRegex(sym.needle) +
          String.raw`Router\b[^}]*\}`,
      );
      const mountRe = new RegExp(
        String.raw`\b` +
          escapeRegex(sym.needle) +
          String.raw`\s*:\s*` +
          escapeRegex(sym.needle) +
          String.raw`Router\b`,
      );
      return importRe.test(src) && mountRe.test(src);
    }
    case "client_component": {
      // React component identifier anywhere under client src.
      // _completeness/ lives under apps/shared, not apps/client/src,
      // so a normal walk is fine; we still use the gate-excluding
      // variant for safety against future relocation.
      const re = new RegExp(String.raw`\b` + escapeRegex(sym.needle) + String.raw`\b`);
      return anyMatchExcludingGate(CLIENT_DIR, re);
    }
    case "route_path": {
      // Wouter route mount in App.tsx.
      const src = readIfExists(APP_TSX);
      const re = new RegExp(
        String.raw`Route\s+path\s*=\s*["']` +
          escapeRegex(sym.needle) +
          String.raw`["']`,
      );
      return re.test(src);
    }
    case "cutscene_id": {
      // String-literal reference outside the registry file itself.
      const re = new RegExp(String.raw`["']` + escapeRegex(sym.needle) + String.raw`["']`);
      const candidates = [
        ...walkSourceFiles(CLIENT_DIR),
        ...walkSourceFiles(SHARED_DIR),
      ];
      for (const abs of candidates) {
        if (abs === CUTSCENE_REGISTRY_PATH) continue;
        if (isGateOwnedFile(abs)) continue;
        if (re.test(fs.readFileSync(abs, "utf-8"))) return true;
      }
      return false;
    }
  }
}

/**
 * The registry. Entries are intentionally seeded with the audit's
 * canonical "designed but not reachable" examples — anything beyond
 * those should land alongside the design doc that introduces it.
 *
 * The three legacy entries (`soul_stones`, `pet_breeding`,
 * `living_character_sheet`) migrated from the prior
 * `declaredSubsystemRuntime.ts` ARTIFACTS list so the existing
 * `design.declared_subsystem_runtime` ratchet state remains valid.
 */
export const DECLARED_DESIGN_SYSTEMS: ReadonlyArray<DeclaredDesignSystem> = [
  // ─── Soul Stones / Divine Light ────────────────────────────
  // docs/design/SOUL_STONES_SYSTEM.md — dual-path corruption/
  // purification with Demon-Pet summoning and Divine-Light
  // investments. Casino-game files mention a derived "soulStones"
  // reward token; the dual-path system itself is absent.
  {
    id: "soul_stones",
    docPath: "docs/design/SOUL_STONES_SYSTEM.md",
    status: "tracked",
    note: "Dual-path corruption/purification economy (red/violet/gold) — design only.",
    expectedRuntimeSymbols: [
      {
        kind: "schema_table",
        needle: "soulStones",
        description:
          "per-player soul-stone counts table (red / violet / gold per §1.1)",
      },
      {
        kind: "shared_export",
        needle: "purifySoulStone",
        description: "shared module exposing the purify choice (§1.2 Path B)",
      },
      {
        kind: "shared_export",
        needle: "corruptSoulStone",
        description: "shared module exposing the corrupt choice (§1.3 Path A)",
      },
      {
        kind: "trpc_procedure",
        needle: "purify",
        description: "tRPC router exposing soulStones.purify",
      },
      {
        kind: "client_component",
        needle: "SoulStonesPanel",
        description: "client UI surface for the corrupt/purify choice",
      },
      {
        kind: "shared_export",
        needle: "summonDemonPet",
        description: "demon-pet summoning surface tied to red stones (§1.3)",
      },
    ],
  },

  // ─── Pet / Specimen Breeding ───────────────────────────────
  // docs/archive/2026-05-08-superseded/BREEDING_SYSTEM_ART_PROMPTS.md —
  // pet pairing / lineage / offspring generation. Fully shipped now
  // (apps/server/routers/petBreeding.ts + apps/shared/petBreeding.ts +
  // apps/db/schema.ts:petBreedingPairs + BreedingPanel) — status:
  // shipped means a regression on any expected symbol fails the gate.
  {
    id: "pet_breeding",
    docPath:
      "docs/archive/2026-05-08-superseded/BREEDING_SYSTEM_ART_PROMPTS.md",
    status: "shipped",
    note: "Pet pairing + offspring generation — fully shipped 2026-05-08+.",
    expectedRuntimeSymbols: [
      {
        kind: "schema_table",
        needle: "petBreedingPairs",
        description: "table tracking active breeding pairs",
      },
      {
        kind: "shared_export",
        needle: "breedPets",
        description: "shared module computing offspring stats from a pair",
      },
      {
        kind: "trpc_router_mount",
        needle: "petBreeding",
        description:
          "petBreedingRouter imported and mounted in apps/server/routers.ts",
      },
      {
        kind: "client_component",
        needle: "BreedingPanel",
        description: "client UI for the breeding pair selector",
      },
    ],
  },

  // ─── Living Character Sheet ────────────────────────────────
  // docs/production/LIVING_CHARACTER_SHEET_ART_BRIEF.md — animated
  // sheet that updates with choices + morality state. Fully shipped
  // (apps/shared/livingCharacterSheet.ts + LivingCharacterSheet
  // component on PlayerProfilePage).
  {
    id: "living_character_sheet",
    docPath: "docs/production/LIVING_CHARACTER_SHEET_ART_BRIEF.md",
    status: "shipped",
    note: "Animated character sheet bound to morality + choice state.",
    expectedRuntimeSymbols: [
      {
        kind: "shared_export",
        needle: "buildLivingCharacterSheet",
        description:
          "shared builder computing the live sheet view from player state (apps/shared/livingCharacterSheet.ts)",
      },
      {
        kind: "client_component",
        needle: "LivingCharacterSheet",
        description: "client component rendering the animated sheet",
      },
    ],
  },

  // ─── Trade Empire — Coda mission loop ──────────────────────
  // Trade Empire Coda — full runtime shipped: the Vex reveal cadence
  // framework AND the Coda Agency mission loop that delivers the
  // reveals are both in production. `codaFactionStanding` table
  // (apps/db/schema.ts) + per-player `vexCodaTrust` column +
  // `generateCodaMission` generator (apps/shared/codaMissionGenerator.ts)
  // + `completeCodaMission` tRPC procedure (apps/server/routers/
  // tradeMissions.ts:456) + `CodaAgencyBoard` client component
  // (apps/client/src/components/CodaAgencyBoard.tsx) are all wired.
  // Status flipped from "tracked" → "shipped" 2026-05-27 (ADOPTION_AUDIT_2026-05).
  {
    id: "trade_empire_coda",
    docPath: "docs/design/EXPANSION_BIBLE.md",
    status: "shipped",
    note:
      "Coda Agency mission loop that carries the Vex reveal cadence — full runtime shipped (schema table + per-player trust column + mission generator + tRPC completion procedure + client board).",
    expectedRuntimeSymbols: [
      {
        kind: "schema_table",
        needle: "codaFactionStanding",
        description:
          "neutral / client / operative tier table for Coda standing (schema.ts:7482 placeholder)",
      },
      {
        kind: "schema_column",
        needle: "vexCodaTrust",
        description:
          "per-player Coda trust column — gates the Vex reveal cadence steps",
      },
      {
        kind: "shared_export",
        needle: "generateCodaMission",
        description: "Coda mission generator (mission loop entry point)",
      },
      {
        kind: "trpc_procedure",
        needle: "completeCodaMission",
        description: "tRPC procedure recording Coda mission completion",
      },
      {
        kind: "client_component",
        needle: "CodaAgencyBoard",
        description: "client UI surfacing Coda missions to the player",
      },
    ],
  },
];

/**
 * Count of declared symbols across every system. Used by the
 * gate's `declared` field.
 */
export function countDeclaredSymbols(): number {
  let n = 0;
  for (const sys of DECLARED_DESIGN_SYSTEMS) {
    n += sys.expectedRuntimeSymbols.length;
  }
  return n;
}
