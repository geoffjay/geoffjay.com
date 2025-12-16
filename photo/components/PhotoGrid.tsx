import React from "react";
import { Photo, PhotoViewMode } from "../types";
import { Heart, MapPin, Calendar, HardDrive, FileImage } from "lucide-react";

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  viewMode: PhotoViewMode;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({
  photos,
  onPhotoClick,
  onToggleFavorite,
  viewMode,
}) => {
  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-gray-400">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
          <Heart size={48} className="text-gray-300" />
        </div>
        <p className="text-lg font-medium">No photos found</p>
        <p className="text-sm">Try changing your filters or add some photos.</p>
      </div>
    );
  }

  // COMPACT VIEW (Grid without details)
  if (viewMode === PhotoViewMode.COMPACT) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 p-6 pb-20">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="group relative aspect-square bg-gray-100 overflow-hidden cursor-pointer rounded-lg shadow-md hover:shadow-lg transition-all"
            onClick={() => onPhotoClick(photo)}
          >
            <img
              src={photo.url}
              alt={photo.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

            {/* Favorite Icon (only visible on hover/active) */}
            <button
              onClick={(e) => onToggleFavorite(photo.id, e)}
              className={`absolute bottom-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-all duration-200
                ${
                  photo.isFavorite
                    ? "bg-red-500/90 text-white opacity-100"
                    : "bg-black/30 text-white opacity-0 group-hover:opacity-100 hover:bg-black/50"
                }`}
            >
              <Heart
                size={14}
                fill={photo.isFavorite ? "currentColor" : "none"}
              />
            </button>
          </div>
        ))}
      </div>
    );
  }

  // LIST VIEW (Row details)
  if (viewMode === PhotoViewMode.LIST) {
    return (
      <div className="flex flex-col gap-3 p-6 pb-20 max-w-5xl mx-auto">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="group flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-all cursor-pointer"
            onClick={() => onPhotoClick(photo)}
          >
            {/* Thumbnail */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center">
              {/* Title & File */}
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-sm font-semibold text-gray-900 truncate">
                  {photo.title}
                </h3>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {photo.filename}
                </p>
                <div className="flex gap-2 mt-2">
                  {photo.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-md border border-gray-200"
                    >
                      {tag}
                    </span>
                  ))}
                  {photo.tags.length > 3 && (
                    <span className="px-1.5 py-0.5 bg-gray-50 text-gray-400 text-[10px] rounded-md border border-gray-200">
                      +{photo.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Meta 1 */}
              <div className="hidden sm:block text-xs text-gray-500 space-y-1">
                <div className="flex items-center gap-1.5">
                  <Calendar size={12} />
                  <span>{new Date(photo.date).toLocaleDateString()}</span>
                </div>
                {photo.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin size={12} />
                    <span className="truncate">{photo.location}</span>
                  </div>
                )}
              </div>

              {/* Meta 2 */}
              <div className="hidden md:block text-xs text-gray-500 space-y-1">
                {photo.resolution && (
                  <div className="flex items-center gap-1.5">
                    <FileImage size={12} />
                    <span>{photo.resolution}</span>
                  </div>
                )}
                {photo.size && (
                  <div className="flex items-center gap-1.5">
                    <HardDrive size={12} />
                    <span>{photo.size}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex-shrink-0 px-2">
              <button
                onClick={(e) => onToggleFavorite(photo.id, e)}
                className={`p-2 rounded-full transition-colors ${
                  photo.isFavorite
                    ? "text-red-500 bg-red-50"
                    : "text-gray-300 hover:text-gray-400 hover:bg-gray-50"
                }`}
              >
                <Heart
                  size={18}
                  fill={photo.isFavorite ? "currentColor" : "none"}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // COMFORTABLE VIEW (Default Cards)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6 pb-20">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="group relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          onClick={() => onPhotoClick(photo)}
        >
          {/* Image Container */}
          <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
            <img
              src={photo.url}
              alt={photo.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Quick Actions Overlay */}
          <button
            onClick={(e) => onToggleFavorite(photo.id, e)}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors duration-200
              ${
                photo.isFavorite
                  ? "bg-red-500 text-white"
                  : "bg-white/70 text-gray-700 hover:bg-white hover:text-red-500 opacity-0 group-hover:opacity-100"
              }`}
          >
            <Heart
              size={16}
              fill={photo.isFavorite ? "currentColor" : "none"}
            />
          </button>

          {/* Card Details */}
          <div className="p-3">
            <h3 className="text-sm font-semibold text-gray-800 truncate">
              {photo.title}
            </h3>
            <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
              <span className="flex items-center gap-1 truncate">
                {photo.location && (
                  <>
                    <MapPin size={10} /> {photo.location}
                  </>
                )}
              </span>
              <span>{new Date(photo.date).getFullYear()}</span>
            </div>
            {/* Tags preview */}
            {photo.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {photo.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-md"
                  >
                    {tag}
                  </span>
                ))}
                {photo.tags.length > 3 && (
                  <span className="px-1.5 py-0.5 bg-gray-50 text-gray-400 text-[10px] rounded-md">
                    +{photo.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhotoGrid;
