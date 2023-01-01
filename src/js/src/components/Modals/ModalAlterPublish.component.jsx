import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

import BroadcastingOutageForm from "../../forms/BroadcastingOutageForm";
import { capitalizeFirstLetter } from "../../utils/myutils";

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

export const ModalAlterPublish = ({
  visible = false,
  setshowModalAlterPublish,
  selectedIncident,
  incidents,
  setIncidents,
}) => {
  function enableOrDisableText(incidentID) {
    return selectedIncident?.willBePublished === "Yes" ? "disable" : "enable";
  }
  return (
    <Modal
      open={visible}
      onClose={() => setshowModalAlterPublish(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {`${capitalizeFirstLetter(
            enableOrDisableText(selectedIncident)
          )} Outage Broadcasting`}
        </Typography>
        <br />
        <BroadcastingOutageForm
          onOutageSuccess={(outageId, label) => {
            const incCopy = [...incidents];
            let objIndex = incCopy.findIndex(
              (obj) => obj.outageId === outageId
            );
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
          selectedIncident={selectedIncident}
          setShowModalDisOutage={(item) => setshowModalAlterPublish(item)}
        />
      </Box>
    </Modal>
  );
};
