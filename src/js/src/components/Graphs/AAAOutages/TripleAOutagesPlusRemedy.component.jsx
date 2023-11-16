import { useState, useEffect } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;
import { RemedyTickets } from "./RemedyTicketsMatrix.component";
import CircularIndeterminate from "../../common/CircularIndeterminate";
import locale from "antd/es/date-picker/locale/en_GB";
import { datesWithinRange } from "../../../lib/helpFunctions";
import { AAAOutagesTable } from "./AAAOutagesMatrix.component";
import { PercentagesTable } from "./PercentagesMatrix";
import { Boxes } from "./Boxes";
import Button from "@mui/material/Button";
import CachedIcon from "@mui/icons-material/Cached";
import { RemedyTicketsPerResolution } from "./RemedyTicketsPerResolution";
import { formatDateForIFrame } from "../../../lib/helpFunctions";
import config from "../../../config.json";

const rangePickerDateFormat = ["DD MMM YYYY"];
const startDate = dayjs().subtract(1, "week").startOf("day");
const endDate = dayjs().startOf("day");
const initialDates = {
  startDate,
  endDate,
};

export const TripleAOutagesPlusRemedy = () => {
  const [value, setValue] = useState(null);
  const [dateRange, setDateRange] = useState(initialDates);
  const [loadingAAA, setLoadingAAA] = useState(false);
  const [loadingRemedyTickets, setLoadingRemedyTickets] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [netWorkOutagesAvgPercentage, setNetWorkOutagesAvgPercentage] =
    useState(0);
  const [windNovaOutagesOverTotalEvents, setWindNovaOutagesOverTotalEvents] =
    useState(0);

  useEffect(() => {
    if (value && value.length == 2) {
      setDateRange({
        startDate: value[0],
        endDate: value[1],
      });
    }
    setLoadingAAA(true);
    setLoadingRemedyTickets(true);
    setRefreshKey((oldKey) => oldKey + 1); // Increment the key to force rerender
    setNetWorkOutagesAvgPercentage(0);
    setWindNovaOutagesOverTotalEvents(0);
  }, [value]);

  const handleRefreshClick = () => {
    // Check if value is set, otherwise use the initial date range
    const newValue = value
      ? [...value]
      : [dateRange.startDate, dateRange.endDate];

    setValue(newValue);

    setNetWorkOutagesAvgPercentage(0);
    setWindNovaOutagesOverTotalEvents(0);

    setRefreshKey((oldKey) => oldKey + 1); // Increment the key to force rerender
  };

  const masterLoading =
    loadingAAA ||
    loadingRemedyTickets ||
    !netWorkOutagesAvgPercentage ||
    !windNovaOutagesOverTotalEvents;

  function disabledDate(current) {
    // Disable dates in the future
    return current && current > dayjs().startOf("day");
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        margin: "0 10rem",
      }}
    >
      <div className="aaa__header">
        <div className="aaa__header__title">AAA Outages + Remedy Alignment</div>

        <div className="aaa__header__datePicker">
          <RangePicker
            locale={locale}
            format={rangePickerDateFormat}
            defaultValue={[dateRange.startDate, dateRange.endDate]}
            className="aaa__header__datePicker--item"
            onChange={(dates) => {
              if (datesWithinRange(dates)) {
                setValue(dates);
              }
            }}
            disabledDate={disabledDate}
          />
          <div className="aaa__header__reload">
            {masterLoading ? (
              <CircularIndeterminate size={25} loading={true} />
            ) : (
              <Button
                className="aaa__header__reloadButton"
                variant="outlined"
                onClick={handleRefreshClick}
              >
                <CachedIcon fontSize="medium" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <Boxes
        key={`boxes-${refreshKey}`}
        dateRange={dateRange}
        loading={[loadingAAA, loadingAAA]}
        netWorkOutagesAvgPercentage={netWorkOutagesAvgPercentage}
        windNovaOutagesOverTotalEvents={windNovaOutagesOverTotalEvents}
      />

      <PercentagesTable
        key={`percentages-${refreshKey}`}
        dateRange={dateRange}
        setNetWorkOutagesAvgPercentage={setNetWorkOutagesAvgPercentage}
        setWindNovaOutagesOverTotalEvents={setWindNovaOutagesOverTotalEvents}
      />
      <AAAOutagesTable
        key={`outages-${refreshKey}`}
        dateRange={dateRange}
        setLoading={setLoadingAAA}
      />

      <RemedyTickets
        key={`remedy-${refreshKey}`}
        dateRange={dateRange}
        setLoading={setLoadingRemedyTickets}
      />

      <RemedyTicketsPerResolution
        key={`remedyTicketsPerResolution-${refreshKey}`}
        dateRange={dateRange}
      />

      <div
        style={{
          marginTop: "3rem",
        }}
      >
        <h3>
          Map Data: {dateRange["startDate"].format("DD MMM YYYY")} -{" "}
          {dateRange["endDate"].format("DD MMM YYYY")}
        </h3>
        <iframe
          src={`${
            config.apiPrefix
          }/api/charts/proxy/dslam-outage?from=${dateRange["startDate"].format(
            "YYYY-MM-DD"
          )}&to=${dateRange["endDate"].format("YYYY-MM-DD")}`}
          title="Example Iframe"
          width="100%"
          height="860"
          style={{ border: "1 px solid #f8f8f8" }}
        >
          <p>Your browser does not support iframes.</p>
        </iframe>
      </div>
    </div>
  );
};
