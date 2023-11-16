import { useState } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import config from "../../../config.json";

export const MapIframe = ({ dateRange }) => {
  // Create a state variable to hold the selected value
  const [selectedValue, setSelectedValue] = useState(1);
  console.log("selectedValue", selectedValue);
  // Function to handle changes in the radio group
  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value);
  };
  return (
    <div>
      <FormControl>
        <FormLabel id="demo-radio-buttons-group-label">Map Options</FormLabel>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="1"
          name="radio-buttons-group"
          onChange={handleRadioChange} // Handle changes using the function
          sx={{
            flexDirection: "row", // Change the flex direction to row
          }}
        >
          <FormControlLabel value="1" control={<Radio />} label="All" />
          <FormControlLabel value="2" control={<Radio />} label="Nova + Wind" />

          <FormControlLabel value="3" control={<Radio />} label="Map 3" />
          <FormControlLabel value="4" control={<Radio />} label="Map 4" />
          <FormControlLabel value="4" control={<Radio />} label="Map 5" />
        </RadioGroup>
      </FormControl>

      <iframe
        src={`${
          config.apiPrefixForIframeDuringRemoteDev
        }/api/charts/proxy/dslam-outage?from=${dateRange["startDate"].format(
          "YYYY-MM-DD"
        )}&to=${dateRange["endDate"].format(
          "YYYY-MM-DD"
        )}&dataset=${selectedValue}`}
        title="Example Iframe"
        width="100%"
        height="860"
        style={{ border: "1 px solid #f8f8f8" }}
      >
        <p>Your browser does not support iframes.</p>
      </iframe>
    </div>
  );
};
