/* ═══════════════════════════════════════════════════════
   ORDER OF THE DREAMER — LCIF donation ladder page

   Year-round donation ladder: $100/level, 100% to LCIF.
   Ten trophy tiers at every 10th level, five progress badges
   at 1/5/25/50/75. Level-100 piece is a one-of-one mythic
   engraved with the donor's chosen name.

   This page simulates the full donation flow client-side
   (state in localStorage) for QA. The follow-up ticket wires
   submissions to the dreamer tRPC router + the real payment
   path, with 100% of each $100 routing to LCIF.
   ═══════════════════════════════════════════════════════ */

import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  DREAMER_DOLLARS_PER_LEVEL,
  DREAMER_MAX_LEVEL,
  DREAMER_PROGRESS_BADGES,
  DREAMER_TIERS,
  calculateLevelFromTotalUsd,
  createEmptyDreamerProfile,
  getMythicInscriptionPrompt,
  nextTierLevel,
  trophiesNewlyCrossed,
  type DreamerProfile,
} from "@shared/dreamerOrder";
import { IRON_CLAD_LIONS_REAL_WORLD_SERVICE_MESSAGE } from "@shared/factions/ironCladLions";

const DRAFT_STORAGE_KEY = "dgrs_dreamer_profile";
const DEFAULT_CITIZEN_ID = "local-preview";

function loadProfile(): DreamerProfile {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return createEmptyDreamerProfile(DEFAULT_CITIZEN_ID);
    const parsed = JSON.parse(raw) as DreamerProfile;
    return parsed;
  } catch {
    return createEmptyDreamerProfile(DEFAULT_CITIZEN_ID);
  }
}

function saveProfile(profile: DreamerProfile) {
  try {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    /* ignore */
  }
}

