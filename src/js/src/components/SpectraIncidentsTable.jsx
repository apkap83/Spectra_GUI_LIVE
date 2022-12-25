import { useState, useEffect, useContext } from "react";
import { ErrorBoundary } from "./Errors/ErrorBoundary.component";

import { ReactComponent as NoDataLogo } from "../assets/noData.svg";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

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

import { errorNotification } from "../Notification";

// React Context
// import { AllContext } from "../contexts/All.context";

import {
  getAllSpectraIncidents,
  getOpenSpectraIncidents,
} from "../services/incidentService";

import LoadingSpinnerCentered from "./Spinner/LoadingSpinnerCentered.component";

import { paginate } from "../utils/paginate";

// MUI Modals
import { ModalAlterPublish } from "./Modals/ModalAlterPublish.component";
import { ModalAlterMessage } from "./Modals/ModalAlterMessage.component";
import { ModalAlterBackup } from "./Modals/ModalAlterBackup.component";

import { ActionsMenu } from "./MenuPopup/MenuPopup.component";
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

function renderHideScheduledCheckBox(setHideScheduled) {
  return (
    <FormGroup>
      <FormControlLabel
        control={<Checkbox onClick={() => setHideScheduled((prev) => !prev)} />}
        label="Hide Scheduled"
      />
    </FormGroup>
  );
}

export default function SpectraIncidentsTable(props) {
  const pageSize = 18;
  // State
  const [isFetching, setIsFetching] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [incidents, setIncidents] = useState([]);
  const [retrievedIncidents, setRetrievedIncidents] = useState();
  const [hideScheduled, setHideScheduled] = useState();
  const [showModalAlterPublish, setshowModalAlterPublish] = useState();
  const [showModalAlterMessage, setShowModalAlterMessage] = useState();
  const [showModalAlterBackup, setShowModalAlterBackup] = useState();
  const [selectedIncident, setSelectedIncident] = useState();

  const columnsForOpenSpectraIncidents = [
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
    renderHideScheduledCheckBox(setHideScheduled),
  ];

  const TableBodyForIncidents = (incidents) => {
    return (
      <TableBody>
        {incidents.map((incident) => (
          <TableRow
            key={incident.id}
            sx={{
              "&:last-child td, &:last-child th": { border: 0 },
              background: stringToColor(incident.incidentId) + "27", // Add Opacity in Color
            }}
          >
            <TableCell
              align="center"
              component="th"
              scope="row"
              sx={{
                fontWeight: 700,
                fontSize: "15px",
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
            <TableCell
              align="center"
              sx={{
                fontSize: "16px",
              }}
            >
              {getColorYesNo(incident.willBePublished)}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontSize: "16px",
              }}
            >
              {getColorMsg(incident.outageMsg)}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontSize: "16px",
              }}
            >
              {getColorYesNo(incident.backupEligible)}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                // background: stringToColor(incident.incidentId),
                fontWeight: 700,
                fontSize: "15px",
              }}
            >
              {incident.hierarchySelected}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontSize: "15px",
              }}
            >
              {incident.affectedServices}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontSize: "15px",
              }}
            >
              {incident.scheduled}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontSize: "15px",
              }}
            >
              {incident.startTime}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontSize: "15px",
              }}
            >
              {incident.endTime}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontSize: "15px",
              }}
            >
              {incident.duration}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontSize: "15px",
              }}
            >
              {incident.userId}
            </TableCell>
            <TableCell align="center">
              {incident.incidentStatus === "OPEN"
                ? ActionsMenu(incident, restProperties, false)
                : null}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  };

  // Retrieval of Incidents
  useEffect(() => {
    setIsFetching(true);
    const fetchData = async () => {
      try {
        // The same Component (AllSpectraIncidents) serves All & Open Incidents
        if (props.specificRequest === "getOpenSpectraIncidents") {
          const { data } = await getOpenSpectraIncidents();
          setIncidents(data);
          setRetrievedIncidents(data);
          setIsFetching(false);
        } else if (props.specificRequest === "getAllSpectraIncidents") {
          const { data } = await getAllSpectraIncidents();
          setIncidents(data);
          setRetrievedIncidents(data);
          setIsFetching(false);
        } else {
          throw new Error(
            "Not implemented specific request in SpectraIncidentsTable component"
          );
        }
      } catch (error) {
        errorNotification(error.code, error.message);
      }
    };

    fetchData();
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

  const restProperties = {
    setSelectedIncident,
    setshowModalAlterPublish,
    setShowModalAlterMessage,
    setShowModalAlterBackup,
  };

  const handlePageChange = (e, value) => {
    setPageNumber(value);
  };

  const getPagedData = () => {
    let filtered = incidents;
    return paginate(filtered, pageNumber, pageSize);
  };

  if (isFetching) {
    return <LoadingSpinnerCentered isFetching={true} />;
  }

  const emptyTableIndication = (incidentsList) => {
    if (incidentsList && incidentsList.length === 0) {
      return (
        <div
          style={{
            height: "86vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <NoDataLogo />
            <p style={{ marginTop: "20px" }}>No data</p>
          </div>
          {/* <h4 style={{ margin: "140px", textAlign: "center" }}>No data</h4> */}
          {/* {emptyTableIndication()} */}
        </div>
      );
    }
  };

  const pagesCount = Math.ceil(incidents.length / pageSize);
  let paginatedList = getPagedData();

  return (
    <>
      <ModalAlterPublish
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
      <ModalAlterBackup
        visible={showModalAlterBackup}
        setShowModalAlterBackup={setShowModalAlterBackup}
        selectedIncident={selectedIncident}
        incidents={incidents}
        setIncidents={setIncidents}
      />

      <div style={{ maxHeight: "86vh", overflowY: "auto" }}>
        <Table sx={{ minWidth: 650 }} size="large" aria-label="a dense table">
          {generateTableHeadAndColumns(columnsForOpenSpectraIncidents)}
          {TableBodyForIncidents(paginatedList)}
        </Table>

        {emptyTableIndication(paginatedList)}
      </div>
      <Pagination
        sx={{ width: "350px", marginLeft: "auto", marginTop: "10px" }}
        count={pagesCount}
        variant="outlined"
        shape="rounded"
        onChange={handlePageChange}
      />
      <p style={{}}>
        <b>Total Records: {incidents.length}</b>
      </p>
    </>
  );
}
