/**
 * Main application component
 */

import { Routes, Route } from "react-router-dom";

export function App(): JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:name" element={<ProjectDetailPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </div>
  );
}

// Placeholder page components - will be implemented by coding agents
function HomePage(): JSX.Element {
  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Open Autocoder
      </h1>
    </div>
  );
}

function ProjectsPage(): JSX.Element {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Projects
      </h1>
    </div>
  );
}

function ProjectDetailPage(): JSX.Element {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Project Detail
      </h1>
    </div>
  );
}

function SettingsPage(): JSX.Element {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Settings
      </h1>
    </div>
  );
}
