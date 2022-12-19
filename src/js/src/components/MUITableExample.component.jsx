import { useState, useEffect, useContext } from "react";
import { ErrorBoundary } from "./Errors/ErrorBoundary";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DownloadIcon from "@mui/icons-material/Download";
import Button from "@mui/material/Button";
import { AllContext } from "../contexts/All.context";

import {
  getAllSpectraIncidents,
  getOpenSpectraIncidents,
  getOpenCDR_DBIncidents,
  getClosedCDR_DBIncidents,
} from "../services/incidentService";

import LoadingSpinnerCentered from "./LoadingSpinnerCentered";
import { ModalAlterPublish } from "./Modals/ModalAlterPublish";
import { ModalAlterMessage } from "./Modals/ModalAlterMessage";
import { ModalAlterBackup } from "./Modals/ModalAlterBackup";

// MUI Modals
import { MUI_ModalAlterPublish } from "./Modals/MUI_ModalAlterPublish";

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
];

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

export default function DenseTable() {
  // State downloaded from Context
  const { incidents, setIncidents } = useContext(AllContext);
  const { isFetching, setIsFetching } = useContext(AllContext);
  const { showModalAlterPublish, setshowModalAlterPublish } =
    useContext(AllContext);
  const { showModalAlterMessage, setShowModalAlterMessage } =
    useContext(AllContext);
  const { showModalAlterBackup, setShowModalAlterBackup } =
    useContext(AllContext);
  const { selectedIncident } = useContext(AllContext);

  useEffect(() => {
    const getIncidents = async () => {
      setIsFetching(true);
      const { data } = await getOpenSpectraIncidents();
      setIncidents(data);
      setIsFetching(false);
    };

    getIncidents();
  }, []);

  const modalAlterBackupProps = {
    visible: showModalAlterBackup,
    setShowModalAlterBackup,
    selectedIncident,
    incidents,
    setIncidents,
  };

  return (
    <LoadingSpinnerCentered isFetching={isFetching}>
      <MUI_ModalAlterPublish
        visible={showModalAlterPublish}
        setshowModalAlterPublish={setshowModalAlterPublish}
        selectedIncident={selectedIncident}
        incidents={incidents}
        setIncidents={setIncidents}
      />
      <ModalAlterMessage
        visible={showModalAlterMessage}
        setShowModalAlterMessage={setShowModalAlterMessage}
        selectedIncident={selectedIncident}
        incidents={incidents}
        setIncidents={setIncidents}
      />
      <ModalAlterBackup {...modalAlterBackupProps} />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          {generateTableHeadAndColumns(columnsNamesDesc)}

          {TableBodyForIncidents()}
        </Table>
      </TableContainer>
    </LoadingSpinnerCentered>
  );
}
