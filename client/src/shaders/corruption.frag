/* ═══════════════════════════════════════════════════════
   CORRUPTION FRAGMENT SHADER — Thought Virus Visual FX

   Simulates digital corruption / Thought Virus infection:
   - Scanline distortion (horizontal lines shifting with time)
   - RGB channel separation based on corruption level
   - Noise-based pixel displacement

   Uniforms:
     u_time       — elapsed time in seconds (drives animation)
     u_corruption — corruption intensity 0.0 (clean) to 1.0 (fully corrupted)
     u_resolution — viewport resolution in pixels
     u_texture    — scene texture to distort
   ═══════════════════════════════════════════════════════ */

precision highp float;

uniform float u_time;
uniform float u_corruption;
uniform vec2  u_resolution;
uniform sampler2D u_texture;

varying vec2 vUv;

/* ─── Pseudo-random hash (no texture lookup) ─── */
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

/* ─── Value noise with smooth interpolation ─── */
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

/* ─── Fractal Brownian Motion (3 octaves) ─── */
float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 3; i++) {
    value += amplitude * noise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = vUv;
  float corr = clamp(u_corruption, 0.0, 1.0);

  /* ── Scanline distortion ──
     Horizontal lines that drift with time. Intensity scales
     with corruption. Lines are spaced by pixel rows. */
  float scanlineFreq = u_resolution.y * 0.8;
  float scanline = sin(uv.y * scanlineFreq + u_time * 3.0) * 0.5 + 0.5;
  scanline = pow(scanline, 8.0) * corr * 0.15;

  /* ── Noise-based pixel displacement ──
     Displaces UV coordinates using FBM noise. The displacement
     direction and magnitude change over time. */
  float noiseScale = 8.0 + corr * 12.0;
  float displaceX = fbm(vec2(uv.y * noiseScale, u_time * 0.7)) - 0.5;
  float displaceY = fbm(vec2(uv.x * noiseScale, u_time * 0.5 + 100.0)) - 0.5;

  /* Occasional horizontal glitch bands */
  float bandNoise = hash(vec2(floor(uv.y * 40.0), floor(u_time * 4.0)));
  float glitchBand = step(1.0 - corr * 0.3, bandNoise);
  displaceX += glitchBand * (hash(vec2(uv.y, u_time)) - 0.5) * 0.5;

  float displaceMag = corr * corr * 0.03;
  vec2 displaced = uv + vec2(displaceX, displaceY) * displaceMag;

  /* ── RGB channel separation ──
     Each color channel samples at a slightly different offset,
     creating chromatic aberration. Offset scales with corruption. */
  float splitAmount = corr * corr * 0.015;
  float splitDir = sin(u_time * 1.3) * 0.5 + 0.5;

  vec2 rOffset = vec2( splitAmount * splitDir,  splitAmount * (1.0 - splitDir));
  vec2 gOffset = vec2(0.0, 0.0);
  vec2 bOffset = vec2(-splitAmount * (1.0 - splitDir), -splitAmount * splitDir);

  float r = texture2D(u_texture, displaced + rOffset).r;
  float g = texture2D(u_texture, displaced + gOffset).g;
  float b = texture2D(u_texture, displaced + bOffset).b;
  float a = texture2D(u_texture, displaced).a;

  vec3 color = vec3(r, g, b);

  /* ── Scanline overlay ──
     Dark horizontal bands that scroll slowly. */
  color -= vec3(scanline);

  /* ── Static noise grain at high corruption ──
     Adds film-grain-style noise that intensifies. */
  float grain = (hash(uv * u_resolution + u_time * 100.0) - 0.5) * corr * 0.12;
  color += vec3(grain);

  /* ── Vignette darkening at edges during corruption ── */
  float vignette = 1.0 - corr * 0.4 * length(uv - 0.5);
  color *= vignette;

  gl_FragColor = vec4(color, a);
}
