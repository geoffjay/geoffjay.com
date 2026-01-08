import { useState } from "react";
import { Project, ProjectTab } from "../types";
import { STATUS_LABELS, STATUS_COLORS } from "../constants";
import {
  Calendar,
  Github,
  ExternalLink,
  Clock,
  Tag,
  FileText,
  Link as LinkIcon,
  Info,
  X,
} from "lucide-react";

interface ProjectSidebarProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectSidebar: React.FC<ProjectSidebarProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<ProjectTab>("overview");

  const tabs: { id: ProjectTab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <Info size={14} /> },
    { id: "details", label: "Details", icon: <FileText size={14} /> },
    { id: "links", label: "Links", icon: <LinkIcon size={14} /> },
  ];

  return (
    <div
      className={`
        fixed inset-y-0 right-0 z-40 w-80 lg:w-96 bg-white border-l border-gray-200 flex flex-col h-full
        transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}
    >
      {/* Close Button - Mobile Only */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 z-50 p-1.5 bg-gray-900/70 text-white rounded-full hover:bg-gray-900 transition-colors md:hidden"
        aria-label="Close sidebar"
      >
        <X size={18} />
      </button>

      {/* Project Image */}
      <div className="relative">
        <div className="aspect-video w-full overflow-hidden bg-gray-100">
          <img
            src={project.imageUrl}
            alt={project.name}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Status overlay */}
        <div
          className={`absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded-md shadow-sm ${STATUS_COLORS[project.status]}`}
        >
          {STATUS_LABELS[project.status]}
        </div>
        {project.featured && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded-md shadow-sm">
            Featured
          </div>
        )}
      </div>

      {/* Project Title */}
      <div className="px-4 py-3 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">{project.name}</h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Progress */}
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">Progress</span>
                <span className="text-gray-500">{project.progress}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
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

            {/* Description */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Description
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex gap-2">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Github size={16} />
                  GitHub
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink size={16} />
                  Live Demo
                </a>
              )}
            </div>
          </div>
        )}

        {activeTab === "details" && (
          <div className="space-y-6">
            {/* Technologies */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Tag size={14} />
                Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Dates */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar size={14} />
                Timeline
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-3">
                  <Clock size={14} className="mt-0.5 text-gray-400" />
                  <div>
                    <span className="block text-gray-900 font-medium">
                      {new Date(project.startDate).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                    <span className="text-xs text-gray-400">Started</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar size={14} className="mt-0.5 text-gray-400" />
                  <div>
                    <span className="block text-gray-900 font-medium">
                      {new Date(project.lastUpdated).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                    <span className="text-xs text-gray-400">Last Updated</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Info */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Status</h3>
              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${STATUS_COLORS[project.status]}`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
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
                <span className="text-sm font-medium">
                  {STATUS_LABELS[project.status]}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "links" && (
          <div className="space-y-4">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div className="p-2 bg-gray-900 rounded-lg text-white">
                  <Github size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    GitHub Repository
                  </span>
                  <span className="block text-xs text-gray-500 truncate">
                    {project.githubUrl}
                  </span>
                </div>
                <ExternalLink
                  size={16}
                  className="text-gray-400 group-hover:text-blue-600 transition-colors"
                />
              </a>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div className="p-2 bg-blue-600 rounded-lg text-white">
                  <ExternalLink size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    Live Demo
                  </span>
                  <span className="block text-xs text-gray-500 truncate">
                    {project.liveUrl}
                  </span>
                </div>
                <ExternalLink
                  size={16}
                  className="text-gray-400 group-hover:text-blue-600 transition-colors"
                />
              </a>
            )}

            {!project.githubUrl && !project.liveUrl && (
              <div className="text-center py-8 text-gray-400">
                <LinkIcon size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No links available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectSidebar;
