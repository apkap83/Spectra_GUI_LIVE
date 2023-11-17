import { useState } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Spin } from "antd";
import config from "../../../config.json";

export const MapIframe = ({ dateRange, masterLoading }) => {
  const [selectedValue, setSelectedValue] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleRadioChange = (event) => {
    setLoading(true);

    setTimeout(() => {
      setSelectedValue(event.target.value);
      setLoading(false);
    }, 2500);
  };

  if (masterLoading) {
    return null;
  }

  return (
    <>
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
            <FormControlLabel
              value="2"
              control={<Radio />}
              label="Nova + Wind"
            />

            <FormControlLabel value="3" control={<Radio />} label="FTTC" />
            <FormControlLabel value="4" control={<Radio />} label="FTTH" />
            <FormControlLabel value="5" control={<Radio />} label="LLU/VPU" />
          </RadioGroup>
        </FormControl>
      </div>
      <div
        style={{
          width: "100%",
          height: "86rem",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {loading ? (
          <>
            <div className="loadingIndicator">
              <Spin className="loadingIndicator__spinner" size="medium" />
              <span className="loadingIndicator__message">Loading...</span>
            </div>
          </>
        ) : (
          <>
            <iframe
              src={`${
                config.apiPrefixForIframeDuringRemoteDev
              }/api/charts/proxy/dslam-outage?from=${dateRange[
                "startDate"
              ].format("YYYY-MM-DD")}&to=${dateRange["endDate"].format(
                "YYYY-MM-DD"
              )}&dataset=${selectedValue}`}
              title="Example Iframe"
              width="100%"
              height="860"
              style={{ border: "1 px solid #f8f8f8" }}
            >
              <p>Your browser does not support iframes.</p>
            </iframe>
          </>
        )}
      </div>
    </>
  );
};
