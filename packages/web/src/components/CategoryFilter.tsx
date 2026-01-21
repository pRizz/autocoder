/**
 * Category Filter Component
 *
 * Provides a dropdown to filter features by category.
 * Fetches unique categories from the API and displays them in a select element.
 */

import { useState, useEffect, useCallback } from "react";

interface CategoryFilterProps {
  projectName: string;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  apiBaseUrl?: string;
}

export function CategoryFilter({
  projectName,
  selectedCategory,
  onCategoryChange,
  apiBaseUrl = "http://localhost:3001/api",
}: CategoryFilterProps): JSX.Element {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch unique categories from all features
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const url = `${apiBaseUrl}/projects/${encodeURIComponent(projectName)}/features`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error ?? `Failed to fetch categories: ${response.statusText}`
        );
      }

      const data = await response.json();
      const features = data.features ?? [];

      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(features.map((f: { category: string }) => f.category))
      ).sort() as string[];

      setCategories(uniqueCategories);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch categories";
      setError(message);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, [projectName, apiBaseUrl]);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onCategoryChange(e.target.value);
  };

  return (
    <div className="category-filter">
      <label
        htmlFor="category-filter"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        Filter by Category
      </label>
      <select
        id="category-filter"
        value={selectedCategory}
        onChange={handleChange}
        disabled={isLoading}
        className="w-full px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
        aria-label="Filter features by category"
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
