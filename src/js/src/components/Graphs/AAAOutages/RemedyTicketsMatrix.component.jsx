import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import httpService from "../../../services/httpService";
import config from "../../../config.json";
const apiEndPoint =
  config.apiPrefix + "/api/charts/aaa_outages_plus_remedy_query2";

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
        Remedy Tickets
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

export function RemedyTickets({ dateRange, setLoading }) {
  const [rows, setQuery2Data] = useState([]);
  const [headCells, setHeadCells] = useState([]);

  useEffect(() => {
    setLoading(true);
    const getDataFromDB = async () => {
      const { data: myData } = await httpService.post(apiEndPoint, {
        dateRange,
      });
      setQuery2Data(myData);
      // Calculate Grand Totals Per Date
      const sumByDateObject = sumByDate(myData);

      // Insert Grand Total Object
      myData.push({
        DSLAM_OWNER_GROUP: "Grand Total",
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
