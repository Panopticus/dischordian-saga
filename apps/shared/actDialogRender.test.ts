import { describe, it, expect } from "vitest";
import { renderActDialog, renderActDialogBank } from "./actDialogRender";

describe("renderActDialog — backward compatibility", () => {
  it("renders a static dialog object to itself (every field unchanged)", () => {
    const dialog = {
      opponentId: "test_opponent",
      engineerMemoirIntro: "I was six. The notebook was blue.",
      elaraPreMatch: "I remember this chant.",
      humanPreMatch: "Memes are the oldest predators.",
    };
    const out = renderActDialog(dialog, {});
    expect(out).toEqual(dialog);
  });

  it("preserves non-string fields (ids, numbers, undefined)", () => {
    const dialog = {
      opponentId: "test_opponent",
      attemptCount: 3,
      tauntVoIds: { early: "vo_a", mid: "vo_b", late: "vo_c" },
      missingField: undefined,
    };
    const out = renderActDialog(dialog, { foo: true });
    expect(out.attemptCount).toBe(3);
    expect(out.tauntVoIds).toEqual({ early: "vo_a", mid: "vo_b", late: "vo_c" });
    expect(out.missingField).toBeUndefined();
  });
});

describe("renderActDialog — flag-driven variants", () => {
  it("substitutes {if flag} blocks against the flag bag", () => {
    const dialog = {
      opponentId: "test",
      elaraPreMatch:
        "I voted with one of them. {if forgiveness_choice_made}You'd have voted differently.{else}I would do it again.{/if}",
    };
    const onWith = renderActDialog(dialog, { forgiveness_choice_made: true });
    expect(onWith.elaraPreMatch).toContain("You'd have voted differently");

    const onWithout = renderActDialog(dialog, {});
    expect(onWithout.elaraPreMatch).toContain("I would do it again");
  });

  it("supports multiple distinct flag references in one string", () => {
    const dialog = {
      opponentId: "test",
      humanPostMatchWin:
        "{if act_2_complete}You're past it now. {/if}{if forgiveness_choice_made}And you forgave him.{/if}",
    };
    const out = renderActDialog(dialog, {
      act_2_complete: true,
      forgiveness_choice_made: true,
    });
    expect(out.humanPostMatchWin).toBe("You're past it now. And you forgave him.");
  });
});

describe("renderActDialogBank", () => {
  it("renders every entry in a registry against the same flag bag", () => {
    const bank = {
      a: { opponentId: "a", line: "{if x}A on{else}A off{/if}" },
      b: { opponentId: "b", line: "{if x}B on{else}B off{/if}" },
    };
    const out = renderActDialogBank(bank, { x: true });
    expect(out.a.line).toBe("A on");
    expect(out.b.line).toBe("B on");
  });

  it("preserves the registry keys exactly", () => {
    const bank = {
      "minnie_meme": { id: "minnie_meme", line: "static" },
      "corey_collector": { id: "corey_collector", line: "static" },
    };
    const out = renderActDialogBank(bank, {});
    expect(Object.keys(out).sort()).toEqual(["corey_collector", "minnie_meme"]);
  });
});
