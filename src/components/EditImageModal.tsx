import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { X } from "lucide-react";
import { apiService, ImageMetadata } from "../services/api";
import { LoadingSpinner } from "./LoadingSpinner";

interface EditImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageId: number;
  currentMetadata: ImageMetadata;
  onUpdateSuccess: () => void;
}

export default function EditImageModal({
  isOpen,
  onClose,
  imageId,
  currentMetadata,
  onUpdateSuccess,
}: EditImageModalProps) {
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [colors, setColors] = useState<string[]>([]);
  const [colorInput, setColorInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Initialize form with current metadata
  useEffect(() => {
    if (isOpen) {
      setDescription(currentMetadata.description || "");
      setTags(currentMetadata.tags || []);
      setColors(currentMetadata.colors || []);
      setError("");
    }
  }, [isOpen, currentMetadata]);

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleAddColor = () => {
    const trimmedColor = colorInput.trim().toUpperCase();
    // Validate hex color format
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

    if (!hexColorRegex.test(trimmedColor)) {
      setError("Invalid color format. Use hex format like #FF6B35 or #F00");
      return;
    }

    if (!colors.includes(trimmedColor)) {
      setColors([...colors, trimmedColor]);
      setColorInput("");
      setError("");
    }
  };

  const handleRemoveColor = (colorToRemove: string) => {
    setColors(colors.filter((color) => color !== colorToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // At least one field should be provided
    if (!description && tags.length === 0 && colors.length === 0) {
      setError("Please provide at least one field to update");
      return;
    }

    try {
      setIsSubmitting(true);

      const updateData: {
        description?: string;
        tags?: string[];
        colors?: string[];
      } = {};

      if (description) updateData.description = description;
      if (tags.length > 0) updateData.tags = tags;
      if (colors.length > 0) updateData.colors = colors;

      await apiService.updateImageMetadata(imageId, updateData);

      onUpdateSuccess();
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update image metadata";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-white rounded-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle style={{ color: "#2D3748" }}>Edit Image Metadata</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div
              className="p-3 rounded-lg"
              style={{ background: "#FED7D7", color: "#F56565" }}
            >
              {error}
            </div>
          )}

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block mb-2"
              style={{ color: "#2D3748", fontWeight: 500 }}
            >
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter image description..."
              rows={4}
              className="w-full"
              style={{ borderColor: "#E2E8F0" }}
            />
          </div>

          {/* Tags */}
          <div>
            <label
              htmlFor="tags"
              className="block mb-2"
              style={{ color: "#2D3748", fontWeight: 500 }}
            >
              Tags
            </label>
            <div className="flex gap-2 mb-3">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add a tag and press Enter"
                style={{ borderColor: "#E2E8F0" }}
              />
              <Button
                type="button"
                onClick={handleAddTag}
                variant="outline"
                className="shrink-0"
              >
                Add Tag
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="px-3 py-1.5 bg-purple-100 rounded-full flex items-center gap-2"
                >
                  <span
                    style={{ color: "#667EEA", fontSize: "14px" }}
                    className="uppercase"
                  >
                    {tag}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:bg-purple-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" style={{ color: "#667EEA" }} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <label
              htmlFor="colors"
              className="block mb-2"
              style={{ color: "#2D3748", fontWeight: 500 }}
            >
              Colors
            </label>
            <div className="flex gap-2 mb-3">
              <div className="flex gap-2 flex-1">
                <input
                  type="color"
                  value={colorInput || "#000000"}
                  onChange={(e) => setColorInput(e.target.value.toUpperCase())}
                  className="w-12 h-11 rounded border-2 cursor-pointer"
                  style={{ borderColor: "#E2E8F0" }}
                  title="Pick a color"
                />
                <Input
                  id="colors"
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddColor();
                    }
                  }}
                  placeholder="e.g., #FF6B35"
                  style={{ borderColor: "#E2E8F0" }}
                />
              </div>
              <Button
                type="button"
                onClick={handleAddColor}
                variant="outline"
                className="shrink-0"
              >
                Add Color
              </Button>
            </div>
            <div className="flex flex-wrap gap-3">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-2 relative group"
                >
                  <div
                    className="w-12 h-12 rounded-full border-2 relative"
                    style={{
                      background: color,
                      borderColor: "#E2E8F0",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(color)}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <span
                    className="uppercase text-xs"
                    style={{ color: "#718096" }}
                  >
                    {color}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t" style={{ borderColor: "#E2E8F0" }}>
            <Button
              type="button"
              onClick={handleClose}
              variant="outline"
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 text-white border-0"
              style={{
                background: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner
                    size="sm"
                    style={{
                      borderColor: "rgba(255, 255, 255, 0.3)",
                      borderTopColor: "#FFFFFF",
                    }}
                  />
                  <span className="ml-2">Saving...</span>
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
