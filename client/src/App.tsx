import { Suspense, lazy, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
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
import PlayerBar from "./components/PlayerBar";
import CoNexusMediaPlayer from "./components/CoNexusMediaPlayer";
import AppShell from "./components/AppShell";
import CommandConsole from "./components/CommandConsole";
import AchievementToast from "./components/AchievementToast";
import TradeNotificationWatcher from "./components/TradeNotificationWatcher";
import ProtectedRoute from "./components/ProtectedRoute";
import DiscoveryUnlockOverlay from "./components/DiscoveryUnlockOverlay";
import DiscoveryVideoOverlay from "./components/DiscoveryVideoOverlay";
import DiscoveryNotification from "./components/DiscoveryNotification";
import QuestTracker from "./components/QuestTracker";
import QuestRewardSystem from "./components/QuestRewardSystem";
import ElaraDialog from "./components/ElaraDialog";
import RadioMode from "./components/RadioMode";
import EasterEggs from "./components/EasterEggs";
import SoundControls from "./components/SoundControls";
import { useElaraTTS } from "./hooks/useElaraTTS";

/* ═══ LAZY PAGE IMPORTS — Code splitting for all 50+ pages ═══ */
const Home = lazy(() => import("./pages/Home"));
const EntityPage = lazy(() => import("./pages/EntityPage"));
const SongPage = lazy(() => import("./pages/SongPage"));
const AlbumPage = lazy(() => import("./pages/AlbumPage"));
const BoardPage = lazy(() => import("./pages/BoardPage"));
const TimelinePage = lazy(() => import("./pages/TimelinePage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const CharacterTimeline = lazy(() => import("./pages/CharacterTimeline"));
const WatchPage = lazy(() => import("./pages/WatchPage"));
const FightPage = lazy(() => import("./pages/FightPage"));
const ConsolePage = lazy(() => import("./pages/ConsolePage"));
const CardBrowserPage = lazy(() => import("./pages/CardBrowserPage"));
const CardGamePage = lazy(() => import("./pages/CardGamePage"));
const InceptionArkPage = lazy(() => import("./pages/InceptionArkPage"));
const TrophyRoomPage = lazy(() => import("./pages/TrophyRoomPage"));
const TradeWarsPage = lazy(() => import("./pages/TradeWarsPage"));
const WarMapPage = lazy(() => import("./pages/WarMapPage"));
const DeckBuilderPage = lazy(() => import("./pages/DeckBuilderPage"));
const CitizenCreationPage = lazy(() => import("./pages/CitizenCreationPage"));
const CharacterSheetPage = lazy(() => import("./pages/CharacterSheetPage"));
const ResearchLabPage = lazy(() => import("./pages/ResearchLabPage"));
const StorePage = lazy(() => import("./pages/StorePage"));
const GamesPage = lazy(() => import("./pages/GamesPage"));
const DiscographyPage = lazy(() => import("./pages/DiscographyPage"));
const SagaTimelinePage = lazy(() => import("./pages/SagaTimelinePage"));
const FavoritesPage = lazy(() => import("./pages/FavoritesPage"));
const LoreQuizPage = lazy(() => import("./pages/LoreQuizPage"));
const CodexPage = lazy(() => import("./pages/CodexPage"));
const CardBattlePage = lazy(() => import("./pages/CardBattlePage"));
const CardGalleryPage = lazy(() => import("./pages/CardGalleryPage"));
const PlayerProfilePage = lazy(() => import("./pages/PlayerProfilePage"));
const LeaderboardPage = lazy(() => import("./pages/LeaderboardPage"));
const AwakeningPage = lazy(() => import("./pages/AwakeningPage"));
const ArkExplorerPage = lazy(() => import("./pages/ArkExplorerPage"));
const BossBattlePage = lazy(() => import("./pages/BossBattlePage"));
const CardChallengePage = lazy(() => import("./pages/CardChallengePage"));
const ConexusPortalPage = lazy(() => import("./pages/ConexusPortalPage"));
const AchievementsGalleryPage = lazy(() => import("./pages/AchievementsGalleryPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const HierarchyPage = lazy(() => import("./pages/HierarchyPage"));
const DemonPackPage = lazy(() => import("./pages/DemonPackPage"));
const FightLeaderboardPage = lazy(() => import("./pages/FightLeaderboardPage"));
const PvpArenaPage = lazy(() => import("./pages/PvpArenaPage"));
const DraftTournamentPage = lazy(() => import("./pages/DraftTournamentPage"));
const CardTradingPage = lazy(() => import("./pages/CardTradingPage"));
const CardAchievementsPage = lazy(() => import("./pages/CardAchievementsPage"));
const PotentialsPage = lazy(() => import("./pages/PotentialsPage"));
const PotentialsLeaderboardPage = lazy(() => import("./pages/PotentialsLeaderboardPage"));
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

/* ═══ LOADING FALLBACK ═══ */
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        <span className="font-mono text-xs text-muted-foreground tracking-[0.2em] animate-pulse">LOADING MODULE...</span>
      </div>
    </div>
  );
}

function Router() {
  return (
    <RouteErrorBoundary>
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/board" component={BoardPage} />
        <Route path="/entity/:id" component={EntityPage} />
        <Route path="/song/:id" component={SongPage} />
        <Route path="/album/:slug" component={AlbumPage} />
        <Route path="/timeline" component={TimelinePage} />
        <Route path="/search" component={SearchPage} />
        <Route path="/character-timeline" component={CharacterTimeline} />
        <Route path="/watch" component={WatchPage} />
        <Route path="/fight" component={FightPage} />
        <Route path="/console" component={ConsolePage} />
        <Route path="/cards" component={CardBrowserPage} />
        <Route path="/cards/play" component={CardGamePage} />
        <Route path="/ark" component={ArkExplorerPage} />
        <Route path="/ark-legacy" component={InceptionArkPage} />
        <Route path="/trophy" component={TrophyRoomPage} />
        <Route path="/trade-empire" component={TradeWarsPage} />
        <Route path="/war-map" component={WarMapPage} />
        <Route path="/deck-builder" component={DeckBuilderPage} />
        <Route path="/create-citizen" component={CitizenCreationPage} />
        <Route path="/character-sheet" component={CharacterSheetPage} />
        <Route path="/research-lab" component={ResearchLabPage} />
        <Route path="/games" component={GamesPage} />
        <Route path="/forge" component={ForgePage} />
        <Route path="/discography" component={DiscographyPage} />
        <Route path="/saga-timeline" component={SagaTimelinePage} />
        <Route path="/favorites" component={FavoritesPage} />
        <Route path="/quiz" component={LoreQuizPage} />
        <Route path="/codex" component={CodexPage} />
        <Route path="/store" component={StorePage} />
        <Route path="/battle" component={CardBattlePage} />
        <Route path="/card-gallery" component={CardGalleryPage} />
        <Route path="/profile" component={PlayerProfilePage} />
        <Route path="/leaderboard" component={LeaderboardPage} />
        <Route path="/boss-battle" component={BossBattlePage} />
        <Route path="/card-challenge" component={CardChallengePage} />
        <Route path="/conexus-portal" component={ConexusPortalPage} />
        <Route path="/achievements" component={AchievementsGalleryPage} />
        <Route path="/admin" component={AdminPage} />
        <Route path="/hierarchy" component={HierarchyPage} />
        <Route path="/demon-packs" component={DemonPackPage} />
        <Route path="/fight-leaderboard" component={FightLeaderboardPage} />
        <Route path="/pvp" component={PvpArenaPage} />
        <Route path="/draft" component={DraftTournamentPage} />
        <Route path="/trading" component={CardTradingPage} />
        <Route path="/card-achievements" component={CardAchievementsPage} />
        <Route path="/potentials" component={PotentialsPage} />
        <Route path="/potentials/leaderboard" component={PotentialsLeaderboardPage} />
        <Route path="/settings" component={SettingsPage} />
        <Route path="/clue-journal" component={ClueJournalPage} />
        <Route path="/research-minigame" component={ResearchMinigamePage} />
        <Route path="/lore-tutorials" component={LoreTutorialHubPage} />
        <Route path="/morality-census" component={MoralityLeaderboardPage} />
        <Route path="/companions" component={CompanionHubPage} />
        <Route path="/fleet" component={FleetViewerPage} />
        <Route path="/diplomacy" component={DiplomacyPage} />
        <Route path="/faction-wars" component={FactionWarPage} />
        <Route path="/marketplace" component={MarketplacePage} />
        <Route path="/quests" component={QuestBoardPage} />
        <Route path="/guild" component={GuildPage} />
        <Route path="/battle-pass" component={BattlePassPage} />
        <Route path="/inventory" component={InventoryPage} />
        <Route path="/chess" component={ChessPage} />
        <Route path="/awakening">{() => <AwakeningPage />}</Route>
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
    </RouteErrorBoundary>
  );
}

/* ─── GAME GATE ─── 
   Shows the Awakening sequence for first-time visitors.
   Once complete, shows the normal app with AppShell. */
function GameGate() {
  const { state } = useGame();
  const { muted, volume } = useSoundForTTS();
  const elaraTTS = useElaraTTS({ enabled: true, volume, muted });

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
      <TradeNotificationWatcher />
      <ElaraDialog elaraTTS={elaraTTS} />
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

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable>
        <GamificationProvider>
          <GameProvider>
            <MoralityThemeProvider>
            <SoundProvider>
              <AmbientMusicProvider>
              <GameAudioInner>
              <LoredexProvider>
                <PlayerProvider>
                  <TooltipProvider>
                    <Toaster />
                    <GameGate />
                  </TooltipProvider>
                </PlayerProvider>
              </LoredexProvider>
              </GameAudioInner>
              </AmbientMusicProvider>
            </SoundProvider>
            </MoralityThemeProvider>
          </GameProvider>
        </GamificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
