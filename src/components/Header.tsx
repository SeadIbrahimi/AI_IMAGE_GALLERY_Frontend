import { useState } from "react";
import { Input } from "./ui/input";
import { ImageIcon, Search, SlidersHorizontal } from "lucide-react";
import UserMenu from "./UserMenu";

interface HeaderProps {
  onSearch: (query: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Header({
  onSearch,
  isSidebarOpen,
  setIsSidebarOpen,
  searchQuery,
  setSearchQuery,
}: HeaderProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Prevent form submission, search happens on onChange
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value); // Call onSearch immediately, debouncing happens in Gallery
  };

  return (
    <header
      className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700"
    >
      <div className="flex items-center justify-between px-4 md:px-8 py-4 gap-2 md:gap-0">
        <div className="flex items-center gap-2 md:gap-3">
          <button
            className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer lg:hidden"
            style={{ color: "#667EEA" }}
            aria-label="Toggle filters"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
          <div
            className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
            }}
          >
            <ImageIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <span className="hidden md:block text-base md:text-xl text-gray-800 dark:text-white">
            AI Gallery
          </span>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 max-w-2xl mx-2 md:mx-8">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search images..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-9 md:pl-10 h-10 md:h-11 text-sm md:text-base bg-white dark:bg-slate-800 dark:text-white border-gray-200 dark:border-slate-600"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400 dark:text-gray-500" />
          </div>
        </form>

        <UserMenu />
      </div>
    </header>
  );
}
