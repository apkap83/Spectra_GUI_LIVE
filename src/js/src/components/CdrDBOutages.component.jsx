import { useState, useEffect } from "react";
import { ErrorBoundary } from "./Errors/ErrorBoundary.component";

import stringToColor from "../utils/stringToColor";

import { ReactComponent as NoDataLogo } from "../assets/noData.svg";

// MUI Lib Imports
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Pagination from "@mui/material/Pagination";
import { styled } from "@mui/system";
import TextField from "@mui/material/TextField";
// MUI Icons
import BorderOuterIcon from "@mui/icons-material/BorderOuter";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";

import { errorNotification } from "./common/Notification";

import { paginate } from "../utils/paginate";

import {
  getOpenCDR_DBIncidents,
  getClosedCDR_DBIncidents,
} from "../services/incidentService";

import LoadingSpinnerCentered from "./Spinner/LoadingSpinnerCentered.component";
let Title = () => {};
export function CdrDBOutages(props) {
  const COMPANY = {
    WINDplusNova: "WIND+NOVA",
    WIND: "WIND",
    NOVA: "NOVA",
  };

  const MENU_COMPANY_ITEMS = [COMPANY.WINDplusNova, COMPANY.WIND, COMPANY.NOVA];

  const pageSize = 20;
  const [isFetching, setIsFetching] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [incidents, setIncidents] = useState();
  const [retrievedIncidents, setRetrievedIncidents] = useState();
  const [companySelected, setCompanySelected] = useState(COMPANY.WINDplusNova);
  const [dslamSelected, setDslamSelected] = useState();
  const [oteSiteSelected, setOteSiteSelected] = useState();

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

  const TableBodyForOutages = (myIncidents) => {
    return (
      <TableBody>
        {myIncidents.map((incident) => (
          <TableRow
            key={(Math.random() + 1).toString(36).substring(7)}
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.01)",
              // "&:last-child td, &:last-child th": { border: 0 },
              // background: "rgba(",
              // borderBottom: "2px solid rgba(#fff, .3)",
            }}
          >
            <TableCell align="center" component="th" scope="row">
              {incident.outage_ID}
            </TableCell>
            <TableCell align="center" component="th" scope="row">
              {incident.outage_LEVEL}
            </TableCell>
            <TableCell align="center">{incident.status}</TableCell>
            <TableCell align="center">{incident.capture_Date}</TableCell>
            <TableCell align="center">{incident.network}</TableCell>
            <TableCell align="center">{incident.ote_SITE_NAME}</TableCell>
            <TableCell align="center">{incident.dslam}</TableCell>
            <TableCell align="center">{incident.dslam_SLOT}</TableCell>
            <TableCell align="center">{incident.dslam_Owner}</TableCell>
            <TableCell align="center">{incident.last_Occured}</TableCell>
            <TableCell align="center">{incident.duration_Pretty}</TableCell>
            <TableCell align="center">{incident.duration_Sec}</TableCell>
            <TableCell align="center">{incident.dslam_Users}</TableCell>
            <TableCell align="center">{incident.disconnected_Users}</TableCell>
            <TableCell align="center">
              {incident.disconnections_Ratio}
            </TableCell>
            <TableCell align="center">{incident.total_Users_Called}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  };

  const handleNetworkDropDownChange = (e) => {
    const { value: network } = e.target;
    setCompanySelected(network);
  };

  const companySelectorComponent = () => (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Network</InputLabel>
      <NativeSelect
        sx={{
          width: "120px",
          textAlign: "center",
          fontSize: "1.3rem",
          textAlignLast: "left",
        }}
        onChange={handleNetworkDropDownChange}
      >
        {MENU_COMPANY_ITEMS.map((company, i) => {
          return (
            <option key={i} value={company}>
              {company}
            </option>
          );
        })}
      </NativeSelect>
    </FormControl>
  );

  const dslamFilterComponent = () => {
    return (
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 0, width: "15ch", fontSize: "25px" },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="standard-basic"
          label="DSLAM Name"
          variant="standard"
          inputProps={{
            min: 0,
            style: { textAlign: "center" },
          }}
          onChange={handleDslamFilter}
        />
      </Box>
    );
  };

  const oteSiteFilterComponent = () => {
    return (
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 0, width: "15ch", fontSize: "25px" },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="standard-basic"
          label="Ote Site (Greek Name)"
          variant="standard"
          inputProps={{
            min: 0,
            style: { textAlign: "center" },
          }}
          onChange={handleOteSiteFilter}
        />
      </Box>
    );
  };

  const handleOteSiteFilter = (e) => {
    const { value: oteSiteName } = e.target;
    setOteSiteSelected(oteSiteName);
  };

  const handleDslamFilter = (e) => {
    const { value: dslamName } = e.target;
    setDslamSelected(dslamName);
  };

  const columnsForCdrDBIncidents = [
    "Outage ID",
    "Outage Level",
    "Status",
    "Capture Date",
    companySelectorComponent(),
    oteSiteFilterComponent(),
    dslamFilterComponent(),
    "DSLAM Slot",
    "DSLAM Owner",
    "Last Occured",
    "Duration Pretty",
    "Duration Minutes",
    "DSLAM Users",
    "Disconnected Users",
    "Disconnected Ratio",
    "Unique Users Called",
  ];

  // Retrieval of Incidents
  useEffect(() => {
    setIsFetching(true);
    const fetchData = async () => {
      try {
        if (props.specificRequest === "getOpenCdrDBIncidents") {
          Title = () => {
            return (
              <div
                style={{
                  margin: "1rem",
                  color: "#000",
                  display: "flex",
                  justifyContent: "left",
                  alignItems: "center",
                }}
              >
                <BorderOuterIcon
                  sx={{
                    fontSize: "24px",
                  }}
                />{" "}
                <span
                  style={{
                    marginLeft: "0.4rem",
                    fontWeight: 600,
                  }}
                >
                  Open DSLAM Outages
                </span>
              </div>
            );
          };
          const { data } = await getOpenCDR_DBIncidents();
          setIncidents(data);
          setRetrievedIncidents(data);
          setIsFetching(false);
        } else if (props.specificRequest === "getClosedCdrDBIncidents") {
          Title = () => {
            return (
              <div
                style={{
                  margin: "1rem",
                  color: "#000",
                  display: "flex",
                  justifyContent: "left",
                  alignItems: "center",
                }}
              >
                <HistoryToggleOffIcon
                  sx={{
                    fontSize: "24px",
                  }}
                />{" "}
                <span
                  style={{
                    marginLeft: "0.4rem",
                  }}
                >
                  Closed DSLAM Outages
                </span>
              </div>
            );
          };
          const { data } = await getClosedCDR_DBIncidents();
          setIncidents(data);
          setRetrievedIncidents(data);
          setIsFetching(false);
        } else {
          throw new Error(
            "Not implemented specific request in CdrDBOutagesTable component"
          );
        }
      } catch (error) {
        errorNotification(error.code, error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Back to Page 1
    setPageNumber(1);

    let filteredAll = retrievedIncidents;

    if (dslamSelected) {
      filteredAll = filteredAll.filter((inc) =>
        inc.dslam.toLowerCase().includes(dslamSelected.toLowerCase())
      );
    }

    if (oteSiteSelected) {
      filteredAll = filteredAll.filter((inc) =>
        inc.ote_SITE_NAME.toLowerCase().includes(oteSiteSelected.toLowerCase())
      );
    }

    if (companySelected === COMPANY.WINDplusNova) {
      setIncidents(filteredAll);
    } else {
      const filteredFromNetwork = filteredAll.filter(
        (inc) => inc.network === companySelected
      );
      setIncidents(filteredFromNetwork);
    }
  }, [companySelected, dslamSelected, oteSiteSelected]);

  const handlePageChange = (e, value) => {
    setPageNumber(value);
  };

  if (isFetching) {
    return <LoadingSpinnerCentered isFetching={true} />;
  }

  if (!incidents) {
    return null;
  }

  const getPagedData = () => {
    let filtered = incidents;
    return paginate(filtered, pageNumber, pageSize);
  };

  const pagesCount = Math.ceil(incidents.length / pageSize);
  let paginatedList = getPagedData();
  return (
    <>
      <h3 className="m-2">
        <Title />
      </h3>
      <div
        style={{
          borderTop: "var(--line)",
        }}
      >
        <Table
          sx={{ margin: "auto", width: "99.2%" }}
          size="medium"
          aria-label="a dense table"
        >
          {generateTableHeadAndColumns(columnsForCdrDBIncidents)}
          {TableBodyForOutages(paginatedList)}
        </Table>
        {emptyTableIndication(paginatedList)}

        <Box
          float="right"
          display="flex"
          width="auto"
          height="50px"
          marginLeft="1rem"
          marginTop="8px"
          marginBottom="80px"
          // bgcolor="lightgreen"
          alignItems="flex-start"
          justifyContent="space-between"
          fontSize="1.3rem"
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
