/**
 * SettingsPage.tsx — Ship Configuration
 * 
 * Full settings panel: Appearance (light/dark + Ark themes + font size),
 * Audio (master, music, SFX, ambient toggles), Accessibility (high contrast,
 * reduce motion, dyslexia font, reduce glow), Game (skip tutorials, show hints,
 * difficulty), Account (login/logout, sync status, export save data).
 */
import { useState, useCallback, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useGamification } from "@/contexts/GamificationContext";
import { useSound } from "@/contexts/SoundContext";
import { useGame } from "@/contexts/GameContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { ARK_THEMES } from "@shared/gamification";
import { trpc } from "@/lib/trpc";
import {
  loadSettings as syncLoadSettings,
  saveSettings as syncSaveSettings,
  syncFromServer,
  initSync,
  exportSettings as syncExportSettings,
  importSettings as syncImportSettings,
} from "@/lib/settingsSync";
import { DEFAULT_SETTINGS as SHARED_DEFAULTS, type GameSettings } from "@shared/settingsSchema";
import {
  Settings, Sun, Moon, Palette, Volume2, VolumeX, Music,
  Gamepad2, RotateCcw, Check, Lock, Monitor, Accessibility,
  Type, Zap, ChevronDown, ChevronUp, User, LogOut, LogIn,
  Download, Cloud, CloudOff, Shield, Eye, EyeOff, Sparkles,
  Gauge, HelpCircle, SkipForward, MessageCircle, ExternalLink, Users,
  Gift, Ticket
} from "lucide-react";
import { toast } from "sonner";

/* ─── SETTINGS STORAGE (delegates to settingsSync) ─── */
type AppSettings = GameSettings;
const DEFAULT_SETTINGS = SHARED_DEFAULTS;

function loadSettings(): AppSettings {
  return syncLoadSettings();
}

function saveSettings(settings: AppSettings) {
  syncSaveSettings(settings);
}

