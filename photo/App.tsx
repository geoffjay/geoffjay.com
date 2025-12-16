import React, { useState, useMemo, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar";
import PhotoGrid from "./components/PhotoGrid";
import PhotoModal from "./components/PhotoModal";
import PhotoDrawer from "./components/PhotoDrawer";
import LoginPage from "./components/LoginPage";
import {
  Photo,
  Album,
  SidebarSection,
  ViewType,
  ViewState,
  PhotoViewMode,
} from "./types";
import { MOCK_PHOTOS, MOCK_ALBUMS } from "./constants";
import { LayoutGrid, Grid3x3, List as ListIcon } from "lucide-react";

const App: React.FC = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // App State
  const [photos, setPhotos] = useState<Photo[]>(MOCK_PHOTOS);
  const [currentView, setCurrentView] = useState<ViewState>({
    type: ViewType.ALL_PHOTOS,
  });
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false); // Controls animation state
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<PhotoViewMode>(
    PhotoViewMode.COMFORTABLE,
  );

  // Check Authentication on Mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if ((window as any).aistudio) {
          const hasKey = await (window as any).aistudio.hasSelectedApiKey();
          setIsAuthenticated(hasKey);
        } else {
          // Fallback if not running in the specific AI Studio environment, assume authenticated if key exists
          setIsAuthenticated(!!process.env.API_KEY);
        }
      } catch (e) {
        console.error("Auth check failed", e);
        setIsAuthenticated(false);
      } finally {
        setIsLoadingAuth(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async () => {
    try {
      if ((window as any).aistudio) {
        await (window as any).aistudio.openSelectKey();
        // Mitigate race condition by assuming success after dialog interaction
        setIsAuthenticated(true);
      } else {
        // Fallback for demo/dev
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.error("Login failed", e);
      // If "Requested entity was not found", we might need to prompt again, but we'll stay on login page
    }
  };

  // Derived Data: Years
  const years = useMemo(() => {
    const uniqueYears = Array.from(
      new Set(photos.map((p) => new Date(p.date).getFullYear())),
    ).sort((a: number, b: number) => b - a);
    return uniqueYears.map(String);
  }, [photos]);

  // Derived Data: Counts
  const counts = useMemo(() => {
    return {
      all: photos.length,
      favorites: photos.filter((p) => p.isFavorite).length,
    };
  }, [photos]);

  // Sidebar Configuration
  const sidebarSections: SidebarSection[] = [
    {
      title: "Library",
      items: [
        {
          id: "all",
          label: "All Photos",
          type: ViewType.ALL_PHOTOS,
          value: "all",
          count: counts.all,
        },
        {
          id: "fav",
          label: "Favorites",
          type: ViewType.FAVORITES,
          value: "favorites",
          count: counts.favorites,
        },
      ],
    },
    {
      title: "Albums",
      items: MOCK_ALBUMS.map((album) => ({
        id: album.id,
        label: album.name,
        type: ViewType.ALBUM,
        value: album.id,
      })),
    },
    {
      title: "Years",
      items: years.map((year) => ({
        id: `year-${year}`,
        label: year,
        type: ViewType.YEAR,
        value: year,
        count: photos.filter(
          (p) => new Date(p.date).getFullYear().toString() === year,
        ).length,
      })),
    },
  ];

  // Filtering Logic
  const filteredPhotos = useMemo(() => {
    let result = photos;

    // View Filtering
    switch (currentView.type) {
      case ViewType.FAVORITES:
        result = result.filter((p) => p.isFavorite);
        break;
      case ViewType.ALBUM:
        if (currentView.value === "a1")
          result = result.filter((p) => p.tags.includes("Travel"));
        else if (currentView.value === "a2")
          result = result.filter(
            (p) => p.tags.includes("Work") || p.tags.includes("Tech"),
          );
        else if (currentView.value === "a3")
          result = result.filter(
            (p) => p.tags.includes("Urban") || p.tags.includes("Nature"),
          );
        break;
      case ViewType.YEAR:
        result = result.filter(
          (p) =>
            new Date(p.date).getFullYear().toString() === currentView.value,
        );
        break;
      case ViewType.TAG:
        result = result.filter((p) => p.tags.includes(currentView.value || ""));
        break;
    }

    // Search Filtering
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location?.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    return result;
  }, [photos, currentView, searchQuery]);

  // Handlers
  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p)),
    );
    if (selectedPhoto?.id === id) {
      setSelectedPhoto((prev) =>
        prev ? { ...prev, isFavorite: !prev.isFavorite } : null,
      );
    }
  };

  const handleUpdateTags = (photoId: string, newTags: string[]) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, tags: newTags } : p)),
    );
    if (selectedPhoto?.id === photoId) {
      setSelectedPhoto((prev) => (prev ? { ...prev, tags: newTags } : null));
    }
  };

  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePhotoClick = (photo: Photo) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setSelectedPhoto(photo);
    // Use requestAnimationFrame to ensure the component mounts in a closed state first,
    // then transitions to open state for the enter animation.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsDetailOpen(true);
      });
    });
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    // Wait for the exit animation (300ms) to finish before unmounting the component
    closeTimeoutRef.current = setTimeout(() => {
      setSelectedPhoto(null);
    }, 300);
  };

  if (isLoadingAuth) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-gray-400 text-sm font-medium animate-pulse">
          Initializing...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        sections={sidebarSections}
        currentView={currentView}
        onViewChange={setCurrentView}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        className="hidden md:flex flex-shrink-0"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50 relative">
        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto no-scrollbar relative">
          {/* Sticky Header with View Toggles */}
          <div className="sticky top-0 z-20 flex justify-end px-6 py-3 bg-gray-50">
            <div className="flex items-center gap-1 bg-gray-200/60 p-1 rounded-lg">
              <button
                onClick={() => setViewMode(PhotoViewMode.COMPACT)}
                title="Compact Grid"
                className={`p-1.5 rounded-md transition-all ${viewMode === PhotoViewMode.COMPACT ? "bg-white shadow-sm text-gray-800" : "text-gray-500 hover:text-gray-700"}`}
              >
                <Grid3x3 size={18} />
              </button>
              <button
                onClick={() => setViewMode(PhotoViewMode.COMFORTABLE)}
                title="Comfortable Grid"
                className={`p-1.5 rounded-md transition-all ${viewMode === PhotoViewMode.COMFORTABLE ? "bg-white shadow-sm text-gray-800" : "text-gray-500 hover:text-gray-700"}`}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode(PhotoViewMode.LIST)}
                title="List View"
                className={`p-1.5 rounded-md transition-all ${viewMode === PhotoViewMode.LIST ? "bg-white shadow-sm text-gray-800" : "text-gray-500 hover:text-gray-700"}`}
              >
                <ListIcon size={18} />
              </button>
            </div>
          </div>

          <div className="max-w-7xl mx-auto w-full">
            {/* Grid */}
            <PhotoGrid
              photos={filteredPhotos}
              onPhotoClick={handlePhotoClick}
              onToggleFavorite={handleToggleFavorite}
              viewMode={viewMode}
            />
          </div>
        </main>

        {/* Desktop Drawer */}
        <div className="hidden md:block">
          {selectedPhoto && (
            <PhotoDrawer
              photo={selectedPhoto}
              isOpen={isDetailOpen}
              onClose={handleCloseDetail}
              onUpdateTags={handleUpdateTags}
            />
          )}
        </div>
      </div>

      {/* Mobile Modal */}
      <div className="md:hidden">
        {selectedPhoto && (
          <PhotoModal
            photo={selectedPhoto}
            isOpen={isDetailOpen}
            onClose={handleCloseDetail}
            onUpdateTags={handleUpdateTags}
          />
        )}
      </div>
    </div>
  );
};

export default App;
