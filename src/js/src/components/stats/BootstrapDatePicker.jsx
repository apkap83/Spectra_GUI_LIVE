import React, { useState } from "react";
import { DatePicker } from "antd";
import locale from "antd/es/date-picker/locale/el_GR";

const { RangePicker } = DatePicker;

const BootstrapDatePicker = ({ setMyParentValue, dateRange }) => {
  const setParentValue = (val) => {
    setMyParentValue(val);
  };

  const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY"];

  return (
    <RangePicker
      className="w-50"
      format={dateFormatList}
      defaultValue={[dateRange.startDate, dateRange.endDate]}
      locale={locale}
      onCalendarChange={(val) => setParentValue(val)}
      onChange={(val) => setParentValue(val)}
    />
  );
};

export default BootstrapDatePicker;
