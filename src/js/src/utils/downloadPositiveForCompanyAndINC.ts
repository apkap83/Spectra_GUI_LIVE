import { downloadPosSpectra } from "../services/incidentService";
import { errorNotification } from "../components/common/Notification";
import { capitalizeFirstLetter } from "./myutils";

import { IncidentType } from "../types/IncidentType";
import { AxiosResponse } from "axios";

// Javascript function to trigger browser to save data to file as if it was downloaded.
const FileDownload = require("js-file-download");

export const downloadPosSpectraForCompanyAndINC = (
  incident: IncidentType,
  company: string
) => {
  const now = new Date();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthIndex = now.getMonth();
  const monthName = monthNames[monthIndex];

  const dateTimeString = `${now.getDate()}_${monthName}_${now.getFullYear()}_${now.getHours()}_${now.getMinutes()}_${now.getSeconds()}`;

  const fileName =
    "Positive_Spectra_Requests_For_" +
    capitalizeFirstLetter(company) +
    "_INC_" +
    incident.incidentId +
    "_" +
    dateTimeString +
    ".csv";

  interface DownloadResponse {
    data: Blob;
  }

  downloadPosSpectra(company, incident.incidentId)
    .then((response: AxiosResponse<DownloadResponse> | undefined) => {
      FileDownload(response && response.data, fileName);
    })
    .catch((error) => {
      errorNotification(error.code, error.message);
    });
};
