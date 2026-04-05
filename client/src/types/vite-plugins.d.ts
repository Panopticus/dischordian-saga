declare module 'vite-plugin-glsl' {
  import { Plugin } from 'vite';
  export default function glsl(options?: Record<string, unknown>): Plugin;
}
