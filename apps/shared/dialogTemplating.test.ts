import { describe, it, expect } from "vitest";
import {
  composeBranch,
  extractReferencedFlags,
  hasConditional,
  renderTemplate,
  renderTemplates,
} from "./dialogTemplating";

describe("renderTemplate — zero-cost path", () => {
  it("returns the input unchanged when there is no template syntax", () => {
    const t = "I remember Kael. I remember exactly where I was.";
    expect(renderTemplate(t, {})).toBe(t);
  });

  it("handles empty input", () => {
    expect(renderTemplate("", {})).toBe("");
  });
});

describe("renderTemplate — {if} blocks", () => {
  it("picks the if-branch when the flag is true", () => {
    const t = "Hello. {if act_2_complete}You finished it.{else}Not yet.{/if}";
    expect(renderTemplate(t, { act_2_complete: true })).toBe("Hello. You finished it.");
  });

  it("picks the else-branch when the flag is false/missing", () => {
    const t = "Hello. {if act_2_complete}You finished it.{else}Not yet.{/if}";
    expect(renderTemplate(t, {})).toBe("Hello. Not yet.");
    expect(renderTemplate(t, { act_2_complete: false })).toBe("Hello. Not yet.");
  });

  it("renders an empty string when no else and the flag is false", () => {
    const t = "He said it{if forgiveness_choice_made}, even after the trial{/if}.";
    expect(renderTemplate(t, {})).toBe("He said it.");
    expect(renderTemplate(t, { forgiveness_choice_made: true })).toBe(
      "He said it, even after the trial.",
    );
  });

  it("supports multiple sequential conditional blocks", () => {
    const t = "{if a}A{/if} - {if b}B{else}NB{/if}";
    expect(renderTemplate(t, { a: true, b: false })).toBe("A - NB");
    expect(renderTemplate(t, { a: false, b: true })).toBe(" - B");
  });
});

describe("renderTemplate — {flag:KEY} interpolation", () => {
  it("renders 'true' when the flag is set", () => {
    expect(renderTemplate("debug={flag:dev_mode}", { dev_mode: true })).toBe("debug=true");
  });

  it("renders an empty string when the flag is missing", () => {
    expect(renderTemplate("debug={flag:dev_mode}", {})).toBe("debug=");
  });
});

describe("renderTemplates", () => {
  it("renders every value of a bank against the same flag bag", () => {
    const bank = {
      pre: "Pre. {if act_2_complete}done{else}not yet{/if}.",
      post: "Post. {if act_2_complete}done{else}not yet{/if}.",
      static: "Same string.",
    };
    const out = renderTemplates(bank, { act_2_complete: true });
    expect(out.pre).toBe("Pre. done.");
    expect(out.post).toBe("Post. done.");
    expect(out.static).toBe("Same string.");
  });
});

describe("hasConditional", () => {
  it("detects {if} blocks", () => {
    expect(hasConditional("foo {if a}bar{/if}")).toBe(true);
  });

  it("detects {flag:} interpolation", () => {
    expect(hasConditional("foo {flag:a}")).toBe(true);
  });

  it("returns false for plain strings", () => {
    expect(hasConditional("plain string")).toBe(false);
    expect(hasConditional("")).toBe(false);
  });
});

describe("extractReferencedFlags", () => {
  it("returns every distinct flag referenced", () => {
    const t = "{if a}A{/if} {if b}B{/if} {flag:c} {if a}A again{/if}";
    expect(extractReferencedFlags(t).sort()).toEqual(["a", "b", "c"]);
  });

  it("returns an empty list for static lines", () => {
    expect(extractReferencedFlags("static")).toEqual([]);
  });
});

describe("composeBranch", () => {
  it("picks branch A when flagA is set", () => {
    const out = composeBranch(
      { branch_a: true, branch_b: true },
      "branch_a", "took A",
      "branch_b", "took B",
      "took neither",
    );
    expect(out).toBe("took A");
  });

  it("picks branch B when only flagB is set", () => {
    const out = composeBranch(
      { branch_b: true },
      "branch_a", "took A",
      "branch_b", "took B",
      "took neither",
    );
    expect(out).toBe("took B");
  });

  it("falls back when neither flag is set", () => {
    const out = composeBranch(
      {},
      "branch_a", "took A",
      "branch_b", "took B",
      "took neither",
    );
    expect(out).toBe("took neither");
  });

  it("recursively renders nested templates in the chosen branch", () => {
    const out = composeBranch(
      { branch_a: true, deep: true },
      "branch_a", "outer {if deep}inner-on{else}inner-off{/if}",
      "branch_b", "B",
      "fallback",
    );
    expect(out).toBe("outer inner-on");
  });
});
