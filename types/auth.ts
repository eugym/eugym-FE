// /types/ahtu.ts;
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

// export interface User {
//   id: string;
//   email: string;
//   name: string;
//   role: "admin" | "user";
// }

export interface AuthResponse {
  user: User;
  token: string; // If using Bearer tokens, otherwise cookies handle this
}
