/* ═══════════════════════════════════════════════════════
   WOLF-HUNT — League hero class taxonomy

   Every corrupted-League hero target the Antiquarian
   contracts the Wolf to hunt belongs to exactly one of
   these five classes. Class determines the corrupted-
   power library a hero's `powerSet` is drawn from and
   informs the Antiquarian's briefingHints — the Wolf's
   counter-tactics are class-specific.

   Distribution across the 250-hero matrix: 5 classes ×
   10 lords × 5 heroes per (class, lord) IS NOT the rule.
   Class distribution within each Hierarchy lord's cohort
   is canonically uneven, reflecting the lord's domain —
   Mol'Garath the Unmaker corrupts more Soldiers,
   Ith'Rael the Whisperer corrupts more Spies, etc.
   ═══════════════════════════════════════════════════════ */

export type HeroClass =
  | "engineer"
  | "oracle"
  | "assassin"
  | "soldier"
  | "spy";

export const HERO_CLASSES: readonly HeroClass[] = [
  "engineer",
  "oracle",
  "assassin",
  "soldier",
  "spy",
] as const;
