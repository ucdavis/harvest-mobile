import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";

const isAuthenticated = () => {
  const token = getAuthToken();
  return token !== null;
};

const getAuthToken = async () => {
  return await SecureStore.getItem(TOKEN_KEY);
};

const setAuthToken = async (token: string) => {
  return await SecureStore.setItem(TOKEN_KEY, token);
};

export { getAuthToken, isAuthenticated, setAuthToken };
