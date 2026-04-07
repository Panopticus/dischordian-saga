/* ═══════════════════════════════════════════════════════
   COOKIE CONSENT BANNER — GDPR/ePrivacy compliance
   Shows once, remembers preference in localStorage.
   Minimal: session cookie + optional analytics.
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { Link } from "wouter";

const CONSENT_KEY = "loredex-cookie-consent";

type ConsentState = { essential: true; analytics: boolean; timestamp: number };

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (!stored) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const accept = (analytics: boolean) => {
    const consent: ConsentState = { essential: true, analytics, timestamp: Date.now() };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-[9999]"
        >
          <div className="rounded-lg border border-border/40 bg-card/95 backdrop-blur-md shadow-2xl p-4">
            <div className="flex items-start gap-3">
              <Cookie size={18} className="text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-mono text-xs text-foreground mb-1 font-semibold tracking-wider">
                  COMMS PROTOCOL NOTICE
                </p>
                <p className="font-mono text-[11px] text-muted-foreground leading-relaxed mb-3">
                  The Ark uses a single session cookie to keep you logged in.
                  We also use privacy-focused analytics (no tracking pixels).
                  See our{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>{" "}
                  for details.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => accept(true)}
                    className="px-3 py-1.5 rounded-md bg-primary/20 border border-primary/40 text-primary text-[10px] font-mono tracking-wider hover:bg-primary/30 transition-all"
                  >
                    ACCEPT ALL
                  </button>
                  <button
                    onClick={() => accept(false)}
                    className="px-3 py-1.5 rounded-md bg-secondary/50 border border-border/30 text-muted-foreground text-[10px] font-mono tracking-wider hover:text-foreground transition-all"
                  >
                    ESSENTIAL ONLY
                  </button>
                </div>
              </div>
              <button
                onClick={() => accept(false)}
                className="text-muted-foreground/50 hover:text-foreground transition-colors shrink-0"
                aria-label="Dismiss"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Read stored consent (useful for conditionally loading analytics) */
export function getCookieConsent(): ConsentState | null {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}
