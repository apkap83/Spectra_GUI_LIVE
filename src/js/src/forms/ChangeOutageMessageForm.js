import React from "react";
import { useState, useEffect } from "react";
import { changeMsgForIncidentId } from "../services/incidentService";
import { errorNotification } from "../Notification";
import { message } from "antd";

// MUI
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const { Option } = Select;

export default function ChangeOutageMessageForm({
  onIncidentSuccess,
  selectedIncident,
  closeModal,
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

  const handleChange = (msg) => {
    setselectedMsg(msg);
  };

  function onApplyActions() {
    if (allOutagesCheckBox) {
      changeMsgForIncidentId(
        selectedIncident.incidentId,
        selectedMsg === "Default" ? "null" : selectedMsg
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
      {/* <Box sx={{ minWidth: 220 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Message</InputLabel>
          <Select labelId="label" value={selectedMsg} onChange={handleChange}>
            <MenuItem value={"Default"}>Default</MenuItem>
            <MenuItem value={"msg1"}>msg1</MenuItem>
            <MenuItem value={"msg2"}>msg2</MenuItem>
            <MenuItem value={"msg3"}>msg3</MenuItem>
          </Select>
        </FormControl>
      </Box> */}

      <Select
        // defaultValue="Default MSG"
        style={{ width: 220 }}
        onChange={(msg) => handleChange(msg)}
        value={selectedMsg}
      >
        <Option key="default" value="Default">
          Default MSG
        </Option>
        <Option key="MSG_1" value="msg1">
          msg1
        </Option>
        <Option key="MSG_2" value="msg2">
          msg2
        </Option>
        <Option key="MSG_3 " value="msg3">
          msg3
        </Option>
      </Select>

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
          Cancel
        </Button>
      </div>
    </div>
  );
}
