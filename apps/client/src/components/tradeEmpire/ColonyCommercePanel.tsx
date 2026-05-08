/**
 * ColonyCommercePanel — Trade Empire Phase B surface.
 *
 * Veska's harbor wall: founder progress at the top, vessel charter
 * picker in the middle, active voyages and founded colonies at the
 * bottom. Mounts inside TradeEmpirePage and is gated upstream by
 * `mech_colony_commerce_tutor_seen` — the panel does not exist for
 * the player until Veska has narrated the system.
 *
 * Wires the colonyCommerce + crew tRPC routers:
 *   - colonyCommerce.getState
 *   - colonyCommerce.getVesselQuotes
 *   - colonyCommerce.signColonyLane
 *   - colonyCommerce.recordColonyArrival
 *   - crew.getMatureBloodlines
 *
 * Companion: apps/server/routers/colonyCommerce.ts (runtime),
 * apps/shared/tradeEmpire/colonyCommerce.ts (canon).
 */
import { useState, useMemo } from "react";
import { Anchor, Globe2, Sparkles, Clock, Trophy, Crown } from "lucide-react";
import { trpc } from "@/lib/trpc";
import {
  COLONY_ELIGIBLE_SECTORS,
  type ColonyVesselClass,
} from "@shared/tradeEmpire/colonyCommerce";

interface VesselQuote {
  id: ColonyVesselClass;
  displayName: string;
  voyageDurationMs: number;
  baseTariffDream: number;
  requiredFounderTier: number;
  effectiveTariffDream: number;
  eligible: boolean;
}

function formatDurationHours(ms: number): string {
  const hours = Math.round(ms / (60 * 60 * 1000));
  return `${hours}h voyage`;
}

function formatBpsAsPct(bps: number): string {
  return `${(bps / 100).toFixed(2)}%`;
}

