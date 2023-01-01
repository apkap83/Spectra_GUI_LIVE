import React, { useEffect } from "react";
import { useState } from "react";
import { message } from "antd";

// MUI
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

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

  const { incidentId: incidentID, outageId: outageID } = selectedIncident;
  const onChange = (e) => {
    setAllOutagesCheckBox(e.target.checked);
  };

  function enableOrDisableText(incident) {
    return incident.willBePublished === "Yes" ? (
      <span style={{ color: "red" }}>disable</span>
    ) : (
      <span style={{ color: "green" }}>enable</span>
    );
  }

  function onYesActions() {
    const { incidentId } = selectedIncident;
    // From Yes to No
    if (selectedIncident.willBePublished === "Yes") {
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

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const MuiAlertStack = () => {
    return (
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Button variant="outlined" onClick={handleClick}>
          Open success snackbar
        </Button>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            This is a success message!
          </Alert>
        </Snackbar>
        <Alert severity="error">This is an error message!</Alert>
        <Alert severity="warning">This is a warning message!</Alert>
        <Alert severity="info">This is an information message!</Alert>
        <Alert severity="success">This is a success message!</Alert>
      </Stack>
    );
  };

  return (
    <React.Fragment>
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
          <strong>{enableOrDisableText(selectedIncident)}</strong> publishing
          for Spectra Outage with ID:
          <b> {outageID} ?</b>
        </label>
        <br />
        <div>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox onChange={onChange} defaultChecked />}
              label="Apply this action for all Outages of this Incident."
            />
          </FormGroup>
        </div>
        <br />
        <div>
          <Button
            variant="contained"
            style={{
              marginRight: "50px",
            }}
            type="primary"
            onClick={onYesActions}
          >
            Yes
          </Button>
          <Button
            variant="contained"
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
    </React.Fragment>
  );
}
