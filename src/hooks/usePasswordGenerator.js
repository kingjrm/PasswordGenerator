import { useState, useCallback } from 'react';

const usePasswordGenerator = () => {
  const [options, setOptions] = useState({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false,
    customSymbols: '',
  });
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState('');

  const generatePassword = useCallback(() => {
    let upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let lower = 'abcdefghijklmnopqrstuvwxyz';
    let nums = '0123456789';
    let syms = options.customSymbols || '!@#$%^&*()_+-=[]{}|;:,.<>?';
    // Exclude similar characters if option is set
    if (options.excludeSimilar) {
      upper = upper.replace(/[O0I1L]/g, '');
      lower = lower.replace(/[ol]/g, '');
      nums = nums.replace(/[01]/g, '');
    }
    // Exclude ambiguous characters if option is set
    if (options.excludeAmbiguous) {
      syms = syms.replace(/[{}\[\]()/\\'"`~,;:.<>]/g, '');
    }
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
    setStrength(evaluateStrength(pwd));
  }, [options]);

  const evaluateStrength = (pwd, returnOnly = false) => {
    let score = 0;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    let result = '';
    if (score >= 5) result = 'Strong';
    else if (score >= 3) result = 'Medium';
    else result = 'Weak';
    if (returnOnly) return result;
    setStrength(result);
    return result;
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
    evaluateStrength,
  };
};

export default usePasswordGenerator;
