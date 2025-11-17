import { CSSProperties } from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  style?: CSSProperties;
}

export function LoadingSpinner({
  size = "md",
  className = "",
  style,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  const defaultStyle: CSSProperties = {
    borderColor: "rgba(102, 126, 234, 0.2)",
    borderTopColor: "#667EEA",
  };

  return (
    <div
      className={`${sizeClasses[size]} border-solid rounded-full animate-spin ${className}`}
      style={{ ...defaultStyle, ...style }}
    />
  );
}

export function FullScreenLoader() {
  return (
    <div
      className="flex items-center justify-center  h-screen"
      style={{ background: "#F7FAFC" }}
    >
      <div className="flex flex-col items-center gap-4 !h-full">
        <LoadingSpinner size="lg" />
        <p className="text-lg font-medium" style={{ color: "#667EEA" }}>
          Loading...
        </p>
      </div>
    </div>
  );
}
