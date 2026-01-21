/**
 * Settings Modal component
 *
 * A modal dialog that wraps the SettingsForm component.
 * Opens from a settings button and persists changes via API.
 */

import { useState, useEffect, useCallback } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { SettingsForm, type SettingsFormData } from "./SettingsForm";

interface SettingsModalProps {
  projectName: string;
  apiBaseUrl?: string;
  /** External control for open state */
  open?: boolean;
  /** Callback when modal open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Trigger element - if provided, will be used as the trigger button */
  trigger?: React.ReactNode;
}

interface ProjectSettings {
  model?: string;
  provider?: string;
  concurrency?: number;
  yoloMode?: boolean;
  testingAgentRatio?: number;
}

export function SettingsModal({
  projectName,
  apiBaseUrl = "http://localhost:3001/api",
  open: controlledOpen,
  onOpenChange,
  trigger,
}: SettingsModalProps): JSX.Element {
  // Support both controlled and uncontrolled modes
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const [settings, setSettings] = useState<ProjectSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (isControlled) {
        onOpenChange?.(newOpen);
      } else {
        setInternalOpen(newOpen);
      }
    },
    [isControlled, onOpenChange]
  );

  // Fetch current settings when modal opens
  useEffect(() => {
    if (!open || !projectName) return;

    const fetchSettings = async (): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${apiBaseUrl}/projects/${projectName}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch settings: ${response.statusText}`);
        }

        const project = await response.json();
        setSettings({
          model: project.model ?? "",
          provider: project.provider ?? "",
          concurrency: project.concurrency ?? 3,
          // Convert from SQLite integer (0/1) to boolean
          yoloMode: Boolean(project.yoloMode),
          testingAgentRatio: project.testingAgentRatio ?? 1,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load settings";
        setError(message);
        // Set default settings on error
        setSettings({
          concurrency: 3,
          yoloMode: false,
          testingAgentRatio: 1,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [open, projectName, apiBaseUrl]);

  const handleSave = useCallback(
    (formData: SettingsFormData) => {
      // Update local settings state
      setSettings(formData);
      // Close the modal after successful save
      handleOpenChange(false);
    },
    [handleOpenChange]
  );

  const handleCancel = useCallback(() => {
    handleOpenChange(false);
  }, [handleOpenChange]);

  // Default trigger button if not provided
  const defaultTrigger = (
    <button
      aria-label="Open settings"
      className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
      style={{
        padding: "8px",
        color: "#4b5563",
        backgroundColor: "transparent",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Settings gear icon */}
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
        style={{ width: "20px", height: "20px" }}
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    </button>
  );

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      {trigger !== undefined ? (
        <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      ) : (
        <Dialog.Trigger asChild>{defaultTrigger}</Dialog.Trigger>
      )}

      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay
          className="fixed inset-0 bg-black/50 z-40"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 40,
          }}
        />

        {/* Modal Content */}
        <Dialog.Content
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 w-full max-w-lg max-h-[90vh] overflow-auto"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            zIndex: 50,
            width: "100%",
            maxWidth: "512px",
            maxHeight: "90vh",
            overflow: "auto",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "24px",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <Dialog.Title
              className="text-xl font-semibold text-gray-900 dark:text-white"
              style={{
                fontSize: "1.25rem",
                fontWeight: 600,
                color: "#111827",
                margin: 0,
              }}
            >
              Settings
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                aria-label="Close settings"
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded transition-colors"
                style={{
                  padding: "4px",
                  color: "#9ca3af",
                  backgroundColor: "transparent",
                  border: "none",
                  borderRadius: "4px",
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
                  style={{ width: "20px", height: "20px" }}
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </Dialog.Close>
          </div>

          {/* Description for accessibility */}
          <Dialog.Description className="sr-only">
            Configure project settings including concurrency, model, and provider.
          </Dialog.Description>

          {/* Body */}
          <div className="p-6" style={{ padding: "24px" }}>
            {loading && (
              <div
                className="flex items-center justify-center py-8"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: "32px",
                  paddingBottom: "32px",
                }}
              >
                <div
                  className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
                  style={{
                    width: "32px",
                    height: "32px",
                    border: "2px solid #e5e7eb",
                    borderBottomColor: "#2563eb",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
                <span
                  className="ml-3 text-gray-600 dark:text-gray-400"
                  style={{ marginLeft: "12px", color: "#4b5563" }}
                >
                  Loading settings...
                </span>
              </div>
            )}

            {error && !loading && (
              <div
                className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm"
                style={{
                  marginBottom: "16px",
                  padding: "12px",
                  backgroundColor: "#fef2f2",
                  color: "#b91c1c",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
                role="alert"
              >
                {error}
              </div>
            )}

            {settings && !loading && (
              <SettingsForm
                projectName={projectName}
                apiBaseUrl={apiBaseUrl}
                initialSettings={settings}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>

      {/* Keyframes for spinner animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Dialog.Root>
  );
}
