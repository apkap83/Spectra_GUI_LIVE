import { useState, useEffect } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
const { RangePicker } = DatePicker;
import { RemedyTickets } from "./RemedyTicketsMatrix.component";
import CircularIndeterminate from "../../common/CircularIndeterminate";
import locale from "antd/es/date-picker/locale/en_GB";
import { datesWithinRange } from "../../../lib/helpFunctions";
import { AAAOutagesTable } from "./AAAOutagesMatrix.component";
import { PercentagesTable } from "./PercentagesMatrix";

import Button from "@mui/material/Button";
import CachedIcon from "@mui/icons-material/Cached";

dayjs.extend(utc); // Extend dayjs with the utc plugin

const rangePickerDateFormat = ["DD MMM YYYY"];
const startDate = dayjs().utc().subtract(1, "week").startOf("day");
const endDate = dayjs().utc().startOf("day");
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
  }, [value]);

  const handleRefreshClick = () => {
    // Check if value is set, otherwise use the initial date range
    const newValue = value
      ? [...value]
      : [dateRange.startDate, dateRange.endDate];

    setValue(newValue);

    setRefreshKey((oldKey) => oldKey + 1); // Increment the key to force rerender
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        margin: "0 10rem",
        height: "100vh",
        marginBottom: "85rem",
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
          />
          <div className="aaa__header__reload">
            {loadingAAA || loadingRemedyTickets ? (
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
      <PercentagesTable
        key={`percentages-${refreshKey}`}
        dateRange={dateRange}
      />
    </div>
  );
};
