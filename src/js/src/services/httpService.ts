import axios from "axios";
import config from "../config";
import { errorNotification } from "../components/common/Notification";

// Set withCredentials to true for all requests
// you're instructing Axios to send cookies and other credentials in every HTTP request made by your application.
// This is important for scenarios where your backend relies on cookies for session management or authentication.
axios.defaults.withCredentials = true;

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

  if (sessionStorage.getItem(config.jwtTokenKeyName)) {
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
    sessionStorage.removeItem(config.jwtTokenKeyName);

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
