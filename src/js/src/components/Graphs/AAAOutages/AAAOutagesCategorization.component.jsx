import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import httpService from "../../../services/httpService";
import config from "../../../config";
const apiEndPoint =
  config.apiPrefix + "/api/charts/aaa_outages_plus_remedy_query3";

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
    const colors = {
      pink: {
        100: "#f2dfdf",
        200: "#e5bfbf",
        300: "#d89e9e",
        400: "#cb7e7e",
        500: "#be5e5e",
        600: "#984b4b",
        700: "#723838",
        800: "#4c2626",
        900: "#261313",
      },
    };
    return "#E8E8E8";
  }

  if (
    commentsText ===
    "02.a. AAA outage found in Remedy with +- 3 hours difference"
  ) {
    return "#E8E8E8";
  }

  if (
    commentsText ===
    "04.a.1 question for NOC: Remedy not found /AAA >= 10% calls"
  ) {
    return "#D8DEE9";
  }

  if (
    commentsText === "04.b. question for NOC: Remedy not found /AAA < 10% calls"
  ) {
    return "#D8DEE9";
  }

  if (commentsText === "05. Less than 12 minutes AAA outage") {
    return "#fff";
  }

  if (commentsText === "06. AAA outage with 0 calls") {
    return "#fff";
  }

  if (commentsText === "Grand Total") {
    return "#fbfbfb";
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

function convertDateFormat(dateStr) {
  // Split the date string into parts
  const [day, month, year] = dateStr
    .split("/")
    .map((part) => parseInt(part, 10));

  // Create a new Date object (month is 0-indexed in JavaScript Date)
  const date = new Date(year, month - 1, day);

  // Format the date to YYYY-MM-DD manually
  const formattedDate = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  return formattedDate;
}

export function AAAOutagesCategorization({ dateRange, setLoading }) {
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
            label: "Category",
            width: "150px",
          },
          {
            id: "DSLAM_OWNER_GROUP",
            numeric: true,
            disablePadding: true,
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
              align={index < 2 ? "left" : "right"}
              padding={headCell.disablePadding ? "none" : "normal"}
              sx={{
                whiteSpace: "nowrap",
                fontWeight: 600,

                position: index < 2 ? "sticky" : "normal",
                left: index === 0 ? 0 : index === 1 ? 247 : "",
                background: "white",
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
                      // cursor: "pointer",
                      // backgroundColor: determineColor(row.COMMENTS),
                      backgroundColor: row.id % 2 === 0 ? "#f9f9f9" : "fff",
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

                        backgroundColor: row.id % 2 === 0 ? "#f9f9f9" : "fff",
                        zIndex: 10, // higher than the table body cells
                      }}
                    >
                      {row.COMMENTS}
                    </TableCell>

                    <TableCell
                      align="left"
                      sx={{
                        position: "sticky",
                        left: 247,
                        zIndex: 10, // higher than the table body cells
                        backgroundColor: row.id % 2 === 0 ? "#f9f9f9" : "fff",
                      }}
                    >
                      {row.DSLAM_OWNER_GROUP}
                    </TableCell>

                    {row &&
                      Object.keys(row.dateValuePair)
                        .sort(sortDates)
                        .map((key) => {
                          const YearMonthDayFormat = convertDateFormat(key);
                          return (
                            <TableCell
                              key={key}
                              align="right"
                              style={{ background: "inherit" }}
                            >
                              {row.COMMENTS !== "Grand Total" ? (
                                <Link
                                  style={{
                                    textDecoration: "none",
                                  }}
                                  to={`/graphs/aaa-outages-rawdata?startDate=${YearMonthDayFormat}&endDate=${YearMonthDayFormat}&filterColumn_System%20Found=${encodeURIComponent(
                                    row.COMMENTS
                                  )}&filterColumn_DSLAM%20Owner%20Group=${encodeURIComponent(
                                    row.DSLAM_OWNER_GROUP
                                  )}`}
                                >
                                  {row.dateValuePair[key]}
                                </Link>
                              ) : (
                                <span>{row.dateValuePair[key]}</span>
                              )}
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
