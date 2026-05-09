/* ═══════════════════════════════════════════════════════
   CREW TICK PIPELINE — Pure functions

   The same per-query tick logic the server router runs,
   but extracted to a pure-function module so it can be
   unit tested without a DB connection or trpc context.

   The server router imports these and calls them in the
   same order (incubator → missions → aging → ambient feed).
   ═══════════════════════════════════════════════════════ */

import type {
  CrewState,
  SerializedCrewMember,
  SerializedPod,
  SerializedFeedEntry,
  CrewRomance,
  GhostEffectEntry,
  PendingCrewSideEffect,
} from "./crewPersistence";
import { trimFeed, MAX_GHOST_EFFECTS } from "./crewPersistence";
import { CREW_BALANCE } from "./crewBalance";
import { resolveMission, pickLastWords } from "./crewMissions";
import { generateAmbientFeedBatch } from "./crewAmbientFeed";
import {
  generateEpitaph,
  calculateMourningEffects,
  getGhostEffects,
} from "./apprenticePermadeath";
import { isResurrectableNpc } from "./resurrectionProtocols";

/* ─── POD TICK ─── */

export function tickIncubator(
  state: CrewState,
  now: number,
  rng: () => number = Math.random,
): CrewState {
  if (state.lastTickAt === 0) {
    return { ...state, lastTickAt: now };
  }
  const hoursElapsed = (now - state.lastTickAt) / (1000 * 60 * 60);
  if (hoursElapsed <= 0) return { ...state, lastTickAt: now };

  let malfunctionCount = state.incubator.malfunctionCount;
  const pods: SerializedPod[] = state.incubator.pods.map(pod => {
    if (pod.status !== "gestating") return pod;
    const remaining = pod.timeRemainingHours - hoursElapsed;
    if (remaining <= 0) {
      return { ...pod, status: "ready", timeRemainingHours: 0 };
    }
    const chance =
      (100 - pod.geneticIntegrity) *
      0.002 *
      Math.min(hoursElapsed, 6) *
      CREW_BALANCE.incubatorMalfunctionMultiplier;
    if (rng() < chance) {
      malfunctionCount += 1;
      return {
        ...pod,
        status: "malfunction",
        timeRemainingHours: remaining,
        geneticIntegrity: Math.max(
          CREW_BALANCE.incubatorIntegrityFloor,
          pod.geneticIntegrity - 10,
        ),
      };
    }
    return { ...pod, timeRemainingHours: remaining };
  });

  return {
    ...state,
    incubator: { ...state.incubator, pods, malfunctionCount },
    lastTickAt: now,
  };
}

/* ─── AGING TICK ─── */

export function tickAging(state: CrewState, now: number): CrewState {
  if (state.lastAgingTickAt === 0) {
    return { ...state, lastAgingTickAt: now };
  }
  const elapsed = now - state.lastAgingTickAt;
  const yearsPassed = Math.floor(elapsed / CREW_BALANCE.realMsPerCrewYear);
  if (yearsPassed <= 0) return state;

  const members: SerializedCrewMember[] = [];
  const newlyDeceased: SerializedCrewMember[] = [];
  let totalLost = state.roster.totalLost;

  for (const m of state.roster.members) {
    if (m.status === "dead") {
      members.push(m);
      continue;
    }
    const newAge = m.age + yearsPassed;
    if (newAge >= m.maxAge) {
      const dead: SerializedCrewMember = {
        ...m,
        age: newAge,
        status: "dead",
        health: 0,
        deathRecord: {
          cycle: newAge,
          cause: "Natural cellular expiration",
          lastWords: pickLastWords(m.name.length + newAge),
        },
      };
      newlyDeceased.push(dead);
      totalLost += 1;
      continue;
    }
    members.push({ ...m, age: newAge });
  }

  return {
    ...state,
    roster: {
      ...state.roster,
      members,
      deceased: [...state.roster.deceased, ...newlyDeceased],
      totalLost,
    },
    lastAgingTickAt: state.lastAgingTickAt + yearsPassed * CREW_BALANCE.realMsPerCrewYear,
  };
}

/* ─── MISSION TICK ─── */

