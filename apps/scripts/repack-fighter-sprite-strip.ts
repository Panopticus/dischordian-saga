/* ═══════════════════════════════════════════════════════
   repack-fighter-sprite-strip.ts

   Take a directory of per-state PNG frames and composite them
   into the three engine-expected sprite sheets:

     {id}_idle_movement.png       (rows 0-5: idle, walk fwd/back, jump, crouch, dash)
     {id}_attacks_specials.png    (rows 0-5: light/medium/heavy punch, kicks, sweep, special, jump-attack, taunt)
     {id}_reactions_victory.png   (rows 0-5: hit, knockdown, block/dizzy, grab, victory, ko)

   Sheet layout: 16 cols × 6 rows × 172×256 cells = 2752×1536 PNG.
   Cell schedule mirrors apps/client/src/game/spriteSheetConfig.ts buildAnimations().

   Producer workflow:
     1. Generate per-state frame PNGs at any size (will be resized to 172×256).
        File naming: {state}_{frame_index}.png  (e.g. idle_0.png, idle_1.png ... idle_9.png)
        States: see STATE_PLACEMENT below.
     2. Run:  pnpm tsx apps/scripts/repack-fighter-sprite-strip.ts \
                --fighter <id> \
                --in <dir-of-pngs> \
                --out <dir-for-sheets> \
                [--variant architect|collector|enigma]
     3. Verify the three sheets render in the engine via SpriteAnimator.

   Requires: sharp (pnpm add -D sharp). Dry-run mode works without it.
   ═══════════════════════════════════════════════════════ */

import { promises as fs } from "node:fs";
import path from "node:path";

/* ─── CELL SCHEDULE — must mirror spriteSheetConfig.ts ─── */

interface StatePlacement {
  sheet: "idle_movement" | "attacks_specials" | "reactions_victory";
  row: number;
  startCol: number;
  frameCount: number;
}

const STATE_PLACEMENT: Record<string, StatePlacement> = {
  // idle_movement sheet
  idle:        { sheet: "idle_movement", row: 0, startCol: 0,  frameCount: 10 },
  walkForward: { sheet: "idle_movement", row: 1, startCol: 0,  frameCount: 8 },
  walkBack:    { sheet: "idle_movement", row: 2, startCol: 0,  frameCount: 8 },
  jump:        { sheet: "idle_movement", row: 3, startCol: 0,  frameCount: 8 },
  crouch:      { sheet: "idle_movement", row: 4, startCol: 0,  frameCount: 4 },
  dash:        { sheet: "idle_movement", row: 5, startCol: 0,  frameCount: 6 },

  // attacks_specials sheet
  lightPunch:  { sheet: "attacks_specials", row: 0, startCol: 0,  frameCount: 5 },
  mediumPunch: { sheet: "attacks_specials", row: 0, startCol: 8,  frameCount: 6 },
  heavyPunch:  { sheet: "attacks_specials", row: 1, startCol: 0,  frameCount: 6 },
  lightKick:   { sheet: "attacks_specials", row: 2, startCol: 0,  frameCount: 5 },
  mediumKick:  { sheet: "attacks_specials", row: 2, startCol: 8,  frameCount: 6 },
  heavyKick:   { sheet: "attacks_specials", row: 3, startCol: 0,  frameCount: 6 },
  crouchPunch: { sheet: "attacks_specials", row: 3, startCol: 6,  frameCount: 4 },
  sweep:       { sheet: "attacks_specials", row: 3, startCol: 10, frameCount: 6 },
  crouchKick:  { sheet: "attacks_specials", row: 4, startCol: 0,  frameCount: 4 },
  special:     { sheet: "attacks_specials", row: 4, startCol: 4,  frameCount: 8 },
  jumpAttack:  { sheet: "attacks_specials", row: 5, startCol: 0,  frameCount: 5 },
  taunt:       { sheet: "attacks_specials", row: 5, startCol: 8,  frameCount: 8 },

  // reactions_victory sheet
  hit:         { sheet: "reactions_victory", row: 0, startCol: 0, frameCount: 4 },
  knockdown:   { sheet: "reactions_victory", row: 1, startCol: 0, frameCount: 6 },
  block:       { sheet: "reactions_victory", row: 2, startCol: 0, frameCount: 3 },
  dizzy:       { sheet: "reactions_victory", row: 2, startCol: 6, frameCount: 6 },
  grab:        { sheet: "reactions_victory", row: 3, startCol: 0, frameCount: 6 },
  victory:     { sheet: "reactions_victory", row: 4, startCol: 0, frameCount: 10 },
  ko:          { sheet: "reactions_victory", row: 5, startCol: 0, frameCount: 6 },
};

const CELL_W = 172;
const CELL_H = 256;
const COLS = 16;
const ROWS = 6;
const SHEET_W = CELL_W * COLS;   // 2752
const SHEET_H = CELL_H * ROWS;   // 1536

/* ─── ARGS ─── */

interface Args {
  fighter: string;
  in: string;
  out: string;
  variant?: "architect" | "collector" | "enigma";
  dryRun: boolean;
}

