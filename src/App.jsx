import React, { useEffect, useState } from 'react';
import usePasswordGenerator from './hooks/usePasswordGenerator';
import PasswordStrengthBar from './components/PasswordStrengthBar';
import IconButton from './components/IconButton';
import Checkbox from './components/Checkbox';
import RangeSlider from './components/RangeSlider';
import { copyToClipboard } from './utils/clipboard';
import { FaCopy, FaRedo } from 'react-icons/fa';
import './styles/tailwind.css';

const App = () => {
  const {
    options,
    password,
    strength,
    updateOption,
    generatePassword,
  } = usePasswordGenerator();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generatePassword();
    // eslint-disable-next-line
  }, [options]);

  const handleCopy = async () => {
    if (password) {
      await copyToClipboard(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">Secure Password Generator</h1>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={password}
            readOnly
            className="flex-1 px-3 py-2 border rounded font-mono text-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            aria-label="Generated password"
          />
          <IconButton
            icon={copied ? <span className="text-green-500">✔</span> : <FaCopy />}
            label="Copy password"
            onClick={handleCopy}
            className={copied ? 'bg-green-100' : 'bg-blue-100 hover:bg-blue-200'}
          />
          <IconButton
            icon={<FaRedo />}
            label="Regenerate password"
            onClick={generatePassword}
            className="bg-gray-100 hover:bg-gray-200"
          />
        </div>
        <PasswordStrengthBar strength={strength} />
        <div className="grid grid-cols-2 gap-4">
          <Checkbox
            id="uppercase"
            label="Uppercase"
            checked={options.uppercase}
            onChange={e => updateOption('uppercase', e.target.checked)}
          />
          <Checkbox
            id="lowercase"
            label="Lowercase"
            checked={options.lowercase}
            onChange={e => updateOption('lowercase', e.target.checked)}
          />
          <Checkbox
            id="numbers"
            label="Numbers"
            checked={options.numbers}
            onChange={e => updateOption('numbers', e.target.checked)}
          />
          <Checkbox
            id="symbols"
            label="Symbols"
            checked={options.symbols}
            onChange={e => updateOption('symbols', e.target.checked)}
          />
        </div>
        <RangeSlider
          min={8}
          max={32}
          value={options.length}
          onChange={e => updateOption('length', Number(e.target.value))}
          label="Password Length"
        />
        <div className="text-center text-xs text-gray-400 mt-2">
          Passwords are generated using the browser's cryptographically secure random number generator.
        </div>
      </div>
    </div>
  );
};

export default App;
