/**
 * Error Boundary component for catching and displaying errors
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs the error, and displays a fallback UI with recovery options.
 */

import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  /** Children to render */
  children: ReactNode;
  /** Optional fallback UI to render when an error occurs */
  fallback?: ReactNode;
  /** Optional callback when an error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component
 *
 * Wraps child components and catches any JavaScript errors in the tree.
 * Displays a user-friendly error message with recovery options.
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state to show fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error for debugging
    console.error("ErrorBoundary caught an error:", error);
    console.error("Error info:", errorInfo);

    // Update state with error details
    this.setState({ errorInfo });

    // Call optional error callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = (): void => {
    // Reset error state to attempt recovery
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = (): void => {
    // Navigate to home page and reset state
    window.location.href = "/";
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Render custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Render default error UI
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onRetry={this.handleRetry}
          onGoHome={this.handleGoHome}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  onRetry: () => void;
  onGoHome: () => void;
}

/**
 * Default error fallback UI
 *
 * Displays error information with recovery options.
 */
function ErrorFallback({ error, errorInfo, onRetry, onGoHome }: ErrorFallbackProps): JSX.Element {
  // Check if this might be a network/API error
  const isNetworkError = error?.message?.includes("fetch") ||
                         error?.message?.includes("network") ||
                         error?.message?.includes("500") ||
                         error?.message?.includes("Failed to fetch");

  return (
    <div
      role="alert"
      className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        backgroundColor: "var(--bg-color, #f9fafb)",
      }}
    >
      <div
        className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center"
        style={{
          maxWidth: "32rem",
          width: "100%",
          backgroundColor: "var(--card-bg, #fff)",
          borderRadius: "8px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          padding: "32px",
          textAlign: "center",
        }}
      >
        {/* Error Icon */}
        <div
          className="mx-auto mb-6"
          style={{
            margin: "0 auto 24px",
            width: "64px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            backgroundColor: "#FEE2E2",
          }}
        >
          <AlertTriangle
            size={32}
            style={{ color: "#DC2626" }}
            aria-hidden="true"
          />
        </div>

        {/* Error Title */}
        <h1
          className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--text-color, #111827)",
            marginBottom: "8px",
          }}
        >
          {isNetworkError ? "Connection Error" : "Something went wrong"}
        </h1>

        {/* Error Description */}
        <p
          className="text-gray-600 dark:text-gray-400 mb-6"
          style={{
            color: "var(--text-muted, #4b5563)",
            marginBottom: "24px",
          }}
        >
          {isNetworkError
            ? "Unable to connect to the server. Please check your connection and try again."
            : "An unexpected error occurred. Please try again or return to the home page."}
        </p>

        {/* Error Details (collapsible for debugging) */}
        {error && (
          <details
            className="mb-6 text-left"
            style={{
              marginBottom: "24px",
              textAlign: "left",
            }}
          >
            <summary
              className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              style={{
                cursor: "pointer",
                fontSize: "0.875rem",
                color: "var(--text-muted, #6b7280)",
              }}
            >
              Show error details
            </summary>
            <div
              className="mt-2 p-4 bg-gray-100 dark:bg-gray-700 rounded-md overflow-auto"
              style={{
                marginTop: "8px",
                padding: "16px",
                backgroundColor: "var(--detail-bg, #f3f4f6)",
                borderRadius: "6px",
                overflow: "auto",
                maxHeight: "200px",
              }}
            >
              <p
                className="text-sm font-mono text-red-600 dark:text-red-400 mb-2"
                style={{
                  fontSize: "0.875rem",
                  fontFamily: "monospace",
                  color: "#DC2626",
                  marginBottom: "8px",
                  wordBreak: "break-word",
                }}
              >
                {error.message}
              </p>
              {errorInfo?.componentStack && (
                <pre
                  className="text-xs font-mono text-gray-600 dark:text-gray-400 whitespace-pre-wrap"
                  style={{
                    fontSize: "0.75rem",
                    fontFamily: "monospace",
                    color: "var(--text-muted, #4b5563)",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {errorInfo.componentStack}
                </pre>
              )}
            </div>
          </details>
        )}

        {/* Recovery Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-3 justify-center"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            justifyContent: "center",
          }}
        >
          <button
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "12px 24px",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#fff",
              backgroundColor: "#2563eb",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
          >
            <RefreshCw size={18} aria-hidden="true" />
            Retry
          </button>
          <button
            onClick={onGoHome}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "12px 24px",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "var(--button-text, #374151)",
              backgroundColor: "var(--button-bg, #f3f4f6)",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
          >
            <Home size={18} aria-hidden="true" />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorBoundary;
