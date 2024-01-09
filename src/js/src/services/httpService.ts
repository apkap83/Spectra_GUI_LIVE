import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import config from "../config";
import { errorNotification } from "../components/common/Notification";
import { getCurrentUser } from "./authService";

// Set withCredentials to true for all requests
// you're instructing Axios to send cookies and other credentials in every HTTP request made by your application.
// This is important for scenarios where your backend relies on cookies for session management or authentication.
axios.defaults.withCredentials = true;

axios.interceptors.response.use(null, (error) => {
  // Unexpected Errors (network down, server down, db down, bug)
  // - Log them
  // - Display a generic and friendly message
  // const expectedError =
  //   error.response &&
  //   error.response.status >= 400 &&
  //   error.response.status < 500;

  // if (!expectedError) {
  // errorNotification("An unexpected error occured", error.message);
  // }

  // if (getCurrentUser()) {
  //   if (error.response) {
  //     const { data, status, headers } = error.response;
  //     errorNotification(data.error, data.message);
  //   } else if (error.request) {
  //     errorNotification(error.request);
  //   } else {
  //     errorNotification("Error", error.message);
  //   }
  // }

  // Redirect the user to the login page (in case of HTTP 401 Unauthorized)
  if (error.response.status === 401) {
    // Remove JWT from Session
    //localStorage.removeItem(config.jwtTokenKeyName);

    //sessionStorage.setItem("preLoginURL", window.location.href);

    // Redirect to login page
    window.location = "/login" as unknown as Location;
  }

  if (error.message === "Network Error" && !error.response) {
    // Handle the network error
    console.error("Network error: Make sure API is running!");
    // You can also display a notification to the user here
  }

  // You can handle other kinds of errors here (e.g., response errors)

  return Promise.reject(error);
});

interface HttpResponse<T> {
  success: boolean;
  data?: T;
  error?: any;
}

async function handleRequest<T>(
  requestFunc: (...args: any[]) => Promise<AxiosResponse<T>>,
  ...args: any[]
): Promise<HttpResponse<T>> {
  try {
    const response: AxiosResponse<T> = await requestFunc(...args);
    return { success: true, data: response.data };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error("Server Error:", error.response);
        errorNotification("Server Error", error.response.data.message);
      } else if (error.request) {
        console.error("Network Error", error.request);
        errorNotification("Network Error", "No response was received");
      }
    } else {
      console.error("Error", error.message);
      errorNotification("Error", error.message);
    }

    return { success: false, error: error };
  }
}

const httpService = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    handleRequest<T>(axios.get, url, config),
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    handleRequest<T>(axios.post, url, data, config),
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    handleRequest<T>(axios.put, url, data, config),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    handleRequest<T>(axios.delete, url, config),
  setJwtAuthHeader: (jwt: string | null) => {
    axios.defaults.headers.common["Authorization"] = `Bearer: ${jwt}`;
  },
  removeJwtAuthHeader: () => {
    axios.defaults.headers.common["Authorization"] = undefined;
  },
};

export default httpService;
