// /types/auth.ts
export type User = {
  id: string;
  email: string;
  name?: string;
  // add other fields returned by your API
};

export type LoginResponse = {
  accessToken?: string;
  user?: User | null;
};

export type RegisterResponse = {
  accessToken?: string;
  user?: User | null;
};
