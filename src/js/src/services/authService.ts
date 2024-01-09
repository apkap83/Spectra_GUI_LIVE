import httpService from "./httpService";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { jwtDecode } from "jwt-decode";
import config from "../config";

const apiEndPointLogin = `${config.apiPrefix}/api/auth/login`;
const apiEndPointGetUserInfo = `${config.apiPrefix}/api/auth/me`;
const apiEndPointLogout = `${config.apiPrefix}/api/auth/logout`;

interface LoginResponse {
  jwt: string;
}

// Get JWT from Storage and Set it in Authorization Header
// This is a requirment because on site reload the axios http header config is lost
if (getJWTFromBrowserStorage()) {
  httpService.setJwtAuthHeader(getJWTFromBrowserStorage());
}

export function getJWTFromBrowserStorage() {
  return localStorage.getItem(config.jwtTokenKeyName);
}

export function setJWTInBrowserStorage(jwt: string) {
  localStorage.setItem(config.jwtTokenKeyName, jwt);
}

export function removeJWTFromBrowserStorage() {
  localStorage.removeItem(config.jwtTokenKeyName);
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
    const response = await httpService.post<LoginResponse>(apiEndPointLogin, {
      username,
      password,
    });

    if (response.data) {
      const { jwt } = response.data;

      httpService.setJwtAuthHeader(jwt);
      setJWTInBrowserStorage(jwt);
    } else {
      throw new Error("Login failed: No data received");
    }
  } catch (error) {
    throw error;
  }
}

export async function logout() {
  removeJWTFromBrowserStorage();
  httpService.removeJwtAuthHeader();
}

export function getCurrentUser() {
  try {
    const jwt = getJWTFromBrowserStorage();
    if (!jwt) {
      return null;
    }

    const decodedToken: { exp?: number } = jwtDecode(jwt);

    // Check if token has expired
    const currentTime = Date.now() / 1000; // Convert to seconds
    if (decodedToken.exp && decodedToken.exp < currentTime) {
      return null;
    }

    return decodedToken;
  } catch (ex) {
    return null;
  }
}

export default {
  login,
  logout,
  getCurrentUser,
};
