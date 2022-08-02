import React, { useEffect } from "react";
import { useState } from "react";
import { Button, message, Checkbox } from "antd";
// import { willBePublishedNoByIncidentId } from "../client";
import { errorNotification } from "../Notification";

import {
  willBePublishedYesByOutageId,
  willBePublishedNoByOutageId,
  willBePublishedYesByIncidentId,
  willBePublishedNoByIncidentId,
} from "../services/incidentService";

export default function BroadcastingOutageForm({
  onOutageSuccess,
  onIncidentSuccess,
  selectedIncident,
  setShowModalDisOutage,
}) {
  const [allOutagesCheckBox, setAllOutagesCheckBox] = useState(true);
  const [forDisable, setForDisable] = useState("");

  const { incidentId: incidentID, outageId: outageID } = selectedIncident;
  const onChange = (e) => {
    setAllOutagesCheckBox(e.target.checked);
  };

  useEffect(() => {
    if (selectedIncident.willBePublished === "Yes") {
      setForDisable(true);
    } else {
      setForDisable(false);
    }
  });

  function enableOrDisableText(incident) {
    return incident.willBePublished === "Yes" ? "disable" : "enable";
  }

  function onYesActions() {
    const { incidentId } = selectedIncident;
    // From Yes to No
    if (forDisable) {
      if (allOutagesCheckBox) {
        willBePublishedNoByIncidentId(incidentId)
          .then(() => {
            onIncidentSuccess(incidentId, "No");
            message.success(
              "Successfully updated IncidentID: " + incidentId,
              4
            );
          })
          .catch((error) => errorNotification("ERROR", error.message));
      } else {
        // For Disable - From Yes to No for Outage
        willBePublishedNoByOutageId(outageID)
          .then(() => {
            onOutageSuccess(outageID, "No");
            message.success("Successfully updated OutageID: " + outageID, 4);
          })
          .catch((error) => errorNotification("ERROR", error.message));
      }
    } else {
      // For Enable - From No to Yes for Incident
      if (allOutagesCheckBox) {
        willBePublishedYesByIncidentId(incidentId)
          .then(() => {
            onIncidentSuccess(incidentId, "Yes");
            message.success(
              "Successfully updated IncidentID: " + incidentId,
              4
            );
          })
          .catch((error) => errorNotification("ERROR", error.message));
      } else {
        // For Enable - From No to Yes for Outage
        willBePublishedYesByOutageId(outageID)
          .then(() => {
            onOutageSuccess(outageID, "Yes");
            message.success("Successfully updated OutageID: " + outageID, 4);
          })
          .catch((error) => errorNotification("ERROR", error.message));
      }
    }
  }

  return (
    <div
      style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        alignContent: "center",
        justifyContent: "space-between",
        fontSize: "20px",
      }}
    >
      <label style={{ textAlign: "center" }}>
        Are you sure you want to{" "}
        <strong>{enableOrDisableText(selectedIncident)}</strong> publishing for
        Spectra Outage with ID:
        <b> {outageID} ?</b>
      </label>
      <br />
      <div>
        <Checkbox
          onChange={onChange}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            verticalAlign: "middle",
          }}
          defaultChecked={allOutagesCheckBox}
        >
          <span style={{ fontSize: "14px" }}>
            Apply this action for all Outages of this Incident. (
            <b>{incidentID}</b>)
          </span>
        </Checkbox>
      </div>
      <br />
      <div>
        <Button
          style={{
            marginRight: "50px",
          }}
          type="primary"
          onClick={onYesActions}
        >
          Yes
        </Button>
        <Button
          style={{}}
          type="primary"
          onClick={() => {
            setShowModalDisOutage(false);
          }}
        >
          No
        </Button>
      </div>
    </div>
  );
}
