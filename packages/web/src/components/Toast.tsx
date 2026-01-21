/**
 * Toast Component
 *
 * A toast notification system built on Radix UI Toast primitive.
 * Provides success, error, and info notifications that auto-dismiss.
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps): JSX.Element {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={() => dismissToast(toast.id)}
          />
        ))}
        <ToastPrimitive.Viewport
          className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]"
          style={{
            position: "fixed",
            bottom: 0,
            right: 0,
            zIndex: 100,
            display: "flex",
            maxHeight: "100vh",
            width: "100%",
            maxWidth: "420px",
            flexDirection: "column-reverse",
            padding: "16px",
            gap: "8px",
          }}
        />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

interface ToastItemProps {
  toast: Toast;
  onDismiss: () => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps): JSX.Element {
  const { type, title, description, duration = 5000 } = toast;

  const Icon = type === "success" ? CheckCircle : type === "error" ? XCircle : AlertCircle;

  const iconColor =
    type === "success"
      ? "#22c55e"
      : type === "error"
        ? "#ef4444"
        : "#3b82f6";

  const bgColor =
    type === "success"
      ? "#f0fdf4"
      : type === "error"
        ? "#fef2f2"
        : "#eff6ff";

  const darkBgColor =
    type === "success"
      ? "rgba(34, 197, 94, 0.1)"
      : type === "error"
        ? "rgba(239, 68, 68, 0.1)"
        : "rgba(59, 130, 246, 0.1)";

  const borderColor =
    type === "success"
      ? "#bbf7d0"
      : type === "error"
        ? "#fecaca"
        : "#bfdbfe";

  const darkBorderColor =
    type === "success"
      ? "#166534"
      : type === "error"
        ? "#991b1b"
        : "#1e40af";

  return (
    <ToastPrimitive.Root
      duration={duration}
      onOpenChange={(open) => {
        if (!open) {
          onDismiss();
        }
      }}
      className="toast-root"
      style={{
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: "8px",
        padding: "16px",
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
        animation: "slideIn 0.3s ease-out",
      }}
      data-type={type}
    >
      <Icon
        size={20}
        style={{ color: iconColor, flexShrink: 0, marginTop: "2px" }}
        aria-hidden="true"
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        <ToastPrimitive.Title
          className="toast-title"
          style={{
            fontWeight: 600,
            fontSize: "0.875rem",
            color: "#111827",
            marginBottom: description ? "4px" : 0,
          }}
        >
          {title}
        </ToastPrimitive.Title>

        {description && (
          <ToastPrimitive.Description
            className="toast-description"
            style={{
              fontSize: "0.875rem",
              color: "#4b5563",
            }}
          >
            {description}
          </ToastPrimitive.Description>
        )}
      </div>

      <ToastPrimitive.Close
        aria-label="Close notification"
        className="toast-close"
        style={{
          padding: "4px",
          borderRadius: "4px",
          color: "#6b7280",
          cursor: "pointer",
          background: "none",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <X size={16} aria-hidden="true" />
      </ToastPrimitive.Close>

      {/* Dark mode styles using CSS-in-JS approach */}
      <style>{`
        @media (prefers-color-scheme: dark) {
          .toast-root[data-type="success"] {
            background-color: ${darkBgColor} !important;
            border-color: ${darkBorderColor} !important;
          }
          .toast-root[data-type="error"] {
            background-color: ${darkBgColor} !important;
            border-color: ${darkBorderColor} !important;
          }
          .toast-root[data-type="info"] {
            background-color: ${darkBgColor} !important;
            border-color: ${darkBorderColor} !important;
          }
          .toast-title {
            color: #f9fafb !important;
          }
          .toast-description {
            color: #d1d5db !important;
          }
          .toast-close {
            color: #9ca3af !important;
          }
          .toast-close:hover {
            background-color: rgba(255, 255, 255, 0.1) !important;
          }
        }

        .dark .toast-root[data-type="success"],
        .dark .toast-root[data-type="error"],
        .dark .toast-root[data-type="info"] {
          background-color: rgba(31, 41, 55, 0.95) !important;
          border-color: rgba(75, 85, 99, 0.5) !important;
        }
        .dark .toast-title {
          color: #f9fafb !important;
        }
        .dark .toast-description {
          color: #d1d5db !important;
        }
        .dark .toast-close {
          color: #9ca3af !important;
        }
        .dark .toast-close:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </ToastPrimitive.Root>
  );
}
