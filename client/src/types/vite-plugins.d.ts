declare module 'vite-plugin-glsl' {
  import { Plugin } from 'vite';
  export default function glsl(options?: Record<string, unknown>): Plugin;
}

/* GLSL shader modules — vite-plugin-glsl resolves these as strings */
declare module '*.glsl' {
  const value: string;
  export default value;
}
declare module '*.frag' {
  const value: string;
  export default value;
}
declare module '*.vert' {
  const value: string;
  export default value;
}
