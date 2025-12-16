import React from "react";
import { SidebarSection, ViewType, ViewState } from "../types";
import {
  Calendar,
  Image as ImageIcon,
  Heart,
  Folder,
  Hash,
  Clock,
  Search,
} from "lucide-react";

interface SidebarProps {
  sections: SidebarSection[];
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
  searchQuery: string;
  onSearch: (query: string) => void;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  sections,
  currentView,
  onViewChange,
  searchQuery,
  onSearch,
  className = "",
}) => {
  const getIcon = (type: ViewType, id: string) => {
    switch (type) {
      case ViewType.ALL_PHOTOS:
        return <ImageIcon size={18} />;
      case ViewType.FAVORITES:
        return <Heart size={18} />;
      case ViewType.YEAR:
        return <Calendar size={18} />;
      case ViewType.ALBUM:
        return <Folder size={18} />;
      case ViewType.TAG:
        return <Hash size={18} />;
      default:
        return <Clock size={18} />;
    }
  };

  return (
    <aside
      className={`w-64 bg-white border-r border-gray-200 h-full flex flex-col overflow-y-auto no-scrollbar ${className}`}
    >
      <div className="p-6 pb-2">
        <h1 className="text-xl font-bold text-gray-800 mb-6">Photo Library</h1>

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="flex-1 px-3 py-6 space-y-8">
        {sections.map((section, idx) => (
          <div key={`${section.title}-${idx}`}>
            <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive =
                  currentView.type === item.type &&
                  currentView.value === item.value;

                return (
                  <li key={item.id}>
                    <button
                      onClick={() =>
                        onViewChange({ type: item.type, value: item.value })
                      }
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 group
                        ${
                          isActive
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500"}`}
                        >
                          {item.icon || getIcon(item.type, item.id)}
                        </span>
                        {item.label}
                      </span>
                      {item.count !== undefined && (
                        <span
                          className={`text-xs ${isActive ? "text-blue-600" : "text-gray-400"}`}
                        >
                          {item.count}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
