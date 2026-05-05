import { describe, it, expect } from "vitest";
import { DEFAULT_LISTS, detectPii, filterMessage } from "./profanityFilter";

describe("detectPii", () => {
  it("flags email addresses", () => {
    const r = detectPii("contact me at racho@example.com please");
    expect(r.found).toBe(true);
    expect(r.kinds).toContain("email");
  });

  it("flags phone-like numbers", () => {
    const r = detectPii("call +1 555-867-5309");
    expect(r.found).toBe(true);
    expect(r.kinds).toContain("phone");
  });

  it("flags SSN-shaped strings", () => {
    const r = detectPii("ssn 123-45-6789");
    expect(r.found).toBe(true);
    expect(r.kinds).toContain("ssn");
  });

  it("does not flag clean text", () => {
    expect(detectPii("hey are you ready for the match").found).toBe(false);
  });
});

describe("filterMessage — PII", () => {
  it("flags 'pii' alongside other flags without blocking", () => {
    const r = filterMessage("text me at 555-123-4567!!!!");
    expect(r.blocked).toBe(false);
    expect(r.flags).toContain("pii");
  });
});

describe("filterMessage — clean text", () => {
  it("passes a normal sentence unchanged", () => {
    const r = filterMessage("Hey friends, ready for a match?");
    expect(r.blocked).toBe(false);
    expect(r.flags).toEqual([]);
    expect(r.sanitized).toBe("Hey friends, ready for a match?");
  });

  it("does not trip on benign substrings (no false positive on Scunthorpe)", () => {
    const r = filterMessage("scunthorpe is a real place");
    expect(r.blocked).toBe(false);
    expect(r.flags).toEqual([]);
  });
});

describe("filterMessage — blocked", () => {
  it("blocks slurs from the default list", () => {
    const r = filterMessage("you are a faggot");
    expect(r.blocked).toBe(true);
    expect(r.flags).toContain("blocked");
    expect(r.evidence.blocked).toContain("faggot");
  });

  it("blocks leetspeak slurs (1 → i, 0 → o, 4 → a)", () => {
    const r = filterMessage("n1gg3r");
    expect(r.blocked).toBe(true);
    expect(r.evidence.blocked).toContain("nigger");
  });

  it("blocks even when separated by punctuation", () => {
    const r = filterMessage("f.a.g.g.o.t");
    expect(r.blocked).toBe(true);
  });

  it("blocked short-circuits — does not mask or flag caps", () => {
    const r = filterMessage("RETARD!!!! WHAT");
    expect(r.blocked).toBe(true);
    expect(r.flags).toEqual(["blocked"]);
  });
});

describe("filterMessage — masking", () => {
  it("masks mild profanity but does not block", () => {
    const r = filterMessage("what the fuck");
    expect(r.blocked).toBe(false);
    expect(r.flags).toContain("masked");
    expect(r.sanitized).toBe("what the ****");
    expect(r.evidence.masked).toContain("fuck");
  });

  it("masks multiple distinct profanities in one message", () => {
    const r = filterMessage("shit dick");
    expect(r.flags).toContain("masked");
    expect(r.sanitized).toBe("**** ****");
    expect(r.evidence.masked).toEqual(expect.arrayContaining(["shit", "dick"]));
  });

  it("masks leet variants (sh1t → ****)", () => {
    const r = filterMessage("oh sh1t");
    expect(r.flags).toContain("masked");
    expect(r.sanitized).toBe("oh ****");
  });
});

describe("filterMessage — caps", () => {
  it("flags excess caps and normalises", () => {
    const r = filterMessage("THIS IS COMPLETELY UNACCEPTABLE");
    expect(r.flags).toContain("caps");
    expect(r.sanitized).not.toBe("THIS IS COMPLETELY UNACCEPTABLE");
    expect(r.sanitized).toMatch(/^This Is Completely Unacceptable$/);
  });

  it("does not flag short shouty messages (under threshold)", () => {
    const r = filterMessage("GG");
    expect(r.flags).not.toContain("caps");
  });
});

describe("filterMessage — spam runs", () => {
  it("flags 4+ repeat chars and compresses to 3", () => {
    const r = filterMessage("yessssss");
    expect(r.flags).toContain("spam");
    expect(r.sanitized).toBe("yesss");
  });

  it("does not flag 3 repeats", () => {
    const r = filterMessage("nooo");
    expect(r.flags).not.toContain("spam");
    expect(r.sanitized).toBe("nooo");
  });
});

describe("filterMessage — URLs", () => {
  it("flags https links", () => {
    const r = filterMessage("check this out https://example.com/page");
    expect(r.flags).toContain("url");
    expect(r.evidence.url[0]).toContain("example.com");
  });

  it("flags bare domains", () => {
    const r = filterMessage("see twitch.gg today");
    expect(r.flags).toContain("url");
  });

  it("does not flag .com inside a word with no preceding space", () => {
    const r = filterMessage("welcome");
    expect(r.flags).not.toContain("url");
  });
});

describe("filterMessage — combinations", () => {
  it("masks profanity AND flags caps in the same message", () => {
    const r = filterMessage("WHAT THE FUCK IS HAPPENING");
    expect(r.blocked).toBe(false);
    expect(r.flags).toContain("masked");
    expect(r.flags).toContain("caps");
  });

  it("preserves clean tail when only one word is masked", () => {
    const r = filterMessage("fuck this card meta");
    expect(r.sanitized).toBe("**** this card meta");
  });
});

describe("filterMessage — custom lists", () => {
  it("uses caller-provided lists, ignores defaults", () => {
    const r = filterMessage("ducky", { blocked: ["ducky"], masked: [] });
    expect(r.blocked).toBe(true);
  });

  it("DEFAULT_LISTS is shaped right", () => {
    expect(DEFAULT_LISTS.blocked.length).toBeGreaterThan(0);
    expect(DEFAULT_LISTS.masked.length).toBeGreaterThan(0);
  });
});
