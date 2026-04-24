/* ═══════════════════════════════════════════════════════
   TRADE EMPIRE — EXPANSION PANELS
   Four UI tabs for the four new system clusters:
     • CIVILIZATION (Era, Wonders, Civic Policies)
     • MARKET (Catan-style resource exchange + pirate)
     • COUNCIL (Diplomatic orders + peace conference)
     • CONVERGENCE (Doom / Sanity / Eldritch encounters)
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  Hammer,
  Scale,
  Coins,
  ShieldAlert,
  Eye,
  Skull,
  Rocket,
  Handshake,
} from "lucide-react";
import {
  ERAS,
  WONDERS,
  CIVIC_POLICIES,
  FLEET_DOCTRINES,
  FLEET_UNIT_PROFILES,
  FLEET_UNIT_TYPES,
  ELDRITCH_ENCOUNTERS,
  WHISPER_THRESHOLDS,
  RESOURCES,
  RESOURCE_LABEL,
  ORDER_STANCES,
  STANCE_LABEL,
  STANCE_DESCRIPTION,
  DOOM_SOURCES,
  determineEra,
  eligibleWonders,
  civicsByEra,
  sumCivicModifiers,
  marketRatio,
  executeTrade,
  advancePirate,
  dispatchAgainstPirate,
  resolveOrderPair,
  inferFactionStance,
  resolveConference,
  applyDoctrineToProduction,
  doctrinesByEra,
  applyEncounterChoice,
  availableEncounters,
  sanityPenalty,
  getWonderById,
  getCivicById,
  getDoctrineById,
  addDoom,
  adjustSanity,
  type ExpansionState,
  type EraId,
  type Resource,
  type DiplomaticOrder,
  type CivicSlot,
  type FleetUnitType,
  type ConferenceTreaty,
} from "./tradeEmpireExpansion";
import { GALACTIC_FACTIONS, type GalacticFactionId, type EmpireState } from "./tradeEmpire";
import { tradeEmpireArtUrl } from "./tradeEmpireArtAssets";

/**
 * Renders a Trade Empire art thumbnail by assetId. Returns null if the
 * id is missing or unknown; on image-load failure (asset not yet on
 * CDN) the <img> is hidden and the surrounding card falls back to
 * its text-only state.
 */
function ArtThumb({
  assetId,
  alt,
  className,
}: {
  assetId: string | undefined;
  alt: string;
  className?: string;
}) {
  const url = tradeEmpireArtUrl(assetId);
  if (!url) return null;
  return (
    <img
      src={url}
      alt={alt}
      loading="lazy"
      className={className}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).style.display = "none";
      }}
    />
  );
}

interface PanelProps {
  empire: EmpireState;
  expansion: ExpansionState;
  saveEmpire: (next: EmpireState) => void;
  saveExpansion: (next: ExpansionState) => void;
}

/* ═══════════════════════════════════════════════════════
   CIVILIZATION PANEL — Era, Wonders, Civics
   ═══════════════════════════════════════════════════════ */

