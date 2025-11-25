import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { closeDb } from "./db/client";
import { logger } from "./logger";

const USER_AUTH_INFO_KEY = "userAuthInfo";
const CURRENT_TEAM_KEY = "currentTeam";
const COMPLETED_LINK_CODES_KEY = "completedLinkCodes";
const APP_VERSION_KEY = "appVersion";

export type TeamAuthInfo = {
  token: string;
  team: string;
  apiBaseUrl: string;
};

// user auth info is dictionary keyed by team, we'll store it all in one key
type UserAuthInfo = {
  [team: string]: TeamAuthInfo;
};

/**
 * Sets or updates the authentication information for a specific team in secure storage.
 *
 * Retrieves the current user authentication info, updates or adds the entry for the given team,
 * and persists the updated info securely.
 *
 * @param authInfo - The authentication information for the team to set or update.
 * @returns A promise that resolves when the operation is complete.
 */
export const setOrUpdateUserAuthInfo = async (
  authInfo: TeamAuthInfo
): Promise<void> => {
  const userAuthInfo = (await getUserAuthInfo()) ?? {};
  const currentTeam = await getCurrentTeam();

  // if this is first auth info or if the current team is not set, set it to this team
  if (Object.keys(userAuthInfo).length === 0 || !currentTeam) {
    await setCurrentTeam(authInfo.team);
  }

  userAuthInfo[authInfo.team] = authInfo;
  await SecureStore.setItemAsync(
    USER_AUTH_INFO_KEY,
    JSON.stringify(userAuthInfo)
  );
};

/**
 * Removes the authentication information for a specific team from the user's stored auth info.
 *
 * @param team - The identifier of the team whose authentication info should be removed.
 * @returns A promise that resolves when the team auth info has been removed and the updated info has been saved.
 */
export const removeTeamAuthInfo = async (team: string): Promise<void> => {
  const userAuthInfo = (await getUserAuthInfo()) ?? {};
  delete userAuthInfo[team];
  await SecureStore.setItemAsync(
    USER_AUTH_INFO_KEY,
    JSON.stringify(userAuthInfo)
  );
};

/**
 * Retrieves the user's authentication information from secure storage.
 *
 * @returns A promise that resolves to a `UserAuthInfo` object if found, or `null` if not present.
 */
export const getUserAuthInfo = async (): Promise<UserAuthInfo | null> => {
  const userAuthInfoString = await SecureStore.getItemAsync(USER_AUTH_INFO_KEY);
  if (!userAuthInfoString) return null;

  try {
    return JSON.parse(userAuthInfoString);
  } catch {
    await SecureStore.deleteItemAsync(USER_AUTH_INFO_KEY);
    return null;
  }
};

// TEAM specific actions

/**
 * Sets the current active team and persists it across app sessions.
 *
 * @param team - The team identifier to set as current.
 * @returns A promise that resolves when the current team has been saved.
 */
export const setCurrentTeam = async (team: string): Promise<void> => {
  await SecureStore.setItemAsync(CURRENT_TEAM_KEY, team);
};

/**
 * Retrieves the current active team from persistent storage.
 *
 * @returns A promise that resolves to the current team identifier, or null if none is set.
 */
export const getCurrentTeam = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(CURRENT_TEAM_KEY);
};

/**
 * Gets the authentication info for the currently selected team.
 *
 * @returns A promise that resolves to the current team's auth info, or null if no team is selected or no auth info exists.
 */
export const getCurrentTeamAuthInfo =
  async (): Promise<TeamAuthInfo | null> => {
    const currentTeam = await getCurrentTeam();
    if (!currentTeam) return null;

    const userAuthInfo = await getUserAuthInfo();
    return userAuthInfo?.[currentTeam] ?? null;
  };

export const removeCurrentTeamAuthInfo = async (): Promise<void> => {
  const currentTeam = await getCurrentTeam();
  if (!currentTeam) return;

  await removeTeamAuthInfo(currentTeam);
};

export const isCurrentTeamAuthenticated = async (): Promise<boolean> => {
  const currentTeamAuthInfo = await getCurrentTeamAuthInfo();
  return currentTeamAuthInfo !== null;
};

// LINK CODE completion tracking, so we don't try to reprocess

/**
 * Checks if a specific authentication code has already been processed.
 *
 * @param code - The authentication code to check.
 * @returns A promise that resolves to true if the code was already processed, false otherwise.
 */
export const isLinkCodeCompleted = async (code: string): Promise<boolean> => {
  const completedCode = await AsyncStorage.getItem(`link_completed_${code}`);
  return completedCode === "true";
};

/**
 * Marks a specific authentication code as completed to prevent re-processing.
 *
 * @param code - The authentication code to mark as completed.
 * @returns A promise that resolves when the code has been marked as completed.
 */
export const markLinkCodeCompleted = async (code: string): Promise<void> => {
  await AsyncStorage.setItem(`link_completed_${code}`, "true");
};

/**
 * Checks if this is a fresh install or version upgrade and clears data if needed.
 * Should be called on app startup before loading any auth info.
 *
 * @param currentVersion - The current app version from package.json
 * @returns A promise that resolves to true if data was cleared, false otherwise
 */
export const clearDataOnFreshInstall = async (
  currentVersion: string
): Promise<boolean> => {
  try {
    const storedVersion = await AsyncStorage.getItem(APP_VERSION_KEY);

    // If no stored version, this is a fresh install or first time running this code
    if (!storedVersion) {
      logger.info("Fresh install detected, clearing all persisted data", {
        currentVersion,
      });
      await clearAllData();
      await AsyncStorage.setItem(APP_VERSION_KEY, currentVersion);
      return true;
    }

    // Store current version for next launch
    if (storedVersion !== currentVersion) {
      logger.info("App version changed", {
        oldVersion: storedVersion,
        newVersion: currentVersion,
      });
      await AsyncStorage.setItem(APP_VERSION_KEY, currentVersion);
    }

    return false;
  } catch (error) {
    logger.error("Failed to check/clear data on fresh install", error);
    return false;
  }
};

/**
 * Clears all app data including authentication info, cached data, and the local database.
 * This is useful for troubleshooting corrupted state or providing a complete reset.
 *
 * @returns A promise that resolves when all data has been cleared.
 */
export const clearAllData = async (): Promise<void> => {
  logger.info("Clearing all app data");

  try {
    // Close database connection
    await closeDb().catch((e) => logger.warn("Failed to close DB", e));

    // Clear SecureStore (auth tokens and link codes)
    await SecureStore.deleteItemAsync(USER_AUTH_INFO_KEY).catch(() => {});
    await SecureStore.deleteItemAsync(CURRENT_TEAM_KEY).catch(() => {});
    await SecureStore.deleteItemAsync(COMPLETED_LINK_CODES_KEY).catch(() => {});

    // Clear AsyncStorage (React Query cache, link codes, etc)
    // Note: We preserve APP_VERSION_KEY so we don't trigger fresh install logic again
    const keys = await AsyncStorage.getAllKeys();
    const keysToRemove = keys.filter((key) => key !== APP_VERSION_KEY);
    await AsyncStorage.multiRemove(keysToRemove);

    logger.info("All app data cleared successfully");
  } catch (error) {
    logger.error("Failed to clear all app data", error);
    throw error;
  }
};
