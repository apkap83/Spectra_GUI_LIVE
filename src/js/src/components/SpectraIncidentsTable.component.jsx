import { useState, useEffect, useContext } from "react";
import { ErrorBoundary } from "./Errors/ErrorBoundary.component";

// MUI Lib Imports
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import QueryStatsIcon from "@mui/icons-material/QueryStats";
import { MenuPopupDownloads } from "./MenuPopup/MenuPopupDownloads.component";
import UserContext from "../contexts/UserContext";
import { errorNotification } from "./common/Notification";

import {
  getAllSpectraIncidents,
  getOpenSpectraIncidents,
  getAllNovaSpectraIncidents,
  getNovaOpenSpectraIncidents,
  getStatsForRespectiveCompanyAndIncident,
} from "../services/incidentService";

import LoadingSpinnerCentered from "./Spinner/LoadingSpinnerCentered.component";

import { paginate } from "../utils/paginate";

// MUI Modals
import { ModalAlterPublish } from "./Modals/ModalAlterPublish.component";
import { ModalAlterMessage } from "./Modals/ModalAlterMessage.component";
import { ModalAlterBackup } from "./Modals/ModalAlterBackup.component";

import { ActionsMenu } from "./MenuPopup/MenuPopupActions.component";
import stringToColor from "../utils/stringToColor";
import { getColorYesNo, getColorMsg } from "../utils/myutils";

