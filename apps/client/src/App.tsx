import { Suspense, lazy, useState, useEffect, useRef, useCallback, type ReactNode, type ComponentType } from "react";
import { MotionConfig } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import GameErrorBoundary from "./components/GameErrorBoundary";
import RouteErrorBoundary from "./components/RouteErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LoredexProvider } from "./contexts/LoredexContext";
import { PlayerProvider } from "./contexts/PlayerContext";
import { GamificationProvider } from "./contexts/GamificationContext";
import { GameProvider, useGame } from "./contexts/GameContext";
import { MoralityThemeProvider } from "./contexts/MoralityThemeContext";
import { SoundProvider, useSound } from "./contexts/SoundContext";
import { AmbientMusicProvider } from "./contexts/AmbientMusicContext";
import { GameAudioProvider } from "./contexts/GameAudioContext";
import { SagaThemeBGMProvider } from "./contexts/SagaThemeBGMContext";
import PlayerBar from "./components/PlayerBar";
import CoNexusMediaPlayer from "./components/CoNexusMediaPlayer";
import AppShell from "./components/AppShellImmersive";
import CommandConsole from "./components/CommandConsole";
import AchievementToast from "./components/AchievementToast";
import { CompanionCommentToast } from "./components/companion/CompanionCommentToast";
import AchievementUnlockToast from "./components/AchievementUnlockToast";
import RememberThisToast from "./components/RememberThisToast";
import FeatureUnlockToast from "./components/FeatureUnlockToast";
import HellboxAffordanceToast from "./components/HellboxAffordanceToast";
import MolGarathAudienceOfferToast from "./components/MolGarathAudienceOfferToast";
import { useHellboxDiscovery } from "./hooks/useHellboxDiscovery";
import { useLivingUniverseSync } from "./hooks/useLivingUniverseSync";

/** Side-effect-only watcher — sets HELLBOX_DISCOVERED_FLAG on medbay entry. */
function HellboxDiscoveryWatcher() {
  useHellboxDiscovery();
  return null;
}

/** Side-effect-only watcher — mirrors server-side Living Universe active
 *  events into GameContext flags so the LivingShipSensorOverlay can render. */
function LivingUniverseSyncWatcher() {
  useLivingUniverseSync();
  return null;
}
import CompanionHost from "./companion/CompanionHost";
import { WatcherHost } from "./companion/WatcherHost";
import { setContext as setCompanionContext } from "./companion/companionScheduler";
import TradeNotificationWatcher from "./components/TradeNotificationWatcher";
import ProtectedRoute from "./components/ProtectedRoute";
import DiscoveryUnlockOverlay from "./components/DiscoveryUnlockOverlay";
import DiscoveryVideoOverlay from "./components/DiscoveryVideoOverlay";
import DiscoveryNotification from "./components/DiscoveryNotification";
import QuestTracker from "./components/QuestTracker";
import QuestRewardSystem from "./components/QuestRewardSystem";
import ElaraDialog from "./components/ElaraDialog";
import CharacterWidget from "./components/CharacterWidget";
import { DailyRewardPopup } from "./components/DailyRewards";
import RadioMode from "./components/RadioMode";
import EasterEggs from "./components/EasterEggs";
import UniverseAtmosphere from "./components/UniverseAtmosphere";
import SoundControls from "./components/SoundControls";
import { SlideshowPlayerRoot } from "./components/SlideshowPlayerRoot";
import DreamerVisionPlayer from "./components/DreamerVisionPlayer";
import InstallPromptBanner from "./components/InstallPromptBanner";
import ImmersiveModeManager from "./components/ImmersiveModeManager";
import { DischordiaCycleSync } from "./components/DischordiaCycleSync";
import { useTitleEarnedToasts } from "./hooks/useTitleEarnedToasts";
import { useDreamerRelayHints } from "./hooks/useDreamerRelayHints";
import { ForgivenessChoicePanel } from "./components/ForgivenessChoicePanel";
import { Act1ClosingChoicePanel } from "./components/Act1ClosingChoicePanel";
import { useElaraTTS } from "./hooks/useElaraTTS";
import { useReduceMotion } from "./hooks/useReduceMotion";
import { useVoidEngine } from "./engine/useVoidEngine";
import { useArchetypeDetection } from "./hooks/useArchetypeDetection";
import { useSortingTrigger } from "./hooks/useSortingTrigger";
import { useGearSync } from "./hooks/useGearSync";
import { useAuth } from "./_core/hooks/useAuth";
import { useAnalytics } from "./hooks/useAnalytics";
import { useTutorialOrchestrator } from "./hooks/useTutorialOrchestrator";
import { syncFromServer, initSync } from "@/lib/settingsSync";
import { detectQualityTier, applyQualityTierToDOM } from "@/lib/qualityTier";
import { installViewTransitions } from "@/lib/viewTransitions";
import { logBootBanner, useIdleTitleCycle } from "@/lib/liminalTouches";
import { useMoralityStore } from "@/stores/moralityStore";
import { initCrossGameBeats } from "@/lib/crossGameBeats";
import RecapOverlay, { shouldShowRecap, RECAP_INACTIVITY_DAYS } from "./components/RecapOverlay";
import { loadingManager, LOADING_TASKS } from "@/lib/loadingProgress";
import { trpc } from "@/lib/trpc";
import TitlePage from "./pages/TitlePage";
import { TitleGate } from "./pages/title/TitleGate";
import LoadingScreen from "./components/LoadingScreen";
import { CardGridSkeleton, LeaderboardSkeleton, PageSkeleton } from "./components/SkeletonLoader";
import SortingCeremony from "./components/SortingCeremony";
import { ARCHON_VOICE_MAPPING } from "./game/archonTrainingVoices";
import "./engine/void-materials.css";
// Side-effect import: ensures the systems integration hub is reachable,
// making passive-bonus aggregator, NPC relationships, and 10+ narrative
// systems available to any component that needs them.
import "./game/systemsIntegration";

