import { getGoogleLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { TRPCClientError } from "@trpc/client";
import { useCallback, useEffect, useMemo } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

/**
 * Cached `me` payload used to bypass the loading flash on warm boots.
 * The first paint can render TitleGate immediately with this stale data
 * while the real auth.me round-trip reconciles in the background. The
 * server still validates every authed mutation via the cookie, so
 * staleness here is purely a UX optimization, not a security boundary.
 *
 * Typed as the exact shape of the live `auth.me` result so consumers
 * (DashboardLayout, TitlePage, etc.) keep their narrowed access — a
 * raw `unknown` cache would collapse `user` to `{}`.
 */
const CACHED_ME_KEY = "loredex_cached_me_v1";

function readCachedMe<T>(): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CACHED_ME_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeCachedMe<T>(data: T | null): void {
  if (typeof window === "undefined") return;
  try {
    if (data === null) {
      window.localStorage.removeItem(CACHED_ME_KEY);
    } else {
      window.localStorage.setItem(CACHED_ME_KEY, JSON.stringify(data));
    }
  } catch { /* storage full or disabled */ }
}

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = getGoogleLoginUrl() } =
    options ?? {};
  const utils = trpc.useUtils();

  const meQuery = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Mirror the live `auth.me` result into localStorage so subsequent
  // boots can render with optimistic user data and skip the PageLoader
  // flash. We only persist successful resolutions (data or null) — never
  // errors, which could be transient.
  useEffect(() => {
    if (meQuery.isLoading) return;
    if (meQuery.error) return;
    writeCachedMe(meQuery.data ?? null);
  }, [meQuery.data, meQuery.error, meQuery.isLoading]);

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      utils.auth.me.setData(undefined, null);
    },
  });

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error: unknown) {
      if (
        error instanceof TRPCClientError &&
        error.data?.code === "UNAUTHORIZED"
      ) {
        return;
      }
      throw error;
    } finally {
      utils.auth.me.setData(undefined, null);
      writeCachedMe(null);
      await utils.auth.me.invalidate();
    }
  }, [logoutMutation, utils]);

  const state = useMemo(() => {
    // Optimistic boot: while auth.me is in flight on a warm session,
    // fall back to whatever we cached on the previous successful resolve
    // so the title screen can paint immediately. Once the live request
    // resolves (success OR explicit null), we trust it absolutely —
    // staleness here would otherwise show a logged-out user as logged
    // in. We only consult the cache while meQuery is still loading.
    type MeData = typeof meQuery.data;
    const stillLoading = meQuery.isLoading;
    const cachedUser = stillLoading ? readCachedMe<NonNullable<MeData>>() : null;
    const effectiveUser: MeData | null = stillLoading
      ? (cachedUser ?? null)
      : (meQuery.data ?? null);
    const stillResolving = stillLoading && cachedUser === null;
    return {
      user: effectiveUser,
      loading: stillResolving || logoutMutation.isPending,
      error: meQuery.error ?? logoutMutation.error ?? null,
      isAuthenticated: Boolean(effectiveUser),
    };
  }, [
    meQuery.data,
    meQuery.error,
    meQuery.isLoading,
    logoutMutation.error,
    logoutMutation.isPending,
  ]);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (meQuery.isLoading || logoutMutation.isPending) return;
    if (state.user) return;
    if (typeof window === "undefined") return;
    if (window.location.pathname === redirectPath) return;

    window.location.href = redirectPath
  }, [
    redirectOnUnauthenticated,
    redirectPath,
    logoutMutation.isPending,
    meQuery.isLoading,
    state.user,
  ]);

  return {
    ...state,
    refresh: () => meQuery.refetch(),
    logout,
  };
}
