import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export const IncidentSelector = ({
  setFilteredIncidentID,
  filteredIncidentID,
}) => {
  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 0, width: "25ch", fontSize: "12px" },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        id="standard-basic"
        label="Search Incident ID"
        variant="standard"
        sx={{
          "&": {
            height: "50px",
          },
        }}
        inputProps={{
          min: 0,
          style: { textAlign: "center" },
        }}
        value={filteredIncidentID}
        onChange={(e) => setFilteredIncidentID(e.target.value)}
      />
    </Box>
  );
};
