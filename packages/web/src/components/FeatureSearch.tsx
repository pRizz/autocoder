/**
 * Feature Search Component
 *
 * Provides a search input to filter features by name.
 */

import { useState, useCallback, useEffect } from "react";

interface Feature {
  id: number;
  name: string;
  description: string;
  category: string;
  passes: number;
  inProgress: number;
  priority: number;
}

interface FeatureSearchProps {
  projectName: string;
  onSearchResults?: (features: Feature[], query: string) => void;
  apiBaseUrl?: string;
}

export function FeatureSearch({
  projectName,
  onSearchResults,
  apiBaseUrl = "/api",
}: FeatureSearchProps): JSX.Element {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Feature[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        performSearch(searchQuery);
      } else {
        setResults([]);
        setHasSearched(false);
        if (onSearchResults) {
          onSearchResults([], "");
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, projectName]);

  const performSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      setHasSearched(true);

      try {
        const url = `${apiBaseUrl}/projects/${encodeURIComponent(projectName)}/features/search?q=${encodeURIComponent(query)}`;
        const response = await fetch(url);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error ?? `Search failed: ${response.statusText}`
          );
        }

        const data = await response.json();
        setResults(data.features ?? []);

        if (onSearchResults) {
          onSearchResults(data.features ?? [], query);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Search failed";
        setError(message);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [projectName, apiBaseUrl, onSearchResults]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClear = () => {
    setSearchQuery("");
    setResults([]);
    setHasSearched(false);
    setError(null);
    if (onSearchResults) {
      onSearchResults([], "");
    }
  };

  return (
    <div className="feature-search w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Search features by name..."
          aria-label="Search features"
          className="w-full px-4 py-2 pl-10 pr-10 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {/* Search icon */}
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {/* Loading indicator or clear button */}
        {isLoading ? (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg
              className="animate-spin h-4 w-4 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              aria-label="Loading"
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
        ) : searchQuery ? (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Clear search"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        ) : null}
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}

      {/* Results count */}
      {hasSearched && !isLoading && !error && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {results.length === 0
            ? "No features found"
            : `Found ${results.length} feature${results.length !== 1 ? "s" : ""}`}
        </p>
      )}

      {/* Results list */}
      {results.length > 0 && (
        <ul className="mt-4 space-y-2" role="list">
          {results.map((feature) => (
            <li
              key={feature.id}
              className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900 dark:text-white">
                  {feature.name}
                </span>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    feature.passes === 1
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : feature.inProgress === 1
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {feature.passes === 1
                    ? "Passing"
                    : feature.inProgress === 1
                      ? "In Progress"
                      : "Pending"}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {feature.category} &middot; Priority: {feature.priority}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
