import React, { useEffect } from "react";
import { useState } from "react";
import { alterBackupPolicyforIncidentId } from "../services/incidentService";
import { errorNotification } from "../Notification";
import { message } from "antd";

// MUI
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const { Option } = Select;

export default function AlterBackupPolicyForm({
  onIncidentSuccess,
  selectedIncident,
  closeModal,
  company,
}) {
  const [allOutagesCheckBox] = useState(true);
  const [selectedBackupPolicy, setSelectedBackupPolicy] = useState("");

  useEffect(() => {
    setSelectedBackupPolicy(selectedIncident.backupEligible);
  }, [selectedIncident]);

  const onChange = (e) => {
    alert(
      "It is not applicable to change backup policy per outage, since NLU asks Spectra for all services Voice|Data|IPTV with one request"
    );
  };

  function onApplyActions() {
    alterBackupPolicyforIncidentId(
      selectedIncident.incidentId,
      selectedBackupPolicy === "Yes" ? "Yes" : "No",
      company
    )
      .then(() => {
        onIncidentSuccess(selectedIncident.incidentId, selectedBackupPolicy);
        message.success(
          "Successfully updated IncidentID: " + selectedIncident.incidentId,
          4
        );
      })
      .catch((error) => errorNotification("ERROR", error.error.message));
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
        Alter backup Policy for Outage ID:
        <b> {selectedIncident.outageId}</b>
      </label>
      <br />
      <FormControl sx={{ m: 1, minWidth: 220 }}>
        <Select
          // value={age}
          value={selectedBackupPolicy}
          onChange={(e) => setSelectedBackupPolicy(e.target.value)}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem value={"Yes"}>Yes</MenuItem>
          <MenuItem value={"No"}>No</MenuItem>
        </Select>
        <FormHelperText sx={{ textAlign: "center" }}>
          Backup Eligible
        </FormHelperText>
      </FormControl>

      <br />
      <div>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox onChange={onChange} checked={true} />}
            label="This action will be applied to all Outages of this Incident."
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
          onClick={() => onApplyActions()}
        >
          Apply
        </Button>
        <Button
          variant="contained"
          style={{}}
          type="primary"
          onClick={() => {
            closeModal();
          }}
        >
          No
        </Button>
      </div>
    </div>
  );
}
