/**
 * Settings form component with numeric validation for concurrency field.
 * Shows unsaved changes warning when navigating away with unsaved data.
 */

import { useState, useCallback, useRef, useMemo } from "react";
import { useUnsavedChanges } from "../hooks/useUnsavedChanges";
import { UnsavedChangesDialog } from "./UnsavedChangesDialog";
import { useToast } from "./Toast";

interface SettingsFormProps {
  projectName?: string;
  apiBaseUrl?: string;
  initialSettings?: {
    model?: string;
    provider?: string;
    concurrency?: number;
    yoloMode?: boolean;
    testingAgentRatio?: number;
  };
  onSave?: (settings: SettingsFormData) => void;
  onCancel?: () => void;
}

export interface SettingsFormData {
  model: string;
  provider: string;
  concurrency: number;
  yoloMode: boolean;
  testingAgentRatio: number;
}

interface FormErrors {
  concurrency?: string;
  testingAgentRatio?: string;
}

export function SettingsForm({
  projectName,
  apiBaseUrl = "http://localhost:3001/api",
  initialSettings,
  onSave,
  onCancel,
}: SettingsFormProps): JSX.Element {
  const { showToast } = useToast();
  const [model, setModel] = useState(initialSettings?.model ?? "");
  const [provider, setProvider] = useState(initialSettings?.provider ?? "");
  const [concurrency, setConcurrency] = useState<string>(
    initialSettings?.concurrency?.toString() ?? "3"
  );
  const [yoloMode, setYoloMode] = useState(initialSettings?.yoloMode ?? false);
  const [testingAgentRatio, setTestingAgentRatio] = useState<string>(
    initialSettings?.testingAgentRatio?.toString() ?? "1"
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const concurrencyInputRef = useRef<HTMLInputElement>(null);
  const testingAgentRatioInputRef = useRef<HTMLInputElement>(null);

  // Default values for settings reset
  const DEFAULT_SETTINGS = {
    model: "",
    provider: "",
    concurrency: "3",
    yoloMode: false,
    testingAgentRatio: "1",
  };

  // Track if form has unsaved changes (any value differs from initial)
  const hasUnsavedChanges = useMemo(() => {
    const initialModel = initialSettings?.model ?? "";
    const initialProvider = initialSettings?.provider ?? "";
    const initialConcurrency = initialSettings?.concurrency?.toString() ?? "3";
    const initialYoloMode = initialSettings?.yoloMode ?? false;
    const initialTestingRatio = initialSettings?.testingAgentRatio?.toString() ?? "1";

    return (
      model !== initialModel ||
      provider !== initialProvider ||
      concurrency !== initialConcurrency ||
      yoloMode !== initialYoloMode ||
      testingAgentRatio !== initialTestingRatio
    );
  }, [model, provider, concurrency, yoloMode, testingAgentRatio, initialSettings]);

  // Use the unsaved changes hook for navigation blocking
  const {
    showDialog: showUnsavedDialog,
    confirmLeave,
    cancelLeave,
    dialogMessage,
  } = useUnsavedChanges({
    hasUnsavedChanges,
    message: "You have unsaved changes in the settings form. Are you sure you want to leave? Your changes will be lost.",
  });

  /**
   * Handle numeric input - only allow digits
   * This prevents letters from being entered in the first place
   */
  const handleNumericKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow: backspace, delete, tab, escape, enter, arrow keys
      const allowedKeys = [
        "Backspace",
        "Delete",
        "Tab",
        "Escape",
        "Enter",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
      ];

      if (allowedKeys.includes(e.key)) {
        return;
      }

      // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      if (
        (e.ctrlKey || e.metaKey) &&
        ["a", "c", "v", "x"].includes(e.key.toLowerCase())
      ) {
        return;
      }

      // Block non-numeric keys (letters and special characters)
      if (!/^[0-9]$/.test(e.key)) {
        e.preventDefault();
      }
    },
    []
  );

  /**
   * Handle paste - filter out non-numeric characters
   */
  const handleNumericPaste = useCallback(
    (
      e: React.ClipboardEvent<HTMLInputElement>,
      setter: (value: string) => void,
      min: number,
      max: number
    ) => {
      e.preventDefault();
      const pastedText = e.clipboardData.getData("text");
      // Filter to only digits
      const numericOnly = pastedText.replace(/[^0-9]/g, "");

      if (numericOnly) {
        const num = parseInt(numericOnly, 10);
        // Clamp to valid range
        const clamped = Math.min(Math.max(num, min), max);
        setter(clamped.toString());
      }
    },
    []
  );

  /**
   * Handle concurrency input change with validation
   */
  const handleConcurrencyChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      // Allow empty input (user is clearing field)
      if (value === "") {
        setConcurrency("");
        setErrors((prev) => ({
          ...prev,
          concurrency: "Concurrency is required",
        }));
        return;
      }

      // Only allow numeric input - reject letters entirely
      if (!/^\d+$/.test(value)) {
        return; // Reject the input
      }

      const num = parseInt(value, 10);

      // Validate range
      if (num < 1 || num > 5) {
        setErrors((prev) => ({
          ...prev,
          concurrency: "Concurrency must be between 1 and 5",
        }));
      } else {
        setErrors((prev) => {
          const { concurrency: _, ...rest } = prev;
          return rest;
        });
      }

      setConcurrency(value);
    },
    []
  );

  /**
   * Handle testing agent ratio input change with validation
   */
  const handleTestingAgentRatioChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      // Allow empty input (user is clearing field)
      if (value === "") {
        setTestingAgentRatio("");
        setErrors((prev) => ({
          ...prev,
          testingAgentRatio: "Testing agent ratio is required",
        }));
        return;
      }

      // Only allow numeric input - reject letters entirely
      if (!/^\d+$/.test(value)) {
        return; // Reject the input
      }

      const num = parseInt(value, 10);

      // Validate range
      if (num < 0 || num > 3) {
        setErrors((prev) => ({
          ...prev,
          testingAgentRatio: "Testing agent ratio must be between 0 and 3",
        }));
      } else {
        setErrors((prev) => {
          const { testingAgentRatio: _, ...rest } = prev;
          return rest;
        });
      }

      setTestingAgentRatio(value);
    },
    []
  );

  /**
   * Reset all settings to their default values
   */
  const handleResetToDefaults = useCallback(() => {
    setModel(DEFAULT_SETTINGS.model);
    setProvider(DEFAULT_SETTINGS.provider);
    setConcurrency(DEFAULT_SETTINGS.concurrency);
    setYoloMode(DEFAULT_SETTINGS.yoloMode);
    setTestingAgentRatio(DEFAULT_SETTINGS.testingAgentRatio);
    setErrors({});
    setSubmitMessage(null);
  }, []);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate all fields
      const newErrors: FormErrors = {};

      const concurrencyNum = parseInt(concurrency, 10);
      if (isNaN(concurrencyNum) || concurrencyNum < 1 || concurrencyNum > 5) {
        newErrors.concurrency = "Concurrency must be a number between 1 and 5";
      }

      const ratioNum = parseInt(testingAgentRatio, 10);
      if (isNaN(ratioNum) || ratioNum < 0 || ratioNum > 3) {
        newErrors.testingAgentRatio =
          "Testing agent ratio must be a number between 0 and 3";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setIsSubmitting(true);
      setSubmitMessage(null);

      const formData: SettingsFormData = {
        model,
        provider,
        concurrency: concurrencyNum,
        yoloMode,
        testingAgentRatio: ratioNum,
      };

      // If we have a project name and API base URL, save to API
      if (projectName && apiBaseUrl) {
        try {
          const response = await fetch(
            `${apiBaseUrl}/projects/${projectName}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.error || `HTTP ${response.status}: ${response.statusText}`
            );
          }

          setSubmitMessage({ type: "success", text: "Settings saved successfully" });
          onSave?.(formData);
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Failed to save settings";
          setSubmitMessage({ type: "error", text: message });
          showToast({
            type: "error",
            title: "Failed to save settings",
            description: message,
          });
        }
      } else {
        // Just call the callback if no API
        onSave?.(formData);
      }

      setIsSubmitting(false);
    },
    [
      model,
      provider,
      concurrency,
      yoloMode,
      testingAgentRatio,
      projectName,
      apiBaseUrl,
      onSave,
      showToast,
    ]
  );

  return (
    <>
      {/* Unsaved changes confirmation dialog */}
      <UnsavedChangesDialog
        isOpen={showUnsavedDialog}
        onStay={cancelLeave}
        onLeave={confirmLeave}
        message={dialogMessage}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Model Field */}
      <div>
        <label
          htmlFor="settings-model"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Model
        </label>
        <input
          type="text"
          id="settings-model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="e.g., claude-3-opus, gpt-4"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Provider Field */}
      <div>
        <label
          htmlFor="settings-provider"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Provider
        </label>
        <input
          type="text"
          id="settings-provider"
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          placeholder="e.g., anthropic, openai"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Concurrency Field - Numeric only */}
      <div>
        <label
          htmlFor="settings-concurrency"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Concurrency (1-5)
        </label>
        <input
          ref={concurrencyInputRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          id="settings-concurrency"
          value={concurrency}
          onChange={handleConcurrencyChange}
          onKeyDown={handleNumericKeyDown}
          onPaste={(e) => handleNumericPaste(e, setConcurrency, 1, 5)}
          placeholder="3"
          aria-describedby={errors.concurrency ? "concurrency-error" : undefined}
          aria-invalid={!!errors.concurrency}
          className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.concurrency
              ? "border-red-500 dark:border-red-400"
              : "border-gray-300 dark:border-gray-600"
          }`}
        />
        {errors.concurrency && (
          <p
            id="concurrency-error"
            role="alert"
            className="mt-1 text-sm text-red-600 dark:text-red-400"
          >
            {errors.concurrency}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Number of parallel coding agents (only numbers allowed)
        </p>
      </div>

      {/* YOLO Mode Toggle */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="settings-yolo-mode"
          checked={yoloMode}
          onChange={(e) => setYoloMode(e.target.checked)}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label
          htmlFor="settings-yolo-mode"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          YOLO Mode
          <span className="block text-xs text-gray-500 dark:text-gray-400">
            Skip browser testing for rapid prototyping
          </span>
        </label>
      </div>

      {/* Testing Agent Ratio Field - Numeric only */}
      <div>
        <label
          htmlFor="settings-testing-agent-ratio"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Testing Agent Ratio (0-3)
        </label>
        <input
          ref={testingAgentRatioInputRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          id="settings-testing-agent-ratio"
          value={testingAgentRatio}
          onChange={handleTestingAgentRatioChange}
          onKeyDown={handleNumericKeyDown}
          onPaste={(e) => handleNumericPaste(e, setTestingAgentRatio, 0, 3)}
          placeholder="1"
          aria-describedby={
            errors.testingAgentRatio ? "testing-ratio-error" : undefined
          }
          aria-invalid={!!errors.testingAgentRatio}
          className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.testingAgentRatio
              ? "border-red-500 dark:border-red-400"
              : "border-gray-300 dark:border-gray-600"
          }`}
        />
        {errors.testingAgentRatio && (
          <p
            id="testing-ratio-error"
            role="alert"
            className="mt-1 text-sm text-red-600 dark:text-red-400"
          >
            {errors.testingAgentRatio}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Number of testing agents per coding agent (only numbers allowed)
        </p>
      </div>

      {/* Submit Message */}
      {submitMessage && (
        <div
          role="alert"
          className={`p-3 rounded-lg text-sm ${
            submitMessage.type === "success"
              ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
              : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
          }`}
        >
          {submitMessage.text}
        </div>
      )}

        {/* Form Actions */}
        <div className="flex gap-3 flex-wrap">
          <button
            type="submit"
            disabled={isSubmitting || Object.keys(errors).length > 0}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Save Settings"}
          </button>
          <button
            type="button"
            onClick={handleResetToDefaults}
            disabled={isSubmitting}
            aria-label="Reset to Defaults"
            className="px-4 py-2 text-sm font-medium text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset to Defaults
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </>
  );
}
