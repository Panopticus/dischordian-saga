/**
 * Sprite Proxy — Server-side image processing for fight game sprites
 * 
 * Fetches sprite images from the CDN, resizes them to canvas-appropriate
 * dimensions, removes white backgrounds using sharp, and serves them as
 * proper RGBA PNGs. This eliminates all CORS issues and ensures sprites
 * always have transparent backgrounds.
 * 
 * Optimization: Source sprites are 1792×2400 (~5MB) but the canvas only
 * displays them at 180×280. We resize to 360×480 (2× display) before
 * processing, cutting output from ~6MB to ~100KB per sprite.
 * 
 * Endpoint: GET /api/sprite-proxy?url=<encoded-cdn-url>
 */
import type { Request, Response, Express } from "express";
import sharp from "sharp";

// In-memory cache for processed sprites (URL -> PNG buffer)
const spriteCache = new Map<string, { buffer: Buffer; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60 * 4; // 4 hours
const MAX_CACHE_SIZE = 200; // Max cached sprites

// Target dimensions: 2× the canvas display size (180×280) for crisp rendering
const TARGET_WIDTH = 360;
const TARGET_HEIGHT = 480;

// Allowed CDN domain for security
const ALLOWED_DOMAINS = ["d2xsxph8kpxj0f.cloudfront.net"];

function isAllowedUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ALLOWED_DOMAINS.some(d => parsed.hostname === d);
  } catch {
    return false;
  }
}

async function processSprite(imageBuffer: Buffer): Promise<Buffer> {
  // Step 1: Resize to target dimensions first (massive performance gain)
  const resized = await sharp(imageBuffer)
    .resize(TARGET_WIDTH, TARGET_HEIGHT, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data: rawBuffer, info } = resized;
  const w = info.width;
  const h = info.height;

  // Step 2: Process pixels — remove white/near-white backgrounds
  // Use flood-fill from edges to only remove connected white regions
  const pixels = new Uint8Array(rawBuffer);
  const visited = new Uint8Array(w * h);
  const toRemove = new Uint8Array(w * h);

  const WHITE_THRESHOLD = 225; // RGB all above this = "white-ish"
  const ALPHA_THRESHOLD = 200; // Only process pixels that are mostly opaque

  function isWhitish(idx: number): boolean {
    const off = idx * 4;
    return (
      pixels[off] > WHITE_THRESHOLD &&
      pixels[off + 1] > WHITE_THRESHOLD &&
      pixels[off + 2] > WHITE_THRESHOLD &&
      pixels[off + 3] > ALPHA_THRESHOLD
    );
  }

  // BFS flood fill from all edge pixels
  const queue: number[] = [];

  // Seed with all edge pixels that are white-ish
  for (let x = 0; x < w; x++) {
    const topIdx = x;
    const bottomIdx = (h - 1) * w + x;
    if (isWhitish(topIdx)) { queue.push(topIdx); visited[topIdx] = 1; toRemove[topIdx] = 1; }
    if (isWhitish(bottomIdx)) { queue.push(bottomIdx); visited[bottomIdx] = 1; toRemove[bottomIdx] = 1; }
  }
  for (let y = 1; y < h - 1; y++) {
    const leftIdx = y * w;
    const rightIdx = y * w + (w - 1);
    if (isWhitish(leftIdx)) { queue.push(leftIdx); visited[leftIdx] = 1; toRemove[leftIdx] = 1; }
    if (isWhitish(rightIdx)) { queue.push(rightIdx); visited[rightIdx] = 1; toRemove[rightIdx] = 1; }
  }

  // BFS: expand from edges through connected white pixels
  let head = 0;
  while (head < queue.length) {
    const idx = queue[head++];
    const x = idx % w;
    const y = (idx - x) / w;

    const neighbors = [
      y > 0 ? idx - w : -1,           // up
      y < h - 1 ? idx + w : -1,       // down
      x > 0 ? idx - 1 : -1,           // left
      x < w - 1 ? idx + 1 : -1,       // right
    ];

    for (const nIdx of neighbors) {
      if (nIdx < 0 || visited[nIdx]) continue;
      visited[nIdx] = 1;
      if (isWhitish(nIdx)) {
        toRemove[nIdx] = 1;
        queue.push(nIdx);
      }
    }
  }

  // Apply transparency to marked pixels
  for (let i = 0; i < w * h; i++) {
    if (toRemove[i]) {
      pixels[i * 4 + 3] = 0; // Set alpha to 0
    }
  }

  // Also handle near-white edge pixels with soft alpha for anti-aliasing
  for (let i = 0; i < w * h; i++) {
    if (toRemove[i]) continue;
    const x = i % w;
    const y = (i - x) / w;
    const off = i * 4;
    const r = pixels[off], g = pixels[off + 1], b = pixels[off + 2], a = pixels[off + 3];
    
    // Skip already transparent or dark pixels
    if (a < 50 || (r < 200 && g < 200 && b < 200)) continue;

    // Check if any neighbor was removed (edge of character)
    let hasRemovedNeighbor = false;
    if (x > 0 && toRemove[i - 1]) hasRemovedNeighbor = true;
    if (x < w - 1 && toRemove[i + 1]) hasRemovedNeighbor = true;
    if (y > 0 && toRemove[i - w]) hasRemovedNeighbor = true;
    if (y < h - 1 && toRemove[i + w]) hasRemovedNeighbor = true;

    if (hasRemovedNeighbor) {
      const whiteness = Math.min(r, g, b);
      if (whiteness > 200) {
        const fadeAmount = (whiteness - 200) / 55;
        pixels[off + 3] = Math.round(a * (1 - fadeAmount * 0.7));
      }
    }
  }

  // Step 3: Reconstruct the image with sharp
  return sharp(Buffer.from(pixels.buffer), {
    raw: { width: w, height: h, channels: 4 },
  })
    .png({ compressionLevel: 6 })
    .toBuffer();
}

