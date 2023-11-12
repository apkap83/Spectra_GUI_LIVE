import React, { useState, useEffect } from "react";
import RequestsPerMethodLineCharts from "./NovaRequestsPerMethodLineCharts";
import dayjs from "dayjs";
import { DatePicker } from "antd";
import locale from "antd/es/date-picker/locale/en_GB";
import { ReactComponent as NovaLogo } from "../../assets/novaLogo.svg";

const { RangePicker } = DatePicker;

const startDate = dayjs().subtract(1, "month").startOf("day");
const endDate = dayjs().startOf("day");

export default function Stats() {
  const initialDates = {
    startDate,
    endDate,
  };

  const [value, setValue] = useState(null);
  const [dateRange, setDateRange] = useState(initialDates);

  useEffect(() => {
    if (value && value.length == 2) {
      setDateRange({
        startDate: value[0].startOf("day"),
        endDate: value[1].startOf("day"),
      });
    }
  }, [value]);

  const dateFormat = ["DD/MM/YYYY"];
  return (
    <div className="container">
      <div className="d-flex flex-column justify-content-center align-items-center">
        <NovaLogo className="mt-3" style={{ width: "200px" }} />
        <span>Spectra</span>
        <RangePicker
          className="w-50"
          locale={locale}
          format={dateFormat}
          defaultValue={[dateRange.startDate, dateRange.endDate]}
          style={{
            fontSize: "15px",
            fontWeight: "700",
            width: "100%",
            margin: "20px",
          }}
          onChange={(val) => setValue(val)}
        />

        <RequestsPerMethodLineCharts dateRange={dateRange} />
      </div>
    </div>
  );
}
