/**
 * Age verification page (audit/15.R4 — COPPA + GDPR-K).
 *
 * Mounted by the protected-route layer when the signed-in user has
 * not yet completed age verification (users.ageVerifiedAt is null).
 * The user submits a self-attested DOB; the server applies the EEA-16
 * vs global-13 rule based on edge-detected country (CF-IPCountry).
 *
 * Submitting an under-age DOB locks the account — there's no client-
 * side retry path. That's intentional: re-attempts with different
 * dates is a known abuse pattern.
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function AgeVerifyPage() {
  const status = trpc.account.getAgeVerificationStatus.useQuery();
  const submit = trpc.account.submitAgeVerification.useMutation();
  const [dob, setDob] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Already verified — render a tiny ack so the parent route knows
  // it's safe to redirect onward.
  if (status.data?.verified) {
    return (
      <main className="mx-auto max-w-md p-6 text-center" id="main-content">
        <h1 className="text-xl font-semibold">Age verified.</h1>
        <p className="mt-2 text-sm opacity-70">
          You may now continue to Loredex OS.
        </p>
      </main>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await submit.mutateAsync({ dateOfBirth: dob });
      void status.refetch();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Verification failed.";
      setError(msg);
    }
  };

  return (
    <main className="mx-auto max-w-md p-6" id="main-content">
      <h1 className="text-2xl font-semibold">Age verification</h1>
      <p className="mt-2 text-sm opacity-80">
        Loredex OS is for players who meet the minimum age in their
        jurisdiction. We need your date of birth before you can continue.
        Most countries: 13+. EU / EEA / UK: 16+.
      </p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-medium">Date of birth</span>
          <input
            type="date"
            required
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="mt-1 block w-full rounded border border-zinc-700 bg-zinc-950 p-2 text-sm"
            data-testid="age-verify-dob"
          />
        </label>
        {error && (
          <p
            role="alert"
            className="text-sm text-red-400"
            data-testid="age-verify-error"
          >
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={submit.isPending || !dob}
          className="w-full rounded bg-amber-600 p-2 text-sm font-medium text-black disabled:opacity-50"
          data-testid="age-verify-submit"
        >
          {submit.isPending ? "Verifying…" : "Continue"}
        </button>
        <p className="mt-2 text-xs opacity-60">
          We store your date of birth so we don't have to ask again. We
          don't share it. If you submit an age below the minimum for
          your country, your account will be locked — please don't try
          to bypass this with a fake date.
        </p>
      </form>
    </main>
  );
}
