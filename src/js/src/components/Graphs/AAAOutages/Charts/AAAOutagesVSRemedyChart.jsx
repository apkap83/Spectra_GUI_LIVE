import { useEffect, useState } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import httpService from "../../../../services/httpService";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

import config from "../../../../config.json";
const apiEndPoint =
  config.apiPrefix + "/api/charts/aaa_outages_top_affected_areas";

// Helper function to convert a date string to a date object
function parseDate(dateString) {
  const [day, month, year] = dateString.split("/");
  return new Date(year, month - 1, day);
}

const chartAxisData = ["AAA Outages VS Remedy", "Percentage %", "Percentage %"];

function convertEpochToDate(epoch) {
  try {
    // Create a new Date object with the epoch timestamp
    var date = new Date(epoch);

    // Define options for the toLocaleDateString method
    var options = { day: "2-digit", month: "short", year: "numeric" };

    // Format the date
    return date.toLocaleDateString("en-US", options);
  } catch (error) {
    return epoch;
  }
}

function isValidEpoch(timestamp) {
  // Check if the timestamp is a number and not NaN
  if (typeof timestamp !== "number" || isNaN(timestamp) | (timestamp == null)) {
    return false;
  }

  // Create a Date object using the timestamp
  const date = new Date(timestamp);

  // Check if the date is valid
  return !isNaN(date.getTime());
}

function toogleDataSeries(e) {
  if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
    e.dataSeries.visible = false;
  } else {
    e.dataSeries.visible = true;
  }
  chart.render();
}
const getDataFromDBOnHover = async (date) => {
  const myDate = new Date(date);

  let startDate = new Date(myDate.getTime());
  let endDate = new Date(myDate.getTime());

  startDate.setHours(0, 0, 0, 0);

  endDate.setHours(0, 0, 0, 0);
  endDate.setDate(endDate.getDate() + 1);

  const dateRange = {
    startDate,
    endDate,
  };

  const { data: myData } = await httpService.post(apiEndPoint, {
    dateRange,
  });

  return myData;
};

function formatDateToDDMonYear(date) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

