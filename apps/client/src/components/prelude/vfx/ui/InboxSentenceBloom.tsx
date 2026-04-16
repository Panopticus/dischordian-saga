/**
 * InboxSentenceBloom — VO-synced sentence highlight bloom.
 *
 * Beat H. Bible §14.6, §18.3.
 * Configurable per-message via highlightSentenceIndex parameter.
 */
import { registerPreludeVfx, type PreludeVfxProps } from "../preludeVfxRegistry";
import "../prelude-vfx.css";

interface InboxSentenceBloomProps extends PreludeVfxProps {
  /** Index of the sentence to highlight (0-based). */
  highlightSentenceIndex?: number;
  /** The sentences to render. */
  sentences?: string[];
}

export function InboxSentenceBloom({
  active,
  highlightSentenceIndex = -1,
  sentences = [],
  onComplete,
  className = "",
}: InboxSentenceBloomProps) {
  if (!active) return null;

  return (
    <div className={className} style={{ position: "absolute", pointerEvents: "none" }}>
      {sentences.map((sentence, i) => (
        <span
          key={i}
          style={{
            display: "inline",
            transition: "text-shadow 0.4s ease-out, color 0.4s ease-out",
            textShadow:
              i === highlightSentenceIndex
                ? "0 0 12px #22d3ee, 0 0 24px rgba(34, 211, 238, 0.4)"
                : "none",
            color:
              i === highlightSentenceIndex
                ? "#22d3ee"
                : "inherit",
          }}
          onTransitionEnd={i === highlightSentenceIndex ? onComplete : undefined}
        >
          {sentence}{" "}
        </span>
      ))}
    </div>
  );
}

registerPreludeVfx("vfx_inbox_edge_sentence_bloom", {
  component: InboxSentenceBloom as React.ComponentType<PreludeVfxProps>,
  label: "Inbox Edge Sentence Bloom",
  mode: "one-shot",
});
