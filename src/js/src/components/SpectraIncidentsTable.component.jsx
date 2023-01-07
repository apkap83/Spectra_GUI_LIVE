import { useState, useEffect, useContext } from "react";
import { ErrorBoundary } from "./Errors/ErrorBoundary.component";

import { ReactComponent as NoDataLogo } from "../assets/noData.svg";
import { ReactComponent as NovaLogo } from "../assets/novaLogo.svg";
import { ReactComponent as WindLogo } from "../assets/windLogo.svg";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

// MUI Lib Imports
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import Box from "@mui/material/Box";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import BorderOuterIcon from "@mui/icons-material/BorderOuter";

import { MenuPopupDownloads } from "./MenuPopup/MenuPopupDownloads.component";

import { errorNotification } from "../Notification";

// React Context
// import { AllContext } from "../contexts/All.context";

import {
  getAllSpectraIncidents,
  getOpenSpectraIncidents,
  getAllNovaSpectraIncidents,
  getNovaOpenSpectraIncidents,
} from "../services/incidentService";

import LoadingSpinnerCentered from "./Spinner/LoadingSpinnerCentered.component";

import { paginate } from "../utils/paginate";

// MUI Modals
import { ModalAlterPublish } from "./Modals/ModalAlterPublish.component";
import { ModalAlterMessage } from "./Modals/ModalAlterMessage.component";
import { ModalAlterBackup } from "./Modals/ModalAlterBackup.component";

import { ActionsMenu } from "./MenuPopup/MenuPopupActions.component";
import stringToColor from "../utils/stringToColor";
import { downloadAffectedUsersForIncident } from "../utils/downloadAffectedUsersForIncident";
import { downloadAffectedUsersForOutage } from "../utils/downloadAffectedUsersForOutage";
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
  const pageSize = 20;
  // State
  const [title, setTitle] = useState();
  const [company, setCompany] = useState();
  const [isFetching, setIsFetching] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [incidents, setIncidents] = useState([]);
  const [retrievedIncidents, setRetrievedIncidents] = useState();
  const [hideScheduled, setHideScheduled] = useState();
  const [showModalAlterPublish, setshowModalAlterPublish] = useState();
  const [showModalAlterMessage, setShowModalAlterMessage] = useState();
  const [showModalAlterBackup, setShowModalAlterBackup] = useState();
  const [selectedIncident, setSelectedIncident] = useState();

  const renderLogoAndTitle = (company) => {
    if (company === "WIND") {
      return (
        <div className="p-1 d-flex flex-column justify-content-start align-items-start">
          <div
            className="d-flex flex-column justify-content-center align-items-center"
            style={{ height: "65px" }}
          >
            <WindLogo style={{ width: "100px", marginBottom: "8px" }} />
            <span className="font-weight-bold">{title}</span>
          </div>
        </div>
      );
    }

    if (company === "NOVA") {
      return (
        <div className="p-1 d-flex flex-column justify-content-start align-items-start">
          <div
            className="d-flex flex-column justify-content-center align-items-center"
            style={{ height: "65px" }}
          >
            <NovaLogo style={{ width: "100px", marginBottom: "8px" }} />
            <span className="font-weight-bold">{title}</span>
          </div>
        </div>
      );
    }
  };

  const columnsForOpenSpectraIncidents = [
    renderLogoAndTitle(company),
    "Outage ID",
    "Status",
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
              background: stringToColor(incident.incidentId) + "22", // Add Opacity in Color
            }}
          >
            <TableCell
              align="center"
              component="th"
              scope="row"
              sx={{
                fontWeight: 700,
                fontSize: "12px",
              }}
            >
              {incident.incidentId}
            </TableCell>
            <TableCell align="center">
              <MenuPopupDownloads incident={incident} company={company} />
            </TableCell>
            <TableCell align="center">{incident.incidentStatus}</TableCell>
            <TableCell
              align="center"
              sx={{
                fontSize: "14px",
              }}
            >
              {getColorYesNo(incident.willBePublished)}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontSize: "14px",
              }}
            >
              {getColorMsg(incident.outageMsg)}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontSize: "14px",
              }}
            >
              {getColorYesNo(incident.backupEligible)}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                // background: stringToColor(incident.incidentId),
                fontWeight: 700,
                fontSize: "12px",
              }}
            >
              {incident.hierarchySelected}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontSize: "12px",
              }}
            >
              {incident.affectedServices}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontSize: "12px",
              }}
            >
              {incident.scheduled}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontSize: "12px",
              }}
            >
              {incident.startTime}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontSize: "12px",
              }}
            >
              {incident.endTime}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontSize: "12px",
              }}
            >
              {incident.duration}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontSize: "12px",
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
        if (props.specificRequest === "getOpenSpectraIncidents_forWind") {
          const { data } = await getOpenSpectraIncidents();
          setIncidents(data);
          setRetrievedIncidents(data);
          setIsFetching(false);
          setCompany("WIND");
          setTitle("Open Spectra Incidents");
        } else if (props.specificRequest === "getAllSpectraIncidents_forWind") {
          const { data } = await getAllSpectraIncidents();
          setIncidents(data);
          setRetrievedIncidents(data);
          setIsFetching(false);
          setCompany("WIND");
          setTitle("All Spectra Incidents");
        } else if (
          props.specificRequest === "getOpenSpectraIncidents_forNova"
        ) {
          const { data } = await getNovaOpenSpectraIncidents();
          setIncidents(data);
          setRetrievedIncidents(data);
          setIsFetching(false);
          setCompany("NOVA");
          setTitle("Open Spectra Incidents");
        } else if (props.specificRequest === "getAllSpectraIncidents_forNova") {
          const { data } = await getAllNovaSpectraIncidents();
          setIncidents(data);
          setRetrievedIncidents(data);
          setIsFetching(false);
          setCompany("NOVA");
          setTitle("All Spectra Incidents");
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
        company={company}
        visible={showModalAlterPublish}
        setshowModalAlterPublish={setshowModalAlterPublish}
        selectedIncident={selectedIncident}
        incidents={incidents}
        setIncidents={setIncidents}
      />
      <ModalAlterMessage
        company={company}
        visible={showModalAlterMessage}
        setShowModalAlterMessage={setShowModalAlterMessage}
        selectedIncident={selectedIncident}
        incidents={incidents}
        setIncidents={setIncidents}
      />
      <ModalAlterBackup
        company={company}
        visible={showModalAlterBackup}
        setShowModalAlterBackup={setShowModalAlterBackup}
        selectedIncident={selectedIncident}
        incidents={incidents}
        setIncidents={setIncidents}
      />

      <div>
        <Table sx={{ minWidth: 650 }} size="medium" aria-label="a dense table">
          {generateTableHeadAndColumns(columnsForOpenSpectraIncidents)}
          {TableBodyForIncidents(paginatedList)}
        </Table>

        {emptyTableIndication(paginatedList)}
        <Box
          float="right"
          display="flex"
          width="auto"
          height="80px"
          marginLeft="1rem"
          marginTop="20px"
          marginBottom="50px"
          // bgcolor="lightgreen"
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <p>
            <b>Total Records: {incidents.length}</b>
          </p>

          <Pagination
            count={pagesCount}
            variant="outlined"
            shape="rounded"
            onChange={handlePageChange}
          />
        </Box>
      </div>
    </>
  );
}
