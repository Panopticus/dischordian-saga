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
      "@": path.resolve(ROOT, "client", "src"),
      "@shared": path.resolve(ROOT, "shared"),
      "@assets": path.resolve(ROOT, "attached_assets"),
      "@duelyst": path.resolve(ROOT, "client", "src", "game", "duelyst-engine"),
      "app": path.resolve(ROOT, "client", "src", "game", "duelyst-engine"),
    },
  },
  envDir: path.resolve(ROOT),
  root: path.resolve(ROOT, "client"),
  publicDir: path.resolve(ROOT, "client", "public"),
  build: {
    outDir: path.resolve(ROOT, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    host: true,
  },
});
