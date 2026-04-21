import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from '@shared/const';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import { getLoginUrl } from "./const";
import { reportError } from "@/stores/errorToastStore";
import "./i18n"; // Initialize i18n before app renders
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000, // 30 seconds before data is considered stale
      gcTime: 5 * 60_000, // 5 minutes garbage collection
      refetchOnWindowFocus: false, // Don't refetch on tab focus
      retry: 1, // Only retry once on failure
    },
  },
});

const redirectToLoginIfUnauthorized = (_error: unknown) => {
  // Auth gating is now handled by AuthGate in App.tsx — no hard redirect needed.
  // Unauthenticated users see TitlePage with a sign-in button.
};

/**
 * Task 4.2 — Surface tRPC errors as user-visible toasts.
 *
 * Previously these cache subscribers just console.error'd, so every
 * server error was silent to the player. Now they dispatch into the
 * error toast store (which fans out to sonner for display and keeps a
 * rotating buffer for admin tooling). We skip expected cases:
 *
 *   - UNAUTHORIZED: handled by AuthGate; spamming a toast on every
 *     unauthed query would be noise.
 *   - Duplicate messages inside a 5 s window: deduped by the store.
 *
 * The `source` tag includes the tRPC path when available so admin
 * tooling can filter by "which endpoint is exploding".
 */
function humanizeTRPCError(error: unknown): { message: string; description?: string; path?: string; code?: string } {
  if (error instanceof TRPCClientError) {
    const path = error.data?.path ? String(error.data.path) : undefined;
    const code = error.data?.code ? String(error.data.code) : undefined;
    // Never show the raw zod "Invalid input" dump — it's not player-facing.
    const message = code === "BAD_REQUEST"
      ? "The server rejected that request. Please try again."
      : error.message || "Something went wrong on the server.";
    return { message, description: path, path, code };
  }
  if (error instanceof Error) return { message: error.message };
  return { message: "Unknown error" };
}

// F2/F7 — boot-time read endpoints that legitimately return NOT_FOUND or
// throw on empty rows for brand-new users. These are boot noise, not real
// errors. Mutations on these same paths still surface.
const SILENT_BOOT_PATHS = new Set<string>([
  "citizen.getCharacter",
  "citizen.getDreamBalance",
  "quests.getLoginCalendar",
  "quests.getDailyQuests",
  "wallet.getBalance",
  "loredex.getProgress",
  "crew.list",
  "specimens.list",
  "deck.getStarter",
]);

// Queries that fail during the very first seconds of a session are almost
// always the cold-boot race. Suppress NOT_FOUND for the first 5s then let
// everything through normally.
const BOOT_START = Date.now();
const BOOT_GRACE_MS = 5_000;

function inBootGrace(): boolean {
  return Date.now() - BOOT_START < BOOT_GRACE_MS;
}

function shouldSurfaceQueryError(code?: string, path?: string): boolean {
  if (code === "UNAUTHORIZED" || code === "FORBIDDEN") return false;
  if (code === "NOT_FOUND" && path && SILENT_BOOT_PATHS.has(path)) return false;
  if (code === "NOT_FOUND" && inBootGrace()) return false;
  return true;
}

function shouldSurfaceMutationError(code?: string): boolean {
  if (code === "UNAUTHORIZED" || code === "FORBIDDEN") return false;
  return true;
}

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Query Error]", error);
    const info = humanizeTRPCError(error);
    if (shouldSurfaceQueryError(info.code, info.path)) {
      reportError(info.message, {
        description: info.description,
        dedupeKey: `trpc-query:${info.path ?? "unknown"}:${info.code ?? "unknown"}`,
        source: `trpc:query:${info.path ?? "unknown"}`,
      });
    }
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Mutation Error]", error);
    const info = humanizeTRPCError(error);
    if (shouldSurfaceMutationError(info.code)) {
      reportError(info.message, {
        description: info.description,
        dedupeKey: `trpc-mutation:${info.path ?? "unknown"}:${info.code ?? "unknown"}`,
        source: `trpc:mutation:${info.path ?? "unknown"}`,
      });
    }
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);
