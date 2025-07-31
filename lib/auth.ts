import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";

const isAuthenticatedAsync = async () => {
  const token = await getAuthTokenAsync();
  return token !== null;
};

const isAuthenticated = () => {
  const token = getAuthToken();
  return token !== null;
};

const getAuthTokenAsync = async () => {
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

// Synchronous version (returns undefined, since SecureStore is async-only)
const getAuthToken = (): string | null => {
  return SecureStore.getItem(TOKEN_KEY);
};

const setAuthTokenAsync = async (token: string | null) => {
  if (token === null) {
    return await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
  return await SecureStore.setItemAsync(TOKEN_KEY, token);
};

export {
  getAuthToken,
  getAuthTokenAsync,
  isAuthenticated,
  isAuthenticatedAsync,
  setAuthTokenAsync,
};
