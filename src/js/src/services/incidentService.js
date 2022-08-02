import httpService from "./httpService";
import axios from "axios";
const apiEndPoint = "/api/incidents";

export const getAllSpectraIncidents = async () => {
  try {
    // throw new Error("My Error Message");
    return await httpService.get(`${apiEndPoint}/getallincidents`);
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

export const willBePublishedNoByOutageId = async (outageId) => {
  try {
    return await httpService.put(
      `${apiEndPoint}/willbepublishednoforoutageid/` + outageId,
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

export const willBePublishedYesByOutageId = async (outageId) => {
  try {
    return await httpService.put(
      `${apiEndPoint}/willbepublishedyesforoutageid/` + outageId,
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

export const willBePublishedYesByIncidentId = async (incidentId) => {
  try {
    return await httpService.put(
      `${apiEndPoint}/willbepublishedyesforincidentid/` + incidentId,
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

export const willBePublishedNoByIncidentId = async (incidentId) => {
  try {
    return await httpService.put(
      `${apiEndPoint}/willbepublishednoforincidentid/` + incidentId,
      null,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.log(85);
    return Promise.reject(error);
  }
};

export const changeMsgForIncidentId = async (incidentId, newMessage) => {
  try {
    return await httpService.put(
      `${apiEndPoint}/changemessageforincidentid/` +
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

export const changeMsgForOutageId = async (outageId, newMessage) => {
  try {
    return await httpService.put(
      `${apiEndPoint}/changemessageforoutageid/` + outageId + "/" + newMessage,
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

export const alterBackupPolicyforIncidentId = async (incidentId, yesOrNo) => {
  try {
    return await httpService.put(
      `${apiEndPoint}/alterbackuppolicyforincidentid/` +
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

export const getOpenCDR_DBIncidents = async (incidentId, yesOrNo) => {
  try {
    return await httpService.get(`${apiEndPoint}/getopencdrdbincidents/`);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getClosedCDR_DBIncidents = async (incidentId, yesOrNo) => {
  try {
    return await httpService.get(`${apiEndPoint}/getclosedcdrdbincidents/`);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getAdHocOutages = async () => {
  try {
    return await httpService.get(`${apiEndPoint}/getalladhocoutages/`);
  } catch (error) {
    return Promise.reject(error);
  }
};

export async function downloadFile(dirName1, fileName) {
  return await axios({
    url: "api/incidents/downloadfile/" + dirName1 + "/Test_Env/" + fileName,
    method: "GET",
    responseType: "blob",
  });
}
