/**
 * Connection Status Indicator
 *
 * Shows the current WebSocket connection status with visual feedback.
 */

import { memo } from "react";
import type { WebSocketStatus } from "../hooks/useWebSocket";

export interface ConnectionStatusIndicatorProps {
  status: WebSocketStatus;
  reconnectAttempts?: number;
  maxReconnectAttempts?: number;
  className?: string;
}

const statusConfig: Record<
  WebSocketStatus,
  { label: string; color: string; bgColor: string; animate?: boolean }
> = {
  connected: {
    label: "Connected",
    color: "text-green-700 dark:text-green-400",
    bgColor: "bg-green-500",
  },
  connecting: {
    label: "Connecting",
    color: "text-yellow-700 dark:text-yellow-400",
    bgColor: "bg-yellow-500",
    animate: true,
  },
  reconnecting: {
    label: "Reconnecting",
    color: "text-yellow-700 dark:text-yellow-400",
    bgColor: "bg-yellow-500",
    animate: true,
  },
  disconnected: {
    label: "Disconnected",
    color: "text-red-700 dark:text-red-400",
    bgColor: "bg-red-500",
  },
};

/**
 * Visual indicator for WebSocket connection status
 */
export const ConnectionStatusIndicator = memo(function ConnectionStatusIndicator({
  status,
  reconnectAttempts = 0,
  maxReconnectAttempts = 5,
  className = "",
}: ConnectionStatusIndicatorProps): JSX.Element {
  const config = statusConfig[status];

  const showReconnectCount =
    status === "reconnecting" && reconnectAttempts > 0;

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 ${className}`}
      role="status"
      aria-live="polite"
      aria-label={`Connection status: ${config.label}${
        showReconnectCount
          ? ` (attempt ${reconnectAttempts}/${maxReconnectAttempts})`
          : ""
      }`}
    >
      {/* Status dot */}
      <span
        style={{ position: "relative", display: "flex", width: "10px", height: "10px" }}
      >
        {config.animate && (
          <span
            style={{
              position: "absolute",
              display: "inline-flex",
              width: "100%",
              height: "100%",
              borderRadius: "9999px",
              opacity: 0.75,
              animation: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
              backgroundColor: config.bgColor === "bg-green-500" ? "#22c55e" :
                             config.bgColor === "bg-yellow-500" ? "#eab308" :
                             config.bgColor === "bg-red-500" ? "#ef4444" : "#22c55e",
            }}
          />
        )}
        <span
          style={{
            position: "relative",
            display: "inline-flex",
            borderRadius: "9999px",
            width: "10px",
            height: "10px",
            backgroundColor: config.bgColor === "bg-green-500" ? "#22c55e" :
                           config.bgColor === "bg-yellow-500" ? "#eab308" :
                           config.bgColor === "bg-red-500" ? "#ef4444" : "#22c55e",
          }}
        />
      </span>

      {/* Status text */}
      <span className={`text-xs font-medium ${config.color}`}>
        {config.label}
        {showReconnectCount && (
          <span className="text-gray-500 dark:text-gray-400 ml-1">
            ({reconnectAttempts}/{maxReconnectAttempts})
          </span>
        )}
      </span>

      {/* Connection icon */}
      <ConnectionIcon status={status} />
    </div>
  );
});

interface ConnectionIconProps {
  status: WebSocketStatus;
}

function ConnectionIcon({ status }: ConnectionIconProps): JSX.Element {
  const iconStyle = { width: "14px", height: "14px", flexShrink: 0 };

  // Connected - signal icon
  if (status === "connected") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ ...iconStyle, color: "#16a34a" }}
      >
        <path d="M2 20h.01" />
        <path d="M7 20v-4" />
        <path d="M12 20v-8" />
        <path d="M17 20V8" />
        <path d="M22 4v16" />
      </svg>
    );
  }

  // Disconnected - no signal icon
  if (status === "disconnected") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ ...iconStyle, color: "#dc2626" }}
      >
        <line x1="2" y1="2" x2="22" y2="22" />
        <path d="M8.5 16.5a5 5 0 0 1 7 0" />
        <path d="M2 8.82a15 15 0 0 1 4.17-2.65" />
        <path d="M10.66 5c4.01-.36 8.14.9 11.34 3.76" />
        <path d="M16.85 11.25a10 10 0 0 1 2.22 1.68" />
        <path d="M5 13a10 10 0 0 1 5.24-2.76" />
        <line x1="12" y1="20" x2="12.01" y2="20" />
      </svg>
    );
  }

  // Connecting/Reconnecting - loading spinner
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ ...iconStyle, color: "#ca8a04", animation: "spin 1s linear infinite" }}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
