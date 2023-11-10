import { useState } from "react";
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

const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 500,
  },
});

const chart1AxisData = [
  "AAA Outages VS Remedy",
  "Percentage %",
  "Percentage %",
];

const chart2AxisData = [
  "AAA Outages VS Remedy (Wind+Nova)",
  "Date",
  "Percentage %",
];

function convertEpochToDate(epoch) {
  // Create a new Date object with the epoch timestamp
  var date = new Date(epoch);

  // Define options for the toLocaleDateString method
  var options = { day: "2-digit", month: "short", year: "numeric" };

  // Format the date
  return date.toLocaleDateString("en-US", options);
}

function printMe(str) {
  console.log(str);
}

function toogleDataSeries(e) {
  if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
    e.dataSeries.visible = false;
  } else {
    e.dataSeries.visible = true;
  }
  chart.render();
}

export const AAAOutagesVSRemedyCharts = ({ chartData }) => {
  const [top5Data, setTop5Data] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  let clearTimer = "";

  if (!chartData || chartData.length === 0) {
    return null;
  }

  const getDataFromDB = async (date) => {
    console.log("getDataFromDB", date);
    const myDate = new Date(date);

    const dateRange = {
      startDate: myDate,
      endDate: new Date(myDate.setDate(myDate.getDate() + 1)),
    };

    const { data: myData } = await httpService.post(apiEndPoint, {
      dateRange,
    });

    setTop5Data(myData);
  };

  const constructDataForChart1 = (myData1, myData2) => {
    let constructData1 = [];
    let constructData2 = [];

    if (myData1 && myData2) {
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
        type: "line",
        showInLegend: true,
        name: "AAA Outages VS Remedy (Nova, Wind, OTE, VF)",
        markerType: "square",
        // toolTipContent: "{x}: {y}",
        xValueType: "dateTime",
        dataPoints: constructData1,
      };
      const data2 = {
        type: "line",
        showInLegend: true,
        name: "AAA Outages VS Remedy (Wind, Nova)",
        showInLegend: true,
        // toolTipContent: "{x}: {y}",
        xValueType: "dateTime",
        dataPoints: constructData2,
      };
      return [data2, data1];
    }
  };

  const constructDataForChart2 = (myData1, myData2) => {
    let constructData1 = [];
    let constructData2 = [];

    if (myData1 && myData2) {
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
        indexLabel: "{y} %",
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
        showInLegend: true,
        indexLabel: "{y} %",
        name: "AAA Outages VS Remedy (Wind, Nova)",
        showInLegend: true,
        // toolTipContent: "{x}: {y}",
        xValueType: "dateTime",
        dataPoints: constructData2,
      };
      return [data2, data1];
    }
  };

  const getOptionsChart1 = (
    chartTitle,
    axisXTitle,
    axisYTitle,
    kpiItemNames
  ) => {
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
        crosshair: {
          enabled: true,
          snapToDataPoint: true,
        },
      },
      axisY: {
        title: axisYTitle,
        includeZero: true,
      },

      toolTip: {
        shared: true,
        contentFormatter: function (e) {
          clearTimeout(clearTimer);
          var content = "";

          for (var i = 0; i < e.entries.length; i++) {
            content +=
              e.entries[i].dataSeries.name +
              " " +
              "<strong>" +
              e.entries[i].dataPoint.y +
              " %</strong>";
            content += "<br/>";
          }

          clearTimer = setTimeout(() => {
            getDataFromDB(e.entries[0].dataPoint.x);
            setSelectedDate(e.entries[0].dataPoint.x);
          }, 1100);

          // return content;
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

    options["data"] = constructDataForChart1(chartData[0], chartData[1]);
    return options;
  };
  const getOptionsChart2 = (
    chartTitle,
    axisXTitle,
    axisYTitle,
    kpiItemNames
  ) => {
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
        crosshair: {
          enabled: true,
          snapToDataPoint: true,
        },
      },
      axisY: {
        title: axisYTitle,
        includeZero: true,
      },

      toolTip: {
        shared: true,
        contentFormatter: function (e) {
          clearTimeout(clearTimer);
          var content = "";

          for (var i = 0; i < e.entries.length; i++) {
            content +=
              e.entries[i].dataSeries.name +
              " " +
              "<strong>" +
              e.entries[i].dataPoint.y +
              " %</strong>";
            content += "<br/>";
          }

          clearTimer = setTimeout(() => {
            getDataFromDB(e.entries[0].dataPoint.x);
            setSelectedDate(e.entries[0].dataPoint.x);
          }, 1100);

          return null;
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

    options["data"] = constructDataForChart2(chartData[0], chartData[1]);
    return options;
  };
  // let chartOptionsChart1 = getOptionsChart1(...chart1AxisData);

  let chartOptionsChart2 = getOptionsChart2(...chart1AxisData);

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
          title={
            selectedDate && (
              <div>
                <h4>{convertEpochToDate(selectedDate)}</h4>
                <ol
                  style={{
                    // width: "15rem",
                    marginLeft: "auto",
                    margin: "0.5rem",
                    padding: "0.5rem",
                  }}
                >
                  {top5Data &&
                    top5Data.map((item) => {
                      return (
                        <h6>
                          <li>{item.topAffected}</li>
                        </h6>
                      );
                    })}
                </ol>
              </div>
            )
          }
          followCursor
          sx={{ typography: "body1", fontSize: "5.25rem" }}
        >
          <div></div>
          <CanvasJSChart options={chartOptionsChart2} />
        </Tooltip>
      </div>
    </div>
  );
};
