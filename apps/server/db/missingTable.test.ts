import { describe, it, expect } from "vitest";

import { isMissingTableError } from "./missingTable";

describe("isMissingTableError", () => {
  it("returns false for null / undefined / non-objects", () => {
    expect(isMissingTableError(null)).toBe(false);
    expect(isMissingTableError(undefined)).toBe(false);
    expect(isMissingTableError("just a string")).toBe(false);
    expect(isMissingTableError(42)).toBe(false);
  });

  it("detects MySQL errno 1146 directly", () => {
    expect(isMissingTableError({ errno: 1146 })).toBe(true);
  });

  it("detects code ER_NO_SUCH_TABLE", () => {
    expect(isMissingTableError({ code: "ER_NO_SUCH_TABLE" })).toBe(true);
  });

  it("detects \"doesn't exist\" in sqlMessage", () => {
    expect(
      isMissingTableError({
        sqlMessage: "Table 'railway.vote_options' doesn't exist",
      }),
    ).toBe(true);
  });

  it("peels drizzle's DrizzleQueryError wrapper to find the cause", () => {
    const drizzleStyle = {
      message: "Failed query: select ...",
      cause: { code: "ER_NO_SUCH_TABLE", errno: 1146 },
    };
    expect(isMissingTableError(drizzleStyle)).toBe(true);
  });

  it("does not false-positive on other MySQL errors", () => {
    expect(isMissingTableError({ code: "ER_DUP_ENTRY", errno: 1062 })).toBe(false);
    expect(isMissingTableError({ message: "Connection lost" })).toBe(false);
  });
});
