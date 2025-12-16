import React, { useState, useEffect } from "react";
import { Photo } from "../types";
import { PREDEFINED_TAGS } from "../constants";
import {
  X,
  Calendar,
  MapPin,
  Tag,
  Plus,
  Sparkles,
  Loader2,
  HardDrive,
  Maximize,
  FileText,
} from "lucide-react";
import { suggestTagsForImage } from "../services/geminiService";

interface PhotoDrawerProps {
  photo: Photo;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTags: (photoId: string, newTags: string[]) => void;
}

const PhotoDrawer: React.FC<PhotoDrawerProps> = ({
  photo,
  isOpen,
  onClose,
  onUpdateTags,
}) => {
  const [tagInput, setTagInput] = useState("");
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);

  useEffect(() => {
    setTagInput("");
    setSuggestionError(null);
  }, [photo]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !photo.tags.includes(trimmedTag)) {
      onUpdateTags(photo.id, [...photo.tags, trimmedTag]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdateTags(
      photo.id,
      photo.tags.filter((tag) => tag !== tagToRemove),
    );
  };

  const handleSmartTag = async () => {
    setIsSuggesting(true);
    setSuggestionError(null);
    try {
      const response = await fetch(photo.url);
      const blob = await response.blob();

      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        const base64Content = base64data.split(",")[1];

        try {
          const suggestedTags = await suggestTagsForImage(
            base64Content,
            photo.tags,
          );
          if (suggestedTags.length > 0) {
            const uniqueNewTags = suggestedTags.filter(
              (t) => !photo.tags.includes(t),
            );
            if (uniqueNewTags.length > 0) {
              onUpdateTags(photo.id, [...photo.tags, ...uniqueNewTags]);
            }
          }
        } catch (err) {
          setSuggestionError("AI failed to analyze.");
        } finally {
          setIsSuggesting(false);
        }
      };
    } catch (e) {
      console.error(e);
      setSuggestionError("Cannot analyze remote image.");
      setIsSuggesting(false);
    }
  };

  const filteredPredefined = PREDEFINED_TAGS.filter(
    (t) =>
      t.toLowerCase().includes(tagInput.toLowerCase()) &&
      !photo.tags.includes(t),
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/5 z-30 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-40 transform transition-transform duration-300 ease-in-out border-l border-gray-100 overflow-y-auto flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-gray-800">Details</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8 flex-1">
          {/* Preview Image */}
          <div className="rounded-lg overflow-hidden border border-gray-100 bg-gray-50 shadow-sm">
            <img
              src={photo.url}
              alt={photo.title}
              className="w-full h-auto object-cover max-h-64"
            />
          </div>

          {/* Info Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Information
            </h3>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <FileText size={16} className="mt-0.5 text-gray-400" />
                <div>
                  <span className="block text-gray-900 font-medium break-all">
                    {photo.filename || photo.title}
                  </span>
                  <span className="text-xs text-gray-400">File Name</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar size={16} className="mt-0.5 text-gray-400" />
                <div>
                  <span className="block text-gray-900 font-medium">
                    {new Date(photo.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="text-xs text-gray-400">Date Taken</span>
                </div>
              </div>

              {photo.location && (
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="mt-0.5 text-gray-400" />
                  <div>
                    <span className="block text-gray-900 font-medium">
                      {photo.location}
                    </span>
                    <span className="text-xs text-gray-400">Location</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2">
                {photo.resolution && (
                  <div className="flex items-start gap-3">
                    <Maximize size={16} className="mt-0.5 text-gray-400" />
                    <div>
                      <span className="block text-gray-900 font-medium">
                        {photo.resolution}
                      </span>
                      <span className="text-xs text-gray-400">Resolution</span>
                    </div>
                  </div>
                )}
                {photo.size && (
                  <div className="flex items-start gap-3">
                    <HardDrive size={16} className="mt-0.5 text-gray-400" />
                    <div>
                      <span className="block text-gray-900 font-medium">
                        {photo.size}
                      </span>
                      <span className="text-xs text-gray-400">Size</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Tags Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                <Tag size={14} /> Tags
              </h3>
              <button
                onClick={handleSmartTag}
                disabled={isSuggesting}
                className="text-xs flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-all disabled:opacity-50"
              >
                {isSuggesting ? (
                  <Loader2 size={10} className="animate-spin" />
                ) : (
                  <Sparkles size={10} />
                )}
                {isSuggesting ? "Analyzing..." : "Auto-Tag"}
              </button>
            </div>

            {suggestionError && (
              <p className="text-xs text-red-500">{suggestionError}</p>
            )}

            {/* Tag Input */}
            <div className="relative group">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddTag(tagInput);
                }}
                placeholder="Add a tag..."
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm placeholder:text-gray-400"
              />

              {/* Autocomplete */}
              {tagInput && filteredPredefined.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-40 overflow-y-auto">
                  {filteredPredefined.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleAddTag(tag)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                    >
                      {tag}
                      <Plus size={12} className="text-gray-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tag Cloud */}
            <div className="flex flex-wrap gap-2">
              {photo.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
              {photo.tags.length === 0 && (
                <span className="text-xs text-gray-400 italic">
                  No tags added yet.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PhotoDrawer;
