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

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import NativeSelect from "@mui/material/NativeSelect";
import TextField from "@mui/material/TextField";

import {
  getStatsForWindIncident,
  getStatsForNovaIncident,
} from "../services/incidentService";

import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";

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
  const [filteredIncidentID, setFilteredIncidentID] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [popOverData, setPopOverData] = useState("");

  const incidentSelectorComponent = () => {
    return (
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 0, width: "25ch", fontSize: "12px" },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="standard-basic"
          label="Search Incident ID"
          variant="standard"
          sx={{
            "&": {
              height: "50px",
            },
          }}
          inputProps={{
            min: 0,
            style: { textAlign: "center" },
          }}
          value={filteredIncidentID}
          onChange={(e) => setFilteredIncidentID(e.target.value)}
        />
      </Box>
    );
  };

  const renderLogoAndTitle = (company) => {
    if (company === "WIND") {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "10px",
            marginBottom: "15px",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            width: "110px",
          }}
        >
          <WindLogo style={{ width: "100px" }} />
          {
            <span
              style={{
                fontWeight: 600,
                fontSize: "12px",
              }}
            >
              {title}
            </span>
          }
        </div>
      );
    }

    if (company === "NOVA") {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "10px",
            marginBottom: "15px",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            width: "110px",
          }}
        >
          <NovaLogo style={{ width: "100px" }} />
          <span
            style={{
              fontWeight: 600,
              fontSize: "12px",
            }}
          >
            {title}
          </span>
        </div>
      );
    }
  };

  const columnsForOpenSpectraIncidents = [
    incidentSelectorComponent(),
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
    renderHideScheduledCheckBox(setHideScheduled),
  ];

  const open = Boolean(anchorEl);
  const TableBodyForIncidents = (incidents) => {
    return (
      <TableBody
        style={
          {
            // backgroundColor: "red",
            // overflowX: "scroll",
            // overflow: "hidden",
            // textOverflow: "ellipsis",
            // wordWrap: "break-word",
          }
        }
      >
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
            <TableCell
              align="center"
              sx={{
                // background: stringToColor(incident.incidentId),
                fontWeight: 700,
                fontSize: "12px",
              }}
            >
              {incident.hierarchySelected} &nbsp;
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
            {/*
            <TableCell
              align="center"
              sx={{
                fontSize: "12px",
              }}
            >
              {incident.outageAffectedVoice}
            </TableCell>

            <TableCell
              align="center"
              sx={{
                fontSize: "12px",
              }}
            >
              {incident.outageAffectedData}
            </TableCell>

            <TableCell
              align="center"
              sx={{
                fontSize: "12px",
              }}
            >
              {incident.outageAffectedIPTV}
            </TableCell> */}

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
                className="mybtn"
                onMouseEnter={(e) => handlePopoverOpen(e, incident.incidentId)}
                onMouseLeave={handlePopoverClose}
              >
                S
              </button>
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

  const getStatsForRespectiveCompanyAndIncident = async (incidentId) => {
    if (company === "WIND") {
      const { data } = await getStatsForWindIncident(incidentId);
      return data;
    }

    if (company === "NOVA") {
      const { data } = await getStatsForNovaIncident(incidentId);
      return data;
    }
  };

  const handlePopoverOpen = async (event, incidentId) => {
    setAnchorEl(event.currentTarget);

    const data = await getStatsForRespectiveCompanyAndIncident(incidentId);
    let responseFormatted = () => {
      return (
        <>
          <div className="popupForStatistics">
            <div className="popupForStatistics__header">
              Statistics for Incident {incidentId}
            </div>
            <Typography sx={{ p: 1 }}>
              {data.length
                ? "Total Positive Responses Per Requestor"
                : "No positive responses yet"}
            </Typography>
            {showStats(data)}
          </div>
        </>
      );
    };
    // let responseFormatted = data.map((item) => {
    //   return (

    //       <ul className="mylist">
    //         <li>
    //           {item.requestor}: {item.positiveResponses}
    //         </li>
    //       </ul>
    //     </div>
    //   );
    // });
    setPopOverData(responseFormatted);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Popover
        id="mouse-over-popover"
        tabIndex={0}
        sx={{
          pointerEvents: "none",
          backgroundColor: "transparent",
          borderRadius: "8px",
          padding: "16px",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        {popOverData}
      </Popover>
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
        {renderLogoAndTitle(company)}
        <Table
          sx={{ minWidth: 650, marginTop: "-24px" }}
          size="medium"
          aria-label="a dense table"
        >
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
            page={pageNumber}
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
