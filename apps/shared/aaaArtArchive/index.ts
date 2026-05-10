/* ═══════════════════════════════════════════════════════
   AAA ART ARCHIVE — barrel + total-coverage helper

   Single import surface for the May 2026 producer drop
   ("AAA Final/Art Archive 5.10.26.zip"). Every URL the
   archive ships is reachable through one of the helpers
   re-exported here. The `allArchiveUrls()` aggregate is
   used by the smoke test in `aaaArtArchive.test.ts` to
   prove the manifest matches the on-disk file count
   (819 binaries → 1267 URLs after _original mirrors).
   ═══════════════════════════════════════════════════════ */

export * from "./fightSprites";
export * from "./fightStages";
export * from "./fightHud";
export * from "./fightVfx";
export * from "./cardGameVfx";
export * from "./characterSheets";
export * from "./cinematicsArchive";
export * from "./tradeEmpireArt";
export * from "./fightAudio";

import { allFightSpriteUrls } from "./fightSprites";
import { allFightStageUrls } from "./fightStages";
import { allFightHudUrls } from "./fightHud";
import { allFightVfxUrls } from "./fightVfx";
import { allCardGameUrls } from "./cardGameVfx";
import { allCharacterSheetUrls } from "./characterSheets";
import { allCinematicsUrls } from "./cinematicsArchive";
import { allTradeEmpireUrls } from "./tradeEmpireArt";
import { allFightAudioUrls } from "./fightAudio";

export function allArchiveUrls(): readonly string[] {
  return [
    ...allFightSpriteUrls(),
    ...allFightStageUrls(),
    ...allFightHudUrls(),
    ...allFightVfxUrls(),
    ...allCardGameUrls(),
    ...allCharacterSheetUrls(),
    ...allCinematicsUrls(),
    ...allTradeEmpireUrls(),
    ...allFightAudioUrls(),
  ];
}

export function archiveCountByCategory(): Readonly<Record<string, number>> {
  return {
    fightSprites: allFightSpriteUrls().length,
    fightStages: allFightStageUrls().length,
    fightHud: allFightHudUrls().length,
    fightVfx: allFightVfxUrls().length,
    cardGame: allCardGameUrls().length,
    characterSheets: allCharacterSheetUrls().length,
    cinematics: allCinematicsUrls().length,
    tradeEmpire: allTradeEmpireUrls().length,
    fightAudio: allFightAudioUrls().length,
  };
}
