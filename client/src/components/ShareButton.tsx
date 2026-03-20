/* ═══════════════════════════════════════════════════════
   SHARE BUTTON — Social sharing with native share API
   fallback and copy-to-clipboard.
   ═══════════════════════════════════════════════════════ */
import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonProps {
  title: string;
  text?: string;
  className?: string;
  size?: "sm" | "md";
}

export default function ShareButton({ title, text, className = "", size = "sm" }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: `${title} | Loredex OS`,
      text: text || `Check out ${title} on Loredex OS - The Dischordian Saga`,
      url,
    };

    // Try native share API first (mobile)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User cancelled or error, fall through to clipboard
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard", {
        description: "Share it with fellow operatives",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link");
    }
  };

  const iconSize = size === "sm" ? 11 : 14;

  return (
    <button
      onClick={handleShare}
      className={`flex items-center gap-1.5 font-mono tracking-wider transition-all ${
        size === "sm"
          ? "px-2.5 py-1.5 rounded-md text-[10px]"
          : "px-3 py-2 rounded-md text-xs"
      } ${
        copied
          ? "text-[var(--signal-green)] border border-[var(--signal-green)]/30 bg-[var(--signal-green)]/5"
          : "text-muted-foreground/70 border border-white/10 hover:text-foreground/85 hover:border-white/20 hover:bg-muted/50"
      } ${className}`}
    >
      {copied ? <Check size={iconSize} /> : <Share2 size={iconSize} />}
      {copied ? "COPIED" : "SHARE"}
    </button>
  );
}
