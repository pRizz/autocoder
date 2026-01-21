/**
 * ConfirmDialog Component
 *
 * A reusable confirmation dialog for destructive actions like delete.
 * Uses Radix UI Dialog for accessibility.
 *
 * Features:
 * - Accessible dialog with proper focus management
 * - Clear Cancel/Confirm action buttons
 * - Customizable title, message, and button labels
 * - Keyboard support (Escape to cancel)
 * - Configurable variant (danger for destructive actions)
 */

import * as Dialog from "@radix-ui/react-dialog";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Callback when dialog is closed (cancel) */
  onCancel: () => void;
  /** Callback when user confirms the action */
  onConfirm: () => void;
  /** Dialog title */
  title: string;
  /** Dialog description/message */
  message: string;
  /** Label for the confirm button (default: "Confirm") */
  confirmLabel?: string;
  /** Label for the cancel button (default: "Cancel") */
  cancelLabel?: string;
  /** Whether the dialog is for a destructive action (shows red confirm button) */
  variant?: "default" | "danger";
  /** Whether the confirm action is in progress */
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onCancel,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  isLoading = false,
}: ConfirmDialogProps): JSX.Element {
  const isDanger = variant === "danger";

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Overlay
          className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 50,
          }}
          data-testid="confirm-dialog-backdrop"
        />

        {/* Dialog */}
        <Dialog.Content
          className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white dark:bg-gray-800 p-6 shadow-lg focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"
          style={{
            position: "fixed",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 51,
            width: "100%",
            maxWidth: "28rem",
            borderRadius: "0.5rem",
            padding: "1.5rem",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          }}
          aria-describedby="confirm-dialog-description"
          data-testid="confirm-dialog-content"
        >
          {/* Close button */}
          <Dialog.Close asChild>
            <button
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 data-[state=open]:text-gray-500 dark:ring-offset-gray-900 dark:focus:ring-gray-600"
              style={{
                position: "absolute",
                right: "1rem",
                top: "1rem",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                opacity: 0.7,
                padding: "0.25rem",
                borderRadius: "0.25rem",
              }}
              aria-label="Close"
              data-testid="confirm-dialog-close"
            >
              <X size={18} />
            </button>
          </Dialog.Close>

          {/* Warning icon and title */}
          <div className="flex items-start gap-4">
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                isDanger
                  ? "bg-red-100 dark:bg-red-900/30"
                  : "bg-amber-100 dark:bg-amber-900/30"
              }`}
              style={{
                flexShrink: 0,
                width: "2.5rem",
                height: "2.5rem",
                borderRadius: "9999px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isDanger ? "#fee2e2" : "#fef3c7",
              }}
            >
              <AlertTriangle
                className={`w-5 h-5 ${
                  isDanger
                    ? "text-red-600 dark:text-red-500"
                    : "text-amber-600 dark:text-amber-500"
                }`}
                style={{
                  width: "1.25rem",
                  height: "1.25rem",
                  color: isDanger ? "#dc2626" : "#d97706",
                }}
              />
            </div>
            <div className="flex-1">
              <Dialog.Title
                className="text-lg font-semibold text-gray-900 dark:text-white"
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                {title}
              </Dialog.Title>
              <Dialog.Description
                id="confirm-dialog-description"
                className="mt-2 text-sm text-gray-600 dark:text-gray-400"
                style={{
                  marginTop: "0.5rem",
                  fontSize: "0.875rem",
                }}
              >
                {message}
              </Dialog.Description>
            </div>
          </div>

          {/* Action buttons */}
          <div
            className="mt-6 flex justify-end gap-3"
            style={{
              marginTop: "1.5rem",
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.75rem",
            }}
          >
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors disabled:opacity-50"
              style={{
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                borderRadius: "0.5rem",
                border: "none",
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
              data-testid="confirm-dialog-cancel"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 ${
                isDanger
                  ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
              }`}
              style={{
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#fff",
                backgroundColor: isDanger ? "#dc2626" : "#2563eb",
                borderRadius: "0.5rem",
                border: "none",
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
              data-testid="confirm-dialog-confirm"
            >
              {isLoading ? "Deleting..." : confirmLabel}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
