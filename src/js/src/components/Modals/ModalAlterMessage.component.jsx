import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import ChangeOutageMessageForm from "../../forms/ChangeOutageMessageForm";

export const ModalAlterMessage = ({
  visible = false,
  setShowModalAlterMessage,
  selectedIncident,
  incidents,
  setIncidents,
}) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 630,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      open={visible}
      onClose={() => setShowModalAlterMessage(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Alter NLU Message
        </Typography>
        <br />
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
      </Box>

      {/* <ChangeOutageMessageForm
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
      /> */}
    </Modal>
  );
};
