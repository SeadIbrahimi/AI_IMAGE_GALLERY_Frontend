import { useState, useEffect } from "react";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { X } from "lucide-react";
import { apiService, ColorItem } from "../services/api";

interface SidebarProps {
  selectedColors: string[];
  onColorChange: (colors: string[]) => void;
  selectedTags: string[];
  onTagChange: (tags: string[]) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({
  selectedColors,
  onColorChange,
  selectedTags,
  onTagChange,
  sortBy,
  onSortChange,
  isOpen,
  setIsOpen,
}: SidebarProps) {
  const [colorOptions, setColorOptions] = useState<ColorItem[]>([]);
  const [tagOptions, setTagOptions] = useState<string[]>([]);
  const [isLoadingColors, setIsLoadingColors] = useState(true);
  const [isLoadingTags, setIsLoadingTags] = useState(true);

  // Fetch popular colors on mount
  useEffect(() => {
    const fetchColors = async () => {
      try {
        setIsLoadingColors(true);
        const response = await apiService.getPopularColors(10);
        setColorOptions(response.colors);
      } catch (error) {
        console.error("Failed to fetch colors:", error);
        // Fallback to default colors if API fails
        setColorOptions([
          { color: "#EF4444", count: 0 },
          { color: "#3B82F6", count: 0 },
          { color: "#10B981", count: 0 },
          { color: "#F59E0B", count: 0 },
          { color: "#8B5CF6", count: 0 },
          { color: "#F97316", count: 0 },
          { color: "#1F2937", count: 0 },
          { color: "#F3F4F6", count: 0 },
        ]);
      } finally {
        setIsLoadingColors(false);
      }
    };

    fetchColors();
  }, []);

  // Fetch recent tags on mount
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsLoadingTags(true);
        const response = await apiService.getRecentTags();
        setTagOptions(response.tags);
      } catch (error) {
        console.error("Failed to fetch tags:", error);
        setTagOptions([
          "Nature",
          "Urban",
          "Portrait",
          "Food",
          "Travel",
          "Architecture",
        ]);
      } finally {
        setIsLoadingTags(false);
      }
    };

    fetchTags();
  }, []);

  const toggleColor = (color: string) => {
    if (selectedColors.includes(color)) {
      onColorChange(selectedColors.filter((c) => c !== color));
    } else {
      onColorChange([...selectedColors, color]);
    }
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag.toLowerCase())) {
      onTagChange(selectedTags.filter((t) => t !== tag.toLowerCase()));
    } else {
      onTagChange([...selectedTags, tag.toLowerCase()]);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          w-64 bg-white border-r overflow-y-auto p-6 z-50
          fixed lg:relative
          top-0 lg:top-auto
          left-0 lg:left-auto
          h-screen lg:h-auto
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{ borderColor: "#E2E8F0" }}
      >
        {/* Close button - only show on mobile */}
        <button
          className="lg:hidden absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
          style={{ color: "#718096" }}
          aria-label="Close filters"
          onClick={() => setIsOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-8">
          <div>
            <h3 className="mb-4" style={{ color: "#2D3748" }}>
              Colors
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {colorOptions.map((colorItem) => (
                <button
                  key={colorItem.color}
                  onClick={() => toggleColor(colorItem.color)}
                  className="w-10 h-10 rounded-full border-2 transition-all hover:scale-110"
                  style={{
                    background: colorItem.color,
                    borderColor: selectedColors.includes(colorItem.color)
                      ? "#667EEA"
                      : "#E2E8F0",
                    borderWidth: selectedColors.includes(colorItem.color)
                      ? "3px"
                      : "2px",
                  }}
                  title={colorItem.color}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4" style={{ color: "#2D3748" }}>
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {tagOptions.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className="px-3 py-1.5 rounded-full uppercase transition-all hover:scale-105"
                  style={{
                    background: selectedTags.includes(tag.toLowerCase())
                      ? "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)"
                      : "#E2E8F0",
                    color: selectedTags.includes(tag.toLowerCase())
                      ? "#FFFFFF"
                      : "#2D3748",
                    fontSize: "12px",
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label
              htmlFor="sort"
              className="mb-3 block"
              style={{ color: "#2D3748" }}
            >
              Sort By
            </Label>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger
                id="sort"
                className="h-11"
                style={{ borderColor: "#E2E8F0" }}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="a-z">A-Z</SelectItem>
                <SelectItem value="z-a">Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </aside>
    </>
  );
}
