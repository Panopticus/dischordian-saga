/**
 * InboxEnvelopeUnfold — NPC Inbox envelope→reader UI expansion.
 *
 * Beat H. Bible §14.6, §18.3.
 * CORE NPC INBOX UI ASSET — reused for every message across the
 * entire game. Engineered as a configurable component accepting
 * sender, timestamp, and body as parameters.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { registerPreludeVfx, type PreludeVfxProps } from "../preludeVfxRegistry";
import "../prelude-vfx.css";

interface InboxEnvelopeProps extends PreludeVfxProps {
  /** Sender name displayed in the header. */
  sender?: string;
  /** Timestamp string. */
  timestamp?: string;
  /** Message body text. */
  body?: string;
}

export function InboxEnvelopeUnfold({
  active,
  sender = "Unknown Sender",
  timestamp = "",
  body = "",
  onComplete,
  className = "",
}: InboxEnvelopeProps) {
  const [unfolded, setUnfolded] = useState(false);

  if (!active) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={className}
        initial={{ scale: 0.3, opacity: 0, borderRadius: "8px" }}
        animate={
          unfolded
            ? { scale: 1, opacity: 1, borderRadius: "4px" }
            : { scale: 0.3, opacity: 1, borderRadius: "8px" }
        }
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        onClick={() => {
          if (!unfolded) {
            setUnfolded(true);
            onComplete?.();
          }
        }}
        style={{
          position: "absolute",
          width: unfolded ? "360px" : "60px",
          height: unfolded ? "480px" : "60px",
          backgroundColor: "color-mix(in oklch, var(--bg-void) 95%, transparent)",
          border: "1px solid color-mix(in oklch, var(--energy-primary) 40%, transparent)",
          boxShadow: "0 0 24px color-mix(in oklch, var(--energy-primary) 20%, transparent)",
          overflow: "hidden",
          cursor: unfolded ? "default" : "pointer",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {!unfolded ? (
          /* Envelope glyph (collapsed state) */
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--energy-primary)",
              fontSize: "28px",
            }}
          >
            ✉
          </div>
        ) : (
          /* Three-region reader UI (unfolded state) */
          <>
            {/* Region 1: Sender header */}
            <div
              style={{
                padding: "16px",
                borderBottom: "1px solid color-mix(in oklch, var(--energy-primary) 20%, transparent)",
                color: "var(--energy-primary)",
                fontSize: "14px",
                fontFamily: "monospace",
              }}
            >
              <div style={{ fontWeight: 600 }}>{sender}</div>
              {timestamp && (
                <div style={{ fontSize: "11px", opacity: 0.6, marginTop: "4px" }}>
                  {timestamp}
                </div>
              )}
            </div>
            {/* Region 2: Separator line */}
            <div
              style={{
                height: "1px",
                background: "linear-gradient(90deg, transparent, var(--energy-primary), transparent)",
              }}
            />
            {/* Region 3: Message body */}
            <div
              style={{
                flex: 1,
                padding: "16px",
                color: "color-mix(in oklch, var(--text-primary) 85%, transparent)",
                fontSize: "13px",
                fontFamily: "monospace",
                lineHeight: 1.6,
                overflowY: "auto",
              }}
            >
              {body}
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

registerPreludeVfx("vfx_inbox_envelope_unfold", {
  component: InboxEnvelopeUnfold as React.ComponentType<PreludeVfxProps>,
  label: "Inbox Envelope Unfold",
  mode: "stateful",
});
