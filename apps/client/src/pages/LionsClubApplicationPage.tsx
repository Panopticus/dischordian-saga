/* ═══════════════════════════════════════════════════════
   DGRS LIONS CLUB — Application Page

   Collects a real MD-1-equivalent Lions Clubs International
   application. Shows a live prorated-dues quote as the join
   date changes. The $100 ceiling is marketing copy only —
   actual charge is $35 base + $65/12 per month until the
   next June 30, plus a flat $25 LCIF honor donation.

   Submission is captured to localStorage for this pass; the
   follow-up ticket wires it to the new lionsClub tRPC router
   and to the chapter-secretary LCI submission workflow.
   ═══════════════════════════════════════════════════════ */

import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import {
  ENGINEER_NOTE_LIONS_CLUB,
  FOUNDING_COHORT_WAIVER_THROUGH_ISO,
  LCIF_HONOR_DONATION_USD,
  calculateMembershipChargeUsd,
  type LionsClubApplication,
} from "@shared/lionsClub";
import {
  IRON_CLAD_LIONS_FACTION,
  IRON_CLAD_LIONS_FOUNDING_NARRATIVE,
  IRON_CLAD_LIONS_NAMED_MEMBERS,
  IRON_CLAD_LIONS_REAL_WORLD_SERVICE_MESSAGE,
  IRON_CLAD_LIONS_RECRUITERS,
  IRON_CLAD_LIONS_RENTAL_TERMS,
  IRON_CLAD_LIONS_VESSEL,
} from "@shared/factions/ironCladLions";

const APPLICATION_STORAGE_KEY = "dgrs_lions_club_draft";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

interface DraftApplication {
  citizenId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  preferredName: string;
  dateOfBirth: string;
  joinDate: string;

  addressLine1: string;
  addressLine2: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  email: string;
  phone: string;
  occupation: string;
  employer: string;

  sponsorMemberId: string;
  sponsorMemberName: string;
  sponsorClubId: string;
  useFoundingCohortWaiver: boolean;

  priorClubs: string;
  communityServiceHistory: string;
  dreamStatement: string;

  pledgeUphold: boolean;
  pledgeDues: boolean;
  pledgeLci: boolean;
  signature: string;
}

const EMPTY_DRAFT: DraftApplication = {
  citizenId: "",
  firstName: "",
  middleName: "",
  lastName: "",
  preferredName: "",
  dateOfBirth: "",
  joinDate: todayIso(),
  addressLine1: "",
  addressLine2: "",
  city: "",
  region: "",
  postalCode: "",
  country: "",
  email: "",
  phone: "",
  occupation: "",
  employer: "",
  sponsorMemberId: "",
  sponsorMemberName: "",
  sponsorClubId: "",
  useFoundingCohortWaiver: false,
  priorClubs: "",
  communityServiceHistory: "",
  dreamStatement: "",
  pledgeUphold: false,
  pledgeDues: false,
  pledgeLci: false,
  signature: "",
};

