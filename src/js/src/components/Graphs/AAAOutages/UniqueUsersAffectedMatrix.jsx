import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import httpService from "../../../services/httpService";
import config from "../../../config.json";
const apiEndPoint = config.apiPrefix + "/api/charts/aaa_uniq_users_affected";

import { AAAOutagesVSRemedyCharts } from "./Charts/AAAOutagesVSRemedyChart";
import { formatNumberWithThousandsSeparator } from "../../../lib/helpFunctions";

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

export function UniqueUsersAffectedTable({ dateRange }) {
  const [rows, setRows] = useState([]);
  const [headCells, setHeadCells] = useState([]);

  useEffect(() => {
    let { startDate, endDate } = dateRange;

    startDate = startDate;
    endDate = endDate.add(1, "day");

    const getDataFromDB = async () => {
      const { data: myData } = await httpService.post(apiEndPoint, {
        dateRange: { startDate, endDate },
      });

      const columns = [
        {
          id: "DSLAM_OWNER_GROUP",
          numeric: true,
          disablePadding: false,
          label: "DSLAM Owner Group",
        },
        {
          id: "MATCHED_WITH_TICKET",
          numeric: true,
          disablePadding: false,
          label: "Matched With Ticket",
        },
        {
          id: "RESOLUTION_CATEG_TIER_1",
          numeric: true,
          disablePadding: false,
          label: "Resolution Categ Tier 1",
        },
        {
          id: "RESOLUTION_CATEG_TIER_2",
          numeric: true,
          disablePadding: false,
          label: "Resolution Categ Tier 2",
        },
        {
          id: "UNIQUE_TICKETS",
          numeric: true,
          disablePadding: false,
          label: "Unique Tickets",
        },
        {
          id: "UNIQUE_DSLAMS",
          numeric: true,
          disablePadding: false,
          label: "Unique DSLAMS",
        },
        {
          id: "AFFECTED_SESSIONS",
          numeric: true,
          disablePadding: false,
          label: "Affected Sessions",
        },
      ];

      setRows(myData);
      setHeadCells(columns);
    };

    setTimeout(() => {
      getDataFromDB();
    }, 120);
  }, [dateRange]);

  function EnhancedTableHead(props) {
    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell, index) => (
            <TableCell
              key={headCell.id}
              align={index < 4 ? "left" : "right"}
              padding={headCell.disablePadding ? "none" : "normal"}
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
                      align="left"
                      sx={{
                        whiteSpace: "nowrap",
                        textAlign: "left",
                      }}
                    >
                      {row["dslamOwnerGroup"]}
                    </TableCell>
                    <TableCell align="left">
                      {row["matchedWithTicket"]}
                    </TableCell>
                    <TableCell align="left">{row["resolCategTier1"]}</TableCell>
                    <TableCell align="left">{row["resolCategTier2"]}</TableCell>
                    <TableCell align="right">{row["uniqueTickets"]}</TableCell>
                    <TableCell align="right">
                      {formatNumberWithThousandsSeparator(
                        parseFloat(row["uniqDslams"])
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {formatNumberWithThousandsSeparator(
                        parseFloat(row["affectedSessions"])
                      )}
                    </TableCell>
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
