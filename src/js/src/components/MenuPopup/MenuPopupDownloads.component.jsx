import { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DownloadIcon from "@mui/icons-material/Download";
import DownloadingIcon from "@mui/icons-material/Downloading";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import AddIcCallIcon from "@mui/icons-material/AddIcCall";

import { downloadAffectedUsersForIncident } from "../../utils/downloadAffectedUsersForIncident";
import { downloadAffectedUsersForOutage } from "../../utils/downloadAffectedUsersForOutage";
import { downloadPosSpectraForCompanyAndINC } from "../../utils/downloadPositiveForCompanyAndINC";

export const MenuPopupDownloads = ({ incident, company }) => {
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
        size="small"
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
            downloadAffectedUsersForOutage(incident, company);
            handleClose();
          }}
        >
          <DownloadingIcon />
          &nbsp;Download Affected Customers for Outage:&nbsp;
          {incident.outageId}
        </MenuItem>
        <MenuItem
          onClick={() => {
            downloadAffectedUsersForIncident(incident, company);
            handleClose();
          }}
        >
          <DownloadForOfflineIcon />
          &nbsp;Download Affected Customers for Incident:&nbsp;
          {incident.incidentId}
        </MenuItem>
        <MenuItem
          onClick={() => {
            downloadPosSpectraForCompanyAndINC(incident, company);
            handleClose();
          }}
        >
          <AddIcCallIcon />
          &nbsp;Download Positive Spectra Requests for Incident:&nbsp;
          {incident.incidentId}
        </MenuItem>
      </Menu>
    </div>
  );
};
