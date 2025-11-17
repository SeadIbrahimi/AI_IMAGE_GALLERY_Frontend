import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { AlertCircle } from "lucide-react";
import { apiService } from "../services/api";
import { LoadingSpinner } from "./LoadingSpinner";

interface SessionExpiredModalProps {
  isOpen: boolean;
  onSessionRefreshed: () => void;
  onLogout: () => void;
}

export default function SessionExpiredModal({
  isOpen,
  onSessionRefreshed,
  onLogout,
}: SessionExpiredModalProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  const handleRefreshSession = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      setError("No refresh token found. Please log in again.");
      return;
    }

    try {
      setIsRefreshing(true);
      setError("");

      const response = await apiService.refreshSession(refreshToken);

      // Store new tokens
      localStorage.setItem("authToken", response.access_token);
      if (response.refresh_token) {
        localStorage.setItem("refreshToken", response.refresh_token);
      }

      // Notify parent component
      onSessionRefreshed();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to refresh session";
      setError(message);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = () => {
    // Clear tokens
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    onLogout();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-md bg-white rounded-xl"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle style={{ color: "#2D3748" }}>Session Expired</DialogTitle>
        </DialogHeader>

        <div className="py-6 flex flex-col items-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ background: "#FED7D7" }}
          >
            <AlertCircle className="w-8 h-8" style={{ color: "#F56565" }} />
          </div>

          <h3 className="mb-2 text-center" style={{ color: "#2D3748" }}>
            Your session has expired
          </h3>

          <p className="text-center mb-6" style={{ color: "#718096" }}>
            Would you like to refresh your session and continue?
          </p>

          {error && (
            <div
              className="w-full p-3 rounded-lg mb-4"
              style={{ background: "#FED7D7", color: "#F56565" }}
            >
              {error}
            </div>
          )}

          <div className="flex gap-3 w-full">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex-1"
              disabled={isRefreshing}
            >
              Log Out
            </Button>
            <Button
              onClick={handleRefreshSession}
              className="flex-1 text-white border-0"
              style={{
                background: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
              }}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <>
                  <LoadingSpinner
                    size="sm"
                    style={{
                      borderColor: "rgba(255, 255, 255, 0.3)",
                      borderTopColor: "#FFFFFF",
                    }}
                  />
                  <span className="ml-2">Refreshing...</span>
                </>
              ) : (
                "Continue Session"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
