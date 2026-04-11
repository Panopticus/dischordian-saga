import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

/* ═══════════════════════════════════════════════════════
   NARRATIVE FLOW TESTS: Quest Tracker HUD, Awakening
   Journal Entry, and Clue Journal Integration
   ═══════════════════════════════════════════════════════ */

/* ─── QUEST TRACKER HUD ─── */
describe("QuestTracker Component", () => {
  const questTrackerSrc = fs.readFileSync(
    path.resolve(__dirname, "../client/src/components/QuestTracker.tsx"),
    "utf-8"
  );

  describe("Module structure", () => {
    it("should export QuestTracker as default", () => {
      expect(questTrackerSrc).toContain("export default function QuestTracker");
    });

    it("should export Quest interface", () => {
      expect(questTrackerSrc).toContain("export interface Quest");
    });

    it("should import useGame context", () => {
      expect(questTrackerSrc).toContain("useGame");
    });

    it("should import useLoredex context", () => {
      expect(questTrackerSrc).toContain("useLoredex");
    });

    it("should import useLocation for route-based visibility", () => {
      expect(questTrackerSrc).toContain("useLocation");
    });
  });

  describe("Quest definitions", () => {
    it("should define QUESTS array", () => {
      expect(questTrackerSrc).toContain("const QUESTS: Quest[]");
    });

    it("should include AWAKENING quest as first quest", () => {
      expect(questTrackerSrc).toContain('id: "awaken"');
      expect(questTrackerSrc).toContain('title: "AWAKENING"');
    });

    it("should include REACH THE BRIDGE quest", () => {
      expect(questTrackerSrc).toContain('id: "explore_bridge"');
      expect(questTrackerSrc).toContain('title: "REACH THE BRIDGE"');
    });

    it("should include MAP THE ARK exploration quest", () => {
      expect(questTrackerSrc).toContain('id: "explore_5_rooms"');
      expect(questTrackerSrc).toContain('title: "MAP THE ARK"');
    });

    it("should include SCAVENGER PROTOCOL collection quest", () => {
      expect(questTrackerSrc).toContain('id: "collect_3_items"');
      expect(questTrackerSrc).toContain('title: "SCAVENGER PROTOCOL"');
    });

    it("should include INTELLIGENCE GATHERING discovery quest", () => {
      expect(questTrackerSrc).toContain('id: "discover_10_entries"');
    });

    it("should include FULL CLEARANCE quest", () => {
      expect(questTrackerSrc).toContain('id: "full_access"');
      expect(questTrackerSrc).toContain('title: "FULL CLEARANCE"');
    });

    it("should include ARTIFACT ANALYST collection quest", () => {
      expect(questTrackerSrc).toContain('id: "collect_10_items"');
    });

    it("should include DEEP INTELLIGENCE discovery quest", () => {
      expect(questTrackerSrc).toContain('id: "discover_50_entries"');
    });

    it("should have at least 8 quests defined", () => {
      const questIdMatches = questTrackerSrc.match(/id:\s*"/g);
      expect(questIdMatches).toBeTruthy();
      expect(questIdMatches!.length).toBeGreaterThanOrEqual(8);
    });
  });

  describe("Quest categories", () => {
    it("should support main category", () => {
      expect(questTrackerSrc).toContain('category: "main"');
    });

    it("should support exploration category", () => {
      expect(questTrackerSrc).toContain('category: "exploration"');
    });

    it("should support discovery category", () => {
      expect(questTrackerSrc).toContain('category: "discovery"');
    });

    it("should support collection category", () => {
      expect(questTrackerSrc).toContain('category: "collection"');
    });
  });

  describe("Quest check state", () => {
    it("should track phase", () => {
      expect(questTrackerSrc).toContain("phase: string");
    });

    it("should track characterCreated", () => {
      expect(questTrackerSrc).toContain("characterCreated: boolean");
    });

    it("should track roomsUnlocked", () => {
      expect(questTrackerSrc).toContain("roomsUnlocked: number");
    });

    it("should track totalRooms", () => {
      expect(questTrackerSrc).toContain("totalRooms: number");
    });

    it("should track itemsCollected", () => {
      expect(questTrackerSrc).toContain("itemsCollected: string[]");
    });

    it("should track discoveredCount", () => {
      expect(questTrackerSrc).toContain("discoveredCount: number");
    });

    it("should track totalEntries", () => {
      expect(questTrackerSrc).toContain("totalEntries: number");
    });

    it("should track narrativeFlags", () => {
      expect(questTrackerSrc).toContain("narrativeFlags: Record<string, boolean>");
    });
  });

  describe("UI behavior", () => {
    it("should support minimized state", () => {
      expect(questTrackerSrc).toContain("minimized");
      expect(questTrackerSrc).toContain("setMinimized");
    });

    it("should support dismissed state", () => {
      expect(questTrackerSrc).toContain("dismissed");
    });

    it("should flash on new quest activation", () => {
      expect(questTrackerSrc).toContain("newQuestFlash");
      expect(questTrackerSrc).toContain("setNewQuestFlash(true)");
    });

    it("should hide on certain pages", () => {
      expect(questTrackerSrc).toContain("hiddenPages");
      expect(questTrackerSrc).toContain("/awakening");
      expect(questTrackerSrc).toContain("/admin");
    });

    it("should not show before character creation", () => {
      expect(questTrackerSrc).toContain("!state.characterCreated");
    });

    it("should show progress bar for active quest", () => {
      expect(questTrackerSrc).toContain("PROGRESS");
      expect(questTrackerSrc).toContain("activeQuest.progress");
      expect(questTrackerSrc).toContain("activeQuest.max");
    });

    it("should show reward for active quest", () => {
      expect(questTrackerSrc).toContain("activeQuest.quest.reward");
    });

    it("should show hint for active quest", () => {
      expect(questTrackerSrc).toContain("activeQuest.hint");
    });

    it("should show completed quests summary", () => {
      expect(questTrackerSrc).toContain("CompletedQuestsSummary");
    });

    it("should show ALL OBJECTIVES COMPLETE when all done", () => {
      expect(questTrackerSrc).toContain("ALL OBJECTIVES COMPLETE");
    });
  });

  describe("Positioning and z-index", () => {
    it("should be fixed positioned at bottom-right", () => {
      expect(questTrackerSrc).toContain("fixed bottom-[140px]");
      expect(questTrackerSrc).toMatch(/right-\d|sm:right-/);
    });

    it("should have appropriate z-index (z-[42], below dialog z-50)", () => {
      expect(questTrackerSrc).toContain("z-[42]");
    });
  });
});

/* ─── AWAKENING JOURNAL ENTRY ─── */
describe("AwakeningJournalEntry Component", () => {
  const journalSrc = fs.readFileSync(
    path.resolve(__dirname, "../client/src/components/AwakeningJournalEntry.tsx"),
    "utf-8"
  );

  describe("Module structure", () => {
    it("should export AwakeningJournalEntry as default", () => {
      expect(journalSrc).toContain("export default function AwakeningJournalEntry");
    });

    it("should export generateJournalEntry helper", () => {
      expect(journalSrc).toContain("export { generateJournalEntry");
    });

    it("should export narrative data maps", () => {
      expect(journalSrc).toContain("SPECIES_NARRATIVES");
      expect(journalSrc).toContain("CLASS_NARRATIVES");
      expect(journalSrc).toContain("ALIGNMENT_NARRATIVES");
      expect(journalSrc).toContain("ELEMENT_NARRATIVES");
    });

    it("should import useGame context", () => {
      expect(journalSrc).toContain("useGame");
    });
  });

  describe("Species narratives", () => {
    it("should have narrative for DeMagi", () => {
      expect(journalSrc).toContain("demagi:");
      expect(journalSrc).toContain('name: "DeMagi"');
    });

    it("should have narrative for Quarchon", () => {
      expect(journalSrc).toContain("quarchon:");
      expect(journalSrc).toContain('name: "Quarchon"');
    });

    it("should have narrative for Ne-Yon", () => {
      expect(journalSrc).toContain("neyon:");
      expect(journalSrc).toContain('name: "Ne-Yon"');
    });

    it("should include lore-accurate species descriptions", () => {
      expect(journalSrc).toContain("genetic alterations");
      expect(journalSrc).toContain("artificial intelligence");
      expect(journalSrc).toContain("hybrid");
    });
  });

  describe("Class narratives", () => {
    it("should have narrative for Engineer", () => {
      expect(journalSrc).toContain('name: "Engineer"');
      expect(journalSrc).toContain('title: "Code Weaver"');
    });

    it("should have narrative for Oracle", () => {
      expect(journalSrc).toContain('name: "Oracle"');
      expect(journalSrc).toContain('title: "Prophet"');
    });

    it("should have narrative for Assassin", () => {
      expect(journalSrc).toContain('name: "Assassin"');
      expect(journalSrc).toContain('title: "Virus"');
    });

    it("should have narrative for Soldier", () => {
      expect(journalSrc).toContain('name: "Soldier"');
      expect(journalSrc).toContain('title: "Warrior"');
    });

    it("should have narrative for Spy", () => {
      expect(journalSrc).toContain('name: "Spy"');
      expect(journalSrc).toContain('title: "Intelligence Operative"');
    });
  });

  describe("Alignment narratives", () => {
    it("should have narrative for Order", () => {
      expect(journalSrc).toContain('name: "Order"');
      expect(journalSrc).toContain("Architect");
    });

    it("should have narrative for Chaos", () => {
      expect(journalSrc).toContain('name: "Chaos"');
      expect(journalSrc).toContain("Dreamer");
    });
  });

  describe("Element narratives", () => {
    const elements = ["earth", "fire", "water", "air", "space", "time", "probability", "reality"];

    elements.forEach(elem => {
      it(`should have narrative for ${elem}`, () => {
        expect(journalSrc).toContain(`${elem}:`);
      });
    });

    it("should have 8 element narratives total", () => {
      const elementKeys = elements.filter(e => journalSrc.includes(`${e}: {`));
      expect(elementKeys.length).toBe(8);
    });
  });

  describe("Journal entry generation", () => {
    it("should generate entry with PERSONAL LOG header", () => {
      expect(journalSrc).toContain("PERSONAL LOG — ENTRY 001");
    });

    it("should include citizen name in header", () => {
      expect(journalSrc).toContain("CITIZEN:");
    });

    it("should include status in header", () => {
      expect(journalSrc).toContain("STATUS: Newly Awakened");
    });

    it("should include location in header", () => {
      expect(journalSrc).toContain("LOCATION: Inception Ark, Cryo Bay");
    });

    it("should include opening narrative about cryo pod", () => {
      expect(journalSrc).toContain("cryo pod");
      expect(journalSrc).toContain("Elara");
    });

    it("should include closing narrative about the Ark", () => {
      expect(journalSrc).toContain("Inception Ark stretches out");
    });

    it("should include species section heading", () => {
      expect(journalSrc).toContain("SPECIES CLASSIFICATION");
    });

    it("should include class section heading", () => {
      expect(journalSrc).toContain("CLASS APTITUDE");
    });

    it("should include alignment section heading", () => {
      expect(journalSrc).toContain("ALIGNMENT:");
    });

    it("should include element section heading", () => {
      expect(journalSrc).toContain("ELEMENTAL AFFINITY");
    });
  });

  describe("Citizen dossier display", () => {
    it("should show citizen dossier header", () => {
      expect(journalSrc).toContain("CITIZEN DOSSIER");
    });

    it("should display NAME field", () => {
      expect(journalSrc).toContain(">NAME<");
    });

    it("should display SPECIES field", () => {
      expect(journalSrc).toContain(">SPECIES<");
    });

    it("should display CLASS field", () => {
      expect(journalSrc).toContain(">CLASS<");
    });

    it("should display ALIGNMENT field", () => {
      expect(journalSrc).toContain(">ALIGNMENT<");
    });

    it("should display ELEMENT field", () => {
      expect(journalSrc).toContain(">ELEMENT<");
    });

    it("should display ATTRIBUTES field with ATK/DEF/VIT", () => {
      expect(journalSrc).toContain(">ATTRIBUTES<");
      expect(journalSrc).toContain("attrAttack");
      expect(journalSrc).toContain("attrDefense");
      expect(journalSrc).toContain("attrVitality");
    });
  });

  describe("Elara's annotation", () => {
    it("should include Elara's note section", () => {
      expect(journalSrc).toContain("ELARA'S NOTE");
    });

    it("should have species-specific Elara commentary", () => {
      expect(journalSrc).toContain("Ne-Yon hybrid");
      expect(journalSrc).toContain("Quarchon consciousness");
      expect(journalSrc).toContain("DeMagi genetic markers");
    });

    it("should include priority observation flag", () => {
      expect(journalSrc).toContain("priority observation");
    });
  });

  describe("Pre-awakening state", () => {
    it("should show empty state when character not created", () => {
      expect(journalSrc).toContain("No journal entries yet");
      expect(journalSrc).toContain("Complete the Awakening sequence");
    });

    it("should check characterCreated flag", () => {
      expect(journalSrc).toContain("!characterCreated");
    });
  });
});

/* ─── CLUE JOURNAL INTEGRATION ─── */
describe("ClueJournal Integration", () => {
  const clueJournalSrc = fs.readFileSync(
    path.resolve(__dirname, "../client/src/components/ClueJournal.tsx"),
    "utf-8"
  );

  describe("Personal Log tab", () => {
    it("should import AwakeningJournalEntry", () => {
      expect(clueJournalSrc).toContain('import AwakeningJournalEntry from "./AwakeningJournalEntry"');
    });

    it("should have 3 tabs: log, clues, puzzles", () => {
      expect(clueJournalSrc).toContain('"log" | "clues" | "puzzles"');
    });

    it("should default to log tab when character is created", () => {
      expect(clueJournalSrc).toContain('state.characterCreated ? "log" : "clues"');
    });

    it("should show PERSONAL LOG label for log tab", () => {
      expect(clueJournalSrc).toContain('"PERSONAL LOG"');
    });

    it("should render AwakeningJournalEntry in log tab", () => {
      expect(clueJournalSrc).toContain("<AwakeningJournalEntry />");
    });

    it("should still have DATA CRYSTALS tab", () => {
      expect(clueJournalSrc).toContain('"DATA CRYSTALS"');
    });

    it("should still have PUZZLES tab", () => {
      expect(clueJournalSrc).toContain('"PUZZLES"');
    });
  });
});

/* ─── APP.TSX INTEGRATION ─── */
describe("App.tsx QuestTracker Integration", () => {
  const appSrc = fs.readFileSync(
    path.resolve(__dirname, "../client/src/App.tsx"),
    "utf-8"
  );

  it("should import QuestTracker", () => {
    expect(appSrc).toContain('import QuestTracker from "./components/QuestTracker"');
  });

  it("should render QuestTracker in the app", () => {
    expect(appSrc).toContain("<QuestTracker />");
  });
});
