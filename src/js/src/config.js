const config = {
  appTitle: "Spectra Live",
  // DEV
  apiPrefix: "https://127.0.0.1:15000",
  apiPrefixForIframeDuringRemoteDev: "https://10.10.18.120:4000",
  apiPrefixForOpenAIFunctionsPage: "http://127.0.0.1:4000",
  homePage: "/nova/allspectraincidents",

  // PRODUCTION
  // apiPrefix: `https://${window.location.hostname}:${window.location.port}`,
  // apiPrefixForIframeDuringRemoteDev: `https://${window.location.hostname}:${window.location.port}`,
  // apiPrefixForOpenAIFunctionsPage: `https://${window.location.hostname}:${window.location.port}`,
  // homePage: "/nova/allspectraincidents",

  jwtTokenKeyName: "JWT_Token",
  sessionStorageKey: "Session",
  loggedInUser: "LoggedInUser",
};

export default config;
