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
          w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 overflow-y-auto p-6 z-50
          fixed lg:relative
          top-0 lg:top-auto
          left-0 lg:left-auto
          h-screen lg:h-auto
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Close button - only show on mobile */}
        <button
          className="lg:hidden absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-gray-600 dark:text-gray-400"
          aria-label="Close filters"
          onClick={() => setIsOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-8">
          <div>
            <h3 className="mb-4 text-gray-800 dark:text-white">Colors</h3>
            <div className="grid grid-cols-4 gap-3">
              {colorOptions.map((colorItem) => (
                <button
                  key={colorItem.color}
                  onClick={() => toggleColor(colorItem.color)}
                  className={`w-10 h-10 rounded-full transition-all hover:scale-110 ${
                    selectedColors.includes(colorItem.color)
                      ? "border-[3px]"
                      : "border-2 border-gray-200 dark:border-slate-600"
                  }`}
                  style={{
                    background: colorItem.color || "#9CA3AF",
                    borderColor: selectedColors.includes(colorItem.color)
                      ? "#667EEA"
                      : undefined,
                  }}
                  title={colorItem.color || "Unknown color"}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-gray-800 dark:text-white">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tagOptions.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full uppercase transition-all hover:scale-105 text-xs ${
                    selectedTags.includes(tag.toLowerCase())
                      ? "text-white"
                      : "bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200"
                  }`}
                  style={{
                    background: selectedTags.includes(tag.toLowerCase())
                      ? "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)"
                      : undefined,
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
              className="mb-3 block text-gray-800 dark:text-white"
            >
              Sort By
            </Label>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger
                id="sort"
                className="h-11 bg-white dark:bg-slate-800 dark:text-white border-gray-200 dark:border-slate-600"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-800 dark:border-slate-600">
                <SelectItem
                  value="recent"
                  className="dark:text-white dark:hover:bg-slate-700"
                >
                  Most Recent
                </SelectItem>
                <SelectItem
                  value="oldest"
                  className="dark:text-white dark:hover:bg-slate-700"
                >
                  Oldest First
                </SelectItem>
                <SelectItem
                  value="a-z"
                  className="dark:text-white dark:hover:bg-slate-700"
                >
                  A-Z
                </SelectItem>
                <SelectItem
                  value="z-a"
                  className="dark:text-white dark:hover:bg-slate-700"
                >
                  Z-A
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </aside>
    </>
  );
}
