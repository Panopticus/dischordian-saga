/* ═══════════════════════════════════════════════════════
   AAA ART ARCHIVE — Trade Empire iconography

   Buildings (markets, warehouses, guild hall, shipyard),
   tradeable goods, cargo ships, sea-lane routes, the world
   trade-route map plate, and the trade-empire UI chrome
   (currency icons, action buttons, dashboard background).

   These are NEW assets for the Trade Empire surface
   (`apps/client/src/game/TradeEmpirePage.tsx`); they
   complement the existing per-sector planet imagery in
   `apps/client/src/game/tradeEmpire.ts`.
   ═══════════════════════════════════════════════════════ */

import { assetUrl } from "@shared/lib/assetUrl";

/** Local alias to keep the public type name distinct from the
 *  similarly-named helper in characterSheets.ts (the barrel re-exports
 *  both files). */
export interface TradeEmpireFinalAndOriginal {
  readonly final: string;
  readonly original: string;
}
type FinalAndOriginal = TradeEmpireFinalAndOriginal;

/* ─── Buildings ─── */

export const TRADE_EMPIRE_BUILDING_IDS = [
  "guild_hall",
  "market_tier1",
  "market_tier2",
  "market_tier3",
  "shipyard",
  "warehouse_tier1",
  "warehouse_tier2",
] as const;
export type TradeEmpireBuildingId = (typeof TRADE_EMPIRE_BUILDING_IDS)[number];

export function tradeEmpireBuildingUrls(id: TradeEmpireBuildingId): FinalAndOriginal {
  return {
    final: assetUrl(`art/trade_empire/buildings/${id}.png`),
    original: assetUrl(`art/trade_empire/buildings/${id}_original.png`),
  };
}

/* ─── Goods ─── */

export const TRADE_EMPIRE_GOODS_IDS = [
  "goods_arcane_ink",
  "goods_brass_ingot",
  "goods_lumber",
  "goods_silk",
  "goods_soul_essence",
  "goods_spice",
  "goods_void_crystal",
] as const;
export type TradeEmpireGoodsId = (typeof TRADE_EMPIRE_GOODS_IDS)[number];

export function tradeEmpireGoodsUrls(id: TradeEmpireGoodsId): FinalAndOriginal {
  return {
    final: assetUrl(`art/trade_empire/goods/${id}.png`),
    original: assetUrl(`art/trade_empire/goods/${id}_original.png`),
  };
}

/* ─── Ships ─── */

export const TRADE_EMPIRE_SHIP_IDS = [
  "cargo_ship_large",
  "cargo_ship_medium",
  "cargo_ship_small",
] as const;
export type TradeEmpireShipId = (typeof TRADE_EMPIRE_SHIP_IDS)[number];

export function tradeEmpireShipUrls(id: TradeEmpireShipId): FinalAndOriginal {
  return {
    final: assetUrl(`art/trade_empire/ships/${id}.png`),
    original: assetUrl(`art/trade_empire/ships/${id}_original.png`),
  };
}

/* ─── UI chrome ─── */

export const TRADE_EMPIRE_UI_BUTTON_IDS = ["btn_buy", "btn_route", "btn_sell"] as const;
export type TradeEmpireUiButtonId = (typeof TRADE_EMPIRE_UI_BUTTON_IDS)[number];

export const TRADE_EMPIRE_UI_CURRENCY_IDS = [
  "currency_gold",
  "currency_void_marks",
] as const;
export type TradeEmpireUiCurrencyId = (typeof TRADE_EMPIRE_UI_CURRENCY_IDS)[number];

export function tradeEmpireUiButtonUrls(id: TradeEmpireUiButtonId): FinalAndOriginal {
  return {
    final: assetUrl(`art/trade_empire/ui/${id}.png`),
    original: assetUrl(`art/trade_empire/ui/${id}_original.png`),
  };
}

export function tradeEmpireUiCurrencyUrls(id: TradeEmpireUiCurrencyId): FinalAndOriginal {
  return {
    final: assetUrl(`art/trade_empire/ui/${id}.png`),
    original: assetUrl(`art/trade_empire/ui/${id}_original.png`),
  };
}

/** The dashboard backdrop ships final-only (no _original mirror). */
export function tradeEmpireDashboardBgUrl(): string {
  return assetUrl("art/trade_empire/ui/trade_dashboard_bg.png");
}

/* ─── Map + routes ─── */

export function tradeRouteMapUrl(): string {
  return assetUrl("art/trade_empire/maps/trade_route_map.png");
}

export function tradeRouteSeaLaneUrl(): string {
  return assetUrl("art/trade_empire/routes/route_sea_lane.png");
}

export function allTradeEmpireUrls(): readonly string[] {
  const urls: string[] = [];
  for (const id of TRADE_EMPIRE_BUILDING_IDS) {
    const u = tradeEmpireBuildingUrls(id);
    urls.push(u.final, u.original);
  }
  for (const id of TRADE_EMPIRE_GOODS_IDS) {
    const u = tradeEmpireGoodsUrls(id);
    urls.push(u.final, u.original);
  }
  for (const id of TRADE_EMPIRE_SHIP_IDS) {
    const u = tradeEmpireShipUrls(id);
    urls.push(u.final, u.original);
  }
  for (const id of TRADE_EMPIRE_UI_BUTTON_IDS) {
    const u = tradeEmpireUiButtonUrls(id);
    urls.push(u.final, u.original);
  }
  for (const id of TRADE_EMPIRE_UI_CURRENCY_IDS) {
    const u = tradeEmpireUiCurrencyUrls(id);
    urls.push(u.final, u.original);
  }
  urls.push(tradeEmpireDashboardBgUrl());
  urls.push(tradeRouteMapUrl());
  urls.push(tradeRouteSeaLaneUrl());
  return urls;
}