export default function ColonyCommercePanel() {
  const stateQuery = trpc.colonyCommerce.getState.useQuery();
  const vesselsQuery = trpc.colonyCommerce.getVesselQuotes.useQuery();
  const matureQuery = trpc.crew.getMatureBloodlines.useQuery();
  const utils = trpc.useUtils();

  const signLane = trpc.colonyCommerce.signColonyLane.useMutation({
    onSuccess: () => {
      void utils.colonyCommerce.getState.invalidate();
      void utils.colonyCommerce.getVesselQuotes.invalidate();
    },
  });
  const recordArrival = trpc.colonyCommerce.recordColonyArrival.useMutation({
    onSuccess: () => {
      void utils.colonyCommerce.getState.invalidate();
      void utils.colonyCommerce.getVesselQuotes.invalidate();
    },
  });

  const [selectedBloodline, setSelectedBloodline] = useState<string>("");
  const [selectedSector, setSelectedSector] = useState<string>(
    COLONY_ELIGIBLE_SECTORS[0] ?? "",
  );
  const [selectedVessel, setSelectedVessel] = useState<ColonyVesselClass>(
    "colony_ship_basic",
  );
  const [colonyName, setColonyName] = useState<string>("");

  const founder = stateQuery.data?.founderProgress;
  const lanes = stateQuery.data?.activeLanes ?? [];
  const colonies = stateQuery.data?.colonies ?? [];
  const vessels: VesselQuote[] = vesselsQuery.data ?? [];
  const matureBloodlines = matureQuery.data ?? [];

  const now = Date.now();
  const arrivableLanes = useMemo(
    () =>
      lanes.filter(
        (l) => l.status === "in_voyage" && now >= l.signedAt + l.durationMs,
      ),
    [lanes, now],
  );

  const canSign =
    selectedBloodline.length > 0 &&
    colonyName.trim().length > 0 &&
    !signLane.isPending;

  const handleSign = () => {
    if (!canSign) return;
    signLane.mutate({
      bloodlineKey: selectedBloodline,
      sectorId: selectedSector,
      vesselClass: selectedVessel,
      colonyName: colonyName.trim(),
    });
  };

  const handleRecordArrival = (laneId: string) => {
    const colonyDefaultName =
      colonyName.trim() || `Colony of ${selectedBloodline || "the Ark"}`;
    recordArrival.mutate({ laneId, colonyName: colonyDefaultName });
  };

  if (stateQuery.isLoading) {
    return (
      <div className="rounded-lg border border-amber-700/30 bg-zinc-950/40 p-4 text-zinc-500 font-mono text-xs">
        Loading colony commerce state…
      </div>
    );
  }

  return (
    <section
      className="rounded-lg border border-amber-700/40 bg-zinc-950/60 p-4 space-y-4"
      data-component="colony-commerce-panel"
    >
      <header className="flex items-center justify-between border-b border-amber-700/30 pb-3">
        <div className="flex items-center gap-2">
          <Anchor size={18} className="text-amber-400" />
          <h3 className="font-display text-sm tracking-[0.2em] text-amber-300">
            COLONY COMMERCE — Veska&apos;s Harbor
          </h3>
        </div>
        {founder && (
          <div className="text-right">
            <div className="font-mono text-[10px] text-amber-400 tracking-wider">
              FOUNDER TIER {founder.founderTier}
            </div>
            <div className="font-mono text-[9px] text-zinc-400">
              {founder.totalColoniesFounded} founded ·{" "}
              {formatBpsAsPct(founder.founderDiscountBps)} tariff bonus
            </div>
          </div>
        )}
      </header>

      {/* ─── Charter a new lane ─── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-amber-400" />
          <h4 className="font-mono text-[11px] tracking-[0.18em] text-amber-300">
            CHARTER FOUNDING LANE
          </h4>
        </div>

        {matureBloodlines.length === 0 ? (
          <div className="font-mono text-[10px] text-zinc-500 italic px-3 py-2 border border-zinc-800 rounded bg-zinc-950/30">
            No mature bloodlines available. Bloodlines must reach generation 3
            before they can seed a colony — Elara&apos;s breeding deck is
            upstream.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="font-mono text-[9px] text-zinc-500 tracking-wider">
                BLOODLINE
              </span>
              <select
                value={selectedBloodline}
                onChange={(e) => setSelectedBloodline(e.target.value)}
                className="w-full mt-1 px-2 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono text-xs"
              >
                <option value="">— select bloodline —</option>
                {matureBloodlines.map((bl) => (
                  <option key={bl.id} value={bl.id}>
                    {bl.name} (Gen {bl.generationCount})
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="font-mono text-[9px] text-zinc-500 tracking-wider">
                SECTOR
              </span>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full mt-1 px-2 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono text-xs"
              >
                {COLONY_ELIGIBLE_SECTORS.map((s) => (
                  <option key={s} value={s}>
                    {s.toUpperCase()}
                  </option>
                ))}
              </select>
            </label>

            <label className="block sm:col-span-2">
              <span className="font-mono text-[9px] text-zinc-500 tracking-wider">
                VESSEL CLASS
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
                {vessels.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => v.eligible && setSelectedVessel(v.id)}
                    disabled={!v.eligible}
                    className={`px-2 py-2 rounded border text-left transition-colors ${
                      selectedVessel === v.id
                        ? "border-amber-500 bg-amber-900/20"
                        : "border-zinc-700 bg-zinc-900"
                    } ${
                      v.eligible
                        ? "hover:border-amber-600 cursor-pointer"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div className="font-mono text-[10px] text-zinc-200">
                      {v.displayName}
                    </div>
                    <div className="font-mono text-[8px] text-zinc-500 mt-0.5">
                      {formatDurationHours(v.voyageDurationMs)} ·{" "}
                      {v.effectiveTariffDream}D tariff
                    </div>
                    {!v.eligible && (
                      <div className="font-mono text-[8px] text-red-400 mt-0.5">
                        Tier {v.requiredFounderTier} required
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </label>

            <label className="block sm:col-span-2">
              <span className="font-mono text-[9px] text-zinc-500 tracking-wider">
                COLONY NAME
              </span>
              <input
                type="text"
                value={colonyName}
                onChange={(e) => setColonyName(e.target.value)}
                maxLength={128}
                placeholder="The harbor logs your name here"
                className="w-full mt-1 px-2 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono text-xs placeholder-zinc-600"
              />
            </label>

            <button
              type="button"
              onClick={handleSign}
              disabled={!canSign}
              className="sm:col-span-2 px-3 py-2 rounded border border-amber-600 bg-amber-900/30 hover:bg-amber-900/50 disabled:opacity-40 disabled:cursor-not-allowed font-mono text-[11px] tracking-[0.15em] text-amber-200 transition-colors"
            >
              {signLane.isPending ? "SIGNING…" : "SIGN LANE & DEBIT TARIFF"}
            </button>

            {signLane.error && (
              <div className="sm:col-span-2 font-mono text-[10px] text-red-400">
                {signLane.error.message}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── Active voyages ─── */}
      {lanes.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-amber-400" />
            <h4 className="font-mono text-[11px] tracking-[0.18em] text-amber-300">
              ACTIVE VOYAGES
            </h4>
          </div>
          <div className="space-y-1.5">
            {lanes.map((l) => {
              const arrivesAt = l.signedAt + l.durationMs;
              const ready = l.status === "in_voyage" && now >= arrivesAt;
              const remaining = Math.max(0, arrivesAt - now);
              return (
                <div
                  key={l.laneId}
                  className="flex items-center justify-between px-3 py-2 rounded border border-zinc-800 bg-zinc-950/40"
                >
                  <div className="min-w-0">
                    <div className="font-mono text-[10px] text-zinc-200 truncate">
                      {l.bloodlineKey} → {l.sectorId.toUpperCase()}
                    </div>
                    <div className="font-mono text-[8px] text-zinc-500">
                      {l.vesselClass} · {l.tariffPaid}D paid · status{" "}
                      {l.status}
                    </div>
                  </div>
                  {ready && l.status === "in_voyage" ? (
                    <button
                      type="button"
                      onClick={() => handleRecordArrival(l.laneId)}
                      disabled={recordArrival.isPending}
                      className="px-2 py-1 rounded border border-emerald-600 bg-emerald-900/30 hover:bg-emerald-900/50 font-mono text-[9px] text-emerald-200 transition-colors"
                    >
                      RECORD ARRIVAL
                    </button>
                  ) : (
                    <span className="font-mono text-[9px] text-zinc-500">
                      {l.status === "in_voyage"
                        ? `${Math.ceil(remaining / 60000)}m left`
                        : l.status}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          {recordArrival.error && (
            <div className="font-mono text-[10px] text-red-400">
              {recordArrival.error.message}
            </div>
          )}
          {arrivableLanes.length > 0 && (
            <div className="font-mono text-[9px] text-amber-300/80">
              {arrivableLanes.length} voyage(s) ready to record.
            </div>
          )}
        </div>
      )}

      {/* ─── Founded colonies ─── */}
      {colonies.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Globe2 size={14} className="text-amber-400" />
            <h4 className="font-mono text-[11px] tracking-[0.18em] text-amber-300">
              FOUNDED COLONIES
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {colonies.map((c) => (
              <div
                key={c.colonyId}
                className="px-3 py-2 rounded border border-zinc-800 bg-zinc-950/40"
              >
                <div className="flex items-center justify-between">
                  <div className="font-mono text-[10px] text-zinc-200 truncate">
                    {c.name}
                  </div>
                  <div className="flex items-center gap-1 text-amber-300/80">
                    <Trophy size={10} />
                    <span className="font-mono text-[9px]">
                      Gen {c.currentGeneration}
                    </span>
                  </div>
                </div>
                <div className="font-mono text-[8px] text-zinc-500 mt-0.5">
                  {c.sectorId.toUpperCase()} · {c.bloodlineKey} ·{" "}
                  {c.totalExportValue}D exported
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {colonies.length === 0 && lanes.length === 0 && matureBloodlines.length > 0 && (
        <div className="font-mono text-[10px] text-zinc-500 italic px-3 py-2 border border-zinc-800 rounded bg-zinc-950/30 flex items-center gap-2">
          <Crown size={12} className="text-amber-400/70" />
          <span>
            No colonies founded yet. Veska&apos;s ledger is waiting for your
            first lane.
          </span>
        </div>
      )}
    </section>
  );
}
