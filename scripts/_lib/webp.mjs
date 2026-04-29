/**
 * PNG → WebP conversion helper backed by sharp.
 *
 * The four producer-drop ingest scripts each ran the same
 * `sharp(p).webp({ quality: 85, effort: 4 }).toFile(out)` invocation
 * with mtime-based skip. This helper centralises both.
 *
 *   convertPngToWebp(srcPath, dstPath, opts?)
 *     Converts a single file. Returns { skipped: boolean, info }
 *     where `info` is the sharp `outputInfo` (or null if skipped).
 *
 *   convertPngsConcurrent(jobs, opts?)
 *     Pull-model worker pool. `jobs` is an array of {src, dst}.
 *     Returns { converted, skipped, failed }.
 */
import { stat } from "node:fs/promises";
import sharp from "sharp";

const DEFAULT_QUALITY = 85;
const DEFAULT_EFFORT = 4;

/**
 * Convert one PNG to WebP. Idempotent: if `dstPath` exists and is at
 * least as new as the source, no work is done.
 *
 * @param {string} srcPath  absolute path to the .png
 * @param {string} dstPath  absolute path the .webp should land at
 * @param {{quality?: number, effort?: number, force?: boolean}} [opts]
 *   `force` re-runs even when the dst is newer.
 * @returns {Promise<{skipped: boolean, info: import("sharp").OutputInfo | null}>}
 */
export async function convertPngToWebp(srcPath, dstPath, opts = {}) {
  const { quality = DEFAULT_QUALITY, effort = DEFAULT_EFFORT, force = false } = opts;
  if (!force) {
    const dst = await stat(dstPath).catch(() => null);
    const src = await stat(srcPath);
    if (dst && dst.mtimeMs >= src.mtimeMs) {
      return { skipped: true, info: null };
    }
  }
  const info = await sharp(srcPath).webp({ quality, effort }).toFile(dstPath);
  return { skipped: false, info };
}

/**
 * Convert many PNGs in parallel via a pull-model worker pool.
 *
 * @param {Array<{src: string, dst: string}>} jobs
 * @param {{quality?: number, effort?: number, concurrency?: number,
 *           force?: boolean, onProgress?: (n: number, total: number) => void}} [opts]
 * @returns {Promise<{converted: number, skipped: number, failed: number}>}
 */
export async function convertPngsConcurrent(jobs, opts = {}) {
  const { concurrency = 8, quality, effort, force, onProgress } = opts;
  let converted = 0, skipped = 0, failed = 0;
  const queue = [...jobs];
  await Promise.all(
    Array.from({ length: concurrency }, async () => {
      while (queue.length) {
        const j = queue.shift();
        if (!j) return;
        try {
          const r = await convertPngToWebp(j.src, j.dst, { quality, effort, force });
          if (r.skipped) skipped++; else converted++;
          if (onProgress) onProgress(converted + skipped + failed, jobs.length);
        } catch (e) {
          failed++;
          console.error(`FAIL convert ${j.src}: ${e.message}`);
        }
      }
    }),
  );
  return { converted, skipped, failed };
}
