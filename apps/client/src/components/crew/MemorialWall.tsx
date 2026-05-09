/* ═══════════════════════════════════════════════════════
   MEMORIAL WALL — The names we remember
   ═══════════════════════════════════════════════════════ */

import { useMemo } from "react";
import { Skull, Crown, BookOpen } from "lucide-react";
import { FOUNDING_BLOODLINES, type BloodlineId } from "@/game/crewGenetics";
import type { CrewState, SerializedCrewMember } from "@shared/crewPersistence";
import { SPECTRAL_ART } from "@/data/nanobanna2Assets";
import { CREW_SPECIES_TO_SPECTRAL, pickSpectralForId } from "../spectralFormMap";
import { THE_ASSISTANT_CARD } from "@shared/darrenMemorial";
import { trpc } from "@/lib/trpc";

interface Props {
  state: CrewState;
}

interface BloodlineGraveyardEntry {
  bloodlineId: BloodlineId;
  name: string;
  color: string;
  founder: SerializedCrewMember | null;
  livingCount: number;
  deadCount: number;
  lastMemberLost: SerializedCrewMember | null;
}

export default function MemorialWall({ state }: Props) {
  const deceased = state.roster.deceased;
  const memorialOnlyQuery = trpc.loredexCarry.getMemorialOnly.useQuery();
  const memberNameByKey = useMemo(() => {
    const m = new Map<string, string>();
    for (const member of [...state.roster.members, ...deceased]) {
      m.set(member.id, member.name);
    }
    return m;
  }, [state.roster.members, deceased]);

  // Build per-bloodline summaries. "Extinct" bloodlines have a founder in the
  // graveyard and zero living members.
  const bloodlineSummaries = useMemo<BloodlineGraveyardEntry[]>(() => {
    const all: BloodlineGraveyardEntry[] = [];
    for (const [id, bl] of Object.entries(state.bloodlines)) {
      const living = state.roster.members.filter(m => m.bloodlineId === id);
      const dead = deceased.filter(m => m.bloodlineId === id);
      const founder = dead.find(m => m.isFounder) ?? living.find(m => m.isFounder) ?? null;
      const lastLost =
        dead.length > 0 ? [...dead].sort((a, b) => b.age - a.age)[0] : null;
      all.push({
        bloodlineId: id as BloodlineId,
        name: (bl as any)?.name ?? id,
        color: (bl as any)?.color ?? "#666",
        founder,
        livingCount: living.length,
        deadCount: dead.length,
        lastMemberLost: lastLost,
      });
    }
    return all.sort((a, b) => {
      // Extinct bloodlines first (most dramatic), then by dead count desc
      if (a.livingCount === 0 && b.livingCount > 0) return -1;
      if (b.livingCount === 0 && a.livingCount > 0) return 1;
      return b.deadCount - a.deadCount;
    });
  }, [state.bloodlines, state.roster.members, deceased]);

  const extinctBloodlines = bloodlineSummaries.filter(
    b => b.livingCount === 0 && b.deadCount > 0,
  );

  const darrenSection = (
    <section>
      <div className="text-[10px] font-mono uppercase text-muted-foreground mb-2 tracking-wider">
        IN MEMORIAM
      </div>
      <div
        className="p-3 border border-border/40 rounded bg-background/40 flex gap-3"
        style={{ borderLeftWidth: "3px", borderLeftColor: "#94a3b8" }}
      >
        <img
          src={THE_ASSISTANT_CARD.artAsset}
          alt=""
          aria-hidden="true"
          className="w-12 h-12 flex-shrink-0 object-contain opacity-90"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        <div className="flex-1 min-w-0">
          <div className="font-display font-semibold text-sm">
            {THE_ASSISTANT_CARD.name}
          </div>
          <div className="text-[10px] font-mono text-muted-foreground mb-1">
            {THE_ASSISTANT_CARD.subtitle}
          </div>
          <div className="text-[10px] font-mono italic text-foreground/60">
            "{THE_ASSISTANT_CARD.flavorText}"
          </div>
        </div>
      </div>
    </section>
  );

  if (deceased.length === 0) {
    return (
      <div className="space-y-6">
        <div className="py-16 text-center">
          <Skull size={40} className="mx-auto text-muted-foreground/30 mb-3" />
          <div className="font-mono text-sm text-muted-foreground">
            The memorial wall is empty. May it stay that way.
          </div>
        </div>
        {darrenSection}
      </div>
    );
  }

  const memorialOnlyGroups = memorialOnlyQuery.data ?? [];

  return (
    <div className="space-y-6">
      <div className="text-[11px] font-mono text-muted-foreground">
        {deceased.length} name{deceased.length === 1 ? "" : "s"} on the wall ·{" "}
        {state.roster.totalLost} total lost · {state.dmcClonesLost} lost to the Circuit
      </div>

      {/* Carried-but-unread loredex entries — entries the deceased
          discovered but never finished reading. Now memorial-only. */}
      {memorialOnlyGroups.length > 0 && (
        <section>
          <div className="text-[10px] font-mono uppercase text-muted-foreground mb-2 tracking-wider">
            ENTRIES CARRIED INTO THE WALL
          </div>
          <div className="space-y-2">
            {memorialOnlyGroups.map((g) => {
              const name = memberNameByKey.get(g.memberKey) ?? g.memberKey;
              return (
                <div
                  key={g.memberKey}
                  className="p-3 border border-border/40 rounded bg-background/40"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-display text-sm font-semibold flex items-center gap-2">
                      <BookOpen className="w-3 h-3" />
                      {name}
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      cycle {g.memorialAtCycle}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono italic text-foreground/60 mb-2">
                    Took {g.entries.length} unread entr{g.entries.length === 1 ? "y" : "ies"} with them.
                  </div>
                  <ul className="text-[10px] font-mono text-foreground/70 space-y-0.5 pl-4 list-disc">
                    {g.entries.map((id) => (
                      <li key={id}>{id}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Extinct bloodlines get a dramatic full-width block */}
      {extinctBloodlines.length > 0 && (
        <section>
          <div className="text-[10px] font-mono uppercase void-text-error mb-2 tracking-wider">
            EXTINCT BLOODLINES
          </div>
          <div className="space-y-2">
            {extinctBloodlines.map(bl => (
              <div
                key={bl.bloodlineId}
                className="p-3 border void-border-error void-bg-error rounded"
                style={{ borderLeftWidth: "4px", borderLeftColor: bl.color }}
              >
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <div className="font-display text-sm font-bold" style={{ color: bl.color }}>
                      {bl.name}
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground italic">
                      No living members. House fallen.
                    </div>
                  </div>
                  <span className="text-[9px] font-mono void-text-error">
                    {bl.deadCount} lost
                  </span>
                </div>
                {bl.founder?.deathRecord && (
                  <div className="mt-2 text-[10px] font-mono text-foreground/60 italic">
                    Founder {bl.founder.name}'s last words: "{bl.founder.deathRecord.lastWords}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Per-member memorial cards */}
      <section>
        <div className="text-[10px] font-mono uppercase text-muted-foreground mb-2 tracking-wider">
          NAMES ON THE WALL
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {deceased.map(m => {
            const spectralKey =
              CREW_SPECIES_TO_SPECTRAL[m.species] ?? pickSpectralForId(m.id);
            const spectralSrc = SPECTRAL_ART[spectralKey];
            return (
              <div
                key={m.id}
                className="p-3 border border-border/40 rounded bg-background/40 flex gap-3"
                style={{
                  borderLeftWidth: "3px",
                  borderLeftColor:
                    FOUNDING_BLOODLINES[m.bloodlineId as BloodlineId]?.color ?? "#666",
                }}
              >
                {spectralSrc && (
                  <img
                    src={spectralSrc}
                    alt=""
                    aria-hidden="true"
                    className="w-12 h-12 flex-shrink-0 object-contain opacity-70"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-display font-semibold text-sm flex items-center gap-1">
                      {m.isFounder && <Crown size={11} className="void-text-premium" />}
                      {m.name}
                    </span>
                    <span className="text-[9px] font-mono text-muted-foreground">
                      gen {m.generation}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground mb-1">
                    {FOUNDING_BLOODLINES[m.bloodlineId as BloodlineId]?.name ?? m.bloodlineId} ·{" "}
                    {m.species} · age {m.age}
                    {m.isFounder && " · founder"}
                  </div>
                  {m.deathRecord && (
                    <>
                      <div className="text-[10px] font-mono void-text-error mb-1">
                        {m.deathRecord.cause}
                      </div>
                      <div className="text-[10px] font-mono italic text-foreground/60">
                        "{m.deathRecord.lastWords}"
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {darrenSection}
    </div>
  );
}
