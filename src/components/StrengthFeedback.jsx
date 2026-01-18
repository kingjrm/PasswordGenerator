import React from 'react';

const StrengthFeedback = ({ strength }) => {
  let message = '';
  let color = '';
  switch (strength) {
    case 'Strong':
      message = 'Great! Your password is strong.';
      color = 'text-green-600';
      break;
    case 'Medium':
      message = 'Not bad, but you can make it stronger!';
      color = 'text-yellow-600';
      break;
    case 'Weak':
      message = 'This password is weak. Try adding more variety!';
      color = 'text-red-600';
      break;
    default:
      message = '';
      color = 'text-gray-400';
  }
  return message ? (
    <div className={`mt-2 text-center font-semibold text-base transition-colors duration-300 ${color}`}>{message}</div>
  ) : null;
};

export default StrengthFeedback;
