/* ═══════════════════════════════════════════════════════
   VERTEX SHADER — Shared passthrough for post-processing
   Renders a fullscreen quad with UV coordinates.
   Used by both corruption.frag and morality.frag.
   ═══════════════════════════════════════════════════════ */

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
