import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProtectedRoute, PublicRoute } from "./components/ProtectedRoute";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Gallery from "./components/Gallery";
import ImageDetail from "./components/ImageDetail";
import SearchResults from "./components/SearchResults";
import SimilarImages from "./components/SimilarImages";
import SessionExpiredModal from "./components/SessionExpiredModal";

function AppContent() {
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleSessionExpired = () => {
      setIsSessionExpired(true);
    };

    window.addEventListener("session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener("session-expired", handleSessionExpired);
    };
  }, []);

  const handleSessionRefreshed = () => {
    setIsSessionExpired(false);
    // Reload the current page to retry the failed request
    window.location.reload();
  };

  const handleLogout = () => {
    setIsSessionExpired(false);
    logout();
    navigate("/login");
  };

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/gallery"
          element={
            <ProtectedRoute>
              <Gallery />
            </ProtectedRoute>
          }
        />
        <Route
          path="/image/:id"
          element={
            <ProtectedRoute>
              <ImageDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchResults />
            </ProtectedRoute>
          }
        />
        <Route
          path="/similar/:id"
          element={
            <ProtectedRoute>
              <SimilarImages />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/gallery" replace />} />
      </Routes>

      <SessionExpiredModal
        isOpen={isSessionExpired}
        onSessionRefreshed={handleSessionRefreshed}
        onLogout={handleLogout}
      />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
