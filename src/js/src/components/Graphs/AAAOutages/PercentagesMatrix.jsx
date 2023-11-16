import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import httpService from "../../../services/httpService";
import config from "../../../config.json";
const apiEndPoint =
  config.apiPrefix + "/api/charts/aaa_outages_plus_remedy_query1";

import { AAAOutagesVSRemedyCharts } from "./Charts/AAAOutagesVSRemedyChart";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { set } from "lodash";
import { TopXSitesIncidentsAllTechs } from "./Charts/TopXSitesIncidentsAllTechsChart";

function EnhancedTableToolbar() {
  return (
    <Toolbar>
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h4"
        id="tableTitle"
        component="div"
      >
        Outages Statistics
      </Typography>
    </Toolbar>
  );
}

function sortDates(a, b) {
  // Convert the string dates into actual Date objects
  const dateA = a.split("/").reverse().join("-");
  const dateB = b.split("/").reverse().join("-");
  return new Date(dateA) - new Date(dateB);
}

function sumByDate(data) {
  const summedByDate = {};

  data.forEach((item) => {
    Object.entries(item.dateValuePair).forEach(([date, value]) => {
      if (!summedByDate[date]) {
        summedByDate[date] = 0;
      }
      summedByDate[date] += value;
    });
  });

  return summedByDate;
}

function entireNetworkOutagesOverAllEvents(data) {
  const summedByDate = {};
  data.forEach((item, itemIndex) => {
    Object.entries(item.dateValuePair).forEach(([date, value]) => {
      if (
        item.COMMENTS ===
          "01.a. AAA outage found in Remedy with +- 60 minutes difference" ||
        item.COMMENTS ===
          "02.a. AAA outage found in Remedy with +- 3 hours difference" ||
        item.COMMENTS ===
          "04.a.1 question for NOC: Remedy not found /AAA >= 10% calls"
      ) {
        if (!summedByDate[date]) {
          summedByDate[date] = 0;
        }
        summedByDate[date] += value;
      }
      if (item.DSLAM_OWNER_GROUP === "Grand Total") {
        summedByDate[date] =
          (summedByDate[date] / item.dateValuePair[date]) * 100;

        summedByDate[date] = summedByDate[date].toFixed(1);
      }
    });
  });
  return summedByDate;
}

function windAndNovaOutagesOverWindAndNovaTotalEvents(data) {
  const total1ByDate = {};
  const total2ByDate = {};
  const percentageByDate = {};
  data.forEach((item, itemIndex) => {
    Object.entries(item.dateValuePair).forEach(([date, value]) => {
      if (item["DSLAM_OWNER_GROUP"] === "WIND+NOVA") {
        if (
          item.COMMENTS ===
            "01.a. AAA outage found in Remedy with +- 60 minutes difference" ||
          item.COMMENTS ===
            "02.a. AAA outage found in Remedy with +- 3 hours difference" ||
          item.COMMENTS ===
            "04.a.1 question for NOC: Remedy not found /AAA >= 10% calls"
        ) {
          if (!total1ByDate[date]) {
            total1ByDate[date] = 0;
          }
          total1ByDate[date] += value;
        }
      }
      if (item["DSLAM_OWNER_GROUP"] === "WIND+NOVA") {
        if (
          item.COMMENTS ===
            "01.a. AAA outage found in Remedy with +- 60 minutes difference" ||
          item.COMMENTS ===
            "02.a. AAA outage found in Remedy with +- 3 hours difference" ||
          item.COMMENTS ===
            "04.a.1 question for NOC: Remedy not found /AAA >= 10% calls" ||
          item.COMMENTS ===
            "04.b. question for NOC: Remedy not found /AAA < 10% calls" ||
          item.COMMENTS === "05. Less than 12 minutes AAA outage" ||
          item.COMMENTS === "06. AAA outage with 0 calls"
        ) {
          if (!total2ByDate[date]) {
            total2ByDate[date] = 0;
          }
          total2ByDate[date] += value;
        }
      }

      if (item.DSLAM_OWNER_GROUP === "Grand Total") {
        percentageByDate[date] =
          (total1ByDate[date] / total2ByDate[date]) * 100;
        percentageByDate[date] = percentageByDate[date].toFixed(1);
      }
    });
  });
  return percentageByDate;
}

function entireNetworkOutagesOverAllEventsAVG(data) {
  let summedData = 0;
  const numOfItems = Object.keys(data).length;

  for (const item in data) {
    summedData += parseFloat(data[item]);
  }

  return (summedData / numOfItems).toFixed(1);
}

