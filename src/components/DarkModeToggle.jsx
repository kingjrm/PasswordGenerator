import React from 'react';

const DarkModeToggle = ({ dark, toggle }) => (
  <button
    onClick={toggle}
    aria-label="Toggle dark mode"
    className="ml-auto px-3 py-1 rounded text-xs font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 transition"
  >
    {dark ? (
      <span className="flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
        </svg>
        Dark
      </span>
    ) : (
      <span className="flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07l-1.41-1.41M6.34 6.34L4.93 4.93m12.02 0l-1.41 1.41M6.34 17.66l-1.41 1.41" />
        </svg>
        Light
      </span>
    )}
  </button>
);

export default DarkModeToggle;
