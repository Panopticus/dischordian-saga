/* ═══════════════════════════════════════════════════════
   ACCESSIBILITY UTILITIES — ARIA helpers, keyboard nav,
   focus traps, and screen reader announcements.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useRef, useCallback, type ReactNode } from "react";

/* ── Screen Reader Only ── */
export function ScreenReaderOnly({ children }: { children: ReactNode }) {
  return (
    <span
      className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0"
      style={{ clip: "rect(0, 0, 0, 0)" }}
    >
      {children}
    </span>
  );
}

/* ── Live Region for Announcements ── */
export function LiveRegion({ message, assertive = false }: { message: string; assertive?: boolean }) {
  return (
    <div
      aria-live={assertive ? "assertive" : "polite"}
      aria-atomic="true"
      className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0"
      style={{ clip: "rect(0, 0, 0, 0)" }}
    >
      {message}
    </div>
  );
}

/* ── Focus Trap ── */
export function useFocusTrap(active: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusable = container.querySelectorAll<HTMLElement>(focusableSelector);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);

    // Focus first focusable element
    const firstFocusable = container.querySelector<HTMLElement>(focusableSelector);
    firstFocusable?.focus();

    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [active]);

  return containerRef;
}

/* ── Skip to Content Link ── */
export function SkipToContent({ targetId = "main-content" }: { targetId?: string }) {
  return (
    <a
      href={`#${targetId}`}
      className="absolute -top-10 left-4 z-[9999] bg-primary text-primary-foreground px-4 py-2 rounded-md font-mono text-sm focus:top-4 transition-all"
      style={{ clip: "rect(0, 0, 0, 0)" }}
      onFocus={(e) => {
        (e.target as HTMLElement).style.clip = "auto";
      }}
      onBlur={(e) => {
        (e.target as HTMLElement).style.clip = "rect(0, 0, 0, 0)";
      }}
    >
      Skip to main content
    </a>
  );
}

/* ── Keyboard Navigation Hook ── */
export function useKeyboardNav(items: HTMLElement[], options?: { loop?: boolean; orientation?: "horizontal" | "vertical" }) {
  const { loop = true, orientation = "vertical" } = options || {};

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const currentIndex = items.findIndex(item => item === document.activeElement);
    if (currentIndex === -1) return;

    const isNext = orientation === "vertical" ? e.key === "ArrowDown" : e.key === "ArrowRight";
    const isPrev = orientation === "vertical" ? e.key === "ArrowUp" : e.key === "ArrowLeft";

    if (isNext) {
      e.preventDefault();
      const next = loop
        ? items[(currentIndex + 1) % items.length]
        : items[Math.min(currentIndex + 1, items.length - 1)];
      next?.focus();
    } else if (isPrev) {
      e.preventDefault();
      const prev = loop
        ? items[(currentIndex - 1 + items.length) % items.length]
        : items[Math.max(currentIndex - 1, 0)];
      prev?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      items[items.length - 1]?.focus();
    }
  }, [items, loop, orientation]);

  return handleKeyDown;
}

/* ── Announce to Screen Reader ── */
let announceEl: HTMLDivElement | null = null;

export function announce(message: string, assertive = false) {
  if (!announceEl) {
    announceEl = document.createElement("div");
    announceEl.setAttribute("aria-live", "polite");
    announceEl.setAttribute("aria-atomic", "true");
    announceEl.className = "absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0";
    announceEl.style.clip = "rect(0, 0, 0, 0)";
    document.body.appendChild(announceEl);
  }

  announceEl.setAttribute("aria-live", assertive ? "assertive" : "polite");
  // Clear then set to trigger announcement
  announceEl.textContent = "";
  requestAnimationFrame(() => {
    if (announceEl) announceEl.textContent = message;
  });
}