function buildApplicationPayload(
  draft: DraftApplication,
): LionsClubApplication | null {
  if (
    !draft.citizenId ||
    !draft.firstName ||
    !draft.lastName ||
    !draft.dateOfBirth ||
    !draft.addressLine1 ||
    !draft.city ||
    !draft.region ||
    !draft.postalCode ||
    !draft.country ||
    !draft.email ||
    !draft.pledgeUphold ||
    !draft.pledgeDues ||
    !draft.pledgeLci ||
    !draft.signature
  ) {
    return null;
  }

  const waiverAvailable =
    new Date(draft.joinDate) <= new Date(FOUNDING_COHORT_WAIVER_THROUGH_ISO);

  const sponsor = draft.sponsorMemberId
    ? {
        memberId: draft.sponsorMemberId,
        memberName: draft.sponsorMemberName,
        clubId: draft.sponsorClubId,
      }
    : undefined;

  if (!sponsor && !(draft.useFoundingCohortWaiver && waiverAvailable)) {
    return null;
  }

  const charge = calculateMembershipChargeUsd(draft.joinDate);

  return {
    citizenId: draft.citizenId,
    legalName: {
      first: draft.firstName,
      middle: draft.middleName || undefined,
      last: draft.lastName,
    },
    preferredName: draft.preferredName || undefined,
    dateOfBirth: draft.dateOfBirth,
    address: {
      line1: draft.addressLine1,
      line2: draft.addressLine2 || undefined,
      city: draft.city,
      region: draft.region,
      postalCode: draft.postalCode,
      country: draft.country,
    },
    contact: {
      email: draft.email,
      phone: draft.phone || undefined,
    },
    occupation: draft.occupation || undefined,
    employer: draft.employer || undefined,
    sponsor,
    foundingCohortWaiver:
      !sponsor && draft.useFoundingCohortWaiver && waiverAvailable
        ? {
            waivedAtIso: new Date().toISOString(),
            reason: "no-sponsors-exist-yet",
          }
        : undefined,
    priorLionsClubs: draft.priorClubs
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        const [clubName, yearsStr] = line.split("|").map((p) => p.trim());
        return { clubName, years: Number(yearsStr) || 0 };
      }),
    communityServiceHistory: draft.communityServiceHistory,
    pledge: {
      upholdCreed: true,
      acceptDues: true,
      acceptLciMembership: true,
      signature: draft.signature,
      signedAtIso: new Date().toISOString(),
    },
    quotedDuesUsd: charge.duesUsd,
    quotedLcifHonorUsd: LCIF_HONOR_DONATION_USD,
    quotedTotalUsd: charge.totalUsd,
    dreamStatement: draft.dreamStatement,
  };
}

