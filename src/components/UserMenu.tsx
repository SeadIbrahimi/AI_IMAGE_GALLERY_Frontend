import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { User, Settings, HelpCircle, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function UserMenu() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
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
          DU
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-white rounded-lg shadow-lg border"
        style={{ borderColor: "#E2E8F0" }}
      >
        <div className="px-3 py-2 border-b" style={{ borderColor: "#E2E8F0" }}>
          <p style={{ color: "#2D3748" }}>
            {user?.email || "demo@example.com"}
          </p>
        </div>
        <DropdownMenuSeparator style={{ background: "#E2E8F0" }} />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer hover:bg-red-50"
        >
          <LogOut className="w-4 h-4 mr-2" style={{ color: "#F56565" }} />
          <span style={{ color: "#F56565" }}>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
