import React from "react";

export const FilterView = ({ columnFilterValues }) => {
  return (
    Object.keys(columnFilterValues).length !== 0 && (
      <React.Fragment>
        <div className="datagridWrapper__filters">
          <h3>Selected Filters</h3>
          <div>
            <ol>
              {Object.keys(columnFilterValues).map((item, id) => {
                return (
                  <li key={id}>
                    <strong>{`${item}:`} </strong> {columnFilterValues[item]}
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </React.Fragment>
    )
  );
};
