/* ═══════════════════════════════════════════════════════
   HOTSPOT AUTHOR — dev-only drag-to-place overlay

   Activated by ?author-hotspots=1 on /ark. Renders a
   draggable + resizable wireframe of the current room's
   hotspots on top of the live art, plus a side panel
   that exports a ready-to-paste HotspotDef TS literal.

   Zero persistence — drafts live in component state only;
   the source of truth remains the ROOM_DEFINITIONS array
   in apps/client/src/contexts/GameContext.tsx. The author
   pastes the exported snippet back into that file by hand.
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect, useRef, useCallback } from "react";
import type { HotspotDef } from "@/contexts/GameContext";

type Handle = "move" | "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

interface DragState {
  id: string;
  handle: Handle;
  startPct: { x: number; y: number };
  startBox: { x: number; y: number; width: number; height: number };
}

interface CreateState {
  id: string;
  origin: { x: number; y: number };
}

interface Props {
  hotspots: readonly HotspotDef[];
  roomId: string;
  roomName: string;
}

const HOTSPOT_TYPES: HotspotDef["type"][] = [
  "examine", "interact", "terminal", "item", "door", "npc",
];

function clamp(n: number, lo = 0, hi = 100): number {
  return Math.max(lo, Math.min(hi, n));
}

function roundPct(n: number): number {
  return Math.round(n * 10) / 10;
}

function nextDraftId(existing: readonly HotspotDef[]): string {
  let n = 1;
  while (existing.some((h) => h.id === `new-hotspot-${n}`)) n++;
  return `new-hotspot-${n}`;
}

/** Serialize a single hotspot as a TypeScript object literal matching the
 *  in-repo convention (one entry per line, trailing commas). Omits empty
 *  fields so the snippet pastes cleanly. */
function serializeHotspot(h: HotspotDef): string {
  const parts: string[] = [];
  parts.push(`id: ${JSON.stringify(h.id)}`);
  parts.push(`name: ${JSON.stringify(h.name)}`);
  parts.push(`description: ${JSON.stringify(h.description)}`);
  parts.push(`x: ${h.x}`);
  parts.push(`y: ${h.y}`);
  parts.push(`width: ${h.width}`);
  parts.push(`height: ${h.height}`);
  parts.push(`type: ${JSON.stringify(h.type)}`);
  if (h.action) parts.push(`action: ${JSON.stringify(h.action)}`);
  if (h.elaraDialog) parts.push(`elaraDialog: ${JSON.stringify(h.elaraDialog)}`);
  if (h.elaraDialogVoId) parts.push(`elaraDialogVoId: ${JSON.stringify(h.elaraDialogVoId)}`);
  if (h.elaraHoverVoId) parts.push(`elaraHoverVoId: ${JSON.stringify(h.elaraHoverVoId)}`);
  if (h.requiresItem) parts.push(`requiresItem: ${JSON.stringify(h.requiresItem)}`);
  if (h.npcId) parts.push(`npcId: ${JSON.stringify(h.npcId)}`);
  return `{ ${parts.join(", ")} },`;
}

