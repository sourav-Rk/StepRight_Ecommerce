import React, { useState } from "react";

const SalesFilter = ({ onFilterChange }) => {
  const [selectedFilter, setSelectedFilter] = useState("daily");

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedFilter(value);
    onFilterChange(value);
  };

  return (
    <select
      value={selectedFilter}
      onChange={handleChange}
      className="border border-gray-300 p-2 rounded-md"
    >
      <option value="daily">Daily</option>
      <option value="weekly">Weekly</option>
      <option value="monthly">Monthly</option>
      <option value="yearly">Yearly</option>
    </select>
  );
};

export default SalesFilter;