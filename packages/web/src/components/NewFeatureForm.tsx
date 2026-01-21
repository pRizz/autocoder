/**
 * New Feature Form Component
 *
 * A form for creating new features with required field validation.
 * Validates that name, category, description, and at least one step are provided.
 * Shows unsaved changes warning when navigating away with unsaved data.
 */

import { useState, useCallback, useMemo, type FormEvent } from "react";
import { useUnsavedChanges } from "../hooks/useUnsavedChanges";
import { UnsavedChangesDialog } from "./UnsavedChangesDialog";

interface NewFeatureFormProps {
  projectName: string;
  onFeatureCreated?: (feature: Feature) => void;
  onCancel?: () => void;
  apiBaseUrl?: string;
}

interface Feature {
  id: number;
  name: string;
  description: string;
  category: string;
  passes: number;
  inProgress: number;
  priority: number;
  steps: string[];
}

interface FormErrors {
  name?: string;
  category?: string;
  description?: string;
  steps?: string;
  submit?: string;
}

interface NetworkError {
  message: string;
  isNetworkError: boolean;
}

export function NewFeatureForm({
  projectName,
  onFeatureCreated,
  onCancel,
  apiBaseUrl = "/api",
}: NewFeatureFormProps): JSX.Element {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [stepsText, setStepsText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [networkError, setNetworkError] = useState<NetworkError | null>(null);
  const [lastSubmitData, setLastSubmitData] = useState<{
    name: string;
    category: string;
    description: string;
    steps: string[];
  } | null>(null);

  // Track if form has unsaved changes (any field has content)
  const hasUnsavedChanges = useMemo(() => {
    return (
      name.trim().length > 0 ||
      category.trim().length > 0 ||
      description.trim().length > 0 ||
      stepsText.trim().length > 0
    );
  }, [name, category, description, stepsText]);

  // Use the unsaved changes hook for navigation blocking
  const {
    showDialog: showUnsavedDialog,
    confirmLeave,
    cancelLeave,
    dialogMessage,
  } = useUnsavedChanges({
    hasUnsavedChanges,
    message: "You have unsaved changes in the feature form. Are you sure you want to leave? Your changes will be lost.",
  });

  /**
   * Validates all form fields and returns validation errors
   */
  const validateForm = useCallback((): FormErrors => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!category.trim()) {
      newErrors.category = "Category is required";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    }

    const steps = stepsText
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (steps.length === 0) {
      newErrors.steps = "At least one step is required";
    }

    return newErrors;
  }, [name, category, description, stepsText]);

  /**
   * Validates a single field
   */
  const validateField = useCallback(
    (fieldName: string): string | undefined => {
      switch (fieldName) {
        case "name":
          return !name.trim() ? "Name is required" : undefined;
        case "category":
          return !category.trim() ? "Category is required" : undefined;
        case "description":
          return !description.trim() ? "Description is required" : undefined;
        case "steps": {
          const steps = stepsText
            .split("\n")
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
          return steps.length === 0 ? "At least one step is required" : undefined;
        }
        default:
          return undefined;
      }
    },
    [name, category, description, stepsText]
  );

  /**
   * Handles field blur to show validation errors for touched fields
   */
  const handleBlur = (fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    const error = validateField(fieldName);
    setErrors((prev) => ({ ...prev, [fieldName]: error }));
  };

  /**
   * Determines if an error is a network-related error
   */
  const isNetworkRelatedError = (error: unknown): boolean => {
    if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
      return true;
    }
    if (error instanceof Error) {
      const msg = error.message.toLowerCase();
      return (
        msg.includes("network") ||
        msg.includes("connection") ||
        msg.includes("timeout") ||
        msg.includes("failed to fetch") ||
        msg.includes("net::") ||
        msg.includes("econnrefused")
      );
    }
    return false;
  };

  /**
   * Gets a user-friendly error message without technical details
   */
  const getFriendlyErrorMessage = (error: unknown): string => {
    if (isNetworkRelatedError(error)) {
      return "Unable to connect to the server. Please check your internet connection and try again.";
    }

    // For other errors, return a generic message
    // This hides technical details like status codes, stack traces, etc.
    return "Something went wrong while creating the feature. Please try again.";
  };

  /**
   * Submits the feature data to the API
   *
   * Note: For normal form submit, isSubmitting is already set by handleSubmit.
   * For retry, it's set here. Either way, we ensure it's set.
   */
  const submitFeature = async (featureData: {
    name: string;
    category: string;
    description: string;
    steps: string[];
  }) => {
    setIsSubmitting(true);
    setErrors({});
    setNetworkError(null);

    try {
      const response = await fetch(
        `${apiBaseUrl}/projects/${encodeURIComponent(projectName)}/features`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(featureData),
        }
      );

      if (!response.ok) {
        // Server returned an error status - this is not a network error
        const errorData = await response.json().catch(() => ({}));
        // Still show a friendly message, hiding status codes
        const serverMessage = errorData.error;
        if (serverMessage && typeof serverMessage === "string" && !serverMessage.includes("HTTP")) {
          // Show server message if it's user-friendly
          setErrors({ submit: serverMessage });
        } else {
          setErrors({ submit: "Unable to create the feature. Please check your inputs and try again." });
        }
        return;
      }

      const feature = await response.json();

      // Clear form
      setName("");
      setCategory("");
      setDescription("");
      setStepsText("");
      setTouched({});
      setLastSubmitData(null);

      if (onFeatureCreated) {
        onFeatureCreated(feature);
      }
    } catch (err) {
      // Check if this is a network error
      const isNetwork = isNetworkRelatedError(err);
      const friendlyMessage = getFriendlyErrorMessage(err);

      if (isNetwork) {
        // Store the data for retry and show network error UI
        setLastSubmitData(featureData);
        setNetworkError({
          message: friendlyMessage,
          isNetworkError: true,
        });
      } else {
        setErrors({ submit: friendlyMessage });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles form submission
   *
   * IMPORTANT: Sets isSubmitting immediately to prevent double-click creating duplicates.
   * This is the idempotency guard - the button is disabled synchronously before any async work.
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Prevent double-click: immediately disable the button before any async work
    // This must happen synchronously to guard against rapid clicks
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);

    // Mark all fields as touched
    setTouched({
      name: true,
      category: true,
      description: true,
      steps: true,
    });

    // Validate all fields
    const validationErrors = validateForm();
    setErrors(validationErrors);

    // Don't submit if there are validation errors
    if (Object.keys(validationErrors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    const steps = stepsText
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const featureData = {
      name: name.trim(),
      category: category.trim(),
      description: description.trim(),
      steps,
    };

    await submitFeature(featureData);
  };

  /**
   * Handles retry after a network error
   */
  const handleRetry = async () => {
    if (lastSubmitData) {
      await submitFeature(lastSubmitData);
    }
  };

  /**
   * Dismisses the network error and resets state
   */
  const dismissNetworkError = () => {
    setNetworkError(null);
    setLastSubmitData(null);
  };

  const hasErrors = Object.keys(errors).some(
    (key) => errors[key as keyof FormErrors] !== undefined
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

      <form onSubmit={handleSubmit} className="new-feature-form space-y-4 max-w-lg">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Feature</h2>

      {/* Name field */}
      <div>
        <label
          htmlFor="feature-name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="feature-name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (touched.name) {
              setErrors((prev) => ({
                ...prev,
                name: !e.target.value.trim() ? "Name is required" : undefined,
              }));
            }
          }}
          onBlur={() => handleBlur("name")}
          aria-invalid={touched.name && !!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
            touched.name && errors.name
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600"
          }`}
          placeholder="Feature name"
        />
        {touched.name && errors.name && (
          <p id="name-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      {/* Category field */}
      <div>
        <label
          htmlFor="feature-category"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Category <span className="text-red-500">*</span>
        </label>
        <input
          id="feature-category"
          type="text"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            if (touched.category) {
              setErrors((prev) => ({
                ...prev,
                category: !e.target.value.trim() ? "Category is required" : undefined,
              }));
            }
          }}
          onBlur={() => handleBlur("category")}
          aria-invalid={touched.category && !!errors.category}
          aria-describedby={errors.category ? "category-error" : undefined}
          className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
            touched.category && errors.category
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600"
          }`}
          placeholder="e.g., functional, style, security"
        />
        {touched.category && errors.category && (
          <p
            id="category-error"
            className="mt-1 text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {errors.category}
          </p>
        )}
      </div>

      {/* Description field */}
      <div>
        <label
          htmlFor="feature-description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="feature-description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (touched.description) {
              setErrors((prev) => ({
                ...prev,
                description: !e.target.value.trim() ? "Description is required" : undefined,
              }));
            }
          }}
          onBlur={() => handleBlur("description")}
          rows={3}
          aria-invalid={touched.description && !!errors.description}
          aria-describedby={errors.description ? "description-error" : undefined}
          className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
            touched.description && errors.description
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600"
          }`}
          placeholder="Describe what this feature should do"
        />
        {touched.description && errors.description && (
          <p
            id="description-error"
            className="mt-1 text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {errors.description}
          </p>
        )}
      </div>

      {/* Steps field */}
      <div>
        <label
          htmlFor="feature-steps"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Steps <span className="text-red-500">*</span>
          <span className="ml-1 font-normal text-gray-500">(one per line)</span>
        </label>
        <textarea
          id="feature-steps"
          value={stepsText}
          onChange={(e) => {
            setStepsText(e.target.value);
            if (touched.steps) {
              const steps = e.target.value
                .split("\n")
                .map((s) => s.trim())
                .filter((s) => s.length > 0);
              setErrors((prev) => ({
                ...prev,
                steps: steps.length === 0 ? "At least one step is required" : undefined,
              }));
            }
          }}
          onBlur={() => handleBlur("steps")}
          rows={4}
          aria-invalid={touched.steps && !!errors.steps}
          aria-describedby={errors.steps ? "steps-error" : undefined}
          className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm ${
            touched.steps && errors.steps
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600"
          }`}
          placeholder="Step 1: Do something&#10;Step 2: Verify result&#10;Step 3: Check outcome"
        />
        {touched.steps && errors.steps && (
          <p id="steps-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
            {errors.steps}
          </p>
        )}
      </div>

      {/* Network error with retry option */}
      {networkError && (
        <div
          className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg"
          role="alert"
        >
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Connection Error
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                {networkError.message}
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={handleRetry}
                  disabled={isSubmitting}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Retrying..." : "Try Again"}
                </button>
                <button
                  type="button"
                  onClick={dismissNetworkError}
                  disabled={isSubmitting}
                  className="px-3 py-1.5 text-sm font-medium text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200 focus:outline-none"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit error (non-network) */}
      {errors.submit && !networkError && (
        <div
          className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          role="alert"
        >
          <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
        </div>
      )}

      {/* Form actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isSubmitting
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Creating...
            </span>
          ) : (
            "Create Feature"
          )}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Validation summary when attempting to submit with errors */}
      {hasErrors && Object.keys(touched).length === 4 && (
        <p className="text-sm text-gray-500 dark:text-gray-400" aria-live="polite">
          Please fix the errors above before submitting.
        </p>
      )}
      </form>
    </>
  );
}
