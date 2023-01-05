import { monthNameToNumber, yyyymmdd } from "./myutils";
import { downloadFile } from "../services/incidentService";
import { errorNotification } from "../Notification";

// Javascript function to trigger browser to save data to file as if it was downloaded.
const FileDownload = require("js-file-download");

export const downloadAffectedUsersForOutage = (incident, company) => {
  /* Spectra_CLIs_Affected_INC_INC000002030409_OutageID_13150_IPTV_20210319.csv */

  const fileNamePatternForOpennedOutage =
    "Spectra_CLIs_Affected_INC_" +
    incident.incidentId +
    "_OutageID_" +
    incident.outageId +
    "*" +
    ".csv";

  // Spectra_CLIs_Affected_INC_INC000002030409_
  const fileNamePatternForClosedOutage =
    "Spectra_CLIs_Affected_INC_" +
    incident.incidentId +
    "_OutageID_" +
    incident.outageId +
    "*" +
    ".csv";

  /* Spectra_CLIs_Affected_INC_INC000002030409_OutageID_13023_IPTV_20210319.csv */
  // const fileNamePatternForClosedINC =
  //   "Spectra_CLIs_Affected_INC_" +
  //   incident.incidentId +
  //   "_" +
  //   "OutageID" +
  //   "_" +
  //   incident.outageId +
  //   "_" +
  //   incident.affectedServices +
  //   "_" +
  //   "MYDATE" +
  //   ".csv";

  const fileNamePattern =
    incident.incidentStatus === "OPEN"
      ? fileNamePatternForOpennedOutage
      : fileNamePatternForClosedOutage;

  const dirName1 =
    incident.incidentStatus === "OPEN"
      ? "AllOpenedOutages"
      : "AllClosedOutages";

  downloadFile(dirName1, fileNamePattern, company)
    .then((response) => {
      FileDownload(response.data, fileNamePattern);
    })
    .catch((error) => {
      errorNotification(error.code, error.message);
    });
};
