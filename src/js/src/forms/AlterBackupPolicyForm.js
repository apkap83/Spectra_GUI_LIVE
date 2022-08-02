import React, { useEffect } from "react";
import { useState } from "react";
import { alterBackupPolicyforIncidentId } from "../services/incidentService";
import { errorNotification } from "../Notification";
import { Button, message, Checkbox, Select } from "antd";

const { Option } = Select;

export default function AlterBackupPolicyForm({
  onIncidentSuccess,
  selectedIncident,
  closeModal,
}) {
  const [allOutagesCheckBox] = useState(true);
  const [selectedBackupPolicy, setSelectedBackupPolicy] = useState("");

  useEffect(() => {
    setSelectedBackupPolicy(selectedIncident.backupEligible);
  }, []);

  const onChange = (e) => {
    alert(
      "It is not applicable to change backup policy per outage, since NLU asks Spectra for all services Voice|Data|IPTV with one request"
    );
  };

  function onApplyActions() {
    alterBackupPolicyforIncidentId(
      selectedIncident.incidentId,
      selectedBackupPolicy === "Yes" ? "Yes" : "No"
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
      <Select
        style={{ width: 220 }}
        onChange={(msg) => setSelectedBackupPolicy(msg)}
        value={selectedBackupPolicy}
      >
        <Option key="1" value="Yes">
          Yes
        </Option>
        <Option key="2" value="No">
          No
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
          No
        </Button>
      </div>
    </div>
  );
}
