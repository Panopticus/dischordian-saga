import { describe, expect, it } from "vitest";

import {
  type ActiveEdit,
  type ActiveEdits,
  activeEditsInRoom,
  clearEdit,
  countActiveEdits,
  EMPTY_ACTIVE_EDITS,
  isEditActive,
  makeEditId,
  parseActiveEdits,
  recordEdit,
  serializeActiveEdits,
} from "./shadowTongueEdits";

const archivesLectern: ActiveEdit = {
  id: "archives_lectern",
  room: "archives",
  artifact: "lectern",
  type: "rewrite",
  createdAt: 1000,
  uncorruptedAt: null,
};

const engineeringReactor: ActiveEdit = {
  id: "engineering_reactor",
  room: "engineering",
  artifact: "reactor",
  type: "scrub",
  createdAt: 1100,
  uncorruptedAt: null,
};

describe("shadowTongueEdits — pure helpers", () => {
  it("EMPTY_ACTIVE_EDITS is empty and frozen", () => {
    expect(Object.keys(EMPTY_ACTIVE_EDITS).length).toBe(0);
    expect(Object.isFrozen(EMPTY_ACTIVE_EDITS)).toBe(true);
  });

  it("makeEditId composes <room>_<artifact>", () => {
    expect(makeEditId("archives", "lectern")).toBe("archives_lectern");
    expect(makeEditId("engineering", "reactor")).toBe("engineering_reactor");
  });

  describe("isEditActive", () => {
    it("returns false for null/empty/missing", () => {
      expect(isEditActive(null, "archives_lectern")).toBe(false);
      expect(isEditActive(undefined, "archives_lectern")).toBe(false);
      expect(isEditActive({}, "archives_lectern")).toBe(false);
    });
    it("returns true for an active edit", () => {
      const edits: ActiveEdits = { archives_lectern: archivesLectern };
      expect(isEditActive(edits, "archives_lectern")).toBe(true);
    });
    it("returns false once an edit is uncorrupted", () => {
      const cleared = clearEdit(
        { archives_lectern: archivesLectern },
        "archives_lectern",
        2000,
      );
      expect(isEditActive(cleared, "archives_lectern")).toBe(false);
    });
  });

  describe("countActiveEdits", () => {
    it("counts only active edits", () => {
      let edits: ActiveEdits = {};
      edits = recordEdit(edits, archivesLectern);
      edits = recordEdit(edits, engineeringReactor);
      expect(countActiveEdits(edits)).toBe(2);
      edits = clearEdit(edits, "archives_lectern", 2000);
      expect(countActiveEdits(edits)).toBe(1);
      edits = clearEdit(edits, "engineering_reactor", 2100);
      expect(countActiveEdits(edits)).toBe(0);
    });
    it("returns 0 for null/empty", () => {
      expect(countActiveEdits(null)).toBe(0);
      expect(countActiveEdits(undefined)).toBe(0);
      expect(countActiveEdits({})).toBe(0);
    });
  });

  describe("activeEditsInRoom", () => {
    it("scopes to room and ignores cleared edits", () => {
      let edits: ActiveEdits = {};
      edits = recordEdit(edits, archivesLectern);
      edits = recordEdit(edits, engineeringReactor);
      expect(activeEditsInRoom(edits, "archives").map((e) => e.id)).toEqual([
        "archives_lectern",
      ]);
      expect(
        activeEditsInRoom(edits, "engineering").map((e) => e.id),
      ).toEqual(["engineering_reactor"]);
      const cleared = clearEdit(edits, "archives_lectern", 2000);
      expect(activeEditsInRoom(cleared, "archives")).toEqual([]);
    });
  });

  describe("recordEdit", () => {
    it("does not mutate the input", () => {
      const before: ActiveEdits = {};
      const after = recordEdit(before, archivesLectern);
      expect(before).toEqual({});
      expect(after.archives_lectern).toEqual(archivesLectern);
    });

    it("preserves prior createdAt when re-editing an active edit", () => {
      const start = recordEdit({}, archivesLectern);
      const reEdit: ActiveEdit = { ...archivesLectern, createdAt: 9999 };
      const next = recordEdit(start, reEdit);
      // ST does not get to reset his own timestamp.
      expect(next.archives_lectern.createdAt).toBe(1000);
    });

    it("replaces a previously-cleared edit cleanly (re-corruption)", () => {
      const start = recordEdit({}, archivesLectern);
      const cleared = clearEdit(start, "archives_lectern", 2000);
      const recorrupted: ActiveEdit = {
        ...archivesLectern,
        createdAt: 3000,
      };
      const next = recordEdit(cleared, recorrupted);
      expect(next.archives_lectern.createdAt).toBe(3000);
      expect(next.archives_lectern.uncorruptedAt).toBe(null);
    });
  });

  describe("clearEdit", () => {
    it("flips uncorruptedAt and is idempotent", () => {
      const start = recordEdit({}, archivesLectern);
      const once = clearEdit(start, "archives_lectern", 2000);
      const twice = clearEdit(once, "archives_lectern", 9999);
      expect(once.archives_lectern.uncorruptedAt).toBe(2000);
      expect(twice.archives_lectern.uncorruptedAt).toBe(2000); // first wins
    });
    it("no-ops on unknown id", () => {
      const start = recordEdit({}, archivesLectern);
      const next = clearEdit(start, "does_not_exist", 2000);
      expect(next).toBe(start);
    });
    it("does not mutate input", () => {
      const start = recordEdit({}, archivesLectern);
      clearEdit(start, "archives_lectern", 2000);
      expect(start.archives_lectern.uncorruptedAt).toBe(null);
    });
  });
});

describe("shadowTongueEdits — DB JSON parsing", () => {
  it("parseActiveEdits returns empty for null/undefined/non-object", () => {
    expect(parseActiveEdits(null)).toEqual({});
    expect(parseActiveEdits(undefined)).toEqual({});
    expect(parseActiveEdits([])).toEqual({});
    expect(parseActiveEdits("not an object")).toEqual({});
    expect(parseActiveEdits(42)).toEqual({});
  });

  it("parseActiveEdits round-trips a valid map", () => {
    const map: ActiveEdits = recordEdit({}, archivesLectern);
    const json = JSON.parse(JSON.stringify(serializeActiveEdits(map)));
    expect(parseActiveEdits(json)).toEqual(map);
  });

  it("parseActiveEdits drops malformed entries silently", () => {
    const raw = {
      archives_lectern: archivesLectern,
      malformed: { foo: "bar" }, // missing required fields
      bad_type: { ...archivesLectern, type: "invalid" },
      mismatched_id: { ...archivesLectern, id: "different_id" },
    };
    const parsed = parseActiveEdits(raw);
    expect(Object.keys(parsed)).toEqual(["archives_lectern"]);
  });

  it("parseActiveEdits accepts uncorruptedAt as null or number", () => {
    const cleared: ActiveEdit = {
      ...archivesLectern,
      uncorruptedAt: 5000,
    };
    const raw = { archives_lectern: cleared };
    const parsed = parseActiveEdits(raw);
    expect(parsed.archives_lectern.uncorruptedAt).toBe(5000);
  });

  it("serializeActiveEdits is JSON-safe", () => {
    let edits: ActiveEdits = {};
    edits = recordEdit(edits, archivesLectern);
    edits = recordEdit(edits, engineeringReactor);
    edits = clearEdit(edits, "archives_lectern", 2000);
    const json = JSON.stringify(serializeActiveEdits(edits));
    const reparsed = parseActiveEdits(JSON.parse(json));
    expect(reparsed).toEqual(edits);
  });
});
