import httpService from "./httpService";
import { jwtDecode } from "jwt-decode";
import config from "../config";
const apiEndPointLogin = `${config.apiPrefix}/api/auth/login`;
const apiEndPointGetUserInfo = `${config.apiPrefix}/api/auth/me`;
const apiEndPointLogout = `${config.apiPrefix}/api/auth/logout`;

// Get JWT from Storage and Set it in Authorization Header
if (getJwt()) {
  httpService.setJwtAuthHeader(getJwt());
}

export function getJwt() {
  return sessionStorage.getItem(config.jwtTokenKeyName);
}

export async function login(username: string, password: string) {
  await httpService.post(apiEndPointLogin, {
    username,
    password,
  });

  const { data } = await httpService.get(apiEndPointGetUserInfo);
  console.log("Login data", data);
}

export async function logout() {
  // sessionStorage.removeItem(config.jwtTokenKeyName);
  await httpService.delete(apiEndPointLogout);
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
