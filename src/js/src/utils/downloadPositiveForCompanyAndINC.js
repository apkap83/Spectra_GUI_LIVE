import { downloadPosSpectra } from "../services/incidentService";
import { errorNotification } from "../Notification";
import { capitalizeFirstLetter } from "./myutils";

// Javascript function to trigger browser to save data to file as if it was downloaded.
const FileDownload = require("js-file-download");

export const downloadPosSpectraForCompanyAndINC = (incident, company) => {
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

  downloadPosSpectra(company, incident.incidentId)
    .then((response) => {
      FileDownload(response.data, fileName);
    })
    .catch((error) => {
      errorNotification(error.code, error.message);
    });
};
