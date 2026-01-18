import React from 'react';

const BreachWarning = ({ breached }) => (
  breached ? (
    <div className="mt-2 text-xs text-red-600 font-semibold flex items-center gap-1">
      <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      This password may have been breached!
    </div>
  ) : null
);

export default BreachWarning;
