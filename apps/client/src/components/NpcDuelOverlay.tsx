/**
 * NpcDuelOverlay — client mount surface for the NPC duel loop.
 *
 * The dialog tree's `challenge: { npcKey }` outcome fires from
 * `useNpcDialogTree` as the `challenge` field on the
 * `ChoiceCommitResult`. The host mounts this overlay, which then
 * runs the loop end-to-end:
 *
 *   1. preview  — fetch trpc.npcDuel.getChallengeInfo. Render the
 *      composed-deck preview, learned-aspect count, projected reward
 *      tier, and any cross-NPC carried-memory echoes. Player picks
 *      "Sit. Deal." or "Not yet."
 *
 *   2. in-duel  — mount DuelystGameUI with a synthesized
 *      StoryEncounter built from the preview (deck + general/faction
 *      from the registry). The match runs in the existing engine /
 *      renderer; we only pass the deck override + outcome callback.
 *
 *   3. result   — on player win, call trpc.npcDuel.recordVictory and
 *      render the granted memorial summary. On loss, render a
 *      consolation card (the "Pokémon stake" loss-path lives in a
 *      follow-up; for now we just close out).
 *
 * The overlay is presentation-only — it consumes the npc-duel router
 * surface and the existing DuelystGameUI; it does not synthesize
 * dialog flow. The dialog renderer that surfaced the challenge stays
 * mounted alongside (e.g. closed when its own terminal node is hit).
 */
import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import DuelystGameUI from "@/game/duelyst/DuelystGameUI";
import { ALL_CARD_DEFINITIONS } from "@shared/tcg-core/cards";
import type { CardDefinition } from "@shared/tcg-core/types/Card";
import type { Faction as DuelystFaction } from "@/game/duelyst/types";
import type { StoryEncounter } from "@shared/tcg-core/story/encounter";

/** Factions DuelystGameUI accepts. Engine card-definitions support
 *  a broader set (panopticon / hierarchy_of_damned); we narrow at
 *  the overlay boundary so the underlying renderer's invariants
 *  hold. NPCs whose authored general resolves outside this set fall
 *  back to "neutral" — the duel still runs cleanly. */
const DUELYST_FACTION_SET = new Set<DuelystFaction>([
  "architect",
  "dreamer",
  "insurgency",
  "new_babylon",
  "antiquarian",
  "thought_virus",
  "neutral",
]);

function toDuelystFaction(value: string | undefined): DuelystFaction {
  if (value && DUELYST_FACTION_SET.has(value as DuelystFaction)) {
    return value as DuelystFaction;
  }
  return "neutral";
}

export interface NpcDuelOverlayProps {
  /** Which NPC the player is challenging — matches the
   *  `challenge.npcKey` surfaced by useNpcDialogTree. */
  npcKey: string;
  /** Required: the player's chosen faction at duel time. Comes from
   *  the host's GameContext / character-creation; falling back to
   *  neutral is acceptable for surfaces that haven't authored a
   *  player faction (e.g. tutorial). */
  playerFaction: DuelystFaction;
  /** Fires when the overlay closes — either because the player
   *  declined the duel at preview, finished the result step, or
   *  hit Back. The host unmounts. */
  onClose: () => void;
  /** Optional: fires after recordVictory resolves successfully, so
   *  the host can refresh collection caches / fire a toast. */
  onVictoryRecorded?: (grantCount: number, rewardTier: 0 | 1 | 2 | 3) => void;
}

type Phase = "preview" | "duel" | "result";

interface DuelResult {
  outcome: "player_won" | "opponent_won";
  rewardTier: 0 | 1 | 2 | 3;
  grantCount: number;
  /** On loss, the card the NPC took (Pokémon-style stake). Null
   *  when the player owned nothing on the challengeMotive list. */
  takenCardDefId: string | null;
  /** On victory, any cards restored from prior stake losses. */
  restoredCardDefIds: ReadonlyArray<string>;
}

function lookupCard(cardDefId: string): CardDefinition | undefined {
  return ALL_CARD_DEFINITIONS.find((c) => c.id === cardDefId);
}

/** Synthesize a minimal StoryEncounter from the npc-duel preview so
 *  DuelystGameUI's existing encounter path runs the match. The
 *  encounter only fills the fields the renderer reads — every
 *  per-act narrative-hook field is left empty. */
function buildEncounterFromPreview(args: {
  npcKey: string;
  general: string;
  bossFaction: DuelystFaction;
  deck: ReadonlyArray<string>;
  seed: string;
}): StoryEncounter {
  return {
    id: `npc_duel_${args.npcKey}`,
    chapterId: "npc_duel",
    name: `Challenge: ${args.npcKey}`,
    description: "An NPC duel.",
    bossFaction: args.bossFaction,
    bossGeneralDefId: args.general,
    bossDeckCardDefIds: args.deck,
    seed: args.seed,
    winConditions: [{ kind: "general_killed" }],
    loseConditions: [{ kind: "general_killed" }],
    narrativeHooks: [],
  };
}

