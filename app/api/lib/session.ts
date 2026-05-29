let _token: string | null = null;

export const setSessionToken = (token: string) => {
  _token = token;
};

export const clearSessionToken = () => {
  _token = null;
};

export const getSessionToken = () => _token;