import { MyPopOver } from "./MenuPopup/PopOver";
import Typography from "@mui/material/Typography";
import { PaginationAndTotalRecords } from "./common/PaginationAndTotalRecords.component";
import { EmptyTableIndication } from "./common/EmptyTableIndication.component";
import { HideScheduledCheckBox } from "./common/HideScheduledCheckBox.component";
import { LogoAndTitle } from "./common/LogoAndTitle.component";
import { IncidentSelector } from "./common/IncidentSelector.component";

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
  const [filteredIncidentID, setFilteredIncidentID] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [popOverData, setPopOverData] = useState("");
  const open = Boolean(anchorEl);

  const userDetails = useContext(UserContext);

  const columnsForOpenSpectraIncidents = [
    <IncidentSelector
      setFilteredIncidentID={setFilteredIncidentID}
      filteredIncidentID={filteredIncidentID}
    />,
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
    "INC Affected Voice",
    "INC Affected Data",
    "INC Affected IPTV",
    "User ID",
    "",
    "",
    <HideScheduledCheckBox setHideScheduled={setHideScheduled} />,
  ];

  const TableBodyForIncidents = (incidents) => {
    return (
      <TableBody>
        {incidents.map((incident) => (
          <TableRow
            key={incident.id}
            sx={{
              "&:last-child td, &:last-child th": { border: 0 },
              background: stringToColor(incident.incidentId) + "12", // Add Opacity in Color
            }}
          >
            <TableCell align="left" component="th" scope="row">
              {incident.incidentId}
            </TableCell>
            <TableCell align="center">{incident.outageId}</TableCell>
            <TableCell align="center">
              <span style={{ fontWeight: 600 }}>{incident.incidentStatus}</span>
            </TableCell>
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
            <TableCell align="center">
              {incident.hierarchySelected} &nbsp;
            </TableCell>
            <TableCell align="center">{incident.affectedServices}</TableCell>
            <TableCell
              align="center"
              sx={{
                fontSize: "12px",
              }}
            >
              <span style={{ fontWeight: 600 }}>{incident.scheduled}</span>
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
              {incident.incidentAffectedVoice}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontSize: "12px",
              }}
            >
              {incident.incidentAffectedData}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontSize: "12px",
              }}
            >
              {incident.incidentAffectedIPTV}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontSize: "12px",
              }}
            >
              {incident.userId}
            </TableCell>
            <TableCell>
              <button
                className="statsButton"
                onMouseEnter={(e) => handlePopoverOpen(e, incident.incidentId)}
                onMouseLeave={handlePopoverClose}
              >
                <QueryStatsIcon className="statsIcon" />
              </button>
            </TableCell>
            <TableCell></TableCell>
            <TableCell align="center" style={{}}>
              {ActionsMenu(
                incident,
                restActionMenuProperties,
                userDetails,
                company
              )}
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
          setTitle("Open Incidents");
        } else if (props.specificRequest === "getAllSpectraIncidents_forWind") {
          const { data } = await getAllSpectraIncidents();
          setIncidents(data);
          setRetrievedIncidents(data);
          setIsFetching(false);
          setCompany("WIND");
          setTitle("All Incidents");
        } else if (
          props.specificRequest === "getOpenSpectraIncidents_forNova"
        ) {
          const { data } = await getNovaOpenSpectraIncidents();
          setIncidents(data);
          setRetrievedIncidents(data);
          setIsFetching(false);
          setCompany("NOVA");
          setTitle("Open Incidents");
        } else if (props.specificRequest === "getAllSpectraIncidents_forNova") {
          const { data } = await getAllNovaSpectraIncidents();
          setIncidents(data);
          setRetrievedIncidents(data);
          setIsFetching(false);
          setCompany("NOVA");
          setTitle("All Incidents");
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
    setPageNumber(1);

    let filteredAll = retrievedIncidents;

    if (filteredIncidentID && filteredIncidentID.length > 0) {
      filteredAll = filteredAll.filter((inc) =>
        inc.incidentId
          .toLowerCase()
          .includes(filteredIncidentID.toLocaleLowerCase())
      );
      setIncidents(filteredAll);
    } else {
      setIncidents(retrievedIncidents);
    }

    if (hideScheduled) {
      filteredAll = filteredAll.filter((inc) => inc.scheduled === "No");
      setIncidents(filteredAll);
    } else {
      setIncidents(filteredAll);
    }
  }, [hideScheduled, filteredIncidentID]);

  const restActionMenuProperties = {
    setSelectedIncident,
    setshowModalAlterPublish,
    setShowModalAlterMessage,
    setShowModalAlterBackup,
  };

  const handlePageChange = (e, value) => {
    setPageNumber(value);
  };

  const showStats = (data) => {
    return data.map((item) => {
      return (
        <ul key={item.requestor} className="mylist">
          <li>
            {item.requestor}: {item.positiveResponses}
          </li>
        </ul>
      );
    });
  };

  const handlePopoverOpen = async (event, incidentId) => {
    setAnchorEl(event.currentTarget);
    let responseFormatted = "";

    setPopOverData(<Typography sx={{ p: 1 }}>Loading...</Typography>);
    setTimeout(async () => {
      const data = await getStatsForRespectiveCompanyAndIncident(
        company,
        incidentId
      );
      responseFormatted = () => {
        return (
          <>
            <div className="popupForStatistics">
              <div className="popupForStatistics__header">
                Real Time Statistics for Incident {incidentId}
              </div>
              <Typography sx={{ p: 1, fontSize: "inherit !important" }}>
                {data.length ? (
                  <p>Unique CLI Positive Responses Per Requestor:</p>
                ) : (
                  <p>No positive responses yet</p>
                )}
              </Typography>
              {showStats(data)}
            </div>
          </>
        );
      };

      setPopOverData(responseFormatted);
    }, 250);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const getPagedData = () => {
    let filtered = incidents;
    return paginate(filtered, pageNumber, pageSize);
  };

  const pagesCount = incidents && Math.ceil(incidents.length / pageSize);
  let paginatedList = getPagedData();

  return (
    <>
      <MyPopOver
        open={open}
        anchorEl={anchorEl}
        handlePopoverClose={handlePopoverClose}
        popOverData={popOverData}
      />
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

      <div style={{ position: "relative", height: "80vh" }}>
        <LogoAndTitle company={company} title={title} />
        <LoadingSpinnerCentered isFetching={isFetching}>
          <Table
            sx={{
              width: "98.5vw",
              minWidth: 650,
              margin: "auto",
              marginTop: "-20px",
              borderTop: "var(--line)",
            }}
            size="medium"
            aria-label="a dense table"
          >
            {generateTableHeadAndColumns(columnsForOpenSpectraIncidents)}
            {TableBodyForIncidents(paginatedList)}
          </Table>

          <EmptyTableIndication recordsNumber={incidents && incidents.length} />

          <PaginationAndTotalRecords
            recordsNumber={incidents && incidents.length}
            pageNumber={pageNumber}
            pagesCount={pagesCount}
            handlePageChange={handlePageChange}
          />
        </LoadingSpinnerCentered>
      </div>
    </>
  );
}
