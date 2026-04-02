import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";
import coffeePlugin from "vite-plugin-coffee";
import glsl from "vite-plugin-glsl";

const plugins = [
  react(),
  tailwindcss(),
  jsxLocPlugin(),
  coffeePlugin({ jsx: false }),
  glsl(),
];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      "@duelyst": path.resolve(import.meta.dirname, "client", "src", "game", "duelyst-engine"),
      "app": path.resolve(import.meta.dirname, "client", "src", "game", "duelyst-engine"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    host: true,
  },
});
