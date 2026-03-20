/* ═══════════════════════════════════════════════════════
   STRUCTURED LOGGER — Replaces raw console.log with
   structured JSON logging for production observability.
   ═══════════════════════════════════════════════════════ */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  data?: Record<string, unknown>;
  error?: {
    message: string;
    stack?: string;
  };
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const MIN_LEVEL = (process.env.LOG_LEVEL as LogLevel) || "info";

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[MIN_LEVEL];
}

function formatEntry(entry: LogEntry): string {
  if (process.env.NODE_ENV === "development") {
    // Human-readable format for development
    const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}]`;
    const ctx = entry.context ? ` [${entry.context}]` : "";
    const data = entry.data ? ` ${JSON.stringify(entry.data)}` : "";
    const err = entry.error ? ` ERROR: ${entry.error.message}` : "";
    return `${prefix}${ctx} ${entry.message}${data}${err}`;
  }
  // JSON format for production
  return JSON.stringify(entry);
}

function log(level: LogLevel, message: string, context?: string, data?: Record<string, unknown>, error?: Error) {
  if (!shouldLog(level)) return;

  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    context,
    data,
  };

  if (error) {
    entry.error = {
      message: error.message,
      stack: error.stack,
    };
  }

  const formatted = formatEntry(entry);

  switch (level) {
    case "error":
      console.error(formatted);
      break;
    case "warn":
      console.warn(formatted);
      break;
    default:
      console.log(formatted);
  }
}

export const logger = {
  debug: (message: string, ...args: any[]) => {
    const extra = args.length ? ` ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')}` : '';
    log("debug", message + extra);
  },
  info: (message: string, ...args: any[]) => {
    const extra = args.length ? ` ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')}` : '';
    log("info", message + extra);
  },
  warn: (message: string, ...args: any[]) => {
    const extra = args.length ? ` ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')}` : '';
    log("warn", message + extra);
  },
  error: (message: string, ...args: any[]) => {
    const errObj = args.find(a => a instanceof Error) as Error | undefined;
    const extra = args.filter(a => !(a instanceof Error)).map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
    log("error", message + (extra ? ` ${extra}` : ''), undefined, undefined, errObj);
  },
};
