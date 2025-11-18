import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ImageIcon, CheckCircle2, XCircle } from "lucide-react";
import { apiService } from "../services/api";
import { Notification } from "./Notification";
import { LoadingSpinner } from "./LoadingSpinner";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const navigate = useNavigate();

  const getPasswordStrength = (pass: string) => {
    if (pass.length === 0) return { strength: 0, label: "", color: "" };
    if (pass.length < 6)
      return { strength: 33, label: "Weak", color: "#F56565" };
    if (pass.length < 10)
      return { strength: 66, label: "Medium", color: "#ED8936" };
    return { strength: 100, label: "Strong", color: "#48BB78" };
  };

  const passwordStrength = getPasswordStrength(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    if (!passwordsMatch) {
      setNotification({
        message: "Passwords do not match",
        type: "error",
      });
      return;
    }

    if (passwordStrength.strength < 66) {
      setNotification({
        message: "Password is too weak. Please use a stronger password.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await apiService.signup({ email, password });
      setNotification({
        message:
          "Account created successfully! Please verify your email and then log in.",
        type: "success",
      });

      // Navigate to login page after a short delay to show the success message
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Signup failed. Please try again.";
      setNotification({
        message,
        type: "error",
      });
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
              Create Account
            </h1>
            <p className="text-center mt-2" style={{ color: "#718096" }}>
              Join AI Gallery to organize your images
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" style={{ color: "#2D3748" }}>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email"
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
              {password && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span
                      className="uppercase"
                      style={{
                        color: passwordStrength.color,
                        fontSize: "12px",
                      }}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${passwordStrength.strength}%`,
                        background: passwordStrength.color,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" style={{ color: "#2D3748" }}>
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="•••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-11 pr-10"
                  style={{
                    borderColor: confirmPassword
                      ? passwordsMatch
                        ? "#48BB78"
                        : "#F56565"
                      : "#E2E8F0",
                  }}
                  required
                  disabled={isSubmitting}
                />
                {confirmPassword && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {passwordsMatch ? (
                      <CheckCircle2
                        className="w-5 h-5"
                        style={{ color: "#48BB78" }}
                      />
                    ) : (
                      <XCircle
                        className="w-5 h-5"
                        style={{ color: "#F56565" }}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-white border-0 flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
              }}
              disabled={
                isSubmitting ||
                !passwordsMatch ||
                passwordStrength.strength < 66
              }
            >
              {isSubmitting && (
                <LoadingSpinner
                  size="sm"
                  style={{
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    borderTopColor: "white",
                  }}
                />
              )}
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>

            <p className="text-center" style={{ color: "#718096" }}>
              Already have an account?{" "}
              <Link
                to="/login"
                className="hover:underline"
                style={{ color: "#667EEA" }}
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
