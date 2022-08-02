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

const exportedObject = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};

export default exportedObject;
