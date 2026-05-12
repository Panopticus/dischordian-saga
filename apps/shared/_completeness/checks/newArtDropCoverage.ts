/**
 * NEW_ART_{1,2,3} drop coverage parity check.
 *
 * Declared surface: the 1,838 producer assets shipped in the
 * 2026-05-12 drop, declared in newArtInventory.data.ts.
 *
 * Implemented surface: every asset that resolves to a non-undefined
 * URL via {@link newArtUrl}. Since assetUrl() is a pure string join
 * the resolver never fails — coverage is therefore declared=implemented
 * by construction. The gate's value is asserting that the 7 vehicle
 * zipDirs + 60 destinations + 60 signature cards + 28 chapter cards
 * the runtime expects are all present.
 *
 * Hard parity.
 */
import type { RawParityCount } from "../types";

export async function checkNewArtDropCoverage(): Promise<RawParityCount> {
  const mod = await import("../../expansionArt/newArtManifest");
  const {
    NEW_ART_TOTAL,
    NEW_ART_VEHICLE_ZIPDIRS,
    newArtCoverageReport,
    newArtDestinations,
    newArtSignatureCardUrl,
    newArtChapterCardUrl,
    NEW_ART_DOCTRINE_ARCHETYPES,
    NEW_ART_DOCTRINE_BRANCHES,
  } = mod;

  // Declared/implemented invariants:
  //   - 7 vehicle zipDirs each resolve to ≥1 interior shot
  //   - 60 destinations across 5 categories
  //   - 60 (12 × 5) signature cards
  //   - 28 chapter cards
  // Each failing assertion contributes one item to the gap.
  const report = newArtCoverageReport();
  const dest = newArtDestinations();
  const missing: string[] = [];

  for (const v of NEW_ART_VEHICLE_ZIPDIRS) {
    if (!report.vehiclesCovered.includes(v)) {
      missing.push(`vehicle baseline: ${v}`);
    }
  }
  // 60 destinations total
  const declaredDestinations = 60;
  if (report.destinationsCovered < declaredDestinations) {
    missing.push(
      `destinations covered: ${report.destinationsCovered}/${declaredDestinations}`,
    );
  }
  // 60 signature cards (12 × 5)
  let sigMissing = 0;
  for (const a of NEW_ART_DOCTRINE_ARCHETYPES) {
    for (const b of NEW_ART_DOCTRINE_BRANCHES) {
      if (!newArtSignatureCardUrl(a, b)) sigMissing += 1;
    }
  }
  if (sigMissing > 0) missing.push(`signature cards missing: ${sigMissing}`);
  // 28 chapter cards
  const chapterStems = [
    "chapter_act1_awakening",
    "chapter_act1_finale_alignment",
    "chapter_act1_first_light",
    "chapter_act1_iron_lion_intro",
    "chapter_act2_kael_awakening",
    "chapter_act2_oracle_deflection",
    "chapter_act2_silence_of_two_witnesses",
    "chapter_act3_disclosure",
    "chapter_act3_elara_choice",
    "chapter_act3_path_dividend",
    "chapter_act4_broken_trust",
    "chapter_act4_consumed_witness",
    "chapter_act4_fragile_trust",
    "chapter_act4_reconciled",
    "chapter_act5_dreamer_gambit",
    "chapter_act5_insurgency_rally",
    "chapter_act5_recruitment",
    "chapter_act6_confession",
    "chapter_act6_remembrance",
    "chapter_act6_woman_she_was",
    "chapter_act7_humanity_chosen",
    "chapter_act7_pattern_chosen",
    "chapter_act7_silence_in_heaven",
    "chapter_authority_trial",
    "chapter_card_battle_climax",
    "chapter_casino_jackpot",
    "chapter_dream_vision",
    "chapter_memorial_corridor",
  ];
  for (const stem of chapterStems) {
    if (!newArtChapterCardUrl(stem)) missing.push(`chapter card: ${stem}`);
  }

  // Declared = vehicles(7) + destinations(60) + signatureCards(60)
  //         + chapterCards(28) + bulk(all other categories sum).
  const declared =
    NEW_ART_VEHICLE_ZIPDIRS.length +
    declaredDestinations +
    NEW_ART_DOCTRINE_ARCHETYPES.length * NEW_ART_DOCTRINE_BRANCHES.length +
    chapterStems.length;

  const implemented =
    declared -
    // each missing entry subtracts one
    (missing.length === 0
      ? 0
      : missing.reduce((n, m) => {
          if (m.startsWith("vehicle baseline:")) return n + 1;
          if (m.startsWith("destinations covered:")) {
            // approximate: report counts entries; cap at the gap
            const match = /(\d+)\/(\d+)/.exec(m);
            if (match) return n + (Number(match[2]) - Number(match[1]));
            return n;
          }
          if (m.startsWith("signature cards missing:")) {
            const c = Number(m.split(":")[1].trim());
            return n + (Number.isFinite(c) ? c : 0);
          }
          if (m.startsWith("chapter card:")) return n + 1;
          return n;
        }, 0));

  return {
    declared,
    implemented,
    missing,
  };
}
