/**
 * Prelude + Act 1 Gallery — browseable showcase of every delivered
 * art and media asset from the Prelude/Act 1 production drop:
 * rooms, battlefields, portraits, cards, cutscene bookends,
 * cutscene videos, and music.
 *
 * Designed as an in-repo art bible / QA surface so designers
 * and playtesters can see what shipped without clicking through
 * the full 15-beat Prelude flow.
 */

import { useMemo, useState } from "react";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import {
  ACT1_BATTLEFIELDS,
  ACT1_CARDS,
  ACT1_CUTSCENES,
  ACT1_MUSIC,
  ACT1_PORTRAITS,
  ACT1_ROOMS,
  PRELUDE_CUTSCENE_BOOKENDS,
  PRELUDE_CUTSCENE_VIDEOS,
  PRELUDE_MUSIC,
  PRELUDE_ROOM_BACKDROPS,
  PRELUDE_VFX_STILLS,
  type ImagePair,
} from "@/data/preludeAct1Deliverables";

type Tab =
  | "prelude-rooms"
  | "prelude-bookends"
  | "prelude-vfx"
  | "act1-rooms"
  | "act1-battlefields"
  | "act1-portraits"
  | "act1-cards"
  | "media";

const TABS: readonly { id: Tab; label: string; count: number }[] = [
  { id: "prelude-rooms", label: "Prelude · Rooms", count: Object.keys(PRELUDE_ROOM_BACKDROPS).length },
  { id: "prelude-bookends", label: "Prelude · Cutscene Bookends", count: Object.keys(PRELUDE_CUTSCENE_BOOKENDS).length * 2 },
  { id: "prelude-vfx", label: "Prelude · VFX Stills", count: Object.keys(PRELUDE_VFX_STILLS).length },
  { id: "act1-rooms", label: "Act 1 · Rooms", count: Object.keys(ACT1_ROOMS).length },
  { id: "act1-battlefields", label: "Act 1 · Battlefields", count: Object.keys(ACT1_BATTLEFIELDS).length },
  { id: "act1-portraits", label: "Act 1 · Portraits", count: Object.keys(ACT1_PORTRAITS).length },
  { id: "act1-cards", label: "Act 1 · Cards", count: Object.keys(ACT1_CARDS).length },
  { id: "media", label: "Video + Music", count: Object.keys(PRELUDE_CUTSCENE_VIDEOS).length + Object.keys(ACT1_CUTSCENES).length + Object.keys(PRELUDE_MUSIC).length + Object.keys(ACT1_MUSIC).length },
];

function formatSlug(slug: string): string {
  return slug.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

interface ImageCardProps {
  label: string;
  image: ImagePair;
  aspect?: string;
  onOpen?: () => void;
}

function ImageCard({ label, image, aspect = "16 / 9", onOpen }: ImageCardProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        padding: 0,
        border: "1px solid color-mix(in oklch, var(--energy-primary) 18%, transparent)",
        background: "color-mix(in oklch, var(--bg-void) 75%, transparent)",
        borderRadius: 6,
        cursor: onOpen ? "pointer" : "default",
        textAlign: "left",
        color: "inherit",
        font: "inherit",
        overflow: "hidden",
      }}
    >
      <div style={{ aspectRatio: aspect, overflow: "hidden" }}>
        <ResponsiveImage
          src={image.png}
          alt={label}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
      <div
        style={{
          padding: "6px 10px 10px",
          fontFamily: "monospace",
          fontSize: 11,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "color-mix(in oklch, var(--energy-primary) 75%, transparent)",
        }}
      >
        {label}
      </div>
    </button>
  );
}

function Lightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-label={alt}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.92)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
        cursor: "zoom-out",
        padding: 32,
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
      />
    </div>
  );
}