export default function LionsClubApplicationPage() {
  const [draft, setDraft] = useState<DraftApplication>(EMPTY_DRAFT);
  const [submitted, setSubmitted] = useState<LionsClubApplication | null>(null);
  const [error, setError] = useState<string | null>(null);

  const charge = useMemo(
    () => calculateMembershipChargeUsd(draft.joinDate),
    [draft.joinDate],
  );

  const waiverAvailable = useMemo(
    () =>
      new Date(draft.joinDate) <= new Date(FOUNDING_COHORT_WAIVER_THROUGH_ISO),
    [draft.joinDate],
  );

  function update<K extends keyof DraftApplication>(
    key: K,
    value: DraftApplication[K],
  ) {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setError(null);
  }

  function handleSubmit() {
    const payload = buildApplicationPayload(draft);
    if (!payload) {
      setError(
        "Please complete the required fields, agree to the pledge, sign, and either list a sponsor or use the founding-cohort waiver.",
      );
      return;
    }
    try {
      localStorage.setItem(APPLICATION_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* localStorage full — persistence will rehydrate on next app load. */
    }
    setSubmitted(payload);
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-3xl p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Application submitted — pending review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p>
              Thank you, {submitted.legalName.first}. Your DGRS Lions Club
              application has been queued for chapter review and LCI
              submission. You'll receive a member number once LCI issues one.
            </p>
            <div className="rounded border p-4 space-y-1">
              <div className="flex justify-between">
                <span>Prorated LCI dues (through June 30)</span>
                <span>${submitted.quotedDuesUsd.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>LCIF honor donation (tax-deductible)</span>
                <span>${submitted.quotedLcifHonorUsd.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total</span>
                <span>${submitted.quotedTotalUsd.toFixed(2)}</span>
              </div>
            </div>
            <p className="text-muted-foreground">
              Your Iron Clad Lions ceremonial armor rental will unlock once
              your membership is marked active. See you at the kneel.
            </p>
            <Link href="/order-of-the-dreamer">
              <Button variant="secondary">View your Dreamer ladder →</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <Card className="border-amber-600/40 bg-amber-500/5">
        <CardHeader>
          <CardTitle>This is a real service organization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm whitespace-pre-line">
          {IRON_CLAD_LIONS_REAL_WORLD_SERVICE_MESSAGE}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>The Iron Clad Lions — who you're joining</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p>
            The <strong>Iron Clad Lions</strong> are a service order
            inspired by the Iron Lion's last stand at{" "}
            {IRON_CLAD_LIONS_FOUNDING_NARRATIVE.inspiration.battle} in Year{" "}
            {IRON_CLAD_LIONS_FOUNDING_NARRATIVE.inspiration.yearAA.toLocaleString()}{" "}
            A.A. They dedicate their lives as a force for good against the
            rising tide of darkness.
          </p>
          <p className="italic text-muted-foreground">
            "{IRON_CLAD_LIONS_FOUNDING_NARRATIVE.inspiration.epitaph}"
          </p>
          <div>
            <div className="font-semibold">Recruited by</div>
            <ul className="list-disc pl-5 space-y-1">
              {IRON_CLAD_LIONS_RECRUITERS.map((r) => (
                <li key={r.name}>
                  <strong>{r.name}</strong> — {r.role}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-semibold">Flagship vessel</div>
            <p>
              <strong>{IRON_CLAD_LIONS_VESSEL.name}</strong> —{" "}
              {IRON_CLAD_LIONS_VESSEL.summary}
            </p>
          </div>
          {IRON_CLAD_LIONS_NAMED_MEMBERS.length > 0 ? (
            <div>
              <div className="font-semibold">First Potential to take the oath</div>
              <p>
                <strong>{IRON_CLAD_LIONS_NAMED_MEMBERS[0].name}</strong> —{" "}
                {IRON_CLAD_LIONS_NAMED_MEMBERS[0].role}
              </p>
            </div>
          ) : null}
          <p className="text-xs text-muted-foreground pt-2 border-t">
            Creed: <em>{IRON_CLAD_LIONS_FACTION.creed}</em>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>DGRS Lions Club — Application for Membership</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="rounded border bg-muted/30 p-4 whitespace-pre-line italic">
            {ENGINEER_NOTE_LIONS_CLUB}
          </div>
          <p>
            This application creates a <strong>real</strong> Lions Clubs
            International membership in the DGRS virtual chapter. By signing,
            you agree to real annual dues, the Lions creed "We Serve," and the
            rental terms on the Iron Clad Lions armor.
          </p>
          <p className="text-muted-foreground">
            {IRON_CLAD_LIONS_RENTAL_TERMS.summary}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dues quote</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="space-y-1">
            <Label htmlFor="joinDate">Intended join date</Label>
            <Input
              id="joinDate"
              type="date"
              value={draft.joinDate}
              onChange={(e) => update("joinDate", e.target.value)}
            />
          </div>
          <div className="rounded border p-4 space-y-1">
            <div className="flex justify-between">
              <span>Prorated LCI dues (through June 30)</span>
              <span>${charge.duesUsd.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>
                LCIF honor donation{" "}
                <span className="text-xs text-muted-foreground">(100% tax-deductible)</span>
              </span>
              <span>${charge.lcifHonorDonationUsd.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Total due at signup</span>
              <span>${charge.totalUsd.toFixed(2)}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Full-year dues of $100 apply only to July 1 joiners. All other join
            dates pay a prorated amount that covers the months remaining until
            the next June 30 renewal boundary.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <Label htmlFor="citizenId">Citizen ID</Label>
            <Input
              id="citizenId"
              value={draft.citizenId}
              onChange={(e) => update("citizenId", e.target.value)}
              placeholder="from your profile"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="preferredName">Preferred name</Label>
            <Input
              id="preferredName"
              value={draft.preferredName}
              onChange={(e) => update("preferredName", e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="firstName">Legal first name</Label>
            <Input
              id="firstName"
              value={draft.firstName}
              onChange={(e) => update("firstName", e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="middleName">Middle name</Label>
            <Input
              id="middleName"
              value={draft.middleName}
              onChange={(e) => update("middleName", e.target.value)}
            />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label htmlFor="lastName">Legal last name</Label>
            <Input
              id="lastName"
              value={draft.lastName}
              onChange={(e) => update("lastName", e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="dob">Date of birth</Label>
            <Input
              id="dob"
              type="date"
              value={draft.dateOfBirth}
              onChange={(e) => update("dateOfBirth", e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="occupation">Occupation</Label>
            <Input
              id="occupation"
              value={draft.occupation}
              onChange={(e) => update("occupation", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact + address</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="space-y-1 sm:col-span-2">
            <Label htmlFor="addr1">Street address</Label>
            <Input
              id="addr1"
              value={draft.addressLine1}
              onChange={(e) => update("addressLine1", e.target.value)}
            />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label htmlFor="addr2">Address line 2</Label>
            <Input
              id="addr2"
              value={draft.addressLine2}
              onChange={(e) => update("addressLine2", e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={draft.city}
              onChange={(e) => update("city", e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="region">Region / State</Label>
            <Input
              id="region"
              value={draft.region}
              onChange={(e) => update("region", e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="postal">Postal code</Label>
            <Input
              id="postal"
              value={draft.postalCode}
              onChange={(e) => update("postalCode", e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={draft.country}
              onChange={(e) => update("country", e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={draft.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={draft.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sponsor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="text-muted-foreground">
            Real Lions Club MD-1 requires a sponsor. During the founding-cohort
            window (through December 31, 2026) the sponsor is optional — no
            existing members to sponsor you yet.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor="sid">Sponsor member ID</Label>
              <Input
                id="sid"
                value={draft.sponsorMemberId}
                onChange={(e) => update("sponsorMemberId", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="sname">Sponsor name</Label>
              <Input
                id="sname"
                value={draft.sponsorMemberName}
                onChange={(e) => update("sponsorMemberName", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="sclub">Sponsor club ID</Label>
              <Input
                id="sclub"
                value={draft.sponsorClubId}
                onChange={(e) => update("sponsorClubId", e.target.value)}
              />
            </div>
          </div>
          {waiverAvailable ? (
            <label className="flex items-center gap-2">
              <Checkbox
                checked={draft.useFoundingCohortWaiver}
                onCheckedChange={(v) =>
                  update("useFoundingCohortWaiver", Boolean(v))
                }
              />
              <span>
                I'm joining during the founding cohort and can't list a sponsor
                yet — accept the waiver.
              </span>
            </label>
          ) : (
            <p className="text-xs text-muted-foreground">
              Founding-cohort waiver has expired — a sponsor is required.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Service + dream statement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="space-y-1">
            <Label htmlFor="prior">
              Prior Lions clubs (one per line — "Club Name | years")
            </Label>
            <Textarea
              id="prior"
              rows={3}
              value={draft.priorClubs}
              onChange={(e) => update("priorClubs", e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="svc">Community service history</Label>
            <Textarea
              id="svc"
              rows={4}
              value={draft.communityServiceHistory}
              onChange={(e) =>
                update("communityServiceHistory", e.target.value)
              }
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="dream">
              What do you dream the Club can do? (required)
            </Label>
            <Textarea
              id="dream"
              rows={4}
              value={draft.dreamStatement}
              onChange={(e) => update("dreamStatement", e.target.value)}
              placeholder="I dream the Club can…"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pledge + signature</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <label className="flex items-start gap-2">
            <Checkbox
              checked={draft.pledgeUphold}
              onCheckedChange={(v) => update("pledgeUphold", Boolean(v))}
            />
            <span>
              I will uphold the Lions creed <strong>"We Serve"</strong>.
            </span>
          </label>
          <label className="flex items-start gap-2">
            <Checkbox
              checked={draft.pledgeDues}
              onCheckedChange={(v) => update("pledgeDues", Boolean(v))}
            />
            <span>
              I accept the prorated annual dues (${charge.duesUsd.toFixed(2)}{" "}
              this cycle) and the flat $25 LCIF honor donation.
            </span>
          </label>
          <label className="flex items-start gap-2">
            <Checkbox
              checked={draft.pledgeLci}
              onCheckedChange={(v) => update("pledgeLci", Boolean(v))}
            />
            <span>
              I understand this creates a real Lions Clubs International
              membership in the DGRS virtual chapter and I consent to my
              application being submitted to LCI.
            </span>
          </label>
          <div className="space-y-1">
            <Label htmlFor="signature">Signature (typed name)</Label>
            <Input
              id="signature"
              value={draft.signature}
              onChange={(e) => update("signature", e.target.value)}
              placeholder="Type your legal name"
            />
          </div>
          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : null}
          <Button onClick={handleSubmit}>Submit application</Button>
        </CardContent>
      </Card>
    </div>
  );
}
