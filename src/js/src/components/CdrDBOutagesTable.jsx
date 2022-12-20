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
  const pageSize = 18;
  const [pageNumber, setPageNumber] = useState(1);
  const [columns, setColumns] = useState([]);
  const [incidents, setIncidents] = useState();
  const [isFetching, setIsFetching] = useState(true);

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
              }}
            >
              {incident.outage_ID}
            </TableCell>
            <TableCell align="center">{incident.status}</TableCell>
            <TableCell align="center">{incident.capture_Date}</TableCell>
            <TableCell align="center">{incident.dslam}</TableCell>
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

  const formatDurationPrettyString = (text) => (
    <span
      style={{ fontWeight: "500", whiteSpace: "pre-wrap", textAlign: "center" }}
    >
      {text}
    </span>
  );

  const columnsForCdrDBIncidents = [
    "Outage ID",
    "Status",
    "Capture Date",
    "DSLAM Name",
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
          setColumns(columnsForCdrDBIncidents);
          setIncidents(data);
          console.log("CDR Open", data);
        } else if (props.specificRequest === "getClosedCdrDBIncidents") {
          const { data } = await getClosedCDR_DBIncidents();
          setColumns(columnsForCdrDBIncidents);
          console.log("CDR Close", data);
          setIncidents(data);
        } else {
          throw new Error(
            "Not implemented specific request in CdrDBOutagesTable component"
          );
        }
      } catch (error) {
        errorNotification(error.code, error.message);
      }
    };

    fetchData().then(() => {
      setTimeout(() => {
        setIsFetching(false);
      }, 250);
    });
  }, []);

  const handlePageChange = (e, value) => {
    setPageNumber(value);
  };

  const getPagedData = () => {
    let filtered = incidents;
    return paginate(filtered, pageNumber, pageSize);
    // console.log("filtered:", paginatedList);
  };

  if (!incidents || incidents.length === 0) {
    return;
  }

  const pagesCount = Math.ceil(incidents.length / pageSize);
  let paginatedList = getPagedData();

  return (
    <LoadingSpinnerCentered isFetching={isFetching}>
      <div style={{ maxHeight: "86vh", overflowY: "auto" }}>
        <Table sx={{ minWidth: 650 }} size="large" aria-label="a dense table">
          {generateTableHeadAndColumns(columns)}
          {TableBodyForOutages(paginatedList)}
        </Table>
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
      <p style={{ position: "fixed", bottom: "20px", right: "10px" }}>
        <b>Total Records: {incidents.length}</b>
      </p>
    </LoadingSpinnerCentered>
  );
}
