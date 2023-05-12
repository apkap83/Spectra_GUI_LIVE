import React from "react";
import Popover from "@mui/material/Popover";

export function MyPopOver(open, anchorEl, onClose, children) {
  console.log(5, open, anchorEl, onClose, children);
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
      onClose={onClose}
      disableRestoreFocus
    >
      {children}
    </Popover>
  );
}
