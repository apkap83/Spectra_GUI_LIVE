const a = () => {
  // "10 Mar 2021 03:00:00"
  let currentDateString = incident.requestTimestamp.split(" ");
  let mydate = new Date(
    currentDateString[2],
    monthNameToNumber(currentDateString[1]) - 1,
    currentDateString[0]
  );
  /* Spectra_CLIs_Affected_INC_INC000002030409_OutageID_13150_IPTV_20210319.csv */
  const fileNameForOpennedINC =
    "Spectra_CLIs_Affected_INC_" +
    incident.incidentId +
    "_" +
    "OutageID" +
    "_" +
    incident.outageId +
    "_" +
    incident.affectedServices +
    "_" +
    yyyymmdd(mydate) +
    ".csv";
  /* Spectra_CLIs_Affected_OutageID_13023_IPTV_20210319.csv */
  const fileNameForClosedINC =
    "Spectra_CLIs_Affected_" +
    "OutageID" +
    "_" +
    incident.outageId +
    "_" +
    incident.affectedServices +
    "_" +
    yyyymmdd(mydate) +
    ".csv";

  const fileName =
    incident.incidentStatus === "OPEN"
      ? fileNameForOpennedINC
      : fileNameForClosedINC;

  const dirName1 =
    incident.incidentStatus === "OPEN"
      ? "AllOpenedOutages"
      : "AllClosedOutages";

  downloadFile(dirName1, fileName).then((response) => {
    FileDownload(response.data, fileName);
  });
};
