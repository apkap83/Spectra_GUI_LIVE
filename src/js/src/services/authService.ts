import httpService from "./httpService";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { jwtDecode } from "jwt-decode";
import config from "../config";

const apiEndPointLogin = `${config.apiPrefix}/api/auth/login`;
const apiEndPointGetUserInfo = `${config.apiPrefix}/api/auth/me`;
const apiEndPointLogout = `${config.apiPrefix}/api/auth/logout`;

interface LoginResponse {
  data: { message: string };
}

interface IdentityResponse {
  user: string;
}

// Get JWT from Storage and Set it in Authorization Header
// This is a requirment because on site reload the axios http header config is lost
if (getJWTFromBrowserStorage()) {
  httpService.setJwtAuthHeader(getJWTFromBrowserStorage());
}

function getJWTFromBrowserStorage() {
  return sessionStorage.getItem(config.jwtTokenKeyName);
}

function setJWTInBrowserStorage(jwt: string) {
  sessionStorage.setItem(config.jwtTokenKeyName, jwt);
}

function removeJWTFromBrowserStorage() {
  sessionStorage.removeItem(config.jwtTokenKeyName);
}

function getUserDetailsFromBrowserStorage() {
  const jwt = sessionStorage.getItem(config.jwtTokenKeyName);

  if (!jwt) {
    return null;
  }

  // Decode the Token
  const decodedToken: { exp?: number } = jwtDecode(jwt as string);

  // Check if token has expired
  const currentTime = Date.now() / 1000; // Convert to seconds
  if (decodedToken.exp && decodedToken.exp < currentTime) {
    return null;
  }
  return decodedToken;
}

// export function setJWTInBrowserSessionStorage() {
//   sessionStorage.setItem(config.sessionStorageKey, "ACTIVE");
// }

// export function getJWTFromBrowserSessionStorage() {
//   return sessionStorage.getItem(config.sessionStorageKey);
// }

// export function removeJWTFromBrowserSessionStorage() {
//   sessionStorage.removeItem(config.sessionStorageKey);
// }

export async function login(username: string, password: string) {
  httpService.removeJwtAuthHeader();
  removeJWTFromBrowserStorage();

  try {
    await httpService.post<LoginResponse>(apiEndPointLogin, {
      username,
      password,
    });
  } catch (error) {
    throw error;
  }
}

export async function logout() {
  const response = await httpService.delete(apiEndPointLogout);
  removeJWTFromBrowserStorage();
  // httpService.removeJwtAuthHeader();
}

export async function getUserDetailsFromBackend() {
  try {
    console.log("Getting User Details from Backend");
    const response = await httpService.get<IdentityResponse>(
      apiEndPointGetUserInfo
    );

    if (response.data) {
      const { user: jwt } = response.data;

      // Set JWT in Browser Storage
      setJWTInBrowserStorage(jwt);

      // Decode the Token
      const decodedToken: { exp?: number } = jwtDecode(jwt);

      // Check if token has expired
      const currentTime = Date.now() / 1000; // Convert to seconds
      if (decodedToken.exp && decodedToken.exp < currentTime) {
        return null;
      }

      return decodedToken;
    } else {
      return null;
    }
  } catch (ex) {
    return null;
  }
}

export default {
  login,
  logout,
  getUserDetailsFromBackend,
  getJWTFromBrowserStorage,
  getUserDetailsFromBrowserStorage,
  removeJWTFromBrowserStorage,
};
