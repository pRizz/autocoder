/**
 * Status Filter Component
 *
 * Provides a dropdown to filter features by status (passing, pending, in progress, or all).
 */

interface StatusFilterProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

export function StatusFilter({
  selectedStatus,
  onStatusChange,
}: StatusFilterProps): JSX.Element {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(e.target.value);
  };

  return (
    <div className="status-filter">
      <label
        htmlFor="status-filter"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        Filter by Status
      </label>
      <select
        id="status-filter"
        value={selectedStatus}
        onChange={handleChange}
        className="w-full px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        aria-label="Filter features by status"
      >
        <option value="">All Statuses</option>
        <option value="passing">Passing (Done)</option>
        <option value="pending">Pending (To Do)</option>
        <option value="in-progress">In Progress</option>
      </select>
    </div>
  );
}
