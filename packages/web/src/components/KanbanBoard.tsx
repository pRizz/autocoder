/**
 * KanbanBoard component - displays features in three columns: To Do, In Progress, Done
 *
 * Fetches features from the API and renders them in appropriate columns based on status.
 * Optimized for performance with many features using virtualization-ready patterns.
 * Supports filtering by category.
 * Filter state is persisted in URL search params for preservation across navigation.
 */

import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useSearchParams } from "react-router-dom";
import { Download, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, X } from "lucide-react";
import { CategoryFilter } from "./CategoryFilter";
import { StatusFilter } from "./StatusFilter";
import { FeatureDetailModal, type Feature } from "./FeatureDetailModal";

// Pagination configuration
const FEATURES_PER_PAGE = 20;

// Re-export Feature type from FeatureDetailModal
export type { Feature };

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
  onClick?: (feature: Feature) => void;
}

/**
 * Memoized FeatureCard to prevent unnecessary re-renders
 */
const FeatureCard = memo(function FeatureCard({
  feature,
  onClick,
}: FeatureCardProps): JSX.Element {
  const localTime = formatLocalTimestamp(feature.createdAt);
  // Also get full local datetime for tooltip (accessible via title attribute)
  const fullLocalTime = new Date(feature.createdAt).toLocaleString();

  const handleClick = useCallback(() => {
    onClick?.(feature);
  }, [feature, onClick]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick?.(feature);
      }
    },
    [feature, onClick]
  );

  return (
    <div
      className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 p-3 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View details for feature: ${feature.name}`}
      data-testid={`feature-card-${feature.id}`}
    >
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
  onFeatureClick?: (feature: Feature) => void;
}

/**
 * Memoized KanbanColumn component
 */
const KanbanColumnComponent = memo(function KanbanColumnComponent({
  column,
  features,
  isLoading,
  onFeatureClick,
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
            <FeatureCard key={feature.id} feature={feature} onClick={onFeatureClick} />
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [features, setFeatures] = useState<Feature[]>([]);
  const [totalFeatures, setTotalFeatures] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Initialize filter state from URL search params for state preservation
  const [selectedCategory, setSelectedCategory] = useState<string>(
    () => searchParams.get("category") ?? ""
  );
  const [selectedStatus, setSelectedStatus] = useState<string>(
    () => searchParams.get("status") ?? ""
  );
  // Initialize page from URL search params for pagination state preservation
  const [currentPage, setCurrentPage] = useState<number>(() => {
    const pageParam = searchParams.get("page");
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    return isNaN(page) || page < 1 ? 1 : page;
  });
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle featureId URL parameter - opens feature detail modal directly from URL
  const featureIdFromUrl = searchParams.get("featureId");

  // Fetch and open feature detail when featureId is in URL
  useEffect(() => {
    if (!featureIdFromUrl) return;

    const featureId = parseInt(featureIdFromUrl, 10);
    if (isNaN(featureId)) return;

    // Check if the feature is already loaded in our features list
    const existingFeature = features.find((f) => f.id === featureId);
    if (existingFeature) {
      setSelectedFeature(existingFeature);
      setIsModalOpen(true);
      return;
    }

    // Fetch the feature from API if not in current page
    const fetchFeature = async () => {
      try {
        const response = await fetch(
          `${apiBaseUrl}/projects/${encodeURIComponent(projectName)}/features/${featureId}`
        );
        if (response.ok) {
          const feature = await response.json();
          setSelectedFeature(feature);
          setIsModalOpen(true);
        }
      } catch (err) {
        console.error("Failed to fetch feature from URL:", err);
      }
    };

    fetchFeature();
  }, [featureIdFromUrl, features, apiBaseUrl, projectName]);

  // Calculate total pages based on total features
  const totalPages = Math.max(1, Math.ceil(totalFeatures / FEATURES_PER_PAGE));

  // Fetch features from API with optional category, status, and pagination filters
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
      // Add pagination parameters
      const offset = (currentPage - 1) * FEATURES_PER_PAGE;
      params.set("limit", String(FEATURES_PER_PAGE));
      params.set("offset", String(offset));

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
      // Set total count from API response (or use features array length as fallback)
      setTotalFeatures(data.total ?? data.features?.length ?? 0);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch features";
      setError(message);
      setFeatures([]);
      setTotalFeatures(0);
    } finally {
      setIsLoading(false);
    }
  }, [projectName, apiBaseUrl, selectedCategory, selectedStatus, currentPage]);

  // Fetch on mount and when project/category changes
  useEffect(() => {
    fetchFeatures();
  }, [fetchFeatures]);

  // Handle category change - updates both state and URL params
  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    // Reset to page 1 when filter changes
    setCurrentPage(1);
    // Update URL search params for state preservation across navigation
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (category) {
        newParams.set("category", category);
      } else {
        newParams.delete("category");
      }
      newParams.delete("page"); // Reset page when filter changes
      return newParams;
    }, { replace: true });
  }, [setSearchParams]);

  // Handle status change - updates both state and URL params
  const handleStatusChange = useCallback((status: string) => {
    setSelectedStatus(status);
    // Reset to page 1 when filter changes
    setCurrentPage(1);
    // Update URL search params for state preservation across navigation
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (status) {
        newParams.set("status", status);
      } else {
        newParams.delete("status");
      }
      newParams.delete("page"); // Reset page when filter changes
      return newParams;
    }, { replace: true });
  }, [setSearchParams]);

  // Handle clear all filters - resets category, status, and page to defaults
  const handleClearFilters = useCallback(() => {
    setSelectedCategory("");
    setSelectedStatus("");
    setCurrentPage(1);
    // Clear all filter-related URL params
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.delete("category");
      newParams.delete("status");
      newParams.delete("page");
      return newParams;
    }, { replace: true });
  }, [setSearchParams]);

  // Check if any filters are active
  const hasActiveFilters = selectedCategory !== "" || selectedStatus !== "";

  // Handle page change - updates both state and URL params for pagination state preservation
  const handlePageChange = useCallback((page: number) => {
    // Clamp page to valid range
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
    // Update URL search params for state preservation across navigation
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (validPage > 1) {
        newParams.set("page", String(validPage));
      } else {
        newParams.delete("page"); // Don't show page=1 in URL
      }
      return newParams;
    }, { replace: true });
  }, [setSearchParams, totalPages]);

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

  // Handle feature card click to open detail modal
  // Also updates URL with featureId for direct linking
  const handleFeatureClick = useCallback((feature: Feature) => {
    setSelectedFeature(feature);
    setIsModalOpen(true);
    // Add featureId to URL for direct linking
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("featureId", String(feature.id));
      return newParams;
    }, { replace: true });
  }, [setSearchParams]);

  // Handle modal open/close state change
  // Removes featureId from URL when modal closes
  const handleModalOpenChange = useCallback((open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setSelectedFeature(null);
      // Remove featureId from URL when closing modal
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.delete("featureId");
        return newParams;
      }, { replace: true });
    }
  }, [setSearchParams]);

  // Export features to JSON file
  const handleExportToJson = useCallback(() => {
    if (features.length === 0) {
      return;
    }

    // Create a clean export object with all features
    const exportData = {
      projectName,
      exportedAt: new Date().toISOString(),
      totalFeatures: features.length,
      features: features.map((f) => ({
        id: f.id,
        priority: f.priority,
        category: f.category,
        name: f.name,
        description: f.description,
        steps: f.steps,
        passes: f.passes === 1,
        inProgress: f.inProgress === 1,
        dependencies: f.dependencies,
        createdAt: f.createdAt,
        updatedAt: f.updatedAt,
      })),
    };

    // Create and trigger download
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${projectName}-features-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [features, projectName]);

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
          <div className="flex gap-2">
            <button
              onClick={handleExportToJson}
              disabled={isLoading || features.length === 0}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors flex items-center gap-1.5"
              aria-label="Export features to JSON"
              title="Export features to JSON file"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={fetchFeatures}
              disabled={isLoading}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
              aria-label="Refresh features"
            >
              {isLoading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>
        <div className="flex gap-4 flex-wrap items-end">
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
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-1.5"
              aria-label="Clear all filters"
              title="Clear all filters and show all features"
              data-testid="clear-filters-button"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          )}
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
            onFeatureClick={handleFeatureClick}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2 flex-shrink-0" data-testid="pagination-controls">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1 || isLoading}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Go to first page"
            title="First page"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Go to previous page"
            title="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300" data-testid="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Go to next page"
            title="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages || isLoading}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Go to last page"
            title="Last page"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Feature Detail Modal */}
      <FeatureDetailModal
        feature={selectedFeature}
        open={isModalOpen}
        onOpenChange={handleModalOpenChange}
      />
    </div>
  );
}
