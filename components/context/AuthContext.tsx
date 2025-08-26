import {
  deleteAuthTokensAsync,
  getUserInfo,
  getUserInfoFromIdToken,
  isAuthenticated,
  setAuthTokenAsync,
  UserInfo,
} from "@/lib/auth";
import { TokenResponse } from "expo-auth-session";
import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (tokenResponse: TokenResponse) => void;
  logout: () => void;
  isLoading: boolean;
  userInfo?: UserInfo;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [isLoading, setIsLoading] = useState(true); // TODO: if we need it while loading auth state
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>(getUserInfo());

  const login = (tokenResponse: TokenResponse) => {
    setAuthTokenAsync(tokenResponse).then(() => {
      setUserInfo(getUserInfoFromIdToken(tokenResponse.idToken));
      setIsLoggedIn(true);
      setIsLoading(false);
    });
  };

  const logout = () => {
    deleteAuthTokensAsync().then(() => {
      setIsLoading(false);
      setIsLoggedIn(false);
    });
  };

  console.log("AuthProvider rendered, isLoggedIn:", isLoggedIn);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, login, logout, isLoading, userInfo }}
    >
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
