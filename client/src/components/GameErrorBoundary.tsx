/**
 * GAME ERROR BOUNDARY — Wraps game pages with graceful error handling.
 * Shows a game-themed error screen instead of a white screen of death.
 * Includes error reporting hook and "return to Ark" navigation.
 */
import { Component, type ReactNode } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  /** Name of the game/page for error context */
  pageName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class GameErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to console in development, could send to Sentry in production
    console.error(`[GameError] ${this.props.pageName || "Unknown"}:`, error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex items-center justify-center min-h-[60vh] p-8">
        <div className="flex flex-col items-center w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <AlertTriangle size={32} className="text-red-400" />
          </div>

          <h2 className="font-display text-lg font-bold tracking-wider text-foreground mb-2">
            SYSTEM MALFUNCTION
          </h2>
          <p className="font-mono text-[10px] tracking-[0.3em] text-red-400/60 uppercase mb-4">
            {this.props.pageName || "MODULE"} — CRITICAL ERROR
          </p>

          <p className="font-mono text-xs text-muted-foreground leading-relaxed mb-6">
            The Ark's systems encountered an unexpected failure.
            Your progress has been preserved.
          </p>

          {this.state.error && (
            <details className="w-full mb-6">
              <summary className="font-mono text-[9px] text-muted-foreground/50 cursor-pointer hover:text-muted-foreground transition-colors">
                DIAGNOSTIC DATA
              </summary>
              <pre className="mt-2 p-3 rounded bg-muted/30 text-[9px] text-muted-foreground/60 text-left overflow-auto max-h-32 whitespace-pre-wrap">
                {this.state.error.message}
              </pre>
            </details>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border/40 bg-card/40 font-mono text-xs text-foreground hover:bg-card/60 transition-colors"
            >
              <RotateCcw size={14} /> Retry
            </button>
            <a
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-cyan-500/30 bg-cyan-500/5 font-mono text-xs text-cyan-400 hover:bg-cyan-500/10 transition-colors"
            >
              <Home size={14} /> Return to Ark
            </a>
          </div>
        </div>
      </div>
    );
  }
}