/* ═══ LAZY PAGE IMPORTS — Code splitting for all 50+ pages ═══ */
const Home = lazy(() => import("./pages/BridgeConsole"));
const EntityPage = lazy(() => import("./pages/EntityPage"));
const SongPage = lazy(() => import("./pages/SongPage"));
const AlbumPage = lazy(() => import("./pages/AlbumPage"));
const BoardPage = lazy(() => import("./pages/BoardPage"));
const TimelinePage = lazy(() => import("./pages/TimelinePage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const CharacterTimeline = lazy(() => import("./pages/CharacterTimeline"));
const WatchPage = lazy(() => import("./pages/WatchPage"));
const FightPage = lazy(() => import("./pages/FightPage"));
const EssenceHarvestPage = lazy(() => import("./pages/EssenceHarvestPage"));
const ConsolePage = lazy(() => import("./pages/ConsolePage"));
const CardBrowserPage = lazy(() => import("./pages/CardBrowserPage"));
// #6 / #46 — replay share-link landing page. Public route; viewer
// resolves the unguessable shareToken via getReplayByToken and runs
// the persisted action log through the deterministic reducer.
const ReplayViewerPage = lazy(() => import("./pages/ReplayViewerPage"));
const TerminusSwarmPage = lazy(() => import("./game/terminus-swarm/TerminusSwarmPage"));
// The legacy CardGamePage (3-lane "Dischordian Struggle") was removed
// in favor of the Duelyst-style tcg-core pipeline. /cards/play now
// routes to the existing DuelystPage alias declared below.
const InceptionArkPage = lazy(() => import("./pages/InceptionArkPage"));
const CrewRosterPage = lazy(() => import("./pages/CrewRosterPage"));
const TrophyRoomPage = lazy(() => import("./pages/TrophyRoomPage"));
const WitnessingHubPage = lazy(() => import("./pages/WitnessingHubPage"));
const Act1CardLadderPage = lazy(() => import("./pages/Act1CardLadderPage"));
const Act3CardLadderPage = lazy(() => import("./pages/Act3CardLadderPage"));
const Act6CardLadderPage = lazy(() => import("./pages/Act6CardLadderPage"));
const Act7CardLadderPage = lazy(() => import("./pages/Act7CardLadderPage"));
const Act4MatchPage = lazy(() => import("./pages/Act4MatchPage"));
const Act4PrisonerStoryPage = lazy(() => import("./pages/Act4PrisonerStoryPage"));
const Act1C4TrialPage = lazy(() => import("./pages/Act1C4TrialPage"));
const DevVariantsPage = lazy(() => import("./pages/DevVariantsPage"));
const DevGuildCutscenesPage = lazy(() => import("./pages/DevGuildCutscenesPage"));
const CrossGameThreadsPage = lazy(() => import("./pages/CrossGameThreadsPage"));
const DreamerFragmentsPage = lazy(() => import("./pages/DreamerFragmentsPage"));
const DreamerDossierPage = lazy(() => import("./pages/DreamerDossierPage"));
const LoredexGraphPage = lazy(() => import("./pages/LoredexGraphPage"));
const Act2InterludePage = lazy(() => import("./pages/Act2InterludePage"));
const EngineersBenchPage = lazy(() => import("./pages/EngineersBenchPage"));
const HellboxPortalPage = lazy(() => import("./pages/HellboxPortalPage"));
const MatrixSchoolEpisodePage = lazy(() => import("./pages/MatrixSchoolEpisodePage"));
const MolGarathAudiencePage = lazy(() => import("./pages/MolGarathAudiencePage"));
const HamletConspiracyBoardPage = lazy(() => import("./pages/HamletConspiracyBoardPage"));
const GameMastersArenaAct2Page = lazy(() => import("./pages/GameMastersArenaAct2Page"));
const Act5InterludePage = lazy(() => import("./pages/Act5InterludePage"));
const BridgeOfKaelPage = lazy(() => import("./pages/BridgeOfKaelPage"));
const VortexIncursionPage = lazy(() => import("./pages/VortexIncursionPage"));
const TradeWarsPage = lazy(() => import("./game/TradeEmpirePage"));
const WarMapPage = lazy(() => import("./pages/WarMapPage"));
const DeckBuilderPage = lazy(() => import("./pages/DeckBuilderPage"));
const CitizenCreationPage = lazy(() => import("./pages/CitizenCreationPage"));
const CharacterSheetPage = lazy(() => import("./pages/CharacterSheetPage"));
const IdeologyPage = lazy(() => import("./pages/IdeologyPage"));
const PetBattlesPage = lazy(() => import("./pages/PetBattlesPage"));
const ApprenticePage = lazy(() => import("./pages/ApprenticePage"));
const GuildCommonRoomPage = lazy(() => import("./pages/GuildCommonRoomPage"));
const MechronisAcademyPage = lazy(() => import("./pages/MechronisAcademyPage"));
const HouseCupPage = lazy(() => import("./pages/HouseCupPage"));
const PurgeRitualPage = lazy(() => import("./pages/PurgeRitualPage"));
const CohortPage = lazy(() => import("./pages/CohortPage"));
const SystemsLibraryPage = lazy(() => import("./pages/SystemsLibraryPage"));
const LegionMapPage = lazy(() => import("./pages/LegionMapPage"));
const GraduateLegionPage = lazy(() => import("./pages/GraduateLegionPage"));
const TransmissionInboxPage = lazy(() => import("./pages/TransmissionInboxPage"));
const AntiquariansJournalPage = lazy(() => import("./pages/AntiquariansJournalPage"));
const AntiquariansIndexPage = lazy(() => import("./pages/AntiquariansIndexPage"));
const ResearchLabPage = lazy(() => import("./pages/ResearchLabPage"));
const StorePage = lazy(() => import("./pages/StorePage"));
const GamesPage = lazy(() => import("./pages/GamesPage"));
const DiscographyPage = lazy(() => import("./pages/DiscographyPage"));
const SagaTimelinePage = lazy(() => import("./pages/SagaTimelinePage"));
const FavoritesPage = lazy(() => import("./pages/FavoritesPage"));
const LoreQuizPage = lazy(() => import("./pages/LoreQuizPage"));
const CodexPage = lazy(() => import("./pages/CodexPage"));
// CardBattlePage removed — redirects to Dischordia
const CardBattlePage = lazy(() => import("./game/duelyst/DuelystPage"));
const DuelystPage = lazy(() => import("./game/duelyst/DuelystPage"));
const CardGalleryPage = lazy(() => import("./pages/CardGalleryPage"));
const PlayerProfilePage = lazy(() => import("./pages/PlayerProfilePage"));
const LeaderboardPage = lazy(() => import("./pages/LeaderboardPage"));
const AwakeningPage = lazy(() => import("./pages/AwakeningPage"));
const ArkExplorerPage = lazy(() => import("./pages/ArkExplorerPage"));
const PreludePage = lazy(() => import("./pages/PreludePage"));
const PreludeAct1GalleryPage = lazy(() => import("./pages/PreludeAct1GalleryPage"));
const StoryModePage = lazy(() => import("./pages/StoryModePage"));
const BossBattlePage = lazy(() => import("./pages/BossBattlePage"));
const CardChallengePage = lazy(() => import("./pages/CardChallengePage"));
const ConexusPortalPage = lazy(() => import("./pages/ConexusPortalPage"));
const AchievementsGalleryPage = lazy(() => import("./pages/AchievementsGalleryPage"));
const CasesPage = lazy(() => import("./pages/CasesPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
// #148 — telemetry visualization for the metrics already captured by
// Sentry / OpenTelemetry / performanceMonitor / matchLengthMonitor.
// Admin-gated client-side as a fast-fail; the underlying tRPC queries
// are admin-gated server-side.
const AdminHealthPage = lazy(() => import("./pages/AdminHealthPage"));
const AdminPvpPage = lazy(() => import("./pages/AdminPvpPage"));
const ArchitectConsolePage = lazy(() => import("./pages/ArchitectConsolePage"));
const ArchitectDossierPage = lazy(() => import("./pages/ArchitectDossierPage"));
const ArchitectCryptic = lazy(() => import("./pages/ArchitectCryptic"));
const DreamerFragment = lazy(() => import("./pages/DreamerFragment"));
const HierarchyPage = lazy(() => import("./pages/HierarchyPage"));
const DemonPackPage = lazy(() => import("./pages/DemonPackPage"));
const FightLeaderboardPage = lazy(() => import("./pages/FightLeaderboardPage"));
const PvpArenaPage = lazy(() => import("./pages/PvpArenaPage"));
const TitlesPage = lazy(() => import("./pages/TitlesPage"));
const ConspiracyBoardsPage = lazy(() => import("./pages/ConspiracyBoardsPage"));
const GuildExpansionPage = lazy(() => import("./pages/GuildExpansionPage"));
const Tier5PvpHubPage = lazy(() => import("./pages/Tier5PvpHubPage"));
const CoopEncountersPage = lazy(() => import("./pages/CoopEncountersPage"));
const DraftTournamentPage = lazy(() => import("./pages/DraftTournamentPage"));
const CardTradingPage = lazy(() => import("./pages/CardTradingPage"));
const CardAchievementsPage = lazy(() => import("./pages/CardAchievementsPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const ClueJournalPage = lazy(() => import("./pages/ClueJournalPage"));
const ResearchMinigamePage = lazy(() => import("./pages/ResearchMinigamePage"));
const LoreTutorialHubPage = lazy(() => import("./pages/LoreTutorialHubPage"));
const MoralityLeaderboardPage = lazy(() => import("./pages/MoralityLeaderboardPage"));
const ForgePage = lazy(() => import("./pages/ForgePage"));
const CompanionHubPage = lazy(() => import("./pages/CompanionHubPage"));
const FleetViewerPage = lazy(() => import("./pages/FleetViewerPage"));
const DiplomacyPage = lazy(() => import("./pages/DiplomacyPage"));
const FactionWarPage = lazy(() => import("./pages/FactionWarPage"));
const MarketplacePage = lazy(() => import("./pages/MarketplacePage"));
const QuestBoardPage = lazy(() => import("./pages/QuestBoardPage"));
const GuildPage = lazy(() => import("./pages/GuildPage"));
const BattlePassPage = lazy(() => import("./pages/BattlePassPage"));
const InventoryPage = lazy(() => import("./pages/InventoryPage"));
const ChessPage = lazy(() => import("./pages/ChessPage"));
const ChessTutorialPage = lazy(() => import("./pages/ChessTutorialPage"));
const ChessPrincesGamePage = lazy(() => import("./pages/ChessPrincesGamePage"));
const ChessClimbPage = lazy(() => import("./pages/ChessClimbPage"));
const DischordianLogicSongPage = lazy(() => import("./pages/DischordianLogicSongPage"));
const ChessPuzzlePage = lazy(() => import("./pages/ChessPuzzlePage"));
const ChessStudyPage = lazy(() => import("./pages/ChessStudyPage"));
const SelfPortraitPage = lazy(() => import("./pages/SelfPortraitPage"));
const OracleDeckPage = lazy(() => import("./pages/OracleDeckPage"));
const ImprintGalleryPage = lazy(() => import("./pages/ImprintGalleryPage"));
// DuelystClassicPage removed — Dischordia is the only card game
const DuelystClassicPage = lazy(() => import("./game/duelyst/DuelystPage"));
const SpectatorPage = lazy(() => import("./pages/SpectatorPage"));
const SpaceStationPage = lazy(() => import("./pages/SpaceStationPage"));
const SyndicateWorldPage = lazy(() => import("./pages/SyndicateWorldPage"));
const TowerDefensePage = lazy(() => import("./pages/TowerDefensePage"));
const PrestigeQuestPage = lazy(() => import("./pages/PrestigeQuestPage"));
const PrestigeCycleResetPage = lazy(() => import("./pages/PrestigeCycleResetPage"));
const CompetitiveArenaPage = lazy(() => import("./pages/CompetitiveArenaPage"));
const SeasonalEventsPage = lazy(() => import("./pages/SeasonalEventsPage"));
const ReplayPage = lazy(() => import("./pages/ReplayPage"));
const PersonalQuartersPage = lazy(() => import("./pages/PersonalQuartersPage"));
const FriendlyChallengesPage = lazy(() => import("./pages/FriendlyChallengesPage"));
const CoopRaidPage = lazy(() => import("./pages/CoopRaidPage"));
const BossMasteryPage = lazy(() => import("./pages/BossMasteryPage"));
const CosmeticShopPage = lazy(() => import("./pages/CosmeticShopPage"));
const DonationPage = lazy(() => import("./pages/DonationPage"));
const LionsClubApplicationPage = lazy(() => import("./pages/LionsClubApplicationPage"));
const OrderOfTheDreamerPage = lazy(() => import("./pages/OrderOfTheDreamerPage"));
const SocialPage = lazy(() => import("./pages/SocialPage"));
const LoreJournalPage = lazy(() => import("./pages/LoreJournalPage"));
const ArmyManagementPage = lazy(() => import("./pages/ArmyManagementPage"));
const ShipSchematicMap = lazy(() => import("./components/ShipSchematicMap"));
const GamemastersArenaPage = lazy(() => import("./game/GamemastersArenaPage"));
const PalimpsestEpisodesPage = lazy(() => import("./game/PalimpsestEpisodesPage"));
const DegensCasinoPage = lazy(() => import("./game/DegensCasinoPage"));
const CasinoLeaderboardPage = lazy(() => import("./game/CasinoLeaderboardPage"));
const SignalDecryptionPage = lazy(() => import("./game/SignalDecryptionPage"));
const StarChartPage = lazy(() => import("./game/StarChartPage"));
const HackingPuzzlePage = lazy(() => import("./game/HackingPuzzlePage"));
const SpecimenCollectionPage = lazy(() => import("./game/SpecimenCollectionPage"));
const BestiaryPage = lazy(() => import("./game/BestiaryPage"));
const BountyBoardPage = lazy(() => import("./game/BountyBoardPage"));
const NPCInboxPage = lazy(() => import("./game/NPCInboxPage"));
const AllianceWarPage = lazy(() => import("./game/AllianceWarPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const PlanetGalleryPage = lazy(() => import("./pages/PlanetGalleryPage"));
const SuitGalleryPage = lazy(() => import("./pages/SuitGalleryPage"));
const GovernanceHubPage = lazy(() => import("./pages/GovernanceHubPage"));
const SoulStonesPage = lazy(() => import("./features/soulStones/SoulStonesPage"));
const ChristmasCasinoPage = lazy(() => import("./features/events/christmasInJuly/CasinoFloor"));
const PlayerCabinPage = lazy(() => import("./pages/PlayerCabinPage"));
const DeadMansCircuitPage = lazy(() => import("./pages/DeadMansCircuitPage"));
const CADESFPSPage = lazy(() => import("./pages/CADESFPSPage"));

/* ═══ LOADING FALLBACK ═══ */
function TitleToastHost() {
  useTitleEarnedToasts();
  return null;
}

/** D4 (dual-faction recruitment plan) — mounts the hook that fires
 *  Elara's covert-relay companion-comment lines on dreamer-awareness
 *  threshold crossings. Same pattern as TitleToastHost: lifecycle-only
 *  side effect, no UI. */
function DreamerRelayHintsHost() {
  useDreamerRelayHints();
  return null;
}

function PageLoader() {
  return <LoadingScreen />;
}

/** Wraps a game page component in ErrorBoundary + Suspense for crash isolation */
function GameRoute({ component: Comp, name }: { component: ComponentType; name?: string }) {
  return (
    <GameErrorBoundary pageName={name}>
      <Suspense fallback={<PageLoader />}>
        <Comp />
      </Suspense>
    </GameErrorBoundary>
  );
}

function Router() {
  return (
    <RouteErrorBoundary>
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Home} />
        {/* #6 / #46 — replay share-link landing. Public, no AuthGate
            so a non-logged-in viewer following a share-link lands
            on a real, scrubable replay rather than a login wall. */}
        <Route path="/replay/:token" component={ReplayViewerPage} />
        <Route path="/board" component={BoardPage} />
        <Route path="/entity/:id" component={EntityPage} />
        <Route path="/song/:id" component={SongPage} />
        <Route path="/album/:slug" component={AlbumPage} />
        <Route path="/timeline" component={TimelinePage} />
        <Route path="/search" component={SearchPage} />
        <Route path="/character-timeline" component={CharacterTimeline} />
        <Route path="/watch" component={WatchPage} />
        <Route path="/fight">{() => <GameRoute component={FightPage} />}</Route>
        <Route path="/collectors-ledger">{() => <GameRoute component={EssenceHarvestPage} />}</Route>
        <Route path="/console" component={ConsolePage} />
        <Route path="/cards">{() => <Suspense fallback={<CardGridSkeleton />}><CardBrowserPage /></Suspense>}</Route>
        <Route path="/cards/play">{() => <GameRoute component={DuelystPage} />}</Route>
        <Route path="/duelyst">{() => <GameRoute component={DuelystPage} />}</Route>
        <Route path="/terminus-swarm">{() => <GameRoute component={TerminusSwarmPage} />}</Route>
        <Route path="/ark" component={ArkExplorerPage} />
        <Route path="/prelude" component={PreludePage} />
        <Route path="/prelude-act1-gallery" component={PreludeAct1GalleryPage} />
        <Route path="/story">{() => <GameRoute component={StoryModePage} />}</Route>
        <Route path="/ark-legacy" component={InceptionArkPage} />
        <Route path="/crew" component={CrewRosterPage} />
        <Route path="/ship-map" component={ShipSchematicMap} />
        <Route path="/trophy" component={TrophyRoomPage} />
        <Route path="/witnessing" component={WitnessingHubPage} />
        <Route path="/act1-ladder" component={Act1CardLadderPage} />
        <Route path="/act3-ladder" component={Act3CardLadderPage} />
        <Route path="/act6-ladder" component={Act6CardLadderPage} />
        <Route path="/act7-ladder" component={Act7CardLadderPage} />
        <Route path="/act4-match" component={Act4MatchPage} />
        <Route path="/act4-prisoner" component={Act4PrisonerStoryPage} />
        <Route path="/act1-c4-trial" component={Act1C4TrialPage} />
        <Route path="/dev/variants" component={DevVariantsPage} />
        <Route path="/dev/guild-cutscenes" component={DevGuildCutscenesPage} />
        <Route path="/cross-game-threads" component={CrossGameThreadsPage} />
        {/* Dreamer Fragments — Loredex retroactive-reveal section.
            Server-side gated; the page renders a 404 shell until the
            player has received Vision 3. */}
        <Route path="/loredex/dreamer-fragments" component={DreamerFragmentsPage} />
        {/* C3 — Loredex relationship graph viewer (focus + 1-hop).
            Reads ?focus=entity_id from the query string; defaults to
            the focus entity declared in LoredexGraphPage. */}
        <Route path="/loredex/graph" component={LoredexGraphPage} />
        <Route path="/act2-interlude" component={Act2InterludePage} />
        <Route path="/engineers-bench" component={EngineersBenchPage} />
        <Route path="/hellbox" component={HellboxPortalPage} />
        <Route path="/matrix/:episodeId" component={MatrixSchoolEpisodePage} />
        <Route path="/mol-garath-audience" component={MolGarathAudiencePage} />
        <Route path="/conspiracy-board" component={HamletConspiracyBoardPage} />
        <Route path="/game-masters-arena" component={GameMastersArenaAct2Page} />
        <Route path="/act5-interlude" component={Act5InterludePage} />
        <Route path="/bridge-of-kael" component={BridgeOfKaelPage} />
        <Route path="/vortex-incursion" component={VortexIncursionPage} />
        <Route path="/trade-empire">{() => <GameRoute component={TradeWarsPage} />}</Route>
        <Route path="/war-map">{() => <GameRoute component={WarMapPage} />}</Route>
        <Route path="/deck-builder" component={DeckBuilderPage} />
        <Route path="/create-citizen" component={CitizenCreationPage} />
        <Route path="/character-sheet" component={CharacterSheetPage} />
        <Route path="/ideology" component={IdeologyPage} />
        <Route path="/pet-battles">{() => <GameRoute component={PetBattlesPage} />}</Route>
        <Route path="/apprentice" component={ApprenticePage} />
        <Route path="/common-room" component={GuildCommonRoomPage} />
        <Route path="/academy" component={MechronisAcademyPage} />
        <Route path="/house-cup" component={HouseCupPage} />
        <Route path="/purge" component={PurgeRitualPage} />
        <Route path="/cohort" component={CohortPage} />
        <Route path="/systems-library" component={SystemsLibraryPage} />
        <Route path="/legion-map" component={LegionMapPage} />
        <Route path="/transmissions" component={TransmissionInboxPage} />
        <Route path="/antiquarian-journal" component={AntiquariansJournalPage} />
        <Route path="/antiquarian-index" component={AntiquariansIndexPage} />
        <Route path="/legion" component={GraduateLegionPage} />
        <Route path="/research-lab" component={ResearchLabPage} />
        {/* /games removed — all games accessed through Ark rooms */}
        <Route path="/forge" component={ForgePage} />
        <Route path="/discography" component={DiscographyPage} />
        <Route path="/saga-timeline" component={SagaTimelinePage} />
        <Route path="/favorites" component={FavoritesPage} />
        <Route path="/quiz" component={LoreQuizPage} />
        <Route path="/codex" component={CodexPage} />
        <Route path="/store" component={StorePage} />
        <Route path="/battle">{() => <GameRoute component={CardBattlePage} />}</Route>
        <Route path="/card-gallery">{() => <Suspense fallback={<CardGridSkeleton />}><CardGalleryPage /></Suspense>}</Route>
        <Route path="/profile" component={PlayerProfilePage} />
        <Route path="/leaderboard">{() => <Suspense fallback={<LeaderboardSkeleton />}><LeaderboardPage /></Suspense>}</Route>
        <Route path="/boss-battle">{() => <GameRoute component={BossBattlePage} />}</Route>
        <Route path="/card-challenge">{() => <GameRoute component={CardChallengePage} />}</Route>
        <Route path="/conexus-portal" component={ConexusPortalPage} />
        <Route path="/achievements" component={AchievementsGalleryPage} />
        <Route path="/cases" component={CasesPage} />
        <Route path="/admin" component={AdminPage} />
        <Route path="/admin/health" component={AdminHealthPage} />
        <Route path="/admin/pvp" component={AdminPvpPage} />
        <Route path="/architect-console" component={ArchitectConsolePage} />
        <Route path="/architect/dossier" component={ArchitectDossierPage} />
        {/* Dreamer Dossier — cryptic vision-summary mirror of the
            Architect dossier. Server-side gated on Vision 3 receipt;
            renders the same 404 shell as /dreamer pre-unlock. */}
        <Route path="/dreamer/dossier" component={DreamerDossierPage} />
        {/* Liminal touch — 23-second-delayed cryptic transcript at /architect.
            Distinct from /architect/dossier (which is the structured candidate
            file). Order matters: /architect/dossier must come first so the
            longer-prefix route doesn't get shadowed. */}
        <Route path="/architect" component={ArchitectCryptic} />
        {/* Liminal touch — /dreamer 404-styled page with vision fragment.
            Intercepted before the catch-all so direct URL visits land here
            instead of NotFound; navigation through the app never hits it. */}
        <Route path="/dreamer" component={DreamerFragment} />
        <Route path="/hierarchy" component={HierarchyPage} />
        <Route path="/demon-packs">{() => <Suspense fallback={<CardGridSkeleton />}><DemonPackPage /></Suspense>}</Route>
        <Route path="/fight-leaderboard" component={FightLeaderboardPage} />
        <Route path="/pvp">{() => <GameRoute component={PvpArenaPage} />}</Route>
        <Route path="/titles">{() => <Suspense fallback={null}><TitlesPage /></Suspense>}</Route>
        <Route path="/conspiracy">{() => <Suspense fallback={null}><ConspiracyBoardsPage /></Suspense>}</Route>
        <Route path="/guild-hall">{() => <Suspense fallback={null}><GuildExpansionPage /></Suspense>}</Route>
        <Route path="/pvp-variants">{() => <Suspense fallback={null}><Tier5PvpHubPage /></Suspense>}</Route>
        <Route path="/coop">{() => <Suspense fallback={null}><CoopEncountersPage /></Suspense>}</Route>
        <Route path="/draft">{() => <GameRoute component={DraftTournamentPage} />}</Route>
        <Route path="/trading" component={CardTradingPage} />
        <Route path="/card-achievements" component={CardAchievementsPage} />
        <Route path="/settings" component={SettingsPage} />
        <Route path="/clue-journal" component={ClueJournalPage} />
        <Route path="/research-minigame">{() => <GameRoute component={ResearchMinigamePage} />}</Route>
        {/* /lore-tutorials removed — Elara teaches naturally through room dialog */}
        <Route path="/morality-census" component={MoralityLeaderboardPage} />
        <Route path="/companions" component={CompanionHubPage} />
        <Route path="/fleet" component={FleetViewerPage} />
        <Route path="/diplomacy" component={DiplomacyPage} />
        <Route path="/faction-wars">{() => <GameRoute component={FactionWarPage} />}</Route>
        <Route path="/marketplace" component={MarketplacePage} />
        <Route path="/quests" component={QuestBoardPage} />
        <Route path="/guild" component={GuildPage} />
        <Route path="/battle-pass" component={BattlePassPage} />
        <Route path="/inventory" component={InventoryPage} />
        <Route path="/chess">{() => <GameRoute component={ChessPage} />}</Route>
        <Route path="/chess/tutorial">{() => <GameRoute component={ChessTutorialPage} />}</Route>
        <Route path="/chess/princes-game">{() => <GameRoute component={ChessPrincesGamePage} />}</Route>
        <Route path="/chess/climb">{() => <GameRoute component={ChessClimbPage} />}</Route>
        <Route path="/dischordian-logic">{() => <GameRoute component={DischordianLogicSongPage} />}</Route>
        <Route path="/chess/puzzle">{() => <GameRoute component={ChessPuzzlePage} />}</Route>
        <Route path="/chess/study">{() => <GameRoute component={ChessStudyPage} />}</Route>
        <Route path="/self-portrait">{() => <GameRoute component={SelfPortraitPage} />}</Route>
        <Route path="/oracle">{() => <GameRoute component={OracleDeckPage} />}</Route>
        <Route path="/imprints">{() => <GameRoute component={ImprintGalleryPage} />}</Route>
        <Route path="/duelyst-play">{() => <GameRoute component={DuelystClassicPage} />}</Route>
        <Route path="/spectate" component={SpectatorPage} />
        <Route path="/gamemasters-arena">{() => <GameRoute component={GamemastersArenaPage} />}</Route>
        <Route path="/palimpsest">{() => <GameRoute component={PalimpsestEpisodesPage} />}</Route>
        <Route path="/casino">{() => <GameRoute component={DegensCasinoPage} />}</Route>
        <Route path="/casino/leaderboard">{() => <GameRoute component={CasinoLeaderboardPage} />}</Route>
        <Route path="/circuit">{() => <GameRoute component={DeadMansCircuitPage} />}</Route>
        <Route path="/cades-fps">{() => <GameRoute component={CADESFPSPage} />}</Route>
        <Route path="/signal-decryption">{() => <GameRoute component={SignalDecryptionPage} />}</Route>
        <Route path="/star-chart">{() => <GameRoute component={StarChartPage} />}</Route>
        <Route path="/hacking">{() => <GameRoute component={HackingPuzzlePage} />}</Route>
        <Route path="/specimens">{() => <GameRoute component={SpecimenCollectionPage} />}</Route>
        <Route path="/bestiary">{() => <GameRoute component={BestiaryPage} />}</Route>
        <Route path="/bounties">{() => <GameRoute component={BountyBoardPage} />}</Route>
        <Route path="/messages" component={NPCInboxPage} />
        <Route path="/alliance-war">{() => <GameRoute component={AllianceWarPage} />}</Route>
        <Route path="/space-station" component={SpaceStationPage} />
        <Route path="/syndicate-world" component={SyndicateWorldPage} />
        <Route path="/tower-defense">{() => <GameRoute component={TowerDefensePage} />}</Route>
        <Route path="/prestige-quests" component={PrestigeQuestPage} />
        <Route path="/prestige-cycle" component={PrestigeCycleResetPage} />
        <Route path="/competitive-arena">{() => <GameRoute component={CompetitiveArenaPage} />}</Route>
        <Route path="/seasonal-events" component={SeasonalEventsPage} />
        <Route path="/replays" component={ReplayPage} />
        <Route path="/personal-quarters" component={PersonalQuartersPage} />
        <Route path="/friendly-challenges">{() => <GameRoute component={FriendlyChallengesPage} />}</Route>
        <Route path="/coop-raids">{() => <GameRoute component={CoopRaidPage} />}</Route>
        <Route path="/boss-mastery">{() => <GameRoute component={BossMasteryPage} />}</Route>
        <Route path="/cosmetic-shop" component={CosmeticShopPage} />
        <Route path="/donations" component={DonationPage} />
        <Route path="/lions-club/apply" component={LionsClubApplicationPage} />
        <Route path="/order-of-the-dreamer" component={OrderOfTheDreamerPage} />
        <Route path="/social" component={SocialPage} />
        <Route path="/lore-journal" component={LoreJournalPage} />
        <Route path="/army" component={ArmyManagementPage} />
        <Route path="/awakening">{() => <AwakeningPage />}</Route>
        <Route path="/terms" component={TermsPage} />
        <Route path="/privacy" component={PrivacyPage} />
        <Route path="/planets" component={PlanetGalleryPage} />
        <Route path="/suit-gallery" component={SuitGalleryPage} />
        <Route path="/governance" component={GovernanceHubPage} />
        <Route path="/soul-stones">{() => <GameRoute component={SoulStonesPage} />}</Route>
        <Route path="/christmas-in-july">{() => <GameRoute component={ChristmasCasinoPage} />}</Route>
        <Route path="/cabin" component={PlayerCabinPage} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
    </RouteErrorBoundary>
  );
}

/* ─── AUTH GATE ───
   Always shows TitlePage first (unless user has opted in to
   skipTitle). The title is a living threshold: authed users
   with a save see "RECONNECT" and dismiss on first gesture;
   unauthed users see OAuth; new users see "ESTABLISH NEW
   CONNECTION". See apps/client/src/pages/title/TitleGate.tsx. */
function AuthGate() {
  const { loading } = useAuth();
  if (loading) return <PageLoader />;
  return (
    <TitleGate renderTitle={onDismiss => <TitlePage onDismiss={onDismiss} />}>
      <GameGate />
    </TitleGate>
  );
}

/* ─── GAME GATE ───
   Shows the Awakening sequence for first-time visitors.
   Once complete, shows the normal app with AppShell. */
function GameGate() {
  const { state, isServerSyncReady, completeSorting } = useGame();
  const { muted, volume } = useSoundForTTS();
  const elaraTTS = useElaraTTS({ enabled: true, volume, muted });
  const [location] = useLocation();

  // A.8 Analytics — session tracking and page views
  useAnalytics();

  // Liminal touches — title cycles when the tab is hidden, console
  // emits a morality-conditional boot banner once per session.
  // Both are narrative-dressing for the dual-faction recruitment
  // ARG; neither affects gameplay.
  useIdleTitleCycle("Loredex OS - The Dischordian Saga");
  const moralityScoreForBanner = useMoralityStore((s) => s.score);
  useEffect(() => {
    logBootBanner(moralityScoreForBanner);
    // The banner is one-shot per session via an internal window flag;
    // re-running this effect is a no-op. Intentionally empty deps so
    // it fires exactly once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // F13 — sync GameContext state into the companion scheduler so band
  // gates + flag-gated lines see fresh data without an explicit push.
  useEffect(() => {
    setCompanionContext({
      elaraStability: state.elaraStability ?? 10,
      humanLight: state.humanLight ?? -20,
      flags: new Set(
        Object.entries(state.narrativeFlags ?? {})
          .filter(([, v]) => v)
          .map(([k]) => k),
      ),
      // Act inference: default 0 until explicit feature wires it.
      act: state.narrativeFlags?.act_started ? 1 : 0,
    });
  }, [state.elaraStability, state.humanLight, state.narrativeFlags]);

  // ── A.12 Tutorial Orchestrator — check tutorials on route changes
  const { checkTutorial } = useTutorialOrchestrator();
  useEffect(() => {
    // Map route path to room context for the tutorial system
    const roomMap: Record<string, string> = {
      "/": "bridge", "/games": "games_page", "/inventory": "inventory_page",
      "/fight": "fight_page", "/cards": "cards_page",
    };
    const currentRoom = roomMap[location] || location.replace(/^\//, "") || undefined;
    checkTutorial({ currentRoom });
  }, [location, checkTutorial]);

  // ── A.13 Settings Sync — sync settings from server once after auth
  const trpcUtils = trpc.useUtils();
  const settingsSynced = useRef(false);
  useEffect(() => {
    if (!settingsSynced.current) {
      settingsSynced.current = true;
      // Runtime perf-capability detection runs first so every
      // subsequent consumer (composer mount, nebula glow, room
      // ambient life) can gate on .quality-low before they
      // allocate their expensive layers.
      applyQualityTierToDOM(detectQualityTier());
      // Progressive upgrade: patches history.pushState so route
      // changes on supporting browsers run through the View
      // Transitions API. Framer-motion AnimatePresence inside
      // AppShellImmersive is the fallback for non-supporting
      // browsers and reduce-motion.
      installViewTransitions();
      initSync(trpcUtils);
      syncFromServer().catch(() => {/* silent — local settings are fallback */});
      // Tier 4D — wire the cross-game beats helper to the same tRPC
      // client so narrative-side code can emit cross-game beats without
      // plumbing the client reference through props.
      initCrossGameBeats(trpcUtils);
    }
  }, [trpcUtils]);

  // ── A.16 Recap Overlay — show "Previously on..." after 3+ days away
  const [showRecap, setShowRecap] = useState(() => {
    const lastLogin = localStorage.getItem("loredex_last_login");
    return shouldShowRecap(lastLogin ? parseInt(lastLogin, 10) : null);
  });
  const handleRecapDismiss = useCallback(() => {
    setShowRecap(false);
    localStorage.setItem("loredex_last_login", String(Date.now()));
  }, []);
  // Update login timestamp on mount if recap not needed
  useEffect(() => {
    if (!showRecap) {
      localStorage.setItem("loredex_last_login", String(Date.now()));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── A.17 Loading Progress — register and track app init tasks
  useEffect(() => {
    loadingManager.registerTasks(LOADING_TASKS.appInit);
    // Auth is already complete by this point (we're past AuthGate)
    loadingManager.completeTask("auth");
    loadingManager.completeTask("profile");
    // Mark game data and assets as complete (loaded via context providers)
    loadingManager.completeTask("gameData");
    loadingManager.completeTask("assets");
    // WebSocket is established by pvpWs/chessWs setup
    loadingManager.completeTask("ws");
  }, []);

  // Activate Void Energy design system — syncs morality/room/NPC to visual materials
  useVoidEngine();
  // Hydrate localStorage equipment cache from server-side citizenCharacters.gear
  // so CharacterWidget / TradeEmpirePage / other legacy consumers of
  // getEquippedItems() get fresh data on every device.
  useGearSync();
  // Project Celebration runs in the Matrix of Dreams: auto-detect emerging archetypes
  useArchetypeDetection();
  // Mechronis Sorting: watch skills, show ceremony when a dominant skill crosses threshold
  const sortingTrigger = useSortingTrigger();
  const handleSortingComplete = () => {
    if (sortingTrigger.skillId) {
      const mentor = ARCHON_VOICE_MAPPING[sortingTrigger.skillId];
      completeSorting(mentor.archonNumber);
    }
  };

  // Wait for server sync before deciding to show Awakening.
  // This prevents the race condition where localStorage is empty/stale
  // but the server has a saved game state with a completed character.
  if (!isServerSyncReady && (state.phase === "FIRST_VISIT" || state.phase === "AWAKENING")) {
    return <PageLoader />;
  }

  // First visit or in awakening → show the awakening experience
  if (state.phase === "FIRST_VISIT" || state.phase === "AWAKENING") {
    return (
      <Suspense fallback={<PageLoader />}>
        <AwakeningPage elaraTTS={elaraTTS} />
      </Suspense>
    );
  }

  // Otherwise show the normal app
  return (
    <>
      {/* A.16 Recap Overlay — "Previously on Dischordian Saga..." */}
      {showRecap && (
        <RecapOverlay
          progressData={state as unknown as Record<string, unknown>}
          gameData={state as unknown as Record<string, unknown>}
          onComplete={handleRecapDismiss}
          onClose={handleRecapDismiss}
        />
      )}
      <CommandConsole elaraTTS={elaraTTS}>
        <ProtectedRoute>
          <Router />
        </ProtectedRoute>
      </CommandConsole>
      <DiscoveryUnlockOverlay />
      <DiscoveryVideoOverlay />
      <DiscoveryNotification />
      <QuestTracker />
      <QuestRewardSystem />
      <CoNexusMediaPlayer />
      <AchievementToast />
      <AchievementUnlockToast />
      <CompanionCommentToast />
      <RememberThisToast />
      <FeatureUnlockToast />
      <HellboxAffordanceToast />
      <MolGarathAudienceOfferToast />
      <HellboxDiscoveryWatcher />
      <LivingUniverseSyncWatcher />
      {sortingTrigger.shouldTrigger && sortingTrigger.skillId && (
        <SortingCeremony skillId={sortingTrigger.skillId} onComplete={handleSortingComplete} />
      )}
      <TradeNotificationWatcher />
      <UniverseAtmosphere />
      <ElaraDialog elaraTTS={elaraTTS} />
      <CompanionHost />
      <CharacterWidget />
      <DailyRewardPopup />
      <RadioMode />
      <EasterEggs />
      <SoundControls
        ttsEnabled={elaraTTS.ttsEnabled}
        onToggleTTS={() => elaraTTS.setTtsEnabled(!elaraTTS.ttsEnabled)}
        isSpeaking={elaraTTS.isSpeaking}
      />
      <div className="crt-overlay" />
    </>
  );
}

/** Helper to read sound state for TTS without circular deps */
function useSoundForTTS() {
  const { muted, volume } = useSound();
  return { muted, volume };
}

/** Wrapper that reads SoundContext state and passes to GameAudioProvider */
function GameAudioInner({ children }: { children: ReactNode }) {
  const { muted, volume } = useSound();
  return (
    <GameAudioProvider masterVolume={volume * 0.6} masterMuted={muted}>
      {children}
    </GameAudioProvider>
  );
}

/* ─── Apply saved accessibility settings on app startup ─── */
function initAccessibilitySettings() {
  try {
    const saved = localStorage.getItem("loredex-settings");
    if (!saved) return;
    const s = JSON.parse(saved);
    const root = document.documentElement;
    if (s.highContrast) root.classList.add("high-contrast");
    if (s.reduceMotion) root.classList.add("reduce-motion");
    if (s.dyslexiaFont) root.classList.add("dyslexia-font");
    if (s.reduceGlow) root.classList.add("reduce-glow");
    if (s.fontSize && s.fontSize !== "medium") {
      root.classList.remove("font-size-small", "font-size-medium", "font-size-large");
      root.classList.add(`font-size-${s.fontSize}`);
    }
    // Colorblind palette presets — exactly one of the three modes
    // applies at a time. Always clear before re-applying so toggling
    // between modes never accumulates classes.
    root.classList.remove(
      "colorblind-deuteranopia",
      "colorblind-protanopia",
      "colorblind-tritanopia",
    );
    if (s.colorblindMode && s.colorblindMode !== "off") {
      root.classList.add(`colorblind-${s.colorblindMode}`);
    }
  } catch { /* silent */ }
}
initAccessibilitySettings();

function App() {
  // a11y #116 — bridge the user-facing reduce-motion setting AND the
  // OS-level prefers-reduced-motion media query into Framer Motion's
  // global config. CSS-driven animations are already gated by the
  // `html.reduce-motion *` rules in index.css; this handles the JS
  // animation surface (motion.div, AnimatePresence, etc.) for the
  // ~328 framer-motion call sites.
  const reduceMotion = useReduceMotion();
  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion={reduceMotion ? "always" : "never"}>
      <ThemeProvider defaultTheme="dark" switchable>
        <GamificationProvider>
          <GameProvider>
            <MoralityThemeProvider>
            <SoundProvider>
              <AmbientMusicProvider>
              <GameAudioInner>
              <LoredexProvider>
                <PlayerProvider>
                  <SagaThemeBGMProvider>
                  <TooltipProvider>
                    <Toaster position="bottom-left" />
                    {/* Immersive mode — arms a one-shot listener so the
                        first user gesture in the session enters browser
                        fullscreen + locks landscape (mobile). Settings-
                        gated; defaults on for the widescreen art
                        direction. Players can disable it under
                        Settings → Appearance → Immersive Mode. */}
                    <ImmersiveModeManager />
                    {/* Witnessing §3 — hydrate the community
                        Light/Dark meter from the server on mount
                        and install fire-and-forget write-through
                        for every subsequent applyEnergy call. */}
                    <DischordiaCycleSync />
                    {/* Tier 1: surface newly-earned PvP / narrative /
                        co-op / guild titles as toasts. Polls every 60s
                        and tracks a localStorage cursor to avoid
                        re-toasting the same grant twice. */}
                    <TitleToastHost />
                    {/* D4 — Elara's covert-relay companion-comment
                        host. Watches dreamer-awareness state via
                        the existing tRPC query and fires Elara
                        hint lines on threshold crossings (count
                        ≥ 3) and per-vision deliveries. Lines are
                        ambient and intentionally under-explained;
                        the toast subsystem renders them. No UI of
                        its own. */}
                    <DreamerRelayHintsHost />
                    {/* Watcher subsystem — hydrates the observation log
                        from the server and starts the batched flush
                        daemon. No UI of its own; Watcher lines surface
                        through CompanionCommentToast via the shared
                        speaker registry. See docs/built/
                        WATCHER_DESIGN.md. */}
                    <WatcherHost />
                    {/* Witnessing §5 — global slideshow host. Mounts
                        whenever any caller queues a slideshow via
                        playSlideshow(id). Must be above AuthGate so
                        the overlay covers the whole app surface. */}
                    <SlideshowPlayerRoot />
                    {/* D2 — Dreamer-vision orchestrator. Polls the
                        silent counter at session start and queues
                        the next pending vision via playSlideshow(...)
                        if a Discordian threshold has been crossed.
                        Silent on the no-vision path — no UI footprint
                        unless a cutscene actually fires. */}
                    <DreamerVisionPlayer />
                    {/* M4 — PWA install prompt. Bottom-bound banner
                        that surfaces standalone-mode install on
                        Android (beforeinstallprompt) + iOS Safari
                        (Add to Home Screen instructions). Dismissable.
                        Hidden if already installed; cooldown of 14
                        days after dismissal. */}
                    <InstallPromptBanner />
                    {/* Witnessing §1.5 — the Bond-80 Forgive/Refuse
                        three-option wheel. Mounts only when the
                        forgiveness_choice_unlocked flag is set (by
                        the Two Witnesses Meet slideshow's
                        flagsSetOnComplete) AND the player hasn't
                        already chosen. Fires-and-clears. */}
                    <ForgivenessChoicePanel />
                    {/* ACT1_NARRATIVE_STRUCTURE.md §6.3 — three-option
                        closing choice after the Section 6 slideshow.
                        Fires once per playthrough on the
                        slideshow_two_witnesses_part_2_complete flag;
                        guards re-showing via act1_closing_choice_made. */}
                    <Act1ClosingChoicePanel />
                    <AuthGate />
                  </TooltipProvider>
                  </SagaThemeBGMProvider>
                </PlayerProvider>
              </LoredexProvider>
              </GameAudioInner>
              </AmbientMusicProvider>
            </SoundProvider>
            </MoralityThemeProvider>
          </GameProvider>
        </GamificationProvider>
      </ThemeProvider>
      </MotionConfig>
    </ErrorBoundary>
  );
}

export default App;
