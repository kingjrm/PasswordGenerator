import { useState } from 'react';

export default function useToast() {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const trigger = (msg) => {
    setMessage(msg);
    setShow(true);
    setTimeout(() => setShow(false), 1500);
  };
  return { show, message, trigger };
}
