/* ═══════════════════════════════════════════════════════════════════
   ROLEPLAY CHAT MESSAGE — render component for chat lines that
   honour the /me, /ic, /ooc, /whisper conventions.

   Pure render; no network. Wrap any chat-message string with this.
   ═══════════════════════════════════════════════════════════════════ */
import { parseChatAction, INNER_VOICE_LABELS, type InnerVoiceKey } from "@shared/roleplayChat";

interface Props {
  /** Raw message text including any leading slash command. */
  text: string;
  /** Author display name (chosen name preferred). */
  authorName: string;
  /** Optional inner-voice signature shown as a leading prefix. */
  innerVoice?: InnerVoiceKey | null;
  /** Optional timestamp in iso form. */
  timestamp?: string | Date | null;
  /** Optional className to merge into wrapper. */
  className?: string;
}

function fmtTime(t: string | Date | null | undefined): string {
  if (!t) return "";
  const d = typeof t === "string" ? new Date(t) : t;
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/**
 * RoleplayChatMessage — formats a chat line according to its parsed
 * action.
 *
 *   /me draws her cipher-knife slowly.
 *     → italic, "Vessel-7 draws her cipher-knife slowly."
 *
 *   /ic Approach with caution; the relay is hot.
 *     → bracket-tagged "[IC]" cyan accent.
 *
 *   /ooc brb dinner
 *     → bracket-tagged "[OOC]" muted gray.
 *
 *   /whisper Elara The map. I have it.
 *     → italic, addressed-to handle, dimmed.
 *
 * Inner voice prefix renders before the body when present and the
 * mode is `say` or `ic` (a roleplayer's "voice").
 */
export function RoleplayChatMessage({
  text,
  authorName,
  innerVoice,
  timestamp,
  className,
}: Props) {
  const action = parseChatAction(text);
  const time = fmtTime(timestamp);
  const innerVoiceLabel = innerVoice ? INNER_VOICE_LABELS[innerVoice] : null;

  const wrap = (children: React.ReactNode, extra = "") => (
    <div className={`text-sm leading-relaxed ${extra} ${className ?? ""}`}>
      {time && (
        <span className="font-mono text-[10px] text-muted-foreground mr-2 opacity-60">
          {time}
        </span>
      )}
      {children}
    </div>
  );

  switch (action.mode) {
    case "emote":
      return wrap(
        <span className="italic text-purple-300">
          * {authorName} {action.body}
        </span>,
      );
    case "whisper":
      return wrap(
        <span className="italic text-pink-300/80">
          [whisper → {action.whisperTo}] {authorName}: {action.body}
        </span>,
      );
    case "ooc":
      return wrap(
        <span className="text-muted-foreground">
          <span className="font-mono text-[10px] mr-1">[OOC]</span>
          <span className="font-semibold mr-1">{authorName}:</span>
          {action.body}
        </span>,
      );
    case "ic":
      return wrap(
        <span>
          <span className="font-mono text-[10px] text-cyan-300/80 mr-1">[IC]</span>
          <span className="font-semibold mr-1">{authorName}:</span>
          {innerVoiceLabel && (
            <span className="italic text-cyan-200/70 mr-1">
              ({innerVoiceLabel})
            </span>
          )}
          {action.body}
        </span>,
      );
    case "say":
    default:
      return wrap(
        <span>
          <span className="font-semibold mr-1">{authorName}:</span>
          {innerVoiceLabel && (
            <span className="italic text-muted-foreground mr-1">
              ({innerVoiceLabel})
            </span>
          )}
          {action.body}
        </span>,
      );
  }
}
