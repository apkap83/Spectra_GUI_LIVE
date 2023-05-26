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
  return (
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <Fragment>
          <ColorButton
            style={{
              fontSize: "1.1rem",
              // width: "110px",
              padding: "0.5rem 0.4rem",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
            variant="contained"
            {...bindTrigger(popupState)}
          >
            <SettingsIcon fontSize="large" />
            <span
              style={{
                marginLeft: "0.7rem",
              }}
            >
              Actions
            </span>
          </ColorButton>
          <Menu {...bindMenu(popupState)}>
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
