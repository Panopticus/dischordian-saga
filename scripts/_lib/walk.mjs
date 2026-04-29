/**
 * Recursive directory walk — async generator yielding absolute paths.
 *
 * Skips hidden entries (`.DS_Store`, `.git`, etc.) and `.md`
 * sidecars by default; pass `extensions` to filter further (e.g.
 * `[".png"]` for PNG-only ingest).
 *
 * Used by every producer-drop ingest script under scripts/. Behaves
 * the same way as the previously inlined copies in
 * _aaa-convert.mjs / _pack2-convert.mjs / _cinematics-convert-and-upload.mjs /
 * _album1-slideshow-convert-and-upload.mjs.
 */
import { readdir } from "node:fs/promises";
import { join } from "node:path";

/**
 * @param {string} dir absolute root to walk
 * @param {{extensions?: string[], skipMarkdown?: boolean, skipHidden?: boolean}} [opts]
 * @yields {string} absolute path to each matching file
 */
export async function* walk(dir, opts = {}) {
  const {
    extensions,
    skipMarkdown = true,
    skipHidden = true,
  } = opts;
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (skipHidden && e.name.startsWith(".")) continue;
    if (skipMarkdown && e.name.endsWith(".md")) continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      yield* walk(full, opts);
    } else if (e.isFile()) {
      if (extensions && !extensions.some((ext) => e.name.endsWith(ext))) continue;
      yield full;
    }
  }
}
