import { useState } from 'react';

export default function useDarkMode() {
  const [dark, setDark] = useState(false);
  const toggle = () => setDark((d) => !d);
  return [dark, toggle];
}
