# AR1 — External Webhook Trigger for Mystery Seeds

**Status:** design proposal awaiting sign-off. Drafted for audit/16
PR 38 candidacy. Closes audit/15 finding **AR1** ("Zero external
trigger surfaces — every mystery seed compiles deterministically
at boot").

> The user explicitly held this finding back from the audit/16 sprint:
> "do everything except the AR1 - you need to explain that one to me
> before i sign off on it." This document is that explanation.

## What the audit asked for

> "New `external_webhook` trigger kind + `apps/server/routers/externalSignals.ts` POST `/signal/:webhookId`"

The **why** is ARG-persona-canonical. ARGs need out-of-game triggers.
A puzzle published in a real-world venue (blog post, podcast drop,
in-person event) needs to be able to nudge the in-game state when
players solve it IRL. Today every `MysterySeed` source is
server-internal:

```
type MysterySeedSource =
  | "epoch_vote_closure"        // governance vote closes
  | "anniversary"               // a date hits
  | "living_universe_pattern"   // pressure threshold trips
  | "npc_arc"                   // arc compilation at boot
  | "manual"                    // architect's console
```

There is no way for an external producer (e.g., a community manager
posting a puzzle answer on a blog) to fire a mystery seed. The audit
flagged this as the saga's biggest ARG-substrate gap.

## Why this needs sign-off, not just implementation

External webhooks open a **non-trivial security + governance surface**
that the other audit findings don't. Specifically:

### 1. Authentication is non-optional

Without auth, anyone can `curl` the endpoint and spam seed
compilations. The minimum bar is HMAC-SHA256 of `(timestamp | nonce
| body)` against a per-webhook secret. That means:

- A `webhook_configs` table holding `(webhookId, hmacSecret,
  templateId, ratelimitPerHour, isActive, createdByAdminId,
  rotatedAt)`
- The HMAC secret is provisioned manually via the Architect's
  Console and never returned by any read-side API after creation
  (the admin copies it once at create time)
- Rotation policy: secrets rotate on demand (admin action) or
  automatically every 90 days

### 2. Replay attacks must be blocked

A captured POST (e.g., from a leaky MITM, a webhook log
exfiltrated by a partner) must NOT be replayable. The signed body
includes:

- `timestamp` (UTC seconds; rejected if > 5 min old)
- `nonce` (random 16-byte string; rejected if seen in the last hour
  via a `seen_nonces` table with a TTL index)

### 3. Determinism vs the replay system

The card-engine replay pipeline requires deterministic state — same
`(seed, actions, rulesVersion)` always produces the same final
state hash. Mystery state is in a different audit-boundary today
(it's player-side narrative, not match-side gameplay), but webhooks
introduce a reproducibility question: if I'm running a vote-closure
cron and a webhook fires mid-tick, which seed wins?

**Resolution:** webhook fires never mutate active match state.
They produce NEW `MysterySeed` rows, queued onto the same
`mystery_closure_cron` pass that already serializes seed → definition
compilation. The cron is single-writer; the queue is FIFO; the
existing snapshot-on-close invariant (the AR3 substrate) handles
mid-flight state.

### 4. Per-player vs global routing

Two distinct ARG patterns the runtime must support:

- **Global**: "Alice published the IRL clue on day 47; the saga's
  next mystery cycle should compile a `programmer.ARG.day47` seed."
  The webhook fires once; the seed lands once; every player
  experiences the same consequent mystery.
- **Per-player**: "Bob solved the real-world cipher and tweeted
  the answer at our hashtag; HIS account should get the
  `programmer.ARG.bob_tweet` seed." The webhook fires with a
  player identifier in the body; only that player sees the new
  arc.

The substrate needs to express both. My proposal: the webhook
config carries a `routingMode: "global" | "per_player"` enum. When
`per_player`, the body MUST include a `playerId` field (signed in
the HMAC body); the seed compiles into the player's individual
mystery-progress slot. When `global`, the seed compiles into the
shared mystery registry.

### 5. Rate-limit + abuse policy

Even with auth, a compromised secret means infinite seed
compilation. Three layers of cap:

- **Per-webhook**: configurable in `webhook_configs.ratelimitPerHour`.
  Default 10/hour. Production webhooks for community ARGs run
  ~1-3/hour; gameplay-critical webhooks rarely hit the cap.
- **Global webhook surface**: 200 fires/hour aggregated across all
  webhooks. Hard ceiling; no admin override.
- **Mystery-seed-compilation cap**: the existing `mysteryClosureCron`
  is already rate-limited by its own pass cadence; webhook fires
  inherit that cadence.

### 6. Auditability

Every webhook fire MUST be persistable in
`external_signal_log` for forensics:

- `webhookId`, `firedAt`, `bodyHash`, `nonce`, `outcome` (one of:
  `seed_compiled` / `rate_limited` / `auth_failed` / `template_not_found`)
- `compiledSeedId` when the fire produced a seed (FK to
  `mystery_seeds`)
- `requestIp` (truncated to /24 for IPv4, /48 for IPv6 to balance
  abuse-tracking with PII budget)

The Architect's Console gets a "External Signals" tab that
streams from this log. Misfires (admin determines) can be
soft-deleted; the deletion is itself logged.

### 7. Reversibility

Webhook-spawned mysteries get an `originatingWebhookId` field on
the `MysteryDefinition` so:
- The Architect's Console can list all mysteries that came from a
  given webhook (useful when rotating a compromised secret)
- A misfired seed can be retracted before its closure cron pass
  picks it up
- A misfired *closed* mystery can be soft-deleted with the same
  admin tooling that handles vote-closure rollbacks today

## Concrete substrate this PR would ship (if approved)

If you sign off, the PR I'd ship looks like this — **schema-only,
matching the pattern of the other AR PRs in this sprint**:

### apps/shared/mysteryTypes.ts (additive)

```ts
export type MysterySeedSource =
  | "epoch_vote_closure"
  | "anniversary"
  | "living_universe_pattern"
  | "npc_arc"
  | "manual"
  | "external_webhook";   // NEW

// New companion type — payload shape for external_webhook seeds.
export interface ExternalWebhookSeedPayload {
  webhookId: string;
  /** Present iff routingMode === "per_player". */
  playerId?: string;
  /** Body fields the template's compile function reads. */
  fields: Readonly<Record<string, unknown>>;
}
```

### apps/db/schema.ts (additive)

Three new tables, all bootstrapped via the existing
`bootstrap*Tables` IIFE pattern (migration journal is drifted):

- `external_webhook_configs` — `(webhookId, hmacSecret, templateId,
  routingMode, ratelimitPerHour, isActive, createdByAdminId,
  rotatedAt, createdAt, updatedAt)`. **The hmacSecret column is
  excluded from every read-side API response.**
- `external_signal_log` — append-only audit log
- `external_signal_nonces` — TTL'd nonce-seen set for replay
  protection (rows expire after 1 hour)

### apps/shared/externalWebhookValidation.ts (pure)

- `verifyHmac(rawBody, header, secret, now): VerifyResult` — returns
  `{ ok: true, parsed }` or `{ ok: false, reason: "bad_signature" |
  "stale_timestamp" | "replay" | "malformed" }`
- `WEBHOOK_TIMESTAMP_TOLERANCE_SEC = 300` — the 5-minute window
- Pure (no DB, no I/O); the router-side handler combines it with
  the nonce-seen check + the rate-limit check

### Tests

- HMAC verification (positive + every failure mode)
- Stale-timestamp rejection
- Routing-mode validation (per_player must carry playerId; global
  must not)
- Nonce-replay protection logic (pure, against an injected
  "seen-nonce" set)

### What this PR would NOT ship

- The router. **The router is its own follow-up PR**, audit-trail-
  reviewable in isolation. The substrate lands first; you review
  the actual receiver in a separate change knowing the schema is
  already in place.
- The Architect's Console UI for managing webhook configs
- Per-template payload validation (each `templateId` defines its
  own contract; out of scope for the substrate)

## Trade-offs you're signing off on

If you approve, you're saying yes to:

| Trade-off | What you get | What you accept |
|-----------|--------------|-----------------|
| Real ARG support | Out-of-game triggers can produce in-game mysteries | A new public POST endpoint requiring HMAC auth + nonce + timestamp validation |
| Per-player ARG arcs | "Player X solved the IRL puzzle" can produce a seed for that player only | The webhook config includes a routing-mode enum; per-player webhooks must include `playerId` in the signed body |
| Auditability + reversibility | Every fire logged; admin can retract a misfire | A new `external_signal_log` table grows over time (TTL trim policy is a follow-up) |
| Governance | Only an admin (via the Architect's Console) can create / rotate webhook configs | The HMAC secret is shown once at creation; anyone losing it requires a rotation |
| Rate-limiting | Per-webhook + global caps | The default cap is 10/hour per webhook; some real ARGs may push that ceiling and need bumps |

## What would happen if we DON'T ship this

The saga can't run real ARGs in the canon-supported sense. Every
puzzle stays in-game; community managers can't bridge the two
worlds. The audit's other ARG findings (AR3 / AR7 / AR8) all assume
this surface eventually exists; without it, AR3's
`playerInfluenceGates` can react to in-game flag changes but not to
out-of-game producer events.

## Reviewer questions for you

I'd like explicit answers on these before I write the substrate
code, because they shape the schema:

1. **Routing mode default**: should `routingMode` default to
   `global` or `per_player`? My recommendation: **global**, because
   per-player requires careful body validation that admins might
   skip on first authoring.

2. **HMAC secret rotation**: do you want forced rotation on a
   schedule (e.g., every 90 days), admin-on-demand only, or no
   built-in rotation policy? My recommendation: **admin-on-demand
   only initially**, with a monitoring surface that highlights
   secrets older than 90 days as a soft warning. Forced rotation
   adds operational burden that may not be worth the security
   delta for a low-volume surface.

3. **Per-webhook rate-limit configurability**: should the cap be
   editable via the Architect's Console after creation, or
   immutable? My recommendation: **editable**, because real ARGs'
   volume is hard to predict and a misconfiguration shouldn't
   require recreating the webhook (which would invalidate the
   secret).

4. **External signal log retention**: how long do we keep rows in
   `external_signal_log`? My recommendation: **365 days, then
   archive to cold storage**. The forensic value drops sharply
   after a year; the table will get large if we keep it forever.

5. **First-fire validation**: should a newly-created webhook
   require an admin-initiated test fire (validating the secret +
   the template) before going live, or trust the admin to know
   what they're doing? My recommendation: **require a test fire**
   that's logged but doesn't compile a real seed (a "dry run"
   mode in the verify path). Cheap insurance against
   misconfiguration.

## What I need from you

A "yes / no / yes-with-changes" on the design, plus answers to
the five reviewer questions above. With sign-off, I write the
substrate as a single PR matching the pattern of AR3 / AR7 / AR8.

If you'd rather discuss any of the trade-offs before deciding,
that's fine — flag the specific row in the trade-off table or the
specific reviewer question and we can talk through it.