export default function HotspotAuthor({ hotspots, roomId, roomName }: Props) {
  const [draft, setDraft] = useState<HotspotDef[]>(() => [...hotspots]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [creating, setCreating] = useState<CreateState | null>(null);
  const [exportAll, setExportAll] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string>("");
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDraft([...hotspots]);
    setSelectedId(null);
  }, [roomId, hotspots]);

  const pctFromEvent = useCallback((e: { clientX: number; clientY: number }) => {
    const el = overlayRef.current;
    if (!el) return { x: 0, y: 0 };
    const r = el.getBoundingClientRect();
    return {
      x: clamp(((e.clientX - r.left) / r.width) * 100),
      y: clamp(((e.clientY - r.top) / r.height) * 100),
    };
  }, []);

  // Empty-canvas pointer-down: start drawing a new hotspot
  const handleBackgroundPointerDown = (e: React.PointerEvent) => {
    if (e.target !== e.currentTarget) return;
    const origin = pctFromEvent(e);
    const id = nextDraftId(draft);
    setDraft((prev) => [
      ...prev,
      {
        id,
        name: id,
        description: "",
        x: roundPct(origin.x),
        y: roundPct(origin.y),
        width: 0,
        height: 0,
        type: "examine",
      },
    ]);
    setSelectedId(id);
    setCreating({ id, origin });
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  };

  const handleHotspotPointerDown = (
    e: React.PointerEvent,
    id: string,
    handle: Handle,
  ) => {
    e.stopPropagation();
    const box = draft.find((h) => h.id === id);
    if (!box) return;
    setSelectedId(id);
    setDrag({
      id,
      handle,
      startPct: pctFromEvent(e),
      startBox: { x: box.x, y: box.y, width: box.width, height: box.height },
    });
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const cur = pctFromEvent(e);
    if (creating) {
      const x = Math.min(creating.origin.x, cur.x);
      const y = Math.min(creating.origin.y, cur.y);
      const width = Math.abs(cur.x - creating.origin.x);
      const height = Math.abs(cur.y - creating.origin.y);
      setDraft((prev) =>
        prev.map((h) =>
          h.id === creating.id
            ? { ...h, x: roundPct(x), y: roundPct(y), width: roundPct(width), height: roundPct(height) }
            : h,
        ),
      );
      return;
    }
    if (drag) {
      const dx = cur.x - drag.startPct.x;
      const dy = cur.y - drag.startPct.y;
      setDraft((prev) =>
        prev.map((h) => {
          if (h.id !== drag.id) return h;
          let { x, y, width, height } = drag.startBox;
          switch (drag.handle) {
            case "move":
              x = clamp(x + dx, 0, 100 - width);
              y = clamp(y + dy, 0, 100 - height);
              break;
            case "n":  height = Math.max(0.5, height - dy); y = clamp(y + dy, 0, y + height); break;
            case "s":  height = Math.max(0.5, height + dy); break;
            case "e":  width  = Math.max(0.5, width + dx); break;
            case "w":  width  = Math.max(0.5, width - dx); x = clamp(x + dx, 0, x + width); break;
            case "ne": width  = Math.max(0.5, width + dx); height = Math.max(0.5, height - dy); y = clamp(y + dy, 0, y + height); break;
            case "nw": width  = Math.max(0.5, width - dx); x = clamp(x + dx, 0, x + width); height = Math.max(0.5, height - dy); y = clamp(y + dy, 0, y + height); break;
            case "se": width  = Math.max(0.5, width + dx); height = Math.max(0.5, height + dy); break;
            case "sw": width  = Math.max(0.5, width - dx); x = clamp(x + dx, 0, x + width); height = Math.max(0.5, height + dy); break;
          }
          return { ...h, x: roundPct(x), y: roundPct(y), width: roundPct(width), height: roundPct(height) };
        }),
      );
    }
  };

  const endDrag = () => {
    setDrag(null);
    setCreating(null);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
      if ((e.key === "Backspace" || e.key === "Delete") && selectedId) {
        const target = e.target as HTMLElement | null;
        if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT")) return;
        setDraft((prev) => prev.filter((h) => h.id !== selectedId));
        setSelectedId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId]);

  const selected = draft.find((h) => h.id === selectedId) ?? null;

  const updateSelected = (patch: Partial<HotspotDef>) => {
    if (!selectedId) return;
    setDraft((prev) =>
      prev.map((h) => (h.id === selectedId ? { ...h, ...patch } : h)),
    );
    if (patch.id && patch.id !== selectedId) setSelectedId(patch.id);
  };

  const exportText = () => {
    if (exportAll) {
      return "hotspots: [\n  " + draft.map(serializeHotspot).join("\n  ") + "\n],";
    }
    return selected ? serializeHotspot(selected) : "";
  };

  const copyExport = async () => {
    const text = exportText();
    if (!text) {
      setCopyStatus("nothing to copy");
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus(`copied ${exportAll ? `${draft.length} hotspots` : "1 hotspot"}`);
    } catch {
      setCopyStatus("clipboard blocked — copy from textarea");
    }
    window.setTimeout(() => setCopyStatus(""), 2500);
  };

  return (
    <>
      <div
        ref={overlayRef}
        className="absolute inset-0"
        style={{ zIndex: 70, cursor: drag || creating ? "crosshair" : "default" }}
        onPointerDown={handleBackgroundPointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {draft.map((h) => {
          const isSelected = h.id === selectedId;
          const isNew = h.id.startsWith("new-hotspot-");
          const stroke = isSelected ? "cyan" : isNew ? "lime" : "magenta";
          return (
            <div
              key={h.id}
              className="absolute"
              style={{
                left: `${h.x}%`,
                top: `${h.y}%`,
                width: `${h.width}%`,
                height: `${h.height}%`,
                border: `${isSelected ? 2 : 1}px solid ${stroke}`,
                background: `color-mix(in oklch, ${stroke} ${isSelected ? 14 : 6}%, transparent)`,
                cursor: "move",
              }}
              onPointerDown={(e) => handleHotspotPointerDown(e, h.id, "move")}
            >
              <span
                className="font-mono text-[9px]"
                style={{
                  position: "absolute",
                  top: -14,
                  left: 0,
                  padding: "0 4px", // void-ignore — author-mode dev overlay
                  background: "rgba(0,0,0,0.75)", // void-ignore — author-mode dev overlay
                  color: stroke,
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                }}
              >
                {h.id} ({h.x},{h.y},{h.width}×{h.height})
              </span>
              {isSelected &&
                (["n", "s", "e", "w", "ne", "nw", "se", "sw"] as Handle[]).map((handle) => (
                  <div
                    key={handle}
                    onPointerDown={(e) => handleHotspotPointerDown(e, h.id, handle)}
                    style={{
                      position: "absolute",
                      width: 10, // void-ignore — fixed-px drag handle
                      height: 10, // void-ignore — fixed-px drag handle
                      background: "cyan",
                      border: "1px solid black",
                      cursor: `${handle}-resize`,
                      ...handlePosition(handle),
                    }}
                  />
                ))}
            </div>
          );
        })}
      </div>

      {/* Floating sidebar — fixed so overflow-hidden parent doesn't clip it */}
      <aside
        className="font-mono text-[11px]"
        style={{
          position: "fixed",
          top: 80,
          right: 16,
          width: 320, // void-ignore — fixed authoring panel width
          maxHeight: "calc(100vh - 100px)",
          overflowY: "auto",
          background: "rgba(10,10,16,0.92)", // void-ignore — author-mode dev panel
          border: "1px solid cyan",
          padding: 12, // void-ignore — author-mode dev panel
          color: "white",
          zIndex: 200,
          borderRadius: 6, // void-ignore — author-mode dev panel
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <strong style={{ color: "cyan" }}>HOTSPOT AUTHOR</strong>
          <span style={{ opacity: 0.6 }}>{roomName}</span>
        </div>
        <p style={{ opacity: 0.7, marginBottom: 8 }}>
          Click-drag empty floor → new box. Click a box → select. Drag corners → resize. <kbd>Esc</kbd> deselect, <kbd>Del</kbd> remove.
        </p>

        {selected ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <Field label="id">
              <input
                value={selected.id}
                onChange={(e) => updateSelected({ id: e.target.value })}
                style={inputStyle}
              />
            </Field>
            <Field label="name">
              <input
                value={selected.name}
                onChange={(e) => updateSelected({ name: e.target.value })}
                style={inputStyle}
              />
            </Field>
            <Field label="description">
              <textarea
                value={selected.description}
                onChange={(e) => updateSelected({ description: e.target.value })}
                rows={2}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </Field>
            <Field label="type">
              <select
                value={selected.type}
                onChange={(e) => updateSelected({ type: e.target.value as HotspotDef["type"] })}
                style={inputStyle}
              >
                {HOTSPOT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="action">
              <input
                value={selected.action ?? ""}
                placeholder="/route, item-id, room-mystery:room:hs"
                onChange={(e) => updateSelected({ action: e.target.value || undefined })}
                style={inputStyle}
              />
            </Field>
            <Field label="elaraDialog">
              <textarea
                value={selected.elaraDialog ?? ""}
                onChange={(e) => updateSelected({ elaraDialog: e.target.value || undefined })}
                rows={2}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </Field>
            <Field label="elaraDialogVoId">
              <input
                value={selected.elaraDialogVoId ?? ""}
                placeholder={`room.${roomId}.hotspot.${selected.id}.elara`}
                onChange={(e) => updateSelected({ elaraDialogVoId: e.target.value || undefined })}
                style={inputStyle}
              />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 4 }}>
              <NumField label="x" value={selected.x} onChange={(v) => updateSelected({ x: v })} />
              <NumField label="y" value={selected.y} onChange={(v) => updateSelected({ y: v })} />
              <NumField label="w" value={selected.width} onChange={(v) => updateSelected({ width: v })} />
              <NumField label="h" value={selected.height} onChange={(v) => updateSelected({ height: v })} />
            </div>
          </div>
        ) : (
          <p style={{ opacity: 0.6 }}>Nothing selected. Click a box or draw a new one.</p>
        )}

        <hr style={{ margin: "12px 0", opacity: 0.2 }} />

        <label style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <input
            type="checkbox"
            checked={exportAll}
            onChange={(e) => setExportAll(e.target.checked)}
          />
          Export entire <code>hotspots:</code> array
        </label>

        <textarea
          readOnly
          value={exportText()}
          rows={6}
          style={{ ...inputStyle, fontFamily: "monospace", fontSize: 10, resize: "vertical" }}
        />

        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          <button onClick={copyExport} style={buttonStyle}>Copy TS</button>
          <button
            onClick={() => {
              setDraft([...hotspots]);
              setSelectedId(null);
            }}
            style={{ ...buttonStyle, background: "rgba(255,255,255,0.06)" }}
          >
            Reset
          </button>
        </div>
        {copyStatus && (
          <p style={{ marginTop: 6, opacity: 0.7, color: "cyan" }}>{copyStatus}</p>
        )}
        <p style={{ marginTop: 10, opacity: 0.5, fontSize: 10 }}>
          Persistence: none. Paste the snippet into <code>ROOM_DEFINITIONS</code> in <code>GameContext.tsx</code>.
        </p>
      </aside>
    </>
  );
}

