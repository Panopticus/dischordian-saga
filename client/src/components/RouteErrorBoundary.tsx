/* ═══════════════════════════════════════════════════════
   ROUTE ERROR BOUNDARY — Per-route error catching
   Shows a themed error state without crashing the whole app
   ═══════════════════════════════════════════════════════ */
import { Component, ReactNode } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Link } from "wouter";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class RouteErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[RouteErrorBoundary]", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
          <div className="max-w-lg w-full text-center space-y-5">
            {/* Glitch icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg border border-destructive/30 bg-destructive/5">
              <AlertTriangle size={28} className="text-destructive" />
            </div>

            <div>
              <h2 className="font-display text-lg font-bold tracking-wider text-foreground mb-1">
                {this.props.fallbackTitle || "SYSTEM MALFUNCTION"}
              </h2>
              <p className="font-mono text-xs text-muted-foreground tracking-wider">
                ERROR // MODULE FAILED TO LOAD
              </p>
            </div>

            {/* Error detail */}
            <div className="rounded-lg border border-border/30 bg-card/30 p-4 text-left">
              <p className="font-mono text-xs text-destructive/80 break-all">
                {this.state.error?.message || "Unknown error"}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary/10 border border-primary/30 text-primary text-sm font-mono hover:bg-primary/20 transition-colors"
              >
                <RotateCcw size={14} />
                RETRY
              </button>
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-secondary border border-border/50 text-foreground text-sm font-mono hover:bg-secondary/80 transition-colors"
              >
                <Home size={14} />
                HOME
              </Link>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default RouteErrorBoundary;
