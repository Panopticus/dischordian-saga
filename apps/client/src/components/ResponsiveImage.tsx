/* ═══════════════════════════════════════════════════════
   RESPONSIVE IMAGE — Task 3.2

   Drop-in <img> replacement that:
   1. Prefers a .webp variant next to the original. The
      `scripts/optimize-images.ts` script generates these.
   2. Falls back to the original format for old browsers
      via <picture> + <source>.
   3. Defaults to loading="lazy" and decoding="async" so
      below-the-fold images don't block first paint.
   4. Accepts the same props as <img>, plus an `eager` flag
      to opt out of lazy loading for above-the-fold hero art.

   Usage:
     <ResponsiveImage
       src="/art/rooms/room-bridge.png"  // TODO(art): generate — see docs/production/MISSING_ART_PROMPTS.md #8
       alt="Bridge"
       className="w-full h-full object-cover"
     />

   If `room-bridge.webp` exists it is served; otherwise
   the browser falls back to `room-bridge.png` with no
   quality loss.
   ═══════════════════════════════════════════════════════ */

import type { ImgHTMLAttributes } from "react";
import { forwardRef } from "react";

export interface ResponsiveImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "loading" | "decoding"> {
  /** Force load="eager" for above-the-fold images (hero backgrounds). */
  eager?: boolean;
  /**
   * Override decoding strategy. Defaults to "async" which is almost always
   * what you want — it lets the browser decode off the main thread.
   */
  decoding?: "async" | "sync" | "auto";
}

/** Derive the .webp sibling path from a raster image src. */
function toWebpPath(src: string): string | null {
  if (!src) return null;
  if (/\.webp(\?|#|$)/i.test(src)) return null; // already webp
  if (!/\.(png|jpe?g)(\?|#|$)/i.test(src)) return null;
  return src.replace(/\.(png|jpe?g)/i, ".webp");
}

/** MIME type for the original source — used by <source type="..."> so the
 *  browser can skip the element quickly if it doesn't support the format. */
function toMimeType(src: string): string | null {
  const m = /\.(png|jpe?g|webp|avif)/i.exec(src);
  if (!m) return null;
  const ext = m[1].toLowerCase();
  if (ext === "png") return "image/png";
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  if (ext === "webp") return "image/webp";
  if (ext === "avif") return "image/avif";
  return null;
}

export const ResponsiveImage = forwardRef<HTMLImageElement, ResponsiveImageProps>(
  function ResponsiveImage({ src, alt, eager, decoding = "async", ...rest }, ref) {
    const safeSrc = src ?? "";
    const webp = toWebpPath(safeSrc);
    const originalMime = toMimeType(safeSrc);
    const loading = eager ? "eager" : "lazy";

    // No extension we recognize — just render a plain <img>.
    if (!webp) {
      return (
        <img
          ref={ref}
          src={safeSrc}
          alt={alt ?? ""}
          loading={loading}
          decoding={decoding}
          {...rest}
        />
      );
    }

    return (
      <picture>
        <source srcSet={webp} type="image/webp" />
        {originalMime && <source srcSet={safeSrc} type={originalMime} />}
        <img
          ref={ref}
          src={safeSrc}
          alt={alt ?? ""}
          loading={loading}
          decoding={decoding}
          {...rest}
        />
      </picture>
    );
  },
);

export default ResponsiveImage;
