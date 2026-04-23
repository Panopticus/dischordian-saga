# Example: Meshy v5 — image-to-3D rigged GLB

Convert a 4-frame turnaround sheet into a rigged 3D mesh with PBR
texture set, attached to a Mixamo-compatible humanoid skeleton at the
correct sockets.

## When to use this recipe

- Asset rows in `p0-tranche.csv` with `tool = meshy-v5` and `_id`
  ending in `_glb` (or `_bust_glb`, `_body_glb`).
- Output is a `.glb` file at the row's `output_path`, plus a 2048²
  PBR texture bundle (4096² for chest + weapon-primary slots).

## Inputs you need ready

1. **All four turnaround frames** for the character/asset, listed in
   the row's `dependencies` column. Front + 3-quarter left + side
   left + back, each at 2048×2048 with transparent background.
2. **The conversion prompt block** from the art brief at the cited
   §section. For player base meshes: §1C.{1-4} + §1C.6 (shared rig
   requirements). For Inventor's Suits gear: §3.2 (per-piece
   conversion template) + any per-set overrides at §3.5.
3. **UV template reference**: `apps/client/public/rigs/player/UV_TEMPLATE.png`
   (cross-species UV layout for gear-fit consistency).
4. **Triangle budget**: defined per asset type — see §0.4 (≤85k tris
   for protagonist busts, ≤12k for standard gear slots, ≤25k for
   weapon-primary / back).

## Step-by-step

1. Open Meshy v5 (web UI or API).
2. Mode: "Image to 3D" → "Multi-view input."
3. Upload the four turnaround frames. Tag each with its angle (front,
   3q, side, back) so Meshy aligns the viewpoint reconstruction.
4. Paste the conversion prompt block from the cited §section into
   Meshy's "additional instructions" field.
5. Set output config:
   - Format: GLB
   - Topology: Quad (Meshy's "art" preset; converts to tris on export)
   - Triangle target: per the §0.4 budget
   - Texture resolution: 2048² (or 4096² for chest/weapon)
   - Skeleton: Mixamo-compatible humanoid (auto-rigging on)
6. Render. Meshy returns:
   - `model.glb` (the mesh + rig + bundled textures)
   - Separate texture files (`albedo.png`, `normal.png`, `roughness.png`,
     `metallic.png`, `emissive.png`)
7. Validate the output:
   - Open in glTF Viewer (https://gltf-viewer.donmccurdy.com/) or
     similar
   - Check silhouette matches the front turnaround at the same
     framing
   - Check face proportions match (eye spacing, jaw shape, etc.)
   - Verify the auto-rig has the expected joints — if missing
     fingers, neck twist, or eyes, manually add via Blender before
     proceeding
   - Spin the model 360° — any back-of-head texture seam? Crown
     z-fighting? Re-bake or re-render the back turnaround with a
     stronger "back of head" reference

## Substance 3D Sampler post-bake

After Meshy's initial conversion, run the GLB through Substance 3D
Sampler to upgrade the texture set:

1. Open Substance 3D Sampler.
2. Import the GLB.
3. Use Sampler's photo-to-PBR pipeline with the front turnaround as
   color reference. This produces:
   - Higher-quality `albedo` (color-corrected to match the source
     image)
   - Generated `height` map for displacement detail (especially
     useful for fabric weave + plate-armor relief)
   - Better `normal` map than Meshy's auto-bake
4. For emissive regions specifically (glow seams, rune work, vent
   glow, eye emissives, fracture light) — hand-author the emissive
   channel separately from base color. The brief's per-character
   shader uniform spec (e.g. §1A.6 for Elara) lists which emissive
   channels each rig needs.
5. Export as `.ktx2` (WebGPU-friendly) for the runtime pipeline.

## Per-set overrides (Inventor's Suits)

Five suit sets in §3.5 require special-handling beyond generic
conversion:

- `null-weaver-mantle` — anti-light inverse-lighting custom shader
- `hybrid-vein-panoply` — 4.2s subdermal vein-pulse animation
- `clockwork-exoframe` — gears as separate mesh children for
  independent rotation transforms (2 shoulder, 2 elbow, 2 knee)
- `the-first-chassis` — intentional weathering/rust beyond the 2D
  source
- `void-sextant-ensemble` — chest panel uses procedural starfield
  shader (preserve as separate mesh region)

For these, finish the standard Meshy → Substance pipeline FIRST, then
apply the per-set override as a final pass.

## Cost / time

- Meshy v5 conversion: ~3-5 minutes per asset (multi-view input is
  slower than single-image but produces better topology)
- Substance 3D re-bake: ~10-15 minutes manual or ~3 minutes if
  scripted via Sampler's automation API
- Per-set overrides: +20-30 minutes each for the 5 special suits

A standard gear slot GLB (no overrides): ~20 minutes total. A
protagonist bust with full PBR + 15 viseme morph targets: ~2 hours
including viseme baking.

The 1,080-piece Inventor's Suits batch in §3.6 estimates "50/day
through Meshy v5 API" — that's a parallel-batched script run, not
manual one-at-a-time.
