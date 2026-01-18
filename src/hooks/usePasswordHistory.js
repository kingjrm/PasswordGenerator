import { useState } from 'react';

export default function usePasswordHistory() {
  const [history, setHistory] = useState([]);
  const addPassword = (pwd) => setHistory((h) => [pwd, ...h.slice(0, 19)]);
  const clearHistory = () => setHistory([]);
  return { history, addPassword, clearHistory };
}
