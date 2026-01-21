/**
 * Footer component with status bar
 *
 * Displays WebSocket connection indicator and version number
 * at the bottom of the main content area.
 */

import { memo } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { ConnectionStatusIndicator } from "./ConnectionStatusIndicator";

// Determine WebSocket URL based on current environment
function getWebSocketUrl(): string {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const host = window.location.host;
  return `${protocol}//${host}/ws`;
}

const APP_VERSION = "0.1.0";

export interface FooterProps {
  className?: string;
}

/**
 * Status bar footer with WebSocket indicator and version
 */
export const Footer = memo(function Footer({
  className = "",
}: FooterProps): JSX.Element {
  const { status, reconnectAttempts } = useWebSocket({
    url: getWebSocketUrl(),
    reconnectInterval: 3000,
    maxReconnectAttempts: 5,
  });

  return (
    <footer
      className={`border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ${className}`}
      style={{
        borderTop: "1px solid #e5e7eb",
        backgroundColor: "#fff",
        padding: "8px 16px",
      }}
      role="contentinfo"
      aria-label="Application status bar"
    >
      <div
        className="flex items-center justify-between"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left: Status information */}
        <div
          className="flex items-center gap-4"
          style={{ display: "flex", alignItems: "center", gap: "16px" }}
        >
          {/* WebSocket Connection Status */}
          <ConnectionStatusIndicator
            status={status}
            reconnectAttempts={reconnectAttempts}
            maxReconnectAttempts={5}
          />
        </div>

        {/* Right: Version and other info */}
        <div
          className="flex items-center gap-4"
          style={{ display: "flex", alignItems: "center", gap: "16px" }}
        >
          {/* Build info */}
          <span
            className="text-xs text-gray-400 dark:text-gray-500"
            style={{ fontSize: "11px", color: "#9ca3af" }}
          >
            TypeScript/React
          </span>

          {/* Divider */}
          <span
            className="text-gray-300 dark:text-gray-600"
            style={{ color: "#d1d5db" }}
          >
            |
          </span>

          {/* Version */}
          <span
            className="text-xs font-medium text-gray-500 dark:text-gray-400"
            style={{ fontSize: "12px", fontWeight: 500, color: "#6b7280" }}
            data-testid="app-version"
          >
            v{APP_VERSION}
          </span>
        </div>
      </div>
    </footer>
  );
});
