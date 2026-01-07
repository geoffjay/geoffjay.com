import { Project, ProjectViewMode } from "../types";
import { STATUS_LABELS, STATUS_COLORS } from "../constants";
import { Calendar, Github, ExternalLink, FolderKanban } from "lucide-react";

interface ProjectGridProps {
  projects: Project[];
  selectedProjectId: string | null;
  onProjectClick: (project: Project) => void;
  viewMode: ProjectViewMode;
}

const ProjectGrid: React.FC<ProjectGridProps> = ({
  projects,
  selectedProjectId,
  onProjectClick,
  viewMode,
}) => {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-gray-400">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
          <FolderKanban size={48} className="text-gray-300" />
        </div>
        <p className="text-lg font-medium">No projects found</p>
        <p className="text-sm">Try changing your filters.</p>
      </div>
    );
  }

  // COMPACT VIEW
  if (viewMode === ProjectViewMode.COMPACT) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 p-6 pb-20">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`group relative aspect-square bg-gray-100 overflow-hidden cursor-pointer rounded-lg shadow-md hover:shadow-lg transition-all ${
              selectedProjectId === project.id
                ? "ring-2 ring-blue-500 ring-offset-2"
                : ""
            }`}
            onClick={() => onProjectClick(project)}
          >
            <img
              src={project.imageUrl}
              alt={project.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-2">
              <span className="text-white text-xs font-medium truncate">
                {project.name}
              </span>
            </div>

            {/* Status indicator */}
            <div
              className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                project.status === "COMPLETED"
                  ? "bg-green-500"
                  : project.status === "IN_PROGRESS"
                    ? "bg-blue-500"
                    : project.status === "PLANNING"
                      ? "bg-purple-500"
                      : project.status === "ON_HOLD"
                        ? "bg-yellow-500"
                        : "bg-gray-400"
              }`}
            />

            {/* Featured badge */}
            {project.featured && (
              <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-amber-500 text-white text-[10px] font-medium rounded">
                Featured
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // LIST VIEW
  if (viewMode === ProjectViewMode.LIST) {
    return (
      <div className="flex flex-col gap-3 p-6 pb-20">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`group flex items-center gap-4 p-3 bg-white rounded-lg border hover:shadow-md transition-all cursor-pointer ${
              selectedProjectId === project.id
                ? "border-blue-500 bg-blue-50/50"
                : "border-gray-100"
            }`}
            onClick={() => onProjectClick(project)}
          >
            {/* Thumbnail */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
              <img
                src={project.imageUrl}
                alt={project.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 items-center">
              {/* Name & Status */}
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {project.name}
                  </h3>
                  {project.featured && (
                    <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-medium rounded">
                      Featured
                    </span>
                  )}
                </div>
                <span
                  className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-medium rounded ${STATUS_COLORS[project.status]}`}
                >
                  {STATUS_LABELS[project.status]}
                </span>
              </div>

              {/* Technologies */}
              <div className="hidden sm:flex flex-wrap gap-1">
                {project.technologies.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-md border border-gray-200"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="px-1.5 py-0.5 bg-gray-50 text-gray-400 text-[10px] rounded-md">
                    +{project.technologies.length - 3}
                  </span>
                )}
              </div>

              {/* Progress */}
              <div className="hidden md:block">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-8">
                    {project.progress}%
                  </span>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="flex-shrink-0 flex items-center gap-1">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Github size={16} />
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                >
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // COMFORTABLE VIEW (Default Cards)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 pb-20">
      {projects.map((project) => (
        <div
          key={project.id}
          className={`group relative bg-white rounded-xl shadow-sm border overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
            selectedProjectId === project.id
              ? "border-blue-500 ring-1 ring-blue-500"
              : "border-gray-100"
          }`}
          onClick={() => onProjectClick(project)}
        >
          {/* Image Container */}
          <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100 relative">
            <img
              src={project.imageUrl}
              alt={project.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Featured Badge */}
            {project.featured && (
              <div className="absolute top-3 left-3 px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded-md shadow-sm">
                Featured
              </div>
            )}

            {/* Status Badge */}
            <div
              className={`absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded-md ${STATUS_COLORS[project.status]}`}
            >
              {STATUS_LABELS[project.status]}
            </div>
          </div>

          {/* Card Details */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-800 truncate">
              {project.name}
            </h3>

            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {project.description}
            </p>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    project.progress === 100
                      ? "bg-green-500"
                      : project.progress >= 50
                        ? "bg-blue-500"
                        : "bg-amber-500"
                  }`}
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            {/* Technologies */}
            {project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {project.technologies.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-md"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="px-1.5 py-0.5 bg-gray-50 text-gray-400 text-[10px] rounded-md">
                    +{project.technologies.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Calendar size={10} />
                {new Date(project.lastUpdated).toLocaleDateString()}
              </span>
              <div className="flex items-center gap-1">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Github size={14} />
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectGrid;