export const AAAOutagesVSRemedyCharts = ({ chartData }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [top5Data, setTop5Data] = useState([]);

  const numberOfDaysForChart =
    chartData &&
    chartData.length > 0 &&
    Object.keys(chartData[0]["dateValuePair"]).length;
  console.log("numberOfDaysForChart", numberOfDaysForChart);

  useEffect(() => {
    setTop5Data("Loading...");
    const getData = setTimeout(async () => {
      const myTop5Data = await getDataFromDBOnHover(selectedDate);
      setTop5Data(myTop5Data);
    }, 300);

    return () => clearTimeout(getData);
  }, [selectedDate]);

  if (!chartData || chartData.length === 0) {
    return null;
  }

  const constructDataForChartWith2Sources = (myData1, myData2) => {
    let constructData1 = [];
    let constructData2 = [];

    const { dateValuePair: dateValuePair1 } = myData1;
    const { dateValuePair: dateValuePair2 } = myData2;

    // Sort the keys
    const sortedKeys1 = Object.keys(dateValuePair1).sort(
      (a, b) => parseDate(a) - parseDate(b)
    );

    const sortedKeys2 = Object.keys(dateValuePair2).sort(
      (a, b) => parseDate(a) - parseDate(b)
    );

    // Create a new sorted object
    const sortedData1 = {};
    for (const key of sortedKeys1) {
      sortedData1[key] = dateValuePair1[key];
    }

    // Create a new sorted object
    const sortedData2 = {};
    for (const key of sortedKeys2) {
      sortedData2[key] = dateValuePair2[key];
    }

    const dataWithEpochKeys1 = Object.keys(sortedData1).reduce(
      (accumulator, currentKey) => {
        // Split the current key into parts
        const [day, month, year] = currentKey.split("/");
        const dateObject = new Date(year, month - 1, day);
        accumulator[dateObject] = parseFloat(sortedData1[currentKey]);
        return accumulator;
      },
      {}
    );

    const dataWithEpochKeys2 = Object.keys(sortedData2).reduce(
      (accumulator, currentKey) => {
        // Split the current key into parts
        const [day, month, year] = currentKey.split("/");
        const dateObject = new Date(year, month - 1, day);
        accumulator[dateObject] = parseFloat(sortedData2[currentKey]);
        return accumulator;
      },
      {}
    );

    for (const item in dataWithEpochKeys1) {
      constructData1.push({
        x: Date.parse(item),
        y: dataWithEpochKeys1[item],
      });
    }

    for (const item in dataWithEpochKeys2) {
      constructData2.push({
        x: Date.parse(item),
        y: dataWithEpochKeys2[item],
      });
    }

    const data1 = {
      type: "column",
      indexLabel: numberOfDaysForChart < 33 ? "{y} %" : null,
      indexLabelFontColor: "#5A5757",
      showInLegend: true,
      name: "AAA Outages VS Remedy (OTE, VF, Wind, Nova)",
      markerType: "square",
      // toolTipContent: "{x}: {y}",
      xValueType: "dateTime",
      dataPoints: constructData1,
    };
    const data2 = {
      type: "column",
      indexLabel: numberOfDaysForChart < 33 ? "{y} %" : null,
      showInLegend: true,
      name: "AAA Outages VS Remedy (Wind, Nova)",
      showInLegend: true,
      // toolTipContent: "{x}: {y}",
      xValueType: "dateTime",
      dataPoints: constructData2,
    };
    return [data2, data1];
  };

  const getOptionsForChart = (
    chartTitle,
    axisXTitle,
    axisYTitle,
    kpiItemNames
  ) => {
    let debounceTimer = "";
    const options = {
      animationEnabled: true,
      exportEnabled: true,
      zoomEnabled: true,
      theme: "light2", // "light1", "dark1", "dark2"
      title: {
        text: chartTitle,
      },
      axisX: {
        valueFormatString: "DD MMM",
      },
      axisY: {
        title: axisYTitle,
        includeZero: true,
      },

      toolTip: {
        shared: true,
        contentFormatter: function (e) {
          var content =
            e.entries && e.entries.length > 0
              ? "<strong>" +
                formatDateToDDMonYear(new Date(e.entries[1].dataPoint["x"])) +
                "</strong><br/>" +
                '<span style="color: #6D78AD">' +
                e.entries[0].dataSeries.name +
                ": " +
                e.entries[0].dataPoint.y +
                "</span> <br/>" +
                '<span style="color: #51CDA0">' +
                e.entries[1].dataSeries.name +
                ": " +
                e.entries[1].dataPoint.y +
                "</span>"
              : null;

          setSelectedDate(e.entries[0].dataPoint.x);
          return numberOfDaysForChart > 33 ? content : null;
        },
      },
      legend: {
        cursor: "pointer",
        verticalAlign: "bottom",
        horizontalAlign: "center",
        dockInsidePlotArea: false,
        itemclick: toogleDataSeries,
      },
    };

    options["data"] = constructDataForChartWith2Sources(
      chartData[0],
      chartData[1]
    );
    return options;
  };

  let chartOptionsChart2 = getOptionsForChart(...chartAxisData);

  const ToolTipComponent = () => {
    if (!selectedDate) {
      return <h4>Loading...</h4>;
    }

    return (
      selectedDate && (
        <div>
          <h4>{convertEpochToDate(selectedDate)}</h4>

          {top5Data && Array.isArray(top5Data) ? (
            <ol
              style={{
                // width: "15rem",
                marginLeft: "auto",
                margin: "0.5rem",
                padding: "0.5rem",
              }}
            >
              {top5Data.map((item, id) => {
                return (
                  <h5 key={id}>
                    <li>{item.topAffected}</li>
                  </h5>
                );
              })}
            </ol>
          ) : (
            <h5 style={{ textAlign: "center" }}>{top5Data}</h5>
          )}
        </div>
      )
    );
  };

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          marginTop: "5rem",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "70rem",
            top: "0rem",
            zIndex: "10",
            marginLeft: "auto",
            backgroundColor: "#4a4a4a",
            fontSize: "0.7rem",
            textAlign: "left",
            marginBottom: "3rem",
            color: "#fff",
          }}
        ></div>

        <Tooltip
          title={<ToolTipComponent />}
          followCursor
          sx={{ typography: "body1", fontSize: "5.25rem" }}
        >
          <div>
            <CanvasJSChart options={chartOptionsChart2} />
          </div>
        </Tooltip>
      </div>
    </div>
  );
};
