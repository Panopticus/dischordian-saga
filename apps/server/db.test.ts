import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import { getDbWithRetry, type DrizzleDb } from "./db";

/**
 * Unit tests for getDbWithRetry — the bounded retry/backoff wrapper
 * around getDb(). Uses fake timers + an injectable resolveDb fn so
 * we can drive the retry sequence without touching mysql2 at all.
 */

const fakeDb = { __fakeDb__: true } as unknown as DrizzleDb;

describe("getDbWithRetry", () => {
  let prevDatabaseUrl: string | undefined;

  beforeEach(() => {
    prevDatabaseUrl = process.env.DATABASE_URL;
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    if (prevDatabaseUrl === undefined) {
      delete process.env.DATABASE_URL;
    } else {
      process.env.DATABASE_URL = prevDatabaseUrl;
    }
  });

  it("returns the resolved db on the first attempt without retrying", async () => {
    process.env.DATABASE_URL = "mysql://test";
    const resolveDb = vi.fn().mockResolvedValue(fakeDb);
    const result = await getDbWithRetry(4, 10, resolveDb);
    expect(result).toBe(fakeDb);
    expect(resolveDb).toHaveBeenCalledTimes(1);
  });

  it("retries up to maxAttempts and returns null on persistent failure", async () => {
    process.env.DATABASE_URL = "mysql://test";
    const resolveDb = vi.fn().mockResolvedValue(null);
    const promise = getDbWithRetry(3, 10, resolveDb);
    await vi.runAllTimersAsync();
    const result = await promise;
    expect(result).toBeNull();
    expect(resolveDb).toHaveBeenCalledTimes(3);
  });

  it("returns the db when it becomes available mid-retry", async () => {
    process.env.DATABASE_URL = "mysql://test";
    const resolveDb = vi
      .fn()
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(fakeDb);
    const promise = getDbWithRetry(4, 10, resolveDb);
    await vi.runAllTimersAsync();
    const result = await promise;
    expect(result).toBe(fakeDb);
    expect(resolveDb).toHaveBeenCalledTimes(3);
  });

  it("treats throws as a retryable failure (returns null after exhaustion)", async () => {
    process.env.DATABASE_URL = "mysql://test";
    const resolveDb = vi.fn().mockRejectedValue(new Error("boom"));
    const promise = getDbWithRetry(3, 10, resolveDb);
    await vi.runAllTimersAsync();
    const result = await promise;
    expect(result).toBeNull();
    expect(resolveDb).toHaveBeenCalledTimes(3);
  });

  it("does not retry when DATABASE_URL is unset (local-tooling mode)", async () => {
    delete process.env.DATABASE_URL;
    const resolveDb = vi.fn().mockResolvedValue(null);
    const result = await getDbWithRetry(4, 10, resolveDb);
    expect(result).toBeNull();
    expect(resolveDb).toHaveBeenCalledTimes(1);
  });

  it("uses exponential backoff between attempts (10ms, 20ms, 40ms)", async () => {
    process.env.DATABASE_URL = "mysql://test";
    const resolveDb = vi.fn().mockResolvedValue(null);
    const promise = getDbWithRetry(4, 10, resolveDb);

    // Attempt 1 runs immediately.
    await vi.advanceTimersByTimeAsync(0);
    expect(resolveDb).toHaveBeenCalledTimes(1);

    // After 10ms (base * 2^0), attempt 2 runs.
    await vi.advanceTimersByTimeAsync(10);
    expect(resolveDb).toHaveBeenCalledTimes(2);

    // After +20ms (base * 2^1), attempt 3 runs.
    await vi.advanceTimersByTimeAsync(20);
    expect(resolveDb).toHaveBeenCalledTimes(3);

    // After +40ms (base * 2^2), attempt 4 runs.
    await vi.advanceTimersByTimeAsync(40);
    expect(resolveDb).toHaveBeenCalledTimes(4);

    // Drain any final pending tasks and confirm the eventual null.
    await vi.runAllTimersAsync();
    const result = await promise;
    expect(result).toBeNull();
  });
});
