import React from 'react';

const Checkbox = ({ label, checked, onChange, id }) => (
  <label className="flex items-center space-x-2 cursor-pointer select-none">
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="accent-blue-600 w-4 h-4 rounded focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
    />
    <span className="text-gray-800 text-sm">{label}</span>
  </label>
);

export default Checkbox;
