import * as React from "react";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";

import { TooltipOnCursor } from "../common/TooltipOnCursor";

import { datesWithinRange } from "../../lib/helpFunctions";
import httpService from "../../services/httpService";
import config from "../../config";
const apiEndPoint = config.apiPrefix + "/api/charts/getAAARawData";

import { LoadingSpinnerCentered } from "../common/LoadingSpinnerCentered";

import Button from "@mui/material/Button";
import CachedIcon from "@mui/icons-material/Cached";

import { DatePicker } from "antd";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;

import CircularIndeterminate from "../common/CircularIndeterminate";
import { Spin } from "antd";

import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import "ag-grid-community/styles/ag-theme-balham.min.css"; // Optional theme CSS
import "ag-grid-community/styles/ag-theme-material.min.css"; // Optional theme CSS

import * as XLSX from "xlsx";

import locale from "antd/es/date-picker/locale/en_GB";
const rangePickerDateFormat = ["DD MMM YYYY"];
const startDate = dayjs().subtract(1, "day").startOf("day");
const endDate = dayjs().startOf("day");
const initialDates = {
  startDate,
  endDate,
};

function disabledDate(current) {
  // Disable dates in the future
  return current && current > dayjs().startOf("day");
}

const widthInPx = 145;

export function AAAOutagesRawData() {
  const [dateRange, setDateRange] = useState(initialDates);
  const [value, setValue] = useState(null);

  const [retrivedRawData, setRetrievedRawData] = useState([]);
  const [originalData, setOriginalData] = useState([]);

  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedColumn, setSelectedColumn] = useState("all");
  const [excelLoading, setExcelLoading] = useState(false);

  const [gridReady, setGridReady] = useState(false);

  const gridRef = useRef(); // Optional - for accessing Grid's API
  const menuRef = useRef(null);
  const selectAllRef = useRef(null);

  const [masterLoading, setMasterLoading] = useState(false);

  const [columnDefs, setColumnDefs] = useState([
    // { field: "id", headerName: "ID", width: 90 },
    {
      field: "alarm_DAY",
      filter: true,
      headerName: "Alarm Day",
      width: widthInPx,
      headerClass: "genericHeaderClass",
      cellDataType: "text",
      cellRenderer: (params) => {
        return dayjs(params.value).format("DD MMM YYYY"); // Customize the format as needed
      },
    },
    {
      field: "matching_COMMENTS",
      filter: true,
      headerName: "Matching Comments",
      headerClass: "genericHeaderClass",
      width: widthInPx + 300,
      cellDataType: "text",
    },
    {
      field: "network",
      filter: true,
      headerName: "Network",
      headerClass: "aaaHeaderClass",
      width: widthInPx,
      cellDataType: "text",
    },
    {
      field: "dslam_OWNER",
      filter: true,
      headerName: "DSLAM Owner",
      headerClass: "aaaHeaderClass",
      width: widthInPx - 2,
      cellDataType: "text",
    },
    {
      field: "dslam_OWNER_GROUP",
      filter: true,
      headerName: "DSLAM Owner Group",
      headerClass: "aaaHeaderClass",
      width: widthInPx + 40,
      cellDataType: "text",
    },

    {
      field: "outage_ID",
      filter: true,
      headerName: "Outage ID",
      headerClass: "aaaHeaderClass",
      width: widthInPx - 30,
      type: "numericColumn",
    },
    {
      field: "alarm_START_DATE",
      filter: true,
      headerName: "Alarm Start Date",
      headerClass: "aaaHeaderClass",
      width: widthInPx + 18,
    },
    {
      field: "alarm_END_DATE",
      filter: true,
      headerName: "Alarm End Date",
      headerClass: "aaaHeaderClass",
      width: widthInPx + 18,
    },
    {
      field: "maintenance_PERIOD",
      filter: true,
      headerName: "Maintenance Period",
      headerClass: "aaaHeaderClass",
      width: widthInPx + 18,
    },
    {
      field: "dslam",
      filter: true,
      headerName: "DSLAM",
      headerClass: "aaaHeaderClass",
      // type: "number",
      width: widthInPx + 175,
    },
    {
      field: "dslam_SLOT",
      filter: true,
      headerName: "DSLAM Slot",
      headerClass: "aaaHeaderClass",
      // type: "number",
      width: widthInPx,
    },
    {
      field: "technology",
      filter: true,
      headerName: "Technology",
      headerClass: "aaaHeaderClass",
      // type: "number",
      width: widthInPx,
    },
    {
      field: "ote_SITE_NAME",
      filter: true,
      headerName: "OTE Site Name",
      headerClass: "aaaHeaderClass",
      // type: "number",
      width: widthInPx + 175,
    },
    {
      field: "ote_SITE_AREA",
      filter: true,
      headerName: "OTE Site Area",
      headerClass: "aaaHeaderClass",
      // type: "number",
      width: widthInPx,
    },
    {
      field: "post_CODE",
      filter: true,
      headerName: "Post Code",
      headerClass: "aaaHeaderClass",
      // type: "number",
      width: widthInPx,
    },
    {
      field: "longitude",
      filter: true,
      headerName: "Longitude",
      headerClass: "aaaHeaderClass",
      // type: "number",
      width: widthInPx + 20,
    },
    {
      field: "latitude",
      filter: true,
      headerName: "Latitude",
      headerClass: "aaaHeaderClass",
      // type: "number",
      width: widthInPx + 20,
    },
    {
      field: "problem",
      filter: true,
      headerName: "Problem",
      headerClass: "aaaHeaderClass",
      // type: "number",
      width: widthInPx + 175,
    },
    {
      field: "dslam_USERS",
      filter: true,
      headerName: "DSLAM Users",
      headerClass: "aaaHeaderClass",
      // type: "number",
      width: widthInPx,
    },
    {
      field: "data_AFFECTED",
      filter: true,
      headerName: "Sessions Affected",
      headerClass: "aaaHeaderClass",
      // type: "number",
      width: widthInPx + 15,

      type: "numericColumn",
    },
    {
      field: "total_USERS_CALLED",
      filter: true,
      headerName: "Total Users Called",
      headerClass: "aaaHeaderClass",
      // type: "number",
      width: widthInPx + 20,

      type: "numericColumn",
    },
    {
      field: "rmd_INCIDENT_NUMBER",
      filter: true,
      headerName: "RMD Incident Number",
      headerClass: "remedyHeaderClass",
      width: widthInPx + 40,
    },
    {
      field: "rmd_IS_SCHEDULED",
      filter: true,
      headerName: "RMD Is Scheduled",
      headerClass: "remedyHeaderClass",
      width: widthInPx + 40,
    },
    {
      field: "rmd_ALARM_START_DATE",
      filter: true,
      headerName: "RMD Alarm Start Date",
      headerClass: "remedyHeaderClass",
      width: widthInPx + 18,
    },
    {
      field: "rmd_ALARM_END_DATE",
      filter: true,
      headerName: "RMD Alarm End Date",
      headerClass: "remedyHeaderClass",
      width: widthInPx + 18,
    },
    {
      field: "rmd_SPECTRA_HIERARCHY",
      filter: true,
      headerName: "RMD Spectra Hierarchy",
      headerClass: "remedyHeaderClass",
      width: widthInPx + widthInPx + widthInPx,
    },
    {
      field: "rmd_OPERATIONAL_CATEG_TIER_1",
      filter: true,
      headerName: "RMD Operational Categ. Tier 1",
      headerClass: "remedyHeaderClass",
      width: widthInPx + 120,
    },
    {
      field: "rmd_OPERATIONAL_CATEG_TIER_2",
      filter: true,
      headerName: "RMD Operational Categ. Tier 2",
      headerClass: "remedyHeaderClass",
      width: widthInPx + 120,
    },
    {
      field: "rmd_OPERATIONAL_CATEG_TIER_3",
      filter: true,
      headerName: "RMD Operational Categ. Tier 3",
      headerClass: "remedyHeaderClass",
      width: widthInPx + 120,
    },
    {
      field: "rmd_RESOLUTION_CATEG_TIER_1",
      filter: true,
      headerName: "RMD Resolution Categ. Tier 1",
      headerClass: "remedyHeaderClass",
      width: widthInPx + 120,
    },
    {
      field: "rmd_RESOLUTION_CATEG_TIER_2",
      filter: true,
      headerName: "RMD Resolution Categ. Tier 2",
      headerClass: "remedyHeaderClass",
      width: widthInPx + 120,
    },
    {
      field: "zbx_EVENT_ID",
      filter: true,
      headerName: "ZBX Event ID",
      headerClass: "zabbixHeaderClass",
      width: widthInPx,

      type: "numericColumn",
    },
    {
      field: "zbx_PROBLEM",
      filter: true,
      headerName: "ZBX Problem",
      headerClass: "zabbixHeaderClass",
      width: widthInPx,
    },
    {
      field: "zbx_ALARM_START_DATE",
      filter: true,
      headerName: "ZBX Alarm Start Date",
      headerClass: "zabbixHeaderClass",
      width: widthInPx + 40,
    },
    {
      field: "zbx_ALARM_END_DATE",
      filter: true,
      headerName: "ZBX Alarm End Date",
      headerClass: "zabbixHeaderClass",
      width: widthInPx + 40,
    },
    {
      field: "nce_EVENT_ID",
      filter: true,
      headerName: "NCE Event ID",
      headerClass: "nceHeaderClass",
      width: widthInPx,
      type: "numericColumn",
    },
    {
      field: "nce_ALARM_START_DATE",
      filter: true,
      headerName: "NCE Alarm Start Date",
      headerClass: "nceHeaderClass",
      width: widthInPx + 40,
    },
    {
      field: "nce_ALARM_END_DATE",
      filter: true,
      headerName: "NCE Alarm End Date",
      headerClass: "nceHeaderClass",
      width: widthInPx + 40,
    },
    {
      field: "nce_PROBLEM",
      filter: true,
      headerName: "NCE Problem",
      headerClass: "nceHeaderClass",
      width: widthInPx,
    },
    {
      field: "nce_OPERATIONAL_DATA",
      filter: true,
      headerName: "NCE Operational Data",
      headerClass: "nceHeaderClass",
      width: widthInPx + 50,
    },
  ]);

  const [tooltip, setTooltip] = useState({
    show: false,
    x: 0,
    y: 0,
    message: "",
  });

  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefreshClick = () => {
    // Check if value is set, otherwise use the initial date range
    const newValue = value
      ? [...value]
      : [dateRange.startDate, dateRange.endDate];

    setRefreshKey((oldKey) => oldKey + 1); // Increment the key to force rerender
    setValue(newValue);
  };

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(() => {
    return {
      // set every column width
      width: 100,
      // make every column editable
      editable: false,
      // make every column use 'text' filter by default
      filter: "agTextColumnFilter",
      sortable: true,

      resizable: true,
    };
  });

  // Example of consuming Grid Event
  const cellClickedListener = useCallback(async (event) => {
    if (event.value) {
      try {
        await navigator.clipboard.writeText(event.value);

        setTooltip({
          show: true,
          x: event.event.clientX, // Get X and Y from the mouse event
          y: event.event.clientY,
          message: "Cell copied to clipboard",
        });

        // Hide the tooltip after a few seconds
        setTimeout(() => {
          setTooltip({ ...tooltip, show: false });
        }, 1000);
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    }
  }, []);

  useEffect(() => {
    setMasterLoading(true);
    let { startDate, endDate } = dateRange;

    startDate = startDate;
    endDate = endDate.add(1, "day");

    const getDataFromDB = async () => {
      const { data: myData } = await httpService.post(apiEndPoint, {
        dateRange: { startDate, endDate },
      });

      if (myData) {
        setOriginalData(myData); // Store original data

        if (searchTerm !== "") {
          const filteredData = filterData();
          setRetrievedRawData(filteredData);
        } else {
          setRetrievedRawData(myData); // Set retrieved data for display
        }
      }
      setMasterLoading(false);
    };

    getDataFromDB();
  }, [dateRange]);

  useEffect(() => {
    if (value && value.length == 2) {
      setDateRange({
        startDate: value[0],
        endDate: value[1],
      });
    }
  }, [value]);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuVisible(false);
    }
  };

  useEffect(() => {
    if (isMenuVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuVisible]);

  const handleColumnVisibilityChange = (columnName, isVisible) => {
    setColumnDefs((currentDefs) =>
      currentDefs.map((colDef) => {
        if (colDef.headerName === columnName) {
          return { ...colDef, hide: !isVisible };
        }
        return colDef;
      })
    );
  };

  const selectAllColumns = () => {
    setColumnDefs((currentDefs) =>
      currentDefs.map((colDef) => ({ ...colDef, hide: false }))
    );
  };

  const unselectAllColumns = () => {
    setColumnDefs((currentDefs) =>
      currentDefs.map((colDef) => ({ ...colDef, hide: true }))
    );
  };

  const allColumnsVisible = columnDefs.every((colDef) => !colDef.hide);
  const allColumnsHidden = columnDefs.every((colDef) => colDef.hide);

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate =
        !allColumnsVisible && !allColumnsHidden;
    }
  }, [allColumnsVisible, allColumnsHidden]);

  const ColumnVisibilityMenu = ({
    columnDefs,
    onVisibilityChange,
    onSelectAll,
    onUnselectAll,
  }) => {
    const handleSelectAllChange = (e) => {
      if (e.target.checked) {
        onSelectAll();
      } else {
        onUnselectAll();
      }
    };

    return (
      <div ref={menuRef} className="column-visibility-menu">
        <div>
          <input
            type="checkbox"
            ref={selectAllRef}
            checked={allColumnsVisible}
            // indeterminate={!allColumnsVisible && !allColumnsHidden}
            onChange={handleSelectAllChange}
          />
          &nbsp;&nbsp;
          <span>Select All</span>
        </div>
        {columnDefs.map((colDef) => (
          <div key={colDef.field}>
            <label htmlFor={colDef.field}>
              <input
                id={colDef.field}
                type="checkbox"
                checked={!colDef.hide}
                onChange={(e) =>
                  onVisibilityChange(colDef.headerName, e.target.checked)
                }
              />
              &nbsp;&nbsp;{colDef.headerName}
            </label>
          </div>
        ))}
      </div>
    );
  };

  const clearFilters = () => {
    gridRef.current.api.setFilterModel(null);
    setSearchTerm("");
    selectAllColumns();
  };

  const getCurrentGridData = () => {
    let rowData = [];
    let totalRows = gridRef.current.api.getDisplayedRowCount();
    gridRef.current.api.forEachNodeAfterFilterAndSort((node, index) => {
      const myObj = {};
      columnDefs.forEach((item) => {
        if (!item["hide"]) {
          myObj[item.headerName] = node.data[item.field];
        }
      });
      rowData.push(myObj);
      setExcelLoading({ isLoading: true });
    });
    return rowData;
  };

  const convertToExcel = (rowData) => {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    // Convert the data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(rowData);
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    // Generate an Excel file
    XLSX.writeFile(workbook, "exported_data.xlsx");
  };

  const exportToExcel = () => {
    setExcelLoading(true);

    setTimeout(() => {
      const rowData = getCurrentGridData();
      console.log("rowData", rowData);
      console.log("rowData length", rowData.length);
      convertToExcel(rowData);
      setExcelLoading(false);
    }, 1500);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filterData = () => {
    if (selectedColumn === "all") {
      const filteredData =
        originalData &&
        originalData.filter((row) =>
          Object.values(row).some(
            (value) =>
              value !== null &&
              value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        );

      return filteredData;
    } else {
      return originalData.filter((row) => {
        const value = row[selectedColumn];
        return (
          value !== null &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchTerm !== "") {
        const filteredData = filterData();
        setRetrievedRawData(filteredData);
      } else {
        // Reset to original data when search term is cleared
        setRetrievedRawData(originalData);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchTerm, refreshKey]);

  const columnSearchOptions = [
    { value: "all", label: "All Columns" },
    ...columnDefs
      // .filter((col) => col.cellDataType === "text")
      .map((col) => ({ value: col.field, label: col.headerName })),
  ];

  // Dropdown change handler
  const handleDropdownChange = (e) => {
    setSearchTerm("");
    setSelectedColumn(e.target.value);
  };

  const handleRowsPerPage = (e) => {
    if (e.target.value) {
      setRowsPerPage(e.target.value);
    } else {
      setRowsPerPage(100);
    }
  };

  return (
    <div className="pageWrapper">
      {tooltip.show && (
        <TooltipOnCursor
          x={tooltip.x}
          y={tooltip.y}
          message={tooltip.message}
        />
      )}
      <div className="aaa__header">
        <div className="aaa__header__title">AAA Outages - Raw Data</div>

        <div className="aaa__header__datePicker">
          <RangePicker
            locale={locale}
            format={rangePickerDateFormat}
            defaultValue={[dateRange.startDate, dateRange.endDate]}
            className="aaa__header__datePicker--item"
            onChange={(dates) => {
              if (datesWithinRange(dates)) {
                setValue(dates);
              }
            }}
            disabledDate={disabledDate}
          />
          <div className="aaa__header__reload">
            {masterLoading ? (
              <CircularIndeterminate size={25} loading={true} />
            ) : (
              <Button
                className="aaa__header__reloadButton"
                variant="outlined"
                onClick={handleRefreshClick}
              >
                <CachedIcon fontSize="medium" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div key={`wrapper-${refreshKey}`} className="datagridWrapper">
        {masterLoading ? (
          <LoadingSpinnerCentered />
        ) : (
          <div className="datagridWrapper__upper">
            <div className="datagridWrapper__flexContainer">
              <Button
                onClick={() => setIsMenuVisible(!isMenuVisible)}
                className={"datagridWrapper__selectColumnsBtn"}
              >
                Select Columns
              </Button>
              <Button
                onClick={clearFilters}
                className={"datagridWrapper__clearFiltersBtn"}
              >
                Clear Filters
              </Button>
              <Button
                onClick={exportToExcel}
                disabled={excelLoading || !gridReady}
                className={"datagridWrapper__exportToExcelBtn"}
              >
                Export to Excel
              </Button>
              {excelLoading && (
                <span className={"datagridWrapper__loadingMessage"} style={{}}>
                  Preparing Data Export...
                </span>
              )}
              <select
                value={selectedColumn}
                onChange={handleDropdownChange}
                className="datagridWrapper__selectColumn"
              >
                {columnSearchOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Quick Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="datagridWrapper__quickSearch"
              />
              {isMenuVisible && (
                <ColumnVisibilityMenu
                  columnDefs={columnDefs}
                  onVisibilityChange={handleColumnVisibilityChange}
                  onSelectAll={selectAllColumns}
                  onUnselectAll={unselectAllColumns}
                />
              )}
            </div>

            {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
            <div className="datagridWrapper__grid ag-theme-balham">
              <AgGridReact
                ref={gridRef} // Ref for accessing Grid's API
                rowData={retrivedRawData} // Row Data for Rows
                columnDefs={columnDefs} // Column Defs for Columns
                defaultColDef={defaultColDef} // Default Column Properties
                animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                rowSelection="multiple" // Options - allows click selection of rows
                onCellClicked={cellClickedListener} // Optional - registering for Grid Event
                pagination={true}
                paginationPageSize={rowsPerPage} // Set the desired number of rows per page
                onGridReady={() => {
                  console.log("Grid is Ready");
                  setGridReady(true);
                }}
              />
            </div>
            <div className="datagridWrapper__rowsPerPage">
              <span className="datagridWrapper__rowsPerPage__span">
                Rows Per Page:
              </span>
              <input
                className="datagridWrapper__rowsPerPage__input"
                type="number"
                value={rowsPerPage}
                onChange={handleRowsPerPage}
              />
            </div>
          </div>
        )}
      </div>

      <div style={{ marginBottom: "9rem" }}></div>
    </div>
  );
}