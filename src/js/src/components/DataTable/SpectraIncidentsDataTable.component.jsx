import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { ErrorBoundary } from "../Errors/ErrorBoundary.component";

import { Table, Button, Popover, Layout } from "antd";

import {
  getAllSpectraIncidents,
  getOpenSpectraIncidents,
  getOpenCDR_DBIncidents,
  getClosedCDR_DBIncidents,
} from "../../services/incidentService";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "firstName", headerName: "First name", width: 130 },
  { field: "lastName", headerName: "Last name", width: 130 },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    width: 90,
  },
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
    valueGetter: (params) =>
      `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  },
];

const columnsForSpectraIncidents = [
  {
    headerName: "Incident ID",
    // dataIndex: "incidentId",
    key: (Math.random() + 1).toString(36).substring(7),
    valueGetter: (incident) => {
      return (
        <p>Hello</p>
        // <Popover
        //   content={
        //     <div>
        //       <p>INC Affected Voice: {incident.incidentAffectedVoice}</p>
        //       <p>INC Affected Data : {incident.incidentAffectedData}</p>
        //       <p>INC Affected IPTV : {incident.incidentAffectedIPTV}</p>
        //     </div>
        //   }
        //   title={`Details for ${incident.incidentId}`}
        //   trigger="hover"
        // >
        //   <span>{incident.incidentId}</span>
        // </Popover>
      );
    },
  },
];
const other = [
  {
    headerName: "Outage ID",
    // dataIndex: "outageId",
    key: (Math.random() + 1).toString(36).substring(7),
    render: (incident) => {
      return (
        <div>
          {/*
							Download Outage File:
							 Spectra_CLIs_Affected_INC_INC000002017506_OutageID_12697_Voice_20210310.csv */}
          <button
            className="btn btn-outline-info"
            style={{ width: "70px", fontSize: "12px" }}
            onClick={() => {
              // "10 Mar 2021 03:00:00"
              let currentDateString = incident.requestTimestamp.split(" ");
              let mydate = new Date(
                currentDateString[2],
                monthNameToNumber(currentDateString[1]) - 1,
                currentDateString[0]
              );
              /* Spectra_CLIs_Affected_INC_INC000002030409_OutageID_13150_IPTV_20210319.csv */
              const fileNameForOpennedINC =
                "Spectra_CLIs_Affected_INC_" +
                incident.incidentId +
                "_" +
                "OutageID" +
                "_" +
                incident.outageId +
                "_" +
                incident.affectedServices +
                "_" +
                yyyymmdd(mydate) +
                ".csv";
              /* Spectra_CLIs_Affected_OutageID_13023_IPTV_20210319.csv */
              const fileNameForClosedINC =
                "Spectra_CLIs_Affected_" +
                "OutageID" +
                "_" +
                incident.outageId +
                "_" +
                incident.affectedServices +
                "_" +
                yyyymmdd(mydate) +
                ".csv";

              const fileName =
                incident.incidentStatus === "OPEN"
                  ? fileNameForOpennedINC
                  : fileNameForClosedINC;

              const dirName1 =
                incident.incidentStatus === "OPEN"
                  ? "AllOpenedOutages"
                  : "AllClosedOutages";

              downloadFile(dirName1, fileName).then((response) => {
                FileDownload(response.data, fileName);
              });
            }}
          >
            <DownloadIcon fontSize="small" />
            &nbsp;{incident.outageId}
          </button>
        </div>
      );
    },
  },
  {
    headerName: "Incident Status",
    dataIndex: "incidentStatus",
    key: (Math.random() + 1).toString(36).substring(7),
  },
  {
    headerName: "Outage is Published",
    key: (Math.random() + 1).toString(36).substring(7),
    render: (incident) =>
      incident.incidentStatus === "OPEN" ? (
        incident.willBePublished === "Yes" ? (
          <span
            className="willBePublishedEntries"
            style={{
              fontWeight: "bold",
              color: "green",
              transition: "all 1.5s",
            }}
          >
            Yes
          </span>
        ) : (
          <span
            className="willBePublishedEntries"
            style={{
              fontWeight: "bold",
              color: "red",
              transition: "all 1.5s",
            }}
          >
            No
          </span>
        )
      ) : (
        <div>N/A</div>
      ),
    align: "center",
  },
  {
    headerName: "Outage Msg",
    key: (Math.random() + 1).toString(36).substring(7),
    render: (incident) =>
      incident.outageMsg.startsWith("msg") ? (
        <span style={{ color: "#1890ff" }}>
          <b>{incident.outageMsg}</b>
        </span>
      ) : (
        <span>{incident.outageMsg}</span>
      ),
    align: "center",
  },
  {
    headerName: "Backup Eligible",
    key: (Math.random() + 1).toString(36).substring(7),
    render: (incident) =>
      incident.incidentStatus === "OPEN" ? (
        incident.backupEligible === "Yes" ? (
          <span
            style={{
              color: "green",
              transition: "all 1.5s",
            }}
          >
            <b>{incident.backupEligible}</b>
          </span>
        ) : (
          <span
            style={{
              color: "red",
              transition: "all 1.5s",
            }}
          >
            <b>{incident.backupEligible}</b>
          </span>
        )
      ) : (
        "N/A"
      ),
    align: "center",
  },
  {
    headerName: "Hierarchy Selected",
    dataIndex: "hierarchySelected",
    key: (Math.random() + 1).toString(36).substring(7),
    align: "center",
  },
  {
    headerName: "Affected Services",
    dataIndex: "affectedServices",
    key: (Math.random() + 1).toString(36).substring(7),
  },
  {
    headerName: "Scheduled",
    dataIndex: "scheduled",
    key: (Math.random() + 1).toString(36).substring(7),
  },
  {
    headerName: "Start Time",
    key: (Math.random() + 1).toString(36).substring(7),
    render: (incident) => {
      return <span style={{ textAlign: "center" }}>{incident.startTime}</span>;
    },
    align: "center",
  },
  {
    headerName: "End Time",
    key: (Math.random() + 1).toString(36).substring(7),
    render: (incident) => {
      return <span style={{ textAlign: "center" }}>{incident.endTime}</span>;
    },
    align: "center",
  },
  {
    headerName: "Duration",
    dataIndex: "duration",
    key: "duration",
  },
  {
    headerName: "User ID",
    dataIndex: "userId",
    key: "userId",
  },
  {
    headerName: "",
    key: (Math.random() + 1).toString(36).substring(7),
    // render: (incident) => renderPublishingButton(incident),
    render: (incident) => MenuPopupState(incident),
  },
  // {
  //   headerName: renderInputTypeText(),
  //   key: (Math.random() + 1).toString(36).substring(7),
  //   render: (incident) => renderAlterMessageButton(incident),
  // },
  // {
  //   headerName: "",
  //   key: (Math.random() + 1).toString(36).substring(7),
  //   render: (incident) => renderAlterBackupPolicyButton(incident),
  // },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

export function DataTable() {
  const [isFetching, setIsFetching] = useState();
  const [incidents, setIncidents] = useState();
  const [retrievedIncidents, setRetrievedIncidents] = useState();

  // Retrieval of Incidents
  useEffect(() => {
    setIsFetching(true);

    const fetchData = async () => {
      try {
        // The same Component (AllSpectraIncidents) serves All & Open Incidents
        const { data } = await getOpenSpectraIncidents();
        setIncidents(data);
        setRetrievedIncidents(data);
        setIsFetching(false);
        console.log(data);
      } catch (error) {
        console.log(error.code, error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ height: 400, width: "100%" }}>
      <ErrorBoundary>
        {incidents && (
          <DataGrid
            rows={incidents}
            columns={columnsForSpectraIncidents}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        )}
      </ErrorBoundary>
    </div>
  );
}