export function applyRelationshipDeltas(
  members: SerializedCrewMember[],
  survivorIds: string[],
  lostIds: string[],
): SerializedCrewMember[] {
  if (survivorIds.length < 2) return members;
  const survivorSet = new Set(survivorIds);
  const winDelta = CREW_BALANCE.relationshipDeltaPerSharedMission;
  const lossDelta = CREW_BALANCE.relationshipDeltaOnSharedLoss;
  return members.map(m => {
    if (!survivorSet.has(m.id)) return m;
    const relationships = { ...m.relationships };
    for (const other of survivorIds) {
      if (other === m.id) continue;
      relationships[other] = Math.max(-100, Math.min(100, (relationships[other] ?? 0) + winDelta));
    }
    if (lostIds.length > 0) {
      for (const other of survivorIds) {
        if (other === m.id) continue;
        relationships[other] = Math.max(
          -100,
          Math.min(100, (relationships[other] ?? 0) + lossDelta),
        );
      }
    }
    return { ...m, relationships };
  });
}

export function tickMissions(state: CrewState, now: number): CrewState {
  let next = state;
  for (const mission of state.missions) {
    if (mission.status !== "dispatched") continue;
    if (now < mission.completesAt) continue;

    const assigned = next.roster.members.filter(m => mission.assignedCrewIds.includes(m.id));
    if (assigned.length === 0) {
      next = {
        ...next,
        missions: next.missions.map(x =>
          x.id === mission.id ? { ...x, status: "lost" as const } : x,
        ),
      };
      continue;
    }
    const resolved = resolveMission(mission, assigned, now + mission.name.length);

    const updatedMembers: SerializedCrewMember[] = [];
    const deceased: SerializedCrewMember[] = [];
    let totalLost = next.roster.totalLost;
    // Track per-survivor mourning deltas keyed by member id (applied below).
    const mourningMoraleByMember: Record<string, number> = {};
    // Ghost effects to append for each casualty (cap-bounded by caller).
    const newGhostEffects: GhostEffectEntry[] = [];
    // Side-effects to enqueue (drained by server router after each tick).
    const newSideEffects: PendingCrewSideEffect[] = [];
    for (const m of next.roster.members) {
      if (!mission.assignedCrewIds.includes(m.id)) {
        updatedMembers.push(m);
        continue;
      }
      if (resolved.resolution?.casualties.includes(m.id)) {
        const cause = `Lost during ${mission.name}`;
        const archetype = m.archetype;
        const epitaph = archetype ? generateEpitaph(archetype, cause) : undefined;
        // Romance flag: was this member in an active partnership at death?
        const inRomance = next.romances.some(
          (r) =>
            (r.memberAId === m.id || r.memberBId === m.id) &&
            (r.status === "courtship" || r.status === "partnered"),
        );
        deceased.push({
          ...m,
          status: "dead" as const,
          health: 0,
          deathRecord: {
            cycle: m.age,
            cause,
            lastWords: pickLastWords(now + m.name.length),
            ...(epitaph ? { epitaph } : {}),
            ...(inRomance ? { romanced: true } : {}),
            ...(typeof m.personalQuestStage === "number"
              ? { personalQuestStage: m.personalQuestStage }
              : {}),
          },
        });
        totalLost += 1;

        // Mourning: amplified per-survivor morale deltas keyed by archetype.
        if (archetype) {
          const survivorIds = resolved.resolution?.survived ?? [];
          const survivorMembers = next.roster.members.filter((s) =>
            survivorIds.includes(s.id),
          );
          const survivorArchs = survivorMembers
            .map((s) => s.archetype ?? "")
            .filter((a) => a.length > 0);
          if (survivorArchs.length > 0) {
            const effects = calculateMourningEffects(archetype, survivorArchs);
            // Romance amplifies grief 2x for the partner specifically; quest
            // stage 3 (breaking-point reached) amplifies 1.3x for all.
            const questAmp =
              (m.personalQuestStage ?? 0) >= 3 ? 1.3 : 1.0;
            survivorMembers.forEach((s, idx) => {
              const eff = effects[idx];
              if (!eff) return;
              const partnerAmp =
                inRomance &&
                next.romances.some(
                  (r) =>
                    (r.memberAId === m.id && r.memberBId === s.id) ||
                    (r.memberBId === m.id && r.memberAId === s.id),
                )
                  ? 2.0
                  : 1.0;
              mourningMoraleByMember[s.id] = Math.round(
                eff.moraleDelta * questAmp * partnerAmp,
              );
            });
          }

          // Ghost effects (FIFO-capped by caller). 2-3 entries per casualty:
          // one dialogue mention, one object, one ambient.
          const ghosts = getGhostEffects(m.name, archetype);
          const baseAt = now;
          const expiresAt = now + 1000 * 60 * 60 * 24 * 30; // 30d
          if (ghosts.dialogueMentions[0]) {
            newGhostEffects.push({
              fromMemberId: m.id,
              type: "dialogue_mention",
              payload: ghosts.dialogueMentions[0],
              createdAt: baseAt,
              expiresAt,
            });
          }
          if (ghosts.objectAppearances[0]) {
            newGhostEffects.push({
              fromMemberId: m.id,
              type: "object_appearance",
              payload: ghosts.objectAppearances[0],
              createdAt: baseAt,
              expiresAt,
            });
          }
          if (ghosts.ambientEffects[0]) {
            newGhostEffects.push({
              fromMemberId: m.id,
              type: "ambient_sound",
              payload: ghosts.ambientEffects[0],
              createdAt: baseAt,
              expiresAt,
            });
          }
        }

        /* ─── Named-NPC death (productionPath="recruited") ─── */
        // The recruited instance is gone permanently; the canonical NPC's
        // world presence is temporarily blocked, the all-knower mourning
        // sweep fires, and the Resurrection Protocols quest opens. Path B
        // (auto-return on Necromancer event) is wired in necromancerCycle.
        if (
          m.productionPath === "recruited" &&
          m.linkedNpcKey &&
          isResurrectableNpc(m.linkedNpcKey)
        ) {
          newSideEffects.push({
            kind: "npc_world_death",
            npcKey: m.linkedNpcKey,
            killedMemberKey: m.id,
            diedAtCycle: m.age,
            diedAtMs: now,
          });
          newSideEffects.push({
            kind: "open_resurrection_quest",
            npcKey: m.linkedNpcKey,
            killedMemberKey: m.id,
            deathCycle: m.age,
            diedAtMs: now,
          });
          newSideEffects.push({
            kind: "mourning_sweep",
            deceasedNpcKey: m.linkedNpcKey,
            deceasedMemberKey: m.id,
            diedAtMs: now,
          });
        } else if (m.productionPath === "trained" && m.archetype) {
          // Apprentice obituary — Loredex entry generation. Not a quest;
          // just an entry in the obituary section of the player's lore.
          newSideEffects.push({
            kind: "apprentice_obituary",
            deceasedMemberKey: m.id,
            archetype: m.archetype,
            diedAtMs: now,
          });
        }

        // Memorial sweep: any loredex entries this member discovered
        // but did not finish reading become memorial-only when they die.
        // Drained by the server router via crewLoredexCarryService.markMemorialOnDeath.
        newSideEffects.push({
          kind: "carry_memorial_sweep",
          deceasedMemberKey: m.id,
          deathCycle: m.age,
          diedAtMs: now,
        });
        continue;
      }
      if (resolved.resolution?.injured.includes(m.id)) {
        updatedMembers.push({
          ...m,
          status: "injured",
          health: Math.max(10, m.health - 30),
          morale: Math.max(0, m.morale - 10),
          missionHistory: [...m.missionHistory, mission.id],
        });
        continue;
      }
      // Survivor branch — apply mourning morale on top of mission morale.
      const baseMoraleDelta = resolved.resolution?.success ? 12 : 4;
      const mourningDelta = mourningMoraleByMember[m.id] ?? 0;
      updatedMembers.push({
        ...m,
        status: "active",
        morale: Math.max(
          0,
          Math.min(100, m.morale + baseMoraleDelta + mourningDelta),
        ),
        loyalty: Math.min(100, m.loyalty + (resolved.resolution?.success ? 6 : 2)),
        missionHistory: [...m.missionHistory, mission.id],
      });
    }

    // Mission-completion log entries (one per assigned member). Drained
    // by the server router into crew_mission_completion_log so
    // apprenticeQuestSubtaskService.validateMissionTagComplete can
    // confirm `mission_tag_complete` sub-tasks. Casualties get a
    // "failure" outcome regardless of mission success; survivors and
    // injured share the mission's overall success/failure outcome.
    if (mission.tags && mission.tags.length > 0) {
      const overall = resolved.resolution?.success ? "success" : "failure";
      for (const memberId of mission.assignedCrewIds) {
        const wasCasualty = resolved.resolution?.casualties.includes(memberId);
        newSideEffects.push({
          kind: "mission_completion",
          memberKey: memberId,
          missionId: mission.id,
          tags: [...mission.tags],
          outcome: wasCasualty ? "failure" : (overall as "success" | "failure"),
          completedAtMs: now,
        });
      }
    }

    const survivorIds =
      resolved.resolution?.survived ??
      updatedMembers
        .filter(m => mission.assignedCrewIds.includes(m.id))
        .map(m => m.id);
    const casualtyIds = resolved.resolution?.casualties ?? [];
    const withBonds = applyRelationshipDeltas(updatedMembers, survivorIds, casualtyIds);

    const feedEntry: SerializedFeedEntry = {
      id: `mission-resolved-${mission.id}`,
      timestamp: now,
      roomId: "bridge",
      category: "security",
      text: resolved.resolution?.narrative ?? "Mission returned.",
      severity: resolved.resolution?.success ? "info" : "alert",
      actionable: false,
    };

    // Append ghost effects FIFO-capped by MAX_GHOST_EFFECTS.
    const mergedGhosts = [
      ...(next.ghosts ?? []),
      ...newGhostEffects,
    ].slice(-MAX_GHOST_EFFECTS);

    next = {
      ...next,
      missions: next.missions.map(x => (x.id === mission.id ? resolved : x)),
      roster: {
        ...next.roster,
        members: withBonds,
        deceased: [...next.roster.deceased, ...deceased],
        totalLost,
      },
      missionStats: {
        totalDispatched: next.missionStats.totalDispatched,
        totalSucceeded: next.missionStats.totalSucceeded + (resolved.resolution?.success ? 1 : 0),
        totalFailed: next.missionStats.totalFailed + (resolved.resolution?.success ? 0 : 1),
        totalCasualties:
          next.missionStats.totalCasualties + (resolved.resolution?.casualties.length ?? 0),
      },
      feed: trimFeed([...next.feed, feedEntry]),
      feedUnreadCount: next.feedUnreadCount + 1,
      ghosts: mergedGhosts,
      pendingSideEffects: [
        ...(next.pendingSideEffects ?? []),
        ...newSideEffects,
      ],
    };
  }
  return next;
}

