import React, { createContext, useContext, useState } from "react";

// 1. Define el tipo de usuario (agregando dateBirth)
export interface UserInfo {
  id?: number;
  email?: string;
  name?: string;
  lastName?: string;
  imageUrl?: string;
  dateBirth?: string;  // <-- ¡Agregado!
  role?: string;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  user: UserInfo | null;
  role: string;
  login: (user: UserInfo, token?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<string>("");
  const [user, setUser] = useState<UserInfo | null>(null);

  // login recibe el objeto usuario (y opcional token)
  const login = (userData: UserInfo, token?: string) => {
    setIsAuthenticated(true);
    setRole(userData.role || "");
    setUser(userData);
    if (token) {
      localStorage.setItem("token", token);
    }
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Cargar usuario de localStorage al recargar
  React.useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userData: UserInfo = JSON.parse(savedUser);
      setIsAuthenticated(true);
      setRole(userData.role || "");
      setUser(userData);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