export default function OrderOfTheDreamerPage() {
  const [profile, setProfile] = useState<DreamerProfile>(() => loadProfile());
  const [donationInput, setDonationInput] = useState<string>("100");
  const [engraveName, setEngraveName] = useState<string>("");

  const nextLevelThreshold = useMemo(
    () => nextTierLevel(profile.currentLevel),
    [profile.currentLevel],
  );

  function donate() {
    const raw = Number(donationInput);
    if (!Number.isFinite(raw) || raw <= 0) return;
    // Floor to a whole multiple of the $100 tick so every level
    // increment is one full LCIF donation.
    const dollars =
      Math.floor(raw / DREAMER_DOLLARS_PER_LEVEL) * DREAMER_DOLLARS_PER_LEVEL;
    if (dollars <= 0) return;

    const newTotal = profile.totalLcifDonatedUsd + dollars;
    const newLevel = calculateLevelFromTotalUsd(newTotal);
    const { trophies, badges } = trophiesNewlyCrossed(
      profile.currentLevel,
      newLevel,
    );

    const next: DreamerProfile = {
      ...profile,
      currentLevel: newLevel,
      totalLcifDonatedUsd: newTotal,
      unlockedTrophyIds: [...profile.unlockedTrophyIds, ...trophies],
      unlockedBadgeIds: [...profile.unlockedBadgeIds, ...badges],
    };
    setProfile(next);
    saveProfile(next);
  }

  function engraveMythic() {
    const trimmed = engraveName.trim();
    if (!trimmed || profile.currentLevel < DREAMER_MAX_LEVEL) return;
    const next: DreamerProfile = {
      ...profile,
      mythicEngraving: {
        engravedName: trimmed,
        engravedAtIso: new Date().toISOString(),
      },
    };
    setProfile(next);
    saveProfile(next);
    setEngraveName("");
  }

  function resetProfile() {
    const fresh = createEmptyDreamerProfile(DEFAULT_CITIZEN_ID);
    setProfile(fresh);
    saveProfile(fresh);
  }

  return (
    <div className="mx-auto max-w-4xl p-6 space-y-6">
      <Card className="void-border void-bg-sunk">
        <CardHeader>
          <CardTitle>This is a real service organization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm whitespace-pre-line">
          {IRON_CLAD_LIONS_REAL_WORLD_SERVICE_MESSAGE}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order of the Dreamer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p>
            100 levels. $100 per level. <strong>100% of each donation
            routes to LCIF</strong> (Lions Clubs International Foundation).
            These donations are fully tax-deductible in supported
            jurisdictions — we'll email a receipt.
          </p>
          <p className="text-muted-foreground">
            Iron Clad Lion members see every Dreamer tier's effect magnitude
            <strong> doubled</strong> at resolution time. Tier climb rate is
            the same — $100 is $100.
          </p>
          <div className="rounded border p-4 grid grid-cols-1 sm:grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-xs text-muted-foreground">Current level</div>
              <div className="text-2xl font-semibold">
                {profile.currentLevel} / {DREAMER_MAX_LEVEL}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">
                Total LCIF donated
              </div>
              <div className="text-2xl font-semibold">
                ${profile.totalLcifDonatedUsd.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Next tier</div>
              <div className="text-2xl font-semibold">
                {nextLevelThreshold ?? "—"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Donate to climb</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="space-y-1">
            <Label htmlFor="donation">
              Donation amount (multiples of ${DREAMER_DOLLARS_PER_LEVEL})
            </Label>
            <Input
              id="donation"
              type="number"
              min={DREAMER_DOLLARS_PER_LEVEL}
              step={DREAMER_DOLLARS_PER_LEVEL}
              value={donationInput}
              onChange={(e) => setDonationInput(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={donate}>Donate + credit ladder</Button>
            <Button variant="ghost" onClick={resetProfile}>
              Reset (local preview)
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Preview flow only. Production build wires this to the payment
            processor — 100% of each $100 tick routes to LCIF.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trophy tiers</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {DREAMER_TIERS.map((tier) => {
            const unlocked = profile.currentLevel >= tier.unlocksAtLevel;
            return (
              <div
                key={tier.trophyId}
                className={`rounded border p-3 ${
                  unlocked
                    ? "void-border void-bg-sunk"
                    : "opacity-60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{tier.trophyName}</div>
                    <div className="text-xs text-muted-foreground">
                      Unlocks at level {tier.unlocksAtLevel}
                      {tier.isMythicOneOfOne ? " — Mythic (1-of-1)" : ""}
                    </div>
                  </div>
                  <div className="text-xs">{unlocked ? "✓" : "—"}</div>
                </div>
                {tier.effects.length > 0 ? (
                  <ul className="mt-2 text-xs space-y-0.5">
                    {tier.effects.map((e) => (
                      <li key={e.id}>• {e.label}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Progress badges</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-sm">
          {DREAMER_PROGRESS_BADGES.map((badge) => {
            const unlocked = profile.currentLevel >= badge.level;
            return (
              <div
                key={badge.badgeId}
                className={`rounded border p-3 text-center ${
                  unlocked
                    ? "void-border void-bg-sunk"
                    : "opacity-60"
                }`}
              >
                <div className="font-semibold">{badge.badgeName}</div>
                <div className="text-xs text-muted-foreground">
                  Lv {badge.level}
                </div>
                <div className="text-xs">{unlocked ? "✓" : "—"}</div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mythic engraving (level 100)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {profile.currentLevel < DREAMER_MAX_LEVEL ? (
            <p className="text-muted-foreground">
              Reach level 100 to engrave your Dreamer's Mirror. One mythic per
              citizen, ever.
            </p>
          ) : profile.mythicEngraving ? (
            <div className="space-y-2">
              <p>
                The Dreamer's Mirror has been engraved:{" "}
                <strong>{profile.mythicEngraving.engravedName}</strong>.
              </p>
              <details>
                <summary className="cursor-pointer text-xs text-muted-foreground">
                  Art prompt preview
                </summary>
                <pre className="mt-2 whitespace-pre-wrap text-xs bg-muted/30 p-2 rounded">
                  {getMythicInscriptionPrompt(
                    profile.mythicEngraving.engravedName,
                  )}
                </pre>
              </details>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="engrave">Engraved name</Label>
              <Input
                id="engrave"
                value={engraveName}
                onChange={(e) => setEngraveName(e.target.value)}
              />
              <Button onClick={engraveMythic}>Engrave the Dreamer's Mirror</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Link href="/lions-club/apply">
        <Button variant="secondary">
          Join DGRS Lions Club to double every tier effect →
        </Button>
      </Link>
    </div>
  );
}