function windNovaOutagesOverWindNovaTotalEventsAVG(data) {
  let summedData = 0;
  const numOfItems = Object.keys(data).length;

  for (const item in data) {
    summedData += parseFloat(data[item]);
  }

  return (summedData / numOfItems).toFixed(1);
}

export function PercentagesTable({
  dateRange,
  setNetWorkOutagesAvgPercentage,
  setWindNovaOutagesOverTotalEvents,
}) {
  const [rows, setQuery1Data] = useState([]);
  const [headCells, setHeadCells] = useState([]);

  useEffect(() => {
    let { startDate, endDate } = dateRange;

    startDate = startDate;
    endDate = endDate.add(1, "day");

    const getDataFromDB = async () => {
      const { data: myData } = await httpService.post(apiEndPoint, {
        dateRange: { startDate, endDate },
      });

      const dataTobeShown = [];
      // Calculate Grand Totals Per Date
      const sumByDateObject = sumByDate(myData);

      // Insert Grand Total Object
      myData.push({
        DSLAM_OWNER_GROUP: "Grand Total",
        dateValuePair: sumByDateObject,
        id: Math.random(),
      });

      const networkOutagesOverAllEvents =
        entireNetworkOutagesOverAllEvents(myData);

      const companyOutagesOverTotalEvents =
        windAndNovaOutagesOverWindAndNovaTotalEvents(myData);

      const networkOutagesOverAllEventsAVG =
        entireNetworkOutagesOverAllEventsAVG(networkOutagesOverAllEvents);

      const windNovaNetworkOutagesOverAllEventsAVG =
        windNovaOutagesOverWindNovaTotalEventsAVG(
          companyOutagesOverTotalEvents
        );

      dataTobeShown.push({
        DSLAM_OWNER_GROUP: "Entire Network Outages over All Events %",
        dateValuePair: networkOutagesOverAllEvents,
        id: Math.random(),
      });

      dataTobeShown.push({
        DSLAM_OWNER_GROUP:
          "Wind+Nova Network Outages over Wind+Nova total Events %",
        dateValuePair: companyOutagesOverTotalEvents,
        id: Math.random(),
      });

      // Create Additional Table Columns from Dates
      myData.map((item) => {
        const { dateValuePair } = item;
        const dateLabels = Object.keys(dateValuePair)
          .sort(sortDates)
          .map((key) => ({
            id: key,
            numeric: false,
            disablePadding: true,
            label: key,
          }));

        setHeadCells([
          {
            id: "DSLAM_OWNER_GROUP",
            numeric: true,
            disablePadding: false,
            label: "DSLAM Owner Group",
          },
          ...dateLabels,
        ]);
      });

      setQuery1Data(dataTobeShown);
      setNetWorkOutagesAvgPercentage(networkOutagesOverAllEventsAVG);
      setWindNovaOutagesOverTotalEvents(windNovaNetworkOutagesOverAllEventsAVG);
    };

    setTimeout(() => {
      getDataFromDB();
    }, 1200);
  }, [dateRange]);

  function EnhancedTableHead(props) {
    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell, index) => (
            <TableCell
              key={headCell.id}
              align={index === 0 ? "left" : "right"}
              padding={headCell.disablePadding ? "none" : "normal"}
              style={{
                position: index === 0 ? "sticky" : "normal",
                left: 0,
                background: "white",
                zIndex: 10,
              }}
            >
              <TableSortLabel
                active={false}
                // hideSortIcon={true}
              >
                {headCell.label}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  return (
    <div>
      <AAAOutagesVSRemedyCharts chartData={rows} />
      <TopXSitesIncidentsAllTechs dateRange={dateRange} />
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <EnhancedTableToolbar />
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <EnhancedTableHead rowCount={rows.length} />
              <TableBody>
                {rows.map((row, index) => {
                  return (
                    <TableRow tabIndex={-1} key={row.id} sx={{}}>
                      <TableCell
                        align="right"
                        sx={{
                          position: "sticky",
                          whiteSpace: "nowrap",
                          textAlign: "left",
                          left: 0,
                          zIndex: 10, // higher than the table body cells
                          background: "white",
                        }}
                      >
                        {row.DSLAM_OWNER_GROUP}
                      </TableCell>

                      {row &&
                        Object.keys(row.dateValuePair)
                          .sort(sortDates)
                          .map((key) => {
                            return (
                              <TableCell key={key} align="right">
                                {`${row.dateValuePair[key]} %`}
                              </TableCell>
                            );
                          })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </div>
  );
}
