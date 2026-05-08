/**
 * VoidSkeleton — Physics-aware loading placeholder.
 *
 * Glass: gradient shimmer sweep (smooth, translucent)
 * Flat: solid pulse (simple opacity change)
 * Retro: sharp scan-line sweep (stepped, hard edges)
 */

interface VoidSkeletonProps {
  /** Width (CSS value). Default "100%" */
  width?: string | number;
  /** Height (CSS value). Default "1em" */
  height?: string | number;
  /** Border radius follows physics. Override here. */
  rounded?: boolean;
  className?: string;
}

export default function VoidSkeleton({
  width = "100%",
  height = "1em",
  rounded = true,
  className = "",
}: VoidSkeletonProps) {
  return (
    <div
      className={`void-skeleton ${className}`}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        borderRadius: rounded ? "var(--ve-radius-sm, 4px)" : 0, // void-ignore
      }}
    />
  );
}
