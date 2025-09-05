import { removeCurrentTeamAuthInfo, TeamAuthInfo } from "@/lib/auth";
import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  // only logout, login is handled via applink.tsx
  logout: () => void;
  isLoading: boolean;
  authInfo?: TeamAuthInfo;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // TODO: should we do this synchronously?
  const [isLoading, setIsLoading] = useState(true);
  const [authInfo, setAuthInfo] = useState<TeamAuthInfo | undefined>();

  const logout = () => {
    removeCurrentTeamAuthInfo().then(() => {
      setAuthInfo(undefined);
      setIsLoading(false);
      setIsLoggedIn(false);
    });
  };

  console.log("AuthProvider rendered, isLoggedIn:", isLoggedIn);

  return (
    <AuthContext.Provider value={{ isLoggedIn, logout, isLoading, authInfo }}>
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
