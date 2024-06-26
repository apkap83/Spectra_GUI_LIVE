import httpService from "./httpService";
import axios from "axios";
import config from "../config";
const apiEndPoint = config.apiPrefix + "/api/incidents";

export const getAllSpectraIncidents = async () => {
  try {
    // throw new Error("My Error Message");
    return await httpService.get(`${apiEndPoint}/getallincidents`);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getAllNovaSpectraIncidents = async () => {
  try {
    // throw new Error("My Error Message");
    return await httpService.get(`${apiEndPoint}/nova_getallincidents`);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getNovaOpenSpectraIncidents = async () => {
  try {
    return await httpService.get(`${apiEndPoint}/nova_getopenincidents`);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getOpenSpectraIncidents = async () => {
  try {
    return await httpService.get(`${apiEndPoint}/getopenincidents`);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const willBePublishedNoByOutageId = async (
  outageId: string,
  company: string
) => {
  let prefix = "";
  if (company === "NOVA") prefix = "nova_";

  try {
    return await httpService.put(
      `${apiEndPoint}/${prefix}willbepublishednoforoutageid/` + outageId,
      null,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return Promise.reject(error);
  }
};

export const willBePublishedYesByOutageId = async (
  outageId: string,
  company: string
) => {
  let prefix = "";
  if (company === "NOVA") prefix = "nova_";

  try {
    return await httpService.put(
      `${apiEndPoint}/${prefix}willbepublishedyesforoutageid/` + outageId,
      null,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return Promise.reject(error);
  }
};

export const willBePublishedYesByIncidentId = async (
  incidentId: string,
  company: string
) => {
  let prefix = "";
  if (company === "NOVA") prefix = "nova_";

  try {
    return await httpService.put(
      `${apiEndPoint}/${prefix}willbepublishedyesforincidentid/` + incidentId,
      null,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return Promise.reject(error);
  }
};

export const willBePublishedNoByIncidentId = async (
  incidentId: string,
  company: string
) => {
  let prefix = "";
  if (company === "NOVA") prefix = "nova_";

  try {
    return await httpService.put(
      `${apiEndPoint}/${prefix}willbepublishednoforincidentid/` + incidentId,
      null,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return Promise.reject(error);
  }
};

export const changeMsgForIncidentId = async (
  incidentId: string,
  newMessage: string,
  company: string
) => {
  let prefix = "";
  if (company === "NOVA") prefix = "nova_";

  try {
    return await httpService.put(
      `${apiEndPoint}/${prefix}changemessageforincidentid/` +
        incidentId +
        "/" +
        newMessage,
      null,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return Promise.reject(error);
  }
};

export const changeMsgForOutageId = async (
  outageId: string,
  newMessage: string,
  company: string
) => {
  let prefix = "";
  if (company === "NOVA") prefix = "nova_";

  try {
    return await httpService.put(
      `${apiEndPoint}/${prefix}changemessageforoutageid/` +
        outageId +
        "/" +
        newMessage,
      null,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return Promise.reject(error);
  }
};

export const alterBackupPolicyforIncidentId = async (
  incidentId: string,
  yesOrNo: string,
  company: string
) => {
  let prefix = "";
  if (company === "NOVA") prefix = "nova_";

  try {
    return await httpService.put(
      `${apiEndPoint}/${prefix}alterbackuppolicyforincidentid/` +
        incidentId +
        "/" +
        yesOrNo,
      null,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getOpenCDR_DBIncidents = async (
  incidentId: string,
  yesOrNo: string
) => {
  try {
    return await httpService.get(`${apiEndPoint}/getopencdrdbincidents/`);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getClosedCDR_DBIncidents = async (
  incidentId: string,
  yesOrNo: string
) => {
  try {
    return await httpService.get(`${apiEndPoint}/getclosedcdrdbincidents/`);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getAdHocOutages = async (company: string) => {
  let prefix = "";
  if (company === "NOVA") prefix = "nova_";

  try {
    return await httpService.get(`${apiEndPoint}/${prefix}getalladhocoutages/`);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const downloadFile = async (
  dirName1: string,
  fileName: string,
  company: string
) => {
  let prefix = "";
  if (company === "NOVA") prefix = "nova_";

  return await axios({
    url: `${apiEndPoint}/${prefix}downloadfile/` + dirName1 + "/" + fileName,
    method: "GET",
    responseType: "blob",
  });
};

export const downloadPosSpectra = async (
  company: string,
  incidentId: string
) => {
  if (company === "NOVA") {
    return await axios({
      url:
        `${apiEndPoint}/downloadcustomerscalledfornovaincidentid/` + incidentId,
      method: "GET",
      responseType: "blob",
    });
  } else if (company === "WIND") {
    return await axios({
      url:
        `${apiEndPoint}/downloadcustomerscalledforwindincidentid/` + incidentId,
      method: "GET",
      responseType: "blob",
    });
  }
};

export const getStatsForWindIncident = async (incidentId: string) => {
  try {
    return await httpService.get(
      `${apiEndPoint}/getstatsforwindincidentid/${incidentId}`
    );
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getStatsForNovaIncident = async (incidentId: string) => {
  try {
    return await httpService.get(
      `${apiEndPoint}/getstatsfornovaincidentid/${incidentId}`
    );
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getStatsForRespectiveCompanyAndIncident = async (
  company: string,
  incidentId: string
) => {
  if (company === "WIND") {
    const { data } = await getStatsForWindIncident(incidentId);
    return data;
  }

  if (company === "NOVA") {
    const { data } = await getStatsForNovaIncident(incidentId);
    return data;
  }
};
