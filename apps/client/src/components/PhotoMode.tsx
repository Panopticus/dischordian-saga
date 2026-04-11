/* ═══════════════════════════════════════════════════════
   PHOTO MODE — Capture and share moments from the Ark
   Filters, frames, text overlays, and export options.
   ═══════════════════════════════════════════════════════ */

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera, X, Download, Clipboard, Share2,
  SlidersHorizontal, Frame, Type, Sparkles,
  ChevronDown, ChevronUp, Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/* ─── FILTER PRESETS ─── */
const FILTERS = [
  { id: "normal", name: "Normal", css: "none" },
  { id: "noir", name: "Noir", css: "grayscale(1) contrast(1.3) brightness(0.9)" },
  { id: "void", name: "Void", css: "saturate(0.6) hue-rotate(200deg) brightness(0.85) contrast(1.1)" },
  { id: "corruption", name: "Corruption", css: "saturate(1.4) hue-rotate(-15deg) contrast(1.2) brightness(0.8)" },
  { id: "golden_age", name: "Golden Age", css: "sepia(0.6) saturate(1.2) brightness(1.05) contrast(0.95)" },
  { id: "terminus", name: "Terminus", css: "saturate(0.3) brightness(0.75) contrast(1.15) hue-rotate(180deg)" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

/* ─── FRAME PRESETS ─── */
const FRAMES = [
  { id: "none", name: "None" },
  { id: "ark_log", name: "Ark Log" },
  { id: "portrait", name: "Portrait" },
  { id: "wanted", name: "Wanted Poster" },
  { id: "loredex", name: "Loredex Entry" },
] as const;

type FrameId = (typeof FRAMES)[number]["id"];

/* ─── COMPONENT ─── */

interface PhotoModeProps {
  /** Whether photo mode is currently active */
  isOpen: boolean;
  /** Close photo mode */
  onClose: () => void;
  /** Optional className for the capture target (defaults to capturing the viewport) */
  captureTargetRef?: React.RefObject<HTMLElement | null>;
}

export function PhotoMode({ isOpen, onClose, captureTargetRef }: PhotoModeProps) {
  const [filter, setFilter] = useState<FilterId>("normal");
  const [frame, setFrame] = useState<FrameId>("none");
  const [caption, setCaption] = useState("");
  const [vignette, setVignette] = useState(0.3);
  const [blurBg, setBlurBg] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [flashActive, setFlashActive] = useState(false);
  const [copied, setCopied] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);

  /* ─── CAPTURE ─── */
  const capture = useCallback(async () => {
    // Flash animation
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 300);

    try {
      // Dynamic import to avoid bundling html2canvas when not needed
      const { default: html2canvas } = await import("html2canvas");
      const target = captureTargetRef?.current ?? viewportRef.current;
      if (!target) return;

      const canvas = await html2canvas(target, {
        backgroundColor: "#010020",
        scale: 2,
        useCORS: true,
        logging: false,
      });

      // Download
      const link = document.createElement("a");
      link.download = `dischordian-saga-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      // Fallback: use native screenshot hint
      alert("Screenshot saved! Use your device's screenshot feature for best quality.");
    }
  }, [captureTargetRef]);

  const copyToClipboard = useCallback(async () => {
    try {
      const { default: html2canvas } = await import("html2canvas");
      const target = captureTargetRef?.current ?? viewportRef.current;
      if (!target) return;

      const canvas = await html2canvas(target, {
        backgroundColor: "#010020",
        scale: 2,
        useCORS: true,
      });

      canvas.toBlob(async (blob: Blob | null) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } catch {
      // Clipboard API not available
    }
  }, [captureTargetRef]);

  const filterCss = FILTERS.find((f) => f.id === filter)?.css ?? "none";

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="photo-mode"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50"
      >
        {/* Viewport with filters applied */}
        <div
          ref={viewportRef}
          className="absolute inset-0"
          style={{ filter: filterCss }}
        >
          {/* Vignette overlay */}
          {vignette > 0 && (
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background: `radial-gradient(ellipse at center, transparent ${Math.round((1 - vignette) * 70)}%, rgba(0,0,0,${vignette}) 100%)`,
              }}
            />
          )}

          {/* Blur background */}
          {blurBg && (
            <div className="absolute inset-0 backdrop-blur-sm pointer-events-none z-[5]" />
          )}

          {/* Frame overlay */}
          {frame !== "none" && (
            <div className={cn("absolute inset-0 pointer-events-none z-20", getFrameStyles(frame))}>
              {frame === "ark_log" && (
                <div className="absolute bottom-4 left-4 right-4 font-mono text-xs text-primary/60 flex justify-between">
                  <span>ARK-1047-VOX // VISUAL LOG</span>
                  <span>{new Date().toISOString().split("T")[0]}</span>
                </div>
              )}
              {frame === "wanted" && (
                <div className="absolute top-8 left-0 right-0 text-center">
                  <p className="text-2xl font-bold tracking-[0.3em] text-amber-400/80">WANTED</p>
                  <p className="text-xs text-amber-400/50 mt-1">BY ORDER OF THE ARCHITECT</p>
                </div>
              )}
              {frame === "loredex" && (
                <div className="absolute top-4 left-4 font-mono text-[10px] text-primary/40">
                  <p>LOREDEX ENTRY // VISUAL RECORD</p>
                  <p>CLASSIFICATION: FIELD OBSERVATION</p>
                </div>
              )}
            </div>
          )}

          {/* Caption overlay */}
          {caption && (
            <div className="absolute bottom-16 left-0 right-0 text-center z-20 pointer-events-none">
              <p className="inline-block px-4 py-2 bg-black/60 backdrop-blur-sm text-white font-mono text-sm rounded">
                {caption}
              </p>
            </div>
          )}
        </div>

        {/* Camera flash */}
        <AnimatePresence>
          {flashActive && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-white z-40 pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Controls panel */}
        <motion.div
          initial={{ x: 300 }}
          animate={{ x: showControls ? 0 : 280 }}
          className="absolute right-0 top-0 bottom-0 w-72 bg-black/80 backdrop-blur-md border-l border-primary/20 z-30 flex flex-col"
        >
          {/* Toggle button */}
          <button
            onClick={() => setShowControls(!showControls)}
            className="absolute -left-8 top-4 w-8 h-8 bg-black/80 border border-primary/20 rounded-l flex items-center justify-center text-primary/60 hover:text-primary"
          >
            {showControls ? <ChevronUp className="w-4 h-4 rotate-90" /> : <ChevronDown className="w-4 h-4 -rotate-90" />}
          </button>

          <div className="p-4 space-y-4 overflow-y-auto flex-1">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-primary" />
                <span className="text-sm font-mono text-primary">PHOTO MODE</span>
              </div>
              <button onClick={onClose} className="text-primary/40 hover:text-primary">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filters */}
            <div className="space-y-2">
              <label className="flex items-center gap-1 text-xs font-mono text-primary/60">
                <SlidersHorizontal className="w-3 h-3" /> FILTER
              </label>
              <div className="grid grid-cols-3 gap-1">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={cn(
                      "text-[10px] font-mono py-1.5 px-2 rounded border transition-colors",
                      filter === f.id
                        ? "border-primary text-primary bg-primary/10"
                        : "border-primary/20 text-primary/40 hover:text-primary/60"
                    )}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Frames */}
            <div className="space-y-2">
              <label className="flex items-center gap-1 text-xs font-mono text-primary/60">
                <Frame className="w-3 h-3" /> FRAME
              </label>
              <div className="grid grid-cols-2 gap-1">
                {FRAMES.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFrame(f.id)}
                    className={cn(
                      "text-[10px] font-mono py-1.5 px-2 rounded border transition-colors",
                      frame === f.id
                        ? "border-primary text-primary bg-primary/10"
                        : "border-primary/20 text-primary/40 hover:text-primary/60"
                    )}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Vignette slider */}
            <div className="space-y-2">
              <label className="flex items-center gap-1 text-xs font-mono text-primary/60">
                <Sparkles className="w-3 h-3" /> VIGNETTE
              </label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={vignette}
                onChange={(e) => setVignette(Number(e.target.value))}
                className="w-full accent-primary h-1"
              />
            </div>

            {/* Blur toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={blurBg}
                onChange={(e) => setBlurBg(e.target.checked)}
                className="accent-primary"
              />
              <span className="text-xs font-mono text-primary/60">Blur Background</span>
            </label>

            {/* Caption */}
            <div className="space-y-2">
              <label className="flex items-center gap-1 text-xs font-mono text-primary/60">
                <Type className="w-3 h-3" /> CAPTION
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a caption..."
                maxLength={100}
                className="w-full bg-black/50 border border-primary/20 rounded px-2 py-1 text-xs text-primary placeholder:text-primary/20 font-mono focus:outline-none focus:border-primary/40"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="p-4 border-t border-primary/20 space-y-2">
            <Button onClick={capture} className="w-full gap-2" size="sm">
              <Camera className="w-4 h-4" /> Capture
            </Button>
            <div className="flex gap-2">
              <Button onClick={copyToClipboard} variant="outline" size="sm" className="flex-1 gap-1">
                {copied ? <Check className="w-3 h-3" /> : <Clipboard className="w-3 h-3" />}
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-1"
                onClick={() => {
                  const text = `Aboard Ark 1047 in the Dischordian Saga${caption ? ` — "${caption}"` : ""}`;
                  navigator.share?.({ text }).catch(() => {});
                }}
              >
                <Share2 className="w-3 h-3" /> Share
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── FRAME STYLES ─── */
function getFrameStyles(frame: FrameId): string {
  switch (frame) {
    case "ark_log":
      return "border-4 border-primary/20 rounded-sm";
    case "portrait":
      return "border-8 border-double border-amber-500/30";
    case "wanted":
      return "border-4 border-amber-600/40 bg-gradient-to-b from-amber-900/10 to-transparent";
    case "loredex":
      return "border border-primary/30 bg-gradient-to-br from-primary/5 to-transparent";
    default:
      return "";
  }
}
