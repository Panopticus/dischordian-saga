/* ═══════════════════════════════════════════════════════
   SHADER OVERLAY — GLSL post-processing via Three.js

   Renders corruption + morality shaders as a fullscreen
   overlay on top of the game UI. Uses an offscreen WebGL
   canvas composited via CSS pointer-events: none.

   Props:
     corruption — Thought Virus intensity 0-1
     morality   — alignment value -100 to +100 (normalized to -1..1)
     enabled    — master toggle

   Respects user accessibility settings:
     html.reduce-glow   — disables glow/vignette effects
     html.reduce-motion — disables animated effects (static frame)
   ═══════════════════════════════════════════════════════ */

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import corruptionFrag from "@/shaders/corruption.frag";
import moralityFrag from "@/shaders/morality.frag";
import vertexShader from "@/shaders/vertex.vert";
import { createCinematicComposer, type CinematicComposer } from "@/engine/cinematicComposer";
import { getQualityTier } from "@/lib/qualityTier";

interface ShaderOverlayProps {
  corruption: number;
  morality: number;
  enabled: boolean;
}

/** Parse a hex color string (#RRGGBB) into a normalized vec3. */
function hexToVec3(hex: string): THREE.Vector3 {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;
  return new THREE.Vector3(r, g, b);
}

/** Read the current theme glow color from the DOM. */
function getThemeGlowColor(): THREE.Vector3 {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--void-glow")
    .trim();
  // --void-glow is often rgba or hex with alpha — extract base hex
  if (raw.startsWith("#") && raw.length >= 7) {
    return hexToVec3(raw.substring(0, 7));
  }
  // Fallback: void cyan
  return new THREE.Vector3(0.2, 0.886, 0.9);
}

