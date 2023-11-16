import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import httpService from "../../../services/httpService";
import config from "../../../config.json";
const apiEndPoint =
  config.apiPrefix + "/api/charts/aaa_outages_plus_remedy_query1";

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

function EnhancedTableToolbar() {
  return (
    <Toolbar>
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h4"
        id="tableTitle"
        component="div"
      >
        AAA Outages
      </Typography>
    </Toolbar>
  );
}

const determineColor = (commentsText) => {
  if (
    commentsText ===
    "01.a. AAA outage found in Remedy with +- 60 minutes difference"
  ) {
    return "#df6565";
  }

  if (
    commentsText ===
    "02.a. AAA outage found in Remedy with +- 3 hours difference"
  ) {
    return "#df6565";
  }

  if (
    commentsText ===
    "04.a.1 question for NOC: Remedy not found /AAA >= 10% calls"
  ) {
    return "#65b2df";
  }

  if (
    commentsText === "04.b. question for NOC: Remedy not found /AAA < 10% calls"
  ) {
    return "#e2c985";
  }

  if (commentsText === "05. Less than 12 minutes AAA outage") {
    return "#e2c985";
  }

  if (commentsText === "06. AAA outage with 0 calls") {
    return "#e2c985";
  }

  if (commentsText === "Grand Total") {
    return "#f8f8f8";
  }
};

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

export function AAAOutagesTable({ dateRange, setLoading }) {
  const [rows, setQuery1Data] = useState([]);
  const [headCells, setHeadCells] = useState([]);

  useEffect(() => {
    let { startDate, endDate } = dateRange;

    startDate = startDate;
    endDate = endDate.add(1, "day");

    setLoading(true);
    const getDataFromDB = async () => {
      const { data: myData } = await httpService.post(apiEndPoint, {
        dateRange: { startDate, endDate },
      });
      setQuery1Data(myData);

      // Calculate Grand Totals Per Date
      const sumByDateObject = sumByDate(myData);

      // Insert Grand Total Object
      myData.push({
        DSLAM_OWNER_GROUP: "",
        COMMENTS: "Grand Total",
        dateValuePair: sumByDateObject,
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
            id: "COMMENTS",
            numeric: false,
            disablePadding: true,
            label: "Comments",
          },
          {
            id: "DSLAM_OWNER_GROUP",
            numeric: true,
            disablePadding: false,
            label: "DSLAM Owner Group",
          },
          ...dateLabels,
        ]);
      });

      setLoading(false);
    };

    getDataFromDB();
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
              sx={{
                whiteSpace: "nowrap",
                fontWeight: 600,

                position: index < 2 ? "sticky" : "normal",
                left: index === 0 ? 0 : index === 1 ? 433 : "",
                background: index < 2 ? "white" : "white",
                zIndex: 20, // higher than the table body cells
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
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <EnhancedTableHead rowCount={rows.length} />
            <TableBody>
              {rows.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <TableRow
                    tabIndex={-1}
                    key={row.id}
                    sx={{
                      cursor: "pointer",

                      backgroundColor: determineColor(row.COMMENTS),
                      // index === 12
                      //   ? "#f8f8f8"
                      //   : index < 4
                      //   ? "#A9D08E"
                      //   : index >= 4 && index <= 5
                      //   ? "#FFF2CC"
                      //   : "#FFE699",
                    }}
                  >
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                      sx={{
                        whiteSpace: "nowrap",
                        fontWeight: 600,

                        position: "sticky",
                        left: 0,
                        background: "inherit",
                        zIndex: 10, // higher than the table body cells
                      }}
                    >
                      {row.COMMENTS}
                    </TableCell>

                    <TableCell
                      align="right"
                      sx={{
                        position: "sticky",
                        left: 433,
                        zIndex: 10, // higher than the table body cells
                        background: "inherit",
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
                              {row.dateValuePair[key]}
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
  );
}
