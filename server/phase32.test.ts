/**
 * Phase 32 Tests — CoNexus Media Player, Room Tutorial Dialog, Command Console
 * 
 * Tests the new components built in this phase:
 * 1. CoNexusMediaPlayer — persistent media hub replacing PlayerBar
 * 2. RoomTutorialDialog — BioWare-style branching dialog system
 * 3. CommandConsole — ship-as-app navigation shell
 * 4. Dream economy integration
 */
import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

const CLIENT_SRC = resolve(__dirname, "../client/src");

function readComponent(path: string): string {
  const fullPath = resolve(CLIENT_SRC, path);
  if (!existsSync(fullPath)) throw new Error(`Component not found: ${fullPath}`);
  return readFileSync(fullPath, "utf-8");
}

/* ═══════════════════════════════════════════════════════
   1. CoNexus Media Player
   ═══════════════════════════════════════════════════════ */
describe("CoNexus Media Player", () => {
  const src = readComponent("components/CoNexusMediaPlayer.tsx");

  it("should exist as a module", () => {
    expect(src).toBeTruthy();
    expect(src.length).toBeGreaterThan(500);
  });

  it("should export a default component", () => {
    expect(src).toContain("export default function CoNexusMediaPlayer");
  });

  it("should use the PlayerContext for audio playback", () => {
    expect(src).toContain("usePlayer");
    expect(src).toContain("@/contexts/PlayerContext");
  });

  it("should use the LoredexContext for song/entry data", () => {
    expect(src).toContain("useLoredex");
    expect(src).toContain("@/contexts/LoredexContext");
  });

  it("should define album data for all 4 albums", () => {
    expect(src).toContain("Dischordian Logic");
    expect(src).toContain("The Age of Privacy");
    expect(src).toContain("The Book of Daniel 2:47");
    expect(src).toContain("Silence in Heaven");
  });

  it("should define saga epochs for the saga browser", () => {
    expect(src).toContain("SAGA_EPOCHS");
    expect(src).toContain("THE FALL OF REALITY");
  });

  it("should support collapsed and expanded states", () => {
    expect(src).toMatch(/expanded|collapsed/i);
  });

  it("should include playback controls (play, pause, skip)", () => {
    expect(src).toContain("Play");
    expect(src).toContain("Pause");
    expect(src).toContain("SkipForward");
    expect(src).toContain("SkipBack");
  });

  it("should include streaming service icons", () => {
    expect(src).toContain("SpotifyIcon");
    expect(src).toContain("AppleMusicIcon");
  });

  it("should support multiple tabs (music, saga, etc.)", () => {
    // Should have tab-like navigation between different media views
    expect(src).toMatch(/tab|panel|section/i);
  });
});

/* ═══════════════════════════════════════════════════════
   2. Room Tutorial Dialog
   ═══════════════════════════════════════════════════════ */
describe("Room Tutorial Dialog", () => {
  const src = readComponent("components/RoomTutorialDialog.tsx");

  it("should exist as a module", () => {
    expect(src).toBeTruthy();
    expect(src.length).toBeGreaterThan(500);
  });

  it("should export default RoomTutorialDialog component", () => {
    expect(src).toContain("export default function RoomTutorialDialog");
  });

  it("should export hasRoomDialog helper", () => {
    expect(src).toContain("export function hasRoomDialog");
  });

  it("should export getRoomDialog helper", () => {
    expect(src).toContain("export function getRoomDialog");
  });

  it("should export ROOM_DIALOGS data", () => {
    expect(src).toContain("export { ROOM_DIALOGS }");
  });

  it("should export TypeScript types", () => {
    expect(src).toContain("export type { RoomDialog, DialogNode, DialogChoice }");
  });

  it("should define dialog data for cryo-bay room", () => {
    expect(src).toContain('roomId: "cryo-bay"');
  });

  it("should define dialog choices with card rewards", () => {
    expect(src).toContain("cardReward");
    expect(src).toContain("cardName");
  });

  it("should define dialog choices with narrative flags", () => {
    expect(src).toContain("flag:");
    expect(src).toContain("origin_resilient");
    expect(src).toContain("origin_seeker");
    expect(src).toContain("origin_awakened");
  });

  it("should have opening phase with typewriter effect", () => {
    expect(src).toContain("OpeningPhase");
    expect(src).toContain("useTypewriter");
  });

  it("should have dialog phase with choice selection", () => {
    expect(src).toContain("DialogPhase");
    expect(src).toContain("onChoiceSelect");
  });

  it("should have card reveal animation", () => {
    expect(src).toContain("CardReveal");
  });

  it("should support dismiss/skip functionality", () => {
    expect(src).toContain("onDismiss");
  });

  it("should use Elara avatar for dialog portrait", () => {
    expect(src).toContain("ELARA_AVATAR");
    expect(src).toContain("Elara");
  });

  it("should handle phase transitions (opening → dialog → reward → done)", () => {
    expect(src).toContain('"opening"');
    expect(src).toContain('"dialog"');
    expect(src).toContain('"reward"');
    expect(src).toContain('"done"');
  });
});

