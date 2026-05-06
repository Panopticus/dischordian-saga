/* ═══════════════════════════════════════════════════════
   TRADE COURT PAGE — phase 7 of the items-matter / GoT
   arc. The "Game of Thrones widget."

   Reads tradeCourt.courtSnapshot in one shot, renders:
     - Season banner with active declaration
     - Sub-house reputation grid (rivalries linked)
     - Pending demands with pay/refuse actions
     - Active agendas with stage-status pills
     - Recent public-knowledge feed
     - Tribute panel (gift one card to a sub-house)

   The page is intentionally text-heavy and political. It is
   not a minigame; it is a status board where the player
   exercises their political agency.
   ═══════════════════════════════════════════════════════ */

import { useMemo, useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { tcgFactionToAlignment } from "@shared/tradeEmpire/itemTags";
import { SUB_HOUSE_REGISTRY } from "@shared/tradeEmpire/houses";
import type { Faction } from "@shared/tcg-core/types/Card";

const RARITY_ORDER = ["basic", "common", "uncommon", "rare", "epic", "legendary"] as const;
type RarityKey = typeof RARITY_ORDER[number];

function rarityIdx(r: string): number {
  const idx = RARITY_ORDER.indexOf(r as RarityKey);
  return idx === -1 ? 0 : idx;
}

// Local row types — inferred shape rather than re-derived from the
// query, to avoid an inference-loop with the trpc proxy types.
interface DemandRow {
  id: number;
  demandingHouseKey: string;
  demandingHouseName: string;
  demandedRarity: string;
  demandedFaction: string | null;
  status: string;
  expiresAt: number;
  createdAt: number;
  resolvedAt: number | null;
}

interface NewsRow {
  id: number;
  userId: number | null;
  eventKind: string;
  subjectHouseKey: string | null;
  summary: string;
  payload: Record<string, unknown> | null;
  seasonNumber: number;
  createdAt: number;
}

function classNames(...xs: Array<string | false | null | undefined>): string {
  return xs.filter(Boolean).join(" ");
}

function repColor(rep: number): string {
  if (rep >= 75) return "bg-emerald-700 text-emerald-100";
  if (rep >= 25) return "bg-emerald-900 text-emerald-200";
  if (rep > -25) return "bg-zinc-800 text-zinc-300";
  if (rep > -75) return "bg-rose-900 text-rose-200";
  return "bg-rose-800 text-rose-100";
}

function repLabel(rep: number): string {
  if (rep >= 75) return "Friend";
  if (rep >= 50) return "Allied";
  if (rep >= 25) return "Recognised";
  if (rep > -25) return "Stranger";
  if (rep > -50) return "Strained";
  if (rep > -75) return "Hostile";
  return "Sworn enemy";
}

function timeAgo(ms: number): string {
  const dt = Date.now() - ms;
  if (dt < 60_000) return "just now";
  if (dt < 3_600_000) return `${Math.floor(dt / 60_000)}m ago`;
  if (dt < 86_400_000) return `${Math.floor(dt / 3_600_000)}h ago`;
  return `${Math.floor(dt / 86_400_000)}d ago`;
}

export default function TradeCourtPage() {
  const utils = trpc.useUtils();
  const snapshot = trpc.tradeCourt.courtSnapshot.useQuery(undefined, {
    refetchInterval: 60_000,
  });
  const myCards = trpc.cardGame.myCollection.useQuery({ page: 1, limit: 100 });
  const myTowers = trpc.tradeCourt.listMyTowers.useQuery();
  const myFactionRollup = trpc.tradeCourt.myFactionRollup.useQuery();
  const availableContracts = trpc.tradeContracts.listAvailable.useQuery();
  const equipMunition = trpc.tradeCourt.equipMunition.useMutation({
    onSuccess: () => utils.tradeCourt.listMyTowers.invalidate(),
  });
  const signContract = trpc.tradeContracts.sign.useMutation({
    onSuccess: () => {
      utils.tradeCourt.courtSnapshot.invalidate();
      utils.tradeContracts.listAvailable.invalidate();
    },
  });

  const refuse = trpc.tradeCourt.refuseDemand.useMutation({
    onSuccess: () => utils.tradeCourt.courtSnapshot.invalidate(),
  });
  const pay = trpc.tradeCourt.payDemand.useMutation({
    onSuccess: () => {
      utils.tradeCourt.courtSnapshot.invalidate();
      utils.cardGame.myCollection.invalidate();
    },
  });
  const tribute = trpc.tradeCourt.payTribute.useMutation({
    onSuccess: () => {
      utils.tradeCourt.courtSnapshot.invalidate();
      utils.cardGame.myCollection.invalidate();
    },
  });

  const [tributeHouse, setTributeHouse] = useState<string | null>(null);
  const [tributeCardId, setTributeCardId] = useState<string | null>(null);
  const [tributeIsFoil, setTributeIsFoil] = useState(false);
  const [tributeRarityFilter, setTributeRarityFilter] = useState<string>("any");
  const [demandPicker, setDemandPicker] = useState<DemandRow | null>(null);
  const [demandCardId, setDemandCardId] = useState<string | null>(null);
  const [newsHouseKey, setNewsHouseKey] = useState<string | null>(null);

  // Per-house news drilldown (#13).
  const houseNews = trpc.tradeCourt.newsForHouse.useQuery(
    { houseKey: newsHouseKey ?? "", limit: 50 },
    { enabled: Boolean(newsHouseKey) },
  );

  const data = snapshot.data;
  const cardOptions = useMemo(() => {
    if (!myCards.data?.cards) return [];
    return myCards.data.cards
      .map(c => ({
        cardId: c.cardId,
        name: c.name ?? c.cardId,
        rarity: c.rarity ?? "common",
        faction: (c.faction ?? "neutral") as Faction,
        alignment: tcgFactionToAlignment((c.faction ?? "neutral") as Faction),
        quantity: c.userCard?.quantity ?? 0,
        isFoil: Boolean(c.userCard?.isFoil),
      }))
      .filter(c => c.quantity > 0)
      .sort((a, b) => (a.cardId < b.cardId ? -1 : 1));
  }, [myCards.data]);

  // Tribute filter: only cards aligned to the receiver or neutral
  // (rejecting rival-aligned cards client-side, mirroring server check).
  const tributeOptions = useMemo(() => {
    if (!tributeHouse) return [];
    const receiver = SUB_HOUSE_REGISTRY[tributeHouse as keyof typeof SUB_HOUSE_REGISTRY];
    if (!receiver) return [];
    return cardOptions
      .filter(c => c.alignment !== receiver.rivalHouseKey)
      .filter(c =>
        tributeRarityFilter === "any" || c.rarity === tributeRarityFilter,
      );
  }, [cardOptions, tributeHouse, tributeRarityFilter]);

  // Demand filter: cards meeting rarity floor + faction filter.
  const demandOptions = useMemo(() => {
    if (!demandPicker) return [];
    const minIdx = rarityIdx(demandPicker.demandedRarity);
    return cardOptions.filter(c => {
      if (rarityIdx(c.rarity) < minIdx) return false;
      if (
        demandPicker.demandedFaction &&
        c.faction !== demandPicker.demandedFaction
      ) {
        return false;
      }
      return true;
    });
  }, [cardOptions, demandPicker]);

  type SnapshotHouse = NonNullable<typeof data>["houses"][number];
  const housesByFaction = useMemo(() => {
    const map = new Map<string, SnapshotHouse[]>();
    if (!data) return map;
    for (const h of data.houses) {
      const arr = map.get(h.factionId) ?? [];
      arr.push(h);
      map.set(h.factionId, arr);
    }
    return map;
  }, [data]);

  if (snapshot.isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
        <div className="text-zinc-400">Loading court state…</div>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
        <div className="text-rose-400">
          Could not load the court. Try again later.
        </div>
      </div>
    );
  }

  const declaration = data.season.declaration as
    | (NonNullable<typeof data.season.declaration> & {
        declarationKey: string;
        headline: string;
        text: string;
      })
    | null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">The Court</h1>
          <p className="text-zinc-400 text-sm">
            Season {data.season.seasonNumber} ·{" "}
            <span className="capitalize">{data.season.phase}</span>{" "}
            {data.season.acceptsContractSignings ? null : (
              <span className="ml-2 text-amber-400">
                · contracts locked this phase
              </span>
            )}
          </p>
        </div>
        <Link
          href="/trade-empire"
          className="text-sm text-zinc-300 hover:text-zinc-100 underline"
        >
          ← Back to Trade Empire
        </Link>
      </header>

      {declaration && (
        <section className="px-6 py-5 bg-zinc-900/60 border-b border-zinc-800">
          <div className="text-xs uppercase tracking-wider text-zinc-500 mb-1">
            Season declaration
          </div>
          <div className="text-lg text-amber-200 font-medium">
            {declaration.headline}
          </div>
          <p className="text-zinc-400 text-sm mt-1 max-w-3xl">{declaration.text}</p>
        </section>
      )}

      {data.pendingDemands.length > 0 && (
        <section className="px-6 py-5 bg-rose-950/40 border-b border-rose-900">
          <h2 className="text-lg font-medium text-rose-200 mb-3">
            Pending demands ({data.pendingDemands.length})
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {data.pendingDemands.map(d => (
              <article
                key={d.id}
                className="bg-zinc-900 border border-rose-900 rounded p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium text-rose-200">
                    {d.demandingHouseName}
                  </div>
                  <div className="text-xs text-zinc-400">
                    expires {timeAgo(d.expiresAt)}
                  </div>
                </div>
                <p className="text-sm text-zinc-300 mt-1">
                  Demands one <strong>{d.demandedRarity}</strong>+ card
                  {d.demandedFaction ? (
                    <>
                      {" "}aligned with <em>{d.demandedFaction}</em>
                    </>
                  ) : null}
                  .
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-600 text-emerald-50 text-sm"
                    onClick={() => {
                      setDemandPicker(d);
                      setDemandCardId(null);
                    }}
                  >
                    Pay
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded bg-rose-800 hover:bg-rose-700 text-rose-50 text-sm"
                    disabled={refuse.isPending}
                    onClick={() => refuse.mutate({ demandId: d.id })}
                  >
                    Refuse
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="px-6 py-5">
        <h2 className="text-lg font-medium mb-3">Sub-house reputation</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...housesByFaction.entries()].map(([factionId, houses]) => (
            <div
              key={factionId}
              className="bg-zinc-900 border border-zinc-800 rounded p-3"
            >
              <div className="text-xs uppercase tracking-wider text-zinc-500 mb-2">
                {factionId.replace(/_/g, " ")}
              </div>
              <div className="space-y-2">
                {houses.map(h => (
                  <div
                    key={h.houseKey}
                    className={classNames(
                      "rounded p-2 border",
                      "border-zinc-800 hover:border-zinc-600",
                      h.unalignable && "opacity-50",
                    )}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <div className="text-sm font-medium">{h.name}</div>
                        <div className="text-xs text-zinc-500">
                          rival: {h.rivalHouseKey}
                        </div>
                      </div>
                      <span
                        className={classNames(
                          "text-xs px-2 py-0.5 rounded",
                          repColor(h.reputation),
                        )}
                      >
                        {h.reputation} · {repLabel(h.reputation)}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">{h.blurb}</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        disabled={h.unalignable}
                        onClick={() => {
                          setTributeHouse(h.houseKey);
                          setTributeCardId(null);
                          setTributeIsFoil(false);
                        }}
                        className="text-xs px-2 py-1 rounded bg-emerald-900 hover:bg-emerald-800 text-emerald-100 disabled:opacity-30"
                      >
                        Tribute
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewsHouseKey(h.houseKey)}
                        className="text-xs px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                      >
                        News
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Faction rollup (#14) — top-level faction averages computed
          from the sub-house grid above. */}
      {myFactionRollup.data && Object.keys(myFactionRollup.data).length > 0 && (
        <section className="px-6 py-4 border-t border-zinc-800">
          <h2 className="text-lg font-medium mb-3">Faction standing</h2>
          <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-5">
            {Object.entries(myFactionRollup.data)
              .sort((a, b) => b[1] - a[1])
              .map(([factionId, rep]) => (
                <div
                  key={factionId}
                  className="bg-zinc-900 border border-zinc-800 rounded p-2 flex justify-between items-center"
                >
                  <span className="text-sm capitalize">
                    {factionId.replace(/_/g, " ")}
                  </span>
                  <span className={classNames("text-xs px-2 py-0.5 rounded", repColor(rep))}>
                    {rep}
                  </span>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* House Oaths (#12) — surface signable house oaths. The
          contracts.listAvailable endpoint already returns these. */}
      {availableContracts.data && (
        <section className="px-6 py-4 border-t border-zinc-800">
          <h2 className="text-lg font-medium mb-3">House Oaths</h2>
          <p className="text-zinc-400 text-sm mb-3">
            Season-long oaths. Locks out a rival broker; grants a title on
            full completion. Breaking an oath is canonically visible to
            every Authority broker.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {availableContracts.data
              .filter(c => c.contractKey.startsWith("oath."))
              .map(c => (
                <article
                  key={c.contractKey}
                  className="bg-zinc-900 border border-zinc-800 rounded p-3"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-zinc-500">
                      {c.stageCount} stages
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-3">
                    {c.loreContext}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <button
                      type="button"
                      disabled={
                        signContract.isPending || !data.season.acceptsContractSignings
                      }
                      onClick={() =>
                        signContract.mutate({ contractKey: c.contractKey, audit: true })
                      }
                      className="text-xs px-2 py-1 rounded bg-amber-800 hover:bg-amber-700 text-amber-50 disabled:opacity-40"
                    >
                      Sign (audit)
                    </button>
                    <button
                      type="button"
                      disabled={
                        signContract.isPending || !data.season.acceptsContractSignings
                      }
                      onClick={() =>
                        signContract.mutate({ contractKey: c.contractKey, useCover: true })
                      }
                      className="text-xs px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 disabled:opacity-40"
                    >
                      Sign under cover
                    </button>
                  </div>
                </article>
              ))}
            {availableContracts.data.filter(c => c.contractKey.startsWith("oath.")).length === 0 && (
              <p className="text-zinc-500 text-sm">
                No house oaths currently available — they may be locked behind
                broker engagement, reveal stage, or a season constraint.
              </p>
            )}
          </div>
        </section>
      )}

      {data.agendaProgress.length > 0 && (
        <section className="px-6 py-5 border-t border-zinc-800">
          <h2 className="text-lg font-medium mb-3">Active agendas</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {data.agendaProgress.map(ap => (
              <article
                key={ap.agendaKey}
                className="bg-zinc-900 border border-zinc-800 rounded p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium">{ap.agendaName}</div>
                  <div className="text-xs text-zinc-500">
                    {ap.resolved ? "resolved" : "running"}
                  </div>
                </div>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {Object.entries(ap.stageStatus).map(([stageId, status]) => (
                    <span
                      key={stageId}
                      className={classNames(
                        "text-xs px-2 py-0.5 rounded border",
                        status === "world_fired" &&
                          "bg-amber-900 border-amber-700 text-amber-100",
                        status === "countered" &&
                          "bg-emerald-900 border-emerald-700 text-emerald-100",
                        status === "skipped" &&
                          "bg-zinc-800 border-zinc-700 text-zinc-300",
                        status === "pending" &&
                          "bg-zinc-900 border-zinc-700 text-zinc-400",
                      )}
                    >
                      {stageId}: {status}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {myTowers.data && myTowers.data.towers.length > 0 && (
        <section className="px-6 py-5 border-t border-zinc-800">
          <h2 className="text-lg font-medium mb-3">Defense towers</h2>
          <p className="text-zinc-400 text-sm mb-3">
            Load a munition into a tower; it fires once on the next wave and is consumed.
          </p>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {myTowers.data.towers.map(t => (
              <article
                key={t.id}
                className="bg-zinc-900 border border-zinc-800 rounded p-3"
              >
                <div className="flex justify-between items-baseline">
                  <div className="font-medium">{t.towerName}</div>
                  <div className="text-xs text-zinc-500">L{t.level} · {t.status}</div>
                </div>
                <div className="text-xs text-zinc-500 mb-2">
                  Loaded:{" "}
                  {t.munitionLabel ?? <span className="text-zinc-600">— empty —</span>}
                </div>
                <div className="flex gap-2">
                  <select
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded p-1.5 text-xs"
                    value={t.equippedMunition ?? ""}
                    onChange={e => {
                      const ref = e.target.value === "" ? null : e.target.value;
                      equipMunition.mutate({ towerId: t.id, itemRef: ref });
                    }}
                  >
                    <option value="">— clear slot —</option>
                    {myTowers.data!.availableMunitions.map(m => (
                      <option key={m.ref} value={m.ref}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="px-6 py-5 border-t border-zinc-800">
        <h2 className="text-lg font-medium mb-3">Recent news</h2>
        {data.recentNews.length === 0 ? (
          <p className="text-zinc-500 text-sm">
            The court is quiet. The world will move when the season ticks.
          </p>
        ) : (
          <ol className="space-y-1.5">
            {data.recentNews.map((n: NewsRow, i: number) => (
              <li
                key={`${n.id}-${i}`}
                className="text-sm text-zinc-300 border-l-2 border-zinc-700 pl-3"
              >
                <div className="text-zinc-500 text-xs">
                  {timeAgo(n.createdAt)} · {n.eventKind}
                  {n.subjectHouseKey ? ` · ${n.subjectHouseKey}` : ""}
                </div>
                <div>{n.summary}</div>
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* Tribute modal */}
      {tributeHouse && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
          onClick={() => setTributeHouse(null)}
        >
          <div
            className="bg-zinc-900 border border-zinc-700 rounded p-5 max-w-md w-full"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-medium mb-2">
              Pay tribute to{" "}
              {data.houses.find(h => h.houseKey === tributeHouse)?.name}
            </h3>
            <p className="text-sm text-zinc-400 mb-3">
              The card you choose is destroyed. Hand-crafted &gt; market-bought
              &gt; looted. Cards aligned to this house's rival are not shown
              (would be refused).
            </p>
            <div className="flex gap-2 mb-2">
              <select
                value={tributeRarityFilter}
                onChange={e => {
                  setTributeRarityFilter(e.target.value);
                  setTributeCardId(null);
                }}
                className="bg-zinc-800 border border-zinc-700 rounded p-2 text-sm"
              >
                <option value="any">any rarity</option>
                {RARITY_ORDER.map(r => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <span className="text-xs text-zinc-500 self-center">
                {tributeOptions.length} card
                {tributeOptions.length === 1 ? "" : "s"} accepted
              </span>
            </div>
            <select
              value={tributeCardId ?? ""}
              onChange={e => setTributeCardId(e.target.value || null)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-sm mb-2"
            >
              <option value="">— select a card —</option>
              {tributeOptions.map(c => {
                const aligned = c.alignment === tributeHouse;
                const tag = aligned ? "★ aligned" : c.alignment === "neutral" ? "neutral" : "third party";
                return (
                  <option key={`${c.cardId}-${c.isFoil}`} value={c.cardId}>
                    {c.name} · {c.rarity} · {tag} ×{c.quantity}
                    {c.isFoil ? " (foil)" : ""}
                  </option>
                );
              })}
            </select>
            <label className="flex items-center gap-2 text-sm text-zinc-400 mb-3">
              <input
                type="checkbox"
                checked={tributeIsFoil}
                onChange={e => setTributeIsFoil(e.target.checked)}
              />
              Foil copy
            </label>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm"
                onClick={() => setTributeHouse(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!tributeCardId || tribute.isPending}
                className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-600 text-emerald-50 text-sm disabled:opacity-50"
                onClick={() => {
                  if (!tributeCardId || !tributeHouse) return;
                  tribute.mutate(
                    {
                      receivingHouseKey: tributeHouse,
                      cardId: tributeCardId,
                      isFoil: tributeIsFoil,
                    },
                    {
                      onSettled: () => setTributeHouse(null),
                    },
                  );
                }}
              >
                Tribute
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Per-house news drilldown (#13) */}
      {newsHouseKey && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
          onClick={() => setNewsHouseKey(null)}
        >
          <div
            className="bg-zinc-900 border border-zinc-700 rounded p-5 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="text-lg font-medium">
                News:{" "}
                {data.houses.find(h => h.houseKey === newsHouseKey)?.name ?? newsHouseKey}
              </h3>
              <button
                type="button"
                onClick={() => setNewsHouseKey(null)}
                className="text-xs text-zinc-400 hover:text-zinc-200"
              >
                close
              </button>
            </div>
            {houseNews.isLoading ? (
              <p className="text-zinc-500 text-sm">Loading…</p>
            ) : houseNews.data && houseNews.data.length > 0 ? (
              <ol className="space-y-2">
                {houseNews.data.map((n, i) => (
                  <li
                    key={`${n.id}-${i}`}
                    className="text-sm text-zinc-300 border-l-2 border-zinc-700 pl-3"
                  >
                    <div className="text-zinc-500 text-xs">
                      {timeAgo(n.createdAt)} · {n.eventKind} · season {n.seasonNumber}
                    </div>
                    <div>{n.summary}</div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-zinc-500 text-sm">
                No archived news for this house yet.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Demand-pay modal */}
      {demandPicker && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
          onClick={() => setDemandPicker(null)}
        >
          <div
            className="bg-zinc-900 border border-rose-900 rounded p-5 max-w-md w-full"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-medium mb-2">
              Pay demand: {demandPicker.demandingHouseName}
            </h3>
            <p className="text-sm text-zinc-400 mb-3">
              Provide a card of {demandPicker.demandedRarity} or higher
              {demandPicker.demandedFaction
                ? ` aligned with ${demandPicker.demandedFaction}`
                : ""}
              . The card will be destroyed.
            </p>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-zinc-500">
                {demandOptions.length} card
                {demandOptions.length === 1 ? "" : "s"} eligible
              </span>
              {demandOptions.length === 0 && (
                <span className="text-xs text-amber-400">
                  no matching cards in collection
                </span>
              )}
            </div>
            <select
              value={demandCardId ?? ""}
              onChange={e => setDemandCardId(e.target.value || null)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-sm mb-3"
              disabled={demandOptions.length === 0}
            >
              <option value="">— select a card —</option>
              {demandOptions.map(c => (
                <option key={`${c.cardId}-${c.isFoil}`} value={c.cardId}>
                  {c.name} · {c.rarity} ×{c.quantity}
                  {c.isFoil ? " (foil)" : ""}
                </option>
              ))}
            </select>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm"
                onClick={() => setDemandPicker(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!demandCardId || pay.isPending}
                className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-600 text-emerald-50 text-sm disabled:opacity-50"
                onClick={() => {
                  if (!demandCardId) return;
                  pay.mutate(
                    {
                      demandId: demandPicker.id,
                      cardId: demandCardId,
                    },
                    { onSettled: () => setDemandPicker(null) },
                  );
                }}
              >
                Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