function parseArgs(argv: string[]): Args {
  const args: Partial<Args> = { dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry-run") args.dryRun = true;
    else if (a === "--fighter") args.fighter = argv[++i];
    else if (a === "--in") args.in = argv[++i];
    else if (a === "--out") args.out = argv[++i];
    else if (a === "--variant") args.variant = argv[++i] as Args["variant"];
  }
  if (!args.fighter) throw new Error("--fighter <id> required");
  if (!args.dryRun && !args.in) throw new Error("--in <dir> required");
  if (!args.dryRun && !args.out) throw new Error("--out <dir> required");
  return args as Args;
}

/* ─── DRY-RUN: print the per-state cell schedule for the producer ─── */

function emitSchedule(fighter: string): void {
  console.log(`\n# ${fighter} — sprite-strip cell schedule (2752×1536, 16×6 grid, 172×256 cells)\n`);
  const bySheet: Record<string, [string, StatePlacement][]> = {};
  for (const [state, p] of Object.entries(STATE_PLACEMENT)) {
    bySheet[p.sheet] ??= [];
    bySheet[p.sheet].push([state, p]);
  }
  for (const [sheet, entries] of Object.entries(bySheet)) {
    console.log(`## ${fighter}_${sheet}.png`);
    console.log("| state | row | startCol | endCol | frames | x range (px) | y range (px) |");
    console.log("|---|---:|---:|---:|---:|---|---|");
    for (const [state, p] of entries) {
      const xStart = p.startCol * CELL_W;
      const xEnd   = (p.startCol + p.frameCount) * CELL_W;
      const yStart = p.row * CELL_H;
      const yEnd   = yStart + CELL_H;
      const endCol = p.startCol + p.frameCount - 1;
      console.log(`| ${state} | ${p.row} | ${p.startCol} | ${endCol} | ${p.frameCount} | ${xStart}–${xEnd} | ${yStart}–${yEnd} |`);
    }
    console.log("");
  }
  console.log("Producer notes:");
  console.log("- Submit one PNG per frame named `{state}_{i}.png` (e.g. `idle_0.png` ... `idle_9.png`).");
  console.log("- Frame count per state shown above.");
  console.log("- Each input frame will be resized to exactly 172×256 px preserving alpha.");
  console.log("- Background must be transparent.");
  console.log("- All 24 states are required. Missing frames render as empty cells (engine will fall back to idle).");
}

/* ─── COMPOSITE: actually pack the sheets ─── */

async function repack(args: Args): Promise<void> {
  let sharp: typeof import("sharp");
  try {
    sharp = (await import("sharp")).default;
  } catch {
    console.error(
      "\nERROR: `sharp` is not installed.\n" +
      "Install with: pnpm add -D sharp\n" +
      "Or run with --dry-run to preview the cell schedule without sharp.\n",
    );
    process.exit(1);
  }

  await fs.mkdir(args.out, { recursive: true });

  // Group placements by sheet
  const sheets = ["idle_movement", "attacks_specials", "reactions_victory"] as const;

  for (const sheetName of sheets) {
    const composites: import("sharp").OverlayOptions[] = [];
    for (const [state, placement] of Object.entries(STATE_PLACEMENT)) {
      if (placement.sheet !== sheetName) continue;
      for (let i = 0; i < placement.frameCount; i++) {
        const inputPath = path.join(args.in, `${state}_${i}.png`);
        try {
          await fs.access(inputPath);
        } catch {
          console.warn(`  ⚠️  missing: ${state}_${i}.png — cell will be empty`);
          continue;
        }
        const resized = await sharp(inputPath)
          .resize(CELL_W, CELL_H, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .png()
          .toBuffer();
        const x = (placement.startCol + i) * CELL_W;
        const y = placement.row * CELL_H;
        composites.push({ input: resized, top: y, left: x });
      }
    }

    // Variant-named outputs for the 3 special fighters
    let outName = `${args.fighter}_${sheetName}.png`;
    if (args.variant === "architect" && sheetName === "attacks_specials") outName = `${args.fighter}_basic_attacks.png`;
    if (args.variant === "architect" && sheetName === "reactions_victory") outName = `${args.fighter}_reactions_throws.png`;
    if (args.variant === "collector" && sheetName === "attacks_specials") outName = `${args.fighter}_basic_attacks.png`;
    if (args.variant === "collector" && sheetName === "reactions_victory") outName = `${args.fighter}_reactions_victory_ko.png`;
    if (args.variant === "enigma" && sheetName === "attacks_specials") outName = `${args.fighter}_basic_attacks.png`;
    if (args.variant === "enigma" && sheetName === "reactions_victory") outName = `${args.fighter}_specials_reactions_victory.png`;

    const outPath = path.join(args.out, outName);

    await sharp({
      create: {
        width: SHEET_W,
        height: SHEET_H,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite(composites)
      .png()
      .toFile(outPath);

    console.log(`  ✓ wrote ${outPath} (${composites.length} cells filled)`);
  }
}

/* ─── ENTRY ─── */

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (args.dryRun) {
    emitSchedule(args.fighter);
    return;
  }
  await repack(args);
  console.log("\nDone. Upload the 3 sheets to:");
  console.log(`  s3://dgrsart/cdn/client-public/art/fighters/${args.fighter}/\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
