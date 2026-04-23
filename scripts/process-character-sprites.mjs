/**
 * Process raw character sprite sheets into web-optimized AVIFs and copy
 * them into apps/client/public/characters/<id>/<file>.avif so the
 * existing upload-public-to-s3.ts pipeline can ship them to CloudFront.
 *
 * Source layout:
 *   /tmp/dgrs-models/extracted/protagonists/{elara,human}_*.png
 *   /tmp/dgrs-models/extracted/npcs/<npc>/(viseme_grid|blink_triptych|breathing_loop).png
 *   /tmp/dgrs-models/extracted/npcs/<npc>/expressions/expression_sheet.png
 *   /tmp/dgrs-models/extracted/npcs/<npc>_bust.png
 *
 * Output layout (apps/client/public/characters/):
 *   elara/{bust,viseme,expressions,idle_hologram,front_turnaround,full_turnaround}.avif
 *   the_human/{bust,expressions,front_turnaround,full_turnaround,reveal_start,reveal_end}.avif
 *   <npc>/{bust,viseme,blink,breathing,expressions}.avif
 */
import sharp from "sharp";
import { mkdir, readdir, stat, copyFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const SRC = "/tmp/dgrs-models/extracted";
const OUT = "/home/user/dischordian-saga/apps/client/public/characters";

// Halve longest side to keep cell sizes reasonable but still sharp at
// the 200-300px display widths used by NPCDialog/AnimatedPortrait.
const MAX_DIM = 1400;
const AVIF = { quality: 60, effort: 4 };

async function process(srcPath, outPath) {
  await mkdir(dirname(outPath), { recursive: true });
  const meta = await sharp(srcPath).metadata();
  const longest = Math.max(meta.width || 0, meta.height || 0);
  const pipeline = sharp(srcPath);
  if (longest > MAX_DIM) {
    if ((meta.width || 0) >= (meta.height || 0)) {
      pipeline.resize({ width: MAX_DIM });
    } else {
      pipeline.resize({ height: MAX_DIM });
    }
  }
  await pipeline.avif(AVIF).toFile(outPath);
  const s = await stat(outPath);
  return { in: (await stat(srcPath)).size, out: s.size, w: meta.width, h: meta.height };
}

async function main() {
  await mkdir(OUT, { recursive: true });

  // Mapping: character output id -> { srcPath: outFile }
  const tasks = [];

  // PROTAGONISTS — Elara + Human
  const proto = `${SRC}/protagonists`;
  tasks.push(["elara/viseme.avif",          `${proto}/elara_viseme_grid.png`]);
  tasks.push(["elara/expressions.avif",     `${proto}/elara_expression_sheet.png`]);
  tasks.push(["elara/idle_hologram.avif",   `${proto}/elara_idle_hologram.png`]);
  tasks.push(["elara/front_turnaround.avif",`${proto}/elara_front_turnaround.png`]);
  tasks.push(["elara/full_turnaround.avif", `${proto}/elara_full_turnaround.png`]);

  tasks.push(["the_human/expressions.avif",      `${proto}/human_expression_sheet.png`]);
  tasks.push(["the_human/front_turnaround.avif", `${proto}/human_front_turnaround.png`]);
  tasks.push(["the_human/full_turnaround.avif",  `${proto}/human_full_turnaround.png`]);
  tasks.push(["the_human/reveal_start.avif",     `${proto}/human_reveal_start.png`]);
  tasks.push(["the_human/reveal_end.avif",       `${proto}/human_reveal_end.png`]);

  // Map our internal NPC ids -> bundle dir name
  const npcDirMap = {
    agent_zero: "agent_zero",
    adjudicator_locke: "adjudicator_locke",
    the_antiquarian: "antiquarian",
    the_source: "kael_source",
    shadow_tongue: "shadow_tongue",
    the_meme: "meme_palimpsest",
    // bonus characters present in bundle, wired so future faction NPCs work
    architect: "architect",
    cades: "cades",
    collector: "collector",
    degen: "degen",
    eidola: "eidola",
    engineer: "engineer",
    enigma: "enigma",
    eyes: "eyes",
    gamemaster: "gamemaster",
    iron_lion: "iron_lion",
    kael_recruiter: "kael_recruiter",
    matrikala: "matrikala",
    necromancer: "necromancer",
    nilmorg: "nilmorg",
    programmer: "programmer",
    seer: "seer",
    warlord: "warlord",
    watcher: "watcher",
    conexus_authority: "conexus_authority",
  };

  const npcRoot = `${SRC}/npcs`;
  for (const [outId, srcDir] of Object.entries(npcDirMap)) {
    // conexus_authority is a single file, not a dir
    if (srcDir === "conexus_authority") {
      tasks.push([`${outId}/bust.avif`, `${npcRoot}/conexus_authority.png`]);
      continue;
    }
    tasks.push([`${outId}/bust.avif`,        `${npcRoot}/${srcDir}_bust.png`]);
    tasks.push([`${outId}/viseme.avif`,      `${npcRoot}/${srcDir}/viseme_grid.png`]);
    tasks.push([`${outId}/blink.avif`,       `${npcRoot}/${srcDir}/blink_triptych.png`]);
    tasks.push([`${outId}/breathing.avif`,   `${npcRoot}/${srcDir}/breathing_loop.png`]);
    tasks.push([`${outId}/expressions.avif`, `${npcRoot}/${srcDir}/expressions/expression_sheet.png`]);
  }

  console.log(`Processing ${tasks.length} sprite sheets ...`);
  let totalIn = 0, totalOut = 0, failed = 0;
  const inventory = [];
  for (const [rel, src] of tasks) {
    const out = `${OUT}/${rel}`;
    try {
      const r = await process(src, out);
      totalIn += r.in;
      totalOut += r.out;
      inventory.push({ rel, src: src.replace(SRC + "/", ""), w: r.w, h: r.h, bytes: r.out });
      const reduction = ((1 - r.out / r.in) * 100).toFixed(1);
      console.log(`  ${rel}  ${r.w}x${r.h}  ${(r.in / 1024 / 1024).toFixed(2)}M -> ${(r.out / 1024).toFixed(0)}K  (-${reduction}%)`);
    } catch (e) {
      failed++;
      console.error(`  FAIL ${rel} from ${src}: ${e.message}`);
    }
  }

  await writeFile(`${OUT}/_inventory.json`, JSON.stringify(inventory, null, 2));
  console.log(
    `\nTotal in:  ${(totalIn / 1024 / 1024).toFixed(1)} MB`,
    `\nTotal out: ${(totalOut / 1024 / 1024).toFixed(1)} MB`,
    `\nFailed:    ${failed}`,
  );
  if (failed > 0) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