export default function ShaderOverlay({
  corruption,
  morality,
  enabled,
}: ShaderOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const composerRef = useRef<CinematicComposer | null>(null);
  const rafRef = useRef<number>(0);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());

  // Mutable refs for values that change frequently (avoid re-init)
  const corruptionRef = useRef(corruption);
  const moralityRef = useRef(morality);
  corruptionRef.current = corruption;
  moralityRef.current = morality;

  /** Check accessibility settings on the HTML element. */
  const getA11y = useCallback(() => {
    const html = document.documentElement;
    return {
      reduceGlow: html.classList.contains("reduce-glow"),
      reduceMotion: html.classList.contains("reduce-motion"),
    };
  }, []);

  // ── Initialize Three.js scene ──
  useEffect(() => {
    if (!enabled) return;
    // On low-power devices we skip the entire WebGL composite +
    // post-FX chain. The corruption/morality signals are already
    // visible in the dialog scanlines and per-element CSS effects,
    // so dropping the global overlay here is a genuine quality
    // compromise, not a silent no-op — but it keeps the 60fps
    // budget reachable on the devices that need the slack.
    if (getQualityTier() === "low") return;

    const container = containerRef.current;
    if (!container) return;

    // Renderer — transparent background so it overlays cleanly
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.cssText =
      "position:fixed;inset:0;pointer-events:none;z-index:9999;";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Orthographic camera for fullscreen quad
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    cameraRef.current = camera;

    // Scene with a fullscreen plane
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Create a 1x1 transparent texture as fallback
    const blankTexture = new THREE.DataTexture(
      new Uint8Array([0, 0, 0, 0]),
      1,
      1,
      THREE.RGBAFormat,
    );
    blankTexture.needsUpdate = true;

    // Combined shader material — both effects in one pass
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: buildCombinedFragment(),
      uniforms: {
        u_time: { value: 0.0 },
        u_corruption: { value: 0.0 },
        u_morality: { value: 0.0 },
        u_themeColor: { value: getThemeGlowColor() },
        u_resolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        u_texture: { value: blankTexture },
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    materialRef.current = material;

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    // Cinematic post-processing chain — bloom + chromatic + vignette
    // applied AFTER the corruption/morality pass. Strengths start at
    // zero and ramp in the RAF loop based on the same corruption /
    // morality drivers the shader uniforms already use. Players who
    // aren't in a high-intensity narrative state see no change.
    const cinematic = createCinematicComposer(renderer, scene, camera, {
      bloom: { strength: 0, radius: 0.4, threshold: 0.75 },
      chromatic: { amount: 0 },
      vignette: { strength: 0, softness: 0.6 },
    });
    composerRef.current = cinematic;

    // Handle resize
    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      material.uniforms.u_resolution.value.set(w, h);
      cinematic.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // Animation loop
    const clock = clockRef.current;
    clock.start();

    const animate = () => {
      const a11y = getA11y();

      // Update uniforms
      const elapsed = a11y.reduceMotion ? 0.0 : clock.getElapsedTime();
      material.uniforms.u_time.value = elapsed;

      // Scale down effects when accessibility settings are active
      const effCorruption = a11y.reduceGlow
        ? corruptionRef.current * 0.3
        : corruptionRef.current;
      const effMorality = a11y.reduceGlow
        ? moralityRef.current * 0.3
        : moralityRef.current;

      material.uniforms.u_corruption.value = Math.max(
        0,
        Math.min(1, effCorruption),
      );
      material.uniforms.u_morality.value = Math.max(
        -1,
        Math.min(1, effMorality / 100),
      );

      // Refresh theme color periodically (atmosphere may change)
      if (Math.floor(elapsed) % 2 === 0) {
        material.uniforms.u_themeColor.value = getThemeGlowColor();
      }

      // Drive the cinematic post-FX from the same narrative signals.
      // Bloom ramps with BOTH corruption and morality absolute value
      // so any intense narrative state lights the screen up. Chromatic
      // aberration keys to corruption (lens stress). Vignette keys to
      // morality (tunnel vision at the extremes of alignment).
      const cinematicCorruption = material.uniforms.u_corruption.value as number;
      const cinematicMorality = Math.abs(material.uniforms.u_morality.value as number);
      const driver = Math.max(cinematicCorruption, cinematicMorality);
      cinematic.setBloomStrength(
        a11y.reduceGlow ? 0 : Math.max(driver * 1.1, 0) + cinematicMorality * 0.4,
      );
      cinematic.setChromaticAmount(a11y.reduceGlow ? 0 : cinematicCorruption * 0.012);
      cinematic.setVignetteStrength(a11y.reduceGlow ? 0 : cinematicMorality * 0.35);

      // Route through the composer; it internally runs the scene
      // render pass + the three post-FX passes in order.
      cinematic.render();
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);

      cinematic.dispose();
      composerRef.current = null;

      quad.geometry.dispose();
      material.dispose();
      blankTexture.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      rendererRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
      materialRef.current = null;
    };
  }, [enabled, getA11y]);

  if (!enabled) return null;

  return <div ref={containerRef} aria-hidden="true" />;
}

/* ─── Combined fragment shader ───
   Merges corruption + morality into a single pass to avoid
   a second render target. The corruption effect runs first
   (distortion, RGB split), then morality applies color wash,
   vignette, and edge glow on top. */
