import { Modal } from "antd";
import BroadcastingOutageForm from "../../forms/BroadcastingOutageForm";
import AlterBackupPolicyForm from "../../forms/AlterBackupPolicyForm";
import { capitalizeFirstLetter } from "../../utils/myutils";
export const ModalAlterBackup = ({
  visible,
  setShowModalAlterBackup,
  selectedIncident,
  incidents,
  setIncidents,
}) => {
  function enableOrDisableText(incidentID) {
    return selectedIncident.willBePublished === "Yes" ? "disable" : "enable";
  }
  return (
    <Modal
      title={"Alter Backup Eligibility"}
      visible={visible}
      footer={null}
      onCancel={() => setShowModalAlterBackup(false)}
      width={630}
    >
      <AlterBackupPolicyForm
        onIncidentSuccess={(incidentId, label) => {
          const copyOfIncidents = [...incidents];
          const foundOutages = copyOfIncidents.filter(
            (inc) => inc.incidentId === incidentId
          );
          foundOutages.forEach((outage) => (outage.backupEligible = label));
          setIncidents(copyOfIncidents);
          setShowModalAlterBackup(false);
        }}
        selectedIncident={selectedIncident}
        closeModal={() => setShowModalAlterBackup(false)}
      />
    </Modal>
  );
};
