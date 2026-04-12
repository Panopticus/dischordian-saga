/**
 * Branded ID types.
 *
 * Branding prevents accidental mix-ups between, say, a user id and a match
 * id at compile time. At runtime they are just strings/numbers. Use the
 * constructors below to mint branded values from raw primitives.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const _brand: unique symbol;
type Brand<T, B> = T & { readonly [_brand]: B };

export type MatchId = Brand<string, "MatchId">;
export type PlayerId = Brand<number, "PlayerId">;
/** Stable static card definition id — e.g. "s1_char_018". */
export type CardDefId = Brand<string, "CardDefId">;
/** Runtime entity id assigned when a card becomes a live instance. */
export type EntityId = Brand<string, "EntityId">;
/** Stable ability id within a card definition — used in logs + triggers. */
export type AbilityId = Brand<string, "AbilityId">;
/** Stable ability instance id at runtime (one per entity-ability pair). */
export type AbilityInstanceId = Brand<string, "AbilityInstanceId">;

export const MatchId = (s: string): MatchId => s as MatchId;
export const PlayerId = (n: number): PlayerId => n as PlayerId;
export const CardDefId = (s: string): CardDefId => s as CardDefId;
export const EntityId = (s: string): EntityId => s as EntityId;
export const AbilityId = (s: string): AbilityId => s as AbilityId;
export const AbilityInstanceId = (s: string): AbilityInstanceId => s as AbilityInstanceId;

/** Player side in a match. Always 0 or 1. */
export type Side = 0 | 1;

/** Opposite-side helper. */
export function otherSide(s: Side): Side {
  return (s === 0 ? 1 : 0) as Side;
}
