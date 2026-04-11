/* ═══════════════════════════════════════════════════════
   PARALLAX DEPTH FRAGMENT SHADER
   Offsets pixels based on depth map + mouse/gyro position.
   Creates a pseudo-3D effect from a single 2D image.
   ═══════════════════════════════════════════════════════ */

uniform sampler2D u_colorMap;
uniform sampler2D u_depthMap;
uniform vec2 u_mouse;        // Normalized mouse offset (-1 to 1)
uniform float u_intensity;   // Parallax strength
uniform float u_time;
uniform vec2 u_resolution;

varying vec2 vUv;

void main() {
  // Sample depth (white = near, black = far)
  float depth = texture2D(u_depthMap, vUv).r;

  // Parallax offset: near objects shift more than far
  vec2 offset = u_mouse * depth * u_intensity;

  // Subtle ambient drift for life even without mouse input
  float drift = sin(u_time * 0.15) * 0.002;
  offset += vec2(drift, drift * 0.7);

  // Sample color with parallax offset
  vec2 uv = vUv + offset;
  // Clamp to prevent edge artifacts
  uv = clamp(uv, vec2(0.001), vec2(0.999));

  vec4 color = texture2D(u_colorMap, uv);

  // Subtle vignette
  float vignette = 1.0 - smoothstep(0.4, 1.4, length(vUv - 0.5) * 2.0);
  color.rgb *= mix(0.6, 1.0, vignette);

  gl_FragColor = color;
}
