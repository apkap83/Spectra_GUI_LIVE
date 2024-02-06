import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import * as XLSX from "xlsx";

export function useDateParams() {
  // startDate=2023-12-01&endDate=2023-12-10
  const location = useLocation();

  // Parse query parameters
  const searchParams = new URLSearchParams(location.search);
  const startDateQueryParam = searchParams.get("startDate");
  const endDateQueryParam = searchParams.get("endDate");

  // Function to check if a string is a valid date using dayjs
  const isValidDate = (dateStr) => {
    return dayjs(dateStr).isValid();
  };

  // Check if the dates are valid
  const isStartDateValid = isValidDate(startDateQueryParam);
  const isEndDateValid = isValidDate(endDateQueryParam);

  const startDate = isStartDateValid
    ? dayjs(startDateQueryParam).startOf("day")
    : dayjs().subtract(1, "day").startOf("day");

  const endDate = isEndDateValid
    ? dayjs(endDateQueryParam).startOf("day")
    : dayjs().startOf("day");

  return [startDate, endDate];
}

export function disabledDate(current) {
  // Disable dates in the future
  return current && current > dayjs().startOf("day");
}

export function useColumnVisibilityParams() {
  // columns=System%20Found|Network|Alarm%20Day

  const location = useLocation();
  // Parse query parameters
  const searchParams = new URLSearchParams(location.search);
  const initialColumns = searchParams.get("columns")
    ? searchParams.get("columns").split("|").map(decodeURIComponent)
    : [];

  // State to store the current list of columns
  const [columnList, setColumnList] = useState(initialColumns);

  // Effect to update the column list when the URL changes
  useEffect(() => {
    setColumnList(initialColumns);
  }, [location.search]); // Re-run the effect if the URL search parameters change

  // Function to reset the column list
  const resetColumnList = () => {
    setColumnList(initialColumns);
  };

  return { columnList, resetColumnList };
}

export function useFilterColumnByString() {
  // filterColumn_{columnName}=string

  const columnNameRegex = /filterColumn_(.+)$/;

  const location = useLocation();

  // Function to parse and construct initial column filter values
  const parseColumnFilterValues = () => {
    const searchParams = new URLSearchParams(location.search);
    const values = {};

    for (const [key, value] of searchParams.entries()) {
      const match = key.match(columnNameRegex);

      if (match) {
        const columnName = match[1];

        if (!values.hasOwnProperty(columnName)) {
          values[columnName] = [];
        }

        // split value using pipe separator
        const allValues = value.split("|");
        values[columnName].push(...allValues);
      }
    }

    return values;
  };

  // State to store the current filter values
  const [columnFilterValues, setColumnFilterValues] = useState(
    parseColumnFilterValues
  );

  // Effect to update the filter values when the URL changes
  useEffect(() => {
    setColumnFilterValues(parseColumnFilterValues());
  }, [location.search]); // Re-run the effect if the URL search parameters change

  // Function to reset the filter values
  const resetFilterValues = () => {
    setColumnFilterValues({});
  };

  return { columnFilterValues, resetFilterValues };
}

export function applyColumnFilter(setColumnDefs, columnList) {
  if (columnList && columnList.length > 0) {
    let finalList = [];
    setColumnDefs((currentDefs) => {
      const columns = currentDefs.map((colDef) => {
        if (!columnList.includes(colDef.headerName)) {
          colDef["hide"] = true;
        }
        return colDef;
      });

      return [...columns];
    });
  }
}

export const convertToExcel = (rowData) => {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();
  // Convert the data to a worksheet
  const worksheet = XLSX.utils.json_to_sheet(rowData);
  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  // Generate an Excel file
  XLSX.writeFile(workbook, "exported_data.xlsx");
};
