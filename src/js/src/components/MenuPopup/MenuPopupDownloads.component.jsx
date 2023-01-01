import { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DownloadIcon from "@mui/icons-material/Download";
import DownloadingIcon from "@mui/icons-material/Downloading";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";

import { downloadAffectedUsersForIncident } from "../../utils/downloadAffectedUsersForIncident";
import { downloadAffectedUsersForOutage } from "../../utils/downloadAffectedUsersForOutage";

export const MenuPopupDownloads = ({ incident }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <Button
        id="basic-button"
        variant="outlined"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <DownloadIcon />
        &nbsp;
        {incident.outageId}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={() => {
            downloadAffectedUsersForOutage(incident);
            handleClose();
          }}
        >
          <DownloadingIcon />
          &nbsp;Download Affected Customers for Outage:&nbsp;
          {incident.outageId}
        </MenuItem>
        <MenuItem
          onClick={() => {
            downloadAffectedUsersForIncident(incident);
            handleClose();
          }}
        >
          <DownloadForOfflineIcon />
          &nbsp;Download Affected Customers for Incident:&nbsp;
          {incident.incidentId}
        </MenuItem>
      </Menu>
    </div>
  );
};
