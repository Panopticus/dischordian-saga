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
  // Used by /api/health to detect whether Sentry actually initialized
  // (env vars set + SDK installed); returns undefined if not.
  export function getClient(): unknown | undefined;
  // Drains the Sentry transport; called from the SIGTERM handler.
  export function close(timeoutMs?: number): Promise<boolean>;
}

declare module "@opentelemetry/sdk-node" {
  // Loaded via variable-specifier dynamic import in server/otel.ts.
  // Real package only installs when OTEL_ENABLED=1 in production.
  export class NodeSDK {
    constructor(config: Record<string, unknown>);
    start(): void;
    shutdown(): Promise<void>;
  }
}

declare module "@opentelemetry/api" {
  export interface Span {
    setStatus(status: { code: number; message?: string }): void;
    recordException(error: Error): void;
    setAttribute(key: string, value: string | number | boolean): void;
    end(): void;
  }
  export interface Tracer {
    startSpan(
      name: string,
      options?: { attributes?: Record<string, string | number | boolean> },
    ): Span;
  }
  export const SpanStatusCode: { OK: number; ERROR: number; UNSET: number };
  export const trace: {
    getTracer(name: string): Tracer;
  };
}

declare module "@opentelemetry/exporter-trace-otlp-http" {
  export class OTLPTraceExporter {
    constructor(options: { url: string });
  }
}

declare module "@opentelemetry/resources" {
  export class Resource {
    constructor(attributes: Record<string, string>);
  }
}

declare module "@opentelemetry/semantic-conventions" {
  export const SemanticResourceAttributes: {
    SERVICE_NAME: string;
    DEPLOYMENT_ENVIRONMENT: string;
  };
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
