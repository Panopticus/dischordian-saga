/* ═══════════════════════════════════════════════════════
   SPRITE PREVIEW — Visual test page for character sprites
   Shows all animation states for a selected character
   ═══════════════════════════════════════════════════════ */
import { useEffect, useRef, useState, useCallback } from "react";
import { generateCharacterSprite, type CharacterSprite, type AnimState, SPRITE_W, SPRITE_H } from "@/game/SpriteGenerator";
import { STARTER_FIGHTERS, UNLOCKABLE_FIGHTERS } from "@/game/gameData";
import { Link } from "wouter";
import { ArrowLeft, Play, Pause } from "lucide-react";

const ALL_FIGHTERS = [...STARTER_FIGHTERS, ...UNLOCKABLE_FIGHTERS];

const ANIM_STATES: AnimState[] = ["idle", "walk", "punch", "kick", "block", "special", "hit", "victory", "ko", "crouch"];

export default function SpritePreview() {
  const [selectedId, setSelectedId] = useState("architect");
  const [sprite, setSprite] = useState<CharacterSprite | null>(null);
  const [playing, setPlaying] = useState(true);
  const [frameIndices, setFrameIndices] = useState<Record<AnimState, number>>({} as any);
  const canvasRefs = useRef<Record<string, HTMLCanvasElement | null>>({});
  const animRef = useRef<number>(0);
  const tickRef = useRef(0);

  // Generate sprite when character changes
  useEffect(() => {
    const s = generateCharacterSprite(selectedId);
    setSprite(s);
    const initial: Record<string, number> = {};
    ANIM_STATES.forEach(st => initial[st] = 0);
    setFrameIndices(initial as any);
  }, [selectedId]);

  // Animation loop
  useEffect(() => {
    if (!sprite || !playing) return;

    const tick = () => {
      tickRef.current++;
      setFrameIndices(prev => {
        const next = { ...prev };
        for (const state of ANIM_STATES) {
          const frames = sprite.animations[state];
          if (!frames || frames.length === 0) continue;
          const currentFrame = frames[prev[state] || 0];
          if (currentFrame && tickRef.current % currentFrame.duration === 0) {
            next[state] = ((prev[state] || 0) + 1) % frames.length;
          }
        }
        return next;
      });
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [sprite, playing]);

  // Draw frames to canvases
  useEffect(() => {
    if (!sprite) return;
    for (const state of ANIM_STATES) {
      const canvas = canvasRefs.current[state];
      if (!canvas) continue;
      const ctx = canvas.getContext("2d");
      if (!ctx) continue;

      const frameIdx = frameIndices[state] || 0;
      const frames = sprite.animations[state];
      if (!frames || frames.length === 0) continue;
      const frame = frames[frameIdx];
      if (!frame) continue;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(frame.canvas, 0, 0);
    }
    // Also draw the large idle preview
    const largeCanvas = canvasRefs.current["idle-large"];
    if (largeCanvas) {
      const lctx = largeCanvas.getContext("2d");
      if (lctx) {
        const idleFrames = sprite.animations.idle;
        const idleIdx = frameIndices.idle || 0;
        if (idleFrames && idleFrames[idleIdx]) {
          lctx.clearRect(0, 0, largeCanvas.width, largeCanvas.height);
          lctx.imageSmoothingEnabled = false;
          lctx.drawImage(idleFrames[idleIdx].canvas, 0, 0, SPRITE_W, SPRITE_H, 0, 0, SPRITE_W * 2, SPRITE_H * 2);
        }
      }
    }
  }, [sprite, frameIndices]);

  const setCanvasRef = useCallback((state: string) => (el: HTMLCanvasElement | null) => {
    canvasRefs.current[state] = el;
  }, []);

  const fighter = ALL_FIGHTERS.find(f => f.id === selectedId);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/fight" className="p-2 rounded-md bg-secondary hover:bg-secondary/80 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="font-display text-xl font-bold tracking-wider">SPRITE PREVIEW</h1>
          <button
            onClick={() => setPlaying(!playing)}
            className="ml-auto p-2 rounded-md bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
          >
            {playing ? <Pause size={16} /> : <Play size={16} />}
          </button>
        </div>

        {/* Character selector */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
          {ALL_FIGHTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedId(f.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border whitespace-nowrap text-xs font-mono transition-all ${
                selectedId === f.id
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border/30 bg-card/30 text-muted-foreground hover:border-primary/30"
              }`}
            >
              {f.image && (
                <img src={f.image} alt="" className="w-6 h-6 rounded-full object-cover" />
              )}
              {f.name}
            </button>
          ))}
        </div>

        {/* Character info */}
        {fighter && (
          <div className="flex items-center gap-4 mb-6 p-4 rounded-lg border border-border/30 bg-card/30">
            {fighter.image && (
              <img src={fighter.image} alt="" className="w-16 h-16 rounded-lg object-cover" />
            )}
            <div>
              <h2 className="font-display text-lg font-bold" style={{ color: fighter.color }}>{fighter.name}</h2>
              <p className="font-mono text-xs text-muted-foreground">{fighter.title}</p>
              <div className="flex gap-4 mt-1 font-mono text-[10px] text-muted-foreground/60">
                <span>HP: {fighter.hp}</span>
                <span>ATK: {fighter.attack}</span>
                <span>DEF: {fighter.defense}</span>
                <span>SPD: {fighter.speed}</span>
              </div>
            </div>
          </div>
        )}

        {/* Animation states grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {ANIM_STATES.map(state => (
            <div key={state} className="border border-border/30 rounded-lg bg-card/20 overflow-hidden">
              <div className="px-3 py-1.5 bg-black/30 border-b border-border/10">
                <span className="font-mono text-[9px] tracking-wider text-primary/70">{state.toUpperCase()}</span>
                <span className="font-mono text-[8px] text-muted-foreground/40 ml-2">
                  F{(frameIndices[state] || 0) + 1}/{sprite?.animations[state]?.length || 0}
                </span>
              </div>
              <div className="flex items-center justify-center p-2 bg-[oklch(0.08_0.01_280)]" style={{ minHeight: 200 }}>
                <canvas
                  ref={setCanvasRef(state)}
                  width={SPRITE_W}
                  height={SPRITE_H}
                  style={{ width: SPRITE_W, height: SPRITE_H, imageRendering: "pixelated" }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Large preview */}
        <div className="mt-6 border border-border/30 rounded-lg bg-card/20 overflow-hidden">
          <div className="px-4 py-2 bg-black/30 border-b border-border/10">
            <span className="font-mono text-xs tracking-wider text-primary/70">IDLE — FULL SIZE</span>
          </div>
          <div className="flex items-center justify-center p-8 bg-[oklch(0.08_0.01_280)]">
            <canvas
              ref={setCanvasRef("idle-large")}
              width={SPRITE_W * 2}
              height={SPRITE_H * 2}
              style={{ width: SPRITE_W * 2, height: SPRITE_H * 2, imageRendering: "pixelated" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
