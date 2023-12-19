const config = {
  appTitle: "Spectra Live",
  apiPrefix: "https://127.0.0.1:15000",
  apiPrefixForIframeDuringRemoteDev: "https://10.10.18.120:4000",
  // apiPrefix: `https://${window.location.hostname}:${window.location.port}`,
  // apiPrefixForIframeDuringRemoteDev: `https://${window.location.hostname}:${window.location.port}`,
  jwtTokenKeyName: "JWT_Token",
  userDetailsVarName: "User_Details",
};

export default config;
