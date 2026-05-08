import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";

const plugins = [
  react(),
  tailwindcss(),
  jsxLocPlugin(),
  glsl(),
];

// Use process.cwd() — import.meta.dirname is undefined when this file
// gets pulled into esbuild's server bundle (dist/index.js).
const ROOT = import.meta.dirname ?? process.cwd();

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(ROOT, "apps", "client", "src"),
      "@shared": path.resolve(ROOT, "apps", "shared"),
    },
  },
  envDir: path.resolve(ROOT),
  root: path.resolve(ROOT, "apps", "client"),
  publicDir: path.resolve(ROOT, "apps", "client", "public"),
  build: {
    outDir: path.resolve(ROOT, "dist/public"),
    emptyOutDir: true,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // M5 (mobile bundle split) — keep heavy vendors out of the
        // initial bundle so the title screen renders before they
        // download. Game-engine vendors (pixi/three/chess) only
        // load when a duel/match/chess board mounts; charts and
        // motion only when a page that needs them mounts. The
        // route-level `lazy(() => import(...))` splits in App.tsx
        // are the per-page side of the same split.
        manualChunks: {
          // Core React runtime stays in vendor-react so the title
          // screen + every lazy chunk shares one copy.
          "vendor-react": ["react", "react-dom"],
          // Data layer — used everywhere but doesn't grow with new
          // routes. Splitting keeps the initial bundle stable as
          // the app adds features.
          "vendor-tanstack": ["@tanstack/react-query"],
          "vendor-trpc": [
            "@trpc/client",
            "@trpc/react-query",
            "@trpc/server",
          ],
          // Game-engine vendors — heaviest in the tree, route-gated
          // (Pixi → duel board, Three → parallax/shader/3D scenes,
          // chess → chess board only).
          "vendor-pixi": ["pixi.js"],
          "vendor-three": ["three"],
          "vendor-chess": ["chess.js"],
          // UI primitives. The full Radix set ships across many
          // pages; bundling them as one chunk means the user
          // downloads it once on first interactive page and
          // never again. Replaces the prior partial list.
          "vendor-radix": [
            "@radix-ui/react-accordion",
            "@radix-ui/react-alert-dialog",
            "@radix-ui/react-aspect-ratio",
            "@radix-ui/react-avatar",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-collapsible",
            "@radix-ui/react-context-menu",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-hover-card",
            "@radix-ui/react-label",
            "@radix-ui/react-menubar",
            "@radix-ui/react-navigation-menu",
            "@radix-ui/react-popover",
            "@radix-ui/react-progress",
            "@radix-ui/react-radio-group",
            "@radix-ui/react-scroll-area",
            "@radix-ui/react-select",
            "@radix-ui/react-separator",
            "@radix-ui/react-slider",
            "@radix-ui/react-slot",
            "@radix-ui/react-switch",
            "@radix-ui/react-tabs",
            "@radix-ui/react-toggle",
            "@radix-ui/react-toggle-group",
            "@radix-ui/react-tooltip",
          ],
          "vendor-recharts": ["recharts"],
          "vendor-framer": ["framer-motion"],
          // Validation + form vendors — used widely; splitting
          // keeps them off the title-screen critical path.
          "vendor-zod": ["zod"],
          "vendor-forms": ["react-hook-form"],
          // Date utility — used by leaderboards / cohort views.
          "vendor-date-fns": ["date-fns"],
          // Icon set — large enough to merit its own chunk so the
          // tree-shaker doesn't have to do it.
          "vendor-lucide": ["lucide-react"],
        },
      },
    },
  },
  server: {
    host: true,
  },
});
