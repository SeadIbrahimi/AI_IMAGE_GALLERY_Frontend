import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ImageIcon } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Notification } from "./Notification";
import { LoadingSpinner } from "./LoadingSpinner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);
    setIsSubmitting(true);

    try {
      const successMessage = await login({ email, password });
      setNotification({
        message: successMessage,
        type: "success",
      });

      // Navigate after a short delay to show the success message
      setTimeout(() => {
        navigate("/gallery");
      }, 1000);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.";
      setNotification({
        message,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "#F7FAFC" }}
      >
        <div className="w-full max-w-[400px] bg-white rounded-xl shadow-lg p-8">
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center mb-4"
              style={{
                background: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
              }}
            >
              <ImageIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-center" style={{ color: "#2D3748" }}>
              Welcome Back
            </h1>
            <p className="text-center mt-2" style={{ color: "#718096" }}>
              Sign in to access your AI Gallery
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" style={{ color: "#2D3748" }}>
                Email
              </Label>
              <Input
                id="email"
                placeholder="Enter email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                style={{ borderColor: "#E2E8F0" }}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" style={{ color: "#2D3748" }}>
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="•••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
                style={{ borderColor: "#E2E8F0" }}
                required
                disabled={isSubmitting}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-white border-0 flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
              }}
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <LoadingSpinner
                  size="sm"
                  className="border-white/30"
                  style={{ borderTopColor: "white" }}
                />
              )}
              {isSubmitting ? "Signing In..." : "Sign In"}
            </Button>

            <p className="text-center" style={{ color: "#718096" }}>
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="hover:underline"
                style={{ color: "#667EEA" }}
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
