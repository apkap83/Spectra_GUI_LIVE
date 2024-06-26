import { useState, useEffect } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;
import { RemedyTickets } from "./RemedyTicketsMatrix.component";
import CircularIndeterminate from "../../common/CircularIndeterminate";
import locale from "antd/es/date-picker/locale/en_GB";
import { datesWithinRange } from "../../../lib/helpFunctions";
import { AAAOutagesTable } from "./AAAOutagesMatrix.component";
import { AAAOutagesCategorization } from "./AAAOutagesCategorization.component";

import { AAAOutageVSRemedyChart } from "./AAAOutageVSRemedyChart";
import { Boxes } from "./Boxes";
import Button from "@mui/material/Button";
import CachedIcon from "@mui/icons-material/Cached";
import { RemedyTicketsPerResolution } from "./RemedyTicketsPerResolution";
import { formatDateForIFrame } from "../../../lib/helpFunctions";

import { TopXSitesIncidentsAllTechs } from "./Charts/TopXSitesIncidentsAllTechsChart";
import { showSelectedDates } from "../../../lib/helpFunctions";
import { MapIframe } from "./MapIFrame";
import { PowerVSNTWOutagesWindNovaChart } from "./Charts/PowerVSNTWOutagesWindNovaChart";
import { PowerVSNTWOutagesOTEVodafoneChart } from "./Charts/PowerVSNTWOutagesOteVFChart";

import { useLocation } from "react-router-dom";

const rangePickerDateFormat = ["DD MMM YYYY"];

export const TripleAOutagesPlusRemedy = () => {
  const location = useLocation();
  // Parse query parameters
  const searchParams = new URLSearchParams(location.search);
  const startDateQueryParam = searchParams.get("startDate");
  const endDateQueryParam = searchParams.get("endDate");

  // Function to check if a string is a valid date using dayjs
  const isValidDate = (dateStr) => {
    return dayjs(dateStr).isValid();
  };

  // Check if the dates are valid
  const isStartDateValid = isValidDate(startDateQueryParam);
  const isEndDateValid = isValidDate(endDateQueryParam);

  const startDate = isStartDateValid
    ? dayjs(startDateQueryParam).startOf("day")
    : dayjs().startOf("day");

  const endDate = isEndDateValid
    ? dayjs(endDateQueryParam).startOf("day")
    : dayjs().startOf("day");

  const initialDates = {
    startDate,
    endDate,
  };

  const [showLeftDiv, setShowLeftDiv] = useState(false);
  const scrollThreshold = 150; // Set the scroll threshold in pixels
  const viewportThreshold = 150; // Set the viewport threshold in pixels

  const [value, setValue] = useState(null);
  const [dateRange, setDateRange] = useState(initialDates);
  const [loadingAAA, setLoadingAAA] = useState(false);
  const [loadingRemedyTickets, setLoadingRemedyTickets] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [netWorkOutagesAvgPercentage, setNetWorkOutagesAvgPercentage] =
    useState(0);
  const [windNovaOutagesOverTotalEvents, setWindNovaOutagesOverTotalEvents] =
    useState(0);

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const viewportBottom = scrollPosition + window.innerHeight;

    if (
      scrollPosition > scrollThreshold &&
      viewportBottom > viewportThreshold
    ) {
      setShowLeftDiv(true);
    } else {
      setShowLeftDiv(false);
    }
  };

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

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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

  const masterLoading = loadingAAA || loadingRemedyTickets; //||
  // !netWorkOutagesAvgPercentage ||
  // !windNovaOutagesOverTotalEvents;

  function disabledDate(current) {
    // Disable dates in the future
    return current && current > dayjs().startOf("day");
  }

  return (
    <>
      {showLeftDiv && (
        <div className="fixedDate">
          <p className="fixedDate__text">
            {showSelectedDates(dateRange, masterLoading)}
          </p>
        </div>
      )}

      <div
        className="pageWrapper"
        style={{
          // width: "calc(100vw - 98px)",
          marginLeft: "9.5rem",
          marginRight: "9.5rem",
        }}
      >
        <div className="aaa__header">
          <div className="aaa__header__title">
            AAA Outages + Remedy Alignment
          </div>

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

        <div
          style={{
            margin: "auto",
            width: "90vw",
          }}
        >
          <div
            style={{
              marginBottom: "8rem",
            }}
          >
            <Boxes
              key={`boxes-${refreshKey}`}
              dateRange={dateRange}
              loading={[loadingAAA, loadingAAA]}
              netWorkOutagesAvgPercentage={netWorkOutagesAvgPercentage}
              windNovaOutagesOverTotalEvents={windNovaOutagesOverTotalEvents}
            />
          </div>

          {/* <div>
            <AAAOutageVSRemedyChart
              key={`percentages-${refreshKey}`}
              dateRange={dateRange}
              setNetWorkOutagesAvgPercentage={setNetWorkOutagesAvgPercentage}
              setWindNovaOutagesOverTotalEvents={
                setWindNovaOutagesOverTotalEvents
              }
              masterLoading={masterLoading}
            />
          </div> */}

          <div
            style={{
              marginBottom: "8rem",
            }}
          >
            <PowerVSNTWOutagesWindNovaChart
              key={`powerVSNTWOutagesWindNovaChart-${refreshKey}`}
              dateRange={dateRange}
            />
          </div>

          <div
            style={{
              marginBottom: "8rem",
            }}
          >
            <PowerVSNTWOutagesOTEVodafoneChart
              key={`powerVSNTWOutagesOteVFChart-${refreshKey}`}
              dateRange={dateRange}
            />
          </div>

          <div
            style={{
              marginBottom: "8rem",
            }}
          >
            <AAAOutagesCategorization
              key={`outagesCateg-${refreshKey}`}
              dateRange={dateRange}
              setLoading={setLoadingAAA}
            />
          </div>

          {/* <div>
            <AAAOutagesTable
              key={`outages-${refreshKey}`}
              dateRange={dateRange}
              setLoading={setLoadingAAA}
            />
          </div> */}

          <div
            style={{
              marginBottom: "8rem",
            }}
          >
            <RemedyTickets
              key={`remedy-${refreshKey}`}
              dateRange={dateRange}
              setLoading={setLoadingRemedyTickets}
            />
          </div>

          <div
            style={{
              marginBottom: "8rem",
            }}
          >
            <RemedyTicketsPerResolution
              key={`remedyTicketsPerResolution-${refreshKey}`}
              dateRange={dateRange}
            />
          </div>

          <div
            style={{
              marginTop: "3rem",
            }}
          >
            <MapIframe dateRange={dateRange} masterLoading={masterLoading} />
          </div>
        </div>
      </div>
      <div style={{ marginBottom: "9rem" }}></div>
    </>
  );
};
