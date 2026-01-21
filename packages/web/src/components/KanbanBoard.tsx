/**
 * KanbanBoard component - displays features in three columns: To Do, In Progress, Done
 *
 * Fetches features from the API and renders them in appropriate columns based on status.
 * Optimized for performance with many features using virtualization-ready patterns.
 * Supports filtering by category.
 */

import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { CategoryFilter } from "./CategoryFilter";
import { StatusFilter } from "./StatusFilter";

interface Feature {
  id: number;
  name: string;
  description: string;
  category: string;
  passes: number;
  inProgress: number;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  color: string;
}

const columns: KanbanColumn[] = [
  { id: "todo", title: "To Do", color: "border-yellow-400" },
  { id: "in-progress", title: "In Progress", color: "border-blue-400" },
  { id: "done", title: "Done", color: "border-green-400" },
];

/**
 * Format an ISO timestamp in the user's local timezone
 * Shows relative time for recent dates, full date for older ones
 */
function formatLocalTimestamp(isoTimestamp: string): string {
  const date = new Date(isoTimestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Relative time for recent timestamps
  if (diffMins < 1) {
    return "just now";
  } else if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  // For older timestamps, show local date/time
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

interface FeatureCardProps {
  feature: Feature;
}

/**
 * Memoized FeatureCard to prevent unnecessary re-renders
 */
const FeatureCard = memo(function FeatureCard({
  feature,
}: FeatureCardProps): JSX.Element {
  const localTime = formatLocalTimestamp(feature.createdAt);
  // Also get full local datetime for tooltip (accessible via title attribute)
  const fullLocalTime = new Date(feature.createdAt).toLocaleString();

  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 p-3">
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {feature.category}
      </span>
      <h4 className="text-sm font-medium text-gray-900 dark:text-white mt-1">
        {feature.name}
      </h4>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
        #{feature.id} &middot; Priority: {feature.priority}
      </p>
      <p
        className="text-xs text-gray-400 dark:text-gray-500 mt-1"
        title={fullLocalTime}
        data-testid="feature-created-at"
      >
        Created: {localTime}
      </p>
    </div>
  );
});

interface KanbanColumnProps {
  column: KanbanColumn;
  features: Feature[];
  isLoading: boolean;
}

/**
 * Memoized KanbanColumn component
 */
const KanbanColumnComponent = memo(function KanbanColumnComponent({
  column,
  features,
  isLoading,
}: KanbanColumnProps): JSX.Element {
  return (
    <div
      className={`bg-gray-50 dark:bg-gray-800 rounded-lg border-t-4 ${column.color} flex flex-col min-h-0`}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            {column.title}
          </h3>
          <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 rounded-full">
            {features.length}
          </span>
        </div>
      </div>

      {/* Column Content - scrollable */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto min-h-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <svg
              className="animate-spin h-6 w-6 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              aria-label="Loading features"
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
          </div>
        ) : features.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
            No features
          </p>
        ) : (
          features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))
        )}
      </div>
    </div>
  );
});

interface KanbanBoardProps {
  projectName?: string;
  apiBaseUrl?: string;
}

export function KanbanBoard({
  projectName = "open-autocoder",
  apiBaseUrl = "http://localhost:3001/api",
}: KanbanBoardProps): JSX.Element {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // Fetch features from API with optional category and status filters
  const fetchFeatures = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (selectedCategory) {
        params.set("category", selectedCategory);
      }
      // Map status filter to API query params
      if (selectedStatus === "passing") {
        params.set("passes", "true");
      } else if (selectedStatus === "pending") {
        params.set("passes", "false");
        params.set("inProgress", "false");
      } else if (selectedStatus === "in-progress") {
        params.set("inProgress", "true");
      }

      let url = `${apiBaseUrl}/projects/${encodeURIComponent(projectName)}/features`;
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error ?? `Failed to fetch features: ${response.statusText}`
        );
      }

      const data = await response.json();
      setFeatures(data.features ?? []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch features";
      setError(message);
      setFeatures([]);
    } finally {
      setIsLoading(false);
    }
  }, [projectName, apiBaseUrl, selectedCategory, selectedStatus]);

  // Fetch on mount and when project/category changes
  useEffect(() => {
    fetchFeatures();
  }, [fetchFeatures]);

  // Handle category change
  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  // Handle status change
  const handleStatusChange = useCallback((status: string) => {
    setSelectedStatus(status);
  }, []);

  // Memoize filtered features for each column
  const todoFeatures = useMemo(
    () =>
      features
        .filter((f) => f.passes === 0 && f.inProgress === 0)
        .sort((a, b) => a.priority - b.priority),
    [features]
  );

  const inProgressFeatures = useMemo(
    () =>
      features
        .filter((f) => f.inProgress === 1)
        .sort((a, b) => a.priority - b.priority),
    [features]
  );

  const doneFeatures = useMemo(
    () =>
      features
        .filter((f) => f.passes === 1)
        .sort((a, b) => a.priority - b.priority),
    [features]
  );

  // Map column IDs to feature arrays
  const getColumnFeatures = useCallback(
    (columnId: string): Feature[] => {
      switch (columnId) {
        case "todo":
          return todoFeatures;
        case "in-progress":
          return inProgressFeatures;
        case "done":
          return doneFeatures;
        default:
          return [];
      }
    },
    [todoFeatures, inProgressFeatures, doneFeatures]
  );

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Kanban Board
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Track feature progress across development stages
              {features.length > 0 && ` (${features.length} features${selectedCategory ? ` in "${selectedCategory}"` : ""}${selectedStatus ? `, status: "${selectedStatus}"` : ""})`}
            </p>
          </div>
          <button
            onClick={fetchFeatures}
            disabled={isLoading}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
            aria-label="Refresh features"
          >
            {isLoading ? "Loading..." : "Refresh"}
          </button>
        </div>
        <div className="flex gap-4 flex-wrap">
          <div className="w-48">
            <CategoryFilter
              projectName={projectName}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              apiBaseUrl={apiBaseUrl}
            />
          </div>
          <div className="w-48">
            <StatusFilter
              selectedStatus={selectedStatus}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>
      </div>

      {error && (
        <div
          className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex-shrink-0"
          role="alert"
        >
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          <button
            onClick={fetchFeatures}
            className="mt-2 text-sm text-red-600 dark:text-red-400 underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">
        {columns.map((column) => (
          <KanbanColumnComponent
            key={column.id}
            column={column}
            features={getColumnFeatures(column.id)}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
}
