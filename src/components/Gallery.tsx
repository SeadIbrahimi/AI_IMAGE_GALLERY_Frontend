import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ImageCard from "./ImageCard";
import UploadModal from "./UploadModal";
import { Button } from "./ui/button";
import { Upload, ImageOff, X } from "lucide-react";
import { apiService, Image } from "../services/api";
import { LoadingSpinner } from "./LoadingSpinner";

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

// Helper function to format upload time
const formatUploadTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60)
    return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
  if (diffHours < 24)
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30)
    return `${Math.floor(diffDays / 7)} week${
      Math.floor(diffDays / 7) !== 1 ? "s" : ""
    } ago`;
  return `${Math.floor(diffDays / 30)} month${
    Math.floor(diffDays / 30) !== 1 ? "s" : ""
  } ago`;
};

// Helper function to get color name from hex
const getColorName = (hex: string): string => {
  const colorMap: { [key: string]: string } = {
    "#EF4444": "Red",
    "#3B82F6": "Blue",
    "#10B981": "Green",
    "#F59E0B": "Yellow",
    "#8B5CF6": "Purple",
    "#F97316": "Orange",
    "#1F2937": "Black",
    "#F3F4F6": "White",
  };
  return colorMap[hex.toUpperCase()] || hex;
};

export default function Gallery() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  // Fetch images with current filters
  const fetchImages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getImages(
        20, // Changed from 100 to 20 as default
        0,
        searchQuery || undefined,
        selectedTags.length > 0 ? selectedTags : undefined,
        selectedColors.length > 0 ? selectedColors : undefined,
        sortBy !== "recent" ? sortBy : undefined
      );
      setImages(response.images);
      setTotalCount(response.count);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load images";
      setError(message);
      console.error("Failed to fetch images:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchImages();
    }, 500); // 500ms debounce for search

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Immediate fetch on filter/sort changes
  useEffect(() => {
    fetchImages();
  }, [selectedColors, selectedTags, sortBy]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleImageClick = (id: string) => {
    navigate(`/image/${id}`);
  };

  const handleUploadComplete = async () => {
    // Refresh the images list after upload
    await fetchImages();
    setIsUploadModalOpen(false);
  };

  // Convert backend images to display format
  const displayImages = images.map((img) => ({
    id: img.id.toString(),
    filename: img.filename,
    url: img.thumbnail_url,
    originalUrl: img.original_url,
    tags: [] as string[], // Will be populated by backend later
    uploadTime: formatUploadTime(img.uploaded_at),
    status: "complete" as const,
    color: "blue", // Default color, will be populated by AI analysis later
    description: "",
    size: formatFileSize(img.file_size),
    dimensions: "", // Will be populated by backend later
    aiDescription: "",
    dominantColors: [] as string[],
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-800">
      <Header
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        onSearch={handleSearch}
      />

      <div className="flex min-h-screen relative">
        <Sidebar
          selectedColors={selectedColors}
          onColorChange={setSelectedColors}
          selectedTags={selectedTags}
          onTagChange={setSelectedTags}
          sortBy={sortBy}
          onSortChange={setSortBy}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />

        <main className="flex-1 p-8">
          {/* Active Filters Bar */}
          {(searchQuery || selectedColors.length > 0 || selectedTags.length > 0) && (
            <div className="mb-6 flex items-center gap-3 flex-wrap">
              <span className="text-gray-600 dark:text-gray-400">Active filters:</span>
              {searchQuery && (
                <div className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center gap-2">
                  <span className="text-purple-600 dark:text-purple-400 text-sm">
                    Search: "{searchQuery}"
                  </span>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                  </button>
                </div>
              )}
              {selectedTags.map((tag) => (
                <div key={tag} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center gap-2">
                  <span className="text-purple-600 dark:text-purple-400 text-sm">
                    {tag}
                  </span>
                  <button
                    onClick={() => setSelectedTags(selectedTags.filter(t => t !== tag))}
                    className="hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                  </button>
                </div>
              ))}
              {selectedColors.map((color) => (
                <div key={color} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center gap-2">
                  <span className="text-purple-600 dark:text-purple-400 text-sm">
                    {getColorName(color)}
                  </span>
                  <button
                    onClick={() => setSelectedColors(selectedColors.filter(c => c !== color))}
                    className="hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                  </button>
                </div>
              ))}
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedColors([]);
                  setSelectedTags([]);
                  setSortBy("recent");
                }}
                variant="outline"
                className="h-8 text-sm"
              >
                Clear All
              </Button>
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <LoadingSpinner size="lg" />
              <p
                className="mt-4 text-lg font-medium"
                style={{ color: "#667EEA" }}
              >
                Loading images...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <ImageOff
                className="w-24 h-24 mb-4"
                style={{ color: "#CBD5E0" }}
              />
              <h2 style={{ color: "#2D3748" }}>Failed to load images</h2>
              <p className="mt-2 mb-6" style={{ color: "#718096" }}>
                {error}
              </p>
              <Button
                onClick={fetchImages}
                className="h-11 px-6 text-white border-0"
                style={{
                  background:
                    "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
                }}
              >
                Try Again
              </Button>
            </div>
          ) : displayImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <ImageOff
                className="w-24 h-24 mb-4"
                style={{ color: "#CBD5E0" }}
              />
              <h2 style={{ color: "#2D3748" }}>
                {searchQuery || selectedColors.length > 0 || selectedTags.length > 0
                  ? "No images found"
                  : "No images yet"}
              </h2>
              <p className="mt-2 mb-6" style={{ color: "#718096" }}>
                {searchQuery || selectedColors.length > 0 || selectedTags.length > 0
                  ? "Try adjusting your filters or search query"
                  : "Upload your first image to get started"}
              </p>
              {searchQuery || selectedColors.length > 0 || selectedTags.length > 0 ? (
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedColors([]);
                    setSelectedTags([]);
                    setSortBy("recent");
                  }}
                  variant="outline"
                  className="h-11 px-6"
                >
                  Clear All Filters
                </Button>
              ) : (
                <Button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="h-11 px-6 text-white border-0"
                  style={{
                    background:
                      "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
                  }}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayImages.map((image) => (
                <ImageCard
                  key={image.id}
                  image={image}
                  onClick={() => handleImageClick(image.id)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <button
        onClick={() => setIsUploadModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-30"
        style={{
          background: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
        }}
      >
        <Upload className="w-6 h-6 text-white" />
      </button>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
}
