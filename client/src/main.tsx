import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from '@shared/const';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import { toast } from "sonner";
import App from "./App";
import { getLoginUrl } from "./const";
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

/** Show user-facing feedback for common API error codes */
function handleApiError(error: unknown) {
  if (error instanceof TRPCClientError) {
    const code = error.data?.code;

    if (code === "UNAUTHORIZED") {
      toast.error("Session expired", {
        id: "session-expired",
        description: "Please sign in again to continue.",
        duration: 5000,
      });
      return;
    }

    if (code === "TOO_MANY_REQUESTS") {
      toast.warning("Slow down", {
        id: "rate-limited",
        description: "Too many requests — wait a moment and try again.",
        duration: 4000,
      });
      return;
    }

    if (code === "FORBIDDEN") {
      toast.error("Access denied", {
        id: "forbidden",
        description: "You don't have permission for this action.",
        duration: 4000,
      });
      return;
    }
  }
}

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    handleApiError(error);
    console.error("[API Query Error]", error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    handleApiError(error);
    console.error("[API Mutation Error]", error);
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
