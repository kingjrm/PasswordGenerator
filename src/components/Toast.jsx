import React from 'react';

const Toast = ({ message, show }) => (
  <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded shadow-lg bg-blue-600 text-white text-sm font-medium transition-all duration-300 z-50 ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>{message}</div>
);

export default Toast;
