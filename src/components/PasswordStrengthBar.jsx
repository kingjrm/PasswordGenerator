import React from 'react';

const PasswordStrengthBar = ({ strength }) => {
  const getColor = () => {
    switch (strength) {
      case 'Strong':
        return 'bg-green-500';
      case 'Medium':
        return 'bg-yellow-500';
      case 'Weak':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="w-full h-2 bg-gray-200 rounded mt-2">
      <div
        className={`h-2 rounded transition-all duration-300 ${getColor()}`}
        style={{ width: strength === 'Strong' ? '100%' : strength === 'Medium' ? '66%' : strength === 'Weak' ? '33%' : '0%' }}
      />
    </div>
  );
};

export default PasswordStrengthBar;
