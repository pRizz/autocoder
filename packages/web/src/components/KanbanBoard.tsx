/**
 * KanbanBoard component - displays features in three columns: To Do, In Progress, Done
 */

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

// Placeholder feature card for demonstration
interface FeatureCardProps {
  title: string;
  category: string;
}

function FeatureCard({ title, category }: FeatureCardProps): JSX.Element {
  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 p-3">
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {category}
      </span>
      <h4 className="text-sm font-medium text-gray-900 dark:text-white mt-1">
        {title}
      </h4>
    </div>
  );
}

export function KanbanBoard(): JSX.Element {
  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Kanban Board
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Track feature progress across development stages
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6 h-[calc(100%-5rem)]">
        {columns.map((column) => (
          <div
            key={column.id}
            className={`bg-gray-50 dark:bg-gray-800 rounded-lg border-t-4 ${column.color} flex flex-col`}
          >
            {/* Column Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  {column.title}
                </h3>
                <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 rounded-full">
                  {column.id === "todo" ? 3 : column.id === "in-progress" ? 1 : 2}
                </span>
              </div>
            </div>

            {/* Column Content */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              {column.id === "todo" && (
                <>
                  <FeatureCard title="User authentication flow" category="security" />
                  <FeatureCard title="Dashboard layout" category="ui" />
                  <FeatureCard title="API error handling" category="core" />
                </>
              )}
              {column.id === "in-progress" && (
                <FeatureCard title="Sidebar navigation" category="navigation" />
              )}
              {column.id === "done" && (
                <>
                  <FeatureCard title="Project setup" category="infrastructure" />
                  <FeatureCard title="Initial routing" category="navigation" />
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
