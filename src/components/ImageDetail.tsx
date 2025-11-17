import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  ArrowLeft,
  Download,
  Trash2,
  Search,
  ImageOff,
  Edit,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { apiService, ImageDetail as ImageDetailType } from "../services/api";
import { LoadingSpinner } from "./LoadingSpinner";
import { Notification } from "./Notification";
import EditImageModal from "./EditImageModal";

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

export default function ImageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState<ImageDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    fetchImageDetail();
  }, [id]);

  const fetchImageDetail = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);
      const imageId = parseInt(id, 10);
      const response = await apiService.getImageById(imageId);
      setImage(response);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load image";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm("Are you sure you want to delete this image?"))
      return;

    try {
      setIsDeleting(true);
      const imageId = parseInt(id, 10);
      const response = await apiService.deleteImage(imageId);
      setNotification({
        message: response.message || "Image deleted successfully",
        type: "success",
      });

      // Navigate back to gallery after a short delay
      setTimeout(() => {
        navigate("/gallery");
      }, 1500);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete image";
      setNotification({
        message,
        type: "error",
      });
      setIsDeleting(false);
    }
  };

  const handleDownload = () => {
    if (image) {
      window.open(image.original_url, "_blank");
    }
  };

  const handleUpdateSuccess = async () => {
    setNotification({
      message: "Image metadata updated successfully",
      type: "success",
    });
    // Refresh image details
    await fetchImageDetail();
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: "#F7FAFC" }}
      >
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-lg font-medium" style={{ color: "#667EEA" }}>
          Loading image...
        </p>
      </div>
    );
  }

  if (error || !image) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: "#F7FAFC" }}
      >
        <ImageOff className="w-24 h-24 mb-4" style={{ color: "#CBD5E0" }} />
        <h2 style={{ color: "#2D3748" }}>Failed to load image</h2>
        <p className="mt-2 mb-6" style={{ color: "#718096" }}>
          {error || "Image not found"}
        </p>
        <Button
          onClick={() => navigate("/gallery")}
          className="h-11 px-6 text-white border-0"
          style={{
            background: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
          }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Gallery
        </Button>
      </div>
    );
  }

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="min-h-screen" style={{ background: "#F7FAFC" }}>
        <div className="bg-white border-b" style={{ borderColor: "#E2E8F0" }}>
          <div className="container mx-auto px-8 py-4">
            <Button
              onClick={() => navigate("/gallery")}
              variant="ghost"
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Gallery
            </Button>
          </div>
        </div>

        <div className="container mx-auto px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl overflow-hidden shadow-lg h-[fit-content] relative">
              <ImageWithFallback
                src={image.thumbnail_url}
                alt={image.filename}
                className="w-full h-auto"
              />
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-lg relative">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="absolute top-2 right-4 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-10"
                  style={{ color: "#667EEA" }}
                  title="Edit metadata"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <h1 className="mb-4" style={{ color: "#2D3748" }}>
                  {image.filename}
                </h1>

                <div className="space-y-3 mb-6" style={{ color: "#718096" }}>
                  <div className="flex justify-between">
                    <span>Uploaded:</span>
                    <span style={{ color: "#2D3748" }}>
                      {formatUploadTime(image.uploaded_at)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span style={{ color: "#2D3748" }}>
                      {formatFileSize(image.file_size)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span style={{ color: "#2D3748" }} className="capitalize">
                      {image.metadata.ai_processing_status}
                    </span>
                  </div>
                </div>

                {image.metadata.description && (
                  <div
                    className="border-t pt-6"
                    style={{ borderColor: "#E2E8F0" }}
                  >
                    <h3 className="mb-3" style={{ color: "#2D3748" }}>
                      AI Description
                    </h3>
                    <p style={{ color: "#718096" }}>
                      {image.metadata.description}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="mb-3" style={{ color: "#2D3748" }}>
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {image.metadata.tags && image.metadata.tags.length > 0 ? (
                    image.metadata.tags.map((tag: string) => (
                      <Badge
                        key={tag}
                        className="px-3 py-1.5 rounded-full cursor-pointer hover:scale-105 transition-transform border-0 uppercase"
                        style={{
                          background:
                            "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
                          color: "#FFFFFF",
                          fontSize: "12px",
                        }}
                      >
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <p style={{ color: "#718096" }}>No tags available</p>
                  )}
                </div>

                <h3 className="mb-3" style={{ color: "#2D3748" }}>
                  Dominant Colors
                </h3>
                <div className="flex gap-3 mb-6">
                  {image.metadata.colors && image.metadata.colors.length > 0 ? (
                    image.metadata.colors.map(
                      (color: string, index: number) => (
                        <div
                          key={index}
                          className="flex flex-col items-center gap-2"
                        >
                          <div
                            className="w-10 h-10 rounded-full border-2"
                            style={{
                              background: color,
                              borderColor: "#E2E8F0",
                            }}
                          />
                          <span
                            className="uppercase"
                            style={{ color: "#718096", fontSize: "12px" }}
                          >
                            {color}
                          </span>
                        </div>
                      )
                    )
                  ) : (
                    <p style={{ color: "#718096" }}>No colors available</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleDownload}
                    className="w-full h-11 text-white border-0"
                    style={{
                      background:
                        "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    onClick={() => navigate(`/similar/${id}`)}
                    variant="outline"
                    className="w-full h-11"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Find Similar
                  </Button>
                  <Button
                    onClick={handleDelete}
                    variant="outline"
                    className="w-full h-11 border-red-200 hover:bg-red-50 flex items-center justify-center gap-2"
                    style={{ color: "#F56565" }}
                    disabled={isDeleting}
                  >
                    {isDeleting && (
                      <LoadingSpinner
                        size="sm"
                        style={{
                          borderColor: "rgba(245, 101, 101, 0.3)",
                          borderTopColor: "#F56565",
                        }}
                      />
                    )}
                    {!isDeleting && <Trash2 className="w-4 h-4 mr-2" />}
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {image && (
        <EditImageModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          imageId={image.id}
          currentMetadata={image.metadata}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </>
  );
}
