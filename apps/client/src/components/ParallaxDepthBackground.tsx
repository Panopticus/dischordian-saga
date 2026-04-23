/* ═══════════════════════════════════════════════════════
   PARALLAX DEPTH BACKGROUND — Pseudo-3D from depth map

   Uses a color image + disparity/depth map to create a
   parallax effect driven by mouse movement (desktop) or
   device orientation (mobile). Renders via Three.js WebGL
   with a custom fragment shader.

   Props:
     colorUrl   — URL to the color image
     depthUrl   — URL to the depth/disparity map
     intensity  — Parallax strength (default 0.03)
     opacity    — Background opacity (default 0.25)
     className  — Additional CSS classes
   ═══════════════════════════════════════════════════════ */

import { useEffect, useRef } from "react";
import * as THREE from "three";
import vertexShader from "@/shaders/vertex.vert";
import parallaxFrag from "@/shaders/parallaxDepth.frag";
import { getMotionIntensity } from "@/engine/motionIntensity";

interface ParallaxDepthBackgroundProps {
  colorUrl: string;
  depthUrl: string;
  intensity?: number;
  opacity?: number;
  className?: string;
}

export default function ParallaxDepthBackground({
  colorUrl,
  depthUrl,
  intensity = 0.03,
  opacity = 0.25,
  className = "",
}: ParallaxDepthBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Respect reduce-motion
    const reduceMotion = document.documentElement.classList.contains("reduce-motion") ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: false,
      antialias: false,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Camera + Scene
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const scene = new THREE.Scene();

    // Load textures
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");

    const colorTexture = loader.load(colorUrl);
    const depthTexture = loader.load(depthUrl);

    // Ensure proper filtering
    for (const tex of [colorTexture, depthTexture]) {
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
    }

    // Shader material
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: parallaxFrag,
      uniforms: {
        u_colorMap: { value: colorTexture },
        u_depthMap: { value: depthTexture },
        u_mouse: { value: new THREE.Vector2(0, 0) },
        u_intensity: { value: intensity },
        u_time: { value: 0 },
        u_resolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
      },
      depthTest: false,
      depthWrite: false,
    });
    materialRef.current = material;

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    // Mouse tracking
    const onMouseMove = (e: MouseEvent) => {
      // Normalize to -1..1 from center
      targetRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      targetRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    // Device orientation (mobile gyroscope)
    const onDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        targetRef.current.x = Math.max(-1, Math.min(1, (e.gamma / 45)));
        targetRef.current.y = Math.max(-1, Math.min(1, ((e.beta - 45) / 45)));
      }
    };

    if (!reduceMotion) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      window.addEventListener("deviceorientation", onDeviceOrientation, { passive: true });
    }

    // Resize
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      material.uniforms.u_resolution.value.set(w, h);
    };
    window.addEventListener("resize", onResize);

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);

      // Smooth lerp toward target
      const lerp = 0.04;
      mouseRef.current.x += (targetRef.current.x - mouseRef.current.x) * lerp;
      mouseRef.current.y += (targetRef.current.y - mouseRef.current.y) * lerp;

      // Motion intensity scales both the parallax offset and the
      // ambient sin() drift the shader adds — slider at 0 = completely
      // still image (matches reduceMotion behavior).
      const intensityScale = reduceMotion ? 0 : getMotionIntensity();
      material.uniforms.u_mouse.value.set(
        mouseRef.current.x * intensityScale,
        mouseRef.current.y * intensityScale,
      );
      material.uniforms.u_time.value =
        reduceMotion || intensityScale === 0 ? 0 : clock.getElapsedTime() * intensityScale;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("deviceorientation", onDeviceOrientation);
      window.removeEventListener("resize", onResize);

      // Dispose
      colorTexture.dispose();
      depthTexture.dispose();
      material.dispose();
      quad.geometry.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      rendererRef.current = null;
      materialRef.current = null;
    };
  }, [colorUrl, depthUrl, intensity]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 z-0 overflow-hidden ${className}`}
      style={{ opacity, pointerEvents: "none" }}
    />
  );
}