function handlePosition(handle: Handle): React.CSSProperties {
  switch (handle) {
    case "n":  return { top: -5, left: "50%", marginLeft: -5 };
    case "s":  return { bottom: -5, left: "50%", marginLeft: -5 };
    case "e":  return { right: -5, top: "50%", marginTop: -5 };
    case "w":  return { left: -5, top: "50%", marginTop: -5 };
    case "ne": return { top: -5, right: -5 };
    case "nw": return { top: -5, left: -5 };
    case "se": return { bottom: -5, right: -5 };
    case "sw": return { bottom: -5, left: -5 };
    default:   return {};
  }
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.15)",
  color: "white",
  padding: "3px 5px", // void-ignore — author-mode dev panel
  fontFamily: "monospace",
  fontSize: 11,
  borderRadius: 3, // void-ignore — author-mode dev panel
};

const buttonStyle: React.CSSProperties = {
  flex: 1,
  padding: "6px 10px", // void-ignore — author-mode dev panel
  background: "cyan",
  color: "black",
  border: "none",
  cursor: "pointer",
  fontFamily: "monospace",
  fontSize: 11,
  fontWeight: 700,
  borderRadius: 3, // void-ignore — author-mode dev panel
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span style={{ opacity: 0.6, fontSize: 10 }}>{label}</span>
      {children}
    </label>
  );
}

function NumField({
  label, value, onChange,
}: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span style={{ opacity: 0.6, fontSize: 10 }}>{label}</span>
      <input
        type="number"
        step={0.5}
        value={value}
        onChange={(e) => {
          const n = parseFloat(e.target.value);
          if (!Number.isNaN(n)) onChange(roundPct(clamp(n)));
        }}
        style={inputStyle}
      />
    </label>
  );
}
