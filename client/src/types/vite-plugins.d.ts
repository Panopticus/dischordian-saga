declare module 'vite-plugin-coffee' {
  import { Plugin } from 'vite';
  export default function coffee(options?: { jsx?: boolean }): Plugin;
}

declare module 'vite-plugin-glsl' {
  import { Plugin } from 'vite';
  export default function glsl(options?: Record<string, unknown>): Plugin;
}
