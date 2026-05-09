/* ═══════════════════════════════════════════════════════
   GUILD CUTSCENES MANIFEST — typed registry for the
   producer-delivered guild-cutscene visual drop.

   Source: producer drop DischordianSaga_GuildCutscenes_Complete.zip
   (2026-05-01, 175 assets, 774 MB). Files served from:
     videos/ → cdn/client-public/videos/guild-cutscenes/<category>/
     art/    → cdn/client-public/art/guild-cutscenes/<category>/

   The registry's `id` strings match the `cs_id` values referenced in
   apps/scripts/guild-cutscene-vo-lines.json's `context` field, so
   pairing a VO line with its cinematic at runtime is mechanical.

   Categories mirror the bundle directory layout:
     f1_onboarding · f2_daily · f2_emotes · f3_combat · f4_abilities · f5_guild_hall
   ═══════════════════════════════════════════════════════ */

import { assetUrl } from "@shared/lib/assetUrl";
import { makeAssetManifest } from "./_assetManifest";

export type GuildCutsceneCategory =
  | "f1_onboarding"
  | "f2_daily"
  | "f2_emotes"
  | "f3_combat"
  | "f4_abilities"
  | "f5_guild_hall";

/** F.4 signature abilities have a light (sanctioned) and dark
 *  (corruption) variant; both share the same cs_sig_N number but
 *  ship as separate stills + videos. */
export type GuildCutsceneVariant = "light" | "dark";

export interface GuildCutsceneDef {
  /** Matches cs_id in the lines-file context (e.g. "cs_war_declared",
   *  "cs_sig_1_light"). For F.4 abilities the variant is suffixed. */
  id: string;
  category: GuildCutsceneCategory;
  /** 4–8s MP4 clip. F.2.4 emotes have no video (sticker only). The
   *  five F.3 epoch cutscenes share the unified cs_epoch_change.mp4. */
  videoRelPath?: string;
  /** Beat-ordered stills. Most cutscenes have 2 (start/end); the
   *  F.1 sorting_ceremony has 4 (pre_start, pre_end, post_start,
   *  post_end). F.2.4 emotes have 1 (the anchor-frame sticker). */
  stillRelPaths: readonly string[];
  /** F.2.4 emotes ship a polished + producer-original variant; this
   *  field carries the original. */
  originalStillRelPath?: string;
  /** F.4 only. */
  variant?: GuildCutsceneVariant;
  /** F.4 only — matches the speaker key in guild-cutscene-vo-lines.json
   *  (kanevas | aoki | halverez | orphic | mireille | kasra | vellis |
   *  greenshaw | vex | vasara | vent | proctor). */
  professorId?: string;
  /** F.2.4 only — archetype slug in the bundle filename
   *  (chorus | eyes | archive | between | influencers | yellowcoats |
   *  congress | locks | greygamers | living | forge | architects_study). */
  archonId?: string;
  /**
   * audit/16 PR 22 (finding C7 — Cinematic persona).
   *
   * Optional narrative-state gates. Pre-audit, the 59 guild
   * cutscenes had ZERO narrative gating — they fired whenever
   * the guild's mechanical condition hit, regardless of act,
   * morality, trust, or story flag. The audit'd intent: a
   * cutscene that fires before the act-gate that motivates it
   * is a spoiler; a cutscene that fires after the player has
   * abandoned that storyline is dissonance.
   *
   * All four fields are optional; an absent field means
   * "ungated on this axis." A cutscene with no gates fires on
   * mechanical condition alone (the legacy behaviour). The
   * gate-evaluation runtime (queued; not in this PR) checks
   * each populated gate against game state at fire-time and
   * suppresses the cutscene when any gate fails.
   *
   * Fields mirror the variant-resolver's gates from PR #524 so
   * authors who already understand `MoralityTrustActVariant`
   * can populate cutscene gates with the same vocabulary.
   */
  morality?: "machine" | "balanced" | "humanity" | "any";
  /** Trust band gate. Requires `trustCompanionId` when set. */
  trust?: "cold" | "neutral" | "warm" | "confidant" | "any";
  /** Companion id for the trust gate. */
  trustCompanionId?: string;
  /** Act gate. */
  act?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | "any";
  /** Required narrative flags — ALL must be true for the
   *  cutscene to be eligible. */
  requiredFlags?: readonly string[];
}