export function NpcDuelOverlay({
  npcKey,
  playerFaction,
  onClose,
  onVictoryRecorded,
}: NpcDuelOverlayProps) {
  const [phase, setPhase] = useState<Phase>("preview");
  const [duelResult, setDuelResult] = useState<DuelResult | null>(null);

  const challengeInfoQuery = trpc.npcDuel.getChallengeInfo.useQuery(
    { npcKey },
    { staleTime: 60_000 },
  );
  const recordVictory = trpc.npcDuel.recordVictory.useMutation();
  const recordLoss = trpc.npcDuel.recordLoss.useMutation();

  const info = challengeInfoQuery.data;
  const bossFaction = useMemo<DuelystFaction>(() => {
    if (!info || !info.challengeable) return "neutral";
    const general = lookupCard(info.general);
    return toDuelystFaction(general?.faction);
  }, [info]);

  /* ─── Phase: preview ─── */
  if (phase === "preview") {
    if (challengeInfoQuery.isLoading) {
      return (
        <OverlayShell label="Loading challenge">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] void-text-dim">
            The arithmetic is waiting…
          </p>
        </OverlayShell>
      );
    }
    if (!info || !info.challengeable) {
      return (
        <OverlayShell label="Challenge unavailable">
          <p className="font-serif text-[13px] void-text">
            No deck has been authored for this NPC yet.
          </p>
          <CloseButton onClick={onClose} label="Continue" />
        </OverlayShell>
      );
    }
    const tierLabel = TIER_LABELS[info.rewardTier];
    return (
      <OverlayShell label={`Challenge: ${npcKey}`}>
        <p className="font-serif text-[13px] void-text leading-relaxed">
          {info.alreadyDefeated
            ? "You have defeated them before. Step back to the table?"
            : "Step to the table. The arithmetic is waiting."}
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-wider void-text-dim">
          <dt>Aspects learned</dt>
          <dd className="void-text">
            {info.learnedAspectCount} / {info.totalAspectCount}
          </dd>
          <dt>Reward tier</dt>
          <dd className="void-text">{tierLabel}</dd>
          <dt>Deck size</dt>
          <dd className="void-text">{info.deckSize} cards</dd>
        </dl>

        {info.perspectiveAspects.length > 0 && (
          <ul className="mt-4 space-y-1 font-mono text-[10px] uppercase tracking-wider">
            {info.perspectiveAspects.map((aspect) => (
              <li
                key={aspect.id}
                className={aspect.learned ? "void-text" : "void-text-dim"}
              >
                {aspect.learned ? "✓" : "·"} {aspect.label}
              </li>
            ))}
          </ul>
        )}

        {info.carriedMemories.length > 0 && (
          <p className="mt-4 font-serif text-[12px] italic void-text-dim">
            You carry the memory of: {info.carriedMemories.join(", ")}.
          </p>
        )}

        {/* Cross-NPC adaptation note. When the NPC's deck has been
         *  mechanically upgraded by the player's track record (NPC
         *  authors crossMemoryUpgrades), surface the count so the
         *  player knows they're facing a harder version. Silent when
         *  the NPC has no upgrades authored or none fired. */}
        {info.appliedCrossMemoryUpgrades.length > 0 && (
          <p className="mt-2 font-mono text-[10px] uppercase tracking-wider void-text-accent">
            ✦ They have adapted to your record: {info.appliedCrossMemoryUpgrades.length}{" "}
            card{info.appliedCrossMemoryUpgrades.length === 1 ? "" : "s"} upgraded
          </p>
        )}

        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setPhase("duel")}
            className="rounded border void-border bg-cyan-950/40 px-4 py-2 font-mono text-[10px] uppercase tracking-wider void-text hover:bg-cyan-900/60"
          >
            Sit. Deal.
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded border void-border bg-stone-900/60 px-4 py-2 font-mono text-[10px] uppercase tracking-wider void-text-dim hover:bg-stone-800/80"
          >
            Not yet.
          </button>
        </div>
      </OverlayShell>
    );
  }

  /* ─── Phase: duel ─── */
  if (phase === "duel") {
    if (!info || !info.challengeable) {
      setPhase("preview");
      return null;
    }
    const encounter = buildEncounterFromPreview({
      npcKey,
      general: info.general,
      bossFaction,
      deck: info.deck,
      seed: `npc_duel_${npcKey}_${Date.now()}`,
    });
    // Replay-pin metadata — recorded on GameState.npcDuelMeta so a
    // historical replay can render "tier 2 — you'd learned 2/3
    // aspects." Reducers ignore this field; it's pure observability.
    const npcDuelMeta = {
      npcKey,
      rewardTier: info.rewardTier,
      learnedAspectCount: info.learnedAspectCount,
      totalAspectCount: info.totalAspectCount,
      appliedAspects: info.appliedAspects,
    };
    return (
      <div className="fixed inset-0 z-[80] bg-black">
        <DuelystGameUI
          playerFaction={playerFaction}
          opponentFaction={bossFaction}
          encounter={encounter}
          npcDuelMeta={npcDuelMeta}
          onGameEnd={async (winner) => {
            if (winner === "player") {
              try {
                const res = await recordVictory.mutateAsync({ npcKey });
                if (res.ok) {
                  setDuelResult({
                    outcome: "player_won",
                    rewardTier: res.rewardTier,
                    grantCount: res.grantCount,
                    takenCardDefId: null,
                    restoredCardDefIds: res.restoredCardDefIds ?? [],
                  });
                  onVictoryRecorded?.(res.grantCount, res.rewardTier);
                } else {
                  setDuelResult({
                    outcome: "player_won",
                    rewardTier: 0,
                    grantCount: 0,
                    takenCardDefId: null,
                    restoredCardDefIds: [],
                  });
                }
              } catch {
                setDuelResult({
                  outcome: "player_won",
                  rewardTier: 0,
                  grantCount: 0,
                  takenCardDefId: null,
                  restoredCardDefIds: [],
                });
              }
            } else {
              let takenCardDefId: string | null = null;
              try {
                const res = await recordLoss.mutateAsync({ npcKey });
                if (res.ok) takenCardDefId = res.takenCardDefId;
              } catch {
                // Loss-flag write failed; the result still renders.
              }
              setDuelResult({
                outcome: "opponent_won",
                rewardTier: 0,
                grantCount: 0,
                takenCardDefId,
                restoredCardDefIds: [],
              });
            }
            setPhase("result");
          }}
          onBack={onClose}
        />
      </div>
    );
  }

  /* ─── Phase: result ─── */
  if (!duelResult) return null;
  const won = duelResult.outcome === "player_won";
  const takenCard = duelResult.takenCardDefId
    ? lookupCard(duelResult.takenCardDefId)
    : undefined;
  return (
    <OverlayShell label={won ? "The tray is yours" : "The arithmetic settled"}>
      <p className="font-serif text-[13px] void-text leading-relaxed">
        {won
          ? `${duelResult.grantCount} ${
              duelResult.grantCount === 1 ? "memory" : "memories"
            } folded into your collection — tier ${TIER_LABELS[duelResult.rewardTier]}.`
          : duelResult.takenCardDefId
            ? "You lost the hand. They took the card below from your collection — recoverable on rematch win."
            : "You lost the hand. Nothing they wanted was in your deck — they kept the file open."}
      </p>

      {/* Taken-card portrait — surfaces what was actually lost.
       *  Uses the card's existing art via the shipped registry
       *  (no new assets). Falls back to a typeset card name if
       *  the def isn't in the local registry snapshot. */}
      {!won && duelResult.takenCardDefId && (
        <div className="mt-4 flex items-center gap-3 rounded border void-border bg-stone-900/60 p-3">
          {takenCard?.art && (
            <img
              src={takenCard.art}
              alt={takenCard.name ?? duelResult.takenCardDefId}
              className="h-16 w-12 rounded object-cover void-border border"
            />
          )}
          <div className="min-w-0 flex-1">
            <p className="font-display text-[13px] void-text">
              {takenCard?.name ?? duelResult.takenCardDefId}
            </p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-wider void-text-dim">
              Held by {npcKey}. Win the rematch to recover.
            </p>
          </div>
        </div>
      )}

      {/* Recovered-cards strip — surfaces the Highlander
       *  recovery on rematch win. Multiple cards land as a tile
       *  row; each tile uses the card's own art. */}
      {won && duelResult.restoredCardDefIds.length > 0 && (
        <div className="mt-4">
          <p className="font-mono text-[9px] uppercase tracking-wider void-text-accent mb-2">
            Recovered from the ledger
          </p>
          <div className="flex flex-wrap gap-2">
            {duelResult.restoredCardDefIds.map((cardDefId) => {
              const c = lookupCard(cardDefId);
              return (
                <div
                  key={cardDefId}
                  className="flex flex-col items-center gap-1 rounded border void-border bg-stone-900/60 p-2"
                  title={c?.name ?? cardDefId}
                >
                  {c?.art && (
                    <img
                      src={c.art}
                      alt={c.name ?? cardDefId}
                      className="h-14 w-10 rounded object-cover"
                    />
                  )}
                  <p className="font-mono text-[8px] uppercase tracking-wider void-text-dim max-w-[80px] truncate">
                    {c?.name ?? cardDefId}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <CloseButton onClick={onClose} label={won ? "Take the tray." : "Step away."} />
    </OverlayShell>
  );
}

/* ─── Helpers ─── */

const TIER_LABELS: Record<0 | 1 | 2 | 3, string> = {
  0: "tier 0 (single)",
  1: "tier 1 (handful)",
  2: "tier 2 (pile)",
  3: "tier 3 (full memorial)",
};

function OverlayShell({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 backdrop-blur-md"
    >
      <div className="max-w-xl w-full mx-6 p-8 bg-stone-950/95 border void-border rounded">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] void-text-dim mb-4 text-center">
          {label}
        </p>
        {children}
      </div>
    </div>
  );
}

function CloseButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-6 w-full rounded border void-border bg-cyan-950/40 px-4 py-2 font-mono text-[10px] uppercase tracking-wider void-text hover:bg-cyan-900/60"
    >
      {label}
    </button>
  );
}
