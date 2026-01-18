import React from 'react';

const RangeSlider = ({ min, max, value, onChange, label }) => (
  <div className="w-full flex flex-col space-y-1">
    <label className="text-sm text-gray-700 font-medium">{label}</label>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={onChange}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
    />
    <div className="text-xs text-gray-500 text-right">{value}</div>
  </div>
);

export default RangeSlider;
