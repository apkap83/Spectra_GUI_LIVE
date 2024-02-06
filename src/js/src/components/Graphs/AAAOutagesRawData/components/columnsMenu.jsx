import React, { useMemo } from "react";

export const ColumnVisibilityMenu = ({
  columnDefs,
  onVisibilityChange,
  onSelectAll,
  onUnselectAll,
  menuRef,
  selectAllRef,
  allColumnsVisible,
}) => {
  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      onSelectAll();
    } else {
      onUnselectAll();
    }
  };

  const ColumnCheckbox = React.memo(({ colDef, onVisibilityChange }) => {
    return (
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
    );
  });

  const columnCheckboxes = useMemo(() => {
    return columnDefs.map((colDef) => (
      <ColumnCheckbox
        key={colDef.field}
        colDef={colDef}
        onVisibilityChange={onVisibilityChange}
      />
    ));
  }, [columnDefs, onVisibilityChange]); // Include necessary dependencies

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
      {columnCheckboxes}
    </div>
  );
};
