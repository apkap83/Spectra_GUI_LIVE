import httpService from "./httpService";
import axios from "axios";
import config from "../config.json";
const apiEndPoint = config.apiPrefix + "/api/users";

export const getAllUsersDetails = async () => {
  try {
    // throw new Error("My Error Message");
    return await httpService.get(`${apiEndPoint}/getalluserdetails`);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getAllAvailableRoles = async () => {
  try {
    // throw new Error("My Error Message");
    return await httpService.get(`${apiEndPoint}/getdistinctroles`);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const addUser = async (user) => {
  console.log("user = ", user);
  try {
    // throw new Error("My Error Message");
    return await httpService.post(`${apiEndPoint}/addnewuser`, {
      realName: user.realName,
      userName: user.userName,
      active: user.active,
      password: user.password,
      role: user.role,
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateUser = async (user) => {
  try {
    // throw new Error("My Error Message");
    return await httpService.post(`${apiEndPoint}/updateuser`, {
      realName: user.realName,
      userName: user.userName,
      active: user.active,
      password: user.password,
      role: user.role,
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

export const deleteUser = async (user) => {
  try {
    // throw new Error("My Error Message");
    return await httpService.post(`${apiEndPoint}/deleteuser`, {
      realName: user.realName,
      userName: user.userName,
      active: user.active,
      password: user.password,
      role: user.role,
    });
  } catch (error) {
    return Promise.reject(error);
  }
};