export function CivilizationPanel({
  empire,
  expansion,
  saveEmpire,
  saveExpansion,
}: PanelProps) {
  const resolvedArcs = empire.act3
    ? Object.values(empire.act3.arcs).filter((a) => a.status === "resolved").length
    : 0;

  const currentEraInput = {
    controlledSectors: empire.controlledSectors.length,
    resolvedArcs,
    wondersBuilt: expansion.wonders.built.length,
    influence: empire.influence,
  };

  const qualifiedEra = determineEra(currentEraInput);
  const qualifiedEraIdx = ERAS.findIndex((e) => e.id === qualifiedEra);
  const activeEraIdx = ERAS.findIndex((e) => e.id === expansion.era);

  const canAdvanceEra = qualifiedEraIdx > activeEraIdx;

  const advanceEra = useCallback(() => {
    const next = ERAS[activeEraIdx + 1];
    if (!next || next.id !== qualifiedEra) return;
    const withDoom = addDoom(expansion.convergence, "era_advance");
    saveExpansion({
      ...expansion,
      era: next.id,
      eraHistory: [...expansion.eraHistory, next.id],
      lastEraCheck: Date.now(),
      convergence: withDoom,
    });
  }, [activeEraIdx, qualifiedEra, expansion, saveExpansion]);

  const eligible = eligibleWonders(expansion);
  const eligibleCivics = civicsByEra(expansion.era);
  const modifiers = sumCivicModifiers(expansion.civics);

  const startWonder = useCallback(
    (wonderId: string) => {
      const wonder = getWonderById(wonderId);
      if (!wonder) return;
      if (expansion.wonders.inProgress) return;
      if (empire.credits < wonder.cost.credits) return;
      if (empire.materials < wonder.cost.materials) return;
      if (empire.influence < wonder.cost.influence) return;
      saveEmpire({
        ...empire,
        credits: empire.credits - wonder.cost.credits,
        materials: empire.materials - wonder.cost.materials,
        influence: empire.influence - wonder.cost.influence,
      });
      const startedAt = Date.now();
      saveExpansion({
        ...expansion,
        wonders: {
          ...expansion.wonders,
          inProgress: {
            wonderId,
            startedAt,
            endsAt: startedAt + wonder.buildHours * 3600 * 1000,
            progress: 0,
          },
        },
      });
    },
    [empire, expansion, saveEmpire, saveExpansion],
  );

  const completeWonder = useCallback(() => {
    const current = expansion.wonders.inProgress;
    if (!current || Date.now() < current.endsAt) return;
    const wonder = getWonderById(current.wonderId);
    if (!wonder) return;
    const withDoom =
      wonder.convergenceOnBuild !== 0
        ? addDoom(expansion.convergence, "wonder_built_dangerous", wonder.convergenceOnBuild)
        : expansion.convergence;
    const withSanity = wonder.sanityFloor
      ? adjustSanity(withDoom, 5, wonder.sanityFloor)
      : withDoom;
    saveExpansion({
      ...expansion,
      wonders: {
        built: [...expansion.wonders.built, current.wonderId],
        inProgress: null,
      },
      convergence: withSanity,
    });
  }, [expansion, saveExpansion]);

  const setCivic = useCallback(
    (slot: CivicSlot, civicId: string) => {
      if (expansion.civics.cooldownUntil > Date.now()) return;
      saveExpansion({
        ...expansion,
        civics: {
          ...expansion.civics,
          [slot]: civicId,
          cooldownUntil: Date.now() + 1000 * 60 * 60 * 4, // 4h cooldown
        },
      });
    },
    [expansion, saveExpansion],
  );

  const currentEraDef = ERAS[activeEraIdx];
  const nextEraDef = ERAS[activeEraIdx + 1];
  const inProgress = expansion.wonders.inProgress;
  const inProgressWonder = inProgress ? getWonderById(inProgress.wonderId) : null;
  const wonderProgress =
    inProgress && inProgressWonder
      ? Math.min(
          100,
          ((Date.now() - inProgress.startedAt) /
            (inProgress.endsAt - inProgress.startedAt)) *
            100,
        )
      : 0;
  const wonderReady = !!inProgress && Date.now() >= inProgress.endsAt;

  return (
    <div className="space-y-4">
      {/* Era banner */}
      <div
        className="relative p-4 rounded-2xl border overflow-hidden"
        style={{
          backgroundColor: currentEraDef.accent + "15",
          borderColor: currentEraDef.accent + "60",
        }}
      >
        <ArtThumb
          assetId={currentEraDef.banner}
          alt={`${currentEraDef.name} banner`}
          className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none"
        />
        <div className="relative flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Crown size={14} style={{ color: currentEraDef.accent }} />
            <p
              className="font-display text-sm tracking-[0.2em]"
              style={{ color: currentEraDef.accent }}
            >
              ERA — {currentEraDef.name.toUpperCase()}
            </p>
          </div>
          <p className="font-mono text-[9px] text-white/40">
            {activeEraIdx + 1} / {ERAS.length}
          </p>
        </div>
        <p
          className="relative font-mono text-[11px] italic"
          style={{ color: currentEraDef.accent }}
        >
          {currentEraDef.tagline}
        </p>
        <p className="relative font-mono text-[10px] text-white/50 mt-2 leading-relaxed">
          {currentEraDef.description}
        </p>

        {/* Progress toward next era */}
        {nextEraDef && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="font-mono text-[9px] text-white/30 tracking-wider mb-2">
              NEXT ERA — {nextEraDef.name.toUpperCase()}
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[9px]">
              {nextEraDef.gate.controlledSectors != null && (
                <span
                  className={
                    currentEraInput.controlledSectors >= nextEraDef.gate.controlledSectors
                      ? "void-text-energy"
                      : "text-white/40"
                  }
                >
                  Sectors: {currentEraInput.controlledSectors}/
                  {nextEraDef.gate.controlledSectors}
                </span>
              )}
              {nextEraDef.gate.resolvedArcs != null && (
                <span
                  className={
                    currentEraInput.resolvedArcs >= nextEraDef.gate.resolvedArcs
                      ? "void-text-energy"
                      : "text-white/40"
                  }
                >
                  Arcs: {currentEraInput.resolvedArcs}/{nextEraDef.gate.resolvedArcs}
                </span>
              )}
              {nextEraDef.gate.wondersBuilt != null && (
                <span
                  className={
                    currentEraInput.wondersBuilt >= nextEraDef.gate.wondersBuilt
                      ? "void-text-energy"
                      : "text-white/40"
                  }
                >
                  Wonders: {currentEraInput.wondersBuilt}/{nextEraDef.gate.wondersBuilt}
                </span>
              )}
              {nextEraDef.gate.influence != null && (
                <span
                  className={
                    currentEraInput.influence >= nextEraDef.gate.influence
                      ? "void-text-energy"
                      : "text-white/40"
                  }
                >
                  Influence: {currentEraInput.influence}/{nextEraDef.gate.influence}
                </span>
              )}
            </div>
            {canAdvanceEra && (
              <button
                onClick={advanceEra}
                className="w-full mt-3 py-2 rounded-lg void-bg-success border void-border-success void-text-energy font-mono text-[11px] font-bold"
              >
                ADVANCE TO {nextEraDef.name.toUpperCase()}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Wonders */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Hammer size={12} className="void-text-accent" />
          <p className="font-mono text-[10px] text-white/50 tracking-wider">
            WONDERS ({expansion.wonders.built.length} BUILT)
          </p>
        </div>

        {/* In-progress wonder */}
        {inProgress && inProgressWonder && (
          <div className="p-3 rounded-xl void-bg-success border void-border-success mb-2 flex gap-3">
            <ArtThumb
              assetId={inProgressWonder.image}
              alt={`${inProgressWonder.name} key art`}
              className="w-12 h-16 object-cover rounded flex-shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs void-text-energy font-bold">
                  BUILDING: {inProgressWonder.name}
                </p>
                <span className="font-mono text-[9px] void-text-energy">
                  {Math.round(wonderProgress)}%
                </span>
              </div>
            <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden mt-2">
              <div
                className="h-full rounded-full void-bg-success transition-all"
                style={{ width: `${wonderProgress}%` }}
              />
            </div>
              {wonderReady && (
                <button
                  onClick={completeWonder}
                  className="w-full mt-2 py-1.5 rounded void-bg-success border void-border-success void-text-energy font-mono text-[10px] font-bold"
                >
                  COMPLETE WONDER
                </button>
              )}
            </div>
          </div>
        )}

        {/* Completed wonders */}
        {expansion.wonders.built.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-3">
            {expansion.wonders.built.map((id) => {
              const w = getWonderById(id);
              if (!w) return null;
              return (
                <div
                  key={id}
                  className="rounded-lg bg-white/[0.04] border border-white/10 overflow-hidden"
                >
                  <ArtThumb
                    assetId={w.image}
                    alt={`${w.name} key art`}
                    className="w-full h-20 object-cover"
                  />
                  <div className="p-2">
                    <p className="font-mono text-[10px] void-text-energy font-bold">
                      ✓ {w.name}
                    </p>
                    <p className="font-mono text-[8px] text-white/40 mt-0.5 italic">
                      {w.flavor}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Available wonders */}
        {!inProgress && eligible.length > 0 && (
          <div className="space-y-2">
            {eligible.map((w) => {
              const canAfford =
                empire.credits >= w.cost.credits &&
                empire.materials >= w.cost.materials &&
                empire.influence >= w.cost.influence;
              const faction = GALACTIC_FACTIONS[w.lineage];
              return (
                <button
                  key={w.id}
                  disabled={!canAfford}
                  onClick={() => startWonder(w.id)}
                  className={`w-full text-left rounded-xl border transition-colors overflow-hidden flex gap-3 ${
                    canAfford
                      ? "bg-white/[0.02] border-white/10 hover:bg-white/[0.04]"
                      : "bg-white/[0.01] border-white/5 opacity-40"
                  }`}
                >
                  <ArtThumb
                    assetId={w.image}
                    alt={`${w.name} key art`}
                    className="w-16 h-24 object-cover flex-shrink-0"
                  />
                  <div className="flex-1 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: faction.color }}
                      />
                      <p className="font-mono text-xs text-white font-bold">{w.name}</p>
                      <span className="font-mono text-[8px] text-white/30 ml-auto">
                        {w.buildHours}h
                      </span>
                    </div>
                    <p className="font-mono text-[9px] text-white/40 italic">{w.flavor}</p>
                    <p className="font-mono text-[9px] void-text-accent mt-1">{w.effect}</p>
                    <div className="flex gap-3 mt-1.5 font-mono text-[9px] text-white/50">
                      <span className="void-text-accent">{w.cost.credits} CRD</span>
                      <span className="void-text-energy">{w.cost.materials} MAT</span>
                      <span className="void-text-system">{w.cost.influence} INF</span>
                      {w.convergenceOnBuild > 0 && (
                        <span className="void-text-error">+{w.convergenceOnBuild} doom</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Civic Policies */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Scale size={12} className="void-text-accent" />
          <p className="font-mono text-[10px] text-white/50 tracking-wider">
            CIVIC POLICIES
          </p>
        </div>

        {/* Modifier summary */}
        <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/10 mb-2 grid grid-cols-2 md:grid-cols-4 gap-2 font-mono text-[9px]">
          <span className="text-white/50">
            Credits/cyc: <span className="void-text-accent">{modifiers.creditsPerCycle >= 0 ? "+" : ""}{modifiers.creditsPerCycle}</span>
          </span>
          <span className="text-white/50">
            Influence/cyc: <span className="void-text-system">{modifiers.influencePerCycle >= 0 ? "+" : ""}{modifiers.influencePerCycle}</span>
          </span>
          <span className="text-white/50">
            Sanity/cyc: <span className="void-text-energy">{modifiers.sanityPerCycle >= 0 ? "+" : ""}{modifiers.sanityPerCycle}</span>
          </span>
          <span className="text-white/50">
            Doom/cyc: <span className="void-text-error">{modifiers.doomPerCycle >= 0 ? "+" : ""}{modifiers.doomPerCycle}</span>
          </span>
        </div>

        {(["doctrine", "economy", "order"] as CivicSlot[]).map((slot) => {
          const options = eligibleCivics.filter((c) => c.slot === slot);
          const currentId = expansion.civics[slot];
          return (
            <div key={slot} className="mb-3">
              <p className="font-mono text-[9px] text-white/40 tracking-wider mb-1.5 uppercase">
                {slot} slot
              </p>
              <div className="space-y-1.5">
                {options.length === 0 && (
                  <p className="font-mono text-[9px] text-white/30 italic">
                    No {slot} policies unlocked this era.
                  </p>
                )}
                {options.map((c) => {
                  const active = currentId === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setCivic(slot, c.id)}
                      disabled={active || expansion.civics.cooldownUntil > Date.now()}
                      className={`w-full text-left p-2 rounded-lg border transition-colors flex gap-2 ${
                        active
                          ? "void-bg-success void-border-success"
                          : "bg-white/[0.02] border-white/10 hover:bg-white/[0.04]"
                      }`}
                    >
                      <ArtThumb
                        assetId={c.icon}
                        alt={`${c.name} icon`}
                        className="w-8 h-8 object-contain flex-shrink-0 rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-mono text-[10px] font-bold ${
                            active ? "void-text-energy" : "text-white"
                          }`}
                        >
                          {active ? "✓ " : ""}
                          {c.name}
                        </p>
                        <p className="font-mono text-[9px] text-white/40 mt-0.5">
                          {c.description}
                        </p>
                        <p className="font-mono text-[9px] void-text-accent mt-0.5">
                          {c.effect}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {expansion.civics.cooldownUntil > Date.now() && (
          <p className="font-mono text-[9px] text-white/30 italic mt-1">
            Civics cooldown: {Math.ceil((expansion.civics.cooldownUntil - Date.now()) / (1000 * 60))}m
          </p>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MARKET PANEL — Catan-style resource exchange + pirate.
   ═══════════════════════════════════════════════════════ */

export function MarketPanel({
  empire,
  expansion,
  saveEmpire,
  saveExpansion,
}: PanelProps) {
  const [give, setGive] = useState<Resource>("credits");
  const [receive, setReceive] = useState<Resource>("materials");
  const [amount, setAmount] = useState(4);
  const [error, setError] = useState<string | null>(null);

  const hasTradePort = useMemo(() => {
    // Any controlled sector counts as a port for now
    return empire.controlledSectors.length >= 2;
  }, [empire.controlledSectors]);

  const hasMonopoly = useMemo(() => {
    return expansion.wonders.built.includes("red_crystal_spire");
  }, [expansion.wonders.built]);

  const ratio = marketRatio({
    hasTradePort,
    hasMonopoly,
    civicEconomyId: expansion.civics.economy,
  });

  const executeTradeClick = useCallback(() => {
    setError(null);
    if (give === receive) {
      setError("Pick two different resources.");
      return;
    }
    const available = (empire[give] as number) ?? 0;
    const result = executeTrade({ give, giveAmount: amount, receive, ratio }, available);
    if (!result.success || !result.trade || result.receivedAmount == null) {
      setError(result.error ?? "Trade failed.");
      return;
    }
    saveEmpire({
      ...empire,
      [give]: (empire[give] as number) - amount,
      [receive]: (empire[receive] as number) + result.receivedAmount,
    });
    saveExpansion({
      ...expansion,
      market: {
        ...expansion.market,
        trades: [result.trade, ...expansion.market.trades].slice(0, 30),
      },
    });
  }, [give, receive, amount, ratio, empire, expansion, saveEmpire, saveExpansion]);

  // ─── Pirate controls ───
  const tickPirate = useCallback(() => {
    const result = advancePirate({
      pirate: expansion.pirate,
      controlledSectors: empire.controlledSectors,
      rng: Math.random(),
    });
    saveExpansion({ ...expansion, pirate: result.next });
  }, [empire.controlledSectors, expansion, saveExpansion]);

  const dispatchRaid = useCallback(() => {
    const result = dispatchAgainstPirate(expansion.pirate, empire.credits);
    if (!result.success) {
      setError(result.narrative);
      return;
    }
    saveEmpire({ ...empire, credits: empire.credits - result.creditsCost });
    saveExpansion({
      ...expansion,
      pirate: {
        ...result.next,
        totalStolen: expansion.pirate.totalStolen,
      },
    });
  }, [empire, expansion, saveEmpire, saveExpansion]);

  return (
    <div className="space-y-4">
      {/* Market banner */}
      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
        <div className="flex items-center gap-2 mb-1">
          <Coins size={12} className="void-text-accent" />
          <p className="font-mono text-[10px] tracking-wider void-text-accent">
            BANK MARKET — RATIO {ratio}:1
          </p>
        </div>
        <p className="font-mono text-[9px] text-white/40">
          {hasMonopoly
            ? "Red Crystal Spire monopoly active. Bank trades at 2:1."
            : hasTradePort
            ? "Trade ports active. Bank trades at 3:1."
            : "No ports — bank trades at 4:1. Claim sectors to unlock better rates."}
        </p>
      </div>

      {/* Trade builder */}
      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
        <p className="font-mono text-[10px] text-white/30 tracking-wider">BUILD TRADE</p>

        <div className="grid grid-cols-3 gap-2 items-center">
          {/* GIVE */}
          <div>
            <p className="font-mono text-[9px] text-white/40 mb-1">GIVE</p>
            <select
              value={give}
              onChange={(e) => setGive(e.target.value as Resource)}
              className="w-full px-2 py-1.5 rounded bg-black/60 border border-white/10 font-mono text-[10px] text-white"
            >
              {RESOURCES.map((r) => (
                <option key={r} value={r}>
                  {RESOURCE_LABEL[r]}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value || "0", 10))}
              step={ratio}
              min={ratio}
              className="w-full px-2 py-1.5 mt-1 rounded bg-black/60 border border-white/10 font-mono text-[10px] text-white"
            />
            <p className="font-mono text-[8px] text-white/30 mt-0.5">
              Have: {(empire[give] as number) ?? 0}
            </p>
          </div>

          {/* ARROW */}
          <div className="text-center font-mono text-xs text-white/40">
            → {Math.floor(amount / ratio)} →
          </div>

          {/* RECEIVE */}
          <div>
            <p className="font-mono text-[9px] text-white/40 mb-1">RECEIVE</p>
            <select
              value={receive}
              onChange={(e) => setReceive(e.target.value as Resource)}
              className="w-full px-2 py-1.5 rounded bg-black/60 border border-white/10 font-mono text-[10px] text-white"
            >
              {RESOURCES.filter((r) => r !== give).map((r) => (
                <option key={r} value={r}>
                  {RESOURCE_LABEL[r]}
                </option>
              ))}
            </select>
            <p className="font-mono text-[8px] text-white/30 mt-0.5">
              Will gain: {Math.floor(amount / ratio)}
            </p>
          </div>
        </div>

        {error && (
          <p className="font-mono text-[9px] void-text-error italic">{error}</p>
        )}

        <button
          onClick={executeTradeClick}
          className="w-full py-2 rounded-lg void-bg-success border void-border-success void-text-energy font-mono text-[11px] font-bold"
        >
          EXECUTE TRADE
        </button>
      </div>

      {/* Pirate raider panel */}
      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <ShieldAlert size={12} className="void-text-error" />
          <p className="font-mono text-[10px] void-text-error tracking-wider">
            PIRATE RAIDER
          </p>
        </div>
        {expansion.pirate.parkedSector ? (
          <div className="flex gap-3">
            <ArtThumb
              assetId="market_pirate_raider"
              alt="Pirate raider portrait"
              className="w-16 h-16 object-cover rounded flex-shrink-0"
            />
            <div className="flex-1">
              <p className="font-mono text-[10px] text-white/60">
                Parked on:{" "}
                <span className="void-text-error font-bold">
                  {expansion.pirate.parkedSector}
                </span>
                {" "} ({expansion.pirate.cyclesOnSector} cycles)
              </p>
              <p className="font-mono text-[9px] text-white/40 italic mt-1">
                That sector's income is blocked until dislodged.
              </p>
              <button
                onClick={dispatchRaid}
                className="w-full mt-2 py-1.5 rounded void-bg-error border void-border-error void-text-error font-mono text-[10px] font-bold"
              >
                DISPATCH FLEET (50 CRD)
              </button>
            </div>
          </div>
        ) : (
          <p className="font-mono text-[10px] text-white/40 italic">
            Pirate out of range. No sector blocked.
          </p>
        )}
        <button
          onClick={tickPirate}
          className="w-full mt-2 py-1 rounded bg-white/5 border border-white/10 text-white/50 font-mono text-[9px] hover:text-white/70"
        >
          ADVANCE PIRATE (SIMULATE CYCLE)
        </button>
        <p className="font-mono text-[8px] text-white/25 mt-1">
          Lifetime stolen: {expansion.pirate.totalStolen} credits
        </p>
      </div>

      {/* Trade history */}
      {expansion.market.trades.length > 0 && (
        <div>
          <p className="font-mono text-[10px] text-white/30 tracking-wider mb-2">
            RECENT TRADES
          </p>
          <div className="space-y-1">
            {expansion.market.trades.slice(0, 8).map((t) => (
              <div
                key={t.id}
                className="p-2 rounded-lg bg-white/[0.02] border border-white/10 font-mono text-[9px] text-white/60"
              >
                -{t.giveAmount} {RESOURCE_LABEL[t.give]} / +{t.receiveAmount} {RESOURCE_LABEL[t.receive]}
                <span className="ml-2 text-white/20">
                  {new Date(t.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   COUNCIL PANEL — Simultaneous diplomatic orders +
   peace conference (Diplomacy board game).
   ═══════════════════════════════════════════════════════ */

export function CouncilPanel({
  empire,
  expansion,
  saveEmpire,
  saveExpansion,
}: PanelProps) {
  const knownFactions = useMemo(() => {
    return (Object.keys(empire.diplomacy) as GalacticFactionId[]).filter((f) => {
      const faction = GALACTIC_FACTIONS[f];
      return faction && faction.id !== "potentials";
    });
  }, [empire.diplomacy]);

  const [selectedConferenceParties, setSelectedConferenceParties] = useState<
    GalacticFactionId[]
  >([]);
  const [selectedTreaty, setSelectedTreaty] = useState<ConferenceTreaty["type"]>(
    "cease_fire",
  );

  const setOrder = useCallback(
    (factionId: GalacticFactionId, order: DiplomaticOrder) => {
      saveExpansion({
        ...expansion,
        orders: {
          ...expansion.orders,
          submitted: { ...expansion.orders.submitted, [factionId]: order },
        },
      });
    },
    [expansion, saveExpansion],
  );

  const resolveCycle = useCallback(() => {
    const cycle = expansion.orders.cycle;
    const resolutions = knownFactions.map((f) => {
      const player = expansion.orders.submitted[f]?.stance ?? "hold";
      const dip = empire.diplomacy[f];
      const attitude =
        dip?.reputation > 50
          ? ("allied" as const)
          : dip?.reputation > 20
          ? ("friendly" as const)
          : dip?.reputation > -20
          ? ("neutral" as const)
          : dip?.reputation > -50
          ? ("cautious" as const)
          : ("hostile" as const);
      const factionStance = inferFactionStance(f, cycle, attitude);
      return resolveOrderPair(f, player, factionStance);
    });

    // Apply reputation deltas to empire state
    const nextDiplomacy = { ...empire.diplomacy };
    for (const r of resolutions) {
      const current = nextDiplomacy[r.factionId];
      if (!current) continue;
      nextDiplomacy[r.factionId] = {
        ...current,
        reputation: Math.max(
          -100,
          Math.min(100, current.reputation + r.reputationDelta),
        ),
        lastInteraction: Date.now(),
      };
    }
    saveEmpire({ ...empire, diplomacy: nextDiplomacy });
    saveExpansion({
      ...expansion,
      orders: {
        cycle: cycle + 1,
        submitted: {},
        lastResolution: resolutions,
      },
    });
  }, [empire, expansion, knownFactions, saveEmpire, saveExpansion]);

  const convene = useCallback(() => {
    if (selectedConferenceParties.length < 2) return;
    const cost = 25 * selectedConferenceParties.length;
    if (empire.influence < cost) return;

    const attitudes: Partial<
      Record<GalacticFactionId, "hostile" | "neutral" | "cautious" | "friendly" | "allied">
    > = {};
    for (const f of selectedConferenceParties) {
      const dip = empire.diplomacy[f];
      if (!dip) {
        attitudes[f] = "neutral";
        continue;
      }
      attitudes[f] =
        dip.reputation > 50
          ? "allied"
          : dip.reputation > 20
          ? "friendly"
          : dip.reputation > -20
          ? "neutral"
          : dip.reputation > -50
          ? "cautious"
          : "hostile";
    }

    const result = resolveConference({
      proposal: {
        invited: selectedConferenceParties,
        treaties: [
          {
            type: selectedTreaty,
            parties: selectedConferenceParties,
            terms: `A ${selectedTreaty.replace(/_/g, " ")} between ${selectedConferenceParties.length} parties.`,
          },
        ],
        influenceCost: cost,
      },
      attitudes,
      rng: Math.random(),
    });

    const nextDiplomacy = { ...empire.diplomacy };
    for (const [fId, delta] of Object.entries(result.reputationDeltas)) {
      const current = nextDiplomacy[fId as GalacticFactionId];
      if (!current) continue;
      nextDiplomacy[fId as GalacticFactionId] = {
        ...current,
        reputation: Math.max(-100, Math.min(100, current.reputation + (delta ?? 0))),
      };
    }

    saveEmpire({
      ...empire,
      influence: empire.influence - cost,
      diplomacy: nextDiplomacy,
    });
    saveExpansion({
      ...expansion,
      conferences: [result.conference, ...expansion.conferences].slice(0, 20),
    });
    setSelectedConferenceParties([]);
  }, [selectedConferenceParties, selectedTreaty, empire, expansion, saveEmpire, saveExpansion]);

  const toggleParty = (f: GalacticFactionId) => {
    setSelectedConferenceParties((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f],
    );
  };

  return (
    <div className="space-y-4">
      {/* Cycle header */}
      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] void-text-accent tracking-wider">
            CYCLE {expansion.orders.cycle}
          </p>
          <p className="font-mono text-[9px] text-white/40 mt-0.5">
            {Object.keys(expansion.orders.submitted).length} / {knownFactions.length} orders committed
          </p>
        </div>
        <button
          onClick={resolveCycle}
          disabled={Object.keys(expansion.orders.submitted).length === 0}
          className="px-3 py-2 rounded-lg void-bg-success border void-border-success void-text-energy font-mono text-[10px] font-bold disabled:opacity-40"
        >
          RESOLVE CYCLE
        </button>
      </div>

      {/* Orders */}
      <div>
        <p className="font-mono text-[10px] text-white/30 tracking-wider mb-2">
          COMMIT ORDERS (ALL RESOLVE SIMULTANEOUSLY)
        </p>
        <div className="space-y-2">
          {knownFactions.map((f) => {
            const faction = GALACTIC_FACTIONS[f];
            const committed = expansion.orders.submitted[f];
            return (
              <div
                key={f}
                className="p-2.5 rounded-lg bg-white/[0.02] border border-white/10"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: faction.color }}
                  />
                  <p className="font-mono text-[11px] font-bold text-white flex-1">
                    {faction.name}
                  </p>
                  <span className="font-mono text-[9px] text-white/40">
                    rep {empire.diplomacy[f]?.reputation ?? 0}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {ORDER_STANCES.map((s) => {
                    const active = committed?.stance === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setOrder(f, { stance: s })}
                        className={`px-2 py-1 rounded font-mono text-[9px] border ${
                          active
                            ? "void-bg-success void-border-success void-text-energy"
                            : "bg-white/[0.02] border-white/10 text-white/50 hover:text-white/80"
                        }`}
                        title={STANCE_DESCRIPTION[s]}
                      >
                        {STANCE_LABEL[s]}
                      </button>
                    );
                  })}
                </div>
                {committed && (
                  <p className="font-mono text-[8px] text-white/30 italic mt-1">
                    {STANCE_DESCRIPTION[committed.stance]}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Last resolution */}
      {expansion.orders.lastResolution.length > 0 && (
        <div>
          <p className="font-mono text-[10px] text-white/30 tracking-wider mb-2">
            LAST CYCLE OUTCOMES
          </p>
          <div className="space-y-1.5">
            {expansion.orders.lastResolution.map((r) => {
              const faction = GALACTIC_FACTIONS[r.factionId];
              const outcomeColor =
                r.outcome === "aligned"
                  ? "void-text-energy"
                  : r.outcome === "betrayal"
                  ? "void-text-error"
                  : r.outcome === "misread"
                  ? "void-text-premium"
                  : "text-white/50";
              return (
                <div
                  key={r.factionId}
                  className="p-2 rounded-lg bg-white/[0.02] border border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[10px] font-bold text-white">
                      {faction?.name}
                    </p>
                    <span className={`font-mono text-[9px] font-bold ${outcomeColor}`}>
                      {r.outcome.toUpperCase()} · {r.reputationDelta >= 0 ? "+" : ""}
                      {r.reputationDelta}
                    </span>
                  </div>
                  <p className="font-mono text-[9px] text-white/40 mt-0.5">
                    You: {STANCE_LABEL[r.playerStance]} · They: {STANCE_LABEL[r.factionStance]}
                  </p>
                  <p className="font-mono text-[9px] text-white/50 italic mt-0.5">
                    {r.narrative}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Peace conference */}
      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
        <div className="flex items-center gap-2">
          <Handshake size={12} className="void-text-accent" />
          <p className="font-mono text-[10px] void-text-accent tracking-wider">
            CONVENE PEACE CONFERENCE
          </p>
        </div>
        <p className="font-mono text-[9px] text-white/40">
          Invite two or more factions to simultaneously sign a treaty. Hostile
          invitees can collapse the summit.
        </p>

        <div>
          <p className="font-mono text-[9px] text-white/30 mb-1">TREATY TYPE</p>
          <select
            value={selectedTreaty}
            onChange={(e) =>
              setSelectedTreaty(e.target.value as ConferenceTreaty["type"])
            }
            className="w-full px-2 py-1.5 rounded bg-black/60 border border-white/10 font-mono text-[10px] text-white"
          >
            <option value="cease_fire">Cease-Fire</option>
            <option value="trade_accord">Trade Accord</option>
            <option value="mutual_defense">Mutual Defense Pact</option>
            <option value="territory_cession">Territory Cession</option>
            <option value="non_interference">Non-Interference Pledge</option>
          </select>
        </div>

        <div>
          <p className="font-mono text-[9px] text-white/30 mb-1">
            INVITE (min 2) — {selectedConferenceParties.length} selected
          </p>
          <div className="grid grid-cols-2 gap-1">
            {knownFactions.map((f) => {
              const faction = GALACTIC_FACTIONS[f];
              const selected = selectedConferenceParties.includes(f);
              return (
                <button
                  key={f}
                  onClick={() => toggleParty(f)}
                  className={`p-1.5 rounded text-left font-mono text-[9px] border ${
                    selected
                      ? "void-bg-success void-border-success void-text-energy"
                      : "bg-white/[0.02] border-white/10 text-white/50"
                  }`}
                  style={{ borderColor: selected ? undefined : faction.color + "30" }}
                >
                  {selected ? "✓ " : ""}
                  {faction?.name?.replace("The ", "")}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={convene}
          disabled={
            selectedConferenceParties.length < 2 ||
            empire.influence < 25 * selectedConferenceParties.length
          }
          className="w-full py-2 rounded-lg void-bg-success border void-border-success void-text-energy font-mono text-[11px] font-bold disabled:opacity-30"
        >
          CONVENE ({25 * selectedConferenceParties.length} INF)
        </button>
      </div>

      {/* Conference history */}
      {expansion.conferences.length > 0 && (
        <div>
          <p className="font-mono text-[10px] text-white/30 tracking-wider mb-2">
            CONFERENCE LOG
          </p>
          <div className="space-y-1.5">
            {expansion.conferences.slice(0, 5).map((c) => (
              <div
                key={c.id}
                className="p-2 rounded-lg bg-white/[0.02] border border-white/10"
              >
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[10px] text-white font-bold">
                    {c.treaties.map((t) => t.type).join(" + ")}
                  </p>
                  <span
                    className={`font-mono text-[9px] font-bold ${
                      c.outcome === "signed"
                        ? "void-text-energy"
                        : "void-text-error"
                    }`}
                  >
                    {c.outcome.toUpperCase()}
                  </span>
                </div>
                <p className="font-mono text-[9px] text-white/40 mt-0.5">
                  {c.participants.map((p) => GALACTIC_FACTIONS[p]?.name?.replace("The ", "")).join(", ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   WAR ROOM PANEL — StarCraft-style fleet doctrines
   and production queue.
   ═══════════════════════════════════════════════════════ */

export function WarRoomPanel({
  empire,
  expansion,
  saveEmpire,
  saveExpansion,
}: PanelProps) {
  const available = doctrinesByEra(expansion.era);
  const activeDoctrine = expansion.fleetDoctrine.active
    ? getDoctrineById(expansion.fleetDoctrine.active) ?? null
    : null;

  const setDoctrine = useCallback(
    (id: string) => {
      saveExpansion({
        ...expansion,
        fleetDoctrine: { ...expansion.fleetDoctrine, active: id },
      });
    },
    [expansion, saveExpansion],
  );

  const startProduction = useCallback(
    (type: FleetUnitType, sectorId: string) => {
      const adjusted = applyDoctrineToProduction(type, activeDoctrine);
      if (empire.credits < adjusted.cost.credits) return;
      if (empire.materials < adjusted.cost.materials) return;
      const startedAt = Date.now();
      saveEmpire({
        ...empire,
        credits: empire.credits - adjusted.cost.credits,
        materials: empire.materials - adjusted.cost.materials,
      });
      saveExpansion({
        ...expansion,
        fleetDoctrine: {
          ...expansion.fleetDoctrine,
          queue: [
            ...expansion.fleetDoctrine.queue,
            {
              id: `prod_${Date.now()}`,
              sectorId,
              unitType: type,
              startedAt,
              endsAt: startedAt + adjusted.buildHours * 3600 * 1000,
            },
          ],
        },
      });
    },
    [activeDoctrine, empire, expansion, saveEmpire, saveExpansion],
  );

  const completeProduction = useCallback(
    (orderId: string) => {
      const order = expansion.fleetDoctrine.queue.find((o) => o.id === orderId);
      if (!order || Date.now() < order.endsAt) return;
      saveExpansion({
        ...expansion,
        fleetDoctrine: {
          ...expansion.fleetDoctrine,
          queue: expansion.fleetDoctrine.queue.filter((o) => o.id !== orderId),
          composition: {
            ...expansion.fleetDoctrine.composition,
            [order.unitType]:
              (expansion.fleetDoctrine.composition[order.unitType] ?? 0) + 1,
          },
        },
      });
    },
    [expansion, saveExpansion],
  );

  return (
    <div className="space-y-4">
      {/* Doctrine selector */}
      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <Rocket size={12} className="void-text-accent" />
          <p className="font-mono text-[10px] void-text-accent tracking-wider">
            FLEET DOCTRINE
          </p>
        </div>
        {available.length === 0 && (
          <p className="font-mono text-[10px] text-white/40 italic">
            No doctrines available yet. Reach Galactic Power era.
          </p>
        )}
        <div className="space-y-1.5">
          {available.map((d) => {
            const active = expansion.fleetDoctrine.active === d.id;
            return (
              <button
                key={d.id}
                onClick={() => setDoctrine(d.id)}
                className={`w-full text-left rounded-lg border overflow-hidden ${
                  active
                    ? "void-bg-success void-border-success"
                    : "bg-white/[0.02] border-white/10 hover:bg-white/[0.04]"
                }`}
              >
                <ArtThumb
                  assetId={d.banner}
                  alt={`${d.name} banner`}
                  className="w-full h-16 object-cover"
                />
                <div className="p-2">
                  <p
                    className={`font-mono text-[11px] font-bold ${
                      active ? "void-text-energy" : "text-white"
                    }`}
                  >
                    {active ? "✓ " : ""}
                    {d.name}
                  </p>
                  <p className="font-mono text-[9px] text-white/40 italic">
                    {d.flavor}
                  </p>
                  {d.convergencePerCycle > 0 && (
                    <p className="font-mono text-[8px] void-text-error mt-0.5">
                      +{d.convergencePerCycle} doom/cycle while active
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Composition + production */}
      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
        <p className="font-mono text-[10px] text-white/30 tracking-wider mb-2">
          FLEET COMPOSITION
        </p>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {FLEET_UNIT_TYPES.map((t) => {
            const count = expansion.fleetDoctrine.composition[t] ?? 0;
            const profile = FLEET_UNIT_PROFILES[t];
            return (
              <div
                key={t}
                className="p-2 rounded-lg bg-white/[0.02] border border-white/10 text-center"
              >
                <ArtThumb
                  assetId={profile.silhouette}
                  alt={`${profile.label} silhouette`}
                  className="mx-auto mb-1 w-10 h-10 object-contain"
                />
                <p className="font-mono text-[9px] text-white/40 tracking-wider uppercase">
                  {t}
                </p>
                <p className="font-mono text-lg text-white font-bold">{count}</p>
              </div>
            );
          })}
        </div>

        <p className="font-mono text-[9px] text-white/30 tracking-wider mb-2">
          BUILD ORDER
        </p>
        <div className="space-y-1.5">
          {FLEET_UNIT_TYPES.filter((t) => t !== "flagship").map((t) => {
            const profile = FLEET_UNIT_PROFILES[t];
            const cost = applyDoctrineToProduction(t, activeDoctrine);
            const canAfford =
              empire.credits >= cost.cost.credits &&
              empire.materials >= cost.cost.materials &&
              empire.controlledSectors.length > 0;
            return (
              <button
                key={t}
                disabled={!canAfford}
                onClick={() => startProduction(t, empire.controlledSectors[0])}
                className={`w-full text-left p-2 rounded-lg border ${
                  canAfford
                    ? "bg-white/[0.02] border-white/10 hover:bg-white/[0.04]"
                    : "bg-white/[0.01] border-white/5 opacity-40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[10px] text-white font-bold">
                    BUILD {profile.label.toUpperCase()}
                  </p>
                  <span className="font-mono text-[9px] text-white/50">
                    {cost.cost.credits} CRD · {cost.cost.materials} MAT ·{" "}
                    {cost.buildHours.toFixed(1)}h
                  </span>
                </div>
                <p className="font-mono text-[9px] text-white/40 mt-0.5">
                  {profile.role}
                </p>
                <p className="font-mono text-[8px] text-white/30 mt-0.5">
                  Counters: {profile.counters.join(", ") || "none"} · Weak to:{" "}
                  {profile.counteredBy.join(", ") || "none"}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Production queue */}
      {expansion.fleetDoctrine.queue.length > 0 && (
        <div className="space-y-1.5">
          <p className="font-mono text-[10px] text-white/30 tracking-wider">
            PRODUCTION QUEUE
          </p>
          {expansion.fleetDoctrine.queue.map((q) => {
            const progress = Math.min(
              100,
              ((Date.now() - q.startedAt) / (q.endsAt - q.startedAt)) * 100,
            );
            const ready = Date.now() >= q.endsAt;
            return (
              <div
                key={q.id}
                className="p-2 rounded-lg bg-white/[0.02] border border-white/10"
              >
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[10px] text-white font-bold">
                    {FLEET_UNIT_PROFILES[q.unitType].label}
                  </p>
                  <span className="font-mono text-[9px] text-white/30">
                    {ready ? "READY" : `${Math.round(progress)}%`}
                  </span>
                </div>
                <div className="w-full h-1 rounded-full bg-white/5 overflow-hidden mt-1">
                  <div
                    className="h-full rounded-full void-bg-success"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                {ready && (
                  <button
                    onClick={() => completeProduction(q.id)}
                    className="w-full mt-1.5 py-1 rounded void-bg-success border void-border-success void-text-energy font-mono text-[9px] font-bold"
                  >
                    COMMISSION
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CONVERGENCE PANEL — Doom, sanity, whispers, encounters.
   The cosmic horror layer.
   ═══════════════════════════════════════════════════════ */

export function ConvergencePanel({
  empire,
  expansion,
  saveEmpire,
  saveExpansion,
}: PanelProps) {
  const { convergence } = expansion;
  const penalty = sanityPenalty(convergence.sanity);
  const available = availableEncounters(convergence);

  const [activeEncounterId, setActiveEncounterId] = useState<string | null>(null);
  const active = ELDRITCH_ENCOUNTERS.find((e) => e.id === activeEncounterId);

  const resolveChoice = useCallback(
    (encounterId: string, choiceId: string) => {
      const result = applyEncounterChoice({
        convergence,
        encounterId,
        choiceId,
      });
      if (!result) return;
      saveExpansion({ ...expansion, convergence: result.next });
      setActiveEncounterId(null);
    },
    [convergence, expansion, saveExpansion],
  );

  const doomColor =
    convergence.doom >= 75
      ? "void-text-error"
      : convergence.doom >= 50
      ? "void-text-premium"
      : convergence.doom >= 25
      ? "void-text-accent"
      : "void-text-energy";

  const sanityColor =
    convergence.sanity >= 60
      ? "void-text-energy"
      : convergence.sanity >= 30
      ? "void-text-accent"
      : "void-text-error";

  return (
    <div className="space-y-4">
      {/* Doom + Sanity banner */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <Skull size={12} className="void-text-error" />
            <p className="font-mono text-[10px] tracking-wider void-text-error">
              THE CONVERGENCE
            </p>
          </div>
          <p className={`font-mono text-2xl font-bold ${doomColor}`}>
            {convergence.doom} / 100
          </p>
          <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden mt-1">
            <div
              className="h-full rounded-full void-bg-error"
              style={{ width: `${convergence.doom}%` }}
            />
          </div>
          <p className="font-mono text-[9px] text-white/40 mt-1 italic">
            {convergence.doom >= 90
              ? "Imminent. They are at the threshold."
              : convergence.doom >= 60
              ? "Gathering. The Dreamer's barrier hums differently."
              : convergence.doom >= 30
              ? "Rising. Whispers log in the archive."
              : "Low. The old silence holds."}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <Eye size={12} className="void-text-accent" />
            <p className="font-mono text-[10px] tracking-wider void-text-accent">
              EMPIRE SANITY
            </p>
          </div>
          <p className={`font-mono text-2xl font-bold ${sanityColor}`}>
            {convergence.sanity} / 100
          </p>
          <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden mt-1">
            <div
              className="h-full rounded-full void-bg-success"
              style={{ width: `${convergence.sanity}%` }}
            />
          </div>
          <p className="font-mono text-[9px] text-white/40 mt-1 italic">
            {penalty.description}
          </p>
        </div>
      </div>

      {/* Final awakening flag */}
      {convergence.finalAwakening && (
        <div className="p-3 rounded-xl void-bg-error border void-border-error">
          <p className="font-mono text-[11px] font-bold void-text-error tracking-wider">
            FINAL AWAKENING TRIGGERED
          </p>
          <p className="font-mono text-[10px] text-white/70 italic mt-1">
            The door is open. Act 3's ordinary ending no longer applies. The story
            continues — differently.
          </p>
        </div>
      )}

      {/* Available encounters */}
      {available.length > 0 && (
        <div>
          <p className="font-mono text-[10px] void-text-system tracking-wider mb-2">
            ENCOUNTERS DEMANDING RESPONSE
          </p>
          <div className="space-y-2">
            {available.map((e) => (
              <button
                key={e.id}
                onClick={() => setActiveEncounterId(e.id)}
                className="w-full text-left p-3 rounded-xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.04]"
              >
                <p className="font-mono text-[11px] font-bold void-text-system">
                  {e.name}
                </p>
                <p className="font-mono text-[9px] text-white/40 mt-0.5 italic leading-relaxed">
                  {e.opening.slice(0, 120)}...
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Revealed whispers */}
      {convergence.revealedWhispers.length > 0 && (
        <div>
          <p className="font-mono text-[10px] text-white/30 tracking-wider mb-2">
            REVEALED WHISPERS
          </p>
          <div className="space-y-1">
            {convergence.revealedWhispers.map((id) => {
              const w = WHISPER_THRESHOLDS.find((t) => t.id === id);
              if (!w) return null;
              return (
                <div
                  key={id}
                  className="p-2 rounded-lg bg-white/[0.02] border border-white/10"
                >
                  <p className="font-mono text-[9px] text-white/50 italic leading-relaxed">
                    {w.line}
                  </p>
                  <p className="font-mono text-[8px] text-white/25 mt-0.5">
                    Revealed at Doom {w.at}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Encounter log */}
      {convergence.encounters.length > 0 && (
        <div>
          <p className="font-mono text-[10px] text-white/30 tracking-wider mb-2">
            ENCOUNTER LOG
          </p>
          <div className="space-y-1">
            {convergence.encounters.slice(-5).reverse().map((entry) => {
              const e = ELDRITCH_ENCOUNTERS.find((x) => x.id === entry.encounterId);
              const c = e?.choices.find((x) => x.id === entry.choiceId);
              if (!e || !c) return null;
              return (
                <div
                  key={entry.id}
                  className="p-2 rounded-lg bg-white/[0.02] border border-white/10"
                >
                  <p className="font-mono text-[10px] text-white font-bold">
                    {e.name}
                  </p>
                  <p className="font-mono text-[9px] void-text-system mt-0.5">
                    Chose: {c.label}
                  </p>
                  <p className="font-mono text-[8px] text-white/40 italic mt-0.5">
                    {c.outcome}
                  </p>
                  <div className="flex gap-3 mt-1 font-mono text-[8px]">
                    <span className="void-text-error">Doom +{entry.doomDelta}</span>
                    <span
                      className={entry.sanityDelta >= 0 ? "void-text-energy" : "void-text-error"}
                    >
                      Sanity {entry.sanityDelta >= 0 ? "+" : ""}
                      {entry.sanityDelta}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sources reference */}
      <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/10">
        <p className="font-mono text-[9px] text-white/30 tracking-wider mb-1.5">
          WHAT RAISES DOOM
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {Object.entries(DOOM_SOURCES).map(([key, src]) => (
            <p
              key={key}
              className="font-mono text-[9px] text-white/40 italic"
            >
              +{src.amount} — {src.reason}
            </p>
          ))}
        </div>
      </div>

      {/* Encounter modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveEncounterId(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-black/95 border void-border-system rounded-2xl p-5 space-y-3 overflow-hidden"
            >
              <ArtThumb
                assetId={active.keyArt}
                alt={`${active.name} key art`}
                className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
              />
              <p className="relative font-display text-sm tracking-[0.15em] void-text-system">
                {active.name.toUpperCase()}
              </p>
              <p className="relative font-mono text-[11px] text-white/70 italic leading-relaxed">
                {active.opening}
              </p>
              <div className="relative space-y-2 pt-2 border-t border-white/10">
                {active.choices.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => resolveChoice(active.id, c.id)}
                    className="w-full text-left p-3 rounded-xl bg-black/60 border border-white/10 hover:bg-white/[0.08] backdrop-blur-sm"
                  >
                    <p className="font-mono text-[11px] text-white font-bold">
                      {c.label}
                    </p>
                    <p className="font-mono text-[9px] text-white/50 mt-0.5">
                      {c.description}
                    </p>
                    <p className="font-mono text-[9px] void-text-accent mt-1">
                      {c.summary}
                    </p>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setActiveEncounterId(null)}
                className="relative w-full py-1.5 rounded bg-white/5 border border-white/10 text-white/40 font-mono text-[10px] backdrop-blur-sm"
              >
                CLOSE (DECIDE LATER)
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
