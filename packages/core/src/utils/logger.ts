/**
 * Structured logging utility for open-autocoder
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context: Record<string, unknown> | undefined;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

let currentLogLevel: LogLevel = "info";

/**
 * Set the minimum log level
 */
export function setLogLevel(level: LogLevel): void {
  currentLogLevel = level;
}

/**
 * Get current log level
 */
export function getLogLevel(): LogLevel {
  return currentLogLevel;
}

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLogLevel];
}

function formatLogEntry(entry: LogEntry): string {
  const contextStr = entry.context
    ? ` ${JSON.stringify(entry.context)}`
    : "";
  return `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}${contextStr}`;
}

function log(
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>
): void {
  if (!shouldLog(level)) {
    return;
  }

  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    context,
  };

  const formatted = formatLogEntry(entry);

  switch (level) {
    case "debug":
    case "info":
      console.log(formatted);
      break;
    case "warn":
      console.warn(formatted);
      break;
    case "error":
      console.error(formatted);
      break;
  }
}

/**
 * Logger object with methods for each log level
 */
export const logger = {
  debug(message: string, context?: Record<string, unknown>): void {
    log("debug", message, context);
  },

  info(message: string, context?: Record<string, unknown>): void {
    log("info", message, context);
  },

  warn(message: string, context?: Record<string, unknown>): void {
    log("warn", message, context);
  },

  error(message: string, context?: Record<string, unknown>): void {
    log("error", message, context);
  },

  /**
   * Log an error object with context
   */
  logError(error: Error, context?: Record<string, unknown>): void {
    const errorContext: Record<string, unknown> = {
      ...context,
      errorName: error.name,
      errorMessage: error.message,
      stack: error.stack,
    };

    // Check for OpenAutocoderError-specific properties
    if ("code" in error) {
      errorContext["errorCode"] = (error as { code: string }).code;
    }
    if ("suggestedAction" in error) {
      errorContext["suggestedAction"] = (error as { suggestedAction: string })
        .suggestedAction;
    }

    this.error(`Error: ${error.message}`, errorContext);
  },
};
