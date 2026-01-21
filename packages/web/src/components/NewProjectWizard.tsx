/**
 * New Project Wizard Component
 * A modal wizard for creating new projects with name, path, and settings configuration
 */

import { useState, useEffect, useCallback } from "react";
import { X, FolderOpen, ChevronRight, Check, AlertCircle } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

interface NewProjectWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (projectName: string) => void;
}

interface ProjectSettings {
  model: string;
  provider: string;
  concurrency: number;
  yoloMode: boolean;
  testingAgentRatio: number;
}

type WizardStep = "name" | "path" | "settings" | "creating";

export function NewProjectWizard({
  isOpen,
  onClose,
  onProjectCreated,
}: NewProjectWizardProps): JSX.Element | null {
  const { isDark } = useTheme();
  const [currentStep, setCurrentStep] = useState<WizardStep>("name");
  const [projectName, setProjectName] = useState("");
  const [projectPath, setProjectPath] = useState("");
  const [settings, setSettings] = useState<ProjectSettings>({
    model: "",
    provider: "",
    concurrency: 3,
    yoloMode: false,
    testingAgentRatio: 1,
  });
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [pathError, setPathError] = useState<string | null>(null);

  // Reset wizard state when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep("name");
      setProjectName("");
      setProjectPath("");
      setSettings({
        model: "",
        provider: "",
        concurrency: 3,
        yoloMode: false,
        testingAgentRatio: 1,
      });
      setError(null);
      setNameError(null);
      setPathError(null);
      setIsCreating(false);
    }
  }, [isOpen]);

  // Handle escape key to close
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen && !isCreating) {
        onClose();
      }
    },
    [isOpen, isCreating, onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const validateName = (name: string): boolean => {
    const trimmed = name.trim();
    if (!trimmed) {
      setNameError("Project name is required");
      return false;
    }
    if (trimmed.length < 2) {
      setNameError("Project name must be at least 2 characters");
      return false;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
      setNameError("Project name can only contain letters, numbers, hyphens, and underscores");
      return false;
    }
    setNameError(null);
    return true;
  };

  const validatePath = (path: string): boolean => {
    const trimmed = path.trim();
    if (!trimmed) {
      setPathError("Project path is required");
      return false;
    }
    if (!trimmed.startsWith("/") && !trimmed.match(/^[A-Z]:\\/i)) {
      setPathError("Please enter an absolute path (starting with / or drive letter)");
      return false;
    }
    setPathError(null);
    return true;
  };

  const handleNextFromName = () => {
    if (validateName(projectName)) {
      setCurrentStep("path");
    }
  };

  const handleNextFromPath = () => {
    if (validatePath(projectPath)) {
      setCurrentStep("settings");
    }
  };

  const handleCreate = async () => {
    setIsCreating(true);
    setCurrentStep("creating");
    setError(null);

    try {
      const response = await fetch("http://localhost:3001/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: projectName.trim(),
          path: projectPath.trim(),
          model: settings.model || undefined,
          provider: settings.provider || undefined,
          concurrency: settings.concurrency,
          yoloMode: settings.yoloMode,
          testingAgentRatio: settings.testingAgentRatio,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      // Success! Notify parent and close
      onProjectCreated(projectName.trim());
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create project";
      setError(message);
      setCurrentStep("settings"); // Go back to settings step on error
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  const stepTitles: Record<WizardStep, string> = {
    name: "Project Name",
    path: "Project Path",
    settings: "Configure Settings",
    creating: "Creating Project...",
  };

  const stepNumber = currentStep === "name" ? 1 : currentStep === "path" ? 2 : currentStep === "settings" ? 3 : 4;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.5)" }}
        onClick={isCreating ? undefined : onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg mx-4"
        style={{
          position: "relative",
          backgroundColor: isDark ? "#1f2937" : "#fff",
          borderRadius: "12px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          width: "100%",
          maxWidth: "32rem",
          margin: "0 16px",
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="wizard-title"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px",
            borderBottom: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
          }}
        >
          <div>
            <h2
              id="wizard-title"
              className="text-lg font-semibold text-gray-900 dark:text-white"
              style={{ fontSize: "1.125rem", fontWeight: 600, color: isDark ? "#fff" : "#111827" }}
            >
              New Project
            </h2>
            <p
              className="text-sm text-gray-500 dark:text-gray-400"
              style={{ fontSize: "0.875rem", color: isDark ? "#9ca3af" : "#6b7280" }}
            >
              Step {stepNumber} of 3: {stepTitles[currentStep]}
            </p>
          </div>
          {!isCreating && (
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              style={{ padding: "4px", color: isDark ? "#9ca3af" : "#9ca3af", cursor: "pointer", background: "none", border: "none" }}
              aria-label="Close wizard"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div
          className="h-1 bg-gray-200 dark:bg-gray-700"
          style={{ height: "4px", backgroundColor: isDark ? "#374151" : "#e5e7eb" }}
        >
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{
              height: "100%",
              backgroundColor: "#2563eb",
              width: `${(stepNumber / 3) * 100}%`,
              transition: "width 0.3s ease",
            }}
          />
        </div>

        {/* Content */}
        <div className="p-6" style={{ padding: "24px" }}>
          {error && (
            <div
              className="flex items-center gap-2 p-3 mb-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px",
                marginBottom: "16px",
                backgroundColor: isDark ? "rgba(127, 29, 29, 0.3)" : "#fee2e2",
                color: isDark ? "#f87171" : "#b91c1c",
                borderRadius: "8px",
              }}
              role="alert"
            >
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Step 1: Name */}
          {currentStep === "name" && (
            <div>
              <label
                htmlFor="project-name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: isDark ? "#d1d5db" : "#374151", marginBottom: "8px" }}
              >
                Project Name
              </label>
              <input
                id="project-name"
                type="text"
                value={projectName}
                onChange={(e) => {
                  setProjectName(e.target.value);
                  if (nameError) validateName(e.target.value);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleNextFromName()}
                placeholder="my-awesome-project"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: `1px solid ${nameError ? (isDark ? "#f87171" : "#ef4444") : isDark ? "#4b5563" : "#d1d5db"}`,
                  borderRadius: "8px",
                  backgroundColor: isDark ? "#374151" : "#fff",
                  color: isDark ? "#fff" : "#111827",
                  fontSize: "1rem",
                }}
                autoFocus
              />
              {nameError && (
                <p
                  className="mt-1 text-sm text-red-600 dark:text-red-400"
                  style={{ marginTop: "4px", fontSize: "0.875rem", color: isDark ? "#f87171" : "#dc2626" }}
                >
                  {nameError}
                </p>
              )}
              <p
                className="mt-2 text-sm text-gray-500 dark:text-gray-400"
                style={{ marginTop: "8px", fontSize: "0.875rem", color: isDark ? "#9ca3af" : "#6b7280" }}
              >
                Use lowercase letters, numbers, hyphens, or underscores.
              </p>
            </div>
          )}

          {/* Step 2: Path */}
          {currentStep === "path" && (
            <div>
              <label
                htmlFor="project-path"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: isDark ? "#d1d5db" : "#374151", marginBottom: "8px" }}
              >
                Project Path
              </label>
              <div className="relative">
                <input
                  id="project-path"
                  type="text"
                  value={projectPath}
                  onChange={(e) => {
                    setProjectPath(e.target.value);
                    if (pathError) validatePath(e.target.value);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleNextFromPath()}
                  placeholder="/home/user/projects/my-project"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    paddingRight: "40px",
                    border: `1px solid ${pathError ? (isDark ? "#f87171" : "#ef4444") : isDark ? "#4b5563" : "#d1d5db"}`,
                    borderRadius: "8px",
                    backgroundColor: isDark ? "#374151" : "#fff",
                    color: isDark ? "#fff" : "#111827",
                    fontSize: "1rem",
                  }}
                  autoFocus
                />
                <FolderOpen
                  size={18}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}
                />
              </div>
              {pathError && (
                <p
                  className="mt-1 text-sm text-red-600 dark:text-red-400"
                  style={{ marginTop: "4px", fontSize: "0.875rem", color: isDark ? "#f87171" : "#dc2626" }}
                >
                  {pathError}
                </p>
              )}
              <p
                className="mt-2 text-sm text-gray-500 dark:text-gray-400"
                style={{ marginTop: "8px", fontSize: "0.875rem", color: isDark ? "#9ca3af" : "#6b7280" }}
              >
                Enter the absolute path where your project files will be stored.
              </p>
            </div>
          )}

          {/* Step 3: Settings */}
          {currentStep === "settings" && (
            <div className="space-y-4" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label
                  htmlFor="settings-model"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: isDark ? "#d1d5db" : "#374151", marginBottom: "4px" }}
                >
                  Model (optional)
                </label>
                <input
                  id="settings-model"
                  type="text"
                  value={settings.model}
                  onChange={(e) => setSettings({ ...settings, model: e.target.value })}
                  placeholder="claude-3-opus"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: `1px solid ${isDark ? "#4b5563" : "#d1d5db"}`,
                    borderRadius: "8px",
                    backgroundColor: isDark ? "#374151" : "#fff",
                    color: isDark ? "#fff" : "#111827",
                    fontSize: "0.875rem",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="settings-provider"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: isDark ? "#d1d5db" : "#374151", marginBottom: "4px" }}
                >
                  Provider (optional)
                </label>
                <input
                  id="settings-provider"
                  type="text"
                  value={settings.provider}
                  onChange={(e) => setSettings({ ...settings, provider: e.target.value })}
                  placeholder="anthropic"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: `1px solid ${isDark ? "#4b5563" : "#d1d5db"}`,
                    borderRadius: "8px",
                    backgroundColor: isDark ? "#374151" : "#fff",
                    color: isDark ? "#fff" : "#111827",
                    fontSize: "0.875rem",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="settings-concurrency"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: isDark ? "#d1d5db" : "#374151", marginBottom: "4px" }}
                >
                  Concurrency (1-5)
                </label>
                <input
                  id="settings-concurrency"
                  type="number"
                  min={1}
                  max={5}
                  value={settings.concurrency}
                  onChange={(e) => setSettings({ ...settings, concurrency: Math.min(5, Math.max(1, parseInt(e.target.value) || 1)) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: `1px solid ${isDark ? "#4b5563" : "#d1d5db"}`,
                    borderRadius: "8px",
                    backgroundColor: isDark ? "#374151" : "#fff",
                    color: isDark ? "#fff" : "#111827",
                    fontSize: "0.875rem",
                  }}
                />
              </div>

              <div className="flex items-center gap-2" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  id="settings-yolo"
                  type="checkbox"
                  checked={settings.yoloMode}
                  onChange={(e) => setSettings({ ...settings, yoloMode: e.target.checked })}
                  className="h-4 w-4 text-blue-600 rounded"
                  style={{ width: "16px", height: "16px", accentColor: "#2563eb" }}
                />
                <label
                  htmlFor="settings-yolo"
                  className="text-sm text-gray-700 dark:text-gray-300"
                  style={{ fontSize: "0.875rem", color: isDark ? "#d1d5db" : "#374151" }}
                >
                  YOLO Mode (skip browser testing)
                </label>
              </div>
            </div>
          )}

          {/* Creating state */}
          {currentStep === "creating" && (
            <div className="flex flex-col items-center justify-center py-8" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "32px", paddingBottom: "32px" }}>
              <div
                className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"
                style={{ width: "48px", height: "48px", borderRadius: "50%", borderBottomWidth: "2px", borderColor: "#2563eb", marginBottom: "16px", animation: "spin 1s linear infinite" }}
              />
              <p
                className="text-gray-600 dark:text-gray-400"
                style={{ color: isDark ? "#9ca3af" : "#4b5563" }}
              >
                Creating project "{projectName}"...
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {currentStep !== "creating" && (
          <div
            className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px",
              borderTop: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
            }}
          >
            <button
              onClick={currentStep === "name" ? onClose : () => setCurrentStep(currentStep === "settings" ? "path" : "name")}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              style={{
                padding: "8px 16px",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: isDark ? "#d1d5db" : "#374151",
                background: "none",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              {currentStep === "name" ? "Cancel" : "Back"}
            </button>

            <button
              onClick={
                currentStep === "name"
                  ? handleNextFromName
                  : currentStep === "path"
                  ? handleNextFromPath
                  : handleCreate
              }
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
              {currentStep === "settings" ? (
                <>
                  <Check size={16} />
                  Create Project
                </>
              ) : (
                <>
                  Next
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