/* ─── AMBIENT FEED TICK ─── */

export function tickAmbientFeed(state: CrewState, now: number): CrewState {
  if (state.roster.members.length === 0) return state;
  if (now - state.feedLastGenerated < CREW_BALANCE.ambientFeedTickMs) return state;
  const active = state.roster.members.filter(m => m.status === "active");
  if (active.length === 0) return state;
  const batch = generateAmbientFeedBatch(
    active.map(m => m.name),
    Math.floor(now / CREW_BALANCE.ambientFeedTickMs),
    now,
  );
  if (batch.length === 0) return state;
  return {
    ...state,
    feed: trimFeed([...state.feed, ...batch]),
    feedLastGenerated: now,
    feedUnreadCount: state.feedUnreadCount + batch.length,
  };
}

/* ─── ROMANCE TICK ───
   Emergent romance: on each tick, any pair with a mutual relationship
   score ≥ romanceThreshold who are not already in an active romance
   has a small chance to begin a courtship. Courtships become
   partnerships after REAL_MS_COURTSHIP if the player doesn't opt them
   out. Partnered couples grant +romanceMoraleBonus to both members.
   Ended romances are preserved in the list so the UI can show history. */

const COURTSHIP_DURATION_MS = 3 * 60 * 60 * 1000; // 3 hours of real time
const COURTSHIP_CHECK_MS = 30 * 60 * 1000; // check every 30 minutes

