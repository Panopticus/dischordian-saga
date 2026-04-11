/* ═══════════════════════════════════════════════════════
   ERROR TOAST STORE (Zustand) — Task 4.2

   Central store for user-visible error notifications.
   Sits on top of the existing `sonner` infrastructure —
   not a replacement, but a structured log that lets us:

   1. De-duplicate identical errors (network blip storms
      no longer spam the same message 20 times).
   2. Keep a recent-errors buffer for admin tooling.
   3. Dispatch from non-React code (tRPC error link,
      WebSocket onerror handlers, global error handlers)
      via `useErrorToastStore.getState().report(...)`.

   Usage from React code:
     useErrorToastStore(s => s.errors)   // subscribe
     useErrorToastStore.getState().report("Save failed")

   Usage from plain code (e.g. trpc error link):
     import { reportError } from "@/stores/errorToastStore";
     reportError("Server error: timeout");
   ═══════════════════════════════════════════════════════ */

import { create } from "zustand";
import { toast } from "sonner";

export type ErrorSeverity = "error" | "warning" | "info";

export interface ErrorToast {
  id: string;
  message: string;
  /** Optional longer description shown under the title. */
  description?: string;
  severity: ErrorSeverity;
  /** Monotonic ms timestamp when the error was first reported. */
  timestamp: number;
  /** Dedupe key — same key within dedupeWindowMs is ignored. */
  dedupeKey?: string;
  /** Optional source tag for admin tooling (e.g. "trpc:rpc.applyMoralityChoice"). */
  source?: string;
}

interface ErrorToastStore {
  /** Most recent errors, capped at MAX_BUFFER. */
  errors: ErrorToast[];
  /** Dedupe window map: key → last report timestamp. */
  dedupeMap: Record<string, number>;

  /** Record an error and (unless silent) show a sonner toast. */
  report: (input: ReportErrorInput) => void;
  /** Remove an error from the buffer by id. */
  dismiss: (id: string) => void;
  /** Clear the entire buffer. */
  clear: () => void;
}

export interface ReportErrorInput {
  message: string;
  description?: string;
  severity?: ErrorSeverity;
  dedupeKey?: string;
  source?: string;
  /** If true, record but don't show a sonner toast. */
  silent?: boolean;
}

const MAX_BUFFER = 20;
const DEFAULT_DEDUPE_WINDOW_MS = 5_000;

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const useErrorToastStore = create<ErrorToastStore>((set, get) => ({
  errors: [],
  dedupeMap: {},

  report: ({ message, description, severity = "error", dedupeKey, source, silent }) => {
    const now = Date.now();
    const state = get();

    // Dedupe: if the same key was reported inside the window, skip.
    if (dedupeKey) {
      const last = state.dedupeMap[dedupeKey];
      if (last && now - last < DEFAULT_DEDUPE_WINDOW_MS) return;
    }

    const entry: ErrorToast = {
      id: makeId(),
      message,
      description,
      severity,
      timestamp: now,
      dedupeKey,
      source,
    };

    const nextErrors = [entry, ...state.errors].slice(0, MAX_BUFFER);
    const nextDedupeMap = dedupeKey
      ? { ...state.dedupeMap, [dedupeKey]: now }
      : state.dedupeMap;

    set({ errors: nextErrors, dedupeMap: nextDedupeMap });

    if (silent) return;

    // Forward to sonner so the existing UI just works.
    const toastFn =
      severity === "warning" ? toast.warning
      : severity === "info" ? toast.info
      : toast.error;

    toastFn(message, description ? { description } : undefined);
  },

  dismiss: (id) => set((s) => ({ errors: s.errors.filter((e) => e.id !== id) })),

  clear: () => set({ errors: [], dedupeMap: {} }),
}));

/* ─── SELECTORS ─── */

export const selectErrors = (s: ErrorToastStore) => s.errors;
export const selectRecentErrors = (s: ErrorToastStore) => s.errors.slice(0, 5);
export const selectHasErrors = (s: ErrorToastStore) => s.errors.length > 0;

/* ─── PLAIN-FUNCTION SHORTHAND ─── */

/**
 * Report an error from non-React code (tRPC error links, WS onerror,
 * plain utility functions). Equivalent to:
 *   useErrorToastStore.getState().report({ message, ... })
 */
export function reportError(message: string, opts?: Omit<ReportErrorInput, "message">) {
  useErrorToastStore.getState().report({ message, ...opts });
}

export function reportWarning(message: string, opts?: Omit<ReportErrorInput, "message" | "severity">) {
  useErrorToastStore.getState().report({ message, severity: "warning", ...opts });
}

export function reportInfo(message: string, opts?: Omit<ReportErrorInput, "message" | "severity">) {
  useErrorToastStore.getState().report({ message, severity: "info", ...opts });
}