/* ═══════════════════════════════════════════════════════
   3. Command Console (Ship Navigation Shell)
   ═══════════════════════════════════════════════════════ */
describe("Command Console", () => {
  const src = readComponent("components/CommandConsole.tsx");

  it("should exist as a module", () => {
    expect(src).toBeTruthy();
    expect(src.length).toBeGreaterThan(1000);
  });

  it("should export default CommandConsole component", () => {
    expect(src).toContain("export default function CommandConsole");
  });

  it("should define SYSTEMS array with ship room definitions", () => {
    expect(src).toContain("const SYSTEMS: SystemDef[]");
  });

  it("should include the bridge system", () => {
    expect(src).toContain('id: "bridge"');
    expect(src).toContain("COMMAND BRIDGE");
  });

  it("should include the archives system", () => {
    expect(src).toContain('id: "archives"');
    expect(src).toContain("ARCHIVES");
  });

  it("should include the Dream HUD component", () => {
    expect(src).toContain("DreamHUD");
    expect(src).toContain("store.myDreamBalance");
  });

  it("should include clearance level display", () => {
    expect(src).toContain("clearanceLevel");
    expect(src).toContain("LEVEL 1");
    expect(src).toContain("LEVEL 5");
  });

  it("should include system unlock status hook", () => {
    expect(src).toContain("useSystemUnlockStatus");
  });

  it("should include mobile bottom navigation", () => {
    expect(src).toContain("MOBILE BOTTOM NAV");
  });

  it("should include sidebar with system cards", () => {
    expect(src).toContain("SystemCard");
    expect(src).toContain("SubsystemNav");
  });

  it("should include operative status section with XP", () => {
    expect(src).toContain("Operative Status");
    expect(src).toContain("gam.level");
    expect(src).toContain("gam.xpProgress");
  });

  it("should use GameContext for room unlock checks", () => {
    expect(src).toContain("useGame");
    expect(src).toContain("state.rooms");
  });

  it("should use GamificationContext for player stats", () => {
    expect(src).toContain("useGamification");
  });

  it("should include ARK control room backdrop", () => {
    expect(src).toContain("ARK_CONTROL_ROOM");
  });
});

/* ═══════════════════════════════════════════════════════
   4. ArkExplorer Integration with Room Tutorials
   ═══════════════════════════════════════════════════════ */
