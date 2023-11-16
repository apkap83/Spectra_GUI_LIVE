import { useEffect, useState } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import httpService from "../../../../services/httpService";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

import config from "../../../../config.json";
import { date } from "yup";
const apiEndPoint = config.apiPrefix + "/api/charts/getTopXSitesAllTechs";

// Helper function to convert a date string to a date object
function parseDate(dateString) {
  const [day, month, year] = dateString.split("/");
  return new Date(year, month - 1, day);
}

const chartAxisData = ["Top 30 Sites AAA Outages", "DSLAM Name", "Incidents"];

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

export const TopXSitesIncidentsAllTechs = ({ dateRange }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    let { startDate, endDate } = dateRange;

    startDate = startDate;
    endDate = endDate.add(1, "day");

    const getDataFromDB = async () => {
      const { data: myData } = await httpService.post(apiEndPoint, {
        dateRange: { startDate, endDate },
      });

      setChartData(myData);
    };

    getDataFromDB();
  }, []);

  if (!chartData || chartData.length === 0) {
    return null;
  }

  const constructDataForChart = (myData) => {
    // Sort by 'outages' in descending order
    const firstSort = _.orderBy(
      myData,
      (item) => parseInt(item.outages),
      "asc"
    );

    // const sortedData = [firstSort[0], firstSort[1], firstSort[2], firstSort[3]];
    const sortedData = [...firstSort];

    const constructData = [];
    for (let i = 0; i < sortedData.length; i++) {
      constructData.push({
        label: sortedData[i].dslam,
        y: parseFloat(sortedData[i].outages),
      });
    }

    const data = {
      type: "bar",
      name: "Outages",
      axisYType: "secondary",
      color: "#014D65",
      dataPoints: constructData,
    };

    return [data];
  };

  const getOptionsForChart = (
    chartTitle,
    axisXTitle,
    axisYTitle,
    kpiItemNames
  ) => {
    const options = {
      height: "400",
      // width: "1200",
      animationEnabled: true,
      exportEnabled: true,
      zoomEnabled: true,
      theme: "light2", // "light1", "dark1", "dark2"
      title: {
        text: chartTitle,
        fontSize: 25,
      },
      axisX: {
        interval: 1,
        labelFontSize: 10,
      },
      axisY: {
        interlacedColor: "rgba(1,77,101,.2)",
        gridColor: "rgba(1,77,101,.1)",
        title: "Number of Companies",
      },

      toolTip: {
        shared: true,
      },
      legend: {
        cursor: "pointer",
        verticalAlign: "bottom",
        horizontalAlign: "center",
        dockInsidePlotArea: false,
        itemclick: toogleDataSeries,
      },
    };

    options["data"] = constructDataForChart(chartData);
    return options;
  };

  let chartOptionsChart = getOptionsForChart(...chartAxisData);

  return (
    <div style={{ width: "100%", margin: "1.3rem 0" }}>
      <CanvasJSChart options={chartOptionsChart} />
    </div>
  );
};
