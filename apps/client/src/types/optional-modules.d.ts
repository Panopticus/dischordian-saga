// Ambient module declarations for optional runtime dependencies that are
// loaded via dynamic import or guarded `try/catch`. Keeping them as type
// shims rather than adding them to package.json avoids pulling their weight
// into the main bundle when the underlying feature isn't enabled.

declare module "html2canvas" {
  interface Html2CanvasOptions {
    backgroundColor?: string | null;
    scale?: number;
    useCORS?: boolean;
    logging?: boolean;
    [key: string]: unknown;
  }
  function html2canvas(
    element: HTMLElement,
    options?: Html2CanvasOptions,
  ): Promise<HTMLCanvasElement>;
  export default html2canvas;
}

declare module "@sentry/react" {
  import type { ComponentType, ReactNode } from "react";
  // Minimal shim — real client install happens in production builds where
  // the opt-in telemetry feature flag is on. At type-check time we expose
  // just enough surface for the wrapper in client/src/lib/sentry.ts.
  export function init(options: Record<string, unknown>): void;
  export function captureException(error: unknown): void;
  export function captureMessage(message: string): void;
  export function setUser(user: Record<string, unknown> | null): void;
  export function browserTracingIntegration(options?: Record<string, unknown>): unknown;
  export function replayIntegration(options?: Record<string, unknown>): unknown;
  export const ErrorBoundary: ComponentType<{
    fallback?: ReactNode | ((props: { error: Error; resetError: () => void }) => ReactNode);
    children?: ReactNode;
    onError?: (error: Error) => void;
  }>;
}

declare module "@sentry/node" {
  // Mirrors @sentry/react shim; used by server/sentry.ts via a guarded
  // dynamic import. Real package installs in production only.
  export function init(options: Record<string, unknown>): void;
  export function captureException(
    error: unknown,
    context?: { extra?: Record<string, unknown> },
  ): void;
  export function captureMessage(
    message: string,
    level?: "fatal" | "error" | "warning" | "info" | "debug",
  ): void;
}

declare module "@aws-sdk/client-s3" {
  // Voice-over generation scripts upload to S3 via a guarded
  // dynamic import. The SDK is a dev-only convenience — the scripts
  // don't ship in the runtime bundle — so we shim the surface here
  // rather than pulling the full @aws-sdk/* weight into package.json.
  export class S3Client {
    constructor(config: Record<string, unknown>);
    send(command: unknown): Promise<unknown>;
  }
  export class PutObjectCommand {
    constructor(input: Record<string, unknown>);
  }
  export class HeadObjectCommand {
    constructor(input: Record<string, unknown>);
  }
}
