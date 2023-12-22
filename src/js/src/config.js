const config = {
  appTitle: "Spectra Live",
  // DEV
  // apiPrefix: "http://127.0.0.1:4000",
  // apiPrefixForIframeDuringRemoteDev: "http://127.0.0.1:4000",

  // PRODUCTION
  apiPrefix: `https://${window.location.hostname}:${window.location.port}`,
  apiPrefixForIframeDuringRemoteDev: `https://${window.location.hostname}:${window.location.port}`,

  jwtTokenKeyName: "JWT_Token",
};

export default config;
