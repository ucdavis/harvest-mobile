import { isAuthenticated, setAuthTokenAsync } from "@/lib/auth";
import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [isLoading, setIsLoading] = useState(true); // TODO: if we need it while loading auth state

  const login = (token: string) => {
    setAuthTokenAsync(token).then(() => {
      setIsLoggedIn(true);
      setIsLoading(false);
    });
  };

  const logout = () => {
    setAuthTokenAsync(null).then(() => {
      setIsLoading(false);
      setIsLoggedIn(false);
    });
  };

  console.log("AuthProvider rendered, isLoggedIn:", isLoggedIn);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