/* ─── F.4 signature ability casting table ─── */
/* Drives the 24 cs_sig_N_{light,dark} entries below. Order matches
 * the Production Bible's Mechronis Professor sequence and the F.4
 * ordering in guild-cutscene-vo-lines.json. */
const SIG_PROFESSORS: ReadonlyArray<{
  n: number;
  professorId: string;
  abilityLight: string;
  abilityDark: string;
}> = [
  { n: 1, professorId: "kanevas", abilityLight: "Harmonize", abilityDark: "Dissonance" },
  { n: 2, professorId: "aoki", abilityLight: "Unseen Passage", abilityDark: "Private Confession" },
  { n: 3, professorId: "halverez", abilityLight: "Soul-Read", abilityDark: "Soul-Take" },
  { n: 4, professorId: "orphic", abilityLight: "Phase-Step", abilityDark: "Dimensional Drift" },
  { n: 5, professorId: "mireille", abilityLight: "Viral Word", abilityDark: "Thought Carry" },
  { n: 6, professorId: "kasra", abilityLight: "Parade Order", abilityDark: "Acceptable Casualties" },
  { n: 7, professorId: "vellis", abilityLight: "Verbal Contract", abilityDark: "Blood Oath" },
  { n: 8, professorId: "greenshaw", abilityLight: "Quarantine", abilityDark: "Thought Virus" },
  { n: 9, professorId: "vex", abilityLight: "Rule Rewrite", abilityDark: "House Rules" },
  { n: 10, professorId: "vasara", abilityLight: "Second Breath", abilityDark: "Borrowed Time" },
  { n: 11, professorId: "vent", abilityLight: "Field Repair", abilityDark: "Salvage Rights" },
  { n: 12, professorId: "proctor", abilityLight: "Investigator's Sight", abilityDark: "Architect's Eye" },
];

/* ─── F.2.4 archon emote table (anchor stickers, 512×512) ─── */
const EMOTE_ARCHONS: ReadonlyArray<{ n: number; archonId: string }> = [
  { n: 1, archonId: "chorus" },
  { n: 2, archonId: "eyes" },
  { n: 3, archonId: "archive" },
  { n: 4, archonId: "between" },
  { n: 5, archonId: "influencers" },
  { n: 6, archonId: "yellowcoats" },
  { n: 7, archonId: "congress" },
  { n: 8, archonId: "locks" },
  { n: 9, archonId: "greygamers" },
  { n: 10, archonId: "living" },
  { n: 11, archonId: "forge" },
  { n: 12, archonId: "architects_study" },
];

/* ─── Path helpers ─── */
const stillPath = (cat: GuildCutsceneCategory, file: string) =>
  `art/guild-cutscenes/${cat}/${file}`;
const videoPath = (cat: GuildCutsceneCategory, file: string) =>
  `videos/guild-cutscenes/${cat}/${file}`;

/* ─── F.1 Onboarding (5 cutscenes) ─── */
/* The producer ships sorting_ceremony as 4 stills (pre + post arrival)
 * and 1 unified video. The lines-file references the pre-arrival
 * phase under cs_sorting_ceremony_arrival_pre, so we expose the two
 * arrival phases as separate registry entries that share the video. */
const F1_ONBOARDING: readonly GuildCutsceneDef[] = [
  {
    id: "cs_guild_join",
    category: "f1_onboarding",
    videoRelPath: videoPath("f1_onboarding", "cs_guild_join.mp4"),
    stillRelPaths: [
      stillPath("f1_onboarding", "cs_guild_join_start.png"),
      stillPath("f1_onboarding", "cs_guild_join_end.png"),
    ],
  },
  {
    id: "cs_guild_first_message",
    category: "f1_onboarding",
    videoRelPath: videoPath("f1_onboarding", "cs_guild_first_message.mp4"),
    stillRelPaths: [
      stillPath("f1_onboarding", "cs_guild_first_message_start.png"),
      stillPath("f1_onboarding", "cs_guild_first_message_end.png"),
    ],
  },
  {
    id: "cs_friend_accept",
    category: "f1_onboarding",
    videoRelPath: videoPath("f1_onboarding", "cs_friend_accept.mp4"),
    stillRelPaths: [
      stillPath("f1_onboarding", "cs_friend_accept_start.png"),
      stillPath("f1_onboarding", "cs_friend_accept_end.png"),
    ],
  },
  {
    id: "cs_sorting_ceremony_arrival_pre",
    category: "f1_onboarding",
    videoRelPath: videoPath("f1_onboarding", "cs_sorting_ceremony.mp4"),
    stillRelPaths: [
      stillPath("f1_onboarding", "cs_sorting_ceremony_pre_start.png"),
      stillPath("f1_onboarding", "cs_sorting_ceremony_pre_end.png"),
    ],
  },
  {
    id: "cs_sorting_ceremony_arrival_post",
    category: "f1_onboarding",
    videoRelPath: videoPath("f1_onboarding", "cs_sorting_ceremony.mp4"),
    stillRelPaths: [
      stillPath("f1_onboarding", "cs_sorting_ceremony_post_start.png"),
      stillPath("f1_onboarding", "cs_sorting_ceremony_post_end.png"),
    ],
  },
];

