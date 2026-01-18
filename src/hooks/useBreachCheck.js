
import React, { useState } from 'react';

// Mock breach check: flag as breached if password is 'password', '123456', or contains 'qwerty'
export default function useBreachCheck(password) {
  const [breached, setBreached] = useState(false);
  React.useEffect(() => {
    if (!password) return setBreached(false);
    const lower = password.toLowerCase();
    setBreached(
      lower === 'password' ||
      lower === '123456' ||
      lower.includes('qwerty')
    );
  }, [password]);
  return breached;
}
