import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import { createGunzip } from "zlib";
import { extract } from "tar";

/**
 * Duelyst Game Resources Bootstrap
 * 
 * Downloads and extracts game resources from CDN on first boot.
 * Resources are stored permanently on CDN and auto-restore after any sandbox reset.
 * 
 * CDN Archives:
 * - duelyst-resources.tar.gz (553MB) - sprites, audio, maps, shaders, UI assets
 * - duelyst-localization.tar.gz (232KB) - localization/translation files
 */

const RESOURCES_CDN_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/duelyst-resources.tar_3b56ec86.gz";
const LOCALIZATION_CDN_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/duelyst-localization-final.tar_23296821.gz";

const RESOURCES_DIR = "/home/ubuntu/webdev-static-assets/duelyst-classic/resources";
const LOCALIZATION_DIR = "/home/ubuntu/duelyst/app/localization";

// Marker file to indicate successful extraction
const RESOURCES_MARKER = "/home/ubuntu/webdev-static-assets/duelyst-classic/.resources-ready";
const LOCALIZATION_MARKER = "/home/ubuntu/duelyst/app/.localization-ready";

async function downloadAndExtract(url: string, extractDir: string, markerFile: string, label: string): Promise<boolean> {
  try {
    // Check if already extracted
    if (fs.existsSync(markerFile)) {
      console.log(`[Duelyst Bootstrap] ${label} already present, skipping download.`);
      return true;
    }

    console.log(`[Duelyst Bootstrap] Downloading ${label} from CDN...`);
    
    // Ensure parent directory exists
    const parentDir = path.dirname(extractDir);
    fs.mkdirSync(parentDir, { recursive: true });
    fs.mkdirSync(extractDir, { recursive: true });

    const response = await fetch(url);
    if (!response.ok || !response.body) {
      console.error(`[Duelyst Bootstrap] Failed to download ${label}: ${response.status} ${response.statusText}`);
      return false;
    }

    const contentLength = response.headers.get("content-length");
    const totalMB = contentLength ? (parseInt(contentLength) / 1024 / 1024).toFixed(1) : "unknown";
    console.log(`[Duelyst Bootstrap] Downloading ${totalMB}MB for ${label}...`);

    // Download to temp file first
    const tempFile = path.join(parentDir, `.${label.replace(/\s/g, "_")}_download.tar.gz`);
    const fileStream = fs.createWriteStream(tempFile);
    
    // @ts-ignore - Node 18+ ReadableStream is compatible
    const reader = response.body.getReader();
    let downloadedBytes = 0;
    let lastLogTime = Date.now();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      fileStream.write(value);
      downloadedBytes += value.length;
      
      // Log progress every 30 seconds
      if (Date.now() - lastLogTime > 30000) {
        const downloadedMB = (downloadedBytes / 1024 / 1024).toFixed(1);
        console.log(`[Duelyst Bootstrap] ${label}: ${downloadedMB}MB / ${totalMB}MB downloaded...`);
        lastLogTime = Date.now();
      }
    }
    
    fileStream.end();
    await new Promise<void>((resolve) => fileStream.on("finish", resolve));
    
    const downloadedMB = (downloadedBytes / 1024 / 1024).toFixed(1);
    console.log(`[Duelyst Bootstrap] ${label}: ${downloadedMB}MB downloaded. Extracting...`);

    // Extract tar.gz
    await extract({
      file: tempFile,
      cwd: parentDir,
    });

    // Clean up temp file
    fs.unlinkSync(tempFile);

    // Write marker file
    fs.writeFileSync(markerFile, JSON.stringify({
      extractedAt: new Date().toISOString(),
      sourceUrl: url,
      sizeBytes: downloadedBytes,
    }));

    console.log(`[Duelyst Bootstrap] ${label} extracted successfully!`);
    return true;
  } catch (err) {
    console.error(`[Duelyst Bootstrap] Error bootstrapping ${label}:`, err);
    return false;
  }
}

/**
 * Bootstrap Duelyst game resources.
 * Call this on server startup - it will skip if resources are already present.
 * Downloads run in the background and don't block server startup.
 */
export async function bootstrapDuelystResources(): Promise<void> {
  const resourcesReady = fs.existsSync(RESOURCES_MARKER);
  const localizationReady = fs.existsSync(LOCALIZATION_MARKER);

  if (resourcesReady && localizationReady) {
    console.log("[Duelyst Bootstrap] All resources present. No download needed.");
    return;
  }

  console.log("[Duelyst Bootstrap] Starting resource bootstrap (runs in background)...");

  // Run downloads in parallel but don't block server startup
  const downloadPromise = (async () => {
    const results = await Promise.allSettled([
      !resourcesReady
        ? downloadAndExtract(
            RESOURCES_CDN_URL,
            RESOURCES_DIR,
            RESOURCES_MARKER,
            "Game Resources"
          )
        : Promise.resolve(true),
      !localizationReady
        ? downloadAndExtract(
            LOCALIZATION_CDN_URL,
            LOCALIZATION_DIR,
            LOCALIZATION_MARKER,
            "Localization"
          )
        : Promise.resolve(true),
    ]);

    const allSuccess = results.every(
      (r) => r.status === "fulfilled" && r.value === true
    );
    
    if (allSuccess) {
      console.log("[Duelyst Bootstrap] All resources bootstrapped successfully!");
    } else {
      console.warn("[Duelyst Bootstrap] Some resources failed to bootstrap. Game may have missing assets.");
    }
  })();

  // Don't await - let it run in background
  downloadPromise.catch((err) => {
    console.error("[Duelyst Bootstrap] Background download failed:", err);
  });
}
