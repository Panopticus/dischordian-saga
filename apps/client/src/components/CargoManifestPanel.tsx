/* ═══════════════════════════════════════════════════════
   CARGO MANIFEST PANEL — Phase 2.4

   Per the canonical Trade Empire deliverable in the plan §3:
   "Cargo Holds: replace abstract SectorResources with typed
   cargo (CargoItem with mass, volume, perishable, contraband,
   attribution — per Antiquarian's 'desks-do-not-run' canon,
   attribution is canonical metadata)."

   This panel surfaces a player's canonical cargo manifest:
   per-item mass / volume / perishable shelf-life / canonical
   contraband stance / canonical attribution chain. Read-only.
   The player ships per-row navigation actions to a separate
   detail modal (Phase 3 scope).
   ═══════════════════════════════════════════════════════ */
import { useMemo } from "react";
import {
  Package,
  AlertOctagon,
  Hourglass,
  Stamp,
  ChevronRight,
} from "lucide-react";
import {
  type CargoItem,
  isCargoContrabandInFaction,
  isAttributionCanonicallyComplete,
} from "@shared/tradeEmpire/cargo";

interface CargoManifestPanelProps {
  /** Cargo items currently in the player's hold. */
  items: ReadonlyArray<CargoItem>;
  /**
   * Optional — the canonical-faction the cargo is currently transiting
   * through. Drives the canonical-contraband indicator per
   * contrabandPerFaction overrides.
   */
  currentFactionContext?: string;
  /** Optional — canonical-shipment age in hours, for perishable shelf-life. */
  shipmentAgeHours?: number;
  /** Optional — per-row click handler for inspect-detail. */
  onItemClick?: (item: CargoItem) => void;
}

export function CargoManifestPanel({
  items,
  currentFactionContext,
  shipmentAgeHours = 0,
  onItemClick,
}: CargoManifestPanelProps) {
  const totals = useMemo(() => {
    let mass = 0;
    let volume = 0;
    for (const item of items) {
      mass += item.mass;
      volume += item.volume;
    }
    return { mass, volume };
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="void-bg-sunk void-border rounded border p-4 text-center">
        <Package className="void-text-muted mx-auto h-8 w-8" />
        <p className="void-text-muted mt-2 text-sm italic">
          Cargo hold canonically empty.
        </p>
      </div>
    );
  }

  return (
    <div className="void-bg-sunk void-border rounded border">
      {/* Header */}
      <div className="void-border void-bg-system flex items-center justify-between border-b p-3">
        <div className="flex items-center gap-2">
          <Package className="void-text-accent h-4 w-4" />
          <h3 className="void-text-primary text-sm font-semibold uppercase">
            Cargo Manifest
          </h3>
        </div>
        <div className="void-text-muted text-xs">
          {items.length} {items.length === 1 ? "item" : "items"} ·{" "}
          {totals.mass.toFixed(1)} mass / {totals.volume.toFixed(1)} vol
        </div>
      </div>

      {/* Items */}
      <ul className="divide-y divide-[var(--void-border-color)]">
        {items.map((item) => {
          const isContraband = currentFactionContext
            ? isCargoContrabandInFaction(item, currentFactionContext)
            : item.contraband;
          const isPerishableExpiring =
            item.perishable &&
            typeof item.shelfLifeHours === "number" &&
            shipmentAgeHours >= item.shelfLifeHours * 0.7;
          const isPerishableSpoiled =
            item.perishable &&
            typeof item.shelfLifeHours === "number" &&
            shipmentAgeHours >= item.shelfLifeHours;
          const attributionComplete = isAttributionCanonicallyComplete(item);

          return (
            <li
              key={item.cargoId}
              className={`flex items-start gap-3 p-3 text-sm ${
                onItemClick ? "cursor-pointer hover:bg-white/5" : ""
              }`}
              onClick={() => onItemClick?.(item)}
            >
              <div className="flex-1">
                {/* Name + category */}
                <div className="flex items-center gap-2">
                  <span className="void-text-primary font-medium">
                    {item.name}
                  </span>
                  <span className="void-text-muted font-mono text-[10px] uppercase">
                    {item.category}
                  </span>
                </div>

                {/* Mass / volume / broker stamp */}
                <div className="void-text-muted mt-1 flex flex-wrap gap-3 text-xs">
                  <span>{item.mass.toFixed(1)} mass</span>
                  <span>{item.volume.toFixed(1)} vol</span>
                  {item.brokerOrigin && (
                    <span className="flex items-center gap-1">
                      <Stamp className="h-3 w-3" />
                      {item.brokerOrigin}
                    </span>
                  )}
                  {item.destinationSector && (
                    <span>→ {item.destinationSector}</span>
                  )}
                </div>

                {/* Status badges */}
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {isContraband && (
                    <span className="void-bg-warning void-text-primary inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase">
                      <AlertOctagon className="h-3 w-3" /> Contraband
                    </span>
                  )}
                  {isPerishableSpoiled ? (
                    <span className="void-bg-error void-text-primary inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase">
                      <Hourglass className="h-3 w-3" /> Spoiled
                    </span>
                  ) : isPerishableExpiring ? (
                    <span className="void-bg-warning void-text-primary inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase">
                      <Hourglass className="h-3 w-3" /> Expiring
                    </span>
                  ) : item.perishable ? (
                    <span className="void-bg-system void-text-muted inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] uppercase">
                      <Hourglass className="h-3 w-3" /> Perishable
                    </span>
                  ) : null}

                  {/* Canonical-attribution stance per Antiquarian canon. */}
                  <span
                    className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] uppercase ${
                      attributionComplete
                        ? "void-bg-success void-text-primary font-semibold"
                        : item.attribution.attributionStanceCanon ===
                            "deliberately_blank"
                          ? "void-bg-system void-text-muted"
                          : "void-bg-warning void-text-primary font-semibold"
                    }`}
                  >
                    Attribution: {item.attribution.attributionStanceCanon}
                  </span>
                </div>
              </div>

              {onItemClick && (
                <ChevronRight className="void-text-muted h-4 w-4 flex-shrink-0" />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
