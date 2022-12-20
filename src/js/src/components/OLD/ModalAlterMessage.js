import { Modal } from "antd";
import ChangeOutageMessageForm from "../../forms/ChangeOutageMessageForm";

export const ModalAlterMessage = ({
  visible,
  setShowModalAlterMessage,
  selectedIncident,
  incidents,
  setIncidents,
}) => {
  return (
    <Modal
      title="Alter NLU Message"
      visible={visible}
      onCancel={() => setShowModalAlterMessage(false)}
      width={700}
      footer={null}
    >
      <ChangeOutageMessageForm
        onIncidentSuccess={(incidentId, selectedMsg) => {
          const foundOutages = incidents.filter(
            (inc) => inc.incidentId === incidentId
          );
          foundOutages.forEach((outage) => (outage.outageMsg = selectedMsg));
          setIncidents([...incidents]);

          setShowModalAlterMessage(false);
        }}
        closeModal={() => setShowModalAlterMessage(false)}
        selectedIncident={selectedIncident}
      />
    </Modal>
  );
};
