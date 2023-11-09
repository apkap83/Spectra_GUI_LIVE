import CanvasJSReact from "@canvasjs/react-charts";
//var CanvasJSReact = require('@canvasjs/react-charts');

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

// Helper function to convert a date string to a date object
function parseDate(dateString) {
  const [day, month, year] = dateString.split("/");
  return new Date(year, month - 1, day);
}

const chart1AxisData = [
  "AAA Outages vs Remedy",
  "Percentage %",
  "Percentage %",
];

const chart2AxisData = [
  "AAA Outages vs Remedy (Wind+Nova)",
  "Date",
  "Percentage %",
];

const constructDataForChart = (myData1, myData2) => {
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
      name: "AAA Outages vs Remedy (Wind+Nova)",
      showInLegend: true,
      // toolTipContent: "{x}: {y}",
      xValueType: "dateTime",
      dataPoints: constructData2,
    };
    return [data2, data1];
  }
};

function toogleDataSeries(e) {
  if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
    e.dataSeries.visible = false;
  } else {
    e.dataSeries.visible = true;
  }
  chart.render();
}

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
      },
      legend: {
        cursor: "pointer",
        verticalAlign: "bottom",
        horizontalAlign: "center",
        dockInsidePlotArea: false,
        itemclick: toogleDataSeries,
      },
    };

    options["data"] = constructDataForChart(chartData[0], chartData[1]);
    console.log('options["data"]', options["data"]);
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

  // let chartOptionsChart2 = getOptionsChart2(...chart2AxisData);

  if (!chartData || chartData.length === 0) {
    return null;
  }
  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          marginTop: "5rem",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        <CanvasJSChart options={chartOptionsChart1} />
        {/* <CanvasJSChart options={chartOptionsChart2} /> */}
      </div>
    </div>
  );
};
