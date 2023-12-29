import httpService from "./httpService";
import { jwtDecode } from "jwt-decode";
import config from "../config";
const apiEndPoint = `${config.apiPrefix}/api/authenticate`;

interface LoginResponse {
  jwt: string;
}

// Get JWT from Storage and Set it in Authorization Header
if (getJwt()) {
  httpService.setJwtAuthHeader(getJwt());
}

export function getJwt() {
  return localStorage.getItem(config.jwtTokenKeyName);
}

export async function login(username: string, password: string) {
  const response = await httpService.post<LoginResponse>(apiEndPoint, {
    username,
    password,
  });

  if (response.data) {
    const { jwt } = response.data;
    localStorage.setItem(config.jwtTokenKeyName, jwt);
    httpService.setJwtAuthHeader(jwt);
  } else {
    // Handle the case where data is undefined
    console.error("Login failed: No data received");
    // Perform additional error handling as needed
  }
}

export async function logout() {
  localStorage.removeItem(config.jwtTokenKeyName);
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(config.jwtTokenKeyName);
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
  getJwt,
};
