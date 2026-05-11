/**
 * Room state-variant registry — Phase H.C scaffold.
 *
 * Type definitions + registry shape for the composite state-variant
 * resolver. Subsequent sub-phases populate the resolvers:
 *
 *   H.D  Axis 9 TV-infection (clean / exposed / spreading / corrupted / quarantined)
 *   H.E  Axis 11 cycle-phase / time-of-day (dawn / midday / dusk / nightwatch / longnight)
 *   H.F  Axis 12 faction-livery (none / hierarchy / dreamers / pureflame / insurgency / panopticon / collectors / multi)
 *   H.G  Axis 13 storyteller hooks (open list per room)
 *
 * The resolver chain produces a stack of layer descriptors that maps
 * 1:1 to `ParallaxLayer[]` for `apps/client/src/components/ParallaxRoom.tsx`.
 *
 * Canonical fallback chain (composite resolver in
 * apps/shared/roomVariants/compositeResolver.ts):
 *
 *   baseline      ←  always present (depth -0.30)
 *   + axis9       ←  overlay  (depth -0.25)  if state variant exists
 *   + axis12      ←  overlay  (depth -0.20)
 *   + axis11      ←  overlay  (depth -0.15)
 *   + axis13      ←  overlay  (depth -0.10)
 *
 * If a state variant is requested but not in the producer-art library
 * (apps/shared/expansionArt/roomArtManifest.ts), the resolver silently
 * omits that overlay — runtime degrades gracefully to whatever is
 * available, never crashes.
 */

/** Axis 9 — TV-infection state (5 canonical states per INCEPTION §6.5). */
export type TVInfectionState =
  | "clean"
  | "exposed"
  | "spreading"
  | "corrupted"
  | "quarantined";

/** Axis 11 — cycle-phase / time-of-day (4 phases + longnight bonus). */
export type CyclePhaseState =
  | "dawn"
  | "midday"
  | "dusk"
  | "nightwatch"
  | "longnight";

/** Axis 12 — faction-livery (8 canonical states per INCEPTION §6.5). */
export type FactionLivery =
  | "none"
  | "hierarchy"
  | "dreamers"
  | "pureflame"
  | "insurgency"
  | "panopticon"
  | "collectors"
  | "multi";

/** Axis 13 — storyteller hook id (open list; per-room registry in H.G). */
export type StorytellerHookId = string;

/**
 * Descriptor of the *requested* room state. Composite resolver
 * (H.C onwards) tries to satisfy each axis from the producer-art
 * library; missing variants degrade silently (omit that overlay).
 */
export interface RoomStateDescriptor {
  /** Producer zipDir (= CDN folder name). */
  readonly zipDir: string;
  /** Axis 9 TV-infection — runtime resolver in H.D. */
  readonly axis9?: TVInfectionState;
  /** Axis 11 cycle-phase — runtime resolver in H.E (consumes
   *  `apps/shared/timeOfDay.ts` `currentPhase()`). */
  readonly axis11?: CyclePhaseState;
  /** Axis 12 faction-livery — runtime resolver in H.F (consumes
   *  faction-binding state from game progress). */
  readonly axis12?: FactionLivery;
  /** Axis 13 storyteller hook — runtime resolver in H.G (consumes
   *  narrative-flag triggers per-room). */
  readonly axis13?: StorytellerHookId;
}

/**
 * One layer in the resolved composite. Maps directly to
 * `ParallaxLayer` (apps/client/src/components/ParallaxRoom.tsx).
 */
export interface ResolvedRoomLayer {
  /** CDN URL. */
  readonly src: string;
  /** Parallax depth — negative for background; ParallaxRoom convention. */
  readonly depth: number;
  /** Which axis this layer originates from. Useful for debugging
   *  + per-axis runtime toggles. */
  readonly axis: "baseline" | "axis9" | "axis11" | "axis12" | "axis13";
  /** The producer variantKey (e.g. "baseline", "tv_spreading"). */
  readonly variantKey: string;
}

/**
 * Canonical depth assignments per axis. Shallower (closer to 0)
 * means the layer renders *over* deeper layers (background-most is
 * baseline at -0.30).
 */
export const AXIS_DEPTHS = {
  baseline: -0.3,
  axis9: -0.25,
  axis12: -0.2,
  axis11: -0.15,
  axis13: -0.1,
} as const;

/**
 * Resolution result — what the composite resolver returns.
 */
export interface ResolvedRoomVariant {
  /** Ordered layer stack (back to front; baseline first). */
  readonly layers: readonly ResolvedRoomLayer[];
  /** The descriptor that was resolved (for diagnostics). */
  readonly descriptor: RoomStateDescriptor;
  /** Which axes had a matching variant in the library; useful for
   *  parity gates + telemetry. */
  readonly satisfied: readonly ("baseline" | "axis9" | "axis11" | "axis12" | "axis13")[];
}
