import { useState, useEffect } from "react";
import { ErrorBoundary } from "./Errors/ErrorBoundary.component";

import stringToColor from "../utils/stringToColor";

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
import Pagination from "@mui/material/Pagination";
import { styled } from "@mui/system";
import TextField from "@mui/material/TextField";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import NativeSelect from "@mui/material/NativeSelect";

import { errorNotification } from "../Notification";

import { paginate } from "../utils/paginate";

import {
  getAllSpectraIncidents,
  getOpenSpectraIncidents,
  getOpenCDR_DBIncidents,
  getClosedCDR_DBIncidents,
} from "../services/incidentService";

import LoadingSpinnerCentered from "./Spinner/LoadingSpinnerCentered.component";

export function CdrDBOutagesTable(props) {
  const COMPANY = {
    WINDplusNova: "WIND+NOVA",
    WIND: "WIND",
    NOVA: "NOVA",
  };

  const MENU_COMPANY_ITEMS = [COMPANY.WINDplusNova, COMPANY.WIND, COMPANY.NOVA];

  const pageSize = 18;
  const [isFetching, setIsFetching] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [incidents, setIncidents] = useState();
  const [retrievedIncidents, setRetrievedIncidents] = useState();
  const [companySelected, setCompanySelected] = useState(COMPANY.WINDplusNova);
  const [dslamSelected, setDslamSelected] = useState();

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    // "&:nth-of-type(odd)": {
    //   backgroundColor: "white",
    // },
    // "&:nth-of-type(even)": {
    //   backgroundColor: "#f8f8f8",
    // },
  }));

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

  const emptyTableIndication = () => {
    return (
      <>
        <h4 style={{ margin: "140px", textAlign: "center" }}>No data</h4>
      </>
    );
  };

  const TableBodyForOutages = (myIncidents) => {
    return (
      <TableBody>
        {myIncidents.map((incident) => (
          <TableRow
            key={(Math.random() + 1).toString(36).substring(7)}
            sx={{
              "&:last-child td, &:last-child th": { border: 0 },
              background: stringToColor(incident.dslam_Owner) + "30",
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
              {incident.outage_ID}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontWeight: 700,
                fontSize: "15px",
              }}
            >
              {incident.status}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontWeight: 700,
                fontSize: "15px",
              }}
            >
              {incident.capture_Date}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontWeight: 700,
                fontSize: "15px",
              }}
            >
              {incident.network}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontWeight: 700,
                fontSize: "15px",
              }}
            >
              {incident.dslam}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontWeight: 700,
                fontSize: "15px",
              }}
            >
              {incident.dslam_Owner}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontWeight: 700,
                fontSize: "15px",
              }}
            >
              {incident.last_Occured}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontWeight: 700,
                fontSize: "15px",
              }}
            >
              {incident.duration_Pretty}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontWeight: 700,
                fontSize: "15px",
              }}
            >
              {incident.duration_Sec}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontWeight: 700,
                fontSize: "15px",
              }}
            >
              {incident.dslam_Users}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontWeight: 700,
                fontSize: "15px",
              }}
            >
              {incident.disconnected_Users}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontWeight: 700,
                fontSize: "15px",
              }}
            >
              {incident.disconnections_Ratio}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontWeight: 700,
                fontSize: "15px",
              }}
            >
              {incident.total_Users_Called}
            </TableCell>
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
      <InputLabel id="demo-simple-select-label">
        <b>Network</b>
      </InputLabel>
      <NativeSelect
        sx={{
          width: "130px",
          textAlign: "center",
          fontSize: "16px",
          fontWeight: 700,
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

  const handleDslamFilter = (e) => {
    const { value: dlsamName } = e.target;
    setDslamSelected(dlsamName);
  };
  const columnsForCdrDBIncidents = [
    "Outage ID",
    "Status",
    "Capture Date",
    companySelectorComponent(),
    dslamFilterComponent(),
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
          const { data } = await getOpenCDR_DBIncidents();
          setIncidents(data);
          setRetrievedIncidents(data);
          setIsFetching(false);
        } else if (props.specificRequest === "getClosedCdrDBIncidents") {
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
    let filteredFromDslamName = retrievedIncidents;

    if (dslamSelected) {
      filteredFromDslamName = retrievedIncidents.filter((inc) =>
        inc.dslam.toLowerCase().includes(dslamSelected.toLowerCase())
      );
    }

    if (companySelected === COMPANY.WINDplusNova) {
      setIncidents(filteredFromDslamName);
    } else {
      const filteredFromNetwork = filteredFromDslamName.filter(
        (inc) => inc.network === companySelected
      );
      setIncidents(filteredFromNetwork);
    }
  }, [companySelected, dslamSelected]);

  // useEffect(() => {
  //   if (incidents) {
  //     const filtered = incidents.filter((inc) =>
  //       inc.dslam.toLowerCase().includes(dslamSelected)
  //     );
  //     setIncidents(filtered);
  //   }
  // }, [dslamSelected]);

  const handlePageChange = (e, value) => {
    setPageNumber(value);
  };
  if (isFetching) {
    return <LoadingSpinnerCentered isFetching={true} />;
  }

  if (!incidents) {
    return;
  }

  const getPagedData = () => {
    let filtered = incidents;
    return paginate(filtered, pageNumber, pageSize);
    // console.log("filtered:", paginatedList);
  };

  const pagesCount = Math.ceil(incidents.length / pageSize);
  let paginatedList = getPagedData();

  return (
    <>
      <div style={{ maxHeight: "86vh", overflowY: "auto" }}>
        <Table sx={{ minWidth: 650 }} size="large" aria-label="a dense table">
          {generateTableHeadAndColumns(columnsForCdrDBIncidents)}
          {TableBodyForOutages(paginatedList)}
        </Table>

        {paginatedList.length === 0 ? emptyTableIndication() : ""}
      </div>
      <Pagination
        sx={{
          width: "auto",
          marginLeft: "auto",
          marginRight: "10px",
          marginTop: "10px",
          float: "right",
        }}
        count={pagesCount}
        variant="outlined"
        shape="rounded"
        onChange={handlePageChange}
      />
      <p style={{ marginTop: "20px" }}>
        <b>Total Records: {incidents.length}</b>
      </p>
    </>
  );
}
