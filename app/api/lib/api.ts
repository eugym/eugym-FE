// app/api/lib/api.ts
import axios from "axios";
import { getAccessToken } from "./token";
import { isTokenExpired } from "@/app/utilities/isTokenExpired";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  config.headers = config.headers || {};

  if (!config.headers.Authorization) {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;

// ******* new **********

// import axios from "axios";
// import { getAccessToken } from "./token";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
// });

// api.interceptors.request.use((config) => {
//   const token = getAccessToken();
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;
