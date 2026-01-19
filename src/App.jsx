import React, { useEffect, useState } from 'react';
import usePasswordGenerator from './hooks/usePasswordGenerator';
import usePasswordHistory from './hooks/usePasswordHistory';
import useBreachCheck from './hooks/useBreachCheck';
import useDarkMode from './hooks/useDarkMode';
import useToast from './hooks/useToast';
import { calculateEntropy } from './utils/entropy';
import PasswordStrengthBar from './components/PasswordStrengthBar';
import IconButton from './components/IconButton';
import RangeSlider from './components/RangeSlider';
import Panel from './components/Panel';
import SectionTitle from './components/SectionTitle';
import VerticalDivider from './components/VerticalDivider';
import Tooltip from './components/Tooltip';
import Toast from './components/Toast';
import EntropyDisplay from './components/EntropyDisplay';
import CriteriaList from './components/CriteriaList';
import PasswordHistory from './components/PasswordHistory';
import BreachWarning from './components/BreachWarning';
import DarkModeToggle from './components/DarkModeToggle';
import { FaCopy, FaRedo } from 'react-icons/fa';
import { copyToClipboard } from './utils/clipboard';
import './styles/tailwind.css';

const App = () => {
  const {
    options,
    password,
    strength,
    updateOption,
    generatePassword,
    evaluateStrength,
    criteria,
  } = usePasswordGenerator();
  const [customPassword, setCustomPassword] = useState('');
  const [mode, setMode] = useState('random');
  const [keyword, setKeyword] = useState('');
  const [customStrength, setCustomStrength] = useState('');
  const { history, addPassword, clearHistory } = usePasswordHistory();
  const breached = useBreachCheck(customPassword || password);
  const [dark, toggleDark] = useDarkMode();

  // Ensure dark mode class is set on <html> for Tailwind
  useEffect(() => {
    const html = document.documentElement;
    if (dark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [dark]);
  const { show, message, trigger } = useToast();

  useEffect(() => {
    if (mode === 'memorable' && keyword) {
      // Use the keyword and pad with random chars to reach desired length
      let base = keyword;
      let chars = '';
      if (options.uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (options.lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
      if (options.numbers) chars += '0123456789';
      if (options.symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
      if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';
      let remaining = options.length - base.length;
      let arr = new Uint32Array(Math.max(remaining, 0));
      window.crypto.getRandomValues(arr);
      let extra = '';
      for (let i = 0; i < arr.length; i++) {
        extra += chars[arr[i] % chars.length];
      }
      setCustomPassword(base + extra);
    } else {
      setCustomPassword('');
      generatePassword();
    }
    // eslint-disable-next-line
  }, [options, mode, keyword]);

  useEffect(() => {
    if (password) addPassword(password);
    // eslint-disable-next-line
  }, [password]);

  useEffect(() => {
    if (customPassword) {
      setCustomStrength(evaluateStrength(customPassword, true));
    } else {
      setCustomStrength('');
    }
  }, [customPassword, evaluateStrength]);

  const handleCopy = async () => {
    const toCopy = customPassword || password;
    if (toCopy) {
      await copyToClipboard(toCopy);
      trigger('Password copied!');
    }
  };

  // --- Password Analytics calculations ---
  // Calculate entropy for each password in history
  const getCharsetSize = (pwd) => {
    let size = 0;
    if (/[A-Z]/.test(pwd)) size += 26;
    if (/[a-z]/.test(pwd)) size += 26;
    if (/[0-9]/.test(pwd)) size += 10;
    if (/[^A-Za-z0-9]/.test(pwd)) size += 32; // Approximate for symbols
    return size || 26; // fallback to 26 if nothing matches
  };
  const entropies = history.map(pwd => calculateEntropy(pwd.length, getCharsetSize(pwd)));
  const avgEntropy = entropies.length ? (entropies.reduce((a, b) => a + b, 0) / entropies.length) : 0;
  const strongCount = history.filter(pwd => evaluateStrength(pwd, true) === 'Strong').length;
  const veryStrongCount = history.filter(pwd => pwd.length >= 16 && evaluateStrength(pwd, true) === 'Strong').length;
  // Strength distribution
  const dist = { 'Very Strong': 0, 'Strong': 0, 'Medium': 0, 'Weak': 0 };
  history.forEach(pwd => {
    const s = evaluateStrength(pwd, true);
    if (pwd.length >= 16 && s === 'Strong') dist['Very Strong']++;
    else if (s === 'Strong') dist['Strong']++;
    else if (s === 'Medium') dist['Medium']++;
    else dist['Weak']++;
  });

  // Determine current password strength label
  const currentStrength = customPassword ? evaluateStrength(customPassword, true) : strength;
  const currentStrengthLabel = (customPassword || password).length >= 16 && currentStrength === 'Strong' ? 'VERY STRONG' : currentStrength ? currentStrength.toUpperCase() : '';

  return (
    <div className={`min-h-screen w-full font-poppins bg-[#f6f7fb] dark:bg-gray-900`}>
      <header className="w-full bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
          <h1 className="text-base font-semibold text-gray-900 tracking-tight">Secure Password Generator</h1>
          <DarkModeToggle dark={dark} toggle={toggleDark} />
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-10 w-full">
        <div className="flex flex-col md:flex-row gap-10 items-stretch">
          {/* Left column: customization controls */}
          <Panel className="flex-1">
            <h2 className="text-base font-bold text-gray-900 mb-4">Generation Mode</h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8">
              <div className="flex gap-2 mb-5">
                <button
                  className={`px-4 py-2 flex items-center gap-2 font-medium text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${mode === 'random' ? 'text-blue-700 bg-white shadow-sm border border-gray-200' : 'text-gray-500 bg-gray-50 border border-gray-100'}`}
                  onClick={() => setMode('random')}
                  aria-pressed={mode === 'random'}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 17v1a3 3 0 003 3h10a3 3 0 003-3v-1M7 7V6a5 5 0 0110 0v1m-1 4v2m-4-2v2m-4-2v2" /></svg>
                  Random
                </button>
                <button
                  className={`px-4 py-2 flex items-center gap-2 font-medium text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${mode === 'memorable' ? 'text-blue-700 bg-white shadow-sm border border-gray-200' : 'text-gray-500 bg-gray-50 border border-gray-100'}`}
                  onClick={() => setMode('memorable')}
                  aria-pressed={mode === 'memorable'}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
                  Memorable
                </button>
              </div>
              {mode === 'memorable' && (
                <div className="mb-5">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Keyword</label>
                  <input
                    type="text"
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    placeholder="Enter a memorable keyword"
                    className="w-full px-3 py-2 border border-gray-300 rounded font-mono text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
                    aria-label="Memorable keyword"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Password Length</label>
                  <RangeSlider
                    min={8}
                    max={32}
                    value={options.length}
                    onChange={e => updateOption('length', Number(e.target.value))}
                    label="Password Length"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Number of Passwords</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={1}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded font-mono text-xs bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
                  />
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Password Options</h3>
                <div className="grid grid-cols-2 gap-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={options.uppercase} onChange={() => updateOption('uppercase', !options.uppercase)} className="hidden" />
                    <span className={`w-5 h-5 flex items-center justify-center rounded border-2 ${options.uppercase ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'}`}>{options.uppercase && (<svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>)}</span>
                    <span className="text-xs text-gray-700">Uppercase Letters (A-Z)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={options.lowercase} onChange={() => updateOption('lowercase', !options.lowercase)} className="hidden" />
                    <span className={`w-5 h-5 flex items-center justify-center rounded border-2 ${options.lowercase ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'}`}>{options.lowercase && (<svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>)}</span>
                    <span className="text-xs text-gray-700">Lowercase Letters (a-z)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={options.numbers} onChange={() => updateOption('numbers', !options.numbers)} className="hidden" />
                    <span className={`w-5 h-5 flex items-center justify-center rounded border-2 ${options.numbers ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'}`}>{options.numbers && (<svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>)}</span>
                    <span className="text-xs text-gray-700">Numbers (0-9)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={options.symbols} onChange={() => updateOption('symbols', !options.symbols)} className="hidden" />
                    <span className={`w-5 h-5 flex items-center justify-center rounded border-2 ${options.symbols ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'}`}>{options.symbols && (<svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>)}</span>
                    <span className="text-xs text-gray-700">Symbols (!@#$%^&*)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer col-span-2">
                    <input type="checkbox" checked={options.excludeSimilar} onChange={() => updateOption('excludeSimilar', !options.excludeSimilar)} className="hidden" />
                    <span className={`w-5 h-5 flex items-center justify-center rounded border-2 ${options.excludeSimilar ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'}`}>{options.excludeSimilar && (<svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>)}</span>
                    <span className="text-xs text-gray-700">Exclude similar characters (0, O, 1, l, I, |)</span>
                  </label>
                </div>
              </div>
            </div>
          </Panel>
          <VerticalDivider />
          {/* Right column: generated password and strength */}
          <Panel className="flex-1">
            <h2 className="text-base font-bold text-gray-900 mb-4">Generated Passwords</h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${currentStrengthLabel === 'VERY STRONG' ? 'bg-green-50 text-green-600 border-green-200' : currentStrengthLabel === 'STRONG' ? 'bg-green-100 text-green-700 border-green-300' : currentStrengthLabel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' : currentStrengthLabel === 'WEAK' ? 'bg-red-100 text-red-700 border-red-300' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>{currentStrengthLabel}</span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {/* You can add a dynamic time-to-crack estimate here if desired */}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  value={customPassword || password}
                  onChange={e => setCustomPassword(e.target.value)}
                  placeholder="Generated or custom password"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded font-mono text-xs bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
                  aria-label="Password"
                  style={{ fontFamily: 'Poppins, Arial, sans-serif' }}
                  readOnly
                />
                <button
                  onClick={handleCopy}
                  className="ml-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-lg transition text-sm flex items-center gap-2 shadow"
                  aria-label="Copy password"
                >
                  <FaCopy /> Copy
                </button>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                <div className="h-2 rounded-full bg-green-500 transition-all duration-700" style={{ width: '100%' }} />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mb-6">
                <span>Security Strength</span>
                <span>{(customPassword || password) ? `${calculateEntropy((customPassword || password).length, getCharsetSize(customPassword || password)).toFixed(2)} bits entropy` : '--'}</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18" /></svg>
                Password Analytics
              </h3>
              <div className="flex gap-5 mb-5">
                <div className="flex-1 bg-blue-50 border border-blue-100 rounded-lg p-3 flex flex-col items-center">
                  <span className="text-xs text-blue-500 font-medium mb-1">Average Entropy</span>
                  <span className="text-2xl font-bold text-blue-700">{avgEntropy.toFixed(2)} bits</span>
                </div>
                <div className="flex-1 bg-green-50 border border-green-100 rounded-lg p-3 flex flex-col items-center">
                  <span className="text-xs text-green-500 font-medium mb-1">Strong Passwords</span>
                  <span className="text-2xl font-bold text-green-700">{strongCount}/{history.length}</span>
                </div>
              </div>
              <div>
                <span className="block text-xs text-gray-500 mb-2">Strength Distribution</span>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-24 text-xs text-gray-700">Very Strong</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-2 rounded-full bg-green-500" style={{ width: history.length ? `${(dist['Very Strong'] / history.length) * 100}%` : '0%' }} />
                  </div>
                  <span className="text-xs text-gray-700">{dist['Very Strong']}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-24 text-xs text-gray-700">Strong</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-2 rounded-full bg-green-400" style={{ width: history.length ? `${(dist['Strong'] / history.length) * 100}%` : '0%' }} />
                  </div>
                  <span className="text-xs text-gray-700">{dist['Strong']}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-24 text-xs text-gray-700">Medium</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-2 rounded-full bg-yellow-400" style={{ width: history.length ? `${(dist['Medium'] / history.length) * 100}%` : '0%' }} />
                  </div>
                  <span className="text-xs text-gray-700">{dist['Medium']}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-24 text-xs text-gray-700">Weak</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-2 rounded-full bg-red-400" style={{ width: history.length ? `${(dist['Weak'] / history.length) * 100}%` : '0%' }} />
                  </div>
                  <span className="text-xs text-gray-700">{dist['Weak']}</span>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </main>
      <Toast message={message} show={show} />
      <footer className="w-full py-2 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 text-left text-gray-400 dark:text-gray-500 text-xs mt-4 px-4">
        &copy; {new Date().getFullYear()} Secure Password Generator. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