export function registerSpriteProxy(app: Express) {
  app.get("/api/sprite-proxy", async (req: Request, res: Response) => {
    const url = req.query.url as string;
    
    if (!url || !isAllowedUrl(url)) {
      return res.status(400).json({ error: "Invalid or disallowed URL" });
    }

    // Check cache
    const cached = spriteCache.get(url);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      res.set({
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
        "Access-Control-Allow-Origin": "*",
      });
      return res.send(cached.buffer);
    }

    try {
      // Fetch the image from CDN
      const response = await fetch(url);
      if (!response.ok) {
        return res.status(response.status).json({ error: `CDN returned ${response.status}` });
      }

      const arrayBuffer = await response.arrayBuffer();
      const imageBuffer = Buffer.from(arrayBuffer);

      // Always process through our pipeline (resize + bg removal)
      const resultBuffer = await processSprite(imageBuffer);

      // Cache the result (evict oldest if full)
      if (spriteCache.size >= MAX_CACHE_SIZE) {
        const oldestKey = spriteCache.keys().next().value;
        if (oldestKey) spriteCache.delete(oldestKey);
      }
      spriteCache.set(url, { buffer: resultBuffer, timestamp: Date.now() });

      res.set({
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
        "Access-Control-Allow-Origin": "*",
      });
      res.send(resultBuffer);
    } catch (err: any) {
      console.error(`[SpriteProxy] Error processing ${url}: ${err.message}`);
      
      // Fallback: try to serve the original image
      try {
        const fallbackResponse = await fetch(url);
        if (fallbackResponse.ok) {
          const fallbackBuffer = Buffer.from(await fallbackResponse.arrayBuffer());
          res.set({
            "Content-Type": "image/png",
            "Cache-Control": "public, max-age=3600",
          });
          return res.send(fallbackBuffer);
        }
      } catch { /* ignore fallback errors */ }
      
      res.status(500).json({ error: "Failed to process sprite" });
    }
  });
}
