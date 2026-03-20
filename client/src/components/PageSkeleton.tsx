/* ═══════════════════════════════════════════════════════
   PAGE SKELETON — Reusable loading skeleton for all pages
   Provides consistent loading states matching the Loredex OS aesthetic
   ═══════════════════════════════════════════════════════ */
import { Skeleton } from "@/components/ui/skeleton";

type SkeletonVariant = "grid" | "list" | "detail" | "dashboard" | "gallery";

interface PageSkeletonProps {
  variant?: SkeletonVariant;
  title?: string;
}

export default function PageSkeleton({ variant = "grid", title }: PageSkeletonProps) {
  return (
    <div className="animate-fade-in px-4 sm:px-6 pt-4 pb-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-5 w-5 rounded bg-primary/10" />
        {title ? (
          <span className="font-display text-sm font-bold tracking-[0.2em] text-muted-foreground/50">{title}</span>
        ) : (
          <Skeleton className="h-4 w-40 bg-primary/10" />
        )}
        <Skeleton className="h-3 w-24 ml-auto bg-primary/5" />
      </div>

      {variant === "dashboard" && <DashboardSkeleton />}
      {variant === "grid" && <GridSkeleton />}
      {variant === "list" && <ListSkeleton />}
      {variant === "detail" && <DetailSkeleton />}
      {variant === "gallery" && <GallerySkeleton />}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <>
      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border/20 bg-card/20 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded bg-primary/10" />
              <Skeleton className="h-2 w-16 bg-primary/5" />
            </div>
            <Skeleton className="h-7 w-12 bg-primary/10" />
          </div>
        ))}
      </div>
      {/* Content area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-lg border border-border/20 bg-card/20 p-5 space-y-3">
          <Skeleton className="h-3 w-32 bg-primary/10" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full bg-primary/5" />
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-border/20 bg-card/20 p-5 space-y-3">
          <Skeleton className="h-3 w-28 bg-primary/10" />
          <Skeleton className="h-40 w-full bg-primary/5 rounded-lg" />
        </div>
      </div>
    </>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="rounded-lg border border-border/20 bg-card/20 overflow-hidden">
          <Skeleton className="aspect-square w-full bg-primary/5" />
          <div className="p-2.5 space-y-1.5">
            <Skeleton className="h-3 w-3/4 bg-primary/10" />
            <Skeleton className="h-2 w-1/2 bg-primary/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-lg border border-border/20 bg-card/20 p-3 flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded shrink-0 bg-primary/10" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3 w-1/3 bg-primary/10" />
            <Skeleton className="h-2 w-2/3 bg-primary/5" />
          </div>
          <Skeleton className="h-6 w-16 rounded bg-primary/5" />
        </div>
      ))}
    </div>
  );
}

function DetailSkeleton() {
  return (
    <>
      <div className="flex gap-6">
        <Skeleton className="w-48 h-48 rounded-lg shrink-0 bg-primary/10" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-2/3 bg-primary/10" />
          <Skeleton className="h-3 w-1/3 bg-primary/5" />
          <div className="space-y-2 pt-2">
            <Skeleton className="h-3 w-full bg-primary/5" />
            <Skeleton className="h-3 w-full bg-primary/5" />
            <Skeleton className="h-3 w-3/4 bg-primary/5" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-lg border border-border/20 bg-card/20 p-4 space-y-2">
          <Skeleton className="h-3 w-24 bg-primary/10" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full bg-primary/5" />
          ))}
        </div>
        <div className="rounded-lg border border-border/20 bg-card/20 p-4 space-y-2">
          <Skeleton className="h-3 w-28 bg-primary/10" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full bg-primary/5" />
          ))}
        </div>
      </div>
    </>
  );
}

function GallerySkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="rounded-lg border border-border/20 bg-card/20 overflow-hidden">
          <Skeleton className="aspect-[3/4] w-full bg-primary/5" />
          <div className="p-2 space-y-1">
            <Skeleton className="h-2.5 w-3/4 bg-primary/10" />
            <div className="flex gap-1">
              <Skeleton className="h-2 w-8 rounded bg-primary/5" />
              <Skeleton className="h-2 w-12 rounded bg-primary/5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export { DashboardSkeleton, GridSkeleton, ListSkeleton, DetailSkeleton, GallerySkeleton };
