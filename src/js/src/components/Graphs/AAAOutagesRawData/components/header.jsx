import { DatePicker } from "antd";
const { RangePicker } = DatePicker;
import { datesWithinRange } from "../../../../lib/helpFunctions";
import CircularIndeterminate from "../../../common/CircularIndeterminate";
import { ReloadInterval } from "./reloadInterval";

import { disabledDate } from "../lib/utils";
import Button from "@mui/material/Button";
import CachedIcon from "@mui/icons-material/Cached";
import locale from "antd/es/date-picker/locale/en_GB";
const rangePickerDateFormat = ["DD MMM YYYY"];

export const Header = ({
  masterLoading,
  dateRange,
  setValue,
  handleRefreshClick,
  defaultRefreshIntervalTime,
  refreshIntervalTime,
  setRefreshIntervalTime,
  refreshIntervalInputRef,
}) => {
  return (
    <div className="aaa__header">
      <div className="aaa__header__title">AAA Outages - Raw Data</div>

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
            <>
              <Button
                className="aaa__header__reloadButton"
                variant="outlined"
                onClick={handleRefreshClick}
              >
                <CachedIcon fontSize="medium" />
              </Button>
            </>
          )}
        </div>
        <ReloadInterval
          defaultRefreshIntervalTime={defaultRefreshIntervalTime}
          refreshIntervalTime={refreshIntervalTime}
          setRefreshIntervalTime={setRefreshIntervalTime}
          refreshIntervalInputRef={refreshIntervalInputRef}
        />
      </div>
    </div>
  );
};
