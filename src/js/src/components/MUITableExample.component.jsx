import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DownloadIcon from "@mui/icons-material/Download";
import Button from "@mui/material/Button";

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

import ActionsMenu from "./MenuPopup/MenuPopup.component";
import stringToColor from "../utills/stringToColor";
import downloadAffectedUsers from "../utills/downloadAffectedUsers";
import { getColorYesNo, getColorMsg } from "../utills/myutils";

const generateTableHeadAndColumns = (columnsArray) => {
  return (
    <TableHead>
      <TableRow>
        {columnsArray.map((item) => (
          <TableCell align="center">{item}</TableCell>
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

const TableBodyForIncidents = (incidents) => {
  return (
    <TableBody>
      {incidents.map((incident) => (
        <TableRow
          key={incident.id}
          sx={{
            "&:last-child td, &:last-child th": { border: 0 },
          }}
        >
          <TableCell
            align="center"
            component="th"
            scope="row"
            sx={{
              background: stringToColor(incident.incidentId),
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
          <TableCell align="center">{ActionsMenu(incident)}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default function DenseTable() {
  const [isFetching, setIsFetching] = useState("");
  const [incidents, setIncidents] = useState([]);
  const [showModalAlterPublish, setshowModalAlterPublish] = useState(false);
  const [showModalAlterMessage, setShowModalAlterMessage] = useState(false);
  const [showModalAlterBackup, setShowModalAlterBackup] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState("");
  const [filteredIncidents, setFilteredIncidents] = useState(incidents);

  useEffect(() => {
    const getIncidents = async () => {
      const { data } = await getOpenSpectraIncidents();
      // setColumns(columnsForSpectraIncidents);
      setIncidents(data);
      // setIsFetching(false);
    };

    getIncidents();
  }, []);

  const modalAlterPublishProps = {
    visible: showModalAlterPublish,
    setshowModalAlterPublish,
    selectedIncident,
    incidents: filteredIncidents,
    setIncidents,
  };
  const modalAlterMessageProps = {
    visible: showModalAlterMessage,
    setShowModalAlterMessage,
    selectedIncident,
    incidents: filteredIncidents,
    setIncidents,
  };
  const modalAlterBackupProps = {
    visible: showModalAlterBackup,
    setShowModalAlterBackup,
    selectedIncident,
    incidents: filteredIncidents,
    setIncidents,
  };

  return (
    <LoadingSpinnerCentered isFetching={isFetching}>
      <ModalAlterPublish {...modalAlterPublishProps} />
      <ModalAlterMessage {...modalAlterMessageProps} />
      <ModalAlterBackup {...modalAlterBackupProps} />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          {generateTableHeadAndColumns(columnsNamesDesc)}

          {TableBodyForIncidents(incidents)}
        </Table>
      </TableContainer>
    </LoadingSpinnerCentered>
  );
}
