import httpService from "./httpService";
import { jwtDecode } from "jwt-decode";
import config from "../config";
const apiEndPoint = `${config.apiPrefix}/api/authenticate`;

// Get JWT from Storage and Set it in Authorization Header
if (getJwt()) {
  httpService.setJwtAuthHeader(getJwt());
}

export function getJwt() {
  return sessionStorage.getItem(config.jwtTokenKeyName);
}

export async function login(username: string, password: string) {
  const { data } = await httpService.post(apiEndPoint, {
    username,
    password,
  });
  sessionStorage.setItem(config.jwtTokenKeyName, data.jwt);
}

export async function logout() {
  sessionStorage.removeItem(config.jwtTokenKeyName);
}

export function getCurrentUser() {
  try {
    const jwt = sessionStorage.getItem(config.jwtTokenKeyName);

    if (jwt === null) {
      return null; // or handle the case when jwt is null
    }

    return jwtDecode(jwt);
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