/* ─── SECTION COMPONENT ─── */
function SettingsSection({ title, icon: Icon, children, defaultOpen = true }: {
  title: string; icon: typeof Settings; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-lg border border-border/50 bg-muted/15 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 px-5 py-3 border-b border-border/40 w-full hover:bg-muted/15 transition-colors"
      >
        <Icon size={14} className="text-[var(--neon-cyan)]" />
        <h3 className="font-mono text-xs tracking-[0.15em] text-muted-foreground/90 uppercase flex-1 text-left">{title}</h3>
        {open ? <ChevronUp size={14} className="text-muted-foreground/50" /> : <ChevronDown size={14} className="text-muted-foreground/50" />}
      </button>
      {open && (
        <div className="p-5 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}

/* ─── TOGGLE ─── */
function Toggle({ label, description, enabled, onChange, icon: Icon }: {
  label: string; description?: string; enabled: boolean; onChange: (v: boolean) => void; icon?: typeof Settings;
}) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className="flex items-center justify-between w-full py-2 group"
    >
      <div className="flex items-center gap-2.5">
        {Icon && <Icon size={13} className="text-muted-foreground/50 shrink-0" />}
        <div>
          <p className="font-mono text-[11px] text-muted-foreground/90 text-left">{label}</p>
          {description && <p className="font-mono text-[9px] text-muted-foreground/50 text-left mt-0.5">{description}</p>}
        </div>
      </div>
      <div className={`w-10 h-5 rounded-full transition-all relative shrink-0 ml-3 ${
        enabled ? "bg-[var(--neon-cyan)]/30" : "bg-muted/50"
      }`}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${
          enabled ? "left-5 bg-[var(--neon-cyan)] shadow-[0_0_8px_var(--neon-cyan)]" : "left-0.5 bg-foreground/40"
        }`} />
      </div>
    </button>
  );
}

/* ─── SLIDER ─── */
function VolumeSlider({ label, icon: Icon, value, onChange, disabled }: {
  label: string; icon: typeof Volume2; value: number; onChange: (v: number) => void; disabled?: boolean;
}) {
  return (
    <div className={`${disabled ? "opacity-40 pointer-events-none" : ""}`}>
      <div className="flex items-center gap-2 mb-1.5">
        <Icon size={13} className="text-muted-foreground/60" />
        <p className="font-mono text-[10px] text-muted-foreground/70 tracking-wider flex-1">{label}</p>
        <span className="font-mono text-[10px] text-[var(--neon-cyan)] w-8 text-right">
          {Math.round(value * 100)}%
        </span>
      </div>
      <div className="flex items-center gap-3">
        <VolumeX size={12} className="text-muted-foreground/35 shrink-0" />
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="flex-1 accent-[var(--neon-cyan)] h-1"
        />
        <Volume2 size={12} className="text-muted-foreground/35 shrink-0" />
      </div>
    </div>
  );
}

/* ─── OPTION SELECTOR ─── */
function OptionSelector<T extends string>({ label, options, value, onChange }: {
  label: string;
  options: { value: T; label: string; desc?: string; icon?: typeof Settings }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <p className="font-mono text-[10px] text-muted-foreground/60 tracking-wider mb-2">{label}</p>
      <div className="flex gap-2">
        {options.map((opt) => {
          const active = value === opt.value;
          const OptIcon = opt.icon;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-lg border transition-all ${
                active
                  ? "border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5"
                  : "border-border/50 hover:border-border/80 hover:bg-muted/30"
              }`}
            >
              {OptIcon && <OptIcon size={16} className={active ? "text-[var(--neon-cyan)]" : "text-muted-foreground/60"} />}
              <span className={`font-mono text-[10px] ${active ? "text-[var(--neon-cyan)]" : "text-muted-foreground/70"}`}>
                {opt.label}
              </span>
              {opt.desc && <span className="font-mono text-[8px] text-muted-foreground/40">{opt.desc}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PROMO CODE SECTION
   ═══════════════════════════════════════════════════════ */
function PromoCodeSection({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const redeemMutation = trpc.promoCodes.redeemCode.useMutation({
    onSuccess: (data) => {
      setStatus("success");
      const reward = data.rewardValue as Record<string, unknown>;
      const parts: string[] = [];
      if (reward.dream) parts.push(`${reward.dream} Dream Currency`);
      if (reward.credits) parts.push(`${reward.credits} Credits`);
      if (Array.isArray(reward.cards) && reward.cards.length) parts.push(`${reward.cards.length} Card(s)`);
      if (Array.isArray(reward.cosmetics) && reward.cosmetics.length) parts.push(`${reward.cosmetics.length} Cosmetic(s)`);
      setMessage(
        `Code redeemed! ${data.description ? data.description + " — " : ""}Rewards: ${parts.join(", ") || data.rewardType}`
      );
      setCode("");
      toast.success("Promo code redeemed!");
    },
    onError: (err) => {
      setStatus("error");
      setMessage(err.message);
    },
  });

  const handleRedeem = () => {
    if (!code.trim()) return;
    setStatus("idle");
    setMessage("");
    redeemMutation.mutate({ code: code.trim() });
  };

  return (
    <SettingsSection title="Promo Codes" icon={Ticket}>
      {!isAuthenticated ? (
        <p className="font-mono text-[10px] text-muted-foreground/60">
          Log in to redeem promo codes.
        </p>
      ) : (
        <div className="space-y-3">
          <p className="font-mono text-[10px] text-muted-foreground/60 tracking-wider">
            Enter a promo code to claim rewards
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setStatus("idle");
                setMessage("");
              }}
              onKeyDown={(e) => { if (e.key === "Enter") handleRedeem(); }}
              placeholder="ENTER-CODE-HERE"
              maxLength={64}
              className="flex-1 px-3 py-2 rounded-md border border-white/10 bg-white/[0.02] font-mono text-xs tracking-widest text-cyan-400 placeholder:text-muted-foreground/30 focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 transition-colors"
            />
            <button
              onClick={handleRedeem}
              disabled={!code.trim() || redeemMutation.isPending}
              className="px-4 py-2 rounded-md border border-cyan-400/30 bg-cyan-400/5 text-cyan-400 font-mono text-[10px] tracking-[0.2em] hover:bg-cyan-400/10 hover:border-cyan-400/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            >
              {redeemMutation.isPending ? "..." : "REDEEM"}
            </button>
          </div>

          {/* Feedback */}
          {status !== "idle" && (
            <div className={`flex items-start gap-2 px-3 py-2.5 rounded-md border font-mono text-[10px] leading-relaxed ${
              status === "success"
                ? "border-green-400/30 bg-green-400/5 text-green-400"
                : "border-red-400/30 bg-red-400/5 text-red-400"
            }`}>
              {status === "success" ? <Gift size={13} className="shrink-0 mt-0.5" /> : <Shield size={13} className="shrink-0 mt-0.5" />}
              <span>{message}</span>
            </div>
          )}
        </div>
      )}
    </SettingsSection>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN SETTINGS PAGE
   ═══════════════════════════════════════════════════════ */
export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const gam = useGamification();
  const gamSetTheme = gam.setTheme;
  const { muted, setMuted, volume, setVolume } = useSound();
  const { state: gameState, resetGame, syncStatus, lastSyncedAt, forceSave } = useGame();
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [exporting, setExporting] = useState(false);

  const updateSetting = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      saveSettings(next);
      return next;
    });
  }, []);

  // Export save data
  const exportSaveData = useCallback(() => {
    setExporting(true);
    try {
      const exportData = {
        version: "5.0.0",
        exportedAt: new Date().toISOString(),
        gameState: localStorage.getItem("loredex-game-state"),
        settings: localStorage.getItem("loredex-settings"),
        gamification: localStorage.getItem("loredex-gamification"),
        playerProfile: localStorage.getItem("loredex-player-profile"),
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `loredex-save-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Save data exported successfully");
    } catch (e) {
      toast.error("Failed to export save data");
    } finally {
      setExporting(false);
    }
  }, []);

  // Get unlocked/locked themes
  const unlockedThemes = ARK_THEMES.filter(t => gam.level >= t.unlockLevel);
  const lockedThemes = ARK_THEMES.filter(t => gam.level < t.unlockLevel);

  return (
    <div className="px-4 sm:px-6 py-6 max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(51,226,230,0.15), var(--glass-border))",
            border: "1px solid rgba(51,226,230,0.3)",
          }}>
          <Settings size={18} className="text-[var(--neon-cyan)]" />
        </div>
        <div>
          <h1 className="font-display text-lg font-bold tracking-wider text-foreground">SHIP CONFIGURATION</h1>
          <p className="font-mono text-[10px] text-muted-foreground tracking-wider">System preferences, accessibility, and account</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* ═══ APPEARANCE ═══ */}
        <SettingsSection title="Appearance" icon={Palette}>
          {/* Light/Dark Mode */}
          <OptionSelector
            label="MODE"
            value={theme}
            onChange={(v) => {
              if (theme !== v && toggleTheme) toggleTheme();
            }}
            options={[
              { value: "dark", label: "Dark", desc: "Deep space", icon: Moon },
              { value: "light", label: "Light", desc: "Bright mode", icon: Sun },
            ]}
          />

          {/* Font Size */}
          <OptionSelector
            label="FONT SIZE"
            value={settings.fontSize}
            onChange={(v) => updateSetting("fontSize", v)}
            options={[
              { value: "small", label: "Small", desc: "Compact", icon: Type },
              { value: "medium", label: "Medium", desc: "Default", icon: Type },
              { value: "large", label: "Large", desc: "Readable", icon: Type },
            ]}
          />

          {/* Void Energy Density */}
          <OptionSelector
            label="UI DENSITY"
            value={localStorage.getItem("ve-density") || "standard"}
            onChange={(v) => {
              localStorage.setItem("ve-density", v);
              document.documentElement.setAttribute("data-density", v);
            }}
            options={[
              { value: "compact", label: "Compact", desc: "0.75x spacing", icon: Type },
              { value: "standard", label: "Standard", desc: "Default", icon: Type },
              { value: "spacious", label: "Spacious", desc: "1.25x spacing", icon: Type },
            ]}
          />

          {/* Ark Themes */}
          <div>
            <p className="font-mono text-[10px] text-muted-foreground/60 tracking-wider mb-2">ARK THEME</p>
            <div className="grid grid-cols-2 gap-2">
              {unlockedThemes.map((t) => {
                const active = gam.currentTheme.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      gamSetTheme(t.id);
                      toast.success(`Theme changed to ${t.name}`);
                    }}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border transition-all text-left ${
                      active
                        ? "border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5"
                        : "border-border/50 hover:border-border/80 hover:bg-muted/30"
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-md shrink-0 border border-border/60"
                      style={{ background: t.colors?.primary || "var(--neon-cyan)" }}
                    />
                    <div className="min-w-0">
                      <p className={`font-mono text-[10px] truncate ${active ? "text-[var(--neon-cyan)]" : "text-muted-foreground/80"}`}>
                        {t.name}
                      </p>
                      <p className="font-mono text-[8px] text-muted-foreground/40 truncate">{t.description}</p>
                    </div>
                    {active && <Check size={12} className="text-[var(--neon-cyan)] shrink-0 ml-auto" />}
                  </button>
                );
              })}
              {lockedThemes.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-border/40 opacity-40"
                >
                  <div className="w-6 h-6 rounded-md shrink-0 bg-muted/50 flex items-center justify-center">
                    <Lock size={10} className="text-muted-foreground/50" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] text-muted-foreground/50 truncate">{t.name}</p>
                    <p className="font-mono text-[8px] text-muted-foreground/25 truncate">Unlock at LV.{t.unlockLevel}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SettingsSection>

        {/* ═══ AUDIO ═══ */}
        <SettingsSection title="Audio" icon={Volume2}>
          <Toggle
            label="Mute All Sounds"
            description="Disable all audio output"
            enabled={muted}
            onChange={setMuted}
            icon={VolumeX}
          />

          <VolumeSlider
            label="MASTER VOLUME"
            icon={Volume2}
            value={volume}
            onChange={setVolume}
            disabled={muted}
          />

          <VolumeSlider
            label="MUSIC VOLUME"
            icon={Music}
            value={settings.musicVolume}
            onChange={(v) => updateSetting("musicVolume", v)}
            disabled={muted}
          />

          <VolumeSlider
            label="SFX VOLUME"
            icon={Zap}
            value={settings.sfxVolume}
            onChange={(v) => updateSetting("sfxVolume", v)}
            disabled={muted}
          />

          <Toggle
            label="Ambient Sounds"
            description="Ship hum, cryo hiss, electrical crackle, void wind"
            enabled={settings.ambientEnabled}
            onChange={(v) => updateSetting("ambientEnabled", v)}
            icon={Sparkles}
          />
        </SettingsSection>

        {/* ═══ ACCESSIBILITY ═══ */}
        <SettingsSection title="Accessibility" icon={Accessibility}>
          <Toggle
            label="High Contrast"
            description="Increase color contrast for better readability"
            enabled={settings.highContrast}
            onChange={(v) => updateSetting("highContrast", v)}
            icon={Shield}
          />
          <Toggle
            label="Reduce Motion"
            description="Minimize animations and transitions"
            enabled={settings.reduceMotion}
            onChange={(v) => updateSetting("reduceMotion", v)}
            icon={SkipForward}
          />
          <Toggle
            label="Dyslexia-Friendly Font"
            description="Use OpenDyslexic font for improved readability"
            enabled={settings.dyslexiaFont}
            onChange={(v) => updateSetting("dyslexiaFont", v)}
            icon={Type}
          />
          <Toggle
            label="Reduce Glow Effects"
            description="Dim neon glows and scan line overlays"
            enabled={settings.reduceGlow}
            onChange={(v) => updateSetting("reduceGlow", v)}
            icon={Eye}
          />
        </SettingsSection>

        {/* ═══ GAME PREFERENCES ═══ */}
        <SettingsSection title="Game Preferences" icon={Gamepad2}>
          <Toggle
            label="Skip Tutorials"
            description="Skip room tutorial dialogs on first entry"
            enabled={settings.skipTutorials}
            onChange={(v) => updateSetting("skipTutorials", v)}
            icon={SkipForward}
          />
          <Toggle
            label="Show Hints"
            description="Display Elara's hint system for puzzles"
            enabled={settings.showHints}
            onChange={(v) => updateSetting("showHints", v)}
            icon={HelpCircle}
          />

          <Toggle
            label="Show Room Markers"
            description="Display interactive hotspot markers on room images"
            enabled={(() => {
              try {
                const v = localStorage.getItem("loredex-show-hotspots");
                return v === null ? true : v === "true";
              } catch { return true; }
            })()}
            onChange={(v) => {
              localStorage.setItem("loredex-show-hotspots", String(v));
              window.dispatchEvent(new CustomEvent("hotspot-visibility-changed", { detail: { visible: v } }));
              toast.success(v ? "Room markers visible" : "Room markers hidden");
            }}
            icon={Eye}
          />

          <OptionSelector
            label="DIFFICULTY"
            value={settings.difficulty}
            onChange={(v) => updateSetting("difficulty", v)}
            options={[
              { value: "casual", label: "Casual", desc: "Relaxed", icon: Eye },
              { value: "standard", label: "Standard", desc: "Balanced", icon: Gauge },
              { value: "hardcore", label: "Hardcore", desc: "Punishing", icon: Shield },
            ]}
          />

          {/* Reset Game */}
          <div className="pt-2 border-t border-border/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[11px] text-muted-foreground/90 flex items-center gap-2">
                  <RotateCcw size={13} className="text-[var(--alert-red)]/60" />
                  Reset Game Progress
                </p>
                <p className="font-mono text-[9px] text-muted-foreground/50 mt-0.5 ml-[21px]">
                  Resets all rooms, XP, achievements, and card collection. Cannot be undone.
                </p>
              </div>
              {!showResetConfirm ? (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="px-3 py-1.5 rounded-md border border-[var(--alert-red)]/30 text-[var(--alert-red)] font-mono text-[10px] hover:bg-[var(--alert-red)]/10 transition-colors shrink-0"
                >
                  RESET
                </button>
              ) : (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3 py-1.5 rounded-md border border-border/60 text-muted-foreground/70 font-mono text-[10px] hover:bg-muted/50 transition-colors"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={() => {
                      resetGame();
                      setShowResetConfirm(false);
                      toast.success("Game progress has been reset");
                    }}
                    className="px-3 py-1.5 rounded-md bg-[var(--alert-red)]/20 border border-[var(--alert-red)]/40 text-[var(--alert-red)] font-mono text-[10px] hover:bg-[var(--alert-red)]/30 transition-colors"
                  >
                    CONFIRM
                  </button>
                </div>
              )}
            </div>
          </div>
        </SettingsSection>

        {/* ═══ ACCOUNT ═══ */}
        <SettingsSection title="Account" icon={User}>
          {/* Auth Status */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isAuthenticated ? "bg-[var(--neon-cyan)]/10 border border-[var(--neon-cyan)]/30" : "bg-muted/40 border border-border/60"
              }`}>
                <User size={14} className={isAuthenticated ? "text-[var(--neon-cyan)]" : "text-muted-foreground/50"} />
              </div>
              <div>
                <p className="font-mono text-[11px] text-muted-foreground/90">
                  {authLoading ? "Checking..." : isAuthenticated ? (user?.name || "Operative") : "Not logged in"}
                </p>
                <p className="font-mono text-[9px] text-muted-foreground/50">
                  {isAuthenticated ? "Authenticated" : "Log in to sync progress across devices"}
                </p>
              </div>
            </div>
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  toast.success("Logged out");
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border/60 text-muted-foreground/70 font-mono text-[10px] hover:bg-muted/50 hover:text-muted-foreground/90 transition-colors shrink-0"
              >
                <LogOut size={12} />
                LOGOUT
              </button>
            ) : (
              <a
                href={getLoginUrl()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[var(--neon-cyan)]/30 text-[var(--neon-cyan)] font-mono text-[10px] hover:bg-[var(--neon-cyan)]/10 transition-colors shrink-0"
              >
                <LogIn size={12} />
                LOGIN
              </a>
            )}
          </div>

          {/* Sync Status */}
          {isAuthenticated && (
            <div className="flex items-center justify-between py-2 border-t border-border/40">
              <div className="flex items-center gap-2.5">
                {syncStatus === "synced" ? (
                  <Cloud size={14} className="text-green-400/70" />
                ) : syncStatus === "saving" ? (
                  <Cloud size={14} className="text-[var(--neon-cyan)] animate-pulse" />
                ) : syncStatus === "error" ? (
                  <CloudOff size={14} className="text-[var(--alert-red)]" />
                ) : (
                  <Cloud size={14} className="text-muted-foreground/50" />
                )}
                <div>
                  <p className="font-mono text-[10px] text-muted-foreground/70">
                    {syncStatus === "synced" ? "Synced to server" :
                     syncStatus === "saving" ? "Saving..." :
                     syncStatus === "loading" ? "Loading..." :
                     syncStatus === "error" ? "Sync error" : "Not synced"}
                  </p>
                  {lastSyncedAt && (
                    <p className="font-mono text-[8px] text-muted-foreground/40">
                      Last: {new Date(lastSyncedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  forceSave();
                  toast.success("Sync triggered");
                }}
                className="px-3 py-1.5 rounded-md border border-border/60 text-muted-foreground/70 font-mono text-[10px] hover:bg-muted/50 transition-colors shrink-0"
              >
                SYNC NOW
              </button>
            </div>
          )}

          {/* Export Save Data */}
          <div className="flex items-center justify-between py-2 border-t border-border/40">
            <div className="flex items-center gap-2.5">
              <Download size={14} className="text-muted-foreground/60" />
              <div>
                <p className="font-mono text-[11px] text-muted-foreground/90">Export Save Data</p>
                <p className="font-mono text-[9px] text-muted-foreground/50">Download all game progress as JSON</p>
              </div>
            </div>
            <button
              onClick={exportSaveData}
              disabled={exporting}
              className="px-3 py-1.5 rounded-md border border-border/60 text-muted-foreground/70 font-mono text-[10px] hover:bg-muted/50 transition-colors shrink-0 disabled:opacity-30"
            >
              {exporting ? "EXPORTING..." : "EXPORT"}
            </button>
          </div>
        </SettingsSection>

        {/* ═══ PROMO CODES ═══ */}
        <PromoCodeSection isAuthenticated={isAuthenticated} />

        {/* ═══ COMMUNITY ═══ */}
        <SettingsSection title="Community" icon={Users}>
          <div className="space-y-3">
            <div className="p-3 rounded-lg border border-border/60 bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-md bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center shrink-0">
                  <MessageCircle size={18} className="text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display text-sm font-bold tracking-wider text-foreground">DISCORD</h3>
                    <span className="font-mono text-[8px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 tracking-wider">LIVE</span>
                  </div>
                  <p className="font-mono text-[10px] text-muted-foreground/80 leading-relaxed mb-3">
                    Join the Dischordian community. Decode Voltari signals together, coordinate alliance wars, share lore theories, and hear announcements straight from the Storyteller.
                  </p>
                  <a
                    href="https://discord.gg/vGYfAEWaA"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => toast.success("Opening Discord…")}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-indigo-500 hover:bg-indigo-400 text-white font-mono text-[10px] tracking-wider transition-colors"
                    data-testid="link-discord"
                  >
                    JOIN DISCORD
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            </div>
            <p className="font-mono text-[9px] text-muted-foreground/50 text-center">
              Official channels: #ark-bridge · #voltari-decode · #alliance-war · #lore-theories
            </p>

            {/* DGRS Labs */}
            <div className="pt-3 mt-3 border-t border-border/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/40 flex items-center justify-center shrink-0">
                  <span className="font-display text-[9px] font-bold text-purple-300">DG</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-display text-[11px] font-bold tracking-wider text-foreground">DGRS LABS</h4>
                  <p className="font-mono text-[9px] text-muted-foreground/60">Studio behind the Dischordian Saga</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: "Website", href: "https://dgrslabs.ink" },
                  { label: "Discord", href: "https://dgrslabs.ink/join" },
                  { label: "X / Twitter", href: "https://twitter.com/dgrs_labs" },
                  { label: "Instagram", href: "https://instagram.com/dgrs_labs" },
                  { label: "YouTube", href: "https://youtube.com/@conexus_stories" },
                  { label: "TikTok", href: "https://tiktok.com/@conexus_stories" },
                  { label: "LinkedIn", href: "https://linkedin.com/company/dgrslabs" },
                ].map(link => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-1.5 px-2 py-1.5 rounded border border-border/40 hover:border-purple-500/40 hover:bg-purple-500/5 transition-colors group"
                    data-testid={`link-dgrs-${link.label.toLowerCase().replace(/\W+/g, "-")}`}
                  >
                    <span className="font-mono text-[9px] text-muted-foreground/80 group-hover:text-foreground tracking-wider truncate">
                      {link.label}
                    </span>
                    <ExternalLink size={9} className="text-muted-foreground/40 group-hover:text-purple-400 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Version Info */}
        <div className="text-center py-4">
          <p className="font-mono text-[9px] text-muted-foreground/25">
            LOREDEX OS v5.0.0 // INCEPTION ARK // CADES ACTIVE
          </p>
          <p className="font-mono text-[9px] text-muted-foreground/20 mt-1">
            Malkia Ukweli & the Panopticon
          </p>
        </div>
      </div>
    </div>
  );
}
