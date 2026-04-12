/* ═══════════════════════════════════════════════════════
   MOBILE BOTTOM NAV — Shown only below 640px
   5 tabs: Home, Games, Quests, Inventory, More (sidebar)
   Fixed bottom bar with 48px+ touch targets.
   Hides when virtual keyboard is open.
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { Home, Gamepad2, ScrollText, Backpack, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileBottomNavProps {
  /** Number of pending quests for badge */
  pendingQuests?: number;
  /** Number of new inventory items for badge */
  newItems?: number;
  /** Callback when "More" is tapped (opens sidebar/menu) */
  onMorePress?: () => void;
}

const NAV_TABS = [
  { id: "home", path: "/", label: "Home", icon: Home },
  { id: "games", path: "/cards", label: "Games", icon: Gamepad2 },
  { id: "quests", path: "/quests", label: "Quests", icon: ScrollText },
  { id: "inventory", path: "/inventory", label: "Inventory", icon: Backpack },
  { id: "more", path: "", label: "More", icon: Menu },
] as const;

/** Routes where the mobile nav should be completely hidden */
const HIDDEN_ROUTES = [
  "/awakening",
  "/fight",
  "/battle",
  "/boss-battle",
  "/terminus-swarm",
  "/chess",
  "/duelyst-play",
  "/pvp",
  "/card-challenge",
  "/competitive-arena",
  "/coop-raids",
  "/friendly-challenges",
];

export default function MobileBottomNav({
  pendingQuests = 0,
  newItems = 0,
  onMorePress,
}: MobileBottomNavProps) {
  const [location] = useLocation();
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  // Detect virtual keyboard via viewport height change
  useEffect(() => {
    const initialHeight = window.innerHeight;
    const threshold = 150; // px reduction that indicates keyboard

    const handleResize = () => {
      const currentHeight = window.visualViewport?.height ?? window.innerHeight;
      setKeyboardOpen(initialHeight - currentHeight > threshold);
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize);
      return () => window.visualViewport?.removeEventListener("resize", handleResize);
    } else {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const handleMorePress = useCallback(() => {
    setMoreOpen((prev) => !prev);
    onMorePress?.();
  }, [onMorePress]);

  // Hide on immersive/game routes
  const isHidden = HIDDEN_ROUTES.some((r) => location.startsWith(r));

  if (isHidden || keyboardOpen) return null;

  const getBadge = (id: string): number => {
    if (id === "quests") return pendingQuests;
    if (id === "inventory") return newItems;
    return 0;
  };

  const isActive = (tab: (typeof NAV_TABS)[number]): boolean => {
    if (tab.id === "more") return moreOpen;
    if (tab.id === "home") return location === "/";
    return location.startsWith(tab.path);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 sm:hidden border-t border-border/30 bg-background/95 backdrop-blur-md safe-area-bottom"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-stretch justify-around">
        {NAV_TABS.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab);
          const badge = getBadge(tab.id);

          const content = (
            <>
              <div className="relative">
                <Icon
                  size={22}
                  className={cn(
                    "transition-colors",
                    active ? "text-primary" : "text-muted-foreground/60"
                  )}
                />
                {badge > 0 && (
                  <div className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] rounded-full bg-destructive flex items-center justify-center px-1">
                    <span className="font-mono text-[10px] text-white font-bold leading-none">
                      {badge > 99 ? "99+" : badge}
                    </span>
                  </div>
                )}
              </div>
              <span
                className={cn(
                  "font-mono text-[10px] tracking-wider transition-colors mt-0.5",
                  active ? "text-primary" : "text-muted-foreground/40"
                )}
              >
                {tab.id === "more" && moreOpen ? "Close" : tab.label}
              </span>
              {active && (
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary"
                  style={{ boxShadow: "0 0 8px hsl(var(--primary) / 0.5)" }}
                />
              )}
            </>
          );

          if (tab.id === "more") {
            return (
              <button
                key={tab.id}
                onClick={handleMorePress}
                className="flex flex-col items-center justify-center min-h-[48px] min-w-[48px] flex-1 relative py-2 active:bg-accent/20 transition-colors"
                aria-label={moreOpen ? "Close menu" : "Open menu"}
              >
                {moreOpen ? (
                  <>
                    <X
                      size={22}
                      className="text-primary transition-colors"
                    />
                    <span className="font-mono text-[10px] tracking-wider text-primary mt-0.5">
                      Close
                    </span>
                    <div
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary"
                      style={{ boxShadow: "0 0 8px hsl(var(--primary) / 0.5)" }}
                    />
                  </>
                ) : (
                  content
                )}
              </button>
            );
          }

          return (
            <Link
              key={tab.id}
              href={tab.path}
              className="flex flex-col items-center justify-center min-h-[48px] min-w-[48px] flex-1 relative py-2 active:bg-accent/20 transition-colors"
              aria-label={tab.label}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
