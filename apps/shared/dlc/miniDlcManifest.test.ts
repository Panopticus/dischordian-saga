import { describe, it, expect } from "vitest";
import {
  REQUIRED_MINI_DLC_REFS,
  validateMiniDlcManifest,
  type MiniDlcManifest,
} from "./miniDlcManifest";

const VALID: MiniDlcManifest = {
  id: "dlc_test_01",
  title: "Test DLC",
  sealRequired: null,
  yearlyAffinity: "foundation_day",
  moodImpact: { conquest: 0.05 },
  newMysterySeed: { seedId: "test.mystery.01" },
  newTransmissionTrack: { trackId: "T_TEST", albumKey: "T_TEST" },
  newCustomItem: { itemId: "test.item.01", assetSlug: "test/item.png" },
  newGuildContract: { contractKey: "test.contract.01", summary: "Test." },
  newGovernanceMotion: { motionKey: "test_motion_01" },
};

describe("validateMiniDlcManifest", () => {
  it("passes a manifest carrying all five required refs", () => {
    expect(validateMiniDlcManifest(VALID)).toEqual([]);
  });

  it("flags every missing required ref", () => {
    const missing = validateMiniDlcManifest({
      id: "x",
      title: "x",
      sealRequired: null,
      yearlyAffinity: null,
      moodImpact: {},
    } as Partial<MiniDlcManifest>);
    for (const key of REQUIRED_MINI_DLC_REFS) {
      expect(missing).toContain(String(key));
    }
  });

  it("flags empty-object refs (a key with no fields)", () => {
    const broken: Partial<MiniDlcManifest> = {
      ...VALID,
      newMysterySeed: {} as never,
    };
    expect(validateMiniDlcManifest(broken)).toEqual(["newMysterySeed"]);
  });

  it("requires id and title", () => {
    expect(validateMiniDlcManifest({ ...VALID, id: "" })).toContain("id");
    expect(
      validateMiniDlcManifest({ ...VALID, title: "" } as Partial<MiniDlcManifest>),
    ).toContain("title");
  });
});

describe("REQUIRED_MINI_DLC_REFS", () => {
  it("names the five canonical surfaces", () => {
    expect(REQUIRED_MINI_DLC_REFS).toEqual([
      "newMysterySeed",
      "newTransmissionTrack",
      "newCustomItem",
      "newGuildContract",
      "newGovernanceMotion",
    ]);
  });
});
