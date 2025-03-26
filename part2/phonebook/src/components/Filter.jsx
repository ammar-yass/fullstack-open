import React from "react";

const Filter = ({ filterText, onFilterChange }) => (
  <div>
    filter shown with:{" "}
    <input value={filterText} onChange={onFilterChange} />
  </div>
);

export default Filter;
