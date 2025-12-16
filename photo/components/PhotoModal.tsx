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
  Trash2,
  Check,
  Loader2,
} from "lucide-react";
import { suggestTagsForImage } from "../services/geminiService";

interface PhotoModalProps {
  photo: Photo;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTags: (photoId: string, newTags: string[]) => void;
}

const PhotoModal: React.FC<PhotoModalProps> = ({
  photo,
  isOpen,
  onClose,
  onUpdateTags,
}) => {
  const [tagInput, setTagInput] = useState("");
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);

  // Reset state when photo changes or modal opens
  useEffect(() => {
    setTagInput("");
    setSuggestionError(null);
  }, [photo, isOpen]);

  // Handle close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
      // 1. Fetch the image to get a blob (Since most picsum images are cross-origin, this might fail in some browsers without proxy.
      // In a real app, you'd use the uploaded file object or a signed URL.
      // For this demo, we'll try to fetch. If it fails, we catch it.)

      const response = await fetch(photo.url);
      const blob = await response.blob();

      // 2. Convert to Base64
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        // Extract the base64 part (remove "data:image/jpeg;base64,")
        const base64Content = base64data.split(",")[1];

        try {
          const suggestedTags = await suggestTagsForImage(
            base64Content,
            photo.tags,
          );
          if (suggestedTags.length > 0) {
            // Add only new tags
            const uniqueNewTags = suggestedTags.filter(
              (t) => !photo.tags.includes(t),
            );
            if (uniqueNewTags.length > 0) {
              onUpdateTags(photo.id, [...photo.tags, ...uniqueNewTags]);
            }
          }
        } catch (err) {
          setSuggestionError("AI failed to analyze. Try another image.");
        } finally {
          setIsSuggesting(false);
        }
      };
    } catch (e) {
      console.error("Could not fetch image for AI analysis", e);
      setSuggestionError(
        "Cannot analyze remote image (CORS). Upload a local file to test AI.",
      );
      setIsSuggesting(false);
    }
  };

  const filteredPredefined = PREDEFINED_TAGS.filter(
    (t) =>
      t.toLowerCase().includes(tagInput.toLowerCase()) &&
      !photo.tags.includes(t),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        {/* Image Section */}
        <div className="flex-1 bg-gray-900 flex items-center justify-center relative group">
          <img
            src={photo.url}
            alt={photo.title}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        {/* Sidebar Section */}
        <div className="w-full md:w-96 bg-white flex flex-col border-l border-gray-200 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {photo.title}
              </h2>
              <div className="mt-2 space-y-1 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  <span>
                    {new Date(photo.date).toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                {photo.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={14} />
                    <span>{photo.location}</span>
                  </div>
                )}
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Tags Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Tag size={16} /> Tags
                </h3>
                <button
                  onClick={handleSmartTag}
                  disabled={isSuggesting}
                  className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSuggesting ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Sparkles size={12} />
                  )}
                  {isSuggesting ? "Thinking..." : "AI Auto-Tag"}
                </button>
              </div>

              {suggestionError && (
                <p className="text-xs text-red-500 bg-red-50 p-2 rounded">
                  {suggestionError}
                </p>
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
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                />
                <button
                  onClick={() => handleAddTag(tagInput)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 p-1"
                >
                  <Plus size={16} />
                </button>

                {/* Predefined Dropdown (Simple Autocomplete) */}
                {tagInput && filteredPredefined.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-lg shadow-lg z-20 max-h-40 overflow-y-auto">
                    {filteredPredefined.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleAddTag(tag)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                      >
                        {tag}
                        <Plus size={14} className="text-gray-400" />
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
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full border border-gray-200 group/tag hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="w-4 h-4 rounded-full flex items-center justify-center text-gray-400 hover:bg-blue-200 hover:text-blue-700 transition-colors"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
                {photo.tags.length === 0 && (
                  <span className="text-sm text-gray-400 italic">
                    No tags yet
                  </span>
                )}
              </div>
            </div>

            <div className="mt-auto pt-6 text-xs text-gray-400">
              Photo ID: {photo.id}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;
