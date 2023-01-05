import BroadcastingOutageForm from "../../forms/BroadcastingOutageForm";
import AlterBackupPolicyForm from "../../forms/AlterBackupPolicyForm";
import { capitalizeFirstLetter } from "../../utils/myutils";

// MUI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

export const ModalAlterBackup = ({
  visible = false,
  setShowModalAlterBackup,
  selectedIncident,
  incidents,
  setIncidents,
  company,
}) => {
  function enableOrDisableText(incidentID) {
    return selectedIncident.willBePublished === "Yes" ? "disable" : "enable";
  }

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
      onClose={() => setShowModalAlterBackup(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      width={630}
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Alter NLU Message
        </Typography>
        <br />
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
          company={company}
        />
      </Box>
    </Modal>
  );
};