/* ─── F.2 Daily / Weekly (4 cutscenes) ─── */
const F2_DAILY: readonly GuildCutsceneDef[] = (
  ["cs_contract_unlock", "cs_contract_complete", "cs_house_cup_weekly_reset", "cs_donation_milestone"] as const
).map((id) => ({
  id,
  category: "f2_daily" as const,
  videoRelPath: videoPath("f2_daily", `${id}.mp4`),
  stillRelPaths: [
    stillPath("f2_daily", `${id}_start.png`),
    stillPath("f2_daily", `${id}_end.png`),
  ],
}));

/* ─── F.2.4 Emotes (12 anchor stickers, no video) ─── */
const F2_EMOTES: readonly GuildCutsceneDef[] = EMOTE_ARCHONS.map(({ n, archonId }) => {
  const nn = String(n).padStart(2, "0");
  const baseFile = `cs_emote_archon_${nn}_${archonId}`;
  return {
    id: `cs_emote_archon_${n}`,
    category: "f2_emotes" as const,
    archonId,
    stillRelPaths: [stillPath("f2_emotes", `${baseFile}.png`)],
    originalStillRelPath: stillPath("f2_emotes", `${baseFile}_original.png`),
  };
});

/* ─── F.3 Combat & War (12 cutscenes; 8 unique videos) ─── */
/* The five epoch cutscenes share cs_epoch_change.mp4 — the bundle ships
 * one video for the whole epoch transition and per-epoch start/end stills
 * for chyron / overlay use. Registry ids match the lines-file context
 * naming (cs_war_mvp_crowned, cs_alliance_war_placement_lock, etc.); the
 * underlying bundle filenames are shorter and the path strings encode
 * that divergence. */
const F3_EPOCHS = ["privacy", "prophecy", "insurgency", "revelation", "fall"] as const;
interface F3Entry {
  registryId: string;
  bundleSlug: string;
}
const F3_COMBAT_NON_EPOCH: readonly F3Entry[] = [
  { registryId: "cs_war_declared", bundleSlug: "cs_war_declared" },
  { registryId: "cs_war_first_blood", bundleSlug: "cs_war_first_blood" },
  { registryId: "cs_war_mvp_crowned", bundleSlug: "cs_war_mvp" },
  { registryId: "cs_war_victory", bundleSlug: "cs_war_victory" },
  { registryId: "cs_war_defeat", bundleSlug: "cs_war_defeat" },
  { registryId: "cs_alliance_war_placement_lock", bundleSlug: "cs_placement_lock" },
  { registryId: "cs_thought_virus_reinfection", bundleSlug: "cs_thought_virus" },
];
const F3_COMBAT: readonly GuildCutsceneDef[] = [
  ...F3_COMBAT_NON_EPOCH.map(({ registryId, bundleSlug }) => ({
    id: registryId,
    category: "f3_combat" as const,
    videoRelPath: videoPath("f3_combat", `${bundleSlug}.mp4`),
    stillRelPaths: [
      stillPath("f3_combat", `${bundleSlug}_start.png`),
      stillPath("f3_combat", `${bundleSlug}_end.png`),
    ],
  })),
  ...F3_EPOCHS.map((epoch) => ({
    id: `cs_epoch_change_${epoch}`,
    category: "f3_combat" as const,
    videoRelPath: videoPath("f3_combat", "cs_epoch_change.mp4"),
    stillRelPaths: [
      stillPath("f3_combat", `cs_epoch_${epoch}_start.png`),
      stillPath("f3_combat", `cs_epoch_${epoch}_end.png`),
    ],
  })),
];

