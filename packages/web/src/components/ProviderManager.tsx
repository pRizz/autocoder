/**
 * Provider Manager Component
 *
 * Allows users to add, view, and test AI provider connections.
 * Shows actionable error messages when connection tests fail.
 */

import { useState, useCallback, useEffect } from "react";
import { useTheme } from "../hooks/useTheme";
import { AlertCircle, CheckCircle, Loader2, Plus, Trash2, Wifi, X } from "lucide-react";

interface Provider {
  id: string;
  name: string;
  apiKeyMasked: string;
  baseUrl?: string | null;
  isDefault: number;
  createdAt: string;
  updatedAt: string;
}

interface TestResult {
  success: boolean;
  message?: string;
  model?: string;
  error?: string;
  code?: string;
  suggestedAction?: string;
}

interface ProviderManagerProps {
  apiBaseUrl?: string;
}

export function ProviderManager({
  apiBaseUrl = "http://localhost:3001/api",
}: ProviderManagerProps): JSX.Element {
  const { isDark } = useTheme();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [testingProvider, setTestingProvider] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});

  // Form state
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    apiKey: "",
    baseUrl: "",
    isDefault: false,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch providers
  const fetchProviders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${apiBaseUrl}/providers`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data: Provider[] = await response.json();
      setProviders(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch providers";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  // Add provider
  const handleAddProvider = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate form
      const errors: Record<string, string> = {};
      if (!formData.id.trim()) errors.id = "Provider ID is required";
      if (!formData.name.trim()) errors.name = "Display name is required";
      if (!formData.apiKey.trim()) errors.apiKey = "API key is required";

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      setIsSubmitting(true);
      setFormErrors({});

      try {
        const response = await fetch(`${apiBaseUrl}/providers`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: formData.id.trim().toLowerCase(),
            name: formData.name.trim(),
            apiKey: formData.apiKey.trim(),
            baseUrl: formData.baseUrl.trim() || undefined,
            isDefault: formData.isDefault,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        // Reset form and refresh list
        setFormData({ id: "", name: "", apiKey: "", baseUrl: "", isDefault: false });
        setShowAddForm(false);
        fetchProviders();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to add provider";
        setFormErrors({ submit: message });
      } finally {
        setIsSubmitting(false);
      }
    },
    [apiBaseUrl, formData, fetchProviders]
  );

  // Test connection
  const handleTestConnection = useCallback(
    async (providerId: string) => {
      setTestingProvider(providerId);
      setTestResults((prev) => ({ ...prev, [providerId]: { success: false } }));

      try {
        const response = await fetch(`${apiBaseUrl}/providers/${providerId}/test`, {
          method: "POST",
        });

        const result: TestResult = await response.json();
        setTestResults((prev) => ({ ...prev, [providerId]: result }));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Connection test failed";
        setTestResults((prev) => ({
          ...prev,
          [providerId]: {
            success: false,
            error: message,
            code: "NETWORK_ERROR",
            suggestedAction: "Check your internet connection and try again",
          },
        }));
      } finally {
        setTestingProvider(null);
      }
    },
    [apiBaseUrl]
  );

  // Delete provider
  const handleDeleteProvider = useCallback(
    async (providerId: string) => {
      if (!confirm(`Delete provider "${providerId}"? This cannot be undone.`)) {
        return;
      }

      try {
        const response = await fetch(`${apiBaseUrl}/providers/${providerId}`, {
          method: "DELETE",
        });

        if (!response.ok && response.status !== 404) {
          throw new Error(`HTTP ${response.status}`);
        }

        fetchProviders();
        setTestResults((prev) => {
          const { [providerId]: _, ...rest } = prev;
          return rest;
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to delete provider";
        setError(message);
      }
    },
    [apiBaseUrl, fetchProviders]
  );

  // Dismiss test result
  const dismissTestResult = useCallback((providerId: string) => {
    setTestResults((prev) => {
      const { [providerId]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2
          className="text-lg font-semibold text-gray-900 dark:text-white"
          style={{ fontSize: "1.125rem", fontWeight: 600, color: isDark ? "#fff" : "#111827" }}
        >
          AI Providers
        </h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 12px",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "#2563eb",
            backgroundColor: "#eff6ff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          <Plus size={16} />
          Add Provider
        </button>
      </div>

      {/* Add Provider Form */}
      {showAddForm && (
        <div
          className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
          style={{
            backgroundColor: isDark ? "rgba(55, 65, 81, 0.5)" : "#f9fafb",
            borderRadius: "8px",
            padding: "16px",
            border: `1px solid ${isDark ? "#4b5563" : "#e5e7eb"}`,
          }}
        >
          <form onSubmit={handleAddProvider} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="provider-id"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Provider ID *
                </label>
                <input
                  type="text"
                  id="provider-id"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  placeholder="e.g., openai, anthropic"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                {formErrors.id && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.id}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="provider-name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Display Name *
                </label>
                <input
                  type="text"
                  id="provider-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., OpenAI, Anthropic"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="provider-api-key"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                API Key *
              </label>
              <input
                type="password"
                id="provider-api-key"
                value={formData.apiKey}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                placeholder="Enter your API key"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              {formErrors.apiKey && (
                <p className="mt-1 text-sm text-red-600">{formErrors.apiKey}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Your API key will be encrypted before storage
              </p>
            </div>

            <div>
              <label
                htmlFor="provider-base-url"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Custom Base URL (optional)
              </label>
              <input
                type="url"
                id="provider-base-url"
                value={formData.baseUrl}
                onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                placeholder="e.g., https://api.example.com/v1"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <p className="mt-1 text-xs text-gray-500">
                Leave empty to use the default API endpoint
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="provider-default"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label
                htmlFor="provider-default"
                className="text-sm text-gray-700 dark:text-gray-300"
              >
                Set as default provider
              </label>
            </div>

            {formErrors.submit && (
              <div
                className="p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm"
                role="alert"
              >
                {formErrors.submit}
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? "Adding..." : "Add Provider"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setFormData({ id: "", name: "", apiKey: "", baseUrl: "", isDefault: false });
                  setFormErrors({});
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin h-6 w-6 text-blue-600" />
          <span className="ml-2 text-gray-600">Loading providers...</span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div
          role="alert"
          className="p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg"
        >
          Error: {error}
        </div>
      )}

      {/* Provider list */}
      {!isLoading && !error && providers.length === 0 && (
        <div
          className="text-center py-8 text-gray-500"
          style={{ textAlign: "center", padding: "32px 0", color: "#6b7280" }}
        >
          <Wifi size={48} className="mx-auto mb-4 opacity-50" style={{ margin: "0 auto 16px" }} />
          <p>No providers configured yet.</p>
          <p className="text-sm mt-1">Add a provider to get started with AI features.</p>
        </div>
      )}

      {!isLoading && providers.length > 0 && (
        <div className="space-y-3">
          {providers.map((provider) => {
            const testResult = testResults[provider.id];
            const isTesting = testingProvider === provider.id;

            return (
              <div
                key={provider.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                style={{
                  backgroundColor: isDark ? "#1f2937" : "#fff",
                  borderRadius: "8px",
                  border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
                  padding: "16px",
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3
                        className="font-medium text-gray-900 dark:text-white"
                        style={{ fontWeight: 500, color: isDark ? "#fff" : "#111827" }}
                      >
                        {provider.name}
                      </h3>
                      {provider.isDefault === 1 && (
                        <span
                          className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded"
                          style={{
                            padding: "2px 8px",
                            fontSize: "0.75rem",
                            fontWeight: 500,
                            backgroundColor: "#dbeafe",
                            color: "#1d4ed8",
                            borderRadius: "4px",
                          }}
                        >
                          Default
                        </span>
                      )}
                    </div>
                    <p
                      className="text-sm text-gray-500 dark:text-gray-400 mt-1"
                      style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "4px" }}
                    >
                      ID: {provider.id} | API Key: {provider.apiKeyMasked}
                    </p>
                    {provider.baseUrl && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Base URL: {provider.baseUrl}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTestConnection(provider.id)}
                      disabled={isTesting}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 disabled:opacity-50"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "6px 12px",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: "#15803d",
                        backgroundColor: "#f0fdf4",
                        border: "none",
                        borderRadius: "8px",
                        cursor: isTesting ? "wait" : "pointer",
                      }}
                    >
                      {isTesting ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Wifi size={14} />
                      )}
                      Test Connection
                    </button>
                    <button
                      onClick={() => handleDeleteProvider(provider.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label={`Delete ${provider.name}`}
                      style={{
                        padding: "6px",
                        color: "#dc2626",
                        backgroundColor: "transparent",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Test Result */}
                {testResult && (
                  <div
                    className={`mt-3 p-3 rounded-lg ${
                      testResult.success
                        ? "bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800"
                        : "bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800"
                    }`}
                    style={{
                      marginTop: "12px",
                      padding: "12px",
                      borderRadius: "8px",
                      backgroundColor: testResult.success
                        ? isDark ? "rgba(22, 101, 52, 0.3)" : "#f0fdf4"
                        : isDark ? "rgba(127, 29, 29, 0.3)" : "#fef2f2",
                      border: `1px solid ${
                        testResult.success
                          ? isDark ? "#166534" : "#bbf7d0"
                          : isDark ? "#991b1b" : "#fecaca"
                      }`,
                    }}
                    role="alert"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        {testResult.success ? (
                          <CheckCircle
                            size={18}
                            className="text-green-600 mt-0.5"
                            style={{ color: "#16a34a", marginTop: "2px" }}
                          />
                        ) : (
                          <AlertCircle
                            size={18}
                            className="text-red-600 mt-0.5"
                            style={{ color: "#dc2626", marginTop: "2px" }}
                          />
                        )}
                        <div>
                          <p
                            className={`font-medium ${
                              testResult.success
                                ? "text-green-700 dark:text-green-400"
                                : "text-red-700 dark:text-red-400"
                            }`}
                            style={{
                              fontWeight: 500,
                              color: testResult.success
                                ? isDark ? "#4ade80" : "#15803d"
                                : isDark ? "#f87171" : "#b91c1c",
                            }}
                          >
                            {testResult.success
                              ? testResult.message
                              : testResult.error || "Connection failed"}
                          </p>
                          {testResult.code && !testResult.success && (
                            <p
                              className="text-sm text-red-600 dark:text-red-400 mt-1"
                              style={{ fontSize: "0.875rem", marginTop: "4px" }}
                            >
                              Error code: {testResult.code}
                            </p>
                          )}
                          {testResult.suggestedAction && (
                            <p
                              className="text-sm mt-2"
                              style={{
                                fontSize: "0.875rem",
                                marginTop: "8px",
                                color: testResult.success
                                  ? isDark ? "#86efac" : "#166534"
                                  : isDark ? "#fca5a5" : "#991b1b",
                              }}
                            >
                              <strong>Suggested action:</strong> {testResult.suggestedAction}
                            </p>
                          )}
                          {testResult.model && (
                            <p
                              className="text-sm text-green-600 dark:text-green-400 mt-1"
                              style={{ fontSize: "0.875rem", marginTop: "4px" }}
                            >
                              Available model: {testResult.model}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => dismissTestResult(provider.id)}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded"
                        aria-label="Dismiss"
                        style={{
                          padding: "4px",
                          color: "#9ca3af",
                          backgroundColor: "transparent",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
