import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  apiService,
  LoginCredentials,
  SignupCredentials,
} from "../services/api";
import { FullScreenLoader } from "../components/LoadingSpinner";

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<string>;
  signup: (credentials: SignupCredentials) => Promise<string>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Initialize from localStorage
    return !!localStorage.getItem("authToken");
  });
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check auth status on mount
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      const savedUser = localStorage.getItem("user");

      if (token && savedUser) {
        setIsAuthenticated(true);
        setUser(JSON.parse(savedUser));
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await apiService.login(credentials);

      // Use access_token instead of token
      if (response.access_token) {
        localStorage.setItem("authToken", response.access_token);
      }

      if (response.refresh_token) {
        localStorage.setItem("refreshToken", response.refresh_token);
      }

      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
        setUser(response.user);
      }

      setIsAuthenticated(true);

      // Return the success message if available
      return response.message || "Login successful";
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await apiService.signup(credentials);

      // Use access_token instead of token
      if (response.access_token) {
        localStorage.setItem("authToken", response.access_token);
      }

      if (response.refresh_token) {
        localStorage.setItem("refreshToken", response.refresh_token);
      }

      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
        setUser(response.user);
      }

      setIsAuthenticated(true);

      // Return the success message if available
      return response.message || "Account created successfully";
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Signup failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setError(null);
  };

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, signup, logout, isLoading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
}
