import axios from "axios";
import config from "../config";
import { errorNotification } from "../components/common/Notification";

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

  if (localStorage.getItem(config.jwtTokenKeyName)) {
    if (error.response) {
      const { data, status, headers } = error.response;
      errorNotification(data.error, data.message);
    } else if (error.request) {
      errorNotification(error.request);
    } else {
      errorNotification("Error", error.message);
    }
  }

  // Redirect the user to the login page (in case of HTTP 401 Unauthorized)
  if (error.response.status === 401) {
    // Remove JWT from Session
    localStorage.removeItem(config.jwtTokenKeyName);

    sessionStorage.setItem("preLoginURL", window.location.href);

    // Redirect to login page
    window.location = "/login" as unknown as Location;
  }

  return Promise.reject(error);
});

const setJwtAuthHeader = (jwt: string | null) => {
  axios.defaults.headers.common["Authorization"] = `Bearer: ${jwt}`;
};

const exportedObject = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwtAuthHeader,
};

export default exportedObject;
