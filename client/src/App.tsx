import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import EntityPage from "./pages/EntityPage";
import SongPage from "./pages/SongPage";
import AlbumPage from "./pages/AlbumPage";
import BoardPage from "./pages/BoardPage";
import TimelinePage from "./pages/TimelinePage";
import SearchPage from "./pages/SearchPage";
import CharacterTimeline from "./pages/CharacterTimeline";
import WatchPage from "./pages/WatchPage";
import FightPage from "./pages/FightPage";
import ConsolePage from "./pages/ConsolePage";
import CardBrowserPage from "./pages/CardBrowserPage";
import CardGamePage from "./pages/CardGamePage";
import InceptionArkPage from "./pages/InceptionArkPage";
import TrophyRoomPage from "./pages/TrophyRoomPage";
import TradeWarsPage from "./pages/TradeWarsPage";
import DeckBuilderPage from "./pages/DeckBuilderPage";
import CitizenCreationPage from "./pages/CitizenCreationPage";
import CharacterSheetPage from "./pages/CharacterSheetPage";
import ResearchLabPage from "./pages/ResearchLabPage";
import StorePage from "./pages/StorePage";
import GamesPage from "./pages/GamesPage";
import DiscographyPage from "./pages/DiscographyPage";
import SagaTimelinePage from "./pages/SagaTimelinePage";
import FavoritesPage from "./pages/FavoritesPage";
import LoreQuizPage from "./pages/LoreQuizPage";
import CodexPage from "./pages/CodexPage";
import CardBattlePage from "./pages/CardBattlePage";
import CardGalleryPage from "./pages/CardGalleryPage";
import PlayerProfilePage from "./pages/PlayerProfilePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import AwakeningPage from "./pages/AwakeningPage";
import ArkExplorerPage from "./pages/ArkExplorerPage";
import BossBattlePage from "./pages/BossBattlePage";
import CardChallengePage from "./pages/CardChallengePage";
import ConexusPortalPage from "./pages/ConexusPortalPage";
import AchievementsGalleryPage from "./pages/AchievementsGalleryPage";
import AdminPage from "./pages/AdminPage";
import HierarchyPage from "./pages/HierarchyPage";
import DemonPackPage from "./pages/DemonPackPage";
import { LoredexProvider } from "./contexts/LoredexContext";
import { PlayerProvider } from "./contexts/PlayerContext";
import { GamificationProvider } from "./contexts/GamificationContext";
import { GameProvider, useGame } from "./contexts/GameContext";
import { SoundProvider, useSound } from "./contexts/SoundContext";
import { AmbientMusicProvider } from "./contexts/AmbientMusicContext";
import PlayerBar from "./components/PlayerBar";
import AppShell from "./components/AppShell";
import AchievementToast from "./components/AchievementToast";
import ElaraDialog from "./components/ElaraDialog";
import RadioMode from "./components/RadioMode";
import EasterEggs from "./components/EasterEggs";
import SoundControls from "./components/SoundControls";
import { useElaraTTS } from "./hooks/useElaraTTS";

function Router() {
  return (
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
      <Route path="/deck-builder" component={DeckBuilderPage} />
      <Route path="/create-citizen" component={CitizenCreationPage} />
      <Route path="/character-sheet" component={CharacterSheetPage} />
      <Route path="/research-lab" component={ResearchLabPage} />
      <Route path="/games" component={GamesPage} />
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
      <Route path="/awakening">{() => <AwakeningPage />}</Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
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
    return <AwakeningPage elaraTTS={elaraTTS} />;
  }

  // Otherwise show the normal app
  return (
    <>
      <AppShell elaraTTS={elaraTTS}>
        <Router />
      </AppShell>
      <PlayerBar />
      <AchievementToast />
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

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <GamificationProvider>
          <GameProvider>
            <SoundProvider>
              <AmbientMusicProvider>
              <LoredexProvider>
                <PlayerProvider>
                  <TooltipProvider>
                    <Toaster />
                    <GameGate />
                  </TooltipProvider>
                </PlayerProvider>
              </LoredexProvider>
              </AmbientMusicProvider>
            </SoundProvider>
          </GameProvider>
        </GamificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
