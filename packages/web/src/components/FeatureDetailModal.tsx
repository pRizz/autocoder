/**
 * FeatureDetailModal component
 *
 * Displays detailed information about a feature in a modal dialog.
 * Closes when clicking the backdrop (overlay) or pressing Escape.
 * Includes delete functionality with confirmation dialog.
 */

import { useState, useCallback } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "./ConfirmDialog";

export interface Feature {
  id: number;
  name: string;
  description: string;
  category: string;
  passes: number;
  inProgress: number;
  priority: number;
  steps?: string;
  dependencies?: string;
  createdAt: string;
  updatedAt: string;
}

interface FeatureDetailModalProps {
  feature: Feature | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Callback when feature is deleted */
  onDelete?: (featureId: number) => Promise<void>;
}

/**
 * Format an ISO timestamp in the user's local timezone
 */
function formatLocalTimestamp(isoTimestamp: string): string {
  return new Date(isoTimestamp).toLocaleString();
}

/**
 * Get the status label for a feature
 */
function getStatusLabel(feature: Feature): { label: string; color: string } {
  if (feature.passes === 1) {
    return { label: "Done", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" };
  }
  if (feature.inProgress === 1) {
    return { label: "In Progress", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" };
  }
  return { label: "To Do", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" };
}

export function FeatureDetailModal({
  feature,
  open,
  onOpenChange,
  onDelete,
}: FeatureDetailModalProps): JSX.Element | null {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = useCallback(() => {
    setShowDeleteConfirm(true);
  }, []);

  const handleDeleteCancel = useCallback(() => {
    setShowDeleteConfirm(false);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!feature || !onDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(feature.id);
      setShowDeleteConfirm(false);
      onOpenChange(false); // Close the feature modal after successful delete
    } finally {
      setIsDeleting(false);
    }
  }, [feature, onDelete, onOpenChange]);

  if (!feature) return null;

  const status = getStatusLabel(feature);

  // Parse steps if they're stored as JSON string
  let steps: string[] = [];
  if (feature.steps) {
    try {
      steps = JSON.parse(feature.steps);
    } catch {
      // If not JSON, treat as single step
      steps = [feature.steps];
    }
  }

  // Parse dependencies if they're stored as JSON string
  let dependencies: number[] = [];
  if (feature.dependencies) {
    try {
      dependencies = JSON.parse(feature.dependencies);
    } catch {
      // Ignore parse errors
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Overlay/Backdrop - clicking this closes the modal */}
        <Dialog.Overlay
          className="fixed inset-0 bg-black/50 z-40"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 40,
          }}
          data-testid="feature-modal-backdrop"
        />

        {/* Modal Content */}
        <Dialog.Content
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 w-full max-w-2xl max-h-[85vh] overflow-auto"
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
            maxWidth: "672px",
            maxHeight: "85vh",
            overflow: "auto",
          }}
          data-testid="feature-modal-content"
        >
          {/* Header */}
          <div
            className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-700"
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              padding: "24px",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded ${status.color}`}
                  style={{
                    padding: "2px 8px",
                    fontSize: "12px",
                    fontWeight: 500,
                    borderRadius: "4px",
                  }}
                >
                  {status.label}
                </span>
                <span
                  className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {feature.category}
                </span>
              </div>
              <Dialog.Title
                className="text-xl font-semibold text-gray-900 dark:text-white"
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  color: "#111827",
                  margin: 0,
                }}
              >
                {feature.name}
              </Dialog.Title>
              <p
                className="text-sm text-gray-500 dark:text-gray-400 mt-1"
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  marginTop: "4px",
                }}
              >
                #{feature.id} &middot; Priority: {feature.priority}
              </p>
            </div>
            <div className="flex items-center gap-2" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {onDelete && (
                <button
                  onClick={handleDeleteClick}
                  aria-label="Delete feature"
                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                  style={{
                    padding: "6px",
                    color: "#ef4444",
                    backgroundColor: "transparent",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  data-testid="feature-modal-delete-button"
                >
                  <Trash2 size={18} />
                </button>
              )}
              <Dialog.Close asChild>
                <button
                  aria-label="Close feature details"
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
                  data-testid="feature-modal-close-button"
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
          </div>

          {/* Description for accessibility */}
          <Dialog.Description className="sr-only">
            Detailed information about feature: {feature.name}
          </Dialog.Description>

          {/* Body */}
          <div className="p-6" style={{ padding: "24px" }}>
            {/* Description */}
            <div className="mb-6">
              <h3
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Description
              </h3>
              <p
                className="text-gray-600 dark:text-gray-400"
                style={{
                  color: "#4b5563",
                }}
              >
                {feature.description}
              </p>
            </div>

            {/* Steps */}
            {steps.length > 0 && (
              <div className="mb-6">
                <h3
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Steps
                </h3>
                <ol
                  className="list-decimal list-inside space-y-1"
                  style={{
                    listStyleType: "decimal",
                    listStylePosition: "inside",
                  }}
                >
                  {steps.map((step, index) => (
                    <li
                      key={index}
                      className="text-gray-600 dark:text-gray-400"
                      style={{ color: "#4b5563" }}
                    >
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Dependencies */}
            {dependencies.length > 0 && (
              <div className="mb-6">
                <h3
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  style={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#374151",
                    marginBottom: "8px",
                  }}
                >
                  Dependencies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {dependencies.map((depId) => (
                    <span
                      key={depId}
                      className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                      style={{
                        padding: "4px 8px",
                        fontSize: "12px",
                        fontWeight: 500,
                        backgroundColor: "#f3f4f6",
                        color: "#4b5563",
                        borderRadius: "4px",
                      }}
                    >
                      Feature #{depId}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <div
                className="grid grid-cols-2 gap-4 text-sm"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "16px",
                  fontSize: "14px",
                }}
              >
                <div>
                  <span
                    className="text-gray-500 dark:text-gray-400"
                    style={{ color: "#6b7280" }}
                  >
                    Created:
                  </span>{" "}
                  <span
                    className="text-gray-700 dark:text-gray-300"
                    style={{ color: "#374151" }}
                  >
                    {formatLocalTimestamp(feature.createdAt)}
                  </span>
                </div>
                <div>
                  <span
                    className="text-gray-500 dark:text-gray-400"
                    style={{ color: "#6b7280" }}
                  >
                    Updated:
                  </span>{" "}
                  <span
                    className="text-gray-700 dark:text-gray-300"
                    style={{ color: "#374151" }}
                  >
                    {formatLocalTimestamp(feature.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Feature"
        message={`Are you sure you want to delete "${feature.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </Dialog.Root>
  );
}
