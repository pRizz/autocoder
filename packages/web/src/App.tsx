/**
 * Main application component
 */

import { useState } from "react";
import { Routes, Route, useParams } from "react-router-dom";
import { FeatureSearch } from "./components/FeatureSearch";
import { NewFeatureForm } from "./components/NewFeatureForm";
import { Sidebar } from "./components/Sidebar";
import { KanbanBoard } from "./components/KanbanBoard";
import { SettingsForm } from "./components/SettingsForm";

export function App(): JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<HomePage />} />
          <Route path="/kanban" element={<KanbanPage />} />
          <Route path="/graph" element={<GraphPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:name" element={<ProjectDetailPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  );
}

// Placeholder page components - will be implemented by coding agents
function HomePage(): JSX.Element {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome to Open Autocoder
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Select a view from the sidebar to get started
        </p>
      </div>
    </div>
  );
}

function KanbanPage(): JSX.Element {
  // Default to open-autocoder project for now
  // TODO: Get selected project from context/state
  return (
    <div className="p-8 h-screen">
      <KanbanBoard projectName="open-autocoder" apiBaseUrl="http://localhost:3001/api" />
    </div>
  );
}

function GraphPage(): JSX.Element {
  return (
    <div className="p-8 h-screen">
      <div className="h-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dependency Graph
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Visualize feature dependencies and relationships
          </p>
        </div>

        {/* Graph visualization area */}
        <div className="h-[calc(100%-5rem)] bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center">
          <div className="text-center">
            {/* Graph icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="5" cy="6" r="3" />
              <circle cx="19" cy="6" r="3" />
              <circle cx="12" cy="18" r="3" />
              <line x1="8" y1="6" x2="16" y2="6" />
              <line x1="5" y1="9" x2="12" y2="15" />
              <line x1="19" y1="9" x2="12" y2="15" />
            </svg>
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Dependency Graph View
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
              This view will display an interactive graph showing how features depend on each other.
              Select a project to view its dependency graph.
            </p>
          </div>
        </div>
      </div>
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
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Settings
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <SettingsForm
            projectName="open-autocoder"
            apiBaseUrl="http://localhost:3001/api"
            initialSettings={{
              concurrency: 3,
              yoloMode: false,
              testingAgentRatio: 1,
            }}
            onSave={(settings) => {
              console.log("Settings saved:", settings);
            }}
          />
        </div>
      </div>
    </div>
  );
}
