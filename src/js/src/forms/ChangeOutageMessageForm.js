import React from "react";
import { useState, useEffect } from "react";
import { changeMsgForIncidentId } from "../services/incidentService";
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

// const { Option } = Select;

export default function ChangeOutageMessageForm({
  onIncidentSuccess,
  selectedIncident,
  closeModal,
  company,
}) {
  const [allOutagesCheckBox] = useState(true);
  const [selectedMsg, setselectedMsg] = useState("");
  const onChange = (e) => {
    alert(
      "It is not applicable to change the specific message per outage, since NLU asks Spectra for all services Voice|Data|IPTV with one request"
    );
  };

  useEffect(() => {
    setselectedMsg(selectedIncident.outageMsg);
  }, []);

  const handleChange = (e) => {
    // console.log(41, msg);
    setselectedMsg(e.target.value);
  };

  function onApplyActions() {
    if (allOutagesCheckBox) {
      changeMsgForIncidentId(
        selectedIncident.incidentId,
        selectedMsg === "Default" ? "null" : selectedMsg,
        company
      )
        .then(() => {
          onIncidentSuccess(selectedIncident.incidentId, selectedMsg);
          message.success(
            "Successfully updated IncidentID: " + selectedIncident.incidentId,
            4
          );
        })
        .catch((error) => errorNotification("ERROR", error.message));
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
        // width: "200px",
      }}
    >
      <label style={{ textAlign: "center" }}>
        Change Outage message for Outage with ID:
        <b> {selectedIncident.outageId}</b>
      </label>
      <br />
      <FormControl sx={{ m: 1, minWidth: 220 }}>
        <Select
          // value={age}
          value={selectedMsg}
          onChange={handleChange}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem value={"Default"}>Default</MenuItem>
          <MenuItem value={"msg1"}>msg1</MenuItem>
          <MenuItem value={"msg2"}>msg2</MenuItem>
          <MenuItem value={"msg3"}>msg3</MenuItem>
        </Select>
        <FormHelperText sx={{ textAlign: "center" }}>Message</FormHelperText>
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
          type="primary"
          onClick={() => {
            closeModal();
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
