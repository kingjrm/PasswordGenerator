import React from 'react';
import { strengthGifs } from '../utils/strengthGifs';
import StrengthFeedback from './StrengthFeedback';

const PasswordStrengthBar = ({ strength }) => {
  const getColor = () => {
    switch (strength) {
      case 'Strong':
        return 'bg-green-400';
      case 'Medium':
        return 'bg-yellow-300';
      case 'Weak':
        return 'bg-red-300';
      default:
        return 'bg-gray-200';
    }
  };

  const getGif = () => {
    if (strength === 'Strong') return strengthGifs.Strong;
    if (strength === 'Medium') return strengthGifs.Medium;
    if (strength === 'Weak') return strengthGifs.Weak;
    return strengthGifs.Default;
  };

  return (
    <div className="w-full flex flex-col items-center mt-4">
      <div className="flex flex-col items-center w-full">
        <div className="mb-2 flex flex-col items-center">
          <img
            src={getGif()}
            alt={strength ? `${strength} password` : 'Password strength'}
            className="h-24 w-24 object-contain transition-all duration-700"
            style={{}}
          />
          <span className={`mt-2 text-lg font-bold tracking-wide ${strength === 'Strong' ? 'text-green-600' : strength === 'Medium' ? 'text-yellow-600' : strength === 'Weak' ? 'text-red-600' : 'text-gray-400'}`}>
            {strength ? `${strength} Password` : 'Password Strength'}
          </span>
        </div>
        <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
          <div
            className={`h-4 rounded-full transition-all duration-700 ease-in-out ${getColor()}`}
            style={{ width: strength === 'Strong' ? '100%' : strength === 'Medium' ? '66%' : strength === 'Weak' ? '33%' : '0%' }}
          />
        </div>
      </div>
      <StrengthFeedback strength={strength} />
    </div>
  );
};

export default PasswordStrengthBar;
