<!-- version: 2026-05-08 -->

# Cookie Policy

**Effective date:** 2026-05-08

This Cookie Policy explains how Panopticus ("we," "us," "our")
uses cookies and similar storage technologies on The Dischordian
Saga and Loredex OS (the "Service"). It supplements our
[Privacy Policy](/privacy), which describes the personal
information we process and your rights over it.

## 1. What cookies and local storage are

A **cookie** is a small text file your browser stores on your
device when you visit a website. Cookies let the site recognise
you on later visits, keep you signed in, and remember your
preferences.

**Local storage** and **session storage** are similar
technologies built into your browser. They let a site save data
that does not travel with every request the way a cookie does.
We use a small amount of local storage for client-side
preferences and game-state caching, described below.

This policy treats both technologies the same way: we ask for
your consent only when applicable law requires it (broadly, for
non-essential storage that processes personal data).

## 2. Cookies we use

We use **one cookie** on the Service.

| Name | Purpose | Duration | Type | Third-party? |
|---|---|---|---|---|
| `loredex_session` | Keeps you signed in. Required to use any account-gated feature. | 1 year | Strictly necessary | No (set on our origin) |

The session cookie is set with the **HttpOnly**, **Secure**, and
**SameSite=Lax** attributes. That means JavaScript on the page
cannot read its value, the browser will only send it over HTTPS,
and it will not be sent on most cross-site requests, which
mitigates cross-site request forgery.

Strictly necessary cookies do not require consent under the
GDPR/UK-GDPR or the EU ePrivacy Directive because the Service
cannot function without them.

## 3. Local storage we use

We use browser local storage for client-side preferences and
caches that don't need to be on our servers. The keys we set are
all prefixed `loredex_`, `loredex-`, `dischordia_`, or `dmc_` and
include (non-exhaustive list):

- `loredex_session` (mirrors the cookie above on platforms where
  cookies are unavailable)
- `loredex_cookie_consent` (your choice in the consent banner)
- `loredex_last_login` (a friendly "welcome back" timestamp)
- `loredex_completed_tutorials`, `loredex_discovered`,
  `loredex_solved_puzzles`, `loredex_shown_discoveries` —
  one-time UI flags so we don't repeat tutorials or spoiler
  prompts.
- `loredex_sound_volume`, `loredex_sound_muted`,
  `loredex_tts_enabled`, `loredex_captions_enabled`,
  `dmc_music_muted`, `language` — your preferences.
- Per-act ladder and match caches:
  `loredex-act1-ladder`, `loredex-act3-ladder`,
  `loredex-act4-match`, `loredex-act6-ladder`,
  `loredex-act7-ladder`, `loredex-act1-c4-trial`,
  `loredex-vortex-incursion`, `loredex-memorable-moments` —
  recent local snapshots so resuming an act is fast.
- Cohort + analytics flags:
  `dischordian:cohort_reported`, `dischordian_seen_features`,
  `feature_unlocks_seen`, `chess_climb_mid_seen`,
  `chess_climb_promo_seen`, `chess_wins`,
  `collectors_arena_intro_seen`, `collectors_arena_lore_seen`,
  `companion_memorials`, `crew-strict-rivalries`,
  `dischordia_elo`, `dischordia_losses`, `dischordia_wins`,
  `dischordia_preferred_faction`, `dischordia_tutorial_complete`,
  `gm_arena_clones`, `loredex-show-hotspots`,
  `loredex_cinematic_seen`, `loredex_home_boot_seen`,
  `loredex_ftue_flags`, `loredex-settings`, `DRESSUP_V2`,
  `ark_orientation_complete` — feature-flag and "have I seen
  this?" markers for the new-player flow.

You can clear all of these at any time through your browser's
"Clear site data" controls. Doing so will sign you out and reset
your local UI preferences but will not affect your account on
our servers.

## 4. Third-party cookies

We do not set advertising cookies or social-network cookies on
our origin. We do not embed third-party tracking pixels.

The third-party services we use (listed in our Privacy Policy
Section 5 and at `/legal/vendors`) generally do not set cookies
on our origin:

- **Stripe Checkout** runs on Stripe's own domain; any cookies
  Stripe sets are on `checkout.stripe.com`, not on ours, and are
  governed by Stripe's policies.
- **Sentry** and **OpenTelemetry**, when enabled, communicate via
  JavaScript APIs and HTTP requests; they do not set cookies on
  our origin.
- **Google, Discord, and GitHub** OAuth flows redirect you to the
  identity provider's domain to sign in; any cookies set during
  that round-trip are on the provider's domain.

If a third-party cookie does ever land on our origin in the
future, we will list it here and re-prompt for consent if
required.

## 5. How to control cookies and local storage

You have several ways to control how cookies and local storage
are used on the Service:

- **Our consent banner.** When you first visit the Service,
  we show you a banner with two options: **"Essential only"**
  (we drop all non-essential storage and any analytics-style
  events) and **"Accept all"** (we may also collect pseudonymous
  analytics events as described in the Privacy Policy). To
  re-prompt the banner later, clear the
  `loredex_cookie_consent` value from local storage or call
  `clearCookieConsent()` from the browser console.
- **Your browser.** Every modern browser lets you block or
  delete cookies and clear local storage. The official help
  pages: [Chrome](https://support.google.com/chrome/answer/95647),
  [Firefox](https://support.mozilla.org/kb/clear-cookies-and-site-data-firefox),
  [Safari](https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac),
  [Edge](https://support.microsoft.com/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09).
  Note that disabling the `loredex_session` cookie will sign
  you out and prevent you from using account-gated features.
- **Do Not Track and Global Privacy Control.** We treat a clear
  signal of opt-out preference (such as the
  [Global Privacy Control](https://globalprivacycontrol.org/)
  header) as withdrawing analytics consent for the duration of
  that browser session.

## 6. Changes to this policy

We may update this Cookie Policy from time to time. The version
date at the top of this document indicates when it last changed.
If we add a new category of cookies or local storage that
requires consent, we will re-prompt you. Non-material updates
take effect on the date posted.

For questions about cookies, write to
privacy@dischordian-saga.com.
