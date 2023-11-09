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
import { AAAOutagesVSRemedyChart } from "./Charts/AAAOutagesVSRemedyChart";

dayjs.extend(utc); // Extend dayjs with the utc plugin

const rangePickerDateFormat = ["DD MMM YYYY"];
const startDate = dayjs().utc().subtract(1, "month").startOf("day").hour(4);
const endDate = dayjs().utc().add(1, "day").startOf("day").hour(3);
const initialDates = {
  startDate,
  endDate,
};

export const TripleAOutagesPlusRemedy = () => {
  const [value, setValue] = useState(null);
  const [dateRange, setDateRange] = useState(initialDates);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    if (value && value.length == 2) {
      setDateRange({
        startDate: value[0].utc().startOf("day").hour(4),
        endDate: value[1].utc().add(1, "day").startOf("day").hour(3),
      });
    }
  }, [value]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        margin: "0 10rem",
        height: "100vh",
        marginBottom: "100rem",
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
            onChange={(dates, dateStrings) => {
              if (datesWithinRange(dates)) {
                setValue(dates);
              }
            }}
          />
          <CircularIndeterminate size={22} loading={loading} />
        </div>
      </div>

      <AAAOutagesTable dateRange={dateRange} setLoading={setLoading} />

      <RemedyTickets dateRange={dateRange} setLoading={setLoading} />

      <PercentagesTable dateRange={dateRange} setLoading={setLoading} />

      {/* <AAAOutagesVSRemedyChart chartData={percentagesTableData} /> */}
    </div>
  );
};
