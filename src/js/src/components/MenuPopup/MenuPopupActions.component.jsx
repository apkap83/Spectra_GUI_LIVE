import { Fragment } from "react";

import { PERMISSION } from "../../roles/permissions";

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
import { MenuPopupDownloads } from "./MenuPopupDownloads.component";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";

const ColorButton = styled(MuiButton)(({ theme }) => ({
  color: theme.palette.getContrastText(grey[900]),
  backgroundColor: green[500],
  "&:hover": {
    backgroundColor: green[700],
  },
}));

export function ActionsMenu(
  incident,
  restContextProperties,
  userDetails,
  company
) {
  const IsDisabledPublishing =
    userDetails &&
    !userDetails.roles.includes(PERMISSION.USER_CAN_DISABLE_PUBLISHING);
  const IsDisabledAlterMessage =
    userDetails &&
    !userDetails.roles.includes(PERMISSION.USER_CAN_ALTER_MESSAGE);
  const isDisabledAlterBackup =
    userDetails &&
    !userDetails.roles.includes(PERMISSION.USER_CAN_ALTER_BACKUP_POLICY);

  const IsDisabledDownload = !userDetails.roles.includes(
    PERMISSION.USER_CAN_DOWNLOAD_FILES
  );

  const {
    setSelectedIncident,
    setshowModalAlterPublish,
    setShowModalAlterMessage,
    setShowModalAlterBackup,
  } = restContextProperties;

  const incidentIsOpen = incident.incidentStatus === "OPEN";
  return (
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <Fragment>
          <button
            className="action__btn"
            // style={{
            //   fontSize: "1.1rem",
            //   padding: "0.55rem 0.55rem",
            //   display: "flex",
            //   justifyContent: "center",
            //   alignItems: "center",
            // }}
            {...bindTrigger(popupState)}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                lineHeight: "1.3rem",
              }}
            >
              <FontAwesomeIcon icon={faGear} />
              <span
                style={{
                  marginLeft: "0.7rem",
                }}
              >
                Actions
              </span>
            </div>
          </button>
          <Menu {...bindMenu(popupState)}>
            {incidentIsOpen ? (
              <div>
                <MenuItem
                  disabled={IsDisabledPublishing}
                  onClick={() => {
                    popupState.close();
                    setshowModalAlterPublish(true);
                    setSelectedIncident(incident);
                  }}
                >
                  {incident.willBePublished === "Yes" ? (
                    <span style={{ color: "red", fontSize: "1.2rem" }}>
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
                  disabled={IsDisabledAlterMessage}
                  onClick={() => {
                    popupState.close();
                    setShowModalAlterMessage(true);
                    setSelectedIncident(incident);
                  }}
                >
                  <span style={{ color: "#1890ff", fontSize: "1.2rem" }}>
                    <MessageIcon />
                    &nbsp;
                    <b>Alter&nbsp;Message</b>
                  </span>
                </MenuItem>
                <MenuItem
                  disabled={isDisabledAlterBackup}
                  onClick={() => {
                    popupState.close();
                    setShowModalAlterBackup(true);
                    setSelectedIncident(incident);
                  }}
                >
                  <span style={{ color: "#000", fontSize: "1.2rem" }}>
                    <BackupIcon />
                    &nbsp; <b>Alter Backup Policy</b>
                  </span>
                </MenuItem>
              </div>
            ) : null}

            <MenuItem disabled={IsDisabledDownload}>
              <MenuPopupDownloads
                style={{ margin: 0, padding: 0 }}
                incident={incident}
                company={company}
              />
            </MenuItem>
          </Menu>
        </Fragment>
      )}
    </PopupState>
  );
}
