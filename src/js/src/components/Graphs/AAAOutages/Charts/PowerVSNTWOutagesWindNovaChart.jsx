import { useEffect, useState } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import httpService from "../../../../services/httpService";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

import config from "../../../../config";
const apiEndPoint =
  config.apiPrefix + "/api/charts/getPowerVSNTWOutagesWindNova";

// Helper function to convert a date string to a date object
function parseDate(dateString) {
  const [day, month, year] = dateString.split("/");
  return new Date(year, month - 1, day);
}

const chartAxisData = [
  "Power vs Network Outages - Wind + Nova",
  "Percentage %",
  "Percentage %",
];

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

function sumNtwPowerUnknownFn(myData) {
  const summedByDate = {};

  myData.forEach((item, itemIndex) => {
    Object.entries(item.dateValuePair).forEach(([date, value]) => {
      if (!summedByDate[date]) {
        summedByDate[date] = 0;
      }
      summedByDate[date] += value;
    });
  });

  return summedByDate;
}

function ntwPercentageFn(myData) {
  const ntwPercentage = {};

  // Finding the item with OUTAGE_TYPE "Total"
  const ntwItem = myData.find((item) => item.OUTAGE_TYPE === "Network");

  // Finding the item with OUTAGE_TYPE "Total"
  const totalItem = myData.find((item) => item.OUTAGE_TYPE === "Total");

  myData.forEach((item, itemIndex) => {
    if (item.OUTAGE_TYPE !== "Network") {
      return;
    }

    Object.entries(item.dateValuePair).forEach(([date, value]) => {
      if (!ntwPercentage[date]) {
        ntwPercentage[date] = 0;
      }

      ntwPercentage[date] = (
        (parseFloat(ntwItem.dateValuePair[date]) /
          parseFloat(totalItem.dateValuePair[date])) *
        100
      ).toFixed(1);
    });
  });

  return ntwPercentage;
}

function powerPercentageFn(myData) {
  const powerPct = {};

  // Finding the item with OUTAGE_TYPE "Power"
  const powerItem = myData.find((item) => item.OUTAGE_TYPE === "Power");

  // Finding the item with OUTAGE_TYPE "Total"
  const totalItem = myData.find((item) => item.OUTAGE_TYPE === "Total");

  myData.forEach((item, itemIndex) => {
    if (item.OUTAGE_TYPE !== "Power") {
      return;
    }

    Object.entries(item.dateValuePair).forEach(([date, value]) => {
      if (!powerPct[date]) {
        powerPct[date] = 0;
      }

      powerPct[date] = (
        (parseFloat(powerItem.dateValuePair[date]) /
          parseFloat(totalItem.dateValuePair[date])) *
        100
      ).toFixed(1);
    });
  });

  return powerPct;
}

export const PowerVSNTWOutagesWindNovaChart = ({ dateRange }) => {
  const [chartData, setChartData] = useState([]);

  // const numberOfDaysForChart =
  //   chartData &&
  //   chartData.length > 0 &&
  //   Object.keys(chartData[0]["dateValuePair"]).length;

  useEffect(() => {
    let { startDate, endDate } = dateRange;

    startDate = startDate;
    endDate = endDate.add(1, "day");

    const getDataFromDB = async () => {
      const { data: myData } = await httpService.post(apiEndPoint, {
        dateRange: { startDate, endDate },
      });

      myData.push({
        OUTAGE_TYPE: "Total",
        dateValuePair: sumNtwPowerUnknownFn(myData),
        id: Math.random(),
      });

      myData.push({
        OUTAGE_TYPE: "NTW Percentage",
        dateValuePair: ntwPercentageFn(myData),
        id: Math.random(),
      });

      myData.push({
        OUTAGE_TYPE: "Power Percentage",
        dateValuePair: powerPercentageFn(myData),
        id: Math.random(),
      });

      setChartData(myData);
    };

    getDataFromDB();
  }, []);

  if (!chartData || chartData.length === 0) {
    return null;
  }

  const numberOfDaysForChart =
    chartData &&
    chartData.length > 0 &&
    Object.keys(chartData[0]["dateValuePair"]).length;

  const constructDataForChartWith2Sources = (chartData) => {
    // Finding the item with OUTAGE_TYPE "NTW Percentage"
    const nwPercentage = chartData.find(
      (item) => item.OUTAGE_TYPE === "NTW Percentage"
    );

    // Finding the item with OUTAGE_TYPE "Power Percentage"
    const powerPercentage = chartData.find(
      (item) => item.OUTAGE_TYPE === "Power Percentage"
    );

    let constructData1 = Object.entries(nwPercentage.dateValuePair).map(
      ([date, value]) => ({
        x: new Date(date.split("/").reverse().join("-")),
        y: parseFloat(value),
      })
    );

    // Sorting the array by date
    constructData1.sort((a, b) => a.x - b.x);

    let constructData2 = Object.entries(powerPercentage.dateValuePair).map(
      ([date, value]) => ({
        x: new Date(date.split("/").reverse().join("-")),
        y: parseFloat(value),
      })
    );

    // Sorting the array by date
    constructData2.sort((a, b) => a.x - b.x);

    const data1 = {
      type: "column",
      indexLabel: numberOfDaysForChart < 60 ? "{y} %" : null,
      indexLabelFontSize: numberOfDaysForChart > 20 ? 10 : 12.5,
      indexLabelFontColor: "#3f1916",
      showInLegend: true,
      name: "Network",
      markerType: "square",
      xValueType: "dateTime",
      dataPoints: constructData1,
      color: "#37A7D9",
    };

    const data2 = {
      type: "column",
      indexLabel: numberOfDaysForChart < 60 ? "{y} %" : null,
      indexLabelFontSize: numberOfDaysForChart > 20 ? 10 : 12.5,
      indexLabelFontColor: "#3f1916",
      showInLegend: true,
      name: "Power",
      showInLegend: true,
      xValueType: "dateTime",
      color: "#FCBD7A",
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
        interval: numberOfDaysForChart === 1 ? 0 : 1,
        intervalType: numberOfDaysForChart < 40 ? "day" : "month",
      },
      axisY: {
        title: axisYTitle,
        includeZero: true,
      },

      // toolTip: {
      //   shared: true,
      //   contentFormatter: function (e) {
      //     var content =
      //       e.entries && e.entries.length > 0
      //         ? "<strong>" +
      //           formatDateToDDMonYear(new Date(e.entries[1].dataPoint["x"])) +
      //           "</strong><br/>" +
      //           '<span style="color: #6D78AD">' +
      //           e.entries[0].dataSeries.name +
      //           ": " +
      //           e.entries[0].dataPoint.y +
      //           "</span> <br/>" +
      //           '<span style="color: #51CDA0">' +
      //           e.entries[1].dataSeries.name +
      //           ": " +
      //           e.entries[1].dataPoint.y +
      //           "</span>"
      //         : null;

      //     setSelectedDate(e.entries[0].dataPoint.x);
      //     return numberOfDaysForChart > 33 ? content : null;
      //   },
      // },
      legend: {
        cursor: "pointer",
        verticalAlign: "bottom",
        horizontalAlign: "center",
        dockInsidePlotArea: false,
        itemclick: toogleDataSeries,
      },
    };

    options["data"] = constructDataForChartWith2Sources(chartData);
    return options;
  };

  let chartOptionsChart = getOptionsForChart(...chartAxisData);

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
        <div>
          <CanvasJSChart options={chartOptionsChart} />
        </div>
      </div>
    </div>
  );
};
