import React from "react";
import { useState, useEffect } from "react";
import { changeMsgForIncidentId } from "../services/incidentService";
import { errorNotification } from "../Notification";
import { Button, message, Checkbox, Select } from "antd";

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
        <Checkbox
          onChange={onChange}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            verticalAlign: "middle",
          }}
          defaultChecked={allOutagesCheckBox}
          checked={true}
        >
          <span style={{ fontSize: "14px" }}>
            Apply this action for all Outages of this Incident. (
            <b>{selectedIncident.incidentId}</b>)
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
          onClick={() => onApplyActions()}
        >
          Apply
        </Button>
        <Button
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
