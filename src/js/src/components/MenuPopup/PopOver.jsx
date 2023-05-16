import React from "react";
import Popover from "@mui/material/Popover";

export const MyPopOver = ({
  open,
  anchorEl,
  handlePopoverClose,
  popOverData,
}) => {
  return (
    <Popover
      id="mouse-over-popover"
      tabIndex={0}
      sx={{
        pointerEvents: "none",
        backgroundColor: "transparent",
        borderRadius: "8px",
        padding: "16px",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
      }}
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      onClose={handlePopoverClose}
      disableRestoreFocus
    >
      {popOverData}
    </Popover>
  );
};
