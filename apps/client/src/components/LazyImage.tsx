/**
 * LazyImage — Performance-optimized image loading.
 *
 * - Native lazy loading (loading="lazy")
 * - Decoding async (non-blocking)
 * - Fade-in on load
 * - Optional blur placeholder
 * - Tracks load state for skeleton display
 */
import { useState, useCallback } from "react";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Show void-skeleton while loading */
  showSkeleton?: boolean;
}

export default function LazyImage({ showSkeleton = false, className = "", style, onLoad, ...rest }: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);

  const handleLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    setLoaded(true);
    onLoad?.(e);
  }, [onLoad]);

  return (
    <div className="relative" style={{ width: style?.width, height: style?.height }}>
      {showSkeleton && !loaded && (
        <div className="absolute inset-0 void-skeleton" />
      )}
      <img
        loading="lazy"
        decoding="async"
        className={`${className} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        style={style}
        onLoad={handleLoad}
        {...rest}
      />
    </div>
  );
}
