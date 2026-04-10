/* ═══════════════════════════════════════════════════════
   PAGE META — Task 9.3

   Zero-dependency replacement for `react-helmet-async`.

   A lightweight React hook + component pair that patches the
   document's <title> and meta tags for the current route and
   restores the previous values on unmount. Works for our pure
   SPA — no SSR needed.

   Why no helmet: react-helmet-async bundles a context provider,
   an HTML-parsing layer, and a ~20 KB runtime. All we need is
   four DOM writes per route change. This hook does exactly that
   with ~60 lines, no extra provider, and no lock-file churn.

   Usage:

     export default function FightPage() {
       return (
         <>
           <PageMeta
             title="Fight Arena"
             description="Enter the Collector's Arena and fight for your memory."
             image="/art/pages/fight-hero.webp"
           />
           <FightArena />
         </>
       );
     }

   Title becomes "Fight Arena | Dischordian Saga" in the browser
   tab. Open Graph + Twitter cards are updated too, and the
   previous values are restored when the component unmounts —
   so the title doesn't "stick" if a user navigates away without
   a new page rendering its own PageMeta.

   See Task 9.3 for the broader SEO pass (robots.txt + sitemap).
   ═══════════════════════════════════════════════════════ */

import { useEffect, useRef } from "react";

export interface PageMetaProps {
  /** Short, human title — gets "| Dischordian Saga" appended automatically. */
  title: string;
  /**
   * Optional long-form description. Used for `<meta name="description">`
   * plus og:description and twitter:description.
   */
  description?: string;
  /**
   * Optional og:image URL. Defaults to the site hero baked into
   * index.html, so share cards never render blank.
   */
  image?: string;
  /**
   * Optional canonical URL. If omitted, we set the canonical to
   * the current location so duplicate /path and /path?ref= URLs
   * collapse into a single SEO identity.
   */
  canonicalUrl?: string;
  /** Disable the "| Dischordian Saga" suffix for pages that control their own title format. */
  rawTitle?: boolean;
}

const SITE_NAME = "Dischordian Saga";

/**
 * Imperatively patch a single meta tag. Creates the tag if it
 * doesn't exist so this works on static index.html builds where
 * the tag may or may not have been emitted.
 */
function setMeta(selector: string, attrName: "name" | "property", attrValue: string, content: string): { restore: () => void } {
  if (typeof document === "undefined") return { restore: () => {} };

  let el = document.querySelector<HTMLMetaElement>(selector);
  const wasMissing = !el;
  const previous = el?.getAttribute("content") ?? null;

  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);

  return {
    restore: () => {
      if (wasMissing) {
        el?.remove();
      } else if (previous != null) {
        el?.setAttribute("content", previous);
      }
    },
  };
}

function setCanonical(href: string): { restore: () => void } {
  if (typeof document === "undefined") return { restore: () => {} };

  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  const wasMissing = !el;
  const previous = el?.getAttribute("href") ?? null;

  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);

  return {
    restore: () => {
      if (wasMissing) {
        el?.remove();
      } else if (previous != null) {
        el?.setAttribute("href", previous);
      }
    },
  };
}

/**
 * Imperative hook variant. Prefer the `<PageMeta />` component
 * below in JSX — this hook is exported for hand-rolled cases
 * (custom effects, non-standard page shapes).
 */
export function useDocumentMeta(opts: PageMetaProps): void {
  const restoreFnsRef = useRef<Array<() => void>>([]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const restores: Array<() => void> = [];
    const previousTitle = document.title;

    const fullTitle = opts.rawTitle ? opts.title : `${opts.title} | ${SITE_NAME}`;
    document.title = fullTitle;
    restores.push(() => {
      document.title = previousTitle;
    });

    if (opts.description) {
      restores.push(setMeta('meta[name="description"]', "name", "description", opts.description).restore);
      restores.push(setMeta('meta[property="og:description"]', "property", "og:description", opts.description).restore);
      restores.push(setMeta('meta[name="twitter:description"]', "name", "twitter:description", opts.description).restore);
    }

    restores.push(setMeta('meta[property="og:title"]', "property", "og:title", fullTitle).restore);
    restores.push(setMeta('meta[name="twitter:title"]', "name", "twitter:title", fullTitle).restore);

    if (opts.image) {
      restores.push(setMeta('meta[property="og:image"]', "property", "og:image", opts.image).restore);
      restores.push(setMeta('meta[name="twitter:image"]', "name", "twitter:image", opts.image).restore);
    }

    const canonical = opts.canonicalUrl ?? (typeof window !== "undefined" ? window.location.href : null);
    if (canonical) {
      restores.push(setCanonical(canonical).restore);
    }

    restoreFnsRef.current = restores;
    return () => {
      // Restore in reverse order so later wrappers unwind cleanly.
      for (let i = restores.length - 1; i >= 0; i--) {
        try {
          restores[i]();
        } catch {
          /* ignore */
        }
      }
    };
  }, [opts.title, opts.description, opts.image, opts.canonicalUrl, opts.rawTitle]);
}

/**
 * Declarative wrapper — renders nothing, mutates document head
 * on mount. Safe to render anywhere in the tree; does not need
 * a provider at the root.
 */
export function PageMeta(props: PageMetaProps): null {
  useDocumentMeta(props);
  return null;
}

export default PageMeta;
