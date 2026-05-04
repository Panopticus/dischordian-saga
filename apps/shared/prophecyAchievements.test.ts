import { describe, expect, it } from "vitest";
import {
  PROPHECY_ACHIEVEMENTS,
  evaluateAchievements,
  getProphecyAchievementById,
  type ProphecyProgress,
} from "./prophecyAchievements";
import { PROPHECY_VISIONS } from "./prophecyVisionMap";

const empty: ProphecyProgress = {
  marqueesCompleted: new Set(),
  indexViewed: new Set(),
  albumFilmsCompleted: new Set(),
  postAct7: false,
};

describe("prophecyAchievements — Witness ladder", () => {
  it("registers per-album witness, film witness, archivist + the two global tiers", () => {
    const kinds = PROPHECY_ACHIEVEMENTS.map((a) => a.kind);
    expect(kinds).toContain("album_witness");
    expect(kinds).toContain("album_film_witness");
    expect(kinds).toContain("album_archivist");
    expect(kinds).toContain("full_tapestry");
    expect(kinds).toContain("antiquarians_codex");
  });

  it("ids are unique", () => {
    const ids = PROPHECY_ACHIEVEMENTS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("nothing is satisfied for an empty player", () => {
    expect(evaluateAchievements(empty)).toEqual([]);
  });

  it("Album Witness fires when all marquees in one album are complete", () => {
    const album = "book-of-daniel";
    const albumMarquees = PROPHECY_VISIONS.filter(
      (v) => v.albumSlug === album && v.intensity === "marquee",
    );
    if (albumMarquees.length === 0) return;
    const earned = evaluateAchievements({
      ...empty,
      marqueesCompleted: new Set(albumMarquees.map((v) => v.id)),
    });
    const witness = earned.find((a) => a.id === "ach_album_witness_book_of_daniel");
    expect(witness).toBeTruthy();
  });

  it("Album Film Witness fires from a film completion alone", () => {
    const earned = evaluateAchievements({
      ...empty,
      albumFilmsCompleted: new Set(["dischordian-logic"]),
    });
    const film = earned.find(
      (a) => a.id === "ach_album_film_witness_dischordian_logic",
    );
    expect(film).toBeTruthy();
  });

  it("Full Tapestry fires when every marquee is completed across albums", () => {
    const allMarquees = PROPHECY_VISIONS.filter((v) => v.intensity === "marquee");
    const earned = evaluateAchievements({
      ...empty,
      marqueesCompleted: new Set(allMarquees.map((v) => v.id)),
    });
    expect(earned.find((a) => a.id === "ach_full_tapestry")).toBeTruthy();
  });

  it("Antiquarian's Codex requires postAct7 + every Whisper viewed + every film", () => {
    const allMarquees = PROPHECY_VISIONS.filter((v) => v.intensity === "marquee");
    const allLongTail = PROPHECY_VISIONS.filter(
      (v) => v.intensity !== "marquee",
    );
    const allAlbums = new Set([
      "dischordian-logic",
      "age-of-privacy",
      "book-of-daniel",
      "west-by-god",
      "silence-in-heaven",
    ] as const);

    // Without postAct7 — should not fire even with everything else.
    const denied = evaluateAchievements({
      marqueesCompleted: new Set(allMarquees.map((v) => v.id)),
      indexViewed: new Set(allLongTail.map((v) => v.id)),
      albumFilmsCompleted: allAlbums,
      postAct7: false,
    });
    expect(denied.find((a) => a.id === "ach_antiquarians_codex")).toBeFalsy();

    // With postAct7 — should fire.
    const earned = evaluateAchievements({
      marqueesCompleted: new Set(allMarquees.map((v) => v.id)),
      indexViewed: new Set(allLongTail.map((v) => v.id)),
      albumFilmsCompleted: allAlbums,
      postAct7: true,
    });
    expect(earned.find((a) => a.id === "ach_antiquarians_codex")).toBeTruthy();
  });

  it("Full Tapestry side-effect declares fnord_unlocked", () => {
    const fullTapestry = getProphecyAchievementById("ach_full_tapestry");
    expect(fullTapestry?.sideEffects).toContain("fnord_unlocked");
  });
});
