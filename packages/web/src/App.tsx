/**
 * Main application component
 */

import { useState } from "react";
import { Routes, Route, useParams } from "react-router-dom";
import { FeatureSearch } from "./components/FeatureSearch";
import { NewFeatureForm } from "./components/NewFeatureForm";

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
  const { name } = useParams<{ name: string }>();
  const [showNewFeatureForm, setShowNewFeatureForm] = useState(false);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Project: {name}
      </h1>

      {/* Feature Search Section */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Search Features
        </h2>
        {name ? (
          <FeatureSearch
            projectName={name}
            apiBaseUrl="http://localhost:3001/api"
            onSearchResults={(features, query) => {
              console.log(`Search for "${query}" returned ${features.length} results`);
            }}
          />
        ) : (
          <p className="text-gray-500">No project selected</p>
        )}
      </section>

      {/* New Feature Section */}
      <section className="mb-8">
        {!showNewFeatureForm ? (
          <button
            onClick={() => setShowNewFeatureForm(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add New Feature
          </button>
        ) : name ? (
          <NewFeatureForm
            projectName={name}
            apiBaseUrl="http://localhost:3001/api"
            onFeatureCreated={(feature) => {
              console.log("Feature created:", feature);
              setShowNewFeatureForm(false);
            }}
            onCancel={() => setShowNewFeatureForm(false)}
          />
        ) : (
          <p className="text-gray-500">No project selected</p>
        )}
      </section>
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