/* ─── F.4 Signature Abilities (12 sigs × light/dark = 24 entries) ─── */
const F4_ABILITIES: readonly GuildCutsceneDef[] = SIG_PROFESSORS.flatMap(
  ({ n, professorId }) =>
    (["light", "dark"] as const).map<GuildCutsceneDef>((variant) => ({
      id: `cs_sig_${n}_${variant}`,
      category: "f4_abilities",
      variant,
      professorId,
      videoRelPath: videoPath("f4_abilities", `cs_sig_${n}_${variant}.mp4`),
      stillRelPaths: [
        stillPath("f4_abilities", `cs_sig_${n}_${variant}_start.png`),
        stillPath("f4_abilities", `cs_sig_${n}_${variant}_end.png`),
      ],
    })),
);

/* ─── F.5 Guild Hall (7 cutscenes) ─── */
/* Registry ids align with the lines-file context naming
 * (cs_hall_tier_up, cs_signature_room_unlock_oracle_pool); bundle
 * slugs are shorter. */
const F5_GUILD_HALL: readonly GuildCutsceneDef[] = [
  { registryId: "cs_hall_tier_up", bundleSlug: "cs_guild_tier_up" },
  { registryId: "cs_signature_room_unlock_oracle_pool", bundleSlug: "cs_oracle_room_unlock" },
  { registryId: "cs_room_unlock", bundleSlug: "cs_room_unlock" },
  { registryId: "cs_training_grounds", bundleSlug: "cs_training_grounds" },
  { registryId: "cs_trophy_case", bundleSlug: "cs_trophy_case" },
  { registryId: "cs_war_room_unlock", bundleSlug: "cs_war_room_unlock" },
  { registryId: "cs_guild_decor", bundleSlug: "cs_guild_decor" },
  /* Portal Chamber room-unlock has its own VO line
   * (architect_portal_001) but no dedicated bundle drop yet — fall
   * back to the generic cs_room_unlock visuals so the VO ↔ cinematic
   * pairing stays complete. Swap the slug to a dedicated drop when
   * the producer ships portal-chamber-specific stills/videos. */
  { registryId: "cs_signature_room_unlock_portal_chamber", bundleSlug: "cs_room_unlock" },
].map(({ registryId, bundleSlug }) => ({
  id: registryId,
  category: "f5_guild_hall" as const,
  videoRelPath: videoPath("f5_guild_hall", `${bundleSlug}.mp4`),
  stillRelPaths: [
    stillPath("f5_guild_hall", `${bundleSlug}_start.png`),
    stillPath("f5_guild_hall", `${bundleSlug}_end.png`),
  ],
}));

/* ─── Combined registry ─── */
export const GUILD_CUTSCENES: readonly GuildCutsceneDef[] = [
  ...F1_ONBOARDING,
  ...F2_DAILY,
  ...F2_EMOTES,
  ...F3_COMBAT,
  ...F4_ABILITIES,
  ...F5_GUILD_HALL,
];

const manifest = makeAssetManifest(GUILD_CUTSCENES, "id", "stillRelPaths");

/** Resolve `cs_id` → cinematic definition (or `undefined` if unknown). */
export const guildCutsceneById = (id: string): GuildCutsceneDef | undefined =>
  manifest.byId.get(id);

/** Resolve `cs_id` → MP4 video URL. Returns `undefined` for the
 *  videoless F.2.4 emotes or for unknown ids. */
export function guildCutsceneVideoUrl(id: string): string | undefined {
  const def = manifest.byId.get(id);
  return def?.videoRelPath ? assetUrl(def.videoRelPath) : undefined;
}

/** Resolve `cs_id` → ordered still URLs (start, end, …). */
export function guildCutsceneStillUrls(id: string): readonly string[] {
  const def = manifest.byId.get(id);
  return def ? def.stillRelPaths.map(assetUrl) : [];
}

/** Resolve `cs_id` (F.2.4 emote) → producer-original sticker URL. */
export function guildCutsceneEmoteOriginalUrl(id: string): string | undefined {
  const def = manifest.byId.get(id);
  return def?.originalStillRelPath ? assetUrl(def.originalStillRelPath) : undefined;
}

/** All cutscenes in a category (for batch preload, debug tooling). */
export const guildCutscenesByCategory = (cat: GuildCutsceneCategory) =>
  manifest.byField("category", cat);

/** F.4 helper: the 24 ability cutscenes for a given Professor (typically 2 — light + dark). */
export const guildCutscenesByProfessor = (professorId: string) =>
  manifest.byField("professorId", professorId);

export const GUILD_CUTSCENE_TOTAL = manifest.total;
