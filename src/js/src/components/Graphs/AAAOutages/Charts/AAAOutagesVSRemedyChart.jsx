import React, { useState, useEffect } from "react";
import equal from "fast-deep-equal";
import httpService from "../../../../services/httpService";
import { Spin } from "antd";

import CanvasJSReact from "../../../../lib/assets/canvasjs.react";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

// Helper function to convert a date string to a date object
function parseDate(dateString) {
  const [day, month, year] = dateString.split("/");
  return new Date(year, month - 1, day);
}

const chart1AxisData = [
  "AAA Outages vs Remedy (Nova, Wind, OTE, VF)",
  "Percentage %",
  "Date",
];

const chart2AxisData = [
  "AAA Outages vs Remedy (Wind+Nova)",
  "Percentage %",
  "Date",
];

const constructDataForChart = (myData) => {
  let constructData = [];

  if (myData) {
    const { dateValuePair } = myData;

    // Sort the keys
    const sortedKeys = Object.keys(dateValuePair).sort(
      (a, b) => parseDate(a) - parseDate(b)
    );

    // Create a new sorted object
    const sortedData = {};
    for (const key of sortedKeys) {
      sortedData[key] = dateValuePair[key];
    }

    const dataWithEpochKeys = Object.keys(sortedData).reduce(
      (accumulator, currentKey) => {
        // Split the current key into parts
        const [day, month, year] = currentKey.split("/");
        const dateString = `${year}-${month}-${day}`;
        accumulator[dateString] = parseFloat(sortedData[currentKey]);
        return accumulator;
      },
      {}
    );

    for (const item in dataWithEpochKeys) {
      constructData.push({
        x: Date.parse(item),
        y: dataWithEpochKeys[item],
      });
    }

    const data = {
      type: "line",
      name: "My Name",
      // showInLegend: true,
      toolTipContent: "{x}: {y}",
      xValueType: "dateTime",
      showLegend: true,
      dataPoints: constructData,
    };
    return [data];
  }
};

export const AAAOutagesVSRemedyCharts = ({ chartData }) => {
  console.log("chartData", chartData);
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
      theme: "light1", // "light1", "dark1", "dark2"
      title: {
        text: chartTitle,
      },
      axisY: {
        title: axisXTitle,
        includeZero: true,
        suffix: "",
      },
      axisX: {
        valueFormatString: "DD MMM",
        title: axisYTitle,
        // prefix: "W",
        interval: 1,
        crosshair: {
          enabled: true,
          snapToDataPoint: true,
        },
      },
    };

    options["data"] = constructDataForChart(chartData[0]);
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
      theme: "light1", // "light1", "dark1", "dark2"
      title: {
        text: chartTitle,
      },
      axisY: {
        title: axisXTitle,
        includeZero: true,
        suffix: "",
      },
      axisX: {
        title: axisYTitle,
        // prefix: "W",
        interval: 1,
      },
    };

    options["data"] = constructDataForChart(chartData[1]);
    return options;
  };

  let chartOptionsChart1 = getOptionsChart1(...chart1AxisData);

  let chartOptionsChart2 = getOptionsChart2(...chart2AxisData);

  if (!chartData || chartData.length === 0) {
    return null;
  }
  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          marginTop: "5rem",
          marginBottom: "20rem",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        <CanvasJSChart options={chartOptionsChart1} />
        <CanvasJSChart options={chartOptionsChart2} />
      </div>
    </div>
  );
};
