/**
 * Woven Systems — registry.
 *
 * The 17 entries below are the canonical surfaces of the saga. Each one
 * declares the file paths it lives in and the ripple events it emits /
 * consumes. The Two-Ripple Rule parity check
 * (`_completeness/checks/wovenSystemRippleCoverage.ts`) walks this
 * registry and asserts every `primaryEmits` event has at least two
 * cross-system consumers wired into `rippleEngine.ts`.
 *
 * Adding a new value to {@link WovenSystemId} requires a row here.
 */
import type { WovenSystem } from "./types";

export const WOVEN_SYSTEMS: ReadonlyArray<WovenSystem> = [
  // ─── Core 12 — the named systems ──────────────────────────────
  {
    id: "breeding",
    name: "Breeding",
    description:
      "Bene-Gesserit-style crew bloodlines. Blood classifications PURE / DEMONIC / ADVOCATE.",
    routerPaths: ["apps/server/routers/crew.ts"],
    sharedPaths: ["apps/shared/bloodClassification.ts"],
    uiPaths: [],
    primaryEmits: ["crew_member_classified", "bloodline_inbreeding_penalty"],
    primaryConsumes: ["seal_broken", "yearly_event_started"],
    moodContribution: { famine: 0.1 },
  },
  {
    id: "army",
    name: "Army Recruiting",
    description:
      "Graduate Legion deployment, training, and casualty crawl.",
    routerPaths: ["apps/server/routers/graduateLegion.ts"],
    sharedPaths: [],
    uiPaths: [],
    primaryEmits: ["legion_deployment_complete", "pale_horse_arrives"],
    primaryConsumes: ["seal_broken", "tower_defense_outcome"],
    moodContribution: { conquest: 0.1, death: 0.05 },
  },
  {
    id: "trade_empire",
    name: "Trade Empire",
    description:
      "Sector claims, route safety, market dynamics. Densely woven into the ripple engine already.",
    routerPaths: ["apps/server/routers/tradeEmpire.ts"],
    sharedPaths: [],
    uiPaths: [],
    primaryEmits: ["route_milestone", "trade_route_broken"],
    primaryConsumes: ["seal_broken", "legion_deployment_complete"],
    moodContribution: { conquest: 0.1, famine: 0.1 },
  },
  {
    id: "tower_defense",
    name: "Tower Defense",
    description: "Wave-based defense of the Ark; raid frequency feeds War.",
    routerPaths: ["apps/server/routers/towerDefense.ts"],
    sharedPaths: [],
    uiPaths: [],
    primaryEmits: ["defense_wave_complete"],
    primaryConsumes: ["seal_broken", "legion_deployment_complete"],
    moodContribution: { war: 0.15 },
  },
  {
    id: "chess",
    name: "Chess",
    description:
      "Chess Climb, Side Gate, and Puzzle. Logic-mastery surface.",
    routerPaths: [
      "apps/server/routers/chess.ts",
      "apps/server/routers/chessClimb.ts",
    ],
    sharedPaths: [],
    uiPaths: [],
    primaryEmits: ["chess_result"],
    primaryConsumes: ["seasonal_event_participation"],
    moodContribution: { conquest: 0.05 },
  },
  {
    id: "demon_summoning",
    name: "Demon Summoning",
    description:
      "Hierarchy of the Damned — infernal-pack draws and demon-lord encounters.",
    routerPaths: [],
    sharedPaths: ["apps/shared/hierarchyOfTheDamned.ts"],
    uiPaths: [
      "apps/client/src/pages/HierarchyPage.tsx",
      "apps/client/src/pages/DemonPackPage.tsx",
    ],
    primaryEmits: ["demon_pack_opened"],
    primaryConsumes: ["seal_broken", "crew_member_classified"],
    moodContribution: { war: 0.1, death: 0.1 },
  },
  {
    id: "mechronis_celebration",
    name: "Mechronis & Celebration",
    description:
      "Mechronis Academy term + Celebration trial cadence; professor approvals tie to chess.",
    routerPaths: ["apps/server/routers/celebration.ts"],
    sharedPaths: [],
    uiPaths: ["apps/client/src/pages/MechronisAcademyPage.tsx"],
    primaryEmits: ["celebration_trial_passed"],
    primaryConsumes: ["chess_result", "yearly_event_started"],
    moodContribution: { conquest: 0.05 },
  },
  {
    id: "governance",
    name: "Governance Hub",
    description:
      "Council motions, Architect Console votes, closing-vote bridge for yearly events.",
    routerPaths: ["apps/server/routers/architectConsole.ts"],
    sharedPaths: [
      "apps/shared/governance.ts",
      "apps/shared/governanceConsequenceMap.ts",
    ],
    uiPaths: ["apps/client/src/pages/GovernanceHubPage.tsx"],
    primaryEmits: ["governance_motion_proposed", "governance_motion_passed"],
    primaryConsumes: [
      "yearly_event_closed",
      "guild_milestone_crossed",
      "mystery_solved",
    ],
    moodContribution: { conquest: 0.05 },
  },
  {
    id: "seasonal",
    name: "Seasonal Events",
    description:
      "Recurring rotating events; existing seasonal-events router with participation rewards.",
    routerPaths: ["apps/server/routers/seasonalEvents.ts"],
    sharedPaths: [],
    uiPaths: [],
    primaryEmits: ["seasonal_event_participation"],
    primaryConsumes: ["yearly_event_started"],
    moodContribution: {},
  },
  {
    id: "yearly",
    name: "Yearly Events",
    description:
      "Foundation Day / Severance / Mechronis Festival / Memorial Day. Each closes with a governance motion.",
    // Router lands in Phase 3; declared in the shared layer for now.
    routerPaths: [],
    sharedPaths: ["apps/shared/yearlyEvents.ts"],
    uiPaths: [],
    primaryEmits: ["yearly_event_started", "yearly_event_closed"],
    primaryConsumes: ["seal_broken", "mercy_extended"],
    moodContribution: {},
  },
  {
    id: "transmissions",
    name: "Meme Transmissions",
    description:
      "T01–T09 album cursor + post-launch trumpet slots. Static-overlay shader on Seal VI; silence on Seal VII.",
    routerPaths: ["apps/server/routers/transmissions.ts"],
    sharedPaths: [],
    uiPaths: [],
    primaryEmits: ["transmission_consumed"],
    primaryConsumes: ["seal_broken"],
    moodContribution: { conquest: 0.02 },
  },
  {
    id: "mysteries",
    name: "Mysteries",
    description:
      "Streamed Prism Mystery Engine — seeded cases that gate on seal tier.",
    routerPaths: ["apps/server/routers/mysteries.ts"],
    sharedPaths: [],
    uiPaths: [],
    primaryEmits: ["mystery_solved"],
    primaryConsumes: ["transmission_consumed", "seal_broken"],
    moodContribution: { conquest: 0.05 },
  },

  // ─── Phase 5 weave-in surfaces ────────────────────────────────
  {
    id: "guild",
    name: "Guild",
    description:
      "Guild halls / contracts / wars / expansion. Per-guild horseman mood derived from members.",
    routerPaths: [
      "apps/server/routers/guild.ts",
      "apps/server/routers/guildContracts.ts",
      "apps/server/routers/guildWars.ts",
    ],
    sharedPaths: [],
    uiPaths: [
      "apps/client/src/pages/GuildPage.tsx",
      "apps/client/src/pages/GuildCommonRoomPage.tsx",
      "apps/client/src/pages/GuildExpansionPage.tsx",
    ],
    primaryEmits: ["guild_milestone_crossed"],
    primaryConsumes: ["seal_broken", "yearly_event_started"],
    moodContribution: { conquest: 0.05, war: 0.05, famine: -0.05 },
  },
  {
    id: "social",
    name: "Social",
    description:
      "Friendships / gifts / chat / romance / Memorial Plaza. Counter-tick to seal-driven horseman baselines.",
    routerPaths: [
      "apps/server/routers/socialFeatures.ts",
      "apps/server/routers/friendlyChallenges.ts",
    ],
    sharedPaths: [],
    uiPaths: [],
    primaryEmits: ["memorial_witnessed", "gift_sent"],
    primaryConsumes: ["seal_broken"],
    moodContribution: { death: -0.05, war: -0.02 },
  },
  {
    id: "charity",
    name: "Charity",
    description:
      "Donations + Mercy blend — the canonical counterforce to Seals III & V.",
    routerPaths: ["apps/server/routers/donationSystem.ts"],
    sharedPaths: [],
    uiPaths: [],
    primaryEmits: ["mercy_extended", "item_sacrificed"],
    primaryConsumes: ["yearly_event_started"],
    moodContribution: { famine: -0.1, death: -0.05 },
  },
  {
    id: "custom_items",
    name: "Custom Items",
    description:
      "Cosmetics with provenance (latest seal, active yearly, dominant horseman at craft time).",
    routerPaths: [
      "apps/server/routers/cosmeticShop.ts",
      "apps/server/routers/inventory.ts",
    ],
    sharedPaths: [],
    uiPaths: [],
    primaryEmits: ["item_provenance_stamped"],
    primaryConsumes: ["seal_broken", "yearly_event_started"],
    moodContribution: { conquest: 0.02 },
  },
  {
    id: "dlc_mini",
    name: "Mini DLC",
    description:
      "Mini-DLC chapters obeying the five-system minimum rule (mystery + transmission + item + guild contract + governance motion).",
    routerPaths: ["apps/server/routers/dlcChapters.ts"],
    sharedPaths: ["apps/shared/dlc/miniDlcManifest.ts"],
    uiPaths: [],
    primaryEmits: ["mini_dlc_installed"],
    primaryConsumes: ["seal_broken", "yearly_event_started"],
    moodContribution: {},
  },
];

const _ID_SET = new Set(WOVEN_SYSTEMS.map((s) => s.id));
if (_ID_SET.size !== WOVEN_SYSTEMS.length) {
  throw new Error("WOVEN_SYSTEMS contains duplicate ids");
}

export function getWovenSystem(id: string): WovenSystem | undefined {
  return WOVEN_SYSTEMS.find((s) => s.id === id);
}
