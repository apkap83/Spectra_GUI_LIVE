const config = {
  appTitle: "Spectra Live",
  // apiPrefix: "https://10.10.18.120:4000",
  // apiPrefixForIframeDuringRemoteDev: "https://10.10.18.120:4000",
  apiPrefix: `https://${window.location.hostname}:${window.location.port}`,
  apiPrefixForIframeDuringRemoteDev: `https://${window.location.hostname}:${window.location.port}`,
  jwtTokenKeyName: "JWT_Token",
};

export default config;
