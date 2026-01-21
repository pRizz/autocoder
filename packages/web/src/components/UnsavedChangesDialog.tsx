/**
 * UnsavedChangesDialog Component
 *
 * A confirmation dialog that warns users about unsaved changes when they try to
 * navigate away from a form. Uses Radix UI Dialog for accessibility.
 *
 * Features:
 * - Accessible dialog with proper focus management
 * - Clear Stay/Leave action buttons
 * - Customizable message
 * - Keyboard support (Escape to cancel)
 */

import * as Dialog from "@radix-ui/react-dialog";
import { AlertTriangle, X } from "lucide-react";

interface UnsavedChangesDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Callback when user decides to stay (cancel navigation) */
  onStay: () => void;
  /** Callback when user decides to leave (proceed with navigation) */
  onLeave: () => void;
  /** Custom message to display */
  message?: string;
}

const DEFAULT_MESSAGE =
  "You have unsaved changes. Are you sure you want to leave? Your changes will be lost.";

export function UnsavedChangesDialog({
  isOpen,
  onStay,
  onLeave,
  message = DEFAULT_MESSAGE,
}: UnsavedChangesDialogProps): JSX.Element {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onStay()}>
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
          aria-describedby="unsaved-changes-description"
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
            >
              <X size={18} />
            </button>
          </Dialog.Close>

          {/* Warning icon and title */}
          <div className="flex items-start gap-4">
            <div
              className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center"
              style={{
                flexShrink: 0,
                width: "2.5rem",
                height: "2.5rem",
                borderRadius: "9999px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AlertTriangle
                className="w-5 h-5 text-amber-600 dark:text-amber-500"
                style={{ width: "1.25rem", height: "1.25rem" }}
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
                Unsaved Changes
              </Dialog.Title>
              <Dialog.Description
                id="unsaved-changes-description"
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
              onClick={onStay}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              style={{
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                borderRadius: "0.5rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              Stay
            </button>
            <button
              type="button"
              onClick={onLeave}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              style={{
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#fff",
                backgroundColor: "#dc2626",
                borderRadius: "0.5rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              Leave
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
