import { monthNameToNumber, yyyymmdd } from "./myutils";
import { downloadFile } from "../services/incidentService";
import { errorNotification } from "../common/Notification";

import { IncidentType } from "../types/IncidentType";

// Javascript function to trigger browser to save data to file as if it was downloaded.
const FileDownload = require("js-file-download");

export const downloadAffectedUsersForIncident = (
  incident: IncidentType,
  company: string
) => {
  // Spectra_CLIs_Affected_INC_INC000002030409_
  const fileNamePatternForOpennedINC =
    "Spectra_CLIs_Affected_INC_" + incident.incidentId + "*" + ".csv";

  // Spectra_CLIs_Affected_INC_INC000002030409_
  const fileNamePatternForClosedINC =
    "Spectra_CLIs_Affected_INC_" + incident.incidentId + "*" + ".csv";

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

  const fileNamePattern =
    incident.incidentStatus === "OPEN"
      ? fileNamePatternForOpennedINC
      : fileNamePatternForClosedINC;

  const dirName1 = "AllOpenedOutages";
  // incident.incidentStatus === "OPEN"
  //   ? "AllOpenedOutages"
  //   : "AllClosedOutages";

  downloadFile(dirName1, fileNamePattern, company)
    .then((response) => {
      FileDownload(response.data, fileNamePattern, company);
    })
    .catch((error) => {
      errorNotification(error.code, error.message);
    });
};
