/* ═══════════════════════════════════════════════════════
   DLC CHAPTERS — index + launcher

   Lists every registered DlcChapter with its per-player
   status (Available / Locked / Complete) and a Play button
   for available chapters. Clicking Play opens the
   DlcChapterPlayer overlay.

   Backed by trpc.dlcChapters.listAll which delegates to
   apps/shared/dlc/dlcChapterRegistry.ts + the
   completion-gate. Refetches on chapter completion so
   chained chapters surface immediately when the previous
   rung clears.
   ═══════════════════════════════════════════════════════ */
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, BookOpen, Check, Lock, Play } from "lucide-react";
import type { DlcChapter, DlcChapterStatus, DlcParentSection } from "@shared/dlc";
import DlcChapterPlayer from "@/components/DlcChapterPlayer";
import { trpc } from "@/lib/trpc";
import { usePageMeta } from "@/hooks/usePageMeta";

interface ChapterEntry {
  readonly chapter: DlcChapter;
  readonly status: DlcChapterStatus;
}

export default function DlcChaptersPage() {
  usePageMeta({
    title: "DLC Chapters",
    description: "Episodic story chapters that extend the saga's spine.",
  });

  const listQuery = trpc.dlcChapters.listAll.useQuery();
  const [activeChapter, setActiveChapter] = useState<DlcChapter | null>(null);

  const groups = useMemo(() => groupBySection(listQuery.data ?? []), [listQuery.data]);

  return (
    <div className="animate-fade-in pb-12 px-4 sm:px-6">
      <div className="pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary text-xs font-mono mb-4 transition-colors"
        >
          <ArrowLeft size={12} /> BACK
        </Link>
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-primary/70" />
          <h1 className="font-display text-2xl sm:text-3xl font-black tracking-wider page-title-reveal">
            DLC CHAPTERS
          </h1>
        </div>
        <p className="mt-1 font-mono text-xs text-muted-foreground/60">
          Episodic story content that extends the saga's spine. New chapters surface as you clear prerequisites.
        </p>
      </div>

      {listQuery.isLoading && (
        <div className="mt-10 font-mono text-sm text-muted-foreground/60">Loading…</div>
      )}
      {listQuery.error && (
        <div className="mt-10 font-mono text-sm text-destructive">
          Failed to load DLC chapters. Try refreshing.
        </div>
      )}
      {listQuery.data && listQuery.data.length === 0 && (
        <div className="mt-10 font-mono text-sm text-muted-foreground/60">
          No DLC chapters registered.
        </div>
      )}

      <div className="mt-6 space-y-8">
        {groups.map((group) => (
          <section key={group.label}>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground/70 border-b border-border/30 pb-1">
              {group.label}
            </h2>
            <div className="mt-3 grid gap-2">
              {group.entries.map((entry) => (
                <ChapterRow
                  key={entry.chapter.id}
                  entry={entry}
                  onPlay={() => setActiveChapter(entry.chapter)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {activeChapter && (
        <DlcChapterPlayer
          chapter={activeChapter}
          onComplete={() => {
            setActiveChapter(null);
            void listQuery.refetch();
          }}
          onClose={() => setActiveChapter(null)}
        />
      )}
    </div>
  );
}

function ChapterRow({
  entry,
  onPlay,
}: {
  readonly entry: ChapterEntry;
  readonly onPlay: () => void;
}) {
  const { chapter, status } = entry;
  const statusLabel = status.alreadyComplete
    ? "Complete"
    : status.available
      ? "Available"
      : "Locked";
  const statusIcon = status.alreadyComplete ? (
    <Check size={12} />
  ) : status.available ? (
    <Play size={12} />
  ) : (
    <Lock size={12} />
  );
  const statusColor = status.alreadyComplete
    ? "text-primary/70 border-primary/30"
    : status.available
      ? "void-text-energy void-border-success"
      : "text-muted-foreground/60 border-border/30";

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-md border border-border/20 bg-secondary/15 px-4 py-3 hover:border-border/40 transition-colors"
    >
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-mono text-sm font-bold text-foreground/90 truncate">
              {chapter.title}
            </h3>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border ${statusColor}`}
            >
              {statusIcon} {statusLabel}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground/80 leading-relaxed">
            {chapter.synopsis}
          </p>
          {!status.available && status.missingPrerequisites.length > 0 && (
            <p className="mt-2 font-mono text-[10px] text-muted-foreground/50">
              Locked: {status.missingPrerequisites.map(formatPrereq).join(" · ")}
            </p>
          )}
        </div>
        {status.available && !status.alreadyComplete && (
          <button
            type="button"
            onClick={onPlay}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
          >
            <Play size={12} /> PLAY
          </button>
        )}
      </div>
    </motion.div>
  );
}

interface ChapterGroup {
  readonly label: string;
  readonly entries: readonly ChapterEntry[];
}

const SECTION_ORDER: readonly string[] = [
  "advocate_arc",
  "hierarchy_arc",
  "breeding_program",
  "epoch_witness",
  "act",
  "authority_trial",
  "galactic_dance",
  "endgame",
  "silence_in_heaven",
];

function groupBySection(entries: readonly ChapterEntry[]): readonly ChapterGroup[] {
  const groupMap = new Map<string, ChapterEntry[]>();
  for (const entry of entries) {
    const key = sectionKey(entry.chapter.parentSection);
    const list = groupMap.get(key) ?? [];
    list.push(entry);
    groupMap.set(key, list);
  }
  for (const list of groupMap.values()) {
    list.sort((a, b) => a.chapter.sequence - b.chapter.sequence);
  }
  const out: ChapterGroup[] = [];
  for (const kind of SECTION_ORDER) {
    for (const [key, list] of groupMap) {
      if (key.startsWith(kind)) {
        out.push({ label: sectionLabel(list[0].chapter.parentSection), entries: list });
        groupMap.delete(key);
      }
    }
  }
  // Sweep any remaining (forwards-compat for new section kinds).
  for (const [, list] of groupMap) {
    out.push({ label: sectionLabel(list[0].chapter.parentSection), entries: list });
  }
  return out;
}

function sectionKey(section: DlcParentSection): string {
  switch (section.kind) {
    case "act":
      return `act:${section.act}`;
    case "galactic_dance":
      return `galactic_dance:${section.faction}`;
    case "epoch_witness":
      return `epoch_witness:${section.epoch}`;
    case "silence_in_heaven":
      return `silence_in_heaven:${section.trackNumber}`;
    case "breeding_program":
      return `breeding_program:${section.tier}`;
    default:
      return section.kind;
  }
}

function sectionLabel(section: DlcParentSection): string {
  switch (section.kind) {
    case "act":
      return `Act ${section.act}`;
    case "authority_trial":
      return "Authority Trial";
    case "galactic_dance":
      return `Galactic Dance · ${section.faction}`;
    case "advocate_arc":
      return "The Advocate Arc";
    case "hierarchy_arc":
      return "Hierarchy of the Damned";
    case "endgame":
      return "Endgame";
    case "epoch_witness":
      return `Epoch Witness · ${prettyEpoch(section.epoch)}`;
    case "silence_in_heaven":
      return `Silence in Heaven · Track ${section.trackNumber}`;
    case "breeding_program":
      return section.tier === "crew_bene_gesserit"
        ? "Breeding Program · Crew Bene-Gesserit"
        : "Breeding Program · Mascoteers";
  }
}

function prettyEpoch(epoch: string): string {
  return epoch.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatPrereq(prereq: import("@shared/dlc").DlcPrerequisite): string {
  switch (prereq.kind) {
    case "flag":
      return `flag ${prereq.flag}`;
    case "act_completion":
      return `Act ${prereq.act}`;
    case "secret":
      return `Act ${prereq.act} secret`;
    case "dlc_chapter_completion":
      return `chapter ${prereq.chapterId}`;
    case "entitlement":
      return `entitlement ${prereq.key}`;
    case "bloodline_threshold":
      return `${prereq.classification} ×${prereq.minGenerations}`;
  }
}
