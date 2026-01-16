const ROLE_KEY = "userRole";

export const setUserRole = (role: string) => {
  localStorage.setItem(ROLE_KEY, role);
};

export const getUserRole = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ROLE_KEY);
};

export const clearUserRole = () => {
  localStorage.removeItem(ROLE_KEY);
};
