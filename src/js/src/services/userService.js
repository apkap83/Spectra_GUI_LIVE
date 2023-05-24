import httpService from "./httpService";
import axios from "axios";
import config from "../config.json";
const apiEndPoint = config.apiPrefix + "/api/users";

export const getAllUsersDetails = async () => {
  try {
    return await httpService.get(`${apiEndPoint}/getalluserdetails`);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getAllAvailableRoles = async () => {
  try {
    return await httpService.get(`${apiEndPoint}/getdistinctroles`);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const addUser = async (user) => {
  try {
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

export const updateUserRole = async (user) => {
  try {
    return await httpService.post(`${apiEndPoint}/updateuserrole`, {
      userName: user.userName,
      role: user.role,
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

export const deleteUser = async (user) => {
  try {
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

export const disableUser = async (user) => {
  try {
    return await httpService.post(`${apiEndPoint}/disableuser`, {
      realName: user.realName,
      userName: user.userName,
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

export const enableUser = async (user) => {
  try {
    return await httpService.post(`${apiEndPoint}/enableuser`, {
      realName: user.realName,
      userName: user.userName,
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

export const changeUserPassword = async (userDetails) => {
  try {
    return await httpService.post(`${apiEndPoint}/changeuserpassword`, {
      realName: userDetails.realName,
      userName: userDetails.userName,
      password: userDetails.password,
    });
  } catch (error) {
    return Promise.reject(error);
  }
};