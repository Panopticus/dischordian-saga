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
import { LoredexProvider } from "./contexts/LoredexContext";
import { PlayerProvider } from "./contexts/PlayerContext";
import { GamificationProvider } from "./contexts/GamificationContext";
import PlayerBar from "./components/PlayerBar";
import AppShell from "./components/AppShell";
import AchievementToast from "./components/AchievementToast";

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
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <GamificationProvider>
          <LoredexProvider>
            <PlayerProvider>
              <TooltipProvider>
                <Toaster />
                <AppShell>
                  <Router />
                </AppShell>
                <PlayerBar />
                <AchievementToast />
                <div className="crt-overlay" />
              </TooltipProvider>
            </PlayerProvider>
          </LoredexProvider>
        </GamificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
