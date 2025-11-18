import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { User, Settings, HelpCircle, LogOut, Moon, Sun } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

export default function UserMenu() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="w-10 h-10 rounded-full flex items-center justify-center text-white cursor-pointer hover:scale-105 transition-transform"
          style={{
            background: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
          }}
        >
          {user?.email ? user.email.charAt(0).toUpperCase() : "D"}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-600"
      >
        <div className="px-3 py-2 border-b border-gray-200 dark:border-slate-600">
          <p className="text-gray-800 dark:text-gray-200">
            {user?.email || "demo@example.com"}
          </p>
        </div>
        <DropdownMenuSeparator className="bg-gray-200 dark:bg-slate-600" />
        <DropdownMenuItem
          onClick={toggleTheme}
          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
        >
          {theme === "light" ? (
            <>
              <Moon className="w-4 h-4 mr-2" style={{ color: "#667EEA" }} />
              <span className="text-gray-800 dark:text-gray-200">
                Dark Mode
              </span>
            </>
          ) : (
            <>
              <Sun className="w-4 h-4 mr-2" style={{ color: "#F59E0B" }} />
              <span className="text-gray-800 dark:text-gray-200">
                Light Mode
              </span>
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-200 dark:bg-slate-600" />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <LogOut className="w-4 h-4 mr-2" style={{ color: "#F56565" }} />
          <span style={{ color: "#F56565" }}>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
