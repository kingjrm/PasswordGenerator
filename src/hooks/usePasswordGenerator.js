import { useState, useCallback } from 'react';

const usePasswordGenerator = () => {
  const [options, setOptions] = useState({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState('');

  const generatePassword = useCallback(() => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const nums = '0123456789';
    const syms = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    let chars = '';
    if (options.uppercase) chars += upper;
    if (options.lowercase) chars += lower;
    if (options.numbers) chars += nums;
    if (options.symbols) chars += syms;
    if (!chars) {
      setPassword('');
      setStrength('');
      return;
    }
    const array = new Uint32Array(options.length);
    window.crypto.getRandomValues(array);
    let pwd = '';
    for (let i = 0; i < options.length; i++) {
      pwd += chars[array[i] % chars.length];
    }
    setPassword(pwd);
    evaluateStrength(pwd);
  }, [options]);

  const evaluateStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score >= 5) setStrength('Strong');
    else if (score >= 3) setStrength('Medium');
    else setStrength('Weak');
  };

  const updateOption = (key, value) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  return {
    options,
    password,
    strength,
    setOptions,
    updateOption,
    generatePassword,
  };
};

export default usePasswordGenerator;
