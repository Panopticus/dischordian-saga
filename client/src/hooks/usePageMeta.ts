/* ═══════════════════════════════════════════════════════
   usePageMeta — Dynamically update document title and
   Open Graph meta tags for social sharing previews.
   ═══════════════════════════════════════════════════════ */
import { useEffect } from "react";

interface PageMeta {
  title: string;
  description?: string;
  image?: string;
  type?: string;
}

const DEFAULT_TITLE = "Loredex OS - The Dischordian Saga";
const DEFAULT_DESC = "A classified archive of characters, songs, factions, and connections spanning the complete mythology of Malkia Ukweli & the Panopticon.";
const DEFAULT_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/hero_bg_63073f61.png";

function setMetaTag(property: string, content: string) {
  let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.querySelector(`meta[name="${property}"]`) as HTMLMetaElement | null;
  }
  if (tag) {
    tag.setAttribute("content", content);
  }
}

export function usePageMeta({ title, description, image, type }: PageMeta) {
  useEffect(() => {
    const fullTitle = title ? `${title} | Loredex OS` : DEFAULT_TITLE;
    document.title = fullTitle;

    setMetaTag("og:title", fullTitle);
    setMetaTag("twitter:title", fullTitle);

    if (description) {
      setMetaTag("og:description", description);
      setMetaTag("twitter:description", description);
      setMetaTag("description", description);
    }

    if (image) {
      setMetaTag("og:image", image);
      setMetaTag("twitter:image", image);
    }

    if (type) {
      setMetaTag("og:type", type);
    }

    // Cleanup: restore defaults on unmount
    return () => {
      document.title = DEFAULT_TITLE;
      setMetaTag("og:title", DEFAULT_TITLE);
      setMetaTag("twitter:title", DEFAULT_TITLE);
      setMetaTag("og:description", DEFAULT_DESC);
      setMetaTag("twitter:description", DEFAULT_DESC);
      setMetaTag("og:image", DEFAULT_IMAGE);
      setMetaTag("twitter:image", DEFAULT_IMAGE);
      setMetaTag("og:type", "website");
    };
  }, [title, description, image, type]);
}
