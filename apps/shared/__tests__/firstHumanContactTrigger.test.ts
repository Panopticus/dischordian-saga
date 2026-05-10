import { describe, expect, it } from "vitest";
import {
  FIRST_HUMAN_CONTACT_SEEN_FLAG,
  FIRST_HUMAN_CONTACT_TRIGGER_FLAG,
  shouldFireFirstHumanContact,
} from "@/hooks/useFirstHumanContactTrigger";

describe("shouldFireFirstHumanContact", () => {
  it("fires when human trust crosses 10", () => {
    expect(
      shouldFireFirstHumanContact({ humanTrustLevel: 10, flags: {} }),
    ).toBe(true);
    expect(
      shouldFireFirstHumanContact({ humanTrustLevel: 25, flags: {} }),
    ).toBe(true);
  });

  it("does not fire when human trust is below 10 and bridge unvisited", () => {
    expect(
      shouldFireFirstHumanContact({ humanTrustLevel: 9, flags: {} }),
    ).toBe(false);
    expect(
      shouldFireFirstHumanContact({ humanTrustLevel: 0, flags: {} }),
    ).toBe(false);
  });

  it("fires on bridge visit even if trust is below 10", () => {
    expect(
      shouldFireFirstHumanContact({
        humanTrustLevel: 0,
        flags: { room_bridge_visited: true },
      }),
    ).toBe(true);
  });

  it("does not fire when the cutscene has already been seen", () => {
    expect(
      shouldFireFirstHumanContact({
        humanTrustLevel: 50,
        flags: { [FIRST_HUMAN_CONTACT_SEEN_FLAG]: true },
      }),
    ).toBe(false);
    expect(
      shouldFireFirstHumanContact({
        humanTrustLevel: 0,
        flags: {
          [FIRST_HUMAN_CONTACT_SEEN_FLAG]: true,
          room_bridge_visited: true,
        },
      }),
    ).toBe(false);
  });

  it("does not fire if the trigger is already set (avoids re-fire loops)", () => {
    expect(
      shouldFireFirstHumanContact({
        humanTrustLevel: 100,
        flags: { [FIRST_HUMAN_CONTACT_TRIGGER_FLAG]: true },
      }),
    ).toBe(false);
  });

  it("flag-name constants follow the documented convention", () => {
    expect(FIRST_HUMAN_CONTACT_TRIGGER_FLAG).toBe(
      "cutscene_first_human_contact_triggered",
    );
    expect(FIRST_HUMAN_CONTACT_SEEN_FLAG).toBe(
      "cutscene_first_human_contact_seen",
    );
  });
});
