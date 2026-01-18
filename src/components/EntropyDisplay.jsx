import React from 'react';

const EntropyDisplay = ({ entropy }) => (
  <div className="text-xs text-gray-500 mt-1">Entropy: <span className="font-mono">{entropy.toFixed(2)} bits</span></div>
);

export default EntropyDisplay;