export function tickRomance(
  state: CrewState,
  now: number,
  rng: () => number = Math.random,
): CrewState {
  const active = state.roster.members.filter(m => m.status === "active");
  // Note: we don't early-return on active.length < 2 here because the
  // pruning pass still needs to end romances whose partners died. Only
  // the emergence (new-courtship) pass requires 2+ active members.

  let romances = [...state.romances];
  const feedAdditions: SerializedFeedEntry[] = [];

  // 1) Advance courtships to partnered status after the grace period
  romances = romances.map(r => {
    if (r.status === "courtship" && now - r.declaredAt >= COURTSHIP_DURATION_MS) {
      const a = state.roster.members.find(m => m.id === r.memberAId);
      const b = state.roster.members.find(m => m.id === r.memberBId);
      if (a && b) {
        feedAdditions.push({
          id: `romance-partnered-${r.id}`,
          timestamp: now,
          roomId: "captains_quarters",
          category: "social",
          text: `Captain's Quarters: ${a.name} and ${b.name} have made it official. The crew has been... waiting for this.`,
          severity: "info",
          actionable: false,
        });
      }
      return { ...r, status: "partnered" as const };
    }
    return r;
  });

  // 2) Prune romances where one member is dead or no longer active
  romances = romances.map(r => {
    if (r.status === "ended" || r.status === "estranged") return r;
    const a = state.roster.members.find(m => m.id === r.memberAId);
    const b = state.roster.members.find(m => m.id === r.memberBId);
    if (!a || !b || a.status === "dead" || b.status === "dead") {
      if (a || b) {
        const survivor = a?.status !== "dead" ? a : b;
        const lost = a?.status === "dead" ? a : b;
        if (survivor && lost) {
          feedAdditions.push({
            id: `romance-ended-${r.id}-${now}`,
            timestamp: now,
            roomId: "trophy_room",
            category: "social",
            text: `Trophy Room: ${survivor.name} sat alone at ${lost.name}'s memorial. Nobody asked them to speak.`,
            severity: "warning",
            actionable: false,
          });
        }
      }
      return { ...r, status: "ended" as const };
    }
    return r;
  });

  // 3) Apply partnered-romance morale bonus to active partners (idempotent —
  //    only nudges morale if below the ceiling). Fires at most once per tick.
  const partnerIds = new Set(
    romances
      .filter(r => r.status === "partnered")
      .flatMap(r => [r.memberAId, r.memberBId]),
  );

  // 4) Check for new emergent romances — throttle to COURTSHIP_CHECK_MS.
  //    Requires at least two living, active crew.
  const lastCheck = state.lastRomanceCheckAt ?? 0;
  if (active.length >= 2 && now - lastCheck >= COURTSHIP_CHECK_MS) {
    const existingPairs = new Set(
      romances
        .filter(r => r.status === "courtship" || r.status === "partnered")
        .flatMap(r => [`${r.memberAId}:${r.memberBId}`, `${r.memberBId}:${r.memberAId}`]),
    );
    const optOutSet = new Set(state.romanceOptOuts ?? []);

    for (let i = 0; i < active.length; i++) {
      for (let j = i + 1; j < active.length; j++) {
        const a = active[i];
        const b = active[j];
        if (optOutSet.has(a.id) || optOutSet.has(b.id)) continue;
        const key = `${a.id}:${b.id}`;
        if (existingPairs.has(key)) continue;
        const scoreA = a.relationships?.[b.id] ?? 0;
        const scoreB = b.relationships?.[a.id] ?? 0;
        const mean = (scoreA + scoreB) / 2;
        if (mean < CREW_BALANCE.romanceThreshold) continue;
        // Emergence chance scales with how far above threshold they are
        const over = Math.min(1, (mean - CREW_BALANCE.romanceThreshold) / 25);
        const chance = 0.2 + over * 0.5;
        if (rng() >= chance) continue;
        // New courtship!
        const romance: CrewRomance = {
          id: `romance-${now}-${a.id}-${b.id}`,
          memberAId: a.id,
          memberBId: b.id,
          declaredAt: now,
          status: "courtship",
        };
        romances.push(romance);
        feedAdditions.push({
          id: `romance-start-${romance.id}`,
          timestamp: now,
          roomId: "observation_deck",
          category: "social",
          text: `Observation Deck: ${a.name} and ${b.name} were seen talking after shift. Elara logged it under "developments."`,
          severity: "info",
          actionable: false,
        });
        existingPairs.add(key);
        existingPairs.add(`${b.id}:${a.id}`);
      }
    }
  }

  if (
    romances === state.romances &&
    feedAdditions.length === 0 &&
    state.lastRomanceCheckAt === lastCheck + (now - lastCheck >= COURTSHIP_CHECK_MS ? now - lastCheck : 0)
  ) {
    return state;
  }

  // Apply partnered morale bonus (at most +romanceMoraleBonus per partner,
  // applied once per tick; won't pump past 100)
  const updatedMembers =
    partnerIds.size > 0
      ? state.roster.members.map(m => {
          if (!partnerIds.has(m.id) || m.status !== "active") return m;
          const boosted = Math.min(100, m.morale + CREW_BALANCE.romanceMoraleBonus);
          if (boosted === m.morale) return m;
          return { ...m, morale: boosted };
        })
      : state.roster.members;

  return {
    ...state,
    romances,
    roster:
      updatedMembers === state.roster.members
        ? state.roster
        : { ...state.roster, members: updatedMembers },
    feed:
      feedAdditions.length > 0 ? trimFeed([...state.feed, ...feedAdditions]) : state.feed,
    feedUnreadCount: state.feedUnreadCount + feedAdditions.length,
    lastRomanceCheckAt: now - lastCheck >= COURTSHIP_CHECK_MS ? now : lastCheck,
  };
}

/* ─── COMBINED PIPELINE ─── */

export function applyTick(
  state: CrewState,
  now: number = Date.now(),
  rng?: () => number,
): CrewState {
  let next = tickIncubator(state, now, rng);
  next = tickMissions(next, now);
  next = tickAging(next, now);
  next = tickAmbientFeed(next, now);
  next = tickRomance(next, now, rng);
  return next;
}
