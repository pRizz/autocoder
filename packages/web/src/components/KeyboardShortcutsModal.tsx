/**
 * Keyboard Shortcuts Modal Component
 *
 * Displays available keyboard shortcuts in a modal dialog.
 * Features:
 * - Opens via ? key
 * - Closes via Escape key or clicking outside
 * - Lists all available shortcuts with descriptions
 */

import { useEffect } from "react";
import { useTheme } from "../hooks/useTheme";

/** Represents a keyboard shortcut */
interface Shortcut {
  key: string;
  description: string;
}

/** Props for the KeyboardShortcutsModal component */
interface KeyboardShortcutsModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
}

/** List of available keyboard shortcuts */
const shortcuts: Shortcut[] = [
  { key: "?", description: "Show this help modal" },
  { key: "A", description: "Toggle AI assistant panel" },
  { key: "D", description: "Toggle debug panel" },
  { key: "G", description: "Navigate to Graph view" },
  { key: "K", description: "Navigate to Kanban view" },
  { key: "N", description: "Add new feature" },
  { key: ",", description: "Open settings" },
  { key: "Esc", description: "Close modals" },
];

export function KeyboardShortcutsModal({
  isOpen,
  onClose,
}: KeyboardShortcutsModalProps): JSX.Element | null {
  const { isDark } = useTheme();

  // Handle Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Handle click outside to close
  function handleBackdropClick(event: React.MouseEvent<HTMLDivElement>): void {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="keyboard-shortcuts-title"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4"
        style={{
          backgroundColor: isDark ? "#1f2937" : "#fff",
          borderRadius: "0.5rem",
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          maxWidth: "28rem",
          width: "100%",
          margin: "0 1rem",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 1.5rem",
            borderBottom: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
          }}
        >
          <h2
            id="keyboard-shortcuts-title"
            className="text-lg font-semibold text-gray-900 dark:text-white"
            style={{
              fontSize: "1.125rem",
              fontWeight: 600,
              color: isDark ? "#fff" : "#111827",
              margin: 0,
            }}
          >
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{
              padding: "0.25rem",
              color: isDark ? "#9ca3af" : "#6b7280",
              backgroundColor: "transparent",
              border: "none",
              borderRadius: "0.25rem",
              cursor: "pointer",
            }}
            aria-label="Close keyboard shortcuts modal"
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
        </div>

        {/* Shortcuts list */}
        <div
          className="px-6 py-4"
          style={{
            padding: "1rem 1.5rem",
          }}
        >
          <ul
            className="space-y-3"
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            {shortcuts.map((shortcut) => (
              <li
                key={shortcut.key}
                className="flex items-center justify-between"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "0.75rem",
                }}
              >
                <span
                  className="text-gray-700 dark:text-gray-300"
                  style={{
                    color: isDark ? "#d1d5db" : "#374151",
                  }}
                >
                  {shortcut.description}
                </span>
                <kbd
                  className="px-2 py-1 text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded border border-gray-300 dark:border-gray-600"
                  style={{
                    padding: "0.25rem 0.5rem",
                    fontSize: "0.75rem",
                    fontFamily: "ui-monospace, monospace",
                    backgroundColor: isDark ? "#374151" : "#f3f4f6",
                    color: isDark ? "#e5e7eb" : "#1f2937",
                    borderRadius: "0.25rem",
                    border: `1px solid ${isDark ? "#4b5563" : "#d1d5db"}`,
                  }}
                >
                  {shortcut.key}
                </kbd>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div
          className="px-6 py-3 bg-gray-50 dark:bg-gray-900 rounded-b-lg border-t border-gray-200 dark:border-gray-700"
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: isDark ? "#111827" : "#f9fafb",
            borderRadius: "0 0 0.5rem 0.5rem",
            borderTop: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
          }}
        >
          <p
            className="text-xs text-gray-500 dark:text-gray-400 text-center"
            style={{
              fontSize: "0.75rem",
              color: isDark ? "#9ca3af" : "#6b7280",
              textAlign: "center",
              margin: 0,
            }}
          >
            Press <kbd style={{ fontFamily: "ui-monospace, monospace" }}>?</kbd> anytime to see this help
          </p>
        </div>
      </div>
    </div>
  );
}
