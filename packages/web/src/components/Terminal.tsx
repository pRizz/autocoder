/**
 * Terminal component for displaying real-time agent output
 *
 * Displays log messages received via WebSocket with auto-scroll,
 * timestamp formatting, and log level styling.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useWebSocket, type WebSocketMessage } from "../hooks/useWebSocket";

export interface LogEntry {
  id: string;
  timestamp: string;
  level: "debug" | "info" | "warn" | "error";
  message: string;
  agentIndex?: number;
  featureId?: number;
}

export interface TerminalProps {
  projectName: string;
  maxLogEntries?: number;
}

// Determine WebSocket URL based on current environment
function getWebSocketUrl(): string {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const host = window.location.host;
  return `${protocol}//${host}/ws`;
}

// Generate unique ID for log entries
function generateLogId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Get CSS classes for log level
function getLevelStyles(level: LogEntry["level"]): string {
  switch (level) {
    case "debug":
      return "text-gray-500";
    case "info":
      return "text-blue-400";
    case "warn":
      return "text-yellow-400";
    case "error":
      return "text-red-400";
    default:
      return "text-gray-400";
  }
}

// Format timestamp for display
function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
  });
}

export function Terminal({
  projectName,
  maxLogEntries = 1000,
}: TerminalProps): JSX.Element {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [autoScroll, setAutoScroll] = useState(true);
  const [filter, setFilter] = useState<LogEntry["level"] | "all">("all");
  const terminalRef = useRef<HTMLDivElement>(null);

  // Handle incoming WebSocket messages
  const handleMessage = useCallback(
    (message: WebSocketMessage) => {
      // Handle log messages from the server
      if (message.type === "log" || message.type === "agent_output") {
        const data = message.data as {
          level?: string;
          message?: string;
          text?: string;
          agentIndex?: number;
          featureId?: number;
        };

        const newEntry: LogEntry = {
          id: generateLogId(),
          timestamp: message.timestamp ?? new Date().toISOString(),
          level: (data.level as LogEntry["level"]) ?? "info",
          message: data.message ?? data.text ?? JSON.stringify(data),
          agentIndex: data.agentIndex,
          featureId: data.featureId,
        };

        setLogs((prevLogs) => {
          const updatedLogs = [...prevLogs, newEntry];
          // Keep only the last maxLogEntries
          if (updatedLogs.length > maxLogEntries) {
            return updatedLogs.slice(-maxLogEntries);
          }
          return updatedLogs;
        });
      }

      // Handle connection established message
      if (message.type === "connection_established") {
        const newEntry: LogEntry = {
          id: generateLogId(),
          timestamp: message.timestamp ?? new Date().toISOString(),
          level: "info",
          message: "[Terminal] Connected to server",
        };
        setLogs((prevLogs) => [...prevLogs, newEntry]);
      }

      // Handle feature updates
      if (message.type === "feature_update") {
        const data = message.data as {
          featureId?: number;
          status?: string;
          featureName?: string;
        };
        const newEntry: LogEntry = {
          id: generateLogId(),
          timestamp: message.timestamp ?? new Date().toISOString(),
          level: "info",
          message: `[Feature ${data.featureId}] ${data.featureName ?? ""} - ${data.status ?? "updated"}`,
          featureId: data.featureId,
        };
        setLogs((prevLogs) => [...prevLogs, newEntry]);
      }

      // Handle agent status updates
      if (message.type === "agent_status" || message.type === "agent_update") {
        const data = message.data as {
          status?: string;
          agentIndex?: number;
          thinking?: string;
          working?: string;
        };
        const newEntry: LogEntry = {
          id: generateLogId(),
          timestamp: message.timestamp ?? new Date().toISOString(),
          level: "info",
          message: `[Agent ${data.agentIndex ?? 0}] ${data.status ?? data.thinking ?? data.working ?? "status update"}`,
          agentIndex: data.agentIndex,
        };
        setLogs((prevLogs) => [...prevLogs, newEntry]);
      }

      // Handle progress updates
      if (message.type === "progress") {
        const data = message.data as {
          passing?: number;
          total?: number;
          percentage?: number;
        };
        const newEntry: LogEntry = {
          id: generateLogId(),
          timestamp: message.timestamp ?? new Date().toISOString(),
          level: "info",
          message: `[Progress] ${data.passing ?? 0}/${data.total ?? 0} features passing (${data.percentage?.toFixed(1) ?? 0}%)`,
        };
        setLogs((prevLogs) => [...prevLogs, newEntry]);
      }
    },
    [maxLogEntries]
  );

  const { status, reconnectAttempts } = useWebSocket({
    url: getWebSocketUrl(),
    reconnectInterval: 3000,
    maxReconnectAttempts: 10,
    onMessage: handleMessage,
  });

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (autoScroll && terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  // Handle manual scroll to disable auto-scroll
  const handleScroll = useCallback(() => {
    if (terminalRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = terminalRef.current;
      // If user scrolls up, disable auto-scroll
      // If scrolled to bottom (within 50px), enable auto-scroll
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setAutoScroll(isAtBottom);
    }
  }, []);

  // Filter logs by level
  const filteredLogs =
    filter === "all" ? logs : logs.filter((log) => log.level === filter);

  // Clear logs
  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  // Generate test logs at different levels (for testing/demo purposes)
  const generateTestLogs = useCallback(() => {
    const testLogs: LogEntry[] = [
      {
        id: generateLogId(),
        timestamp: new Date().toISOString(),
        level: "debug",
        message: "[Test] Debug level log - verbose debugging information",
        agentIndex: 0,
      },
      {
        id: generateLogId(),
        timestamp: new Date().toISOString(),
        level: "debug",
        message: "[Test] Another debug log - variable value: x=42",
      },
      {
        id: generateLogId(),
        timestamp: new Date().toISOString(),
        level: "info",
        message: "[Test] Info level log - normal operation message",
        agentIndex: 1,
        featureId: 202,
      },
      {
        id: generateLogId(),
        timestamp: new Date().toISOString(),
        level: "info",
        message: "[Test] Processing feature request...",
      },
      {
        id: generateLogId(),
        timestamp: new Date().toISOString(),
        level: "warn",
        message: "[Test] Warning level log - potential issue detected",
        featureId: 150,
      },
      {
        id: generateLogId(),
        timestamp: new Date().toISOString(),
        level: "warn",
        message: "[Test] API response slow - 2500ms response time",
      },
      {
        id: generateLogId(),
        timestamp: new Date().toISOString(),
        level: "error",
        message: "[Test] Error level log - something went wrong!",
        agentIndex: 2,
      },
      {
        id: generateLogId(),
        timestamp: new Date().toISOString(),
        level: "error",
        message: "[Test] Failed to connect to database: ECONNREFUSED",
      },
    ];
    setLogs((prevLogs) => [...prevLogs, ...testLogs]);
  }, []);

  // Add initial message
  useEffect(() => {
    setLogs([
      {
        id: generateLogId(),
        timestamp: new Date().toISOString(),
        level: "info",
        message: `[Terminal] Initialized for project: ${projectName}`,
      },
    ]);
  }, [projectName]);

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-3">
          {/* Terminal icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-green-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="4 17 10 11 4 5" />
            <line x1="12" y1="19" x2="20" y2="19" />
          </svg>
          <span className="text-sm font-medium text-gray-300">
            Agent Output
          </span>
          <span className="text-xs text-gray-500">
            ({filteredLogs.length} lines)
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Connection status */}
          <div className="flex items-center gap-1.5">
            <div
              className={`h-2 w-2 rounded-full ${
                status === "connected"
                  ? "bg-green-400"
                  : status === "reconnecting"
                    ? "bg-yellow-400 animate-pulse"
                    : "bg-red-400"
              }`}
            />
            <span className="text-xs text-gray-400">
              {status === "connected"
                ? "Connected"
                : status === "reconnecting"
                  ? `Reconnecting (${reconnectAttempts})`
                  : "Disconnected"}
            </span>
          </div>

          {/* Filter dropdown */}
          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value as LogEntry["level"] | "all")
            }
            className="text-xs bg-gray-700 text-gray-300 rounded px-2 py-1 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
            aria-label="Filter by log level"
          >
            <option value="all">All Levels</option>
            <option value="debug">Debug</option>
            <option value="info">Info</option>
            <option value="warn">Warning</option>
            <option value="error">Error</option>
          </select>

          {/* Auto-scroll toggle */}
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              autoScroll
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-400 hover:bg-gray-600"
            }`}
            title={autoScroll ? "Auto-scroll enabled" : "Auto-scroll disabled"}
            aria-label={
              autoScroll ? "Disable auto-scroll" : "Enable auto-scroll"
            }
          >
            {autoScroll ? "Auto" : "Manual"}
          </button>

          {/* Clear button */}
          <button
            onClick={clearLogs}
            className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-gray-300 transition-colors"
            title="Clear terminal"
            aria-label="Clear terminal"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <div
        ref={terminalRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto font-mono text-sm p-4 space-y-0.5"
        role="log"
        aria-live="polite"
        aria-label="Agent output log"
      >
        {filteredLogs.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            <p>No log entries yet.</p>
            <p className="text-xs mt-2">
              Start agents to see real-time output here.
            </p>
          </div>
        ) : (
          filteredLogs.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start gap-2 py-0.5 hover:bg-gray-800/50"
            >
              {/* Timestamp */}
              <span className="text-gray-600 select-none flex-shrink-0">
                [{formatTimestamp(entry.timestamp)}]
              </span>

              {/* Log level badge */}
              <span
                className={`flex-shrink-0 w-14 text-right ${getLevelStyles(entry.level)}`}
              >
                [{entry.level.toUpperCase()}]
              </span>

              {/* Agent/Feature indicator */}
              {(entry.agentIndex !== undefined ||
                entry.featureId !== undefined) && (
                <span className="text-purple-400 flex-shrink-0">
                  {entry.agentIndex !== undefined && `[A${entry.agentIndex}]`}
                  {entry.featureId !== undefined && `[F${entry.featureId}]`}
                </span>
              )}

              {/* Message */}
              <span className="text-gray-300 break-all">{entry.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
