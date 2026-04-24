/* ═══════════════════════════════════════════════════════
   CINEMATIC COMPOSER — Three.js EffectComposer factory

   Builds a post-processing chain that any Three.js mount in
   the app can opt into: {scene render → bloom → chromatic
   aberration → vignette → screen}. All three passes are
   intensity-driven by runtime uniforms so consumers can
   ramp them up and down without rebuilding the composer.

   Default strengths are tuned for the existing narrative
   drivers:
     - cryo-wake: bloom 0.0 → 1.2 as consciousness returns
     - Architect chess arena: bloom ~0.8, chromatic ~0.012
     - Soulbound tier ceremony: bloom ~1.6, vignette ~0.4
     - Thought Virus load > 0.5: chromatic ~0.02
     - morality |score| > 0.5: vignette 0.3

   Consumers hold the returned composer and call
   `composer.render()` in their RAF loop instead of
   `renderer.render(scene, camera)`. resize() / dispose()
   forwarded for lifecycle parity.
   ═══════════════════════════════════════════════════════ */
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

export interface CinematicPostFxOptions {
  /** Bloom: emissive-highlight glow expansion. Strength 0 disables the pass entirely. */
  bloom?: { strength?: number; radius?: number; threshold?: number } | false;
  /** Chromatic aberration: directional RGB split around screen center. */
  chromatic?: { amount?: number } | false;
  /** Vignette: corner darkening. */
  vignette?: { strength?: number; softness?: number } | false;
}

export interface CinematicComposer {
  composer: EffectComposer;
  /** Inline uniform setters. Safe to call every frame — they mutate in place. */
  setBloomStrength: (v: number) => void;
  setChromaticAmount: (v: number) => void;
  setVignetteStrength: (v: number) => void;
  /** Mirror the renderer's lifecycle. */
  setSize: (w: number, h: number) => void;
  dispose: () => void;
  render: () => void;
}

/* ─── Chromatic Aberration pass — custom shader ─── */
const chromaticShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    u_amount: { value: 0.004 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float u_amount;
    varying vec2 vUv;
    void main() {
      // Offset direction radiates from screen center so the split
      // grows toward the edges — reads as "the camera lens is
      // stressing" rather than a flat color shift.
      vec2 centered = vUv - 0.5;
      vec2 dir = centered * u_amount;
      float r = texture2D(tDiffuse, vUv + dir).r;
      float g = texture2D(tDiffuse, vUv).g;
      float b = texture2D(tDiffuse, vUv - dir).b;
      float a = texture2D(tDiffuse, vUv).a;
      gl_FragColor = vec4(r, g, b, a);
    }
  `,
};

/* ─── Vignette pass — custom shader ─── */
const vignetteShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    u_strength: { value: 0.25 },
    u_softness: { value: 0.6 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float u_strength;
    uniform float u_softness;
    varying vec2 vUv;
    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      float d = distance(vUv, vec2(0.5));
      // smoothstep gives a softer falloff than mix(1, 0, d) would;
      // u_softness nudges the inflection closer to / further from
      // the edges so callers can get "tunnel vision" vs. "cinema bar".
      float v = smoothstep(0.8 - u_softness * 0.4, 0.4 - u_softness * 0.2, d);
      color.rgb *= mix(1.0, v, u_strength);
      gl_FragColor = color;
    }
  `,
};

export function createCinematicComposer(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
  options: CinematicPostFxOptions = {},
): CinematicComposer {
  const size = renderer.getSize(new THREE.Vector2());

  const composer = new EffectComposer(renderer);
  composer.setSize(size.x, size.y);

  // 1. Base scene render into the composer's read target.
  composer.addPass(new RenderPass(scene, camera));

  // 2. Bloom — UnrealBloomPass handles the blur chain internally.
  // Set strength=0 to effectively disable at runtime; the pass
  // still exists so setBloomStrength() can ramp it back up later.
  const bloomCfg = options.bloom === false ? { strength: 0 } : (options.bloom ?? {});
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(size.x, size.y),
    bloomCfg.strength ?? 0.6,
    bloomCfg.radius ?? 0.4,
    bloomCfg.threshold ?? 0.85,
  );
  composer.addPass(bloomPass);

  // 3. Chromatic aberration — custom ShaderPass.
  const chromaticCfg = options.chromatic === false ? { amount: 0 } : (options.chromatic ?? {});
  const chromaticPass = new ShaderPass(chromaticShader);
  chromaticPass.uniforms.u_amount.value = chromaticCfg.amount ?? 0.003;
  composer.addPass(chromaticPass);

  // 4. Vignette — custom ShaderPass.
  const vignetteCfg = options.vignette === false ? { strength: 0 } : (options.vignette ?? {});
  const vignettePass = new ShaderPass(vignetteShader);
  vignettePass.uniforms.u_strength.value = vignetteCfg.strength ?? 0.2;
  vignettePass.uniforms.u_softness.value = vignetteCfg.softness ?? 0.6;
  composer.addPass(vignettePass);

  // 5. Output pass — applies tone mapping + sRGB conversion once
  // at the end of the chain. Without it the bloom-burned output
  // reads slightly washed out on modern displays.
  composer.addPass(new OutputPass());

  return {
    composer,
    setBloomStrength: (v: number) => {
      bloomPass.strength = Math.max(0, v);
    },
    setChromaticAmount: (v: number) => {
      chromaticPass.uniforms.u_amount.value = Math.max(0, v);
    },
    setVignetteStrength: (v: number) => {
      vignettePass.uniforms.u_strength.value = Math.max(0, v);
    },
    setSize: (w: number, h: number) => {
      composer.setSize(w, h);
      bloomPass.resolution.set(w, h);
    },
    dispose: () => {
      // EffectComposer doesn't expose a top-level dispose, but
      // each pass owns render targets we need to drop. Walk the
      // chain and dispose whatever has a dispose() method.
      for (const pass of composer.passes) {
        const anyPass = pass as any;
        if (typeof anyPass.dispose === "function") anyPass.dispose();
      }
    },
    render: () => {
      composer.render();
    },
  };
}
