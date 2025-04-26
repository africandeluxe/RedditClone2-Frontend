import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { getMe } from "../services/api";
import { User } from "../types";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { refreshToken } from "../services/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: (user: User | null) => void;
  authLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const response = await getMe();
          setUser(response.data);
        } catch (error) {
          console.error("Failed to load user, trying refresh..", error);
          try {
            const refreshResponse = await refreshToken();
            const newToken = refreshResponse.data.token;
            localStorage.setItem("token", newToken);
            setToken(newToken);
            const userResponse = await getMe();
            setUser(userResponse.data);
          }catch (refreshError) {
            console.error("Refresh token failed", refreshError);
            localStorage.removeItem("token");
            setToken(null);
            setUser(null);
        }
      }
    }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (newToken: string) => {
    setAuthLoading(true);
    localStorage.setItem("token", newToken);
    setToken(newToken);
    try {
      const response = await getMe();
      setUser(response.data);
      navigate('/');
    } catch (error) {
      console.error("Login failed", error);
      logout();
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      isAuthenticated, 
      loading,
      setUser,
      authLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};