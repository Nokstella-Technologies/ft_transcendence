import React from 'react';
import './dropdownMenu.css';

const DropdownMenu = ({ label, options, onChange }) => {
  return (
    <div className="dropdown-menu">
      <label>{label}</label>
      <select onChange={onChange}>
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
};

export default DropdownMenu;
