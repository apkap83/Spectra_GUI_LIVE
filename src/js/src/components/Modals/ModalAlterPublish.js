import { Modal } from "antd";
import BroadcastingOutageForm from "../../forms/BroadcastingOutageForm";
import { capitalizeFirstLetter } from "../../utils/myutils";

export const ModalAlterPublish = ({
  visible,
  setshowModalAlterPublish,
  selectedIncident,
  incidents,
  setIncidents,
}) => {
  function enableOrDisableText(incidentID) {
    return selectedIncident.willBePublished === "Yes" ? "disable" : "enable";
  }
  return (
    <Modal
      title={`${capitalizeFirstLetter(
        enableOrDisableText(selectedIncident)
      )} Outage Broadcasting`}
      visible={visible}
      footer={null}
      // onOK={() => (props.visible = false)}
      onCancel={() => setshowModalAlterPublish(false)}
      width={630}
    >
      <BroadcastingOutageForm
        onOutageSuccess={(outageId, label) => {
          const incCopy = [...incidents];
          let objIndex = incCopy.findIndex((obj) => obj.outageId === outageId);
          incCopy[objIndex].willBePublished = label;

          setIncidents(incCopy);
          setshowModalAlterPublish(false);
        }}
        onIncidentSuccess={(incidentId, label) => {
          const foundOutages = incidents.filter(
            (inc) => inc.incidentId === incidentId
          );
          foundOutages.forEach((outage) => (outage.willBePublished = label));
          setIncidents(incidents);
          setshowModalAlterPublish(false);
        }}
        // onIncidentSuccess={(incidentId) => {
        // alterWillBePublishedOfIncident(incidentId);
        // closeDisableOutageForm();
        // }}

        selectedIncident={selectedIncident}
        setShowModalDisOutage={(item) => setshowModalAlterPublish(item)}
      />
    </Modal>
  );
};
