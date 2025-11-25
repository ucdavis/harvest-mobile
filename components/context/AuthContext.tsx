import {
  clearAllData,
  clearDataOnFreshInstall,
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

// Get app version from package.json
const APP_VERSION = require("../../../package.json").version;

interface AuthContextType {
  isLoggedIn: boolean | null; // null meaning we don't know yet
  login: (authInfo: TeamAuthInfo) => Promise<void>;
  logout: () => Promise<void>;
  clearAllData: () => Promise<void>;
  isLoading: boolean;
  authInfo?: TeamAuthInfo;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authInfo, setAuthInfo] = useState<TeamAuthInfo | undefined>();

  // load current auth info on launch
  useEffect(() => {
    const loadAuth = async () => {
      try {
        // Check for fresh install and clear data if needed
        const wasCleared = await clearDataOnFreshInstall(APP_VERSION);

        if (wasCleared) {
          logger.info("Data cleared on fresh install, user needs to log in");
          setIsLoggedIn(false);
          setAuthInfo(undefined);
        } else {
          // Load existing auth info
          const info = await getCurrentTeamAuthInfo();
          setAuthInfo(info || undefined);
          setIsLoggedIn(!!info);
        }
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

  const clearAll = useCallback(async () => {
    try {
      await clearAllData();

      // Reset state
      setAuthInfo(undefined);
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);

      // Clear query cache
      queryClient.clear();
      await reactQueryPersister.removeClient();
    } catch (error) {
      logger.error("Failed to clear all data in AuthContext", error);
      throw error;
    }
  }, []);

  const login = useCallback(async (authInfo: TeamAuthInfo) => {
    setIsLoading(true);

    try {
      // clear out existing data first
      await Promise.all([
        clearExpenseQueue().catch(() => {}), // Ignore errors
        queryClient.clear(),
        reactQueryPersister.removeClient(),
      ]);

      // now persist our new auth info
      await setOrUpdateUserAuthInfo(authInfo);

      // all good, update state
      setAuthInfo(authInfo);
      setIsLoggedIn(true);
    } catch (error) {
      logger.error("Login failed", error);
      setIsLoggedIn(false);
      setAuthInfo(undefined);
      throw error; // rethrow, no coming back from this
    } finally {
      setIsLoading(false);
    }
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
      value={{
        isLoggedIn,
        login,
        logout,
        clearAllData: clearAll,
        isLoading,
        authInfo,
      }}
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
