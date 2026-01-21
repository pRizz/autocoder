/**
 * Sidebar component with navigation links
 */

import { NavLink } from "react-router-dom";
import { useWebSocket } from "../hooks/useWebSocket";
import { ConnectionStatusIndicator } from "./ConnectionStatusIndicator";

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: "20px", height: "20px", flexShrink: 0 }}
      >
        <rect x="3" y="3" width="7" height="9" />
        <rect x="14" y="3" width="7" height="5" />
        <rect x="14" y="12" width="7" height="9" />
        <rect x="3" y="16" width="7" height="5" />
      </svg>
    ),
  },
  {
    label: "Kanban",
    to: "/kanban",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: "20px", height: "20px", flexShrink: 0 }}
      >
        <rect x="3" y="3" width="5" height="18" rx="1" />
        <rect x="10" y="3" width="5" height="12" rx="1" />
        <rect x="17" y="3" width="5" height="15" rx="1" />
      </svg>
    ),
  },
  {
    label: "Graph",
    to: "/graph",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: "20px", height: "20px", flexShrink: 0 }}
      >
        <circle cx="5" cy="6" r="3" />
        <circle cx="19" cy="6" r="3" />
        <circle cx="12" cy="18" r="3" />
        <line x1="8" y1="6" x2="16" y2="6" />
        <line x1="5" y1="9" x2="12" y2="15" />
        <line x1="19" y1="9" x2="12" y2="15" />
      </svg>
    ),
  },
  {
    label: "Projects",
    to: "/projects",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: "20px", height: "20px", flexShrink: 0 }}
      >
        <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />
      </svg>
    ),
  },
  {
    label: "Terminal",
    to: "/terminal",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: "20px", height: "20px", flexShrink: 0 }}
      >
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    ),
  },
  {
    label: "Settings",
    to: "/settings",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: "20px", height: "20px", flexShrink: 0 }}
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

// Determine WebSocket URL based on current environment
function getWebSocketUrl(): string {
  // In development, the Vite proxy handles /ws
  // In production, use the same host but with ws/wss protocol
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const host = window.location.host;
  return `${protocol}//${host}/ws`;
}

export function Sidebar(): JSX.Element {
  const { status, reconnectAttempts } = useWebSocket({
    url: getWebSocketUrl(),
    reconnectInterval: 3000,
    maxReconnectAttempts: 5,
  });

  return (
    <aside
      className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        height: "100%",
        width: "256px",
        backgroundColor: "#fff",
        borderRight: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Logo/Header */}
      <div
        className="p-4 border-b border-gray-200 dark:border-gray-700"
        style={{ padding: "16px", borderBottom: "1px solid #e5e7eb" }}
      >
        <h1
          className="text-xl font-bold text-gray-900 dark:text-white"
          style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827" }}
        >
          Open Autocoder
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4" style={{ flex: 1, padding: "16px" }}>
        <ul className="space-y-2" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: isActive ? "#1d4ed8" : "#374151",
                  backgroundColor: isActive ? "#dbeafe" : "transparent",
                  textDecoration: "none",
                })}
              >
                {item.icon}
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div
        className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3"
        style={{ padding: "16px", borderTop: "1px solid #e5e7eb" }}
      >
        {/* WebSocket Connection Status */}
        <ConnectionStatusIndicator
          status={status}
          reconnectAttempts={reconnectAttempts}
          maxReconnectAttempts={5}
        />

        {/* Version */}
        <p
          className="text-xs text-gray-500 dark:text-gray-400"
          style={{ fontSize: "12px", color: "#6b7280", marginTop: "12px" }}
        >
          v0.1.0
        </p>
      </div>
    </aside>
  );
}
