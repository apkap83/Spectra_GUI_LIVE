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

const ColorButton = styled(MuiButton)(({ theme }) => ({
  color: theme.palette.getContrastText(grey[900]),
  backgroundColor: green[500],
  "&:hover": {
    backgroundColor: green[700],
  },
}));

export default function MenuPopupState(incident) {
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
