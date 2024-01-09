const config = {
  appTitle: "Spectra Live",
  // DEV
  // apiPrefix: "http://127.0.0.1:4000",
  // apiPrefixForIframeDuringRemoteDev: "http://127.0.0.1:4000",
  // apiPrefixForOpenAIFunctionsPage: "http://127.0.0.1:4000",
  // homePage: "/nova/allspectraincidents",

  // PRODUCTION
  apiPrefix: `https://${window.location.hostname}:${window.location.port}`,
  apiPrefixForIframeDuringRemoteDev: `https://${window.location.hostname}:${window.location.port}`,
  apiPrefixForOpenAIFunctionsPage: `https://${window.location.hostname}:${window.location.port}`,
  homePage: "/nova/allspectraincidents",

  jwtTokenKeyName: "JWT_Token",
  sessionStorageKey: "Session",
};

export default config;
