/* ═══════════════════════════════════════════════════════
   Z-INDEX REGISTRY — Single source of truth for layering

   Prevents modal/overlay collisions by centralizing z-index
   values. Each layer has a clear purpose.

   USAGE: import { Z } from "@/lib/zIndex";
          <div className={`fixed inset-0 ${Z.MODAL}`} />
   ═══════════════════════════════════════════════════════ */

/** Z-index layer constants — ordered from back to front */
export const Z_INDEX = {
  // ═══ BASE LAYER (0-9) ═══
  BASE: 0,
  BG_DECORATION: 1,
  BG_OVERLAY: 2,

  // ═══ CONTENT LAYER (10-29) ═══
  CONTENT: 10,
  CONTENT_ELEVATED: 20,
  CONTENT_STICKY: 25,

  // ═══ UI CHROME (30-49) ═══
  NAV_BAR: 30,
  HEADER: 35,
  FLOATING_BUTTONS: 40,
  SIDE_PANEL: 45,

  // ═══ POPOVERS (50-69) ═══
  DROPDOWN: 50,
  TOOLTIP: 55,
  POPOVER: 60,

  // ═══ NOTIFICATIONS (70-89) ═══
  TOAST: 75,
  BANNER: 80,
  NOTIFICATION: 85,

  // ═══ MODALS (90-109) ═══
  /** Secondary modal (nested inside a primary) */
  MODAL_SECONDARY: 90,
  /** Primary modal dialog */
  MODAL: 100,
  /** Modal backdrop */
  MODAL_BACKDROP: 95,

  // ═══ GAME OVERLAYS (110-129) ═══
  /** Game mode active overlay (fight, casino, quiz, etc.) */
  GAME_OVERLAY: 110,
  /** Dialog/conversation overlay */
  NPC_DIALOG: 115,
  /** Achievement/unlock celebration */
  CELEBRATION: 120,

  // ═══ CRITICAL SYSTEMS (130-199) ═══
  /** Important player notifications */
  SYSTEM_ALERT: 130,
  /** Discovery/unlock reveals */
  DISCOVERY: 140,

  // ═══ CINEMATICS (200-299) ═══
  /** Full-screen cinematic */
  CINEMATIC: 200,
  /** Cinematic UI (skip button, subtitles) */
  CINEMATIC_UI: 210,

  // ═══ ABSOLUTE TOP (9000+) ═══
  /** Landscape orientation enforcer (must block everything) */
  ORIENTATION_LOCK: 9000,
  /** Dev overlays, error boundaries */
  DEV_OVERLAY: 9500,
  /** Critical errors only */
  FATAL_ERROR: 9999,
} as const;

/** Tailwind class helpers (since Tailwind uses bracket notation) */
export const Z = {
  BG_DECORATION: "z-[1]",
  BG_OVERLAY: "z-[2]",
  CONTENT: "z-[10]",
  CONTENT_ELEVATED: "z-[20]",
  CONTENT_STICKY: "z-[25]",
  NAV_BAR: "z-[30]",
  HEADER: "z-[35]",
  FLOATING_BUTTONS: "z-[40]",
  SIDE_PANEL: "z-[45]",
  DROPDOWN: "z-[50]",
  TOOLTIP: "z-[55]",
  POPOVER: "z-[60]",
  TOAST: "z-[75]",
  BANNER: "z-[80]",
  NOTIFICATION: "z-[85]",
  MODAL_SECONDARY: "z-[90]",
  MODAL_BACKDROP: "z-[95]",
  MODAL: "z-[100]",
  GAME_OVERLAY: "z-[110]",
  NPC_DIALOG: "z-[115]",
  CELEBRATION: "z-[120]",
  SYSTEM_ALERT: "z-[130]",
  DISCOVERY: "z-[140]",
  CINEMATIC: "z-[200]",
  CINEMATIC_UI: "z-[210]",
  ORIENTATION_LOCK: "z-[9000]",
  DEV_OVERLAY: "z-[9500]",
  FATAL_ERROR: "z-[9999]",
} as const;

/**
 * Rules for using z-index layers:
 *
 * 1. NEVER hardcode z-[NN] values in components. Always use Z.X constants.
 * 2. Game overlays (fight, casino, quiz) should use GAME_OVERLAY (110)
 *    and be mutually exclusive — only one at a time.
 * 3. NPC dialog uses NPC_DIALOG (115) to appear above game overlays.
 * 4. System alerts (resurrection events, feature unlocks) use SYSTEM_ALERT (130).
 * 5. Cinematics override everything except the orientation lock.
 */
