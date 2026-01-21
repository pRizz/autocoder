/**
 * useUnsavedChanges Hook
 *
 * A React hook that warns users about unsaved changes when they try to navigate away
 * from a form. Works with standard BrowserRouter (doesn't require data router).
 *
 * Features:
 * - Handles browser's beforeunload event for hard navigation (refresh, close tab)
 * - Provides state for showing custom confirmation dialog on in-app navigation
 * - Preserves form state when user chooses to Stay
 *
 * Note: For in-app navigation blocking, components using this hook should:
 * 1. Wrap navigation actions (link clicks, programmatic navigation) with confirmNavigation()
 * 2. Show UnsavedChangesDialog when showDialog is true
 * 3. Call confirmLeave() or cancelLeave() based on user choice
 */

import { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface UseUnsavedChangesOptions {
  /** Whether the form has unsaved changes */
  hasUnsavedChanges: boolean;
  /** Optional custom message for the dialog */
  message?: string;
}

interface UseUnsavedChangesReturn {
  /** Whether the confirmation dialog should be shown */
  showDialog: boolean;
  /** Call this when user confirms they want to leave */
  confirmLeave: () => void;
  /** Call this when user decides to stay */
  cancelLeave: () => void;
  /** The message to display in the dialog */
  dialogMessage: string;
  /** Call this before navigation to check if confirmation is needed */
  confirmNavigation: (targetPath: string) => boolean;
}

const DEFAULT_MESSAGE =
  "You have unsaved changes. Are you sure you want to leave? Your changes will be lost.";

export function useUnsavedChanges({
  hasUnsavedChanges,
  message = DEFAULT_MESSAGE,
}: UseUnsavedChangesOptions): UseUnsavedChangesReturn {
  const [showDialog, setShowDialog] = useState(false);
  const pendingNavigationRef = useRef<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle browser's beforeunload event (for refresh, close tab, external navigation)
  useEffect(() => {
    if (!hasUnsavedChanges) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Standard way to show browser's native confirmation dialog
      event.preventDefault();
      // This is required for some browsers (Chrome, Edge)
      event.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges, message]);

  // Intercept link clicks in the document for in-app navigation
  useEffect(() => {
    if (!hasUnsavedChanges) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest("a");

      if (!link) return;

      const href = link.getAttribute("href");
      if (!href) return;

      // Only intercept internal links (not external URLs)
      if (href.startsWith("/") && href !== location.pathname) {
        event.preventDefault();
        event.stopPropagation();
        pendingNavigationRef.current = href;
        setShowDialog(true);
      }
    };

    // Use capture phase to intercept before React Router handles the click
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [hasUnsavedChanges, location.pathname]);

  // Confirm leaving - proceed with blocked navigation
  const confirmLeave = useCallback(() => {
    setShowDialog(false);
    const targetPath = pendingNavigationRef.current;
    pendingNavigationRef.current = null;

    if (targetPath) {
      // Navigate to the pending path
      navigate(targetPath);
    }
  }, [navigate]);

  // Cancel leaving - stay on current page
  const cancelLeave = useCallback(() => {
    setShowDialog(false);
    pendingNavigationRef.current = null;
  }, []);

  // Programmatic navigation check
  const confirmNavigation = useCallback(
    (targetPath: string): boolean => {
      if (!hasUnsavedChanges || targetPath === location.pathname) {
        return true; // Allow navigation
      }

      pendingNavigationRef.current = targetPath;
      setShowDialog(true);
      return false; // Block navigation, show dialog
    },
    [hasUnsavedChanges, location.pathname]
  );

  return {
    showDialog,
    confirmLeave,
    cancelLeave,
    dialogMessage: message,
    confirmNavigation,
  };
}
