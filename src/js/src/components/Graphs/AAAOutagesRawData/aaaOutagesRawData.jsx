import * as React from "react";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { TooltipOnCursor } from "../../common/TooltipOnCursor";

import httpService from "../../../services/httpService";
import config from "../../../config";
const apiEndPoint = config.apiPrefix + "/api/charts/getAAARawData";

import { LoadingSpinnerCentered } from "../../common/LoadingSpinnerCentered";

import Button from "@mui/material/Button";

import { DatePicker } from "antd";
import dayjs from "dayjs";

import { Header } from "./components/header";

import {
  useDateParams,
  useColumnVisibilityParams,
  applyColumnFilter,
  useFilterColumnByString,
  convertToExcel,
} from "./lib/utils";

import { FilterView } from "./components/filterView";

import { Footer } from "./components/footer";
import { ColumnVisibilityMenu } from "./components/columnsMenu";

import { UpperButtons } from "./components/buttons";

import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import "ag-grid-community/styles/ag-theme-balham.min.css"; // Optional theme CSS
import "ag-grid-community/styles/ag-theme-material.min.css"; // Optional theme CSS

const widthInPx = 145;

export function AAAOutagesRawData() {
  // URL Filters
  const navigate = useNavigate();
  const [startDate, endDate] = useDateParams(); // Date
  const { columnList, resetColumnList } = useColumnVisibilityParams(); // Column Visibility
  const { columnFilterValues, resetFilterValues } = useFilterColumnByString(); // Column Data Filter {column: [value1, value2]}

  const initialDates = {
    startDate,
    endDate,
  };

  const [dateRange, setDateRange] = useState(initialDates);
  const [value, setValue] = useState(null);

  const [retrivedRawData, setRetrievedRawData] = useState([]);
  const [originalData, setOriginalData] = useState([]);

  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedColumn, setSelectedColumn] = useState("all");
  const [excelLoading, setExcelLoading] = useState(false);

  const [gridReady, setGridReady] = useState(false);

  const gridRef = useRef();
  const menuRef = useRef(null);
  const selectAllRef = useRef(null);
  const scrollRef = useRef(0);

  const [masterLoading, setMasterLoading] = useState(true);

  const [originalColumnDefs, setOriginalColumnDefs] = useState([
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
      field: "system_FOUND",
      filter: true,
      headerName: "System Found",
      headerClass: "genericHeaderClass",
      width: widthInPx + 90,
    },
    {
      field: "system_GROUP_FOUND",
      filter: true,
      headerName: "System Group Found",
      headerClass: "genericHeaderClass",
      width: widthInPx + 50,
    },
    {
      field: "outage_TYPE_DESC",
      filter: true,
      headerName: "Outage Type",
      headerClass: "genericHeaderClass",
      width: widthInPx,
    },
    {
      field: "network",
      filter: true,
      headerName: "Network",
      headerClass: "aaaHeaderClass",
      width: widthInPx - 50,
      cellDataType: "text",
    },
    {
      field: "dslam_OWNER",
      filter: true,
      headerName: "DSLAM Owner",
      headerClass: "aaaHeaderClass",
      width: widthInPx - 20,
      cellDataType: "text",
    },
    {
      field: "dslam_OWNER_GROUP",
      filter: true,
      headerName: "DSLAM Owner Group",
      headerClass: "aaaHeaderClass",
      width: widthInPx + 15,
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
      field: "aaa_OUTAGE_DURATION_SEC",
      filter: true,
      headerName: "AAA Outage Duration SEC",
      headerClass: "aaaHeaderClass",
      width: widthInPx + 38,
      type: "numericColumn",
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
      field: "smp_UNIQUE_USERS",
      filter: true,
      headerName: "SMP Unique Users",
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
      field: "zbx_RMU_EVENT_ID",
      filter: true,
      headerName: "ZBX RMU Event ID",
      headerClass: "zabbixHeaderClass",
      width: widthInPx + 40,
      type: "numericColumn",
    },
    {
      field: "zbx_RMU_PROBLEM",
      filter: true,
      headerName: "ZBX RMU Problem",
      headerClass: "zabbixHeaderClass",
      width: widthInPx + 40,
    },
    {
      field: "zbx_RMU_ALARM_START_DATE",
      filter: true,
      headerName: "ZBX RMU Alarm Start Date",
      headerClass: "zabbixHeaderClass",
      width: widthInPx + 50,
    },
    {
      field: "zbx_RMU_ALARM_END_DATE",
      filter: true,
      headerName: "ZBX RMU Alarm End Date",
      headerClass: "zabbixHeaderClass",
      width: widthInPx + 50,
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

    {
      field: "ams_EVENT_TIME",
      filter: true,
      headerName: "AMS Event Time",
      headerClass: "amsHeaderClass",
      width: widthInPx + 50,
    },
    {
      field: "ams_CLEARED_TIME",
      filter: true,
      headerName: "AMS Cleared Time",
      headerClass: "amsHeaderClass",
      width: widthInPx + 50,
    },
    {
      field: "ams_PROBABLE_CAUSE",
      filter: true,
      headerName: "AMS Probable Cause",
      headerClass: "amsHeaderClass",
      width: widthInPx + 50,
    },
    {
      field: "ams_SPECIFIC_PROBLEM",
      filter: true,
      headerName: "AMS Specific Problem",
      headerClass: "amsHeaderClass",
      width: widthInPx + 50,
    },
    {
      field: "ams_FTTH_EVENT_TIME",
      filter: true,
      headerName: "AMS FTTH Event Time",
      headerClass: "amsFTTHHeaderClass",
      width: widthInPx + 50,
    },
    {
      field: "ams_FTTH_CLEARED_TIME",
      filter: true,
      headerName: "AMS FTTH Cleared Time",
      headerClass: "amsFTTHHeaderClass",
      width: widthInPx + 50,
    },
    {
      field: "ams_FTTH_PROBABLE_CAUSE",
      filter: true,
      headerName: "AMS FTTH Probable Cause",
      headerClass: "amsFTTHHeaderClass",
      width: widthInPx + 50,
    },
    {
      field: "ams_FTTH_SPECIFIC_PROBLEM",
      filter: true,
      headerName: "AMS FTTH Specific Problem",
      headerClass: "amsFTTHHeaderClass",
      width: widthInPx + 50,
    },
    {
      field: "soem_EVENT_ID",
      filter: true,
      headerName: "SOEM Event ID",
      headerClass: "soemHeaderClass",
      width: widthInPx + 50,
    },
    {
      field: "soem_RAISED_ON",
      filter: true,
      headerName: "SOEM Raised ON",
      headerClass: "soemHeaderClass",
      width: widthInPx + 50,
    },
    {
      field: "soem_ALARM_TYPE",
      filter: true,
      headerName: "SOEM Alarm Type",
      headerClass: "soemHeaderClass",
      width: widthInPx + 50,
    },
    {
      field: "soem_PROBABLE_CAUSE",
      filter: true,
      headerName: "SOEM Probable Cause",
      headerClass: "soemHeaderClass",
      width: widthInPx + 50,
    },
    {
      field: "hdm_LAST_SNAPSHOT_DATE",
      filter: true,
      headerName: "HDM Last Snapshot Date",
      headerClass: "hdmHeaderClass",
      width: widthInPx + 50,
    },
    {
      field: "hdm_MATCHING_OUTCOME",
      filter: true,
      headerName: "HDM Matching Outcome",
      headerClass: "hdmHeaderClass",
      width: widthInPx + 50,
    },
    {
      field: "hdm_MATCHING_OUTCOME_FULL",
      filter: true,
      headerName: "HDM Matching Outcome Full",
      headerClass: "hdmHeaderClass",
      width: widthInPx + 600,
    },
  ]);

  const [columnDefs, setColumnDefs] = useState(originalColumnDefs);

  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [refreshKey, setRefreshKey] = useState(0);

  const [refreshKeyForFilter, setRefreshKeyForFilter] = useState(0);

  const [scrollPosition, setScrollPosition] = useState(null);

  const [determineFilterButtonStatus, setDetermineFilterButtonStatus] =
    useState("text");

  const defaultRefreshIntervalTime = 60;
  const [refreshIntervalTime, setRefreshIntervalTime] = useState(0);
  const refreshIntervalInputRef = useRef(null);

  const [agGridFilter, setAgFilter] = useState();
  const allColumnsVisible = columnDefs.every((colDef) => !colDef.hide);
  const allColumnsHidden = columnDefs.every((colDef) => colDef.hide);

  const getDataFromDB = async () => {
    setMasterLoading(true);
    let { startDate, endDate } = dateRange;
    endDate = endDate.add(1, "day");

    const { data: myData } = await httpService.post(apiEndPoint, {
      dateRange: { startDate, endDate },
    });

    if (myData) {
      setOriginalData([...myData]); // Store original data

      if (searchTerm !== "") {
        const filteredData = filterData();
        // setRetrievedRawData(filteredData);
      } else {
        if (!columnFilterValues || !columnList) {
          setRetrievedRawData(myData); // Set retrieved data for display
        }
      }
    }
    setMasterLoading(false);
  };

  useEffect(() => {
    applyColumnFilter(setColumnDefs, columnList);

    if (refreshIntervalTime) {
      if (refreshIntervalTime < 10 || refreshIntervalTime > 99) {
        setRefreshIntervalTime(10);
        return;
      }
      const intervalId = setInterval(getDataFromDB, refreshIntervalTime * 1000);
      return () => clearInterval(intervalId);
    }
  }, [refreshIntervalTime]);

  useEffect(() => {
    if (
      columnList.length !== 0 ||
      Object.keys(columnFilterValues).length !== 0
    ) {
      setDetermineFilterButtonStatus("outlined");
    } else {
      setDetermineFilterButtonStatus("text");
    }
  }, [columnList, columnFilterValues]);

  useEffect(() => {
    if (menuRef && menuRef.current && scrollPosition) {
      menuRef.current.scrollTop = scrollPosition;
    }
  }, [scrollPosition, columnDefs]);

  useEffect(() => {
    let filteredData = [...originalData];
    if (Object.keys(columnFilterValues).length !== 0) {
      // {column: [value1, value2]}

      for (const column in columnFilterValues) {
        // {column: [value1, value2]}
        const labelValueObject = columnSearchOptions.find(
          // { "value": "network",  "label": "Network" }
          (obj) => obj.label === column
        );

        filteredData = filteredData.filter((row) => {
          const valueForColumn = row[`${labelValueObject.value}`];
          return columnFilterValues[column].includes(valueForColumn);
        });
      }
    }

    setRetrievedRawData(filteredData);
  }, [originalData, columnFilterValues]);

  useEffect(() => {
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

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate =
        !allColumnsVisible && !allColumnsHidden;
    }
  }, [allColumnsVisible, allColumnsHidden]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      const filteredData = searchTerm !== "" ? filterData() : originalData;
      setRetrievedRawData(filteredData);
    }, 10);

    // const debounce = setTimeout(() => {
    //   if (searchTerm !== "") {
    //     const filteredData = filterData();
    //     setRetrievedRawData(filteredData);
    //   }
    // }
    // , 300);

    return () => clearTimeout(debounce);
  }, [searchTerm, refreshKey]);

  const areFiltersApplied = (gridApi) => {
    const filterModel = gridApi.getFilterModel();
    return Object.keys(filterModel).length > 0;
  };

  const removeUri = () => {
    if (
      columnList.length !== 0 ||
      Object.keys(columnFilterValues).length !== 0
    ) {
      navigate("/graphs/aaa-outages-rawdata");
    }
  };

  const [tooltip, setTooltip] = useState({
    show: false,
    x: 0,
    y: 0,
    message: "",
  });

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

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuVisible(false);
    }
  };

  const handleColumnVisibilityChange = useCallback((columnName, isVisible) => {
    if (menuRef && menuRef.current) {
      setScrollPosition(menuRef.current.scrollTop);
    }
    setColumnDefs((currentDefs) => {
      const index = currentDefs.findIndex(
        (colDef) => colDef.headerName === columnName
      );
      if (index !== -1 && currentDefs[index].hide !== !isVisible) {
        // Only update if there's an actual change in visibility
        const newDefs = [...currentDefs];
        newDefs[index] = { ...newDefs[index], hide: !isVisible };
        return newDefs;
      }
      return currentDefs; // No change, return original array
    });
  }, []);

  const selectAllColumns = () => {
    if (menuRef && menuRef.current) {
      setScrollPosition(menuRef.current.scrollTop);
    }
    setColumnDefs((currentDefs) =>
      currentDefs.map((colDef) => ({ ...colDef, hide: false }))
    );
  };

  const unselectAllColumns = () => {
    if (menuRef && menuRef.current) {
      setScrollPosition(menuRef.current.scrollTop);
    }
    setColumnDefs((currentDefs) =>
      currentDefs.map((colDef) => ({ ...colDef, hide: true }))
    );
  };

  const clearFilters = () => {
    gridRef.current.api.setFilterModel(null);
    setSearchTerm("");
    selectAllColumns();
    resetColumnList();
    resetFilterValues();
    removeUri();
    sessionStorage.clear();
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

  const exportToExcel = () => {
    setExcelLoading(true);

    setTimeout(() => {
      const rowData = getCurrentGridData();
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

  const columnSearchOptions = [
    { value: "all", label: "All Columns" },
    ...columnDefs
      // .filter((col) => col.cellDataType === "text")
      .map((col) => ({ value: col.field, label: col.headerName })),
  ];

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

  const onColumnMoved = (event) => {
    if (event.source !== "api") {
      const updatedColumnDefs = gridRef.current.columnApi
        .getAllDisplayedColumns()
        .map((col) => {
          return {
            ...columnDefs.find((def) => def.field === col.colId),
            width: col.actualWidth,
          };
        });
      setColumnDefs(updatedColumnDefs);
    }
  };

  const onFilterChanged = () => {
    if (gridRef.current) {
      const filtersApplied = areFiltersApplied(gridRef.current.api);
      if (filtersApplied) {
        setDetermineFilterButtonStatus("outlined");
        setAgFilter(gridRef.current.api.getFilterModel());
        const filterModel = gridRef.current.api.getFilterModel();
        // Save this filterModel
        saveFilterState(filterModel); // Implement this function to save the state
      }
    }

    setAgFilter(null);
  };

  const saveFilterState = (filterModel) => {
    sessionStorage.setItem("gridFilter", JSON.stringify(filterModel));
  };

  const onGridReady = () => {
    const savedFilterModel = JSON.parse(sessionStorage.getItem("gridFilter"));
    if (savedFilterModel) {
      gridRef.current.api.setFilterModel(savedFilterModel);
    }
    setGridReady(true);
  };

  return (
    <div className="pageWrapperForRawData">
      {tooltip.show && (
        <TooltipOnCursor
          x={tooltip.x}
          y={tooltip.y}
          message={"tooltip.message"}
        />
      )}
      <Header
        masterLoading={masterLoading}
        dateRange={dateRange}
        setValue={setValue}
        handleRefreshClick={handleRefreshClick}
        defaultRefreshIntervalTime={defaultRefreshIntervalTime}
        refreshIntervalTime={refreshIntervalTime}
        setRefreshIntervalTime={setRefreshIntervalTime}
        refreshIntervalInputRef={refreshIntervalInputRef}
      />

      <div key={`wrapper-${refreshKey}`} className="datagridWrapper">
        {masterLoading ? (
          <LoadingSpinnerCentered />
        ) : (
          <div className="datagridWrapper__upper">
            {/* Filter View */}
            <FilterView columnFilterValues={columnFilterValues} />
            <UpperButtons
              isMenuVisible={isMenuVisible}
              refreshKeyForFilter={refreshKeyForFilter}
              determineFilterButtonStatus={determineFilterButtonStatus}
              clearFilters={clearFilters}
              exportToExcel={exportToExcel}
              excelLoading={excelLoading}
              gridReady={gridReady}
              selectedColumn={selectedColumn}
              handleDropdownChange={handleDropdownChange}
              columnSearchOptions={columnSearchOptions}
              searchTerm={searchTerm}
              handleSearchChange={handleSearchChange}
              setIsMenuVisible={setIsMenuVisible}
              columnDefs={columnDefs}
              handleColumnVisibilityChange={handleColumnVisibilityChange}
              selectAllColumns={selectAllColumns}
              unselectAllColumns={unselectAllColumns}
              menuRef={menuRef}
              selectAllRef={selectAllRef}
              allColumnsVisible={allColumnsVisible}
            />

            {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
            <div
              className="datagridWrapper__grid ag-theme-balham"
              style={{
                height:
                  Object.keys(columnFilterValues).length !== 0
                    ? "calc(100% - 15.1rem)"
                    : null,
              }}
            >
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
                onGridReady={() => onGridReady()}
                onColumnMoved={onColumnMoved}
                onFilterChanged={onFilterChanged}
              />
            </div>
            <Footer
              rowsPerPage={rowsPerPage}
              handleRowsPerPage={handleRowsPerPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
