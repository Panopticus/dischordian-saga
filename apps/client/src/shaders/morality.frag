/* ═══════════════════════════════════════════════════════
   MORALITY FRAGMENT SHADER — Alignment Visual Transitions

   Renders the morality spectrum as a post-processing overlay:
   - Smooth color wash between Machine (crimson/chrome) and
     Humanity (green/gold) themes
   - Vignette that intensifies at extreme alignments
   - Pulsing edge glow matching the current theme glowColor

   Uniforms:
     u_time       — elapsed time in seconds
     u_morality   — alignment value -1.0 (Machine) to +1.0 (Humanity)
     u_themeColor — current theme glowColor as vec3 (0-1 range)
     u_resolution — viewport resolution in pixels
     u_texture    — scene texture
   ═══════════════════════════════════════════════════════ */

precision highp float;

uniform float u_time;
uniform float u_morality;
uniform vec3  u_themeColor;
uniform vec2  u_resolution;
uniform sampler2D u_texture;

varying vec2 vUv;

/* ─── Machine palette: crimson/chrome ─── */
const vec3 MACHINE_PRIMARY   = vec3(0.86, 0.15, 0.15); /* #DC2626 crimson */
const vec3 MACHINE_SECONDARY = vec3(0.75, 0.75, 0.75); /* #C0C0C0 chrome */

/* ─── Humanity palette: green/gold ─── */
const vec3 HUMANITY_PRIMARY   = vec3(0.13, 0.77, 0.37); /* #22C55E green */
const vec3 HUMANITY_SECONDARY = vec3(0.96, 0.75, 0.14); /* #F5BF24 gold */

/* ─── Balanced palette: cyan ─── */
const vec3 BALANCED_COLOR = vec3(0.2, 0.886, 0.9); /* #33E2E6 void cyan */

void main() {
  vec2 uv = vUv;
  vec4 scene = texture2D(u_texture, uv);
  float morality = clamp(u_morality, -1.0, 1.0);
  float absMorality = abs(morality);

  /* ── Color wash ──
     Blend between Machine and Humanity tint colors based
     on morality. Near zero = no tint. Extremes = stronger wash.
     Uses the theme's actual glowColor for the wash. */

  /* Compute the target wash color based on alignment side */
  vec3 washColor;
  if (morality < -0.05) {
    /* Machine side: blend from balanced cyan toward crimson/chrome */
    float machineT = smoothstep(0.0, 1.0, -morality);
    washColor = mix(BALANCED_COLOR, mix(MACHINE_PRIMARY, MACHINE_SECONDARY, 0.3), machineT);
  } else if (morality > 0.05) {
    /* Humanity side: blend from balanced cyan toward green/gold */
    float humanityT = smoothstep(0.0, 1.0, morality);
    washColor = mix(BALANCED_COLOR, mix(HUMANITY_PRIMARY, HUMANITY_SECONDARY, 0.3), humanityT);
  } else {
    washColor = BALANCED_COLOR;
  }

  /* Mix in the actual theme glowColor for authenticity */
  washColor = mix(washColor, u_themeColor, 0.4);

  /* Apply wash as a subtle overlay — intensity scales with alignment extremity */
  float washStrength = absMorality * absMorality * 0.08;
  vec3 color = mix(scene.rgb, scene.rgb * (1.0 + washColor * washStrength * 2.0), washStrength);

  /* ── Vignette ──
     Darkens edges. Stronger at extreme alignments, giving a
     tunnel-vision feel as the player becomes more radical. */
  vec2 vignetteUv = uv - 0.5;
  float vignetteDist = length(vignetteUv);

  /* Base vignette is always present (subtle) */
  float vignetteBase = smoothstep(0.4, 0.9, vignetteDist) * 0.15;
  /* Extreme alignment intensifies it */
  float vignetteExtreme = smoothstep(0.3, 0.85, vignetteDist) * absMorality * 0.25;
  float vignette = vignetteBase + vignetteExtreme;

  /* Tint the vignette with the wash color for thematic consistency */
  vec3 vignetteTint = mix(vec3(0.0), washColor * 0.3, absMorality);
  color = mix(color, vignetteTint, vignette);

  /* ── Edge glow ──
     A subtle pulsing glow at the screen edges, colored by
     the current theme's glowColor. Pulse rate increases
     slightly at extreme alignments. */
  float pulseSpeed = 1.5 + absMorality * 1.0;
  float pulse = sin(u_time * pulseSpeed) * 0.5 + 0.5;
  pulse = mix(0.6, 1.0, pulse); /* Clamp pulse range so it never fully disappears */

  /* Edge glow is strongest at the border, fades toward center */
  float edgeDist = max(
    max(smoothstep(0.15, 0.0, uv.x), smoothstep(0.85, 1.0, uv.x)),
    max(smoothstep(0.15, 0.0, uv.y), smoothstep(0.85, 1.0, uv.y))
  );
  float glowStrength = edgeDist * pulse * absMorality * 0.12;

  color += u_themeColor * glowStrength;

  /* ── Final composite ── */
  gl_FragColor = vec4(color, scene.a);
}
