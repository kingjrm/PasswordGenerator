import React from 'react';

const PasswordHistory = ({ history, onClear }) => (
  <div className="mt-4">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-medium text-gray-700">Password History</span>
      <button onClick={onClear} className="text-xs text-blue-600 hover:underline">Clear</button>
    </div>
    <ul className="max-h-32 overflow-y-auto text-xs bg-gray-50 rounded p-2 border border-gray-200">
      {history.length === 0 ? (
        <li className="text-gray-400">No history yet.</li>
      ) : (
        history.map((pwd, idx) => <li key={idx} className="font-mono break-all py-0.5">{pwd}</li>)
      )}
    </ul>
  </div>
);

export default PasswordHistory;
