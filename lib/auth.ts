import {
  makeRedirectUri,
  refreshAsync,
  TokenResponse,
} from "expo-auth-session";
import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "auth_token";
const ID_TOKEN_KEY = "id_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const ACCESS_EXPIRATION_KEY = "access_expiration";

const refreshThresholdMs = 60_000; // refresh access token 1 min before expiry

const tenant = process.env.EXPO_PUBLIC_AZURE_TENANT_ID;
const clientId = process.env.EXPO_PUBLIC_AZURE_CLIENT_ID;

if (!tenant || !clientId) {
  throw new Error(
    "Azure AD configuration is missing. Please check your environment variables."
  );
}

const discovery = {
  authorizationEndpoint: `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize`,
  tokenEndpoint: `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`,
};

const redirectUri = makeRedirectUri({
  scheme: "harvest-mobile",
  path: "auth-callback",
});

const authConfig = {
  clientId,
  tenant,
  discovery,
  redirectUri,
};

type UserInfo = {
  email: string;
  name: string;
  sid: string;
  // TODO: add in IAMID pulled from azure graph api
};

// TODO: maybe we don't need this sync helpers
const isAuthenticatedAsync = async () => {
  const token = await getAuthTokenAsync();
  return token !== null;
};

const isAuthenticated = () => {
  const token = getAuthToken();
  return token !== null;
};

const getAuthTokenAsync = async () => {
  return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
};

const getAuthToken = (): string | null => {
  return SecureStore.getItem(ACCESS_TOKEN_KEY);
};

const deleteAuthTokensAsync = async () => {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(ID_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  await SecureStore.deleteItemAsync(ACCESS_EXPIRATION_KEY);
};

const setAuthTokenAsync = async (response: TokenResponse) => {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, response.accessToken);
  if (!response.idToken || !response.refreshToken || !response.expiresIn) {
    throw new Error(
      "ID token and refresh token are required for authentication."
    );
  }
  await SecureStore.setItemAsync(ID_TOKEN_KEY, response.idToken);
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, response.refreshToken);
  await SecureStore.setItemAsync(
    ACCESS_EXPIRATION_KEY,
    String(Date.now() + response.expiresIn * 1000)
  );
};

/**
 * Retrieves a valid access token, refreshing it if necessary.
 *
 * This function checks the expiration time of the current access token stored in `SecureStore`.
 * If the token is still valid (i.e., its expiration time minus the current time is greater than the refresh threshold),
 * it returns the existing access token. Otherwise, it attempts to refresh the token using the stored refresh token.
 * If the refresh is successful, it updates the stored access token, expiration time, and (optionally) refresh token.
 *
 * @returns {Promise<string>} The valid access token.
 * @throws {Error} If no refresh token is available (i.e., the user is not logged in).
 */
const getValidAccessTokenAsync = async () => {
  const accessExp = Number((await SecureStore.getItemAsync("accessExp")) ?? 0);
  const now = Date.now();

  if (accessExp - now > refreshThresholdMs) {
    // still good
    return await SecureStore.getItemAsync("accessToken");
  }

  // use the refresh token
  const refreshToken = await SecureStore.getItemAsync("refreshToken");
  if (!refreshToken) throw new Error("Not logged in");

  const refreshed = await refreshAsync({ clientId, refreshToken }, discovery);

  // persist new values
  await SecureStore.setItemAsync("accessToken", refreshed.accessToken);
  await SecureStore.setItemAsync(
    "accessExp",
    String(now + (refreshed.expiresIn || 0) * 1000)
  );
  if (refreshed.refreshToken) {
    // Azure may issue a new one
    await SecureStore.setItemAsync("refreshToken", refreshed.refreshToken);
  }

  return refreshed.accessToken;
};

const getUserInfoFromIdToken = (idToken?: string) => {
  if (!idToken) throw new Error("ID token is required");

  const payload = idToken.split(".")[1];

  const userInfo: UserInfo = JSON.parse(atob(payload));
  return userInfo;
};

const getUserInfo = () => {
  const idToken = SecureStore.getItem(ID_TOKEN_KEY);

  if (!idToken) return undefined;

  return getUserInfoFromIdToken(idToken);
};

export {
  authConfig,
  deleteAuthTokensAsync,
  getAuthToken,
  getAuthTokenAsync,
  getUserInfo,
  getUserInfoFromIdToken,
  getValidAccessTokenAsync,
  isAuthenticated,
  isAuthenticatedAsync,
  setAuthTokenAsync,
  UserInfo,
};
