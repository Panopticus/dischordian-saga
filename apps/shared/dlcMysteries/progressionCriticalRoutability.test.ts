/* ═══════════════════════════════════════════════════════
   PROGRESSION-CRITICAL CLUE ROUTABILITY — INTEGRATION TEST

   The runtime click path:
     click (room R, hotspot H, verb V)
       → resolveVerbResponse(ROOM_MYSTERY_REGISTRY[R], V, H)
       → response.mysteryBinding
       → recordMysteryEvidence.mutate({mysteryId, clueId,
                                       foundInRoom: R,
                                       foundViaVerb: V})

   For every progression-critical clue authored in a dlcMystery
   definition (any clue referenced by a deduction with
   `unlocksEpisode`), this test simulates the chain end-to-end:

     1. Find the clue's `foundIn` room.
     2. Scan that room's responses table for a hotspot whose
        verb response carries a `mysteryBinding` containing
        the clue id under the arc's `mysteryId`.
     3. Assert the resolveVerbResponse call returns the binding
        the runtime would see, so the recordEvidence mutation
        fires with the right (mysteryId, clueId, room, verb).

   What this catches that nothing else does:
   - A clue whose `foundIn` room and binding room have drifted
     out of sync (mysteryClueFoundInParity covers the static
     side; this covers the runtime-resolution side).
   - A binding wired to the wrong `mysteryId` (orphan check
     catches "clue unauthored" but not "bound under the wrong
     mystery in the runtime registry").
   - A response that exists in the union but isn't actually
     resolved by `resolveVerbResponse` due to a verb-table
     shape bug.

   This is the programmatic equivalent of clicking every
   progression-critical hotspot in every arc in a browser —
   the manual end-to-end PR #664's acceptance criterion
   originally called for.
   ═══════════════════════════════════════════════════════ */
import { describe, expect, it } from "vitest";
import { MYSTERY_DEFINITIONS } from "../episodeMysteries";
import { ROOM_MYSTERY_REGISTRY } from "../roomMysteries";
import { resolveVerbResponse, type Verb } from "../roomMysteries/_template";

const DLC_ARC_PREFIX = "arc.dlc.";
const ALL_VERBS: readonly Verb[] = ["look", "use", "talk", "interrogate"];

/** Walk a dlc-arc definition and yield every progression-critical
 *  (clueId, foundInRoom, mysteryId, episodeId) tuple. A clue is
 *  progression-critical if it appears as clueA or clueB on a
 *  deduction with `unlocksEpisode` set. */
function progressionCriticalClues(): Array<{
  arcId: string;
  mysteryId: string;
  episodeId: string;
  clueId: string;
  foundIn: string;
}> {
  const out: Array<{
    arcId: string;
    mysteryId: string;
    episodeId: string;
    clueId: string;
    foundIn: string;
  }> = [];
  for (const arc of MYSTERY_DEFINITIONS) {
    if (!String(arc.arcId).startsWith(DLC_ARC_PREFIX)) continue;
    for (const episode of arc.episodes) {
      // collect clue lookup for the episode
      const clueById = new Map<string, { id: string; foundIn: string }>();
      for (const c of episode.clues) {
        clueById.set(String(c.id), { id: String(c.id), foundIn: c.foundIn });
      }
      for (const ded of episode.deductions) {
        if (!ded.unlocksEpisode) continue;
        for (const id of [String(ded.clueA), String(ded.clueB)]) {
          const c = clueById.get(id);
          if (!c) continue;
          out.push({
            arcId: String(arc.arcId),
            mysteryId: String(arc.id),
            episodeId: String(episode.id),
            clueId: c.id,
            foundIn: c.foundIn,
          });
        }
      }
    }
  }
  return out;
}

/** For a given (room, mysteryId, clueId) find the hotspot id +
 *  verb whose response carries a `mysteryBinding.cluesFound`
 *  containing the clueId. Returns null if no binding exists. */
function findBinding(
  roomId: string,
  mysteryId: string,
  clueId: string,
): { hotspotId: string; verb: Verb } | null {
  const mod = ROOM_MYSTERY_REGISTRY[roomId];
  if (!mod) return null;
  for (const [hotspotId, verbs] of Object.entries(mod.responses)) {
    if (!verbs) continue;
    for (const verb of ALL_VERBS) {
      const resp = verbs[verb];
      if (!resp?.mysteryBinding) continue;
      if (resp.mysteryBinding.mysteryId !== mysteryId) continue;
      if (resp.mysteryBinding.cluesFound.includes(clueId)) {
        return { hotspotId, verb };
      }
    }
  }
  return null;
}

describe("progression-critical clue runtime routability", () => {
  const clues = progressionCriticalClues();

  it("there are progression-critical clues to verify", () => {
    expect(clues.length).toBeGreaterThan(0);
  });

  for (const c of clues) {
    describe(`${c.mysteryId} @ ${c.episodeId} → ${c.clueId}`, () => {
      const binding = findBinding(c.foundIn, c.mysteryId, c.clueId);

      it(`is bound in foundIn room "${c.foundIn}"`, () => {
        expect(
          binding,
          `no hotspot in "${c.foundIn}" binds ${c.clueId} under mystery ${c.mysteryId}`,
        ).not.toBeNull();
      });

      it("the bound hotspot resolves through resolveVerbResponse with the clue credit", () => {
        if (!binding) return; // earlier assertion will have failed
        const mod = ROOM_MYSTERY_REGISTRY[c.foundIn];
        const resp = resolveVerbResponse(mod, binding.verb, binding.hotspotId);
        expect(resp).not.toBeNull();
        expect(resp!.mysteryBinding).toBeDefined();
        expect(resp!.mysteryBinding!.mysteryId).toBe(c.mysteryId);
        expect(resp!.mysteryBinding!.cluesFound).toContain(c.clueId);
      });

      it("the binding's episodeId references a real episode in the arc", () => {
        if (!binding) return;
        const mod = ROOM_MYSTERY_REGISTRY[c.foundIn];
        const resp = resolveVerbResponse(mod, binding.verb, binding.hotspotId);
        const arc = MYSTERY_DEFINITIONS.find(
          (a) => String(a.id) === c.mysteryId,
        );
        expect(arc, `arc ${c.mysteryId} in registry`).toBeDefined();
        const episodeId = String(resp!.mysteryBinding!.episodeId);
        const found = arc!.episodes.some((e) => String(e.id) === episodeId);
        expect(
          found,
          `binding episodeId "${episodeId}" not in ${c.mysteryId}'s episodes`,
        ).toBe(true);
      });
    });
  }
});
