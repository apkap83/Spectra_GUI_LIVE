import httpService from "./httpService";
import { jwtDecode } from "jwt-decode";
import config from "../config";
const apiEndPoint = `${config.apiPrefix}/api/authenticate`;

// Get JWT from Storage and Set it in Authorization Header
if (getJwt()) {
  httpService.setJwtAuthHeader(getJwt());
}

export function getJwt() {
  return localStorage.getItem(config.jwtTokenKeyName);
}

export async function login(username: string, password: string) {
  const { data } = await httpService.post(apiEndPoint, {
    username,
    password,
  });
  const { jwt } = data;
  localStorage.setItem(config.jwtTokenKeyName, jwt);
  httpService.setJwtAuthHeader(jwt);
}

export async function logout() {
  console.log("auth service 32");
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
      console.log("Token has expired");
      return null;
    }

    return decodedToken;
  } catch (ex) {
    console.error("Error decoding JWT:", ex);
    return null;
  }
}

export default {
  login,
  logout,
  getCurrentUser,
  getJwt,
};
