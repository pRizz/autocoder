/**
 * Sidebar component with navigation links, agent controls, and quick stats
 */

import { useState, useEffect, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { useWebSocket } from "../hooks/useWebSocket";
import { useTheme } from "../hooks/useTheme";
import { ConnectionStatusIndicator } from "./ConnectionStatusIndicator";
import { SettingsModal } from "./SettingsModal";
import { useToast } from "./Toast";

// API base URL for agent and stats endpoints
const API_BASE_URL = "http://localhost:3001/api";

// Default project name (in production, this would come from context/props)
const DEFAULT_PROJECT = "open-autocoder";

interface AgentStatus {
  status: "idle" | "stopped" | "running" | "paused" | "crashed";
  activeAgents: number;
  completedFeatures: number;
}

interface FeatureStats {
  passing: number;
  in_progress: number;
  total: number;
  percentage: number;
}

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

// Collapsed width and expanded width constants
const SIDEBAR_COLLAPSED_WIDTH = 64;
const SIDEBAR_EXPANDED_WIDTH = 256;

// Export sidebar width state for use by other components
export interface SidebarState {
  isCollapsed: boolean;
  width: number;
}

export function Sidebar(): JSX.Element {
  const { status, reconnectAttempts } = useWebSocket({
    url: getWebSocketUrl(),
    reconnectInterval: 3000,
    maxReconnectAttempts: 5,
  });
  const { isDark, toggleTheme } = useTheme();
  const { showToast } = useToast();

  // Collapsed state - persisted in localStorage
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    return stored === "true";
  });

  // Toggle collapse state
  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const newValue = !prev;
      localStorage.setItem("sidebar-collapsed", String(newValue));
      // Dispatch custom event so App.tsx can respond
      window.dispatchEvent(new CustomEvent("sidebar-toggle", { detail: { isCollapsed: newValue } }));
      return newValue;
    });
  };

  // Notify App.tsx of initial state on mount
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("sidebar-toggle", { detail: { isCollapsed } }));
  }, []);

  const sidebarWidth = isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH;

  // Agent status state
  const [agentStatus, setAgentStatus] = useState<AgentStatus>({
    status: "idle",
    activeAgents: 0,
    completedFeatures: 0,
  });
  const [agentLoading, setAgentLoading] = useState(false);

  // Feature stats state
  const [featureStats, setFeatureStats] = useState<FeatureStats>({
    passing: 0,
    in_progress: 0,
    total: 0,
    percentage: 0,
  });

  // Fetch agent status
  const fetchAgentStatus = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${DEFAULT_PROJECT}/agent/status`);
      if (response.ok) {
        const data = await response.json();
        setAgentStatus({
          status: data.status || "stopped",
          activeAgents: data.activeAgents || 0,
          completedFeatures: data.completedFeatures || 0,
        });
      }
    } catch {
      // Silently handle fetch errors - status will remain as last known
    }
  }, []);

  // Fetch feature stats
  const fetchFeatureStats = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${DEFAULT_PROJECT}/features/stats`);
      if (response.ok) {
        const data = await response.json();
        setFeatureStats({
          passing: data.passing || 0,
          in_progress: data.inProgress || data.in_progress || 0,
          total: data.total || 0,
          percentage: data.percentage || 0,
        });
      }
    } catch {
      // Silently handle fetch errors - stats will remain as last known
    }
  }, []);

  // Poll for status updates
  useEffect(() => {
    fetchAgentStatus();
    fetchFeatureStats();

    const interval = setInterval(() => {
      fetchAgentStatus();
      fetchFeatureStats();
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [fetchAgentStatus, fetchFeatureStats]);

  // Agent control handlers
  const handleStartAgent = async () => {
    setAgentLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${DEFAULT_PROJECT}/agent/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (response.ok) {
        await fetchAgentStatus();
      } else {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.error || `Failed to start agent (HTTP ${response.status})`;
        showToast({
          type: "error",
          title: "Failed to start agent",
          description: message,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Network error occurred";
      showToast({
        type: "error",
        title: "Failed to start agent",
        description: message,
      });
    } finally {
      setAgentLoading(false);
    }
  };

  const handlePauseAgent = async () => {
    setAgentLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${DEFAULT_PROJECT}/agent/pause`, {
        method: "POST",
      });
      if (response.ok) {
        await fetchAgentStatus();
      } else {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.error || `Failed to pause agent (HTTP ${response.status})`;
        showToast({
          type: "error",
          title: "Failed to pause agent",
          description: message,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Network error occurred";
      showToast({
        type: "error",
        title: "Failed to pause agent",
        description: message,
      });
    } finally {
      setAgentLoading(false);
    }
  };

  const handleResumeAgent = async () => {
    setAgentLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${DEFAULT_PROJECT}/agent/resume`, {
        method: "POST",
      });
      if (response.ok) {
        await fetchAgentStatus();
      } else {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.error || `Failed to resume agent (HTTP ${response.status})`;
        showToast({
          type: "error",
          title: "Failed to resume agent",
          description: message,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Network error occurred";
      showToast({
        type: "error",
        title: "Failed to resume agent",
        description: message,
      });
    } finally {
      setAgentLoading(false);
    }
  };

  const handleStopAgent = async () => {
    setAgentLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${DEFAULT_PROJECT}/agent/stop`, {
        method: "POST",
      });
      if (response.ok) {
        await fetchAgentStatus();
      } else {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.error || `Failed to stop agent (HTTP ${response.status})`;
        showToast({
          type: "error",
          title: "Failed to stop agent",
          description: message,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Network error occurred";
      showToast({
        type: "error",
        title: "Failed to stop agent",
        description: message,
      });
    } finally {
      setAgentLoading(false);
    }
  };

  return (
    <aside
      className="fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        height: "100%",
        width: `${sidebarWidth}px`,
        backgroundColor: isDark ? "#1f2937" : "#fff",
        borderRight: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s ease",
        overflow: "hidden",
      }}
    >
      {/* Logo/Header */}
      <div
        className="p-4 border-b border-gray-200 dark:border-gray-700"
        style={{
          padding: isCollapsed ? "16px 12px" : "16px",
          borderBottom: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "space-between",
          minHeight: "56px",
        }}
      >
        {!isCollapsed && (
          <h1
            className="text-xl font-bold text-gray-900 dark:text-white"
            style={{ fontSize: "1.25rem", fontWeight: 700, color: isDark ? "#fff" : "#111827" }}
          >
            Open Autocoder
          </h1>
        )}

        {/* Collapse/Expand Button */}
        <button
          onClick={toggleCollapse}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{
            padding: "6px",
            borderRadius: "6px",
            backgroundColor: isDark ? "#374151" : "#f3f4f6",
            color: isDark ? "#d1d5db" : "#6b7280",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
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
            style={{
              width: "20px",
              height: "20px",
              transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          >
            <polyline points="11 17 6 12 11 7" />
            <polyline points="18 17 13 12 18 7" />
          </svg>
        </button>

        {/* Settings Modal Button - only when expanded */}
        {!isCollapsed && (
          <SettingsModal
            projectName="open-autocoder"
            apiBaseUrl="http://localhost:3001/api"
          />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4" style={{ flex: 1, padding: isCollapsed ? "16px 8px" : "16px", overflow: "auto" }}>
        <ul className="space-y-2" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                title={isCollapsed ? item.label : undefined}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  justifyContent: isCollapsed ? "center" : "flex-start",
                  gap: isCollapsed ? "0" : "12px",
                  padding: isCollapsed ? "10px" : "8px 12px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: isActive
                    ? (isDark ? "#60a5fa" : "#1d4ed8")
                    : (isDark ? "#d1d5db" : "#374151"),
                  backgroundColor: isActive
                    ? (isDark ? "#1e3a5f" : "#dbeafe")
                    : "transparent",
                  textDecoration: "none",
                })}
              >
                {item.icon}
                {!isCollapsed && item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Agent Controls */}
        <div
          style={{
            marginTop: "24px",
            padding: isCollapsed ? "8px" : "12px",
            backgroundColor: isDark ? "#374151" : "#f3f4f6",
            borderRadius: "8px",
          }}
        >
          {!isCollapsed && (
            <h3
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: isDark ? "#9ca3af" : "#6b7280",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "8px",
              }}
            >
              Agent Controls
            </h3>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: isCollapsed ? "column" : "row",
              gap: "8px",
              alignItems: "center",
              justifyContent: isCollapsed ? "center" : "flex-start",
            }}
          >
            {/* Play/Resume Button */}
            {agentStatus.status === "idle" || agentStatus.status === "stopped" || agentStatus.status === "crashed" ? (
              <button
                onClick={handleStartAgent}
                disabled={agentLoading}
                aria-label="Start agent"
                style={{
                  padding: "8px",
                  borderRadius: "6px",
                  backgroundColor: "#22c55e",
                  color: "white",
                  border: "none",
                  cursor: agentLoading ? "not-allowed" : "pointer",
                  opacity: agentLoading ? 0.5 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            ) : agentStatus.status === "paused" ? (
              <button
                onClick={handleResumeAgent}
                disabled={agentLoading}
                aria-label="Resume agent"
                style={{
                  padding: "8px",
                  borderRadius: "6px",
                  backgroundColor: "#22c55e",
                  color: "white",
                  border: "none",
                  cursor: agentLoading ? "not-allowed" : "pointer",
                  opacity: agentLoading ? 0.5 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            ) : null}

            {/* Pause Button */}
            {agentStatus.status === "running" && (
              <button
                onClick={handlePauseAgent}
                disabled={agentLoading}
                aria-label="Pause agent"
                style={{
                  padding: "8px",
                  borderRadius: "6px",
                  backgroundColor: "#f59e0b",
                  color: "white",
                  border: "none",
                  cursor: agentLoading ? "not-allowed" : "pointer",
                  opacity: agentLoading ? 0.5 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              </button>
            )}

            {/* Stop Button */}
            {(agentStatus.status === "running" || agentStatus.status === "paused") && (
              <button
                onClick={handleStopAgent}
                disabled={agentLoading}
                aria-label="Stop agent"
                style={{
                  padding: "8px",
                  borderRadius: "6px",
                  backgroundColor: "#ef4444",
                  color: "white",
                  border: "none",
                  cursor: agentLoading ? "not-allowed" : "pointer",
                  opacity: agentLoading ? 0.5 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="6" width="12" height="12" />
                </svg>
              </button>
            )}

            {/* Status Indicator */}
            {!isCollapsed && (
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: agentStatus.status === "running"
                    ? "#22c55e"
                    : agentStatus.status === "paused"
                      ? "#f59e0b"
                      : agentStatus.status === "crashed"
                        ? "#ef4444"
                        : (isDark ? "#9ca3af" : "#6b7280"),
                  textTransform: "capitalize",
                }}
              >
                {agentStatus.status}
              </span>
            )}
          </div>
        </div>

        {/* Quick Stats - hidden when collapsed */}
        {!isCollapsed && (
        <div
          style={{
            marginTop: "16px",
            padding: "12px",
            backgroundColor: isDark ? "#374151" : "#f3f4f6",
            borderRadius: "8px",
          }}
        >
          <h3
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: isDark ? "#9ca3af" : "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "8px",
            }}
          >
            Quick Stats
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "13px",
                color: isDark ? "#d1d5db" : "#374151",
              }}
            >
              <span>Passing</span>
              <span style={{ color: "#22c55e", fontWeight: 600 }}>{featureStats.passing}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "13px",
                color: isDark ? "#d1d5db" : "#374151",
              }}
            >
              <span>In Progress</span>
              <span style={{ color: "#f59e0b", fontWeight: 600 }}>{featureStats.in_progress}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "13px",
                color: isDark ? "#d1d5db" : "#374151",
              }}
            >
              <span>Total</span>
              <span style={{ fontWeight: 600 }}>{featureStats.total}</span>
            </div>
            {/* Progress bar */}
            <div
              style={{
                marginTop: "8px",
                height: "6px",
                backgroundColor: isDark ? "#4b5563" : "#e5e7eb",
                borderRadius: "3px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${featureStats.percentage}%`,
                  backgroundColor: "#22c55e",
                  borderRadius: "3px",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
            <div
              style={{
                fontSize: "11px",
                color: isDark ? "#9ca3af" : "#6b7280",
                textAlign: "center",
                marginTop: "4px",
              }}
            >
              {featureStats.percentage.toFixed(1)}% Complete
            </div>
          </div>
        </div>
        )}
      </nav>

      {/* Footer */}
      <div
        className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3"
        style={{ padding: isCollapsed ? "12px 8px" : "16px", borderTop: `1px solid ${isDark ? "#374151" : "#e5e7eb"}` }}
      >
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isCollapsed ? (isDark ? "Switch to light mode" : "Switch to dark mode") : undefined}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: isCollapsed ? "center" : "flex-start",
            gap: isCollapsed ? "0" : "8px",
            width: "100%",
            padding: isCollapsed ? "10px" : "8px 12px",
            fontSize: "14px",
            fontWeight: 500,
            color: isDark ? "#e5e7eb" : "#374151",
            backgroundColor: isDark ? "#374151" : "#f3f4f6",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {isDark ? (
            // Sun icon for switching to light mode
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
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            // Moon icon for switching to dark mode
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
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
          {!isCollapsed && (isDark ? "Light Mode" : "Dark Mode")}
        </button>

        {/* WebSocket Connection Status - compact when collapsed */}
        {!isCollapsed ? (
          <ConnectionStatusIndicator
            status={status}
            reconnectAttempts={reconnectAttempts}
            maxReconnectAttempts={5}
          />
        ) : (
          <div
            title={`Connection: ${status}`}
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "4px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: status === "connected" ? "#22c55e" : status === "connecting" || status === "reconnecting" ? "#f59e0b" : "#ef4444",
              }}
            />
          </div>
        )}

        {/* Version - hidden when collapsed */}
        {!isCollapsed && (
          <p
            className="text-xs text-gray-500 dark:text-gray-400"
            style={{ fontSize: "12px", color: isDark ? "#9ca3af" : "#6b7280", marginTop: "12px" }}
          >
            v0.1.0
          </p>
        )}
      </div>
    </aside>
  );
}