function buildCombinedFragment(): string {
  return `
precision highp float;

uniform float u_time;
uniform float u_corruption;
uniform float u_morality;
uniform vec3  u_themeColor;
uniform vec2  u_resolution;
uniform sampler2D u_texture;

varying vec2 vUv;

/* ── Noise utilities ── */
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

/* ── Morality palette ── */
const vec3 MACHINE_PRIMARY   = vec3(0.86, 0.15, 0.15);
const vec3 MACHINE_SECONDARY = vec3(0.75, 0.75, 0.75);
const vec3 HUMANITY_PRIMARY  = vec3(0.13, 0.77, 0.37);
const vec3 HUMANITY_SECONDARY = vec3(0.96, 0.75, 0.14);
const vec3 BALANCED_COLOR    = vec3(0.2, 0.886, 0.9);

void main() {
  vec2 uv = vUv;
  float corr = clamp(u_corruption, 0.0, 1.0);
  float moralityVal = clamp(u_morality, -1.0, 1.0);
  float absMorality = abs(moralityVal);

  /* ════════ CORRUPTION PASS ════════ */

  /* Scanline distortion */
  float scanlineFreq = u_resolution.y * 0.8;
  float scanline = sin(uv.y * scanlineFreq + u_time * 3.0) * 0.5 + 0.5;
  scanline = pow(scanline, 8.0) * corr * 0.15;

  /* Noise displacement */
  float noiseScale = 8.0 + corr * 12.0;
  float displaceX = fbm(vec2(uv.y * noiseScale, u_time * 0.7)) - 0.5;
  float displaceY = fbm(vec2(uv.x * noiseScale, u_time * 0.5 + 100.0)) - 0.5;

  float bandNoise = hash(vec2(floor(uv.y * 40.0), floor(u_time * 4.0)));
  float glitchBand = step(1.0 - corr * 0.3, bandNoise);
  displaceX += glitchBand * (hash(vec2(uv.y, u_time)) - 0.5) * 0.5;

  float displaceMag = corr * corr * 0.03;
  vec2 displaced = uv + vec2(displaceX, displaceY) * displaceMag;

  /* RGB channel separation */
  float splitAmount = corr * corr * 0.015;
  float splitDir = sin(u_time * 1.3) * 0.5 + 0.5;
  vec2 rOff = vec2( splitAmount * splitDir,  splitAmount * (1.0 - splitDir));
  vec2 bOff = vec2(-splitAmount * (1.0 - splitDir), -splitAmount * splitDir);

  /* When no texture is bound, produce a transparent overlay.
     We sample the texture — if blank (alpha=0), the corruption
     effect still shows scanlines/grain as a subtle overlay. */
  float r = texture2D(u_texture, displaced + rOff).r;
  float g = texture2D(u_texture, displaced).g;
  float b = texture2D(u_texture, displaced + bOff).b;
  float baseAlpha = texture2D(u_texture, displaced).a;

  vec3 color = vec3(r, g, b);
  color -= vec3(scanline);

  /* Static grain */
  float grain = (hash(uv * u_resolution + u_time * 100.0) - 0.5) * corr * 0.12;
  color += vec3(grain);

  /* Corruption vignette */
  float corrVignette = 1.0 - corr * 0.4 * length(uv - 0.5);
  color *= corrVignette;

  /* ════════ MORALITY PASS ════════ */

  /* Color wash */
  vec3 washColor;
  if (moralityVal < -0.05) {
    float t = smoothstep(0.0, 1.0, -moralityVal);
    washColor = mix(BALANCED_COLOR, mix(MACHINE_PRIMARY, MACHINE_SECONDARY, 0.3), t);
  } else if (moralityVal > 0.05) {
    float t = smoothstep(0.0, 1.0, moralityVal);
    washColor = mix(BALANCED_COLOR, mix(HUMANITY_PRIMARY, HUMANITY_SECONDARY, 0.3), t);
  } else {
    washColor = BALANCED_COLOR;
  }
  washColor = mix(washColor, u_themeColor, 0.4);

  float washStrength = absMorality * absMorality * 0.08;
  color = mix(color, color * (1.0 + washColor * washStrength * 2.0), washStrength);

  /* Morality vignette */
  vec2 vigUv = uv - 0.5;
  float vigDist = length(vigUv);
  float vigBase = smoothstep(0.4, 0.9, vigDist) * 0.15;
  float vigExtreme = smoothstep(0.3, 0.85, vigDist) * absMorality * 0.25;
  float vignette = vigBase + vigExtreme;
  vec3 vigTint = mix(vec3(0.0), washColor * 0.3, absMorality);
  color = mix(color, vigTint, vignette);

  /* Edge glow */
  float pulseSpeed = 1.5 + absMorality * 1.0;
  float pulse = sin(u_time * pulseSpeed) * 0.5 + 0.5;
  pulse = mix(0.6, 1.0, pulse);
  float edgeDist = max(
    max(smoothstep(0.15, 0.0, uv.x), smoothstep(0.85, 1.0, uv.x)),
    max(smoothstep(0.15, 0.0, uv.y), smoothstep(0.85, 1.0, uv.y))
  );
  float glowStr = edgeDist * pulse * absMorality * 0.12;
  color += u_themeColor * glowStr;

  /* ════════ COMPOSITE ════════ */
  /* Output alpha: visible when either effect is active */
  float effectAlpha = max(corr * 0.6, absMorality * 0.15);
  effectAlpha = max(effectAlpha, vignette);
  effectAlpha = clamp(effectAlpha, 0.0, 0.8);

  gl_FragColor = vec4(color, effectAlpha);
}
`;
}
