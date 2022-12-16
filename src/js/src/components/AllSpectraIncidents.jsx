import { useState, useEffect } from "react";
import { monthNameToNumber, yyyymmdd } from "../utills/myutils";
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

import { errorNotification } from "../Notification";

// Antd Library
import { Table, Button, Popover, Layout } from "antd";

import { downloadFile } from "../services/incidentService";

// MUI
import * as React from "react";
import MuiButton from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { styled } from "@mui/material/styles";
import { purple, green, grey } from "@mui/material/colors";

// MUI Icons
import SettingsIcon from "@mui/icons-material/Settings";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import CheckIcon from "@mui/icons-material/Check";
import MessageIcon from "@mui/icons-material/Message";
import BackupIcon from "@mui/icons-material/Backup";
import DownloadIcon from "@mui/icons-material/Download";

const { Content } = Layout;
const FileDownload = require("js-file-download");

const AllSpectraIncidents = (props) => {
  const [isFetching, setIsFetching] = useState("");
  const [columns, setColumns] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState(incidents);

  const [showModalAlterPublish, setshowModalAlterPublish] = useState(false);
  const [showModalAlterMessage, setShowModalAlterMessage] = useState(false);
  const [showModalAlterBackup, setShowModalAlterBackup] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState("");
  const [hideScheduled, setHideScheduled] = useState(false);
  const [searchField, setSearchField] = useState("");

  const ColorButton = styled(MuiButton)(({ theme }) => ({
    color: theme.palette.getContrastText(grey[900]),
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
    },
  }));

  function MenuPopupState(incident) {
    return (
      <PopupState variant="popover" popupId="demo-popup-menu">
        {(popupState) => (
          <React.Fragment>
            <ColorButton
              style={{
                width: "110px",
                padding: "0.5em",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
              variant="contained"
              {...bindTrigger(popupState)}
            >
              <span>Actions</span>
              <SettingsIcon />
            </ColorButton>
            <Menu {...bindMenu(popupState)}>
              <MenuItem
                onClick={() => {
                  popupState.close();
                  setshowModalAlterPublish(true);
                  setSelectedIncident(incident);
                }}
              >
                {incident.willBePublished === "Yes" ? (
                  <span style={{ color: "red" }}>
                    <DisabledByDefaultIcon />
                    &nbsp;
                    <b>Disable&nbsp;Publishing</b>
                  </span>
                ) : (
                  <span style={{ color: "green" }}>
                    <CheckIcon />
                    &nbsp;<b>Enable&nbsp;Publishing</b>
                  </span>
                )}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  popupState.close();
                  setShowModalAlterMessage(true);
                  setSelectedIncident(incident);
                }}
              >
                <span style={{ color: "#1890ff" }}>
                  <MessageIcon />
                  &nbsp;
                  <b>Alter&nbsp;Message</b>
                </span>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  popupState.close();
                  setShowModalAlterBackup(true);
                  setSelectedIncident(incident);
                }}
              >
                <span>
                  <BackupIcon />
                  &nbsp; Alter Backup Policy
                </span>
              </MenuItem>
            </Menu>
          </React.Fragment>
        )}
      </PopupState>
    );
  }

  const formatDurationPrettyString = (text) => (
    <span
      style={{ fontWeight: "500", whiteSpace: "pre-wrap", textAlign: "center" }}
    >
      {text}
    </span>
  );
  const columnsForSpectraIncidents = [
    {
      title: "Incident ID",
      // dataIndex: "incidentId",
      key: (Math.random() + 1).toString(36).substring(7),
      render: (incident) => {
        return (
          <Popover
            content={
              <div>
                <p>INC Affected Voice: {incident.incidentAffectedVoice}</p>
                <p>INC Affected Data : {incident.incidentAffectedData}</p>
                <p>INC Affected IPTV : {incident.incidentAffectedIPTV}</p>
              </div>
            }
            title={`Details for ${incident.incidentId}`}
            trigger="hover"
          >
            <span>{incident.incidentId}</span>
          </Popover>
        );
      },
    },
    {
      title: "Outage ID",
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
      title: "Incident Status",
      dataIndex: "incidentStatus",
      key: (Math.random() + 1).toString(36).substring(7),
    },
    {
      title: "Outage is Published",
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
      title: "Outage Msg",
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
      title: "Backup Eligible",
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
      title: "Hierarchy Selected",
      dataIndex: "hierarchySelected",
      key: (Math.random() + 1).toString(36).substring(7),
      align: "center",
    },
    {
      title: "Affected Services",
      dataIndex: "affectedServices",
      key: (Math.random() + 1).toString(36).substring(7),
    },
    {
      title: "Scheduled",
      dataIndex: "scheduled",
      key: (Math.random() + 1).toString(36).substring(7),
    },
    {
      title: "Start Time",
      key: (Math.random() + 1).toString(36).substring(7),
      render: (incident) => {
        return (
          <span style={{ textAlign: "center" }}>{incident.startTime}</span>
        );
      },
      align: "center",
    },
    {
      title: "End Time",
      key: (Math.random() + 1).toString(36).substring(7),
      render: (incident) => {
        return <span style={{ textAlign: "center" }}>{incident.endTime}</span>;
      },
      align: "center",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
    },
    {
      title: renderHideScheduledCheckBox(),
      key: (Math.random() + 1).toString(36).substring(7),
      // render: (incident) => renderPublishingButton(incident),
      render: (incident) => MenuPopupState(incident),
    },
    // {
    //   title: renderInputTypeText(),
    //   key: (Math.random() + 1).toString(36).substring(7),
    //   render: (incident) => renderAlterMessageButton(incident),
    // },
    // {
    //   title: "",
    //   key: (Math.random() + 1).toString(36).substring(7),
    //   render: (incident) => renderAlterBackupPolicyButton(incident),
    // },
  ];
  const columnsForCdrDBIncidents = [
    {
      title: "Outage ID",
      dataIndex: "outage_ID",
      key: "outage_ID",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Capture Date",
      dataIndex: "capture_Date",
      key: "capture_Date",
    },
    {
      title: "DSLAM Name",
      dataIndex: "dslam",
      key: "dslam",
    },
    {
      title: "DSLAM Owner",
      dataIndex: "dslam_Owner",
      key: "dsladslam_Owner",
    },
    {
      title: "Last Occurred",
      dataIndex: "last_Occured",
      key: "last_Occured",
    },
    {
      title: formatDurationPrettyString("Duration\nPretty\nD H:M:S"),
      dataIndex: "duration_Pretty",
      key: "duration_Pretty",
    },
    {
      title: "Duration Minutes",
      key: "duration_Sec",
      render: (incident) => {
        return parseFloat(incident.duration_Sec / 60).toFixed(1);
      },
    },
    {
      title: "DSLAM Users",
      dataIndex: "dslam_Users",
      key: "dslam_Users",
    },
    {
      title: "Disconnected Users",
      key: "disconnected_Users",
      render: (incident) => {
        return incident.disconnected_Users > 500 &&
          incident.disconnected_Users < 1000 ? (
          <span
            style={{
              textAlign: "center",
              fontWeight: "bold",
              color: "#FFA500",
            }}
          >
            {incident.disconnected_Users}
          </span>
        ) : incident.disconnected_Users > 1000 ? (
          <span
            style={{
              textAlign: "center",
              fontWeight: "bold",
              color: "red",
            }}
          >
            {incident.disconnected_Users}
          </span>
        ) : incident.disconnected_Users > 100 ? (
          <span
            style={{
              textAlign: "center",
              fontWeight: "bold",
              color: "#9B59B6",
            }}
          >
            {incident.disconnected_Users}
          </span>
        ) : (
          incident.disconnected_Users
        );
      },
    },
    {
      title: "Disconnected Ratio",
      key: "disconnections_Ratio",
      render: (incident) => {
        return parseFloat(incident.disconnections_Ratio * 100).toFixed(0) + "%";
      },
    },
    // {
    //   title: "Total Calls",
    //   dataIndex: "total_Calls",
    //   key: "total_Calls",
    // },
    {
      title: "Unique Users Called",
      dataIndex: "total_Users_Called",
      key: "total_Users_Called",
    },
  ];
  useEffect(() => {
    // console.log("First Use Effect");
    const fetchData = () => {
      setIsFetching(true);

      setTimeout(async () => {
        try {
          // The same Component (AllSpectraIncidents) serves All & Open Incidents
          if (props.specificRequest === "getOpenSpectraIncidents") {
            const { data } = await getOpenSpectraIncidents();
            setColumns(columnsForSpectraIncidents);
            setIncidents(data);
            setIsFetching(false);
          } else if (props.specificRequest === "getOpenCdrDBIncidents") {
            const { data } = await getOpenCDR_DBIncidents();
            setColumns(columnsForCdrDBIncidents);
            setIncidents(data);
            setIsFetching(false);
          } else if (props.specificRequest === "getClosedCdrDBIncidents") {
            const { data } = await getClosedCDR_DBIncidents();
            setColumns(columnsForCdrDBIncidents);
            setIncidents(data);
            setIsFetching(false);
          } else {
            const { data } = await getAllSpectraIncidents();
            setColumns(columnsForSpectraIncidents);
            setIncidents(data);
            setIsFetching(false);
          }
        } catch (error) {
          errorNotification(error.code, error.message);
        }
      }, 1);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (hideScheduled) {
      const scheduledInc = incidents.filter((inc) => inc.scheduled === "No");
      const myFilteredIncidents = scheduledInc.filter((inc) =>
        inc.incidentId.toLocaleLowerCase().includes(searchField)
      );
      setFilteredIncidents(myFilteredIncidents);
    } else {
      // For CDR-DB no filter yet
      if (
        props.specificRequest === "getOpenCdrDBIncidents" ||
        props.specificRequest === "getClosedCdrDBIncidents"
      ) {
        setFilteredIncidents(incidents);
      } else {
        const myFilteredIncidents = incidents.filter((inc) =>
          inc.incidentId.toLocaleLowerCase().includes(searchField)
        );
        setFilteredIncidents(myFilteredIncidents);
      }
    }
  }, [incidents, hideScheduled, searchField]);

  function renderInputTypeText() {
    return (
      <input
        className="d-inline bg-light text-center"
        type="text"
        name="search"
        placeholder="Search Incident ID"
        onChange={(e) => {
          const searchField = e.target.value.toLocaleLowerCase();
          setSearchField(searchField);
        }}
      />
    );
  }

  function handleChange(e) {
    setHideScheduled((prev) => !prev);
  }

  function renderHideScheduledCheckBox() {
    return (
      <div
        key={(Math.random() + 1).toString(36).substring(7)}
        className="d-flex align-align-items-center"
        // onClick={() => {
        //   console.log("clicked!");
        // }}
      >
        <input
          type="checkbox"
          name="hidescheduled"
          id="hidescheduled"
          className="p-4"
          style={{ width: "20px" }}
          // checked={hideScheduled}
          onChange={(e) => handleChange(e)}
        />
        <label
          className="d-inline-block"
          htmlFor="hidescheduled"
          style={{ marginLeft: "15px" }}
        >
          Hide Scheduled
        </label>
      </div>
    );
  }
  function renderAlterBackupPolicyButton(incident) {
    return incident.incidentStatus === "OPEN" ? (
      <Button
        key={incident.id}
        type="primary"
        onClick={() => {
          setSelectedIncident(incident);
          setShowModalAlterBackup(true);
        }}
        style={{ fontSize: "12px" }}
      >
        Backup Policy
      </Button>
    ) : (
      ""
    );
  }
  function renderAlterMessageButton(incident) {
    return incident.incidentStatus === "OPEN" ? (
      <div className="d-flex justify-content-center ">
        <Button
          key={incident.id}
          type="primary"
          onClick={() => {
            setSelectedIncident(incident);
            setShowModalAlterMessage(true);
          }}
          style={{ fontSize: "12px" }}
        >
          Alter Message
        </Button>
      </div>
    ) : (
      ""
    );
  }
  function renderPublishingButton(incident) {
    return incident.incidentStatus === "OPEN" ? (
      incident.willBePublished === "Yes" ? (
        <Button
          key={incident.id}
          onClick={() => {
            setSelectedIncident(incident);
            setshowModalAlterPublish(true);
          }}
          type="primary"
          danger
          style={{ fontSize: "12px" }}
        >
          Disable Publishing
        </Button>
      ) : (
        <Button
          key={incident.id}
          onClick={() => {
            setSelectedIncident(incident);
            setshowModalAlterPublish(true);
          }}
          disabled={incident.incidentStatus === "OPEN" ? false : true}
          type="primary"
          style={{ fontSize: "12px" }}
        >
          Enable Publishing
        </Button>
      )
    ) : (
      ""
    );
  }

  function renderCDRDB_Headers() {
    return (
      <div>
        {props.specificRequest === "getOpenCdrDBIncidents" ? (
          <h3>Open CDR-DB Incidents</h3>
        ) : (
          ""
        )}
        {props.specificRequest === "getClosedCdrDBIncidents" ? (
          <h3>Closed CDR-DB Incidents</h3>
        ) : (
          ""
        )}
      </div>
    );
  }

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

  // console.log("Render");

  return (
    <LoadingSpinnerCentered isFetching={isFetching}>
      <ModalAlterPublish {...modalAlterPublishProps} />
      <ModalAlterMessage {...modalAlterMessageProps} />
      <ModalAlterBackup {...modalAlterBackupProps} />
      <Layout className="site-layout-background" style={{ padding: "0" }}>
        <Content style={{ padding: "0 5px", marginTop: "1px" }}>
          <Content style={{ minHeight: "100vh" }}>
            {renderCDRDB_Headers()}
            <Table
              dataSource={filteredIncidents}
              columns={columns}
              rowKey="id"
              pagination={{ defaultPageSize: 50 }}
              size="small"
              style={{ marginBottom: "50px", transition: "transform 1.5s" }}
            />
          </Content>
        </Content>
      </Layout>
    </LoadingSpinnerCentered>
  );
};

export default AllSpectraIncidents;
