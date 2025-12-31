const TOKEN_KEY = "accessToken";

export const setAccessToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const removeAccessToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};
