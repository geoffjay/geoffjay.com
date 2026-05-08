import { useState, useEffect, useMemo } from "react";
import ProjectGrid from "./components/ProjectGrid";
import ProjectSidebar from "./components/ProjectSidebar";
import { Project, ProjectViewMode } from "./types";
import { MOCK_PROJECTS } from "./constants";
import { LayoutGrid, Grid3x3, List as ListIcon } from "lucide-react";

const STORAGE_KEY = "projects-selected-id";
const VIEW_MODE_KEY = "projects-view-mode";

const App: React.FC = () => {
  const [projects] = useState<Project[]>(MOCK_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );
  const [viewMode, setViewMode] = useState<ProjectViewMode>(
    ProjectViewMode.COMFORTABLE,
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load selected project from localStorage on mount
  useEffect(() => {
    const savedId = localStorage.getItem(STORAGE_KEY);
    const savedViewMode = localStorage.getItem(VIEW_MODE_KEY);

    if (
      savedViewMode &&
      Object.values(ProjectViewMode).includes(savedViewMode as ProjectViewMode)
    ) {
      setViewMode(savedViewMode as ProjectViewMode);
    }

    if (savedId && projects.some((p) => p.id === savedId)) {
      setSelectedProjectId(savedId);
    } else if (projects.length > 0) {
      // Default to first project
      setSelectedProjectId(projects[0]?.id ?? null);
    }
  }, [projects]);

  // Save view mode to localStorage
  useEffect(() => {
    localStorage.setItem(VIEW_MODE_KEY, viewMode);
  }, [viewMode]);

  const selectedProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId) ?? null;
  }, [projects, selectedProjectId]);

  const handleProjectClick = (project: Project) => {
    setSelectedProjectId(project.id);
    localStorage.setItem(STORAGE_KEY, project.id);
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto no-scrollbar relative">
          {/* Sticky Header with View Toggles */}
          <div className="sticky top-0 z-20 flex justify-end px-6 py-3 bg-gray-50/95 backdrop-blur-sm border-b border-gray-100">
            <div className="flex items-center gap-1 bg-gray-200/60 p-1 rounded-lg">
              <button
                onClick={() => setViewMode(ProjectViewMode.COMPACT)}
                title="Compact Grid"
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === ProjectViewMode.COMPACT
                    ? "bg-white shadow-sm text-gray-800"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Grid3x3 size={18} />
              </button>
              <button
                onClick={() => setViewMode(ProjectViewMode.COMFORTABLE)}
                title="Comfortable Grid"
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === ProjectViewMode.COMFORTABLE
                    ? "bg-white shadow-sm text-gray-800"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode(ProjectViewMode.LIST)}
                title="List View"
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === ProjectViewMode.LIST
                    ? "bg-white shadow-sm text-gray-800"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <ListIcon size={18} />
              </button>
            </div>
          </div>

          {/* Project Grid */}
          <div className="w-full">
            <ProjectGrid
              projects={projects}
              selectedProjectId={selectedProjectId}
              onProjectClick={handleProjectClick}
              viewMode={viewMode}
            />
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {selectedProject && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-300"
          onClick={handleCloseSidebar}
        />
      )}

      {/* Right Sidebar - Always visible on md+, toggled on mobile */}
      {selectedProject && (
        <ProjectSidebar
          project={selectedProject}
          isOpen={sidebarOpen}
          onClose={handleCloseSidebar}
        />
      )}
    </div>
  );
};

export default App;
