import React, { Component } from "react";
import equal from "fast-deep-equal";
import httpService from "../../services/httpService";
import randomColor from "randomcolor";
import { Spin } from "antd";
import conf from "./config.json";
import envConf from "../../config.json";

import CanvasJSReact from "./assets/canvasjs.react";
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const apiURL = envConf.apiPrefix + conf.apiURL;

class RequestsPerMethodLineCharts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetching: false,
      chartsData: [],
      myDateRange: [],
    };
  }

  getData = async () => {};

  componentDidMount() {
    this.updateCharts();
  }

  componentDidUpdate(prevProps) {
    if (!equal(this.props.dateRange, prevProps.dateRange)) {
      // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
      // this.setState({ myDateRange: this.props.dateRange });
      this.updateCharts();
    }
  }

  async updateCharts() {
    this.setState({ isFetching: true });
    const { data: myData } = await httpService.post(
      apiURL + "/num_of_requests_per_method",
      {
        dateRange: this.props.dateRange,
      }
    );
    setTimeout(() => {
      this.setState({
        isFetching: false,
        chartsData: myData,
      });
    }, 200);
  }

  getOptions = (chartTitle, axisXTitle, axisYTitle, kpiItemNames) => {
    const options = {
      animationEnabled: true,
      exportEnabled: true,
      zoomEnabled: true,
      theme: "light2", // "light1", "dark1", "dark2"
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

    const dataCalculation = [];
    kpiItemNames.map((kpiName) => {
      dataCalculation.push(
        this.constructDataForChart(this.state.chartsData, kpiName)
      );
      return 1;
    });

    options["data"] = dataCalculation;
    return options;
  };

  constructDataForChart = (myData, kpiItemName) => {
    let constructData = [];
    myData.map((item) => {
      constructData.push({
        x: Date.parse(item.Date),
        y: item[kpiItemName],
      });
      return 1;
    });
    const data = {
      type: "line",
      name: kpiItemName,
      showInLegend: true,
      toolTipContent: "{x}: {y}",
      xValueType: "dateTime",
      lineColor: randomColor(),
      // dataPoints: this.state.chartsData,

      dataPoints: constructData,
    };

    return data;
  };

  getAllCharts() {
    return (
      <div style={{ width: "100%" }}>
        <div style={{ marginTop: "1.3rem", marginBottom: "3rem" }}>
          <CanvasJSChart
            title="Hello"
            data={this.state.dateRange}
            options={this.getOptions(
              ...conf.requestsPerMethodCharts.nluActivePos
            )}
          />
        </div>
        <div style={{ marginBottom: "3rem" }}>
          <CanvasJSChart
            title="Hello"
            options={this.getOptions(
              ...conf.requestsPerMethodCharts.nluActiveNeg
            )}
          />
        </div>
        <div style={{ marginBottom: "3rem" }}>
          <CanvasJSChart
            title="Hello"
            options={this.getOptions(
              ...conf.requestsPerMethodCharts.nluActivePosVoice
            )}
          />
        </div>
        <div style={{ marginBottom: "3rem" }}>
          <CanvasJSChart
            title="Hello"
            options={this.getOptions(
              ...conf.requestsPerMethodCharts.nluActivePosData
            )}
          />
        </div>
        <div style={{ marginBottom: "3rem" }}>
          <CanvasJSChart
            title="Hello"
            options={this.getOptions(
              ...conf.requestsPerMethodCharts.nluActivePosIPTV
            )}
          />
        </div>
        <div style={{ marginBottom: "3rem" }}>
          <CanvasJSChart
            title="Hello"
            options={this.getOptions(
              ...conf.requestsPerMethodCharts.cdr_db_neg
            )}
          />
        </div>

        <div style={{ marginBottom: "3rem" }}>
          <CanvasJSChart
            title="Hello"
            options={this.getOptions(
              ...conf.requestsPerMethodCharts.cdr_db_pos
            )}
          />
        </div>
        <div style={{ marginBottom: "3rem" }}>
          <CanvasJSChart
            title="Hello"
            options={this.getOptions(...conf.requestsPerMethodCharts.adHocPos)}
          />
        </div>
      </div>
    );
  }

  render() {
    if (this.state.isFetching) {
      return (
        <div className="vh-100 d-flex flex-column justify-content-center row-hl">
          <Spin
            // indicator={getIndicatorIcon}
            size="large"
          ></Spin>
          <span className="p-3 text-center">Please wait...</span>
        </div>
      );
    }
    return this.getAllCharts();
  }
}

export default RequestsPerMethodLineCharts;
