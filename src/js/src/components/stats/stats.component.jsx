import React, { Component } from "react";
import BootstrapDatePicker from "./BootstrapDatePicker";
import RequestsPerMethodLineCharts from "./RequestsPerMethodLineCharts";
import * as moment from "moment";

export default class Stats extends Component {
  state = {
    dateRange: {
      startDate: moment().startOf("day").subtract(20, "months"),
      endDate: moment().startOf("day"),
    },
  };
  render() {
    return (
      <div className="container">
        <div className="d-flex flex-column">
          <div className="d-flex flex-column my-3">
            <BootstrapDatePicker
              setMyParentValue={(val) => {
                if (val && val.length === 2 && val[0] && val[1]) {
                  this.setState({
                    dateRange: {
                      startDate: val[0].startOf("day"),
                      endDate: val[1].startOf("day").add(1, "days"),
                    },
                  });
                }
              }}
              dateRange={this.state.dateRange}
            />
          </div>
          <RequestsPerMethodLineCharts dateRange={this.state.dateRange} />
        </div>
      </div>
    );
  }
}
