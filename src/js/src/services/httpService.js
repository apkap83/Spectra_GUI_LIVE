import axios from "axios";
import config from "../config.json";
import { errorNotification } from "../common/Notification";

axios.interceptors.response.use(null, (error) => {
  // Unexpected Errors (network down, server down, db down, bug)
  // - Log them
  // - Display a generic and friendly message
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    errorNotification("An unexpected error occured");
  }

  // Redirect the user to the login page (in case of HTTP 401 Unauthorized)
  if (error.response.status === 401) {
    // Remove JWT from Session
    sessionStorage.removeItem(config.jwtTokenKeyName);

    // Redirect to login page
    window.location = "/login";
  }

  return Promise.reject(error);
});

const setJwtAuthHeader = (jwt) => {
  console.log("Setting Header: Authorization: Bearer", jwt);
  axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
};

const exportedObject = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwtAuthHeader,
};

export default exportedObject;
