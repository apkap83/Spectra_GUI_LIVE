import axios from "axios";
import { errorNotification } from "../Notification";

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
