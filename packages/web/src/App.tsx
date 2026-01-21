/**
 * Main application component
 */

import { useState, useEffect, useCallback } from "react";
import { Routes, Route, useParams } from "react-router-dom";
import { FeatureSearch } from "./components/FeatureSearch";
import { NewFeatureForm } from "./components/NewFeatureForm";
import { NewProjectWizard } from "./components/NewProjectWizard";
import { Sidebar } from "./components/Sidebar";
import { Footer } from "./components/Footer";
import { KanbanBoard } from "./components/KanbanBoard";
import { SettingsForm } from "./components/SettingsForm";
import { ProviderManager } from "./components/ProviderManager";
import { Terminal } from "./components/Terminal";
import { AssistantChatPanel } from "./components/AssistantChatPanel";
import { KeyboardShortcutsModal } from "./components/KeyboardShortcutsModal";
import { useTheme } from "./hooks/useTheme";
import { Plus } from "lucide-react";

// Sidebar width constants (must match Sidebar.tsx)
const SIDEBAR_COLLAPSED_WIDTH = 64;
const SIDEBAR_EXPANDED_WIDTH = 256;

export function App(): JSX.Element {
  const { isDark } = useTheme();
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    return stored === "true";
  });

  // Listen for sidebar toggle events
  useEffect(() => {
    const handleSidebarToggle = (event: CustomEvent<{ isCollapsed: boolean }>) => {
      setSidebarCollapsed(event.detail.isCollapsed);
    };

    window.addEventListener("sidebar-toggle", handleSidebarToggle as EventListener);
    return () => window.removeEventListener("sidebar-toggle", handleSidebarToggle as EventListener);
  }, []);

  const sidebarWidth = sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH;

  // Global keyboard shortcut for ? to show help modal
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger if user is typing in an input
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement
    ) {
      return;
    }

    // Open help modal with ? key (Shift + /)
    if (event.key === "?" || (event.shiftKey && event.key === "/")) {
      event.preventDefault();
      setIsHelpModalOpen(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const closeHelpModal = useCallback(() => {
    setIsHelpModalOpen(false);
  }, []);

  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
      style={{ minHeight: "100vh", backgroundColor: isDark ? "#111827" : "#f9fafb" }}
    >
      <Sidebar />
      <div
        className="min-h-screen flex flex-col transition-all duration-300"
        style={{
          marginLeft: `${sidebarWidth}px`,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          transition: "margin-left 0.3s ease",
        }}
      >
        <main
          className="flex-1"
          style={{ flex: 1 }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<HomePage />} />
            <Route path="/kanban" element={<KanbanPage />} />
            <Route path="/graph" element={<GraphPage />} />
            <Route path="/terminal" element={<TerminalPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:name" element={<ProjectDetailPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/error-test" element={<ErrorTestPage />} />
          </Routes>
        </main>

        {/* Footer with status bar */}
        <Footer />
      </div>

      {/* Assistant Chat Panel - available on all pages */}
      <AssistantChatPanel />

      {/* Keyboard Shortcuts Help Modal */}
      <KeyboardShortcutsModal isOpen={isHelpModalOpen} onClose={closeHelpModal} />
    </div>
  );
}

// Placeholder page components - will be implemented by coding agents
function HomePage(): JSX.Element {
  const { isDark } = useTheme();

  return (
    <div
      className="flex items-center justify-center h-screen"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <div className="text-center" style={{ textAlign: "center" }}>
        <h1
          className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
          style={{ fontSize: "1.875rem", fontWeight: 700, color: isDark ? "#fff" : "#111827", marginBottom: "8px" }}
        >
          Welcome to Open Autocoder
        </h1>
        <p
          className="text-gray-600 dark:text-gray-400"
          style={{ color: isDark ? "#9ca3af" : "#4b5563" }}
        >
          Select a view from the sidebar to get started
        </p>
      </div>
    </div>
  );
}

function KanbanPage(): JSX.Element {
  // Default to open-autocoder project for now
  // TODO: Get selected project from context/state
  return (
    <div className="p-8 h-screen">
      <KanbanBoard projectName="open-autocoder" apiBaseUrl="http://localhost:3001/api" />
    </div>
  );
}

function GraphPage(): JSX.Element {
  return (
    <div className="p-8 h-screen">
      <div className="h-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dependency Graph
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Visualize feature dependencies and relationships
          </p>
        </div>

        {/* Graph visualization area */}
        <div className="h-[calc(100%-5rem)] bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center">
          <div className="text-center">
            {/* Graph icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: "64px", height: "64px", margin: "0 auto 16px", color: "#9ca3af" }}
            >
              <circle cx="5" cy="6" r="3" />
              <circle cx="19" cy="6" r="3" />
              <circle cx="12" cy="18" r="3" />
              <line x1="8" y1="6" x2="16" y2="6" />
              <line x1="5" y1="9" x2="12" y2="15" />
              <line x1="19" y1="9" x2="12" y2="15" />
            </svg>
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Dependency Graph View
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
              This view will display an interactive graph showing how features depend on each other.
              Select a project to view its dependency graph.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface Project {
  name: string;
  path: string;
  createdAt: string;
  updatedAt?: string;
  model?: string | null;
  provider?: string | null;
  concurrency?: number;
  yoloMode?: number;
  testingAgentRatio?: number;
}

interface FeatureStats {
  passing: number;
  inProgress: number;
  total: number;
  percentage: number;
}

function ProjectsPage(): JSX.Element {
  const { isDark } = useTheme();
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectStats, setProjectStats] = useState<Record<string, FeatureStats>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("http://localhost:3001/api/projects");
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data: Project[] = await response.json();
      setProjects(data);

      // Fetch feature stats for each project
      const statsPromises = data.map(async (project) => {
        try {
          const statsResponse = await fetch(
            `http://localhost:3001/api/projects/${encodeURIComponent(project.name)}/features/stats`
          );
          if (statsResponse.ok) {
            const stats: FeatureStats = await statsResponse.json();
            return { name: project.name, stats };
          }
        } catch {
          // Silently ignore stats fetch errors for individual projects
        }
        return null;
      });

      const statsResults = await Promise.all(statsPromises);
      const newStats: Record<string, FeatureStats> = {};
      for (const result of statsResults) {
        if (result) {
          newStats[result.name] = result.stats;
        }
      }
      setProjectStats(newStats);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch projects";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleProjectCreated = useCallback((projectName: string) => {
    // Refresh the project list and navigate to the new project
    fetchProjects();
    // Navigate to the new project page
    window.location.href = `/projects/${encodeURIComponent(projectName)}`;
  }, [fetchProjects]);

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="p-8">
      <div
        className="flex items-center justify-between mb-6"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}
      >
        <h1
          className="text-2xl font-bold text-gray-900 dark:text-white"
          style={{ fontSize: "1.5rem", fontWeight: 700, color: isDark ? "#fff" : "#111827" }}
        >
          Projects
        </h1>
        <button
          onClick={() => setIsWizardOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "#fff",
            backgroundColor: "#2563eb",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          <Plus size={18} />
          New Project
        </button>
      </div>

      <NewProjectWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onProjectCreated={handleProjectCreated}
      />

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div
            className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
            style={{ width: "32px", height: "32px", borderRadius: "50%", borderBottomWidth: "2px", borderColor: "#2563eb" }}
          />
          <span className="ml-2 text-gray-600 dark:text-gray-400" style={{ marginLeft: "8px", color: isDark ? "#9ca3af" : "#4b5563" }}>
            Loading projects...
          </span>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg mb-4"
          style={{ padding: "16px", backgroundColor: isDark ? "#7f1d1d" : "#fee2e2", color: isDark ? "#fca5a5" : "#b91c1c", borderRadius: "8px", marginBottom: "16px" }}
        >
          Error: {error}
        </div>
      )}

      {!isLoading && !error && projects.length === 0 && (
        <div
          className="text-center py-8 text-gray-500 dark:text-gray-400"
          style={{ textAlign: "center", paddingTop: "32px", paddingBottom: "32px", color: isDark ? "#9ca3af" : "#6b7280" }}
        >
          No projects found. Create a project to get started.
        </div>
      )}

      {!isLoading && !error && projects.length > 0 && (
        <div className="space-y-4" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {projects.map((project) => {
            const stats = projectStats[project.name];
            return (
              <div
                key={project.name}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
                style={{
                  backgroundColor: isDark ? "#1f2937" : "#fff",
                  borderRadius: "8px",
                  border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
                  padding: "16px",
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2
                      className="text-lg font-semibold text-gray-900 dark:text-white"
                      style={{ fontSize: "1.125rem", fontWeight: 600, color: isDark ? "#fff" : "#111827" }}
                    >
                      {project.name}
                    </h2>
                    <p
                      className="text-sm text-gray-500 dark:text-gray-400 mt-1"
                      style={{ fontSize: "0.875rem", color: isDark ? "#9ca3af" : "#6b7280", marginTop: "4px" }}
                    >
                      <span className="font-medium" style={{ fontWeight: 500 }}>Path:</span> {project.path}
                    </p>
                    <p
                      className="text-sm text-gray-500 dark:text-gray-400 mt-1"
                      style={{ fontSize: "0.875rem", color: isDark ? "#9ca3af" : "#6b7280", marginTop: "4px" }}
                    >
                      <span className="font-medium" style={{ fontWeight: 500 }}>Created:</span> {formatDate(project.createdAt)}
                    </p>
                    {stats && (
                      <p
                        className="text-sm mt-2"
                        style={{ fontSize: "0.875rem", marginTop: "8px" }}
                      >
                        <span
                          className="font-medium text-green-600 dark:text-green-400"
                          style={{ fontWeight: 500, color: isDark ? "#4ade80" : "#16a34a" }}
                        >
                          {stats.passing}/{stats.total}
                        </span>
                        <span
                          className="text-gray-500 dark:text-gray-400 ml-1"
                          style={{ color: isDark ? "#9ca3af" : "#6b7280", marginLeft: "4px" }}
                        >
                          features complete ({stats.percentage.toFixed(1)}%)
                        </span>
                      </p>
                    )}
                  </div>
                  <a
                    href={`/projects/${encodeURIComponent(project.name)}`}
                    className="px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                    style={{
                      padding: "6px 12px",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: isDark ? "#60a5fa" : "#2563eb",
                      backgroundColor: isDark ? "rgba(37, 99, 235, 0.2)" : "#eff6ff",
                      borderRadius: "6px",
                      textDecoration: "none",
                    }}
                  >
                    View
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ProjectDetailPage(): JSX.Element {
  const { name } = useParams<{ name: string }>();
  const [showNewFeatureForm, setShowNewFeatureForm] = useState(false);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Project: {name}
      </h1>

      {/* Feature Search Section */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Search Features
        </h2>
        {name ? (
          <FeatureSearch
            projectName={name}
            apiBaseUrl="http://localhost:3001/api"
            onSearchResults={(features, query) => {
              console.log(`Search for "${query}" returned ${features.length} results`);
            }}
          />
        ) : (
          <p className="text-gray-500">No project selected</p>
        )}
      </section>

      {/* New Feature Section */}
      <section className="mb-8">
        {!showNewFeatureForm ? (
          <button
            onClick={() => setShowNewFeatureForm(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add New Feature
          </button>
        ) : name ? (
          <NewFeatureForm
            projectName={name}
            apiBaseUrl="http://localhost:3001/api"
            onFeatureCreated={(feature) => {
              console.log("Feature created:", feature);
              setShowNewFeatureForm(false);
            }}
            onCancel={() => setShowNewFeatureForm(false)}
          />
        ) : (
          <p className="text-gray-500">No project selected</p>
        )}
      </section>
    </div>
  );
}

function TerminalPage(): JSX.Element {
  return (
    <div className="p-8 h-screen">
      <div className="h-full flex flex-col">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Terminal
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Real-time agent output and logs
          </p>
        </div>
        <div className="flex-1 min-h-0">
          <Terminal projectName="open-autocoder" maxLogEntries={1000} />
        </div>
      </div>
    </div>
  );
}

function SettingsPage(): JSX.Element {
  const { isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectSettings, setProjectSettings] = useState<{
    model?: string;
    provider?: string;
    concurrency?: number;
    yoloMode?: boolean;
    testingAgentRatio?: number;
  } | null>(null);

  // Fetch project settings on mount
  useEffect(() => {
    const fetchProjectSettings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("http://localhost:3001/api/projects/open-autocoder");
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        // Convert yoloMode from number to boolean (database stores as 0/1)
        setProjectSettings({
          model: data.model || "",
          provider: data.provider || "",
          concurrency: data.concurrency ?? 3,
          yoloMode: data.yoloMode === 1,
          testingAgentRatio: data.testingAgentRatio ?? 1,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch project settings";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectSettings();
  }, []);

  return (
    <div className="p-8">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Settings
        </h1>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div
              className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
              style={{ width: "32px", height: "32px", borderRadius: "50%", borderBottomWidth: "2px", borderColor: "#2563eb" }}
            />
            <span className="ml-2 text-gray-600 dark:text-gray-400" style={{ marginLeft: "8px", color: isDark ? "#9ca3af" : "#4b5563" }}>
              Loading settings...
            </span>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg mb-4"
            style={{ padding: "16px", backgroundColor: isDark ? "#7f1d1d" : "#fee2e2", color: isDark ? "#fca5a5" : "#b91c1c", borderRadius: "8px", marginBottom: "16px" }}
          >
            Error: {error}
          </div>
        )}

        {!isLoading && !error && projectSettings && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <SettingsForm
              projectName="open-autocoder"
              apiBaseUrl="http://localhost:3001/api"
              initialSettings={projectSettings}
              onSave={(settings) => {
                console.log("Settings saved:", settings);
                // Update local state to reflect saved values
                setProjectSettings(settings);
              }}
            />
          </div>
        )}

        {/* Provider Management Section */}
        <div className="mt-8">
          <div
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
            style={{
              backgroundColor: isDark ? "#1f2937" : "#fff",
              borderRadius: "8px",
              border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
              padding: "24px",
            }}
          >
            <ProviderManager apiBaseUrl="http://localhost:3001/api" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Error Test Page - For testing ErrorBoundary functionality
 *
 * This page allows triggering different types of errors to verify
 * that the ErrorBoundary catches them and displays recovery options.
 */
function ErrorTestPage(): JSX.Element {
  const { isDark } = useTheme();
  const [shouldThrow, setShouldThrow] = useState(false);

  // If shouldThrow is true, throw an error during render
  if (shouldThrow) {
    throw new Error("Test error: Simulated 500 server error for ErrorBoundary testing");
  }

  return (
    <div className="p-8">
      <div
        className="max-w-2xl mx-auto"
        style={{ maxWidth: "42rem", margin: "0 auto" }}
      >
        <h1
          className="text-2xl font-bold text-gray-900 dark:text-white mb-6"
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: isDark ? "#fff" : "#111827",
            marginBottom: "24px",
          }}
        >
          Error Boundary Test
        </h1>

        <div
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          style={{
            backgroundColor: isDark ? "#1f2937" : "#fff",
            borderRadius: "8px",
            border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
            padding: "24px",
          }}
        >
          <p
            className="text-gray-600 dark:text-gray-400 mb-4"
            style={{
              color: isDark ? "#9ca3af" : "#4b5563",
              marginBottom: "16px",
            }}
          >
            Click the button below to trigger a test error and verify the ErrorBoundary
            catches it and displays recovery options (Retry and Go Home buttons).
          </p>

          <button
            onClick={() => setShouldThrow(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            style={{
              padding: "8px 16px",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#fff",
              backgroundColor: "#dc2626",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Trigger Test Error
          </button>
        </div>
      </div>
    </div>
  );
}