describe("ArkExplorer Room Tutorial Integration", () => {
  const src = readComponent("pages/ArkExplorerPage.tsx");

  it("should import RoomTutorialDialog", () => {
    expect(src).toContain("import RoomTutorialDialog");
    expect(src).toContain("hasRoomDialog");
  });

  it("should track tutorial room state", () => {
    expect(src).toContain("tutorialRoomId");
    expect(src).toContain("setTutorialRoomId");
  });

  it("should track completed tutorials in state", () => {
    expect(src).toContain("completedTutorials");
    expect(src).toContain("setCompletedTutorials");
  });

  it("should persist completed tutorials to localStorage", () => {
    expect(src).toContain("loredex_completed_tutorials");
    expect(src).toContain("localStorage.setItem");
  });

  it("should trigger tutorial on first room entry", () => {
    expect(src).toContain("transition.isNewRoom && hasRoomDialog");
  });

  it("should handle tutorial completion with flags and card rewards", () => {
    expect(src).toContain("handleTutorialComplete");
    expect(src).toContain("Card Acquired!");
  });

  it("should render RoomTutorialDialog in the JSX", () => {
    expect(src).toContain("<RoomTutorialDialog");
    expect(src).toContain("onComplete={handleTutorialComplete}");
  });
});

/* ═══════════════════════════════════════════════════════
   5. App.tsx Integration
   ═══════════════════════════════════════════════════════ */
describe("App Integration", () => {
  const src = readComponent("App.tsx");

  it("should import CoNexusMediaPlayer", () => {
    expect(src).toContain("import CoNexusMediaPlayer");
  });

  it("should import CommandConsole", () => {
    expect(src).toContain("import CommandConsole");
  });

  it("should render CoNexusMediaPlayer in GameGate", () => {
    expect(src).toContain("<CoNexusMediaPlayer");
  });

  it("should render CommandConsole wrapping Router", () => {
    expect(src).toContain("<CommandConsole");
    expect(src).toContain("<Router />");
  });

  it("should include the Awakening gate for first-time visitors", () => {
    expect(src).toContain("FIRST_VISIT");
    expect(src).toContain("AWAKENING");
    expect(src).toContain("<AwakeningPage");
  });

  it("should include achievement toast overlay", () => {
    expect(src).toContain("<AchievementToast");
  });

  it("should include Elara dialog overlay", () => {
    expect(src).toContain("<ElaraDialog");
  });

  it("should include sound controls with TTS toggle", () => {
    expect(src).toContain("<SoundControls");
    expect(src).toContain("ttsEnabled");
  });
});

/* ═══════════════════════════════════════════════════════
   6. Dream Economy Backend
   ═══════════════════════════════════════════════════════ */
describe("Dream Economy Backend", () => {
  it("should have dreamBalance schema in database", () => {
    const schemaPath = resolve(__dirname, "../drizzle/schema.ts");
    const schema = readFileSync(schemaPath, "utf-8");
    expect(schema).toContain("dreamBalance");
    expect(schema).toContain("dreamTokens");
    expect(schema).toContain("soulBoundDream");
    expect(schema).toContain("totalDreamEarned");
    expect(schema).toContain("dnaCode");
  });

  it("should have store router with dream balance query", () => {
    const storePath = resolve(__dirname, "routers/store.ts");
    const store = readFileSync(storePath, "utf-8");
    expect(store).toContain("myDreamBalance");
  });

  it("should have content reward system that grants dream tokens", () => {
    const rewardPath = resolve(__dirname, "routers/contentReward.ts");
    const reward = readFileSync(rewardPath, "utf-8");
    expect(reward).toContain("grantDream");
    expect(reward).toContain("dreamTokens");
  });

  it("should have crafting system that uses dream tokens", () => {
    const craftingPath = resolve(__dirname, "routers/crafting.ts");
    const crafting = readFileSync(craftingPath, "utf-8");
    expect(crafting).toContain("dreamBalance");
    expect(crafting).toContain("dreamTokens");
  });

  it("should have card game system that uses dream tokens for demon packs", () => {
    const cardGamePath = resolve(__dirname, "routers/cardGame.ts");
    const cardGame = readFileSync(cardGamePath, "utf-8");
    expect(cardGame).toContain("dreamBalance");
    expect(cardGame).toContain("Insufficient Dream tokens");
  });

  it("should have products definition with dream rewards", () => {
    const productsPath = resolve(__dirname, "products.ts");
    const products = readFileSync(productsPath, "utf-8");
    expect(products).toContain("dreamTokens");
    expect(products).toContain("Dream Starter Pack");
  });
});
