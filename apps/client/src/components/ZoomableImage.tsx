/* ═══════════════════════════════════════════════════════
   ZOOMABLE IMAGE — Pinch-to-zoom, double-tap zoom, drag-to-pan
   Opens a fullscreen lightbox overlay for character/card artwork.
   ═══════════════════════════════════════════════════════ */
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { X, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Optional children to render as the trigger (defaults to img) */
  children?: ReactNode;
}

export default function ZoomableImage({ src, alt, className, children }: ZoomableImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger — click to open lightbox */}
      <div
        className={`cursor-zoom-in relative group ${className || ""}`}
        onClick={() => setIsOpen(true)}
      >
        {children || (
          <img src={src} alt={alt} className="w-full h-full object-cover" loading="lazy" />
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-muted/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Maximize2 size={20} className="text-white drop-shadow-lg" />
        </div>
      </div>

      {/* Lightbox overlay */}
      <AnimatePresence>
        {isOpen && (
          <ZoomLightbox src={src} alt={alt} onClose={() => setIsOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── LIGHTBOX WITH ZOOM/PAN ─── */
function ZoomLightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const translateStart = useRef({ x: 0, y: 0 });
  const lastTap = useRef(0);
  const pinchStartDist = useRef(0);
  const pinchStartScale = useRef(1);

  const MIN_SCALE = 1;
  const MAX_SCALE = 5;

  // Reset on open
  useEffect(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, [src]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // ── Double-tap to zoom ──
  const handleDoubleTap = useCallback((clientX: number, clientY: number) => {
    if (scale > 1.5) {
      // Zoom out
      setScale(1);
      setTranslate({ x: 0, y: 0 });
    } else {
      // Zoom in to 3x centered on tap point
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = clientX - rect.left - rect.width / 2;
      const cy = clientY - rect.top - rect.height / 2;
      setScale(3);
      setTranslate({ x: -cx * 2, y: -cy * 2 });
    }
  }, [scale]);

  // ── Touch handlers (pinch + pan + double-tap) ──
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch start
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchStartDist.current = Math.hypot(dx, dy);
      pinchStartScale.current = scale;
    } else if (e.touches.length === 1) {
      // Check for double-tap
      const now = Date.now();
      if (now - lastTap.current < 300) {
        handleDoubleTap(e.touches[0].clientX, e.touches[0].clientY);
        lastTap.current = 0;
        return;
      }
      lastTap.current = now;

      // Pan start
      if (scale > 1) {
        setIsDragging(true);
        dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        translateStart.current = { ...translate };
      }
    }
  }, [scale, translate, handleDoubleTap]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 2) {
      // Pinch zoom
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, pinchStartScale.current * (dist / pinchStartDist.current)));
      setScale(newScale);
      if (newScale <= 1) setTranslate({ x: 0, y: 0 });
    } else if (e.touches.length === 1 && isDragging && scale > 1) {
      // Pan
      const dx = e.touches[0].clientX - dragStart.current.x;
      const dy = e.touches[0].clientY - dragStart.current.y;
      setTranslate({
        x: translateStart.current.x + dx,
        y: translateStart.current.y + dy,
      });
    }
  }, [isDragging, scale]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    pinchStartDist.current = 0;
  }, []);

  // ── Mouse handlers (desktop drag + wheel zoom) ──
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY };
      translateStart.current = { ...translate };
    }
  }, [scale, translate]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setTranslate({
        x: translateStart.current.x + dx,
        y: translateStart.current.y + dy,
      });
    }
  }, [isDragging, scale]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.3 : 0.3;
    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale + delta));
    setScale(newScale);
    if (newScale <= 1) setTranslate({ x: 0, y: 0 });
  }, [scale]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    handleDoubleTap(e.clientX, e.clientY);
  }, [handleDoubleTap]);

  const zoomIn = () => setScale(s => Math.min(MAX_SCALE, s + 0.5));
  const zoomOut = () => {
    const newScale = Math.max(MIN_SCALE, scale - 0.5);
    setScale(newScale);
    if (newScale <= 1) setTranslate({ x: 0, y: 0 });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[99999] flex flex-col"
      style={{ background: "rgba(0,0,0,0.95)" }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 z-10">
        <p className="font-mono text-xs text-muted-foreground/70 truncate flex-1 mr-4">{alt}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-muted/50 hover:bg-white/20 text-muted-foreground/90 transition-colors"
            title="Zoom out"
          >
            <ZoomOut size={16} />
          </button>
          <span className="font-mono text-[10px] text-muted-foreground/60 w-10 text-center">{Math.round(scale * 100)}%</span>
          <button
            onClick={zoomIn}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-muted/50 hover:bg-white/20 text-muted-foreground/90 transition-colors"
            title="Zoom in"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-muted/50 hover:bg-white/20 text-muted-foreground/90 transition-colors ml-2"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Image container */}
      <div
        ref={containerRef}
        className={`flex-1 flex items-center justify-center overflow-hidden ${isDragging ? "cursor-grabbing" : scale > 1 ? "cursor-grab" : "cursor-zoom-in"}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
      >
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          draggable={false}
          className="max-w-full max-h-full object-contain select-none"
          style={{
            transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
            transition: isDragging ? "none" : "transform 0.2s ease-out",
          }}
        />
      </div>

      {/* Bottom hint */}
      <div className="text-center py-2">
        <p className="font-mono text-[10px] text-muted-foreground/35">
          {scale > 1 ? "Drag to pan • Double-tap to reset" : "Pinch or scroll to zoom • Double-tap to zoom in"}
        </p>
      </div>
    </motion.div>
  );
}
