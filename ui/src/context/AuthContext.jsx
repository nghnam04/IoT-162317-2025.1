import { createContext, useEffect, useState } from "react";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    const fetchMe = async () => {
      try {
        const res = await authService.getMe();
        setUser(res.data.user);
        sessionStorage.setItem("user", JSON.stringify(res.data.user));
      } catch (err) {
        sessionStorage.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchMe();
    } else {
      setLoading(false);
    }
  }, []);

  // Login
  const login = async (identifier, password) => {
    setLoading(true);
    try {
      const res = await authService.login(identifier, password);

      sessionStorage.setItem("token", res.data.token);

      const me = await authService.getMe();
      setUser(me.data.user);
      sessionStorage.setItem("user", JSON.stringify(me.data.user));

      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        error: error.response?.data?.message || "Đăng nhập thất bại",
      };
    }
  };

  // Logout
  const logout = () => {
    authService.logout();
    setUser(null);
    navigate("/login");
  };

  // Register
  const register = async (name, email, username, password) => {
    try {
      await authService.register(name, email, username, password);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Đăng ký thất bại",
      };
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, register, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
