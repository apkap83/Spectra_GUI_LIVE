import Button from "@mui/material/Button";
import { ColumnVisibilityMenu } from "./columnsMenu";

export const UpperButtons = ({
  isMenuVisible,
  refreshKeyForFilter,
  determineFilterButtonStatus,
  clearFilters,
  exportToExcel,
  excelLoading,
  gridReady,
  selectedColumn,
  handleDropdownChange,
  columnSearchOptions,
  searchTerm,
  handleSearchChange,
  setIsMenuVisible,
  columnDefs,
  handleColumnVisibilityChange,
  selectAllColumns,
  unselectAllColumns,
  menuRef,
  selectAllRef,
  allColumnsVisible,
}) => {
  return (
    <div className="datagridWrapper__flexContainer">
      <Button
        onClick={() => setIsMenuVisible(!isMenuVisible)}
        className={"datagridWrapper__selectColumnsBtn"}
      >
        Select Columns
      </Button>
      <Button
        key={`filter-${refreshKeyForFilter}`}
        variant={determineFilterButtonStatus}
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
          columnDefs={[...columnDefs]}
          onVisibilityChange={handleColumnVisibilityChange}
          onSelectAll={selectAllColumns}
          onUnselectAll={unselectAllColumns}
          menuRef={menuRef}
          selectAllRef={selectAllRef}
          allColumnsVisible={allColumnsVisible}
        />
      )}
    </div>
  );
};
