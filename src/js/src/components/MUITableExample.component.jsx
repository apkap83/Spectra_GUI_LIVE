import { useState, useEffect, useContext } from "react";
import { ErrorBoundary } from "./Errors/ErrorBoundary";

// MUI Lib Imports
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DownloadIcon from "@mui/icons-material/Download";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

// React Context
import { AllContext } from "../contexts/All.context";

import {
  getAllSpectraIncidents,
  getOpenSpectraIncidents,
  getOpenCDR_DBIncidents,
  getClosedCDR_DBIncidents,
} from "../services/incidentService";

import LoadingSpinnerCentered from "./LoadingSpinnerCentered";

// MUI Modals
import { MUI_ModalAlterPublish } from "./Modals/MUI_ModalAlterPublish";
import { MUI_ModalAlterMessage } from "./Modals/MUI_ModalAlterMessage";
import { MUI_ModalAlterBackup } from "./Modals/MUI_ModalAlterBackup";

import ActionsMenu from "./MenuPopup/MenuPopup.component";
import stringToColor from "../utils/stringToColor";
import downloadAffectedUsers from "../utils/downloadAffectedUsers";
import { getColorYesNo, getColorMsg } from "../utils/myutils";

const generateTableHeadAndColumns = (columnsArray) => {
  return (
    <TableHead>
      <TableRow>
        {columnsArray.map((item, id) => (
          <TableCell key={id} align="center">
            {item}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

const TableBodyForIncidents = () => {
  const { incidents, ...restContextProperties } = useContext(AllContext);
  return (
    <TableBody>
      {incidents.map((incident) => (
        <TableRow
          key={incident.id}
          sx={{
            "&:last-child td, &:last-child th": { border: 0 },
            background: stringToColor(incident.incidentId) + "45", // Add Opacity in Color
          }}
        >
          <TableCell
            align="center"
            component="th"
            scope="row"
            sx={{
              fontWeight: 700,
            }}
          >
            {incident.incidentId}
          </TableCell>
          <TableCell align="center">
            <Button variant="contained" onClick={downloadAffectedUsers}>
              <DownloadIcon fontSize="small" />
              &nbsp;{incident.outageId}
            </Button>
          </TableCell>
          <TableCell align="center">
            {getColorYesNo(incident.willBePublished)}
          </TableCell>
          <TableCell align="center">
            {getColorMsg(incident.outageMsg)}
          </TableCell>
          <TableCell align="center">
            {getColorYesNo(incident.backupEligible)}
          </TableCell>
          <TableCell
            align="center"
            sx={{
              // background: stringToColor(incident.incidentId),
              fontWeight: 700,
            }}
          >
            {incident.hierarchySelected}
          </TableCell>
          <TableCell align="center">{incident.affectedServices}</TableCell>
          <TableCell align="center">{incident.scheduled}</TableCell>
          <TableCell align="center">{incident.startTime}</TableCell>
          <TableCell align="center">{incident.endTime}</TableCell>
          <TableCell align="center">{incident.duration}</TableCell>
          <TableCell align="center">{incident.userId}</TableCell>
          <TableCell align="center">
            {ActionsMenu(incident, restContextProperties)}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

function renderHideScheduledCheckBox(hideScheduled, setHideScheduled) {
  return (
    <FormGroup>
      <FormControlLabel
        control={<Checkbox onClick={() => setHideScheduled(!hideScheduled)} />}
        label="Hide Scheduled"
      />
    </FormGroup>
  );
}

export default function DenseTable() {
  // State downloaded from Context
  const { incidents, setIncidents } = useContext(AllContext);
  const { retrievedIncidents, setRetrievedIncidents } = useContext(AllContext);
  const { isFetching, setIsFetching } = useContext(AllContext);
  const { hideScheduled, setHideScheduled } = useContext(AllContext);
  const { showModalAlterPublish, setshowModalAlterPublish } =
    useContext(AllContext);
  const { showModalAlterMessage, setShowModalAlterMessage } =
    useContext(AllContext);
  const { showModalAlterBackup, setShowModalAlterBackup } =
    useContext(AllContext);
  const { selectedIncident } = useContext(AllContext);

  const columnsNamesDesc = [
    "Incident ID",
    "Outage ID",
    "Outage is Published",
    "Outage Msg",
    "Backup Eligible",
    "Hierarchy Selected",
    "Affected Services",
    "Scheduled",
    "Start Time",
    "End Time",
    "Duration",
    "User ID",
    renderHideScheduledCheckBox(hideScheduled, setHideScheduled),
  ];

  // Retrieval of Incidents
  useEffect(() => {
    const getIncidents = async () => {
      setIsFetching(true);
      const { data } = await getOpenSpectraIncidents();
      setIncidents(data);
      setRetrievedIncidents(data);
      setIsFetching(false);
    };

    getIncidents();
  }, []);

  // Filtering of Scheduled Incidents
  useEffect(() => {
    if (hideScheduled) {
      const scheduledInc = incidents.filter((inc) => inc.scheduled === "No");
      setIncidents(scheduledInc);
    } else {
      setIncidents(retrievedIncidents);
    }
  }, [hideScheduled]);

  const modalAlterBackupProps = {};

  return (
    <LoadingSpinnerCentered isFetching={isFetching}>
      <MUI_ModalAlterPublish
        visible={showModalAlterPublish}
        setshowModalAlterPublish={setshowModalAlterPublish}
        selectedIncident={selectedIncident}
        incidents={incidents}
        setIncidents={setIncidents}
      />
      <MUI_ModalAlterMessage
        visible={showModalAlterMessage}
        setShowModalAlterMessage={setShowModalAlterMessage}
        selectedIncident={selectedIncident}
        incidents={incidents}
        setIncidents={setIncidents}
      />
      <MUI_ModalAlterBackup
        visible={showModalAlterBackup}
        setShowModalAlterBackup={setShowModalAlterBackup}
        selectedIncident={selectedIncident}
        incidents={incidents}
        setIncidents={setIncidents}
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          {generateTableHeadAndColumns(columnsNamesDesc)}

          {TableBodyForIncidents()}
        </Table>
      </TableContainer>
    </LoadingSpinnerCentered>
  );
}
