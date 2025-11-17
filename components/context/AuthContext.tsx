import {
  getCurrentTeamAuthInfo,
  removeCurrentTeamAuthInfo,
  setOrUpdateUserAuthInfo,
  TeamAuthInfo,
} from "@/lib/auth";
import { logger, setUser } from "@/lib/logger";
import { clearExpenseQueue } from "@/services/queries/expenses";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  registerOnUnauthorized,
  unRegisterOnUnauthorized,
} from "../../services/api";
import { queryClient, reactQueryPersister } from "./queryClient";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (authInfo: TeamAuthInfo) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  authInfo?: TeamAuthInfo;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // TODO: should we do this synchronously?
  const [isLoading, setIsLoading] = useState(true);
  const [authInfo, setAuthInfo] = useState<TeamAuthInfo | undefined>();

  // load current auth info on launch
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const info = await getCurrentTeamAuthInfo();
        setAuthInfo(info || undefined);
        setIsLoggedIn(!!info);
      } catch (error) {
        logger.error("Failed to load auth info on startup", error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuth();
  }, []);

  const logout = useCallback(async () => {
    try {
      await removeCurrentTeamAuthInfo();
    } catch (error) {
      console.error("Failed to remove current team auth info", error);
    }

    setAuthInfo(undefined);
    setIsLoading(false);
    setIsLoggedIn(false);
    setUser(null); // clear user info from logger

    try {
      // always clear out expense queue on logout as a security measure
      await clearExpenseQueue();
    } catch {
      // Ignore errors
    } finally {
      queryClient.clear(); // Clear all cached queries from memory
      await reactQueryPersister.removeClient(); // Clear persisted cache from storage
    }
  }, []);

  const login = useCallback(async (authInfo: TeamAuthInfo) => {
    setIsLoading(true);

    try {
      await clearExpenseQueue();
    } catch {
      // Ignore errors
    } finally {
      queryClient.clear(); // Clear all cached queries from memory
      await reactQueryPersister.removeClient(); // Clear persisted cache from storage
    }

    await setOrUpdateUserAuthInfo(authInfo);
    setAuthInfo(authInfo);
    setIsLoggedIn(true);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    registerOnUnauthorized(logout);

    return () => {
      unRegisterOnUnauthorized(logout);
    };
  }, [logout]);

  console.log("AuthProvider rendered, isLoggedIn:", isLoggedIn);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, login, logout, isLoading, authInfo }}
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
