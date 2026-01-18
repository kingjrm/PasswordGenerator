import React from 'react';

const IconButton = ({ icon, label, onClick, className = '', ...props }) => (
  <button
    aria-label={label}
    onClick={onClick}
    className={`flex items-center justify-center p-2 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    {...props}
  >
    {icon}
  </button>
);

export default IconButton;