function Grid({ minWidth = 220, children }: { minWidth?: number; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}px, 1fr))`,
        gap: 12,
      }}
    >
      {children}
    </div>
  );
}

export default function PreludeAct1GalleryPage() {
  const [activeTab, setActiveTab] = useState<Tab>("prelude-rooms");
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  const content = useMemo(() => {
    switch (activeTab) {
      case "prelude-rooms":
        return (
          <Grid minWidth={240}>
            {Object.entries(PRELUDE_ROOM_BACKDROPS).map(([slug, img]) => (
              <ImageCard
                key={slug}
                label={formatSlug(slug)}
                image={img}
                onOpen={() => setLightbox({ src: img.png, alt: slug })}
              />
            ))}
          </Grid>
        );

      case "prelude-bookends":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {Object.entries(PRELUDE_CUTSCENE_BOOKENDS).map(([beatId, bookend]) => (
              <section key={beatId}>
                <h3
                  style={{
                    fontFamily: "monospace",
                    fontSize: 12,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    opacity: 0.7,
                    margin: "0 0 6px 0",
                  }}
                >
                  {beatId.replace(/^beat_/, "Beat ").toUpperCase()}
                </h3>
                <Grid minWidth={280}>
                  <ImageCard
                    label={`${beatId} · start`}
                    image={bookend.start}
                    onOpen={() => setLightbox({ src: bookend.start.png, alt: `${beatId} start` })}
                  />
                  <ImageCard
                    label={`${beatId} · end`}
                    image={bookend.end}
                    onOpen={() => setLightbox({ src: bookend.end.png, alt: `${beatId} end` })}
                  />
                </Grid>
              </section>
            ))}
          </div>
        );

      case "prelude-vfx":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {Object.entries(PRELUDE_VFX_STILLS).map(([vfxId, stills]) => {
              const entries = Object.entries(stills) as [string, ImagePair][];
              return (
                <section key={vfxId}>
                  <h3
                    style={{
                      fontFamily: "monospace",
                      fontSize: 12,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      opacity: 0.7,
                      margin: "0 0 6px 0",
                    }}
                  >
                    {vfxId}
                  </h3>
                  <Grid minWidth={220}>
                    {entries.map(([state, img]) => (
                      <ImageCard
                        key={state}
                        label={state}
                        image={img}
                        onOpen={() => setLightbox({ src: img.png, alt: `${vfxId} ${state}` })}
                      />
                    ))}
                  </Grid>
                </section>
              );
            })}
          </div>
        );

      case "act1-rooms":
        return (
          <Grid minWidth={260}>
            {Object.entries(ACT1_ROOMS).map(([slug, img]) => (
              <ImageCard
                key={slug}
                label={formatSlug(slug)}
                image={img}
                onOpen={() => setLightbox({ src: img.png, alt: slug })}
              />
            ))}
          </Grid>
        );

      case "act1-battlefields":
        return (
          <Grid minWidth={260}>
            {Object.entries(ACT1_BATTLEFIELDS).map(([slug, img]) => (
              <ImageCard
                key={slug}
                label={formatSlug(slug)}
                image={img}
                onOpen={() => setLightbox({ src: img.png, alt: slug })}
              />
            ))}
          </Grid>
        );

      case "act1-portraits":
        return (
          <Grid minWidth={180}>
            {Object.entries(ACT1_PORTRAITS).map(([slug, img]) => (
              <ImageCard
                key={slug}
                label={formatSlug(slug)}
                image={img}
                aspect="3 / 4"
                onOpen={() => setLightbox({ src: img.png, alt: slug })}
              />
            ))}
          </Grid>
        );

      case "act1-cards":
        return (
          <Grid minWidth={160}>
            {Object.entries(ACT1_CARDS).map(([slug, img]) => (
              <ImageCard
                key={slug}
                label={formatSlug(slug)}
                image={img}
                aspect="2 / 3"
                onOpen={() => setLightbox({ src: img.png, alt: slug })}
              />
            ))}
          </Grid>
        );

      case "media":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <section>
              <h3 style={{ fontFamily: "monospace", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.7, margin: "0 0 8px" }}>
                Prelude Cutscenes
              </h3>
              <Grid minWidth={320}>
                {Object.entries(PRELUDE_CUTSCENE_VIDEOS).map(([beatId, url]) => (
                  <figure key={beatId} style={{ margin: 0 }}>
                    <video
                      src={url}
                      controls
                      preload="metadata"
                      style={{ width: "100%", aspectRatio: "16 / 9", background: "#000", borderRadius: 4 }}
                    />
                    <figcaption style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.1em", opacity: 0.7, marginTop: 4 }}>
                      {beatId}
                    </figcaption>
                  </figure>
                ))}
              </Grid>
            </section>

            <section>
              <h3 style={{ fontFamily: "monospace", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.7, margin: "0 0 8px" }}>
                Act 1 Cutscenes
              </h3>
              <Grid minWidth={320}>
                {Object.entries(ACT1_CUTSCENES).map(([id, scene]) => (
                  <figure key={id} style={{ margin: 0 }}>
                    <video
                      src={scene.video}
                      controls
                      preload="metadata"
                      poster={scene.bookends.start.png}
                      style={{ width: "100%", aspectRatio: "16 / 9", background: "#000", borderRadius: 4 }}
                    />
                    <figcaption style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.1em", opacity: 0.7, marginTop: 4 }}>
                      {scene.title}
                    </figcaption>
                  </figure>
                ))}
              </Grid>
            </section>

            <section>
              <h3 style={{ fontFamily: "monospace", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.7, margin: "0 0 8px" }}>
                Music
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {Object.entries({ ...PRELUDE_MUSIC, ...ACT1_MUSIC }).map(([id, url]) => (
                  <div
                    key={id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "220px 1fr",
                      gap: 12,
                      alignItems: "center",
                      padding: 8,
                      border: "1px solid color-mix(in oklch, var(--energy-primary) 18%, transparent)",
                      borderRadius: 4,
                    }}
                  >
                    <span style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.1em", opacity: 0.8 }}>
                      {id}
                    </span>
                    <audio controls src={url} preload="none" style={{ width: "100%" }} />
                  </div>
                ))}
              </div>
            </section>
          </div>
        );
    }
  }, [activeTab]);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 32px 80px",
        color: "var(--fg-primary)",
        background: "var(--bg-void)",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <header style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontFamily: "monospace",
            fontSize: 22,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Prelude + Act 1 · Deliverable Gallery
        </h1>
        <p style={{ opacity: 0.65, fontSize: 13, marginTop: 8, maxWidth: 780 }}>
          Every art, video, and audio file shipped in the Prelude +
          Act 1 production bundle. Click any image to open at full
          resolution.
        </p>
      </header>

      <nav
        aria-label="Gallery sections"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          marginBottom: 28,
          paddingBottom: 16,
          borderBottom: "1px solid color-mix(in oklch, var(--energy-primary) 18%, transparent)",
        }}
      >
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "6px 12px",
                fontFamily: "monospace",
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                border: `1px solid color-mix(in oklch, var(--energy-primary) ${active ? 60 : 25}%, transparent)`,
                background: active ? "color-mix(in oklch, var(--energy-primary) 16%, transparent)" : "transparent",
                color: active ? "var(--energy-primary)" : "color-mix(in oklch, var(--energy-primary) 70%, transparent)",
                cursor: "pointer",
                borderRadius: 3,
              }}
            >
              {tab.label} <span style={{ opacity: 0.55 }}>({tab.count})</span>
            </button>
          );
        })}
      </nav>

      <main>{content}</main>

      {lightbox && (
        <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
      )}
    </div>
  );
}
