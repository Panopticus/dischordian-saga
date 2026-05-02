/**
 * Source-scan tests for the D2 Vision 3 + 4 video-frame extension.
 *
 * SongSlideshow.tsx now renders a `<video>` element in place of the
 * still `<img>` when a frame declares `videoSrc`, pauses the audio
 * bed for the flash, and falls back to the image on video-load
 * failure. Full integration coverage requires a browser DOM + a real
 * MP4 codec; the source-scan checks below anchor the contract so a
 * future refactor can't silently regress it.
 *
 * The shared-side per-frame `videoUrl` field is type-asserted in
 * dreamerVisions.test.ts (Vision 3 declares one); the adapter
 * pass-through (`SlideshowPlayerRoot.tsx`) is asserted here.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const songSlideshowSrc = fs.readFileSync(
  path.resolve(__dirname, "SongSlideshow.tsx"),
  "utf-8",
);

const slideshowPlayerRootSrc = fs.readFileSync(
  path.resolve(__dirname, "SlideshowPlayerRoot.tsx"),
  "utf-8",
);

describe("SongSlideshow.tsx — video-frame renderer extension (D2 Vision 3 + 4)", () => {
  it("declares an optional videoSrc on the SlideshowFrame interface", () => {
    expect(songSlideshowSrc).toMatch(/videoSrc\??:\s*string/);
  });

  it("renders <video> in place of <img> when the current frame has videoSrc", () => {
    expect(songSlideshowSrc).toContain("isVideoFrame");
    expect(songSlideshowSrc).toMatch(/<video[\s\S]*?\bsrc=\{frame\.videoSrc\}/);
    expect(songSlideshowSrc).toMatch(/playsInline/);
  });

  it("falls back to the image on video-load failure", () => {
    expect(songSlideshowSrc).toContain("videoFailedAtIndex");
    expect(songSlideshowSrc).toMatch(/onError=\{[\s\S]*?setVideoFailedAtIndex/);
  });

  it("advances on the <video> element's onEnded (not the wall-clock timer)", () => {
    expect(songSlideshowSrc).toMatch(/onEnded=\{advance\}/);
  });

  it("pauses the song bed while a video frame plays — 'song stretches over the flash'", () => {
    expect(songSlideshowSrc).toMatch(/if\s*\(\s*isVideoFrame\s*\)\s*\{[\s\S]*?audio\.pause\(\)/);
  });

  it("resumes the song bed on the next image frame", () => {
    expect(songSlideshowSrc).toMatch(/audio\.play\(\)/);
  });

  it("skips the wall-clock auto-advance timer on video frames", () => {
    expect(songSlideshowSrc).toMatch(/if\s*\(\s*isVideoFrame\s*\)\s*return/);
  });
});

describe("SlideshowPlayerRoot.tsx — adapter passes videoUrl through to videoSrc", () => {
  it("maps SongSlideshowDef.frames[].videoUrl to SongSlideshow.frames[].videoSrc", () => {
    expect(slideshowPlayerRootSrc).toMatch(
      /videoSrc:\s*f\.videoUrl/,
    );
  });
});
